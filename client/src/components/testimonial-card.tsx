import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

interface TestimonialCardProps {
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  avatarUrl?: string;
  logoUrl?: string;
}

export function TestimonialCard({
  author,
  role,
  company,
  content,
  rating = 5,
  avatarUrl,
  logoUrl,
}: TestimonialCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className="relative bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      {/* Guillemets décoratifs */}
      <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/10" />

      {/* Étoiles */}
      {rating > 0 && (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
            />
          ))}
        </div>
      )}

      {/* Contenu */}
      <p className="text-sm text-muted-foreground leading-relaxed italic flex-1">"{content}"</p>

      {/* Auteur */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        {avatarUrl ? (
          <img src={avatarUrl} alt={author} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {author.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{author}</p>
          {(role || company) && (
            <p className="text-xs text-muted-foreground truncate">
              {role}{role && company ? " · " : ""}{company}
            </p>
          )}
        </div>
        {logoUrl && (
          <img src={logoUrl} alt={company} className="h-7 object-contain filter grayscale opacity-60" />
        )}
      </div>
    </motion.div>
  );
}
