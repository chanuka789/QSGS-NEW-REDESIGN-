"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Photographic 3D hero: the real render plus a depth map (Depth Anything V2)
 * and relighting masks, so one image can play morning, rain and night scenes.
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
uniform sampler2D uDepth;   // R depth · G water · B foliage
uniform sampler2D uMask;    // R sky · G windows · B terrace lights · A ground
uniform vec2 uCover;        // visible portion of the image (cover fit)
uniform vec2 uFocal;        // image point kept centred
uniform vec2 uOffset;       // camera offset (pointer / drift)
uniform vec2 uRes;          // canvas size in px
uniform float uZoom;
uniform float uFocus;       // depth plane that stays still
uniform float uTime;
uniform float uMotion;      // 0 = still (reduced motion), 1 = animated
uniform float uNight;       // 0 day → 1 night
uniform float uRain;        // 0 dry → 1 rain

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

// Falling rain streaks in screen space. One layer = one depth band.
float rainLayer(vec2 uv, float cols, float speed, float len, float width, float seed, float t) {
  uv.x += uv.y * 0.16;                       // wind slant
  vec2 q = vec2(uv.x * cols, uv.y * cols * 0.12 + t * speed + seed);
  vec2 id = floor(q); vec2 f = fract(q);
  float h = hash(id + seed);
  if (h < 0.35) return 0.0;                  // not every cell carries a drop
  float x = abs(f.x - (0.15 + 0.7 * hash(id.yx + seed)));
  float y = fract(f.y + h * 3.0);
  return smoothstep(width, 0.0, x) * smoothstep(0.0, 0.05, y) * smoothstep(len, len * 0.3, y);
}

// Expanding rings where drops hit water / wet stone.
float ripples(vec2 p, float t) {
  vec2 g = p * vec2(70.0, 120.0);            // foreshortened grid
  vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float h = hash(id);
  float ph = fract(t * 0.9 + h);
  float r = length(f * vec2(1.0, 1.6));
  return (1.0 - ph) * smoothstep(0.05, 0.0, abs(r - ph * 0.45)) * step(0.45, h);
}

