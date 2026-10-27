"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type BuildingView = "design" | "exploded";

const FLOOR_H = 0.32;
const COLORS = {
  slab: "#f4f6f8",
  glass: "#a7bccb",
  fin: "#dde3e8",
  site: "#f7f8f9",
  grid: "#e4e8ec",
  trunk: "#b7bcc0",
  crown: "#c6cfc3",
  crown2: "#b5c0b2",
  roof: "#ffffff",
  brand: "#046492",
};

type Block = { w: number; d: number; floors: number; x: number; z: number; finStep: number };

const TOWER: Block = { w: 1.25, d: 1.25, floors: 12, x: 0.55, z: -0.35, finStep: 0.16 };
const PODIUM: Block = { w: 1.7, d: 1.25, floors: 3, x: -1.05, z: 0.85, finStep: 0.17 };

/** Vertical timber fins around one storey, merged into a single geometry (one draw call per floor). */
function useFinGeometry(b: Block) {
  return useMemo(() => {
    const parts: THREE.BufferGeometry[] = [];
    const h = FLOOR_H - 0.05;
    const add = (x: number, z: number, rotY: number) => {
      const g = new THREE.BoxGeometry(0.018, h, 0.05);
      g.rotateY(rotY);
      g.translate(x, h / 2 + 0.025, z);
      parts.push(g);
    };
    const nx = Math.floor(b.w / b.finStep);
    const nz = Math.floor(b.d / b.finStep);
    for (let i = 0; i <= nx; i++) {
      const x = -b.w / 2 + (i * b.w) / nx;
      add(x, b.d / 2, 0);
      add(x, -b.d / 2, 0);
    }
    for (let i = 1; i < nz; i++) {
      const z = -b.d / 2 + (i * b.d) / nz;
      add(b.w / 2, z, Math.PI / 2);
      add(-b.w / 2, z, Math.PI / 2);
    }
    return mergeGeometries(parts)!;
  }, [b]);
}

