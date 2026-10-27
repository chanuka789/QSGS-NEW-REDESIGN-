"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { COUNTRY_SHAPES, LAND_DOTS } from "@/lib/globe-data";
import { workingCountries, type WorkingCountry } from "@/lib/site";

const R = 1.6;
const BRAND = "#046492";
const BRAND_DARK = "#034a6c";
// View centre: puts the Gulf + Sri Lanka in front while the UK and Australia stay visible.
const CENTER = { lat: 8, lng: 66 };
const DEG = Math.PI / 180;

function toVec(lat: number, lng: number, r = R, out = new THREE.Vector3()) {
  const phi = (90 - lat) * DEG;
  const theta = (lng + 180) * DEG;
  return out.set(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Land dots ---------------- */
function LandDots() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = LAND_DOTS.length / 2;
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      toVec(LAND_DOTS[i * 2] / 10, LAND_DOTS[i * 2 + 1] / 10, R + 0.001, v);
      o.position.copy(v);
      o.lookAt(0, 0, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.0095, 6]} />
      <meshBasicMaterial color="#9aa8b3" side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

/* ---------------- Highlighted countries (exact borders) ---------------- */
type V2 = THREE.Vector2;

function useCountryGeometry() {
  return useMemo(() => {
    const fill: number[] = [];
    const outline: number[] = [];
    const v = new THREE.Vector3();
    const push = (arr: number[], p: V2, r: number) => {
      toVec(p.y, p.x, r, v);
      arr.push(v.x, v.y, v.z);
    };
    // Split large triangles so the fill hugs the sphere instead of cutting through it.
    const subdivide = (a: V2, b: V2, c: V2, depth = 0) => {
      const max = Math.max(a.distanceTo(b), b.distanceTo(c), c.distanceTo(a));
      if (max > 1.2 && depth < 6) {
        const ab = a.clone().lerp(b, 0.5), bc = b.clone().lerp(c, 0.5), ca = c.clone().lerp(a, 0.5);
        subdivide(a, ab, ca, depth + 1);
        subdivide(ab, b, bc, depth + 1);
        subdivide(ca, bc, c, depth + 1);
        subdivide(ab, bc, ca, depth + 1);
        return;
      }
      push(fill, a, R * 1.0012);
      push(fill, b, R * 1.0012);
      push(fill, c, R * 1.0012);
    };
    for (const country of COUNTRY_SHAPES) {
      for (const poly of country.polygons) {
        const rings = poly.map((flat) => {
          const pts: V2[] = [];
          for (let i = 0; i < flat.length; i += 2) pts.push(new THREE.Vector2(flat[i], flat[i + 1]));
          return pts;
        });
        const [outer, ...holes] = rings;
        const all = outer.concat(...holes);
        for (const [i, j, k] of THREE.ShapeUtils.triangulateShape(outer, holes)) subdivide(all[i], all[j], all[k]);
        for (const ring of rings) {
          for (let i = 0; i < ring.length; i++) {
            push(outline, ring[i], R * 1.0022);
            push(outline, ring[(i + 1) % ring.length], R * 1.0022);
          }
        }
      }
    }
    const fillGeo = new THREE.BufferGeometry();
    fillGeo.setAttribute("position", new THREE.Float32BufferAttribute(fill, 3));
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(outline, 3));
    return { fillGeo, lineGeo };
  }, []);
}

function Countries() {
  const { fillGeo, lineGeo } = useCountryGeometry();
  return (
    <>
      <mesh geometry={fillGeo}>
        <meshBasicMaterial color={BRAND} side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={-1} />
      </mesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={BRAND_DARK} />
      </lineSegments>
    </>
  );
}