void main() {
  vec2 base = uFocal + (vUv - 0.5) * uCover / uZoom;
  base.y = 1.0 - base.y;

  // Depth parallax: fixed-point iteration finds the source pixel for this screen position.
  vec2 p = base;
  for (int i = 0; i < 5; i++) {
    float d = texture2D(uDepth, p).r;
    p = base - uOffset * (d - uFocus);
  }
  p = clamp(p, 0.001, 0.999);

  vec3 m = texture2D(uDepth, p).rgb;
  float depth = m.r, water = m.g, leaf = m.b;
  float t = uTime * uMotion;
  float rain = uRain, night = uNight;

  // Water: travelling ripples (stronger in wind and rain), foliage: wind sway.
  float wind = 1.0 + rain * 1.6;
  p += water * vec2(sin(p.y * 260.0 + t * 1.7) * 0.0007 + sin(p.x * 70.0 - t * 0.9) * 0.0004, cos(p.x * 180.0 + t * 1.3) * 0.0005) * (1.0 + rain);
  p += leaf * wind * vec2(sin(t * 0.85 + p.y * 14.0) * 0.0014 + sin(t * 1.9 + p.x * 40.0) * 0.0004, cos(t * 0.7 + p.x * 11.0) * 0.0009);

  vec3 src = texture2D(uColor, p).rgb;
  vec4 k = texture2D(uMask, p);
  float sky = k.r, windows = k.g, terrace = k.b, ground = k.a;
  float lum = dot(src, vec3(0.2126, 0.7152, 0.0722));
  vec3 col = src;

  // Sun glints on calm water (clear day only).
  float glint = water * smoothstep(0.75, 1.0, sin(p.x * 340.0 + t * 2.2) * sin(p.y * 520.0 - t * 1.6));
  col += glint * 0.035 * (1.0 - rain) * (1.0 - night);

  // ---------- Rain grade: overcast light, softer contrast, cooler tone ----------
  vec3 overcast = mix(vec3(lum), src, 0.5) * vec3(0.84, 0.88, 0.95);
  overcast = mix(overcast, vec3(0.6, 0.64, 0.69), 0.16);
  col = mix(col, overcast, rain);

  // ---------- Night grade: moonlit blue, deep shadows ----------
  vec3 moon = pow(col, vec3(1.35)) * vec3(0.17, 0.2, 0.33);
  col = mix(col, moon, night);

  // ---------- Sky ----------
  float h = 1.0 - p.y;                                   // 0 bottom → 1 top of image
  vec3 cloudDay = mix(vec3(0.6, 0.64, 0.69), vec3(0.78, 0.81, 0.85), fbm(p * vec2(3.0, 7.0) + vec2(t * 0.012, 0.0)));
  vec3 nightClear = mix(vec3(0.09, 0.09, 0.16), vec3(0.015, 0.03, 0.085), smoothstep(0.35, 0.95, h));
  nightClear += vec3(0.22, 0.12, 0.08) * smoothstep(0.62, 0.4, h) * 0.6; // city glow on the horizon
  vec2 sg = p * vec2(220.0, 220.0);
  float star = step(0.985, hash(floor(sg))) * smoothstep(0.32, 0.0, length(fract(sg) - 0.5));
  star *= 0.6 + 0.4 * sin(t * 2.0 + hash(floor(sg)) * 30.0);
  nightClear += star * smoothstep(0.45, 0.7, h) * 0.9;
  vec3 nightCloud = mix(vec3(0.05, 0.06, 0.09), vec3(0.12, 0.12, 0.15), fbm(p * vec2(3.0, 7.0) + vec2(t * 0.015, 0.0)));
  vec3 skyCol = mix(mix(src, cloudDay, rain), mix(nightClear, nightCloud, rain), night);
  col = mix(col, skyCol, sky);

  // ---------- Night lights ----------
  // Apartment windows: each unit switches on at its own moment as night falls.
  vec2 cell = floor(p * vec2(38.0, 34.0));
  float wh = hash(cell);
  float on = smoothstep(wh * 0.85, wh * 0.85 + 0.12, night) * step(0.22, hash(cell + 7.3));
  vec3 lampWarm = mix(vec3(1.0, 0.62, 0.3), vec3(1.0, 0.78, 0.52), hash(cell + 3.1));
  // Interior light keeps the glass/railing detail of the original render.
  float wm = smoothstep(0.04, 0.45, windows);
  col += wm * on * lampWarm * (0.3 + 0.7 * lum) * 1.05;
  // Soft spill of that light onto the surrounding stone (4 nearby mask taps).
  vec2 px = vec2(0.006, 0.005);
  float spill = smoothstep(0.0, 0.3, (texture2D(uMask, p + px).g + texture2D(uMask, p - px).g + texture2D(uMask, p + px * vec2(1.0, -1.0)).g + texture2D(uMask, p - px * vec2(1.0, -1.0)).g) * 0.25);
  col += spill * on * src * vec3(0.55, 0.33, 0.16) * 0.55 * night;

  // Skyline: distant towers get scattered lit floors.
  float far = (1.0 - smoothstep(0.004, 0.012, depth)) * (1.0 - sky);
  vec2 cg = floor(p * vec2(260.0, 420.0));
  col += far * step(0.9, hash(cg)) * vec3(1.0, 0.8, 0.55) * 0.55 * night * (1.0 - rain * 0.5);

  // Restaurant terrace + lobby: warm lamp light over the real textures.
  col = mix(col, src * vec3(1.05, 0.68, 0.38) * 0.95, terrace * night * 0.9);

  // Marina at night: warm light streaks where the water already reflected the building.
  float refl = smoothstep(0.5, 0.85, lum) * water;
  float shimmer = 0.6 + 0.4 * sin(p.y * 600.0 + t * 3.0 + sin(p.x * 80.0));
  col += refl * shimmer * vec3(1.0, 0.62, 0.3) * 0.32 * night;

  // ---------- Rain details ----------
  // Wet stone: darker, glossier, picks up light from the sky / lamps.
  vec3 sheen = mix(vec3(0.07, 0.08, 0.1), vec3(0.18, 0.11, 0.06), night);
  col = mix(col, col * 0.78 + sheen * (0.5 + 0.5 * noise(p * vec2(40.0, 4.0))), ground * rain * 0.85);
  float rr = ripples(p, t);
  col += rr * (water + ground * 0.35) * rain * mix(vec3(0.16), vec3(0.22, 0.15, 0.09), night);
  // Atmospheric haze: far things fade into the rain.
  vec3 fog = mix(vec3(0.66, 0.69, 0.73), vec3(0.08, 0.09, 0.12), night);
  col = mix(col, fog, rain * 0.32 * (1.0 - smoothstep(0.0, 0.45, depth)) * (1.0 - sky));

  // Falling rain: three depth layers, in screen space.
  vec2 suv = vec2(vUv.x * uRes.x / uRes.y, 1.0 - vUv.y);
  float drops = rainLayer(suv, 110.0, 9.0, 0.45, 0.04, 1.7, t) * 0.25
              + rainLayer(suv, 65.0, 12.0, 0.55, 0.045, 4.1, t) * 0.4
              + rainLayer(suv, 34.0, 16.0, 0.65, 0.05, 9.3, t) * 0.55;
  col += drops * rain * mix(vec3(0.42, 0.46, 0.52), vec3(0.24, 0.22, 0.21), night);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;

/** Scene keyframes, played in order and looped: each step changes only weather or only time. */
const KEYS = [
  { night: 0, rain: 0 }, // morning
  { night: 0, rain: 1 }, // morning rain
  { night: 1, rain: 1 }, // night rain
  { night: 1, rain: 0 }, // night
];
const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);

