/**
 * Elementor-like widgets — rendus publics correspondant à puckConfig.tsx
 * Chaque composant accepte `{ data }` (HomeSection avec props arbitraires).
 */
import React from 'react';

type Any = Record<string, any>;

// ─── BASIQUE ───────────────────────────────────────────────────────
export function HeadingBlock({ data }: { data: Any }) {
  const { text = 'Mon titre', level = 'h2', align = 'left', color = '#111827' } = data;
  const Tag: any = level || 'h2';
  const sizes: Record<string, string> = {
    h1: 'text-5xl', h2: 'text-4xl', h3: 'text-3xl', h4: 'text-2xl', h5: 'text-xl', h6: 'text-lg',
  };
  return (
    <div className="px-4 py-2" style={{ textAlign: align }}>
      <Tag className={`font-bold ${sizes[level] || 'text-4xl'}`} style={{ color }}>{text}</Tag>
    </div>
  );
}

export function ParagraphBlock({ data }: { data: Any }) {
  const { text = '', align = 'left', size = 'base', color = '#374151' } = data;
  return (
    <div className="px-4 py-2 max-w-4xl mx-auto" style={{ textAlign: align as any }}>
      <p className={`text-${size} whitespace-pre-wrap leading-relaxed`} style={{ color }}>{text}</p>
    </div>
  );
}

export function ButtonBlock({ data }: { data: Any }) {
  const { label = 'Cliquer ici', href = '#', variant = 'primary', size = 'md', align = 'left', fullWidth = 'auto' } = data;
  const variants: Record<string, string> = {
    primary: 'bg-pink-500 text-white hover:bg-pink-600',
    dark: 'bg-gray-900 text-white hover:bg-gray-800',
    outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
    ghost: 'text-pink-500 hover:underline',
  };
  const sizes: Record<string, string> = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  return (
    <div className="px-4 py-3" style={{ textAlign: align as any }}>
      <a href={href} className={`inline-block rounded-md font-semibold transition ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${fullWidth === 'full' ? 'w-full text-center' : ''}`}>
        {label}
      </a>
    </div>
  );
}

export function ImageBlock({ data }: { data: Any }) {
  const { src, alt = '', align = 'center', width = '100', rounded = 'md', href = '' } = data;
  if (!src) return null;
  const widths: Record<string, string> = { '25': '25%', '50': '50%', '75': '75%', '100': '100%', auto: 'auto' };
  const rounds: Record<string, string> = { none: '0', sm: '4px', md: '8px', lg: '16px', full: '9999px' };
  const justify: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
  const img = <img src={src} alt={alt} loading="lazy" style={{ width: widths[width] || '100%', borderRadius: rounds[rounded] || '8px' }} />;
  return (
    <div className="px-4 py-3 flex" style={{ justifyContent: justify[align] || 'center' }}>
      {href ? <a href={href}>{img}</a> : img}
    </div>
  );
}

export function DividerBlock({ data }: { data: Any }) {
  const { style = 'solid', thickness = 1, color = '#e5e7eb', width = '100' } = data;
  return (
    <div className="px-4 py-4 flex justify-center">
      <hr style={{ borderTopStyle: style, borderTopWidth: thickness, borderColor: color, width: `${width}%`, margin: 0 }} />
    </div>
  );
}

export function SpacerBlock({ data }: { data: Any }) {
  const { height = 50 } = data;
  return <div style={{ height: `${height}px` }} aria-hidden="true" />;
}

export function IconBlock({ data }: { data: Any }) {
  const { emoji = '⭐', size = 64, align = 'center', color = '#ec4899' } = data;
  return (
    <div className="px-4 py-3" style={{ textAlign: align as any }}>
      <span style={{ fontSize: `${size}px`, color, lineHeight: 1, display: 'inline-block' }}>{emoji}</span>
    </div>
  );
}

