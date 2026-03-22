import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  image?: string;
  tag?: string;
}

export function ServiceCard({ title, description, icon, href, image, tag }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/40 transition-shadow duration-300"
    >
      {image && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {tag && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          )}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <Link href={href}>
          <motion.span
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-3 transition-all"
            whileHover={{ gap: "0.75rem" }}
          >
            Découvrir
            <ArrowRight className="w-4 h-4" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}