/* ---------------- Arcs from Sri Lanka ---------------- */
function arcPoints(from: WorkingCountry, to: WorkingCountry, n = 64) {
  const a = toVec(from.lat, from.lng, 1).normalize();
  const b = toVec(to.lat, to.lng, 1).normalize();
  const angle = a.angleTo(b);
  const lift = Math.min(0.16, 0.035 + angle * 0.1);
  const q1 = new THREE.Quaternion();
  const qb = new THREE.Quaternion().setFromUnitVectors(a, b);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    q1.identity().slerp(qb, t);
    pts.push(a.clone().applyQuaternion(q1).multiplyScalar(R * (1.003 + lift * Math.sin(Math.PI * t))));
  }
  return pts;
}

function Arcs() {
  const hub = workingCountries.find((c) => c.hub)!;
  const arcs = useMemo(() => workingCountries.filter((c) => !c.hub).map((c) => arcPoints(hub, c)), [hub]);
  const curves = useMemo(() => arcs.map((p) => new THREE.CatmullRomCurve3(p)), [arcs]);
  const comets = useRef<(THREE.Mesh | null)[]>([]);
  const still = useMemo(() => reduceMotion(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (still) return;
    comets.current.forEach((m, i) => {
      if (!m) return;
      const t = (clock.elapsedTime * 0.28 + i * 0.37) % 1;
      curves[i].getPointAt(t, tmp);
      m.position.copy(tmp);
      m.scale.setScalar(0.4 + Math.sin(Math.PI * t) * 0.8);
    });
  });

  return (
    <>
      {arcs.map((pts, i) => (
        <Line key={i} points={pts} color={BRAND} lineWidth={1.4} transparent opacity={0.55} />
      ))}
      {!still &&
        arcs.map((_, i) => (
          <mesh key={`c${i}`} ref={(el) => { comets.current[i] = el; }}>
            <sphereGeometry args={[0.016, 12, 12]} />
            <meshBasicMaterial color={BRAND} />
          </mesh>
        ))}
    </>
  );
}

/* ---------------- Markers ---------------- */
function Marker({ c }: { c: WorkingCountry }) {
  const pos = useMemo(() => toVec(c.lat, c.lng, R * 1.004), [c]);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const still = useMemo(() => reduceMotion(), []);
  useFrame(({ clock }) => {
    if (!c.hub || still) return;
    rings.current.forEach((m, i) => {
      if (!m) return;
      const t = (clock.elapsedTime * 0.6 + i * 0.5) % 1;
      m.scale.setScalar(1 + t * 2.6);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - t);
    });
  });
  return (
    <group position={pos} quaternion={q}>
      <mesh>
        <circleGeometry args={[c.hub ? 0.022 : 0.02, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.0005]}>
        <circleGeometry args={[c.hub ? 0.014 : 0.012, 24]} />
        <meshBasicMaterial color={c.hub ? BRAND : BRAND_DARK} />
      </mesh>
      {c.hub &&
        [0, 1].map((i) => (
          <mesh key={i} ref={(el) => { rings.current[i] = el; }} position={[0, 0, 0.001]}>
            <ringGeometry args={[0.022, 0.027, 40]} />
            <meshBasicMaterial color={BRAND} transparent opacity={0.5} side={THREE.DoubleSide} />
          </mesh>
        ))}
    </group>
  );
}