// ─── LAYOUT ─────────────────────────────────────────────────────────
export function SectionBlock({ data }: { data: Any }) {
  const { title, content, bgColor = '#f9fafb', bgImage, textColor = '#111827', paddingY = 64, maxWidth = 'lg' } = data;
  const widths: Record<string, string> = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', full: '100%' };
  return (
    <div className="px-4 relative" style={{ backgroundColor: bgColor, color: textColor, paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}>
      {bgImage && <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />}
      <div className="relative mx-auto" style={{ maxWidth: widths[maxWidth] || widths.lg }}>
        {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
        {content && <p className="whitespace-pre-wrap">{content}</p>}
      </div>
    </div>
  );
}

export function ColumnsBlock({ data }: { data: Any }) {
  const { count = '3', gap = 24, col1, col2, col3, col4 } = data;
  const n = parseInt(count, 10);
  const cols = [col1, col2, col3, col4].slice(0, n);
  const gridClass: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className={`grid grid-cols-1 ${gridClass[n] || gridClass[3]}`} style={{ gap: `${gap}px` }}>
        {cols.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="whitespace-pre-wrap text-gray-700">{c}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TabsBlock({ data }: { data: Any }) {
  const items: Any[] = data.items || [];
  const [active, setActive] = React.useState(0);
  return (
    <div className="py-12 px-4 max-w-4xl mx-auto">
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {items.map((it, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`px-6 py-3 font-semibold whitespace-nowrap ${i === active ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div className="text-gray-700 whitespace-pre-wrap">{items[active]?.content || ''}</div>
    </div>
  );
}

export function AccordionBlock({ data }: { data: Any }) {
  const items: Any[] = data.items || [];
  return (
    <div className="py-12 px-4 max-w-3xl mx-auto space-y-3">
      {items.map((it, i) => (
        <details key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
          <summary className="font-semibold text-gray-900 cursor-pointer">{it.question}</summary>
          <p className="mt-3 text-gray-600 whitespace-pre-wrap">{it.answer}</p>
        </details>
      ))}
    </div>
  );
}

// ─── MÉDIA ──────────────────────────────────────────────────────────
function toEmbedUrl(url: string): string {
  if (!url) return '';
  // YouTube watch → embed
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?#]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo → player
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

export function VideoBlock({ data }: { data: Any }) {
  const { url, ratio = '16-9' } = data;
  const padding: Record<string, string> = { '16-9': '56.25%', '4-3': '75%', '1-1': '100%' };
  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <div style={{ position: 'relative', paddingBottom: padding[ratio] || padding['16-9'], height: 0, overflow: 'hidden', borderRadius: '8px' }}>
        <iframe
          src={toEmbedUrl(url)}
          title="Vidéo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
      </div>
    </div>
  );
}

export function GalleryBlock({ data }: { data: Any }) {
  const images: Any[] = data.images || [];
  const cols = data.cols || '3';
  const grid: Record<string, string> = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-3', '4': 'md:grid-cols-4' };
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <div className={`grid grid-cols-2 gap-4 ${grid[cols] || grid['3']}`}>
        {images.map((img, i) => (
          <img key={i} src={img.src} alt={img.alt || ''} loading="lazy" className="w-full h-48 object-cover rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function CarouselBlock({ data }: { data: Any }) {
  const slides: Any[] = data.slides || [];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);
  if (!slides.length) return null;
  const s = slides[idx];
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
        {s.image && <img src={s.image} alt={s.caption || ''} className="w-full h-full object-cover opacity-80 transition-opacity" />}
        {s.caption && (
          <div className="absolute inset-0 flex items-end p-6">
            <div className="text-white text-2xl font-bold">{s.caption}</div>
          </div>
        )}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function MapBlock({ data }: { data: Any }) {
  const { address = 'Casablanca, Maroc', zoom = 14, height = 400 } = data;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=${zoom}&output=embed`;
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <iframe
        src={src}
        title={`Carte: ${address}`}
        loading="lazy"
        style={{ width: '100%', height: `${height}px`, border: 0, borderRadius: '8px' }}
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

// ─── INTERACTIF ─────────────────────────────────────────────────────
export function IconBoxBlock({ data }: { data: Any }) {
  const { emoji = '🚀', title, description, align = 'center' } = data;
  return (
    <div className="px-4 py-6" style={{ textAlign: align as any }}>
      <div className="text-5xl mb-4">{emoji}</div>
      {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
      {description && <p className="text-gray-600 whitespace-pre-wrap">{description}</p>}
    </div>
  );
}

export function CounterBlock({ data }: { data: Any }) {
  const { value = 0, prefix = '', suffix = '', label, color = '#ec4899' } = data;
  const [display, setDisplay] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const target = Number(value) || 0;
        const dur = 1500;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          setDisplay(Math.round(target * p));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="px-4 py-6 text-center">
      <div className="text-5xl font-bold" style={{ color }}>{prefix}{display}{suffix}</div>
      {label && <div className="text-gray-600 mt-2 uppercase tracking-wider text-sm">{label}</div>}
    </div>
  );
}

export function PricingTableBlock({ data }: { data: Any }) {
  const { title, price, period, features = [], ctaLabel, ctaHref = '#', highlighted = 'no' } = data;
  return (
    <div className="px-4 py-8 max-w-sm mx-auto">
      <div className={`p-8 rounded-2xl border-2 ${highlighted === 'yes' ? 'border-pink-500 bg-pink-50 shadow-xl' : 'border-gray-200 bg-white'}`}>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <div className="mb-6"><span className="text-4xl font-bold">{price}</span><span className="text-gray-500">{period}</span></div>
        <ul className="space-y-2 mb-6">
          {features.map((f: any, i: number) => (
            <li key={i} className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✓</span>{f.text}</li>
          ))}
        </ul>
        {ctaLabel && (
          <a href={ctaHref} className={`block text-center py-3 rounded-md font-semibold ${highlighted === 'yes' ? 'bg-pink-500 text-white' : 'bg-gray-900 text-white'}`}>
            {ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export function TestimonialCardBlock({ data }: { data: Any }) {
  const { quote, author, role, avatar, rating = 5 } = data;
  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-yellow-400 text-xl mb-4">{'★'.repeat(rating)}{'☆'.repeat(Math.max(0, 5 - rating))}</div>
        <p className="text-lg italic text-gray-700 mb-6">{quote}</p>
        <div className="flex items-center gap-4">
          {avatar && <img src={avatar} alt={author || ''} className="w-12 h-12 rounded-full object-cover" />}
          <div>
            <div className="font-bold">{author}</div>
            {role && <div className="text-sm text-gray-500">{role}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CtaBannerBlock({ data }: { data: Any }) {
  const { title, description, btnLabel, btnHref = '#', bgColor = '#111827', textColor = '#ffffff' } = data;
  return (
    <div className="py-16 px-4" style={{ backgroundColor: bgColor, color: textColor }}>
      <div className="max-w-4xl mx-auto text-center">
        {title && <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>}
        {description && <p className="text-lg opacity-80 mb-8">{description}</p>}
        {btnLabel && (
          <a href={btnHref} className="inline-block bg-pink-500 text-white px-8 py-4 rounded-md font-semibold hover:bg-pink-600 transition">
            {btnLabel}
          </a>
        )}
      </div>
    </div>
  );
}

export function AlertBlock({ data }: { data: Any }) {
  const { type = 'info', title, message } = data;
  const styles: Record<string, string> = {
    info: 'bg-blue-50 border-blue-400 text-blue-800',
    success: 'bg-green-50 border-green-400 text-green-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    error: 'bg-red-50 border-red-400 text-red-800',
  };
  const icons: Record<string, string> = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  return (
    <div className="px-4 py-4 max-w-4xl mx-auto">
      <div className={`border-l-4 p-4 rounded ${styles[type] || styles.info}`}>
        <div className="flex items-start gap-3">
          <span className="text-xl">{icons[type] || icons.info}</span>
          <div>
            {title && <div className="font-bold">{title}</div>}
            {message && <p className="mt-1 whitespace-pre-wrap">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SOCIAL ─────────────────────────────────────────────────────────
export function SocialIconsBlock({ data }: { data: Any }) {
  const { facebook, instagram, linkedin, twitter, youtube, align = 'center', size = 32 } = data;
  const items = [
    { url: facebook, icon: 'f', bg: '#1877F2', label: 'Facebook' },
    { url: instagram, icon: '📷', bg: '#E4405F', label: 'Instagram' },
    { url: linkedin, icon: 'in', bg: '#0A66C2', label: 'LinkedIn' },
    { url: twitter, icon: '𝕏', bg: '#000000', label: 'Twitter/X' },
    { url: youtube, icon: '▶', bg: '#FF0000', label: 'YouTube' },
  ].filter((i) => !!i.url);
  const justify: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
  return (
    <div className="px-4 py-4 flex gap-3" style={{ justifyContent: justify[align] || 'center' }}>
      {items.map((it, i) => (
        <a
          key={i}
          href={it.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={it.label}
          className="rounded-full text-white flex items-center justify-center font-bold transition hover:scale-110"
          style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size / 2.5}px`, backgroundColor: it.bg }}
        >
          {it.icon}
        </a>
      ))}
    </div>
  );
}

export function LatestPostsBlock({ data }: { data: Any }) {
  const { title = 'Articles récents', limit = 3, showImage = 'yes' } = data;
  const [posts, setPosts] = React.useState<Any[]>([]);
  React.useEffect(() => {
    fetch(`/api/articles?limit=${limit}`)
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : d?.data ?? []))
      .catch(() => setPosts([]));
  }, [limit]);
  if (!posts.length) return null;
  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p) => (
          <a key={p.id} href={`/blog/${p.slug}`} className="bg-white rounded-lg overflow-hidden shadow border border-gray-100 hover:shadow-lg transition">
            {showImage === 'yes' && p.featuredImage && (
              <img src={p.featuredImage} alt={p.title} className="h-40 w-full object-cover" loading="lazy" />
            )}
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1">{p.category || 'Article'}</div>
              <div className="font-bold text-gray-900">{p.title}</div>
              {p.excerpt && <div className="text-sm text-gray-600 mt-2 line-clamp-2">{p.excerpt}</div>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
