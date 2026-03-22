import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ReferenceCardProps {
  name: string;
  sector?: string;
  logoUrl?: string;
  image?: string;
  description?: string;
  href?: string;
}

export function ReferenceCard({ name, sector, logoUrl, image, description, href }: ReferenceCardProps) {
  const Wrapper = href ? motion.a : motion.div;

  return (
    <Wrapper
      href={href}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {image ? (
        <div className="relative h-40 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-sm truncate">{name}</p>
            {sector && <p className="text-white/70 text-xs">{sector}</p>}
          </div>
          {href && (
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 text-white">
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 flex flex-col items-center justify-center min-h-[140px] gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="h-12 object-contain filter grayscale group-hover:grayscale-0 transition-all" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-xl">{name.charAt(0)}</span>
            </div>
          )}
          <div className="text-center">
            <p className="font-semibold text-sm text-foreground">{name}</p>
            {sector && <p className="text-xs text-muted-foreground mt-0.5">{sector}</p>}
          </div>
        </div>
      )}
      {description && (
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
      )}
    </Wrapper>
  );
}
