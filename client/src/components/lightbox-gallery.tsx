import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, Play } from "lucide-react";

export interface GalleryItem {
  src: string;
  thumb?: string;
  alt: string;
  type?: "image" | "video";
  caption?: string;
}

interface LightboxGalleryProps {
  items: GalleryItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function LightboxGallery({ items, columns = 3, className }: LightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = (i: number) => setActiveIndex(i);
  const close = () => setActiveIndex(null);

  const prev = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + items.length) % items.length);
  }, [activeIndex, items.length]);

  const next = useCallback(() => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % items.length);
  }, [activeIndex, items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, prev, next]);

  // Touch swipe
  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => { touchStartX = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  const gridClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[columns];

  const active = activeIndex !== null ? items[activeIndex] : null;

  return (
    <>
      {/* Grille */}
      <div className={`grid ${gridClass} gap-3 ${className ?? ""}`}>
        {items.map((item, i) => (
          <motion.button
            key={i}
            onClick={() => open(i)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative group rounded-xl overflow-hidden aspect-square bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={item.thumb ?? item.src}
              alt={item.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2.5">
                {item.type === "video" ? (
                  <Play className="w-5 h-5 text-foreground" />
                ) : (
                  <ZoomIn className="w-5 h-5 text-foreground" />
                )}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Fermer */}
            <button
              onClick={close}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Compteur */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
              {(activeIndex ?? 0) + 1} / {items.length}
            </div>

            {/* Navigation prev */}
            {items.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Média */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="max-w-5xl max-h-[80vh] w-full px-16 flex flex-col items-center gap-3"
              >
                {active.type === "video" ? (
                  <video
                    src={active.src}
                    controls
                    autoPlay
                    className="max-h-[70vh] max-w-full rounded-xl"
                  />
                ) : (
                  <img
                    src={active.src}
                    alt={active.alt}
                    className="max-h-[70vh] max-w-full object-contain rounded-xl"
                  />
                )}
                {active.caption && (
                  <p className="text-white/70 text-sm text-center">{active.caption}</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Miniatures */}
            {items.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 max-w-xs overflow-x-auto pb-1">
                {items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex-shrink-0 w-10 h-10 rounded-md overflow-hidden ring-2 transition-all ${
                      i === activeIndex ? "ring-primary" : "ring-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={item.thumb ?? item.src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