function Building({ b, view, gap }: { b: Block; view: BuildingView; gap: number }) {
  const finGeo = useFinGeometry(b);
  const slabGeo = useMemo(() => new THREE.BoxGeometry(b.w + 0.1, 0.05, b.d + 0.1), [b]);
  const glassGeo = useMemo(() => new THREE.BoxGeometry(b.w - 0.06, FLOOR_H - 0.05, b.d - 0.06), [b]);
  const mats = useMemo(
    () => ({
      slab: new THREE.MeshStandardMaterial({ color: COLORS.slab, roughness: 0.9 }),
      glass: new THREE.MeshPhysicalMaterial({ color: COLORS.glass, roughness: 0.08, metalness: 0.15, transparent: true, opacity: 0.62, clearcoat: 1, clearcoatRoughness: 0.1 }),
      fin: new THREE.MeshStandardMaterial({ color: COLORS.fin, roughness: 0.75 }),
      roof: new THREE.MeshStandardMaterial({ color: COLORS.roof, roughness: 0.9 }),
    }),
    [],
  );
  const refs = useRef<(THREE.Group | null)[]>([]);

  useFrame((_, dt) => {
    refs.current.forEach((g, i) => {
      if (!g) return;
      const target = i * FLOOR_H + (view === "exploded" ? i * gap : 0);
      g.position.y = THREE.MathUtils.damp(g.position.y, target, 4 + (b.floors - i) * 0.12, dt);
    });
  });

  return (
    <group position={[b.x, 0.06, b.z]}>
      {Array.from({ length: b.floors + 1 }).map((_, i) => {
        const roof = i === b.floors;
        return (
          <group key={i} ref={(el) => { refs.current[i] = el; }} position={[0, i * FLOOR_H, 0]}>
            <mesh geometry={slabGeo} material={mats.slab} castShadow receiveShadow position={[0, 0.025, 0]} />
            {!roof && (
              <>
                <mesh geometry={glassGeo} material={mats.glass} position={[0, FLOOR_H / 2 + 0.0, 0]} castShadow />
                <mesh geometry={finGeo} material={mats.fin} castShadow />
              </>
            )}
            {roof && (
              <group position={[0, 0.05, 0]}>
                <mesh material={mats.roof} position={[-b.w * 0.18, 0.09, -b.d * 0.12]} castShadow>
                  <boxGeometry args={[b.w * 0.42, 0.18, b.d * 0.38]} />
                </mesh>
                {/* rooftop pergola frame */}
                <lineSegments position={[b.w * 0.08, 0.2, b.d * 0.05]}>
                  <edgesGeometry args={[new THREE.BoxGeometry(b.w * 0.75, 0.32, b.d * 0.75)]} />
                  <lineBasicMaterial color="#7b8a8f" transparent opacity={0.6} />
                </lineSegments>
                {[-0.3, -0.1, 0.12, 0.32].map((p, k) => (
                  <mesh key={k} position={[b.w * 0.35, 0.07, p * b.d]} castShadow>
                    <icosahedronGeometry args={[0.055, 0]} />
                    <meshStandardMaterial color={k % 2 ? COLORS.crown : COLORS.crown2} flatShading roughness={1} />
                  </mesh>
                ))}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
}

function Trees() {
  const spots = useMemo(
    () => [
      [-2.15, 1.75], [-1.6, 1.9], [-0.55, 1.85], [0.05, 1.7], [0.75, 1.5], [1.55, 1.35], [2.05, 0.6],
      [2.1, -0.4], [1.75, -1.35], [-0.35, 0.35], [-2.2, 0.1], [-2.15, -0.75], [-0.6, -1.55], [0.4, -1.7],
    ] as [number, number][],
    [],
  );
  const crown = useRef<THREE.InstancedMesh>(null);
  const trunk = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const o = new THREE.Object3D();
    const c = new THREE.Color();
    spots.forEach(([x, z], i) => {
      const s = 0.8 + ((i * 37) % 10) / 22;
      o.position.set(x, 0.08 + 0.12 * s, z);
      o.scale.set(1, s, 1);
      o.updateMatrix();
      trunk.current?.setMatrixAt(i, o.matrix);
      o.position.set(x, 0.08 + 0.28 * s, z);
      o.scale.set(s, s * 1.35, s);
      o.updateMatrix();
      crown.current?.setMatrixAt(i, o.matrix);
      crown.current?.setColorAt(i, c.set(i % 3 ? COLORS.crown : COLORS.crown2));
    });
    if (trunk.current) trunk.current.instanceMatrix.needsUpdate = true;
    if (crown.current) {
      crown.current.instanceMatrix.needsUpdate = true;
      if (crown.current.instanceColor) crown.current.instanceColor.needsUpdate = true;
    }
  }, [spots]);
  return (
    <>
      <instancedMesh ref={trunk} args={[undefined, undefined, spots.length]} castShadow>
        <cylinderGeometry args={[0.012, 0.016, 0.24, 6]} />
        <meshStandardMaterial color={COLORS.trunk} roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, spots.length]} castShadow>
        <icosahedronGeometry args={[0.12, 1]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
    </>
  );
}

function Site() {
  const grid = useMemo(() => {
    const pts: number[] = [];
    const W = 5.2, D = 4.4, s = 0.2;
    for (let x = -W / 2; x <= W / 2 + 1e-3; x += s) pts.push(x, 0, -D / 2, x, 0, D / 2);
    for (let z = -D / 2; z <= D / 2 + 1e-3; z += s) pts.push(-W / 2, 0, z, W / 2, 0, z);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  // Dimension lines (the quantity surveyor's measurement marks)
  const dims = useMemo(() => {
    const pts: number[] = [];
    const line = (a: [number, number, number], b: [number, number, number], tick: [number, number, number]) => {
      pts.push(...a, ...b);
      pts.push(a[0] - tick[0], a[1] - tick[1], a[2] - tick[2], a[0] + tick[0], a[1] + tick[1], a[2] + tick[2]);
      pts.push(b[0] - tick[0], b[1] - tick[1], b[2] - tick[2], b[0] + tick[0], b[1] + tick[1], b[2] + tick[2]);
    };
    line([-1.95, 0.09, 1.72], [-0.15, 0.09, 1.72], [0, 0, 0.06]);
    line([-2.25, 0.09, 0.2], [-2.25, 0.09, 1.5], [0.06, 0, 0]);
    line([1.45, 0.09, -1.15], [1.45, 0.09, 0.45], [0.06, 0, 0]);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <group>
      <mesh receiveShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[5.4, 0.06, 4.6]} />
        <meshStandardMaterial color={COLORS.site} roughness={1} />
      </mesh>
      <lineSegments geometry={grid} position={[0, 0.062, 0]}>
        <lineBasicMaterial color={COLORS.grid} transparent opacity={0.8} />
      </lineSegments>
      <lineSegments geometry={dims}>
        <lineBasicMaterial color={COLORS.brand} />
      </lineSegments>
      {/* Wide drawing grid fading into the page */}
      <gridHelper args={[16, 64, "#e9edf0", "#eef1f3"]} position={[0, 0, 0]} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.002, 0]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <shadowMaterial opacity={0.08} />
      </mesh>
    </group>
  );
}

function Rig({ view }: { view: BuildingView }) {
  const targetRef = useRef(new THREE.Vector3(0, 1.55, 0));
  useFrame((state, dt) => {
    const target = targetRef.current;
    const cam = state.camera as THREE.PerspectiveCamera;
    const controls = state.controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    target.y = THREE.MathUtils.damp(target.y, view === "exploded" ? 2.45 : 1.55, 2.5, dt);
    cam.zoom = THREE.MathUtils.damp(cam.zoom, view === "exploded" ? 0.8 : 1, 2.5, dt);
    cam.updateProjectionMatrix();
    if (controls) {
      controls.target.copy(target);
      controls.update();
    } else {
      cam.lookAt(target);
    }
  });
  return null;
}

function Model({ view, rotate }: { view: BuildingView; rotate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const reduce = useMemo(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  useFrame((_, dt) => {
    if (group.current && rotate && !reduce) group.current.rotation.y += dt * 0.25;
  });
  return (
    <group ref={group}>
      <Site />
      <Building b={TOWER} view={view} gap={0.2} />
      <Building b={PODIUM} view={view} gap={0.24} />
      <Trees />
    </group>
  );
}

export default function BuildingScene({ view = "design", rotate = false, active = true }: { view?: BuildingView; rotate?: boolean; active?: boolean }) {
  const desktop = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [11.2, 8.4, 11.2], fov: 25 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      aria-hidden
    >
      <hemisphereLight args={["#ffffff", "#e8ecef", 1.2]} />
      <directionalLight
        position={[5, 9, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={6}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
        shadow-radius={4}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.35} />
      <Model view={view} rotate={rotate} />
      <Rig view={view} />
      {desktop && (
        <OrbitControls makeDefault enableZoom={false} enablePan={false} minPolarAngle={0.6} maxPolarAngle={1.25} rotateSpeed={0.6} target={[0, 1.6, 0]} />
      )}
    </Canvas>
  );
}
