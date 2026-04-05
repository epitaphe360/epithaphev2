/**
 * WorldGlobe — Epitaphe 360
 * Skill: UI/UX Pro Max → Style: 3D Hyperrealism + OLED Dark
 * Stack: React Three Fiber + drei + Three.js
 */

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// ─── Constants ──────────────────────────────────────────────────────────────

const RADIUS = 2;

// Major world cities (lat, lon) — connected to Casablanca (HQ)
const CITIES: { lat: number; lon: number; pulse?: boolean }[] = [
  { lat: 33.57,  lon: -7.59,  pulse: true }, // 0 Casablanca (HQ)
  { lat: 48.86,  lon:  2.35  },              // 1 Paris
  { lat: 25.20,  lon: 55.27  },              // 2 Dubai
  { lat: 40.71,  lon: -74.01 },              // 3 New York
  { lat: 51.51,  lon: -0.13  },              // 4 London
  { lat:  1.35,  lon: 103.82 },              // 5 Singapore
  { lat: 35.69,  lon: 139.69 },              // 6 Tokyo
];

const CONNECTIONS = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 4], [1, 2], [2, 5], [5, 6], [3, 6],
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

function buildArc(a: THREE.Vector3, b: THREE.Vector3, lift = 0.55, pts = 64): THREE.Vector3[] {
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS + lift);
  return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(pts);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Faint wireframe sphere */
function GlobeWireframe() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS, 36, 36]} />
      <meshBasicMaterial color="#EC4899" wireframe transparent opacity={0.04} />
    </mesh>
  );
}

/** Dense particle dots on the sphere surface */
function GlobeDots() {
  const ref = useRef<THREE.Points>(null);

  const { posArr, count } = useMemo(() => {
    const count = 8_000;
    const posArr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = RADIUS;
      posArr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      posArr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArr[i * 3 + 2] = r * Math.cos(phi);
    }
    return { posArr, count };
  }, []);

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArr, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.013}
        color="#EC4899"
        sizeAttenuation
        transparent
        opacity={0.65}
      />
    </points>
  );
}

/** Glowing outer atmosphere shell */
function Atmosphere() {
  return (
    <>
      {/* Cyan outer glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.08, 32, 32]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>
      {/* Magenta inner glow */}
      <mesh>
        <sphereGeometry args={[RADIUS * 1.04, 32, 32]} />
        <meshBasicMaterial color="#EC4899" transparent opacity={0.025} side={THREE.BackSide} />
      </mesh>
    </>
  );
}

/** Animated connection arcs between cities */
function ConnectionArcs() {
  const arcs = useMemo(() => {
    return CONNECTIONS.map(([ai, bi], idx) => {
      const a = latLonToVec3(CITIES[ai].lat, CITIES[ai].lon, RADIUS);
      const b = latLonToVec3(CITIES[bi].lat, CITIES[bi].lon, RADIUS);
      return { points: buildArc(a, b), idx };
    });
  }, []);

  return (
    <>
      {arcs.map(({ points, idx }) => (
        <Line
          key={idx}
          points={points}
          color={idx % 2 === 0 ? "#EC4899" : "#06B6D4"}
          lineWidth={0.6}
          transparent
          opacity={0.55}
        />
      ))}
    </>
  );
}

/** Pulsing dot markers on city positions */
function CityDots() {
  const ref = useRef<THREE.Points>(null);
  const clock = useRef(0);

  const { posArr, count } = useMemo(() => {
    const count = CITIES.length;
    const posArr = new Float32Array(count * 3);
    CITIES.forEach(({ lat, lon }, i) => {
      const v = latLonToVec3(lat, lon, RADIUS + 0.012);
      posArr[i * 3]     = v.x;
      posArr[i * 3 + 1] = v.y;
      posArr[i * 3 + 2] = v.z;
    });
    return { posArr, count };
  }, []);

  useFrame((_, delta) => {
    clock.current += delta;
    if (ref.current) {
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.6 + 0.4 * Math.sin(clock.current * 3);
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArr, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#FFFFFF"
        sizeAttenuation
        transparent
        opacity={0.9}
      />
    </points>
  );
}

/** Full rotating globe group */
function RotatingGlobe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      <GlobeWireframe />
      <GlobeDots />
      <Atmosphere />
      <ConnectionArcs />
      <CityDots />
    </group>
  );
}

/** Ambient nebula ring */
function NebulaRing() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.04;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[RADIUS * 1.35, RADIUS * 0.08, 4, 128]} />
      <meshBasicMaterial color="#EC4899" transparent opacity={0.10} />
    </mesh>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export function WorldGlobe({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Stars radius={90} depth={50} count={4000} factor={4} saturation={0} fade speed={0.8} />
          <RotatingGlobe />
          <NebulaRing />
          <ambientLight intensity={0.15} />
          <pointLight position={[5, 5, 5]} intensity={0.6} color="#EC4899" />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#06B6D4" />
        </Suspense>
      </Canvas>
    </div>
  );
}
