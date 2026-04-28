import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from '../../hooks/useRouterParams';
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import gjsBlocksBasic from "grapesjs-blocks-basic";
import { ArrowLeft, Save, Eye, Undo2, Redo2, Layers, LayoutGrid, Paintbrush, Settings2, Monitor, Tablet, Smartphone } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { toast } from '../../lib/toast';

// ── Blocs personnalisés style Elementor ─────────────────────────────────────
function registerCustomBlocks(editor: any) {
  const bm = editor.BlockManager;

  const add = (id: string, label: string, category: string, icon: string, content: string) =>
    bm.add(id, { label, category, media: icon, content, attributes: { class: 'gjs-block-section' } });

  /* ── Mise en page ── */
  add('section-full', 'Section pleine largeur', 'Mise en page',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/></svg>`,
    `<section style="padding:60px 20px;background:#f8fafc;width:100%"><div style="max-width:1200px;margin:0 auto;min-height:80px;border:2px dashed #cbd5e1;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px">Glissez des éléments ici</div></section>`
  );
  add('cols-2', '2 Colonnes', 'Mise en page',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/></svg>`,
    `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:20px"><div style="min-height:100px;border:2px dashed #cbd5e1;border-radius:8px;padding:20px"></div><div style="min-height:100px;border:2px dashed #cbd5e1;border-radius:8px;padding:20px"></div></div>`
  );
  add('cols-3', '3 Colonnes', 'Mise en page',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="5" height="16" rx="1"/><rect x="9.5" y="4" width="5" height="16" rx="1"/><rect x="17" y="4" width="5" height="16" rx="1"/></svg>`,
    `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;padding:20px"><div style="min-height:100px;border:2px dashed #cbd5e1;border-radius:8px;padding:20px"></div><div style="min-height:100px;border:2px dashed #cbd5e1;border-radius:8px;padding:20px"></div><div style="min-height:100px;border:2px dashed #cbd5e1;border-radius:8px;padding:20px"></div></div>`
  );
  add('cols-4', '4 Colonnes', 'Mise en page',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="4.5" height="16" rx="1"/><rect x="7" y="4" width="4.5" height="16" rx="1"/><rect x="12.5" y="4" width="4.5" height="16" rx="1"/><rect x="18" y="4" width="4.5" height="16" rx="1"/></svg>`,
    `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:20px"><div style="min-height:80px;border:2px dashed #cbd5e1;border-radius:8px;padding:12px"></div><div style="min-height:80px;border:2px dashed #cbd5e1;border-radius:8px;padding:12px"></div><div style="min-height:80px;border:2px dashed #cbd5e1;border-radius:8px;padding:12px"></div><div style="min-height:80px;border:2px dashed #cbd5e1;border-radius:8px;padding:12px"></div></div>`
  );

  /* ── De base ── */
  add('heading-h1', 'Titre H1', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h8m-8 6h16"/></svg>`,
    `<h1 style="font-size:2.5rem;font-weight:700;color:#1e293b;margin:0;line-height:1.2">Votre Titre Principal</h1>`
  );
  add('heading-h2', 'Titre H2', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h10m-10 6h16"/></svg>`,
    `<h2 style="font-size:1.875rem;font-weight:700;color:#1e293b;margin:0;line-height:1.3">Titre de Section</h2>`
  );
  add('heading-h3', 'Titre H3', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h12m-12 6h8"/></svg>`,
    `<h3 style="font-size:1.5rem;font-weight:600;color:#334155;margin:0;line-height:1.4">Sous-titre</h3>`
  );
  add('paragraph', 'Paragraphe', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 10h16M4 14h10M4 18h12"/></svg>`,
    `<p style="font-size:1rem;color:#475569;line-height:1.7;margin:0">Votre texte ici. Cliquez pour modifier ce paragraphe et saisir votre contenu.</p>`
  );
  add('button-primary', 'Bouton Primaire', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="4"/></svg>`,
    `<a href="#" style="display:inline-block;padding:12px 32px;background:#2563eb;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem;transition:background 0.2s">Appel à l'action</a>`
  );
  add('button-secondary', 'Bouton Secondaire', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="8" rx="4"/><rect x="3" y="8" width="18" height="8" rx="4" stroke-dasharray="4 2"/></svg>`,
    `<a href="#" style="display:inline-block;padding:12px 32px;background:transparent;color:#2563eb;text-decoration:none;border-radius:8px;font-weight:600;font-size:1rem;border:2px solid #2563eb">En savoir plus</a>`
  );
  add('divider', 'Séparateur', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16"/></svg>`,
    `<hr style="border:none;border-top:2px solid #e2e8f0;margin:24px 0"/>`
  );
  add('spacer', 'Espacement', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16M4 4h16M4 20h16"/></svg>`,
    `<div style="height:60px;width:100%"></div>`
  );
  add('list', 'Liste à puces', 'De base',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="7" r="1.5" fill="currentColor"/><path d="M9 7h11M9 12h11M9 17h11"/><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="5" cy="17" r="1.5" fill="currentColor"/></svg>`,
    `<ul style="padding-left:20px;color:#475569;line-height:2;margin:0"><li>Premier élément de liste</li><li>Deuxième élément de liste</li><li>Troisième élément de liste</li></ul>`
  );

  /* ── Médias ── */
  add('image', 'Image', 'Médias',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
    `<img src="https://placehold.co/800x400/e2e8f0/94a3b8?text=Image" alt="Image" style="width:100%;height:auto;border-radius:8px;display:block"/>`
  );
  add('video', 'Vidéo YouTube', 'Médias',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"/><polygon points="10 9 15 12 10 15" fill="currentColor"/></svg>`,
    `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" allowfullscreen></iframe></div>`
  );
  add('gallery', 'Galerie Photos', 'Médias',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></svg>`,
    `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px"><img src="https://placehold.co/400x300/e2e8f0/94a3b8?text=1" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px"/><img src="https://placehold.co/400x300/dbeafe/93c5fd?text=2" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px"/><img src="https://placehold.co/400x300/dcfce7/86efac?text=3" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px"/><img src="https://placehold.co/400x300/fef3c7/fcd34d?text=4" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px"/><img src="https://placehold.co/400x300/fce7f3/f9a8d4?text=5" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px"/><img src="https://placehold.co/400x300/ede9fe/c4b5fd?text=6" alt="" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px"/></div>`
  );
  add('icon', 'Icône SVG', 'Médias',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<div style="text-align:center;padding:16px"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#2563eb" stroke-width="1.5" style="display:inline-block"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg></div>`
  );

  /* ── Sections de contenu ── */
  add('hero', 'Bandeau Hero', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 12h8M12 8v8"/></svg>`,
    `<section style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:100px 40px;text-align:center;color:#fff">
  <h1 style="font-size:3rem;font-weight:800;margin:0 0 20px;line-height:1.1">Votre Titre Principal</h1>
  <p style="font-size:1.25rem;opacity:0.9;max-width:600px;margin:0 auto 40px;line-height:1.6">Sous-titre accrocheur qui décrit votre service ou produit en quelques mots percutants.</p>
  <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
    <a href="#" style="padding:14px 36px;background:#fff;color:#1e3a5f;border-radius:8px;text-decoration:none;font-weight:700;font-size:1rem">Démarrer maintenant</a>
    <a href="#" style="padding:14px 36px;background:transparent;color:#fff;border:2px solid rgba(255,255,255,0.6);border-radius:8px;text-decoration:none;font-weight:600;font-size:1rem">En savoir plus</a>
  </div>
</section>`
  );
  add('card', 'Carte', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/></svg>`,
    `<div style="background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,0.08);overflow:hidden;max-width:360px">
  <img src="https://placehold.co/720x400/dbeafe/3b82f6?text=Image" alt="" style="width:100%;height:200px;object-fit:cover;display:block"/>
  <div style="padding:24px">
    <h3 style="font-size:1.25rem;font-weight:700;color:#1e293b;margin:0 0 8px">Titre de la carte</h3>
    <p style="color:#64748b;line-height:1.6;margin:0 0 20px;font-size:0.95rem">Description courte du contenu de cette carte. Modifiez ce texte selon vos besoins.</p>
    <a href="#" style="display:inline-block;padding:10px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;font-size:0.9rem">Lire la suite</a>
  </div>
</div>`
  );
  add('testimonial', 'Témoignage', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    `<div style="background:#f8fafc;border-radius:12px;padding:32px;border-left:4px solid #2563eb;max-width:560px">
  <div style="font-size:2.5rem;color:#2563eb;line-height:1;margin-bottom:12px">"</div>
  <p style="font-size:1.1rem;color:#334155;line-height:1.7;font-style:italic;margin:0 0 20px">Ce service a complètement transformé notre façon de travailler. Les résultats sont au-delà de nos attentes.</p>
  <div style="display:flex;align-items:center;gap:12px">
    <img src="https://placehold.co/48/e2e8f0/94a3b8?text=A" alt="" style="width:48px;height:48px;border-radius:50%;object-fit:cover"/>
    <div>
      <div style="font-weight:700;color:#1e293b;font-size:0.95rem">Nom Prénom</div>
      <div style="color:#64748b;font-size:0.85rem">Poste, Entreprise</div>
    </div>
  </div>
</div>`
  );
  add('icon-box', 'Boîte Icône', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><circle cx="17" cy="7" r="4"/><path d="M3 14h18M3 18h12"/></svg>`,
    `<div style="text-align:center;padding:32px 24px;background:#fff;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
  <div style="width:64px;height:64px;background:#dbeafe;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px">
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#2563eb" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  </div>
  <h3 style="font-size:1.1rem;font-weight:700;color:#1e293b;margin:0 0 10px">Fonctionnalité clé</h3>
  <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin:0">Description concise de cette fonctionnalité ou service. Restez bref et percutant.</p>
</div>`
  );
  add('counter', 'Compteur', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="8"/></svg>`,
    `<div style="text-align:center;padding:32px 20px">
  <div style="font-size:3.5rem;font-weight:800;color:#2563eb;line-height:1">250+</div>
  <div style="font-size:1rem;color:#64748b;margin-top:8px;font-weight:500">Clients satisfaits</div>
</div>`
  );
  add('cta-section', 'Appel à l\'action', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    `<section style="background:linear-gradient(135deg,#1e293b,#334155);padding:80px 40px;text-align:center;border-radius:16px">
  <h2 style="font-size:2rem;font-weight:800;color:#fff;margin:0 0 16px">Prêt à commencer ?</h2>
  <p style="color:#cbd5e1;font-size:1.1rem;max-width:480px;margin:0 auto 32px;line-height:1.6">Contactez-nous aujourd'hui et transformons ensemble votre vision en réalité.</p>
  <a href="#" style="display:inline-block;padding:16px 40px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:1.05rem">Démarrer le projet</a>
</section>`
  );
  add('pricing', 'Tableau de Prix', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
    `<div style="background:#fff;border-radius:16px;box-shadow:0 4px 32px rgba(0,0,0,0.1);overflow:hidden;max-width:320px;text-align:center">
  <div style="background:#2563eb;padding:32px 24px">
    <div style="color:#bfdbfe;font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Pack Pro</div>
    <div style="color:#fff;font-size:3rem;font-weight:800;line-height:1">4 900<span style="font-size:1.2rem">MAD</span></div>
    <div style="color:#93c5fd;margin-top:6px;font-size:0.9rem">par mois</div>
  </div>
  <div style="padding:24px">
    <ul style="list-style:none;padding:0;margin:0 0 24px;text-align:left">
      <li style="padding:8px 0;color:#475569;display:flex;align-items:center;gap:8px;border-bottom:1px solid #f1f5f9">✅ Fonctionnalité 1</li>
      <li style="padding:8px 0;color:#475569;display:flex;align-items:center;gap:8px;border-bottom:1px solid #f1f5f9">✅ Fonctionnalité 2</li>
      <li style="padding:8px 0;color:#475569;display:flex;align-items:center;gap:8px">✅ Fonctionnalité 3</li>
    </ul>
    <a href="#" style="display:block;padding:14px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">Choisir ce plan</a>
  </div>
</div>`
  );
  add('accordion', 'Accordéon FAQ', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
    `<div style="max-width:700px">
  <details style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;overflow:hidden">
    <summary style="padding:16px 20px;font-weight:600;color:#1e293b;cursor:pointer;background:#f8fafc">Question fréquente numéro 1 ?</summary>
    <div style="padding:16px 20px;color:#475569;line-height:1.7">Réponse détaillée à la première question fréquente. Modifiez ce texte pour y mettre vos vraies FAQ.</div>
  </details>
  <details style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;overflow:hidden">
    <summary style="padding:16px 20px;font-weight:600;color:#1e293b;cursor:pointer;background:#f8fafc">Question fréquente numéro 2 ?</summary>
    <div style="padding:16px 20px;color:#475569;line-height:1.7">Réponse à la deuxième question fréquente. Personnalisez selon vos besoins.</div>
  </details>
  <details style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
    <summary style="padding:16px 20px;font-weight:600;color:#1e293b;cursor:pointer;background:#f8fafc">Question fréquente numéro 3 ?</summary>
    <div style="padding:16px 20px;color:#475569;line-height:1.7">Réponse à la troisième question fréquente.</div>
  </details>
</div>`
  );
  add('features-list', 'Liste de Services', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    `<section style="padding:60px 20px;background:#f8fafc">
  <h2 style="text-align:center;font-size:2rem;font-weight:800;color:#1e293b;margin:0 0 48px">Nos Services</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1000px;margin:0 auto">
    <div style="text-align:center;padding:24px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
      <div style="font-size:2.5rem;margin-bottom:12px">🎯</div>
      <h3 style="font-size:1rem;font-weight:700;color:#1e293b;margin:0 0 8px">Service 1</h3>
      <p style="color:#64748b;font-size:0.85rem;line-height:1.5;margin:0">Description du service</p>
    </div>
    <div style="text-align:center;padding:24px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
      <div style="font-size:2.5rem;margin-bottom:12px">✨</div>
      <h3 style="font-size:1rem;font-weight:700;color:#1e293b;margin:0 0 8px">Service 2</h3>
      <p style="color:#64748b;font-size:0.85rem;line-height:1.5;margin:0">Description du service</p>
    </div>
    <div style="text-align:center;padding:24px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06)">
      <div style="font-size:2.5rem;margin-bottom:12px">🚀</div>
      <h3 style="font-size:1rem;font-weight:700;color:#1e293b;margin:0 0 8px">Service 3</h3>
      <p style="color:#64748b;font-size:0.85rem;line-height:1.5;margin:0">Description du service</p>
    </div>
  </div>
</section>`
  );
  add('team-members', 'Équipe', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    `<section style="padding:60px 20px;text-align:center">
  <h2 style="font-size:2rem;font-weight:800;color:#1e293b;margin:0 0 48px">Notre Équipe</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;max-width:900px;margin:0 auto">
    <div style="background:#fff;border-radius:16px;padding:32px 24px;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <img src="https://placehold.co/80/dbeafe/3b82f6?text=A" alt="" style="width:80px;height:80px;border-radius:50%;margin:0 auto 16px;display:block;object-fit:cover"/>
      <h3 style="font-weight:700;color:#1e293b;margin:0 0 4px">Prénom Nom</h3>
      <p style="color:#64748b;font-size:0.85rem;margin:0 0 12px">Directeur Créatif</p>
      <p style="color:#94a3b8;font-size:0.8rem;line-height:1.5;margin:0">Bio courte du membre de l'équipe.</p>
    </div>
    <div style="background:#fff;border-radius:16px;padding:32px 24px;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <img src="https://placehold.co/80/dcfce7/22c55e?text=B" alt="" style="width:80px;height:80px;border-radius:50%;margin:0 auto 16px;display:block;object-fit:cover"/>
      <h3 style="font-weight:700;color:#1e293b;margin:0 0 4px">Prénom Nom</h3>
      <p style="color:#64748b;font-size:0.85rem;margin:0 0 12px">Chef de Projet</p>
      <p style="color:#94a3b8;font-size:0.8rem;line-height:1.5;margin:0">Bio courte du membre de l'équipe.</p>
    </div>
    <div style="background:#fff;border-radius:16px;padding:32px 24px;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <img src="https://placehold.co/80/fce7f3/ec4899?text=C" alt="" style="width:80px;height:80px;border-radius:50%;margin:0 auto 16px;display:block;object-fit:cover"/>
      <h3 style="font-weight:700;color:#1e293b;margin:0 0 4px">Prénom Nom</h3>
      <p style="color:#64748b;font-size:0.85rem;margin:0 0 12px">Designer UX</p>
      <p style="color:#94a3b8;font-size:0.8rem;line-height:1.5;margin:0">Bio courte du membre de l'équipe.</p>
    </div>
  </div>
</section>`
  );
  add('contact-form', 'Formulaire Contact', 'Sections',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    `<section style="padding:60px 20px;background:#f8fafc">
  <h2 style="text-align:center;font-size:2rem;font-weight:800;color:#1e293b;margin:0 0 40px">Contactez-nous</h2>
  <form style="max-width:560px;margin:0 auto;background:#fff;padding:40px;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
      <div>
        <label style="display:block;font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:6px">Prénom</label>
        <input type="text" placeholder="Votre prénom" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
      </div>
      <div>
        <label style="display:block;font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:6px">Nom</label>
        <input type="text" placeholder="Votre nom" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
      </div>
    </div>
    <div style="margin-bottom:16px">
      <label style="display:block;font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:6px">Email</label>
      <input type="email" placeholder="votre@email.com" style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.9rem;box-sizing:border-box"/>
    </div>
    <div style="margin-bottom:24px">
      <label style="display:block;font-size:0.85rem;font-weight:600;color:#374151;margin-bottom:6px">Message</label>
      <textarea rows="4" placeholder="Votre message..." style="width:100%;padding:10px 14px;border:1px solid #d1d5db;border-radius:8px;font-size:0.9rem;resize:vertical;box-sizing:border-box"></textarea>
    </div>
    <button type="submit" style="width:100%;padding:14px;background:#2563eb;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:1rem;cursor:pointer">Envoyer le message</button>
  </form>
</section>`
  );

  /* ── Avancé (Elementor Pro) ── */
  add('progress-bar', 'Barre de progression', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="10" width="20" height="4" rx="2"/><rect x="2" y="10" width="14" height="4" rx="2" fill="currentColor" stroke="none"/></svg>`,
    `<div style="padding:16px 0;max-width:600px">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px">
    <span style="font-size:0.9rem;font-weight:600;color:#1e293b">Compétence 1</span>
    <span style="font-size:0.9rem;font-weight:700;color:#2563eb">85%</span>
  </div>
  <div style="background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden">
    <div style="background:linear-gradient(90deg,#2563eb,#60a5fa);width:85%;height:100%;border-radius:999px"></div>
  </div>
  <div style="display:flex;justify-content:space-between;margin:12px 0 6px">
    <span style="font-size:0.9rem;font-weight:600;color:#1e293b">Compétence 2</span>
    <span style="font-size:0.9rem;font-weight:700;color:#7c3aed">70%</span>
  </div>
  <div style="background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden">
    <div style="background:linear-gradient(90deg,#7c3aed,#a78bfa);width:70%;height:100%;border-radius:999px"></div>
  </div>
  <div style="display:flex;justify-content:space-between;margin:12px 0 6px">
    <span style="font-size:0.9rem;font-weight:600;color:#1e293b">Compétence 3</span>
    <span style="font-size:0.9rem;font-weight:700;color:#059669">92%</span>
  </div>
  <div style="background:#e2e8f0;border-radius:999px;height:10px;overflow:hidden">
    <div style="background:linear-gradient(90deg,#059669,#34d399);width:92%;height:100%;border-radius:999px"></div>
  </div>
</div>`
  );
  add('star-rating', 'Note / Étoiles', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    `<div style="text-align:center;padding:24px">
  <div style="font-size:2.5rem;letter-spacing:4px;color:#f59e0b">★★★★★</div>
  <div style="font-size:1.5rem;font-weight:800;color:#1e293b;margin:8px 0 4px">4.9 / 5</div>
  <div style="color:#64748b;font-size:0.9rem">Basé sur 128 avis clients</div>
</div>`
  );
  add('alert', 'Alerte / Notification', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    `<div style="display:flex;flex-direction:column;gap:10px;max-width:600px">
  <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 18px;background:#dbeafe;border:1px solid #93c5fd;border-radius:8px;border-left:4px solid #2563eb">
    <span style="font-size:1.1rem">ℹ️</span>
    <div><strong style="color:#1e40af">Information :</strong> <span style="color:#1e40af;font-size:0.9rem">Votre message d'information ici.</span></div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 18px;background:#dcfce7;border:1px solid #86efac;border-radius:8px;border-left:4px solid #16a34a">
    <span style="font-size:1.1rem">✅</span>
    <div><strong style="color:#15803d">Succès :</strong> <span style="color:#15803d;font-size:0.9rem">Action effectuée avec succès !</span></div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 18px;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;border-left:4px solid #d97706">
    <span style="font-size:1.1rem">⚠️</span>
    <div><strong style="color:#92400e">Attention :</strong> <span style="color:#92400e;font-size:0.9rem">Vérifiez ces informations avant de continuer.</span></div>
  </div>
  <div style="display:flex;align-items:flex-start;gap:12px;padding:14px 18px;background:#fee2e2;border:1px solid #fca5a5;border-radius:8px;border-left:4px solid #dc2626">
    <span style="font-size:1.1rem">❌</span>
    <div><strong style="color:#991b1b">Erreur :</strong> <span style="color:#991b1b;font-size:0.9rem">Une erreur est survenue, veuillez réessayer.</span></div>
  </div>
</div>`
  );
  add('countdown', 'Compte à rebours', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    `<div style="text-align:center;padding:40px 20px">
  <h3 style="font-size:1.2rem;font-weight:700;color:#1e293b;margin:0 0 24px">Offre spéciale se termine dans :</h3>
  <div style="display:inline-flex;gap:16px;flex-wrap:wrap;justify-content:center">
    <div style="background:#1e293b;color:#fff;border-radius:12px;padding:16px 20px;min-width:70px">
      <div style="font-size:2.5rem;font-weight:800;line-height:1">03</div>
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-top:4px">Jours</div>
    </div>
    <div style="background:#1e293b;color:#fff;border-radius:12px;padding:16px 20px;min-width:70px">
      <div style="font-size:2.5rem;font-weight:800;line-height:1">14</div>
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-top:4px">Heures</div>
    </div>
    <div style="background:#1e293b;color:#fff;border-radius:12px;padding:16px 20px;min-width:70px">
      <div style="font-size:2.5rem;font-weight:800;line-height:1">27</div>
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;margin-top:4px">Minutes</div>
    </div>
    <div style="background:#2563eb;color:#fff;border-radius:12px;padding:16px 20px;min-width:70px">
      <div style="font-size:2.5rem;font-weight:800;line-height:1">45</div>
      <div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px;color:#bfdbfe;margin-top:4px">Secondes</div>
    </div>
  </div>
</div>`
  );
  add('tabs', 'Onglets (Tabs)', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="8" width="20" height="14" rx="2"/><path d="M2 8V6a2 2 0 0 1 2-2h4v4M10 2h4v6h-4z"/></svg>`,
    `<div style="max-width:700px">
  <div style="display:flex;border-bottom:2px solid #e2e8f0;margin-bottom:0">
    <button style="padding:12px 24px;background:transparent;border:none;border-bottom:3px solid #2563eb;margin-bottom:-2px;font-weight:700;color:#2563eb;cursor:pointer;font-size:0.95rem">Onglet 1</button>
    <button style="padding:12px 24px;background:transparent;border:none;font-weight:500;color:#64748b;cursor:pointer;font-size:0.95rem">Onglet 2</button>
    <button style="padding:12px 24px;background:transparent;border:none;font-weight:500;color:#64748b;cursor:pointer;font-size:0.95rem">Onglet 3</button>
  </div>
  <div style="border:1px solid #e2e8f0;border-top:none;padding:24px;border-radius:0 0 8px 8px;background:#fff">
    <h4 style="font-size:1.1rem;font-weight:700;color:#1e293b;margin:0 0 10px">Contenu de l'onglet 1</h4>
    <p style="color:#475569;line-height:1.7;margin:0;font-size:0.95rem">Contenu du premier onglet. Cliquez sur un autre onglet pour changer de section. Vous pouvez personnaliser ce contenu librement.</p>
  </div>
</div>`
  );
  add('toggle', 'Toggle / Interrupteur', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="8" width="22" height="8" rx="4"/><circle cx="16" cy="12" r="3" fill="currentColor"/></svg>`,
    `<div style="max-width:600px">
  <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:8px">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;background:#f8fafc">
      <span style="font-weight:600;color:#1e293b;font-size:0.95rem">Rubrique principale 1</span>
      <span style="color:#2563eb;font-size:1.2rem;font-weight:700">+</span>
    </div>
    <div style="padding:16px 20px;color:#475569;line-height:1.7;font-size:0.9rem;border-top:1px solid #e2e8f0">Contenu de la première rubrique. Idéal pour des FAQ ou du contenu à révéler.</div>
  </div>
  <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:8px">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;background:#f8fafc">
      <span style="font-weight:600;color:#1e293b;font-size:0.95rem">Rubrique principale 2</span>
      <span style="color:#2563eb;font-size:1.2rem;font-weight:700">+</span>
    </div>
  </div>
  <div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px;cursor:pointer;background:#f8fafc">
      <span style="font-weight:600;color:#1e293b;font-size:0.95rem">Rubrique principale 3</span>
      <span style="color:#2563eb;font-size:1.2rem;font-weight:700">+</span>
    </div>
  </div>
</div>`
  );
  add('flip-box', 'Flip Box', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M12 3v18M2 12h20"/></svg>`,
    `<div style="perspective:1000px;width:240px;height:280px;cursor:pointer">
  <div style="position:relative;width:100%;height:100%;transform-style:preserve-3d">
    <div style="position:absolute;inset:0;background:linear-gradient(135deg,#2563eb,#7c3aed);border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;backface-visibility:hidden">
      <div style="font-size:3rem;margin-bottom:16px">🎯</div>
      <h3 style="color:#fff;font-size:1.2rem;font-weight:700;margin:0 0 8px">Face avant</h3>
      <p style="color:#bfdbfe;font-size:0.85rem;margin:0">Survolez pour voir le verso</p>
    </div>
    <div style="position:absolute;inset:0;background:#1e293b;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;backface-visibility:hidden;transform:rotateY(180deg)">
      <h3 style="color:#fff;font-size:1.1rem;font-weight:700;margin:0 0 12px">Face arrière</h3>
      <p style="color:#94a3b8;font-size:0.85rem;line-height:1.6;margin:0 0 16px">Description détaillée visible au survol de la carte.</p>
      <a href="#" style="padding:8px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-size:0.85rem;font-weight:600">Découvrir</a>
    </div>
  </div>
</div>`
  );
  add('animated-heading', 'Titre Animé', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    `<div style="text-align:center;padding:32px 20px">
  <h2 style="font-size:2.5rem;font-weight:800;color:#1e293b;margin:0;line-height:1.2">
    Nous sommes
    <span style="position:relative;display:inline-block">
      <span style="background:linear-gradient(135deg,#2563eb,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">experts</span>
      <span style="position:absolute;bottom:-4px;left:0;right:0;height:4px;background:linear-gradient(90deg,#2563eb,#7c3aed);border-radius:2px"></span>
    </span>
    en communication
  </h2>
  <p style="color:#64748b;font-size:1.1rem;margin:16px 0 0;max-width:500px;margin-left:auto;margin-right:auto">Sous-titre complémentaire qui renforce le message principal</p>
</div>`
  );
  add('social-icons', 'Icônes Réseaux Sociaux', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    `<div style="display:flex;gap:12px;flex-wrap:wrap;padding:16px 0">
  <a href="#" style="width:44px;height:44px;background:#1877f2;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.2rem;color:#fff" title="Facebook">f</a>
  <a href="#" style="width:44px;height:44px;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.1rem;color:#fff" title="Instagram">📷</a>
  <a href="#" style="width:44px;height:44px;background:#1da1f2;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.1rem;color:#fff" title="Twitter/X">✗</a>
  <a href="#" style="width:44px;height:44px;background:#0077b5;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.1rem;color:#fff" title="LinkedIn">in</a>
  <a href="#" style="width:44px;height:44px;background:#ff0000;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.2rem;color:#fff" title="YouTube">▶</a>
  <a href="#" style="width:44px;height:44px;background:#25d366;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;font-size:1.1rem;color:#fff" title="WhatsApp">💬</a>
</div>`
  );
  add('google-map', 'Google Maps', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    `<div style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d212928.32180933975!2d-7.734474!3d33.589886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7cd4778aa113b%3A0xb06c1d84f310fd3!2sCasablanca!5e0!3m2!1sfr!2sma!4v1700000000000"
    width="100%"
    height="350"
    style="border:none;display:block"
    allowfullscreen=""
    loading="lazy"
  ></iframe>
</div>`
  );
  add('image-carousel', 'Carrousel / Slider', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M18 2l4 4-4 4M6 2L2 6l4 4"/></svg>`,
    `<div style="position:relative;overflow:hidden;border-radius:12px;background:#0f172a">
  <div style="display:flex;transition:transform 0.4s ease">
    <div style="min-width:100%;height:320px;background:linear-gradient(135deg,#1e3a5f,#2563eb);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center">
      <h2 style="color:#fff;font-size:2rem;font-weight:800;margin:0 0 12px">Slide 1 — Titre principal</h2>
      <p style="color:#bfdbfe;font-size:1rem;margin:0 0 24px;max-width:480px">Description de la première slide. Personnalisez ce contenu librement.</p>
      <a href="#" style="padding:12px 32px;background:#fff;color:#1e3a5f;border-radius:8px;text-decoration:none;font-weight:700">En savoir plus</a>
    </div>
  </div>
  <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:8px">
    <div style="width:10px;height:10px;border-radius:50%;background:#fff"></div>
    <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.4)"></div>
    <div style="width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,0.4)"></div>
  </div>
  <button style="position:absolute;left:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.2);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem">‹</button>
  <button style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(255,255,255,0.2);border:none;color:#fff;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:1rem">›</button>
</div>`
  );
  add('testimonials-carousel', 'Carrousel Avis', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 2v4M16 2v4"/></svg>`,
    `<section style="padding:60px 20px;background:#f1f5f9;text-align:center">
  <h2 style="font-size:2rem;font-weight:800;color:#1e293b;margin:0 0 40px">Ce que disent nos clients</h2>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1000px;margin:0 auto">
    <div style="background:#fff;border-radius:16px;padding:28px;text-align:left;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="color:#f59e0b;font-size:1.2rem;margin-bottom:12px">★★★★★</div>
      <p style="color:#475569;font-style:italic;line-height:1.7;margin:0 0 20px;font-size:0.9rem">"Excellent service, je recommande vivement. Résultats au-delà de mes attentes."</p>
      <div style="display:flex;align-items:center;gap:10px">
        <img src="https://placehold.co/40/dbeafe/3b82f6?text=A" style="width:40px;height:40px;border-radius:50%"/>
        <div><div style="font-weight:700;font-size:0.85rem;color:#1e293b">Marie D.</div><div style="color:#64748b;font-size:0.8rem">Directrice Marketing</div></div>
      </div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px;text-align:left;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="color:#f59e0b;font-size:1.2rem;margin-bottom:12px">★★★★★</div>
      <p style="color:#475569;font-style:italic;line-height:1.7;margin:0 0 20px;font-size:0.9rem">"Professionnalisme, réactivité et qualité. Une équipe exceptionnelle."</p>
      <div style="display:flex;align-items:center;gap:10px">
        <img src="https://placehold.co/40/dcfce7/22c55e?text=B" style="width:40px;height:40px;border-radius:50%"/>
        <div><div style="font-weight:700;font-size:0.85rem;color:#1e293b">Ahmed K.</div><div style="color:#64748b;font-size:0.8rem">CEO Startup</div></div>
      </div>
    </div>
    <div style="background:#fff;border-radius:16px;padding:28px;text-align:left;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
      <div style="color:#f59e0b;font-size:1.2rem;margin-bottom:12px">★★★★☆</div>
      <p style="color:#475569;font-style:italic;line-height:1.7;margin:0 0 20px;font-size:0.9rem">"Très bonne collaboration, délais respectés, rendu impeccable."</p>
      <div style="display:flex;align-items:center;gap:10px">
        <img src="https://placehold.co/40/fce7f3/ec4899?text=C" style="width:40px;height:40px;border-radius:50%"/>
        <div><div style="font-weight:700;font-size:0.85rem;color:#1e293b">Sofia B.</div><div style="color:#64748b;font-size:0.8rem">Responsable Com.</div></div>
      </div>
    </div>
  </div>
</section>`
  );
  add('quote', 'Citation', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>`,
    `<blockquote style="border-left:5px solid #2563eb;padding:20px 28px;background:#f0f7ff;border-radius:0 12px 12px 0;max-width:640px;margin:0">
  <p style="font-size:1.3rem;font-style:italic;color:#1e293b;line-height:1.7;margin:0 0 16px;font-weight:500">"Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès. Si vous aimez ce que vous faites, vous réussirez."</p>
  <footer style="color:#64748b;font-size:0.9rem"><strong style="color:#2563eb">Albert Schweitzer</strong> — Philosophe</footer>
</blockquote>`
  );
  add('price-list', 'Liste de Prix', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    `<div style="max-width:600px">
  <h3 style="font-size:1.3rem;font-weight:800;color:#1e293b;margin:0 0 20px">Menu / Tarifs</h3>
  <div style="display:flex;flex-direction:column;gap:0">
    <div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px dashed #e2e8f0">
      <div style="flex:1">
        <div style="font-weight:600;color:#1e293b;font-size:0.95rem">Prestation / Service 1</div>
        <div style="color:#64748b;font-size:0.8rem;margin-top:2px">Description courte du service proposé</div>
      </div>
      <div style="white-space:nowrap;font-weight:700;color:#2563eb;font-size:1rem">450 MAD</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px dashed #e2e8f0">
      <div style="flex:1">
        <div style="font-weight:600;color:#1e293b;font-size:0.95rem">Prestation / Service 2</div>
        <div style="color:#64748b;font-size:0.8rem;margin-top:2px">Description courte du service proposé</div>
      </div>
      <div style="white-space:nowrap;font-weight:700;color:#2563eb;font-size:1rem">850 MAD</div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;padding:14px 0">
      <div style="flex:1">
        <div style="font-weight:600;color:#1e293b;font-size:0.95rem">Prestation / Service 3</div>
        <div style="color:#64748b;font-size:0.8rem;margin-top:2px">Description courte du service proposé</div>
      </div>
      <div style="white-space:nowrap;font-weight:700;color:#2563eb;font-size:1rem">1 200 MAD</div>
    </div>
  </div>
</div>`
  );
  add('timeline', 'Timeline / Étapes', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><circle cx="12" cy="6" r="3"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="18" r="3"/><line x1="12" y1="6" x2="20" y2="6"/><line x1="12" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>`,
    `<div style="padding:20px 0;max-width:600px">
  <div style="display:flex;gap:20px;margin-bottom:32px">
    <div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:40px;height:40px;background:#2563eb;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;flex-shrink:0">1</div>
      <div style="width:2px;background:#e2e8f0;flex:1;margin:8px 0"></div>
    </div>
    <div style="padding-top:6px">
      <div style="font-size:0.8rem;color:#2563eb;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Étape 1 — Janvier 2024</div>
      <h4 style="font-weight:700;color:#1e293b;margin:0 0 6px;font-size:1rem">Titre de l'étape</h4>
      <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin:0">Description de ce qui s'est passé lors de cette étape importante du projet.</p>
    </div>
  </div>
  <div style="display:flex;gap:20px;margin-bottom:32px">
    <div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:40px;height:40px;background:#7c3aed;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;flex-shrink:0">2</div>
      <div style="width:2px;background:#e2e8f0;flex:1;margin:8px 0"></div>
    </div>
    <div style="padding-top:6px">
      <div style="font-size:0.8rem;color:#7c3aed;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Étape 2 — Mars 2024</div>
      <h4 style="font-weight:700;color:#1e293b;margin:0 0 6px;font-size:1rem">Deuxième étape</h4>
      <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin:0">Poursuite du projet avec les prochaines actions concrètes définies.</p>
    </div>
  </div>
  <div style="display:flex;gap:20px">
    <div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:40px;height:40px;background:#059669;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.9rem;flex-shrink:0">3</div>
    </div>
    <div style="padding-top:6px">
      <div style="font-size:0.8rem;color:#059669;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:4px">Étape 3 — Juin 2024</div>
      <h4 style="font-weight:700;color:#1e293b;margin:0 0 6px;font-size:1rem">Objectif atteint</h4>
      <p style="color:#64748b;font-size:0.9rem;line-height:1.6;margin:0">Clôture du projet avec livraison finale et validation client.</p>
    </div>
  </div>
</div>`
  );
  add('logos-partners', 'Logos Partenaires', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="6" height="4" rx="1"/><rect x="9" y="7" width="6" height="4" rx="1"/><rect x="16" y="7" width="6" height="4" rx="1"/><rect x="2" y="13" width="6" height="4" rx="1"/><rect x="9" y="13" width="6" height="4" rx="1"/><rect x="16" y="13" width="6" height="4" rx="1"/></svg>`,
    `<section style="padding:48px 20px;background:#f8fafc">
  <p style="text-align:center;font-size:0.85rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:2px;margin:0 0 32px">Ils nous font confiance</p>
  <div style="display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;filter:grayscale(1);opacity:0.6">
    <div style="background:#e2e8f0;border-radius:8px;padding:12px 24px;font-weight:800;color:#475569;font-size:1.1rem">LOGO 1</div>
    <div style="background:#e2e8f0;border-radius:8px;padding:12px 24px;font-weight:800;color:#475569;font-size:1.1rem">LOGO 2</div>
    <div style="background:#e2e8f0;border-radius:8px;padding:12px 24px;font-weight:800;color:#475569;font-size:1.1rem">LOGO 3</div>
    <div style="background:#e2e8f0;border-radius:8px;padding:12px 24px;font-weight:800;color:#475569;font-size:1.1rem">LOGO 4</div>
    <div style="background:#e2e8f0;border-radius:8px;padding:12px 24px;font-weight:800;color:#475569;font-size:1.1rem">LOGO 5</div>
  </div>
</section>`
  );
  add('html-table', 'Tableau', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 9h20M2 14h20M7 4v16M12 4v16"/></svg>`,
    `<div style="overflow-x:auto;border-radius:12px;box-shadow:0 2px 16px rgba(0,0,0,0.08)">
  <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
    <thead>
      <tr style="background:#1e293b;color:#fff">
        <th style="padding:14px 16px;text-align:left;font-weight:600">Colonne 1</th>
        <th style="padding:14px 16px;text-align:left;font-weight:600">Colonne 2</th>
        <th style="padding:14px 16px;text-align:left;font-weight:600">Colonne 3</th>
        <th style="padding:14px 16px;text-align:left;font-weight:600">Colonne 4</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#fff;border-bottom:1px solid #f1f5f9">
        <td style="padding:12px 16px;color:#374151">Donnée 1</td>
        <td style="padding:12px 16px;color:#374151">Donnée 2</td>
        <td style="padding:12px 16px;color:#374151">Donnée 3</td>
        <td style="padding:12px 16px;color:#374151"><span style="padding:3px 10px;background:#dcfce7;color:#16a34a;border-radius:999px;font-size:0.8rem;font-weight:600">Actif</span></td>
      </tr>
      <tr style="background:#f8fafc;border-bottom:1px solid #f1f5f9">
        <td style="padding:12px 16px;color:#374151">Donnée 4</td>
        <td style="padding:12px 16px;color:#374151">Donnée 5</td>
        <td style="padding:12px 16px;color:#374151">Donnée 6</td>
        <td style="padding:12px 16px;color:#374151"><span style="padding:3px 10px;background:#fef3c7;color:#d97706;border-radius:999px;font-size:0.8rem;font-weight:600">Pending</span></td>
      </tr>
      <tr style="background:#fff">
        <td style="padding:12px 16px;color:#374151">Donnée 7</td>
        <td style="padding:12px 16px;color:#374151">Donnée 8</td>
        <td style="padding:12px 16px;color:#374151">Donnée 9</td>
        <td style="padding:12px 16px;color:#374151"><span style="padding:3px 10px;background:#fee2e2;color:#dc2626;border-radius:999px;font-size:0.8rem;font-weight:600">Inactif</span></td>
      </tr>
    </tbody>
  </table>
</div>`
  );
  add('stats-section', 'Section Statistiques', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    `<section style="padding:60px 20px;background:#1e293b">
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1000px;margin:0 auto;text-align:center">
    <div style="padding:24px">
      <div style="font-size:3rem;font-weight:800;color:#60a5fa;line-height:1">500+</div>
      <div style="color:#94a3b8;margin-top:8px;font-size:0.95rem">Clients satisfaits</div>
    </div>
    <div style="padding:24px">
      <div style="font-size:3rem;font-weight:800;color:#34d399;line-height:1">12</div>
      <div style="color:#94a3b8;margin-top:8px;font-size:0.95rem">Années d'expérience</div>
    </div>
    <div style="padding:24px">
      <div style="font-size:3rem;font-weight:800;color:#f472b6;line-height:1">98%</div>
      <div style="color:#94a3b8;margin-top:8px;font-size:0.95rem">Taux de satisfaction</div>
    </div>
    <div style="padding:24px">
      <div style="font-size:3rem;font-weight:800;color:#fbbf24;line-height:1">1K+</div>
      <div style="color:#94a3b8;margin-top:8px;font-size:0.95rem">Projets réalisés</div>
    </div>
  </div>
</section>`
  );
  add('before-after', 'Avant / Après', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="4" x2="12" y2="20" stroke-dasharray="4 2"/><path d="M7 12h2M15 12h2"/></svg>`,
    `<div style="display:grid;grid-template-columns:1fr 1fr;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;max-width:700px">
  <div style="position:relative">
    <img src="https://placehold.co/400x280/fee2e2/dc2626?text=AVANT" alt="Avant" style="width:100%;height:240px;object-fit:cover;display:block"/>
    <div style="position:absolute;top:12px;left:12px;background:rgba(220,38,38,0.85);color:#fff;padding:4px 12px;border-radius:999px;font-size:0.75rem;font-weight:700;text-transform:uppercase">Avant</div>
  </div>
  <div style="position:relative">
    <img src="https://placehold.co/400x280/dcfce7/16a34a?text=APRÈS" alt="Après" style="width:100%;height:240px;object-fit:cover;display:block"/>
    <div style="position:absolute;top:12px;left:12px;background:rgba(22,163,74,0.85);color:#fff;padding:4px 12px;border-radius:999px;font-size:0.75rem;font-weight:700;text-transform:uppercase">Après</div>
  </div>
</div>`
  );
  add('search-bar', 'Barre de Recherche', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    `<div style="max-width:600px">
  <div style="display:flex;gap:0;background:#fff;border:2px solid #e2e8f0;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.06)">
    <input type="text" placeholder="Rechercher..." style="flex:1;padding:14px 20px;border:none;outline:none;font-size:1rem;color:#374151"/>
    <button style="padding:14px 24px;background:#2563eb;color:#fff;border:none;cursor:pointer;font-weight:600;font-size:0.95rem">Rechercher</button>
  </div>
</div>`
  );
  add('breadcrumb', 'Fil d\'Ariane', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
    `<nav style="padding:12px 0;font-size:0.85rem">
  <ol style="list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:6px;align-items:center">
    <li><a href="#" style="color:#2563eb;text-decoration:none;font-weight:500">Accueil</a></li>
    <li style="color:#94a3b8">›</li>
    <li><a href="#" style="color:#2563eb;text-decoration:none;font-weight:500">Services</a></li>
    <li style="color:#94a3b8">›</li>
    <li style="color:#64748b;font-weight:600">Page courante</li>
  </ol>
</nav>`
  );
  add('code-block', 'Bloc de Code', 'Avancé',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    `<div style="background:#0f172a;border-radius:12px;overflow:hidden;max-width:640px">
  <div style="background:#1e293b;padding:10px 16px;display:flex;align-items:center;gap:8px">
    <div style="width:12px;height:12px;background:#ff5f57;border-radius:50%"></div>
    <div style="width:12px;height:12px;background:#febc2e;border-radius:50%"></div>
    <div style="width:12px;height:12px;background:#28c840;border-radius:50%"></div>
    <span style="color:#64748b;font-size:0.75rem;margin-left:8px">script.js</span>
  </div>
  <pre style="margin:0;padding:20px 24px;color:#e2e8f0;font-family:'Courier New',monospace;font-size:0.85rem;line-height:1.7;overflow-x:auto"><span style="color:#94a3b8">// Exemple de code</span>
<span style="color:#60a5fa">function</span> <span style="color:#34d399">greet</span>(<span style="color:#f8fafc">name</span>) {
  <span style="color:#60a5fa">return</span> <span style="color:#fbbf24">\`Bonjour, \${name} !\`</span>;
}
<span style="color:#94a3b8">console</span>.<span style="color:#34d399">log</span>(greet(<span style="color:#fbbf24">"monde"</span>));</pre>
</div>`
  );

  add('navbar', 'Navigation', 'Site',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="4" rx="1"/><path d="M8 12h8M4 16h16"/></svg>`,
    `<nav style="background:#1e293b;padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:64px">
  <div style="color:#fff;font-weight:800;font-size:1.3rem">LOGO</div>
  <div style="display:flex;gap:32px;align-items:center">
    <a href="#" style="color:#cbd5e1;text-decoration:none;font-size:0.9rem;font-weight:500">Accueil</a>
    <a href="#" style="color:#cbd5e1;text-decoration:none;font-size:0.9rem;font-weight:500">Services</a>
    <a href="#" style="color:#cbd5e1;text-decoration:none;font-size:0.9rem;font-weight:500">Projets</a>
    <a href="#" style="color:#cbd5e1;text-decoration:none;font-size:0.9rem;font-weight:500">À propos</a>
    <a href="#" style="padding:10px 22px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-size:0.9rem;font-weight:600">Contact</a>
  </div>
</nav>`
  );
  add('footer', 'Pied de page', 'Site',
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="16" width="20" height="6" rx="1"/><path d="M2 12h20M2 8h20"/></svg>`,
    `<footer style="background:#0f172a;color:#94a3b8;padding:48px 32px 24px">
  <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px;max-width:1200px;margin:0 auto 40px">
    <div>
      <div style="color:#fff;font-weight:800;font-size:1.3rem;margin-bottom:16px">LOGO</div>
      <p style="line-height:1.7;font-size:0.9rem;margin:0 0 16px">Agence créative spécialisée dans la communication 360°.</p>
    </div>
    <div>
      <h4 style="color:#fff;font-weight:700;margin:0 0 16px;font-size:0.9rem">Services</h4>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem">
        <a href="#" style="color:#94a3b8;text-decoration:none">Événementiel</a>
        <a href="#" style="color:#94a3b8;text-decoration:none">Impression</a>
        <a href="#" style="color:#94a3b8;text-decoration:none">Digital</a>
      </div>
    </div>
    <div>
      <h4 style="color:#fff;font-weight:700;margin:0 0 16px;font-size:0.9rem">Entreprise</h4>
      <div style="display:flex;flex-direction:column;gap:8px;font-size:0.85rem">
        <a href="#" style="color:#94a3b8;text-decoration:none">À propos</a>
        <a href="#" style="color:#94a3b8;text-decoration:none">Équipe</a>
        <a href="#" style="color:#94a3b8;text-decoration:none">Contact</a>
      </div>
    </div>
    <div>
      <h4 style="color:#fff;font-weight:700;margin:0 0 16px;font-size:0.9rem">Contact</h4>
      <div style="font-size:0.85rem;line-height:2">
        <div>📍 Casablanca, Maroc</div>
        <div>📞 +212 6 00 00 00 00</div>
        <div>✉️ contact@agence.ma</div>
      </div>
    </div>
  </div>
  <div style="border-top:1px solid #1e293b;padding-top:24px;text-align:center;font-size:0.8rem;max-width:1200px;margin:0 auto">
    © 2025 Agence. Tous droits réservés.
  </div>
</footer>`
  );
}

// ── Composant principal ──────────────────────────────────────────────────────
export default function GrapesJSEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [leftTab, setLeftTab] = useState<'blocks' | 'layers'>('blocks');
  const [rightTab, setRightTab] = useState<'style' | 'settings'>('style');
  const token = useAuthStore((s) => s.token);
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => { if (pageId) loadPage(); }, [pageId]);

  const loadPage = async () => {
    try {
      const currentToken = useAuthStore.getState().token;
      const headers = currentToken ? { Authorization: `Bearer ${currentToken}` } : {};
      const res = await fetch(`/api/grapes/pages/${pageId}`, { headers });
      if (res.ok) setPageData(await res.json());
      else console.error('Erreur chargement page:', res.status);
    } catch (e) { console.error("Chargement:", e); }
  };

  useEffect(() => {
    if (!editorRef.current || editor || !pageData) return;

    const grapesEditor = grapesjs.init({
      container: editorRef.current,
      height: "100%",
      width: "100%",
      storageManager: false,
      plugins: [gjsBlocksBasic],
      pluginsOpts: { gjsBlocksBasic: { flexGrid: true } },
      canvas: { styles: ['https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'] },
      blockManager:   { appendTo: '#gjs-blocks' },
      styleManager:   { appendTo: '#gjs-styles' },
      layerManager:   { appendTo: '#gjs-layers' },
      traitManager:   { appendTo: '#gjs-traits' },
      selectorManager:{ appendTo: '#gjs-selectors' },
      panels: { defaults: [] },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Tablet',  width: '768px',  widthMedia: '992px' },
          { name: 'Mobile',  width: '375px',  widthMedia: '480px' },
        ],
      },
    });

    registerCustomBlocks(grapesEditor);

    // Clic sur un bloc = ajout direct sur le canvas (pas seulement drag)
    grapesEditor.on('block:click', (block: any) => {
      const content = block.get('content');
      if (!content) return;
      const wrapper = grapesEditor.getWrapper();
      if (wrapper) {
        const added = wrapper.append(content);
        if (added && added[0]) grapesEditor.select(added[0]);
      }
    });

    if (pageData.html) grapesEditor.setComponents(pageData.html);
    if (pageData.css)  grapesEditor.setStyle(pageData.css);

    grapesEditor.Commands.add('set-device-desktop', { run: (e) => e.setDevice('Desktop') });
    grapesEditor.Commands.add('set-device-tablet',  { run: (e) => e.setDevice('Tablet') });
    grapesEditor.Commands.add('set-device-mobile',  { run: (e) => e.setDevice('Mobile') });
    grapesEditor.Commands.add('undo',  { run: (e) => e.UndoManager.undo() });
    grapesEditor.Commands.add('redo',  { run: (e) => e.UndoManager.redo() });

    setEditor(grapesEditor);
    return () => { grapesEditor.destroy(); };
  }, [pageData]);

  const handleSave = async () => {
    if (!editor || !pageId) return;
    setIsSaving(true);
    try {
      const currentToken = useAuthStore.getState().token;
      const saveHeaders = currentToken
        ? { 'Content-Type': 'application/json', Authorization: `Bearer ${currentToken}` }
        : { 'Content-Type': 'application/json' };
      const res = await fetch(`/api/grapes/pages/${pageId}`, {
        method: 'PUT',
        headers: saveHeaders,
        body: JSON.stringify({ html: editor.getHtml(), css: editor.getCss() }),
      });
      if (res.ok) toast.warning('Page sauvegardée !');
      else toast.error('Erreur lors de la sauvegarde');
    } catch { toast.error('Erreur réseau'); }
    finally { setIsSaving(false); }
  };

  const activeDevice = editor?.getDevice?.() ?? 'Desktop';

  const tabBtn = (active: boolean) =>
    `flex-1 py-2 text-xs font-semibold transition-colors ${active ? 'bg-white text-gray-900 shadow-sm rounded-md' : 'text-gray-500 hover:text-gray-700'}`;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* ── Topbar ─────────────────────────────────────────────────────── */}
      <div className="h-12 bg-gray-900 flex items-center justify-between px-3 flex-shrink-0 gap-3">
        {/* Gauche */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => navigate('/admin/visual-editor')}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs px-2 py-1.5 rounded hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="h-4 w-px bg-gray-700" />
          <div className="min-w-0">
            <span className="text-white font-semibold text-sm truncate">{pageData?.name || 'Chargement…'}</span>
            <span className="text-gray-500 text-xs ml-2 hidden sm:inline">{pageData?.path}</span>
          </div>
        </div>

        {/* Centre — devices */}
        <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
          {[
            { id: 'Desktop', Icon: Monitor,    cmd: 'set-device-desktop' },
            { id: 'Tablet',  Icon: Tablet,     cmd: 'set-device-tablet' },
            { id: 'Mobile',  Icon: Smartphone, cmd: 'set-device-mobile' },
          ].map(({ id, Icon, cmd }) => (
            <button
              key={id}
              title={id}
              onClick={() => editor?.runCommand(cmd)}
              className={`p-2 rounded-md transition-colors ${activeDevice === id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Droite — actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => editor?.runCommand('undo')}
            disabled={!editor}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors disabled:opacity-40"
            title="Annuler"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.runCommand('redo')}
            disabled={!editor}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors disabled:opacity-40"
            title="Rétablir"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-gray-700" />
          <button
            onClick={() => pageData?.path && window.open(`/${pageData.path}`, '_blank')}
            disabled={!pageData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-600 rounded-md transition-colors disabled:opacity-40"
          >
            <Eye className="w-3.5 h-3.5" /> Aperçu
          </button>
          <button
            onClick={handleSave}
            disabled={!editor || isSaving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Sauvegarde…' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* ── Corps de l'éditeur ───────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar gauche — Widgets / Calques ── */}
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="p-2 bg-gray-100 border-b border-gray-200">
            <div className="flex bg-gray-200 rounded-lg p-0.5">
              <button
                className={tabBtn(leftTab === 'blocks')}
                onClick={() => setLeftTab('blocks')}
              >
                <LayoutGrid className="w-3.5 h-3.5 inline mr-1" /> Widgets
              </button>
              <button
                className={tabBtn(leftTab === 'layers')}
                onClick={() => setLeftTab('layers')}
              >
                <Layers className="w-3.5 h-3.5 inline mr-1" /> Calques
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div id="gjs-blocks" className={leftTab === 'blocks' ? '' : 'hidden'} />
            <div id="gjs-layers" className={leftTab === 'layers' ? '' : 'hidden'} />
          </div>
        </div>

        {/* ── Canvas ── */}
        <div className="flex-1 overflow-hidden bg-gray-200" ref={editorRef} />

        {/* ── Sidebar droite — Style / Paramètres ── */}
        <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="p-2 bg-gray-100 border-b border-gray-200">
            <div className="flex bg-gray-200 rounded-lg p-0.5">
              <button
                className={tabBtn(rightTab === 'style')}
                onClick={() => setRightTab('style')}
              >
                <Paintbrush className="w-3.5 h-3.5 inline mr-1" /> Style
              </button>
              <button
                className={tabBtn(rightTab === 'settings')}
                onClick={() => setRightTab('settings')}
              >
                <Settings2 className="w-3.5 h-3.5 inline mr-1" /> Paramètres
              </button>
            </div>
          </div>
          {/* Sélecteurs */}
          <div className="border-b border-gray-100 px-2 py-1">
            <div id="gjs-selectors" />
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div id="gjs-styles"  className={rightTab === 'style'    ? '' : 'hidden'} />
            <div id="gjs-traits"  className={rightTab === 'settings' ? '' : 'hidden'} />
          </div>
        </div>
      </div>

      {/* ── Styles GrapesJS overrides ─────────────────────────────────── */}
      <style>{`
        #gjs-blocks .gjs-blocks-section { padding: 8px 12px 4px; }
        #gjs-blocks .gjs-blocks-section__title { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
        #gjs-blocks .gjs-block { width: 80px; height: 68px; padding: 8px 4px 6px; border: 1px solid #e5e7eb; border-radius: 8px; margin: 4px; text-align: center; cursor: grab; transition: border-color 0.15s, box-shadow 0.15s; background: #fff; }
        #gjs-blocks .gjs-block:hover { border-color: #3b82f6; box-shadow: 0 2px 8px rgba(59,130,246,0.15); }
        #gjs-blocks .gjs-block__media { font-size: 0; line-height: 0; display: flex; align-items: center; justify-content: center; height: 32px; }
        #gjs-blocks .gjs-block__media svg { width: 22px; height: 22px; color: #6366f1; }
        #gjs-blocks .gjs-block-label { font-size: 9.5px; color: #374151; line-height: 1.3; font-weight: 500; margin-top: 4px; }
        #gjs-blocks .gjs-blocks-no-cat { display: none; }
        #gjs-styles .gjs-sm-sector-title { background: #f9fafb; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 700; padding: 8px 12px; color: #374151; letter-spacing: 0.04em; text-transform: uppercase; }
        #gjs-styles .gjs-sm-property { padding: 6px 12px; }
        #gjs-styles .gjs-sm-label { font-size: 11px; color: #6b7280; font-weight: 500; }
        #gjs-styles .gjs-sm-input { border: 1px solid #d1d5db; border-radius: 6px; font-size: 12px; }
        #gjs-traits .gjs-trt-trait { padding: 6px 12px; }
        #gjs-traits .gjs-label { font-size: 11px; color: #6b7280; font-weight: 500; }
        #gjs-layers .gjs-layer { font-size: 12px; }
        .gjs-toolbar { background: #1e293b; border-radius: 6px; }
        .gjs-toolbar-item { color: #e2e8f0; }
        .gjs-toolbar-item:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .gjs-resizer-h { border-color: #3b82f6; }
        .gjs-selected { outline: 2px solid #3b82f6 !important; }
        .gjs-hovered  { outline: 1px dashed #93c5fd !important; }
        .gjs-badge { background: #3b82f6; font-size: 10px; border-radius: 4px; }
        .gjs-frame-wrapper { background: #e5e7eb; }
      `}</style>
    </div>
  );
}