/* ---------------- Globe + label tracking ---------------- */
function Globe({ labels }: { labels: MutableRefObject<(HTMLDivElement | null)[]> }) {
  const spin = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, offset: 0, lastX: 0 });
  const gl = useThree((s) => s.gl);

  // Horizontal drag rotates the globe; vertical swipes still scroll the page on touch screens.
  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current.active = true;
      drag.current.lastX = e.clientX;
    };
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d.active) return;
      d.offset = Math.max(-1.6, Math.min(1.6, d.offset + (e.clientX - d.lastX) * 0.006));
      d.lastX = e.clientX;
    };
    const up = () => {
      drag.current.active = false;
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl]);
  const base = useMemo(() => {
    const v = toVec(0, CENTER.lng, 1);
    return -Math.atan2(v.x, v.z);
  }, []);
  const anchors = useMemo(() => workingCountries.map((c) => toVec(c.lat, c.lng, R * 1.004)), []);
  const still = useMemo(() => reduceMotion(), []);
  const tmp = useMemo(() => ({ w: new THREE.Vector3(), n: new THREE.Vector3(), c: new THREE.Vector3() }), []);

  useFrame(({ clock, camera, size }, dt) => {
    const g = spin.current;
    if (!g) return;
    const d = drag.current;
    if (!d.active) d.offset = THREE.MathUtils.damp(d.offset, 0, 1.4, dt);
    const sway = still ? 0 : Math.sin(clock.elapsedTime * 0.25) * 0.12;
    g.rotation.y = base + sway + d.offset;
    g.updateMatrixWorld();

    // Project each country anchor to screen space and fade labels on the far side.
    const k = Math.min(1, Math.max(0.62, size.width / 560));
    anchors.forEach((a, i) => {
      const el = labels.current[i];
      if (!el) return;
      tmp.w.copy(a).applyMatrix4(g.matrixWorld);
      tmp.n.copy(tmp.w).normalize();
      tmp.c.copy(camera.position).sub(tmp.w).normalize();
      const alpha = Math.min(1, Math.max(0, (tmp.n.dot(tmp.c) + 0.02) / 0.16));
      tmp.w.project(camera);
      const x = (tmp.w.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.w.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = alpha.toFixed(2);
      el.style.visibility = alpha < 0.02 ? "hidden" : "visible";
      el.style.setProperty("--k", k.toFixed(3));
    });
  });

  return (
    <group rotation={[CENTER.lat * DEG, 0, 0]}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[R, 96, 96]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <LandDots />
        <Countries />
        <Arcs />
        {workingCountries.map((c) => (
          <Marker key={c.code} c={c} />
        ))}
      </group>
      {/* hairline outline of the sphere */}
      <mesh scale={1.006}>
        <sphereGeometry args={[R, 96, 96]} />
        <meshBasicMaterial color="#d9e0e6" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function CountryLabel({ c, setRef }: { c: WorkingCountry; setRef: (el: HTMLDivElement | null) => void }) {
  const [dx, dy] = c.label;
  const shift = dx < -6 ? "-100%" : dx > 6 ? "0%" : "-50%";
  return (
    <div ref={setRef} className="absolute left-0 top-0 will-change-transform" style={{ opacity: 0, visibility: "hidden" }}>
      <svg width="1" height="1" className="absolute left-0 top-0 overflow-visible" style={{ transform: "scale(var(--k, 1))", transformOrigin: "0 0" }} aria-hidden>
        <line x1="0" y1="0" x2={dx} y2={dy} stroke={c.hub ? BRAND : "#8aa0ae"} strokeWidth="1" />
      </svg>
      <span
        className={
          c.hub
            ? "t-xs absolute whitespace-nowrap rounded-full bg-brand px-2.5 py-1 font-medium text-white"
            : "t-xs absolute whitespace-nowrap rounded-full bg-white px-2.5 py-1 font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line),0_2px_8px_-4px_rgba(17,28,36,0.25)]"
        }
        style={{ left: `calc(var(--k, 1) * ${dx}px)`, top: `calc(var(--k, 1) * ${dy}px)`, transform: `translate(${shift}, -50%)` }}
      >
        {c.name}
      </span>
    </div>
  );
}

export default function GlobeScene({ active = true }: { active?: boolean }) {
  const labels = useRef<(HTMLDivElement | null)[]>([]);
  return (
    <div className="relative h-full w-full cursor-grab select-none [touch-action:pan-y] active:cursor-grabbing [&_canvas]:[touch-action:pan-y]">
      <Canvas flat frameloop={active ? "always" : "never"} dpr={[1, 1.5]} camera={{ position: [0, 0, 5.6], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }} aria-hidden>
        <Globe labels={labels} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {workingCountries.map((c, i) => (
          <CountryLabel key={c.code} c={c} setRef={(el) => { labels.current[i] = el; }} />
        ))}
      </div>
    </div>
  );
}
