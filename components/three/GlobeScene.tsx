"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LAND_POINTS } from "@/lib/land-points";
import { markets, offices } from "@/lib/site";

const R = 1.6;

function toVec(lat: number, lng: number, r = R) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

function LandDots() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = LAND_POINTS.length / 2;
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const v = toVec(LAND_POINTS[i * 2], LAND_POINTS[i * 2 + 1], R + 0.002);
      o.position.copy(v);
      o.lookAt(0, 0, 0);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.0105, 6]} />
      <meshBasicMaterial color="#111c24" transparent opacity={0.32} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

function Arc({ from, to, delay }: { from: THREE.Vector3; to: THREE.Vector3; delay: number }) {
  const lineRef = useRef<THREE.Line>(null);
  const { geometry, total } = useMemo(() => {
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const lift = 1 + from.distanceTo(to) * 0.32;
    mid.normalize().multiplyScalar(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = curve.getPoints(64);
    return { geometry: new THREE.BufferGeometry().setFromPoints(pts), total: pts.length };
  }, [from, to]);
  const line = useMemo(() => new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#046492", transparent: true, opacity: 0.85 })), [geometry]);
  useFrame(({ clock }) => {
    const t = ((clock.elapsedTime * 0.35 + delay) % 2) / 2; // 0..1 loop
    const draw = Math.min(1, t * 2);
    const start = Math.max(0, t * 2 - 1);
    geometry.setDrawRange(Math.floor(start * total), Math.max(2, Math.floor((draw - start) * total)));
  });
  return <primitive object={line} ref={lineRef} />;
}

function Marker({ pos, office }: { pos: THREE.Vector3; office?: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const q = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos]);
  useFrame(({ clock }) => {
    if (!ring.current) return;
    const s = 1 + ((clock.elapsedTime * 0.8 + pos.x) % 1) * 2.2;
    ring.current.scale.setScalar(s);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - (s - 1) / 2.2);
  });
  return (
    <group position={pos} quaternion={q}>
      <mesh>
        <circleGeometry args={[office ? 0.034 : 0.022, 20]} />
        <meshBasicMaterial color={office ? "#046492" : "#7f97a6"} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring} position={[0, 0, 0.001]}>
        <ringGeometry args={[0.03, 0.04, 32]} />
        <meshBasicMaterial color="#046492" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Globe() {
  const group = useRef<THREE.Group>(null);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const officeVecs = useMemo(() => offices.map((o) => toVec(o.lat, o.lng, R + 0.01)), []);
  const marketVecs = useMemo(() => markets.map((m) => toVec(m.lat, m.lng, R + 0.01)), []);
  const hub = officeVecs[3]; // Sri Lanka delivery hub
  const drag = useRef({ active: false, x: 0, vel: 0 });

  useEffect(() => {
    const el = document.getElementById("globe-canvas");
    if (!el) return;
    const down = (e: PointerEvent) => { drag.current.active = true; drag.current.x = e.clientX; };
    const move = (e: PointerEvent) => {
      if (!drag.current.active) return;
      drag.current.vel = (e.clientX - drag.current.x) * 0.005;
      drag.current.x = e.clientX;
    };
    const up = () => { drag.current.active = false; };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  useFrame((_, dt) => {
    if (!group.current) return;
    const d = drag.current;
    group.current.rotation.y += d.vel + (reduce ? 0 : dt * 0.12);
    d.vel *= 0.92;
  });

  return (
    <group rotation={[0.35, -1.6, 0]}>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[R, 64, 64]} />
          <meshStandardMaterial color="#f3f6f8" roughness={0.9} />
        </mesh>
        <LandDots />
        {marketVecs.map((v, i) => (
          <Marker key={`m${i}`} pos={v} />
        ))}
        {officeVecs.map((v, i) => (
          <Marker key={`o${i}`} pos={v} office />
        ))}
        {[...officeVecs.slice(0, 3), ...marketVecs.slice(1, 7)].map((v, i) => (
          <Arc key={i} from={hub} to={v} delay={i * 0.45} />
        ))}
      </group>
    </group>
  );
}

export default function GlobeScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      id="globe-canvas"
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y", cursor: "grab" }}
      aria-hidden
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-3, 3, 4]} intensity={1.2} />
      <Globe />
    </Canvas>
  );
}