/** Scene state at time t (s) for a loop of `cycle` seconds: hold, then a long eased blend to the next key. */
function timeline(t: number, cycle: number) {
  const seg = cycle / KEYS.length;
  const blend = Math.min(seg * 0.48, 3.6);
  const pos = ((t % cycle) + cycle) % cycle;
  const i = Math.floor(pos / seg);
  const local = pos - i * seg;
  const a = KEYS[i];
  const b = KEYS[(i + 1) % KEYS.length];
  const k = smoother(Math.max(0, (local - (seg - blend)) / blend));
  return { night: a.night + (b.night - a.night) * k, rain: a.rain + (b.rain - a.rain) * k };
}

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

function texture(gl: WebGLRenderingContext, unit: number, img: HTMLImageElement, format: number = gl.RGB) {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unit);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export function DepthScene({
  src,
  depthSrc,
  maskSrc,
  night = 0,
  rain = 0,
  cycle,
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
  /** R sky · G windows · B warm lights · A wet ground (relighting masks). */
  maskSrc: string;
  /** Scene targets; the shader eases towards them. */
  night?: number;
  rain?: number;
  /** When set, scenes play automatically on a seamless loop of this many seconds. */
  cycle?: number;
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
  const target = useRef({ night, rain });
  const kickRef = useRef<() => void>(() => {});
  useEffect(() => {
    target.current = { night, rain };
    kickRef.current();
  }, [night, rain]);
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
    const scene = { night: target.current.night, rain: target.current.rain, last: 0 };
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
    for (const n of ["uColor", "uDepth", "uMask", "uCover", "uFocal", "uOffset", "uRes", "uZoom", "uFocus", "uTime", "uMotion", "uNight", "uRain"]) uniforms[n] = gl.getUniformLocation(prog, n);

    const resize = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(uniforms.uRes, cv.width, cv.height);
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
      if (cycle && !reduce) {
        // Continuous timeline: every frame is computed from the clock, so it plays like a video loop.
        const s = timeline(t, cycle);
        scene.night = s.night;
        scene.rain = s.rain;
      } else {
        // Ease towards the target scene (~2.5 s); jump instantly with reduced motion.
        const dt = scene.last ? Math.min(0.1, (now - scene.last) / 1000) : 0;
        scene.last = now;
        const k = reduce ? 1 : 1 - Math.exp(-dt * 1.6);
        scene.night += (target.current.night - scene.night) * k;
        scene.rain += (target.current.rain - scene.rain) * k;
      }
      gl.uniform1f(uniforms.uNight, scene.night);
      gl.uniform1f(uniforms.uRain, scene.rain);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    };
    kickRef.current = kick;

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

    Promise.all([loadImage(colorUrl), loadImage(depthSrc), loadImage(maskSrc)])
      .then(([color, depth, mask]) => {
        if (disposed) return;
        textures.push(texture(gl, 0, color), texture(gl, 1, depth), texture(gl, 2, mask, gl.RGBA));
        gl.uniform1i(uniforms.uColor, 0);
        gl.uniform1i(uniforms.uDepth, 1);
        gl.uniform1i(uniforms.uMask, 2);
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
  }, [colorUrl, depthSrc, maskSrc, focalX, focalY, focus, strength, cycle]);

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-paper-2", className)}>
      {/* Static image: instant first paint (LCP), no-WebGL fallback and SEO. */}
      <Image src={src} alt={alt} fill priority={priority} sizes="(min-width:1024px) 640px, 100vw" quality={85} className="scale-[1.06] object-cover" style={{ objectPosition: `${focalX * 100}% ${focalY * 100}%` }} />
      <canvas ref={canvas} aria-hidden className={cn("absolute inset-0 h-full w-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")} />
    </div>
  );
}
