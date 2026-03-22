/**
 * StandViewer3D — Visualiseur de stand interactif
 * Stack: @react-three/fiber + @react-three/drei
 *
 * Fonctionnalités :
 *  - Rotation / zoom / pan (OrbitControls)
 *  - Chargement de modèle GLTF/GLB avec barre de progression Draco
 *  - HotSpots 3D (points d'information cliquables → tooltip)
 *  - Sélecteur de variantes de matériaux (texture swap)
 *  - Fallback gracieux si WebGL non supporté
 */
import { Suspense, useState, useRef, useCallback } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Html,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, RotateCcw, Info, Maximize2 } from "lucide-react";
import * as THREE from "three";

/* ─── Types ──────────────────────────────────────────────── */
export interface HotSpot {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
}

export interface MaterialVariant {
  id: string;
  label: string;
  color: string;      // hex CSS pour la prévisualisation
  texturePath?: string;
}

export interface StandViewerProps {
  modelUrl: string;
  hotspots?: HotSpot[];
  variants?: MaterialVariant[];
  defaultVariant?: string;
  environmentPreset?: "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby";
  className?: string;
}

/* ─── Barre de chargement ─────────────────────────────────── */
function LoadingOverlay() {
  const { progress, active } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-10 rounded-2xl">
      <div className="w-48 h-1.5 bg-border rounded-full overflow-hidden mb-3">
        <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>
      <p className="text-sm text-muted-foreground font-medium">{Math.round(progress)}%</p>
      <p className="text-xs text-muted-foreground mt-1">Chargement du modèle 3D…</p>
    </div>
  );
}

/* ─── Fallback WebGL ─────────────────────────────────────── */
function NoWebGL() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted rounded-2xl text-center px-6">
      <div className="w-14 h-14 rounded-full bg-border flex items-center justify-center mb-4">
        <Maximize2 className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="font-semibold text-foreground mb-1">Visualisation 3D indisponible</p>
      <p className="text-sm text-muted-foreground">Votre navigateur ne supporte pas WebGL. Essayez Chrome ou Firefox.</p>
    </div>
  );
}

/* ─── Modèle GLTF ────────────────────────────────────────── */
function Model({ url, variantColor }: { url: string; variantColor?: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null!);

  // Appliquer la couleur de variante sur tous les meshes
  const applyVariant = useCallback(() => {
    if (!variantColor) return;
    const color = new THREE.Color(variantColor);
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat.isMeshStandardMaterial) {
          mat.color.set(color);
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, variantColor]);

  applyVariant();

  // Léger auto-rotate si l'utilisateur n'interagit pas
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={1} dispose={null} />
    </group>
  );
}

/* ─── HotSpot 3D ─────────────────────────────────────────── */
function HotSpotMarker({ spot, onClick, isActive }: { spot: HotSpot; onClick: () => void; isActive: boolean }) {
  return (
    <Html position={spot.position} center distanceFactor={8} occlude zIndexRange={[100, 200]}>
      <button
        onClick={onClick}
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all shadow-md cursor-pointer
          ${isActive ? "bg-primary text-primary-foreground border-primary scale-125" : "bg-white text-primary border-primary hover:scale-110"}`}
        style={{ transform: `scale(${isActive ? 1.25 : 1})` }}
      >
        <Info className="w-3.5 h-3.5" />
      </button>
    </Html>
  );
}

/* ─── Tooltip HotSpot ────────────────────────────────────── */
function HotSpotTooltip({ spot, onClose }: { spot: HotSpot; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        key={spot.id}
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.95 }}
        className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-card border border-border rounded-2xl p-4 shadow-xl z-20"
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <p className="font-semibold text-foreground text-sm mb-1 pr-6">{spot.title}</p>
        <p className="text-muted-foreground text-xs leading-relaxed">{spot.description}</p>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Composant principal ────────────────────────────────── */
export function StandViewer3D({
  modelUrl,
  hotspots = [],
  variants = [],
  defaultVariant,
  environmentPreset = "studio",
  className = "",
}: StandViewerProps) {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);
  const [activeVariant, setActiveVariant] = useState(defaultVariant ?? variants[0]?.id ?? "");
  const [webGLSupported] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl") || c.getContext("experimental-webgl"));
    } catch { return false; }
  });

  const orbitRef = useRef<any>(null);
  const currentSpot = hotspots.find((s) => s.id === activeSpot) ?? null;
  const currentVariantColor = variants.find((v) => v.id === activeVariant)?.color;

  const resetCamera = () => {
    if (orbitRef.current) {
      orbitRef.current.reset();
    }
  };

  if (!webGLSupported) {
    return (
      <div className={`relative w-full h-96 ${className}`}>
        <NoWebGL />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[500px] rounded-2xl overflow-hidden border border-border bg-muted/30 ${className}`}>
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        shadows
        gl={{ antialias: true, preserveDrawingBuffer: false }}
      >
        <Suspense fallback={null}>
          {/* Éclairage */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 8, 5]} intensity={1.0} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <pointLight position={[-4, 3, -4]} intensity={0.4} />

          {/* Environnement HDR */}
          <Environment preset={environmentPreset} />

          {/* Modèle */}
          <Model url={modelUrl} variantColor={currentVariantColor} />

          {/* HotSpots */}
          {hotspots.map((spot) => (
            <HotSpotMarker key={spot.id} spot={spot} isActive={spot.id === activeSpot}
              onClick={() => setActiveSpot(activeSpot === spot.id ? null : spot.id)} />
          ))}

          {/* Sol réflecteur subtil */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.15} />
          </mesh>

          {/* Contrôles */}
          <OrbitControls
            ref={orbitRef}
            enablePan={true}
            enableZoom={true}
            minDistance={1.5}
            maxDistance={10}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI / 2.1}
            makeDefault
          />
        </Suspense>
      </Canvas>

      {/* Overlay chargement */}
      <LoadingOverlay />

      {/* Tooltip HotSpot actif */}
      {currentSpot && <HotSpotTooltip spot={currentSpot} onClose={() => setActiveSpot(null)} />}

      {/* Barre de contrôles UI */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
        <button onClick={resetCamera} title="Réinitialiser la vue"
          className="w-8 h-8 bg-card/90 backdrop-blur-sm border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors shadow-sm">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sélecteur de variantes */}
      {variants.length > 0 && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
          <span className="text-xs text-muted-foreground bg-card/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-border">Variantes :</span>
          {variants.map((v) => (
            <button key={v.id} title={v.label} onClick={() => setActiveVariant(v.id)}
              style={{ backgroundColor: v.color }}
              className={`w-7 h-7 rounded-full border-2 transition-all shadow-sm hover:scale-110
                ${activeVariant === v.id ? "border-foreground scale-110" : "border-white/60"}`}
            />
          ))}
        </div>
      )}

      {/* Indicateur "drag to rotate" */}
      <div className="absolute top-3 left-3 pointer-events-none">
        <span className="text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-border">
          🖱 Glisser pour pivoter
        </span>
      </div>
    </div>
  );
}

export default StandViewer3D;
