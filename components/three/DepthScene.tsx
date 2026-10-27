"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Photographic 3D hero: the real render plus a depth map (Depth Anything V2).
 * A WebGL shader shifts each pixel by its depth, so near objects (olive tree,
 * planter) and far ones (tower, skyline) move independently, like looking
 * through a window. The depth texture's G channel marks the marina water
 * (gentle ripple) and B marks foliage (soft wind). Colours are sampled 1:1
 * from the original image, so it looks exactly like the render.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uColor;
uniform sampler2D uDepth;
uniform vec2 uCover;     // visible portion of the image (cover fit)
uniform vec2 uFocal;     // image point kept centred
uniform vec2 uOffset;    // camera offset (pointer / drift)
uniform float uZoom;
uniform float uFocus;    // depth plane that stays still
uniform float uTime;
uniform float uMotion;   // 0 = still (reduced motion), 1 = animated

void main() {
  vec2 base = uFocal + (vUv - 0.5) * uCover / uZoom;
  base.y = 1.0 - base.y;

  // Fixed-point iteration: find the source pixel that lands here after the depth shift.
  vec2 p = base;
  for (int i = 0; i < 5; i++) {
    float d = texture2D(uDepth, p).r;
    p = base - uOffset * (d - uFocus);
  }
  p = clamp(p, 0.001, 0.999);

  vec3 m = texture2D(uDepth, p).rgb;
  float t = uTime * uMotion;

  // Marina water: small travelling ripples.
  float w = m.g;
  p += w * vec2(
    sin(p.y * 260.0 + t * 1.7) * 0.0007 + sin(p.x * 70.0 - t * 0.9) * 0.0004,
    cos(p.x * 180.0 + t * 1.3) * 0.0005
  );

  // Foliage: soft wind sway that grows towards leaf tips.
  float l = m.b;
  p += l * vec2(
    sin(t * 0.85 + p.y * 14.0) * 0.0014 + sin(t * 1.9 + p.x * 40.0) * 0.0004,
    cos(t * 0.7 + p.x * 11.0) * 0.0009
  );

  vec3 col = texture2D(uColor, p).rgb;
  // Sun glints on the water surface (very subtle).
  float glint = w * smoothstep(0.75, 1.0, sin(p.x * 340.0 + t * 2.2) * sin(p.y * 520.0 - t * 1.6));
  col += glint * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader error");
  return s;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function texture(gl: WebGLRenderingContext, unit: number, img: HTMLImageElement) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export function DepthScene({
  src,
  depthSrc,
  alt,
  focalX = 0.5,
  focalY = 0.5,
  focus = 0.42,
  strength = 0.032,
  className,
  priority,
}: {
  src: string;
  depthSrc: string;
  alt: string;
  focalX?: number;
  focalY?: number;
  focus?: number;
  strength?: number;
  className?: string;
  priority?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  // Same optimised file the static <Image> uses on 2x screens, so the browser downloads it once.
  const colorUrl = getImageProps({ src, alt, width: 1280, height: 1280, quality: 85 }).props.src;

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: "high-performance" });
    if (!gl || gl.isContextLost()) return;

    let raf = 0;
    let disposed = false;
    let visible = true;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, active: false, last: 0 };
    let scroll = 0;
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const start = performance.now();
    const textures: (WebGLTexture | null)[] = [];

    const prog = gl.createProgram()!;
    try {
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
    } catch (e) {
      console.warn("[DepthScene]", e);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uColor", "uDepth", "uCover", "uFocal", "uOffset", "uZoom", "uFocus", "uTime", "uMotion"]) uniforms[n] = gl.getUniformLocation(prog, n);

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      const aspect = r.width / Math.max(1, r.height); // image is square
      const cover = aspect > 1 ? [1, 1 / aspect] : [aspect, 1];
      gl.uniform2f(uniforms.uCover, cover[0], cover[1]);
      // keep the focal point inside the image after cover-cropping
      const fx = Math.min(1 - cover[0] / 2, Math.max(cover[0] / 2, focalX));
      const fy = Math.min(1 - cover[1] / 2, Math.max(cover[1] / 2, focalY));
      gl.uniform2f(uniforms.uFocal, fx, fy);
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      const t = (now - start) / 1000;
      // Auto drift when there is no pointer (touch screens) or the pointer is idle.
      if (!pointer.active || now - pointer.last > 4000) {
        pointer.tx = Math.sin(t * 0.21) * 0.55;
        pointer.ty = Math.sin(t * 0.17 + 1.3) * 0.3;
      }
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      gl.uniform2f(uniforms.uOffset, -pointer.x * strength, pointer.y * strength * 0.6 - scroll * 0.03);
      gl.uniform1f(uniforms.uZoom, 1.06 + scroll * 0.05);
      gl.uniform1f(uniforms.uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      pointer.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      pointer.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      pointer.active = true;
      pointer.last = performance.now();
    };
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      scroll = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
      if (reduce) kick();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) kick();
    });
    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    const onVis = () => !document.hidden && kick();

    Promise.all([loadImage(colorUrl), loadImage(depthSrc)])
      .then(([color, depth]) => {
        if (disposed) return;
        textures.push(texture(gl, 0, color), texture(gl, 1, depth));
        gl.uniform1i(uniforms.uColor, 0);
        gl.uniform1i(uniforms.uDepth, 1);
        gl.uniform1f(uniforms.uFocus, focus);
        gl.uniform1f(uniforms.uMotion, reduce ? 0 : 1);
        resize();
        io.observe(el);
        ro.observe(el);
        window.addEventListener("pointermove", onPointer, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        document.addEventListener("visibilitychange", onVis);
        raf = requestAnimationFrame((n) => {
          frame(n);
          setReady(true);
        });
      })
      .catch((e) => console.warn("[DepthScene] textures failed", e));

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      // Free GPU resources but keep the context alive (React may re-run this effect on the same canvas).
      textures.forEach((tx) => gl.deleteTexture(tx));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [colorUrl, depthSrc, focalX, focalY, focus, strength]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-paper-2", className)}>
      {/* Static image: instant first paint (LCP), no-WebGL fallback and SEO. */}
      <Image src={src} alt={alt} fill priority={priority} sizes="(min-width:1024px) 640px, 100vw" quality={85} className="scale-[1.06] object-cover" style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%` }} />
      <canvas ref={canvas} aria-hidden className={cn("absolute inset-0 h-full w-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")} />
    </div>
  );
}
