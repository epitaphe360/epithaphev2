import React from 'react';
import type { Config, CustomField } from '@measured/puck';
import { ImageUploadField } from '../components/ImageUploadField';
import { EmojiPickerField } from '../components/EmojiPickerField';

// Champ image réutilisable (URL + upload depuis PC)
const imageField = (label: string): CustomField => ({
  type: 'custom',
  render: ({ value, onChange }) => (
    <ImageUploadField value={value ?? ''} onChange={onChange} label={label} />
  ),
});

// Champ emoji réutilisable (picker visuel)
const emojiField = (label: string): CustomField => ({
  type: 'custom',
  render: ({ value, onChange }) => (
    <EmojiPickerField value={value ?? '⭐'} onChange={onChange} label={label} />
  ),
});

// ─── Métadonnées visuelles de chaque composant ───────────────────────────────
// Utilisé dans l'override componentItem de PuckSectionsEditor pour afficher
// une icône colorée + une description dans le panneau composants.
export const COMPONENT_META: Record<string, { icon: string; color: string; description: string }> = {
  // ── Basique ──
  heading:          { icon: '𝐇',  color: '#6366f1', description: 'Titre h1 à h6' },
  paragraph:        { icon: '¶',  color: '#8b5cf6', description: 'Bloc de texte paragraphe' },
  button:           { icon: '⬡',  color: '#a855f7', description: 'Bouton lien ou action' },
  image:            { icon: '🖼', color: '#ec4899', description: 'Image avec légende' },
  divider:          { icon: '─',  color: '#d1d5db', description: 'Ligne séparatrice' },
  spacer:           { icon: '↕',  color: '#9ca3af', description: 'Espace vertical vide' },
  icon:             { icon: '★',  color: '#f59e0b', description: 'Icône SVG ou emoji' },
  // ── Layout ──
  section:          { icon: '▣',  color: '#0ea5e9', description: 'Conteneur / wrapper' },
  columns:          { icon: '⋮⋮', color: '#38bdf8', description: 'Grille multi-colonnes' },
  tabs:             { icon: '⇥',  color: '#06b6d4', description: 'Onglets tabulés' },
  accordion:        { icon: '≡',  color: '#14b8a6', description: 'Accordéon pliable' },
  // ── Média ──
  video:            { icon: '▶',  color: '#f97316', description: 'Vidéo YouTube ou Vimeo' },
  gallery:          { icon: '⊞',  color: '#ef4444', description: 'Galerie d\'images' },
  carousel:         { icon: '◁▷', color: '#dc2626', description: 'Carousel / slider' },
  map:              { icon: '◉',  color: '#16a34a', description: 'Carte Google Maps' },
  // ── Interactif ──
  'icon-box':       { icon: '⬡',  color: '#7c3aed', description: 'Icône + titre + texte' },
  counter:          { icon: '⏱', color: '#2563eb', description: 'Compteur animé' },
  'pricing-table':  { icon: '$',  color: '#059669', description: 'Tableau de prix' },
  'testimonial-card':{ icon: '"', color: '#0891b2', description: 'Carte témoignage client' },
  'cta-banner':     { icon: '📣', color: '#db2777', description: 'Bannière call-to-action' },
  alert:            { icon: '⚠',  color: '#d97706', description: 'Alerte / notification' },
  // ── Social ──
  'social-icons':   { icon: '⊛',  color: '#4f46e5', description: 'Icônes réseaux sociaux' },
  'latest-posts':   { icon: '📰', color: '#7c3aed', description: 'Derniers articles auto' },
  // ── Hero (custom) ──
  hero:             { icon: '🎪', color: '#7c3aed', description: 'Bandeau principal (hero plein écran)' },
  'service-hero':   { icon: '🎯', color: '#6d28d9', description: 'Hero page de service avec tag' },
  // ── Sections (custom) ──
  intro:            { icon: '👁', color: '#2563eb', description: 'Intro agence — texte + image + bullets' },
  pitch:            { icon: '💬', color: '#0891b2', description: 'Pitch — titre + corps court' },
  'hub-cards':      { icon: '🃏', color: '#0284c7', description: 'Cartes hub — liens services en grille' },
  'service-blocks': { icon: '⊞',  color: '#0369a1', description: 'Blocs services — grille 4 cartes' },
  avantages:        { icon: '✓',  color: '#047857', description: 'Avantages — grille 6 cartes icon' },
  poles:            { icon: '①',  color: '#065f46', description: 'Pôles d\'expertise numérotés' },
  faq:              { icon: '?',  color: '#15803d', description: 'FAQ accordéon questions/réponses' },
  team:             { icon: '👥', color: '#1d4ed8', description: 'Grille membres d\'équipe' },
  'image-text':     { icon: '⧉',  color: '#1e40af', description: 'Image + texte côte à côte' },
  richtext:         { icon: '✎',  color: '#3730a3', description: 'HTML libre (code riche)' },
  // ── Preuves sociales (custom) ──
  stats:            { icon: '📊', color: '#1d4ed8', description: 'Statistiques chiffrées animées' },
  clients:          { icon: '🏢', color: '#7c3aed', description: 'Logos clients en carousel' },
  'references-strip':{ icon: '★', color: '#6d28d9', description: 'Bande références / logos partenaires' },
  testimonial:      { icon: '💬', color: '#9333ea', description: 'Témoignage client — citation + auteur' },
  // ── Outils (custom) ──
  commpulse:        { icon: '⚡', color: '#b45309', description: 'Bandeau CommPulse — outil intégré' },
  fabrique:         { icon: '🏭', color: '#c2410c', description: 'Bloc La Fabrique 360' },
  'tools-grid':     { icon: '🔧', color: '#9a3412', description: 'Grille outils / produits' },
  'resources-grid': { icon: '📚', color: '#7c2d12', description: 'Grille de ressources téléchargeables' },
  articles:         { icon: '📰', color: '#92400e', description: 'Derniers articles de blog (auto)' },
  // ── CTA / Forms (custom) ──
  cta:              { icon: '📣', color: '#db2777', description: 'Call to action — fond coloré' },
  'contact-form':   { icon: '✉',  color: '#be185d', description: 'Formulaire de contact avec hero' },
};

export const config: Config = {
  categories: {
    'Basique': { components: ['heading', 'paragraph', 'button', 'image', 'divider', 'spacer', 'icon'] },
    'Layout': { components: ['section', 'columns', 'tabs', 'accordion'] },
    'Média': { components: ['video', 'gallery', 'carousel', 'map'] },
    'Interactif': { components: ['icon-box', 'counter', 'pricing-table', 'testimonial-card', 'cta-banner', 'alert'] },
    'Social': { components: ['social-icons', 'latest-posts'] },
    'Hero (custom)': { components: ['hero', 'service-hero'] },
    'Sections (custom)': { components: ['intro', 'pitch', 'hub-cards', 'service-blocks', 'avantages', 'poles', 'faq', 'team', 'image-text', 'richtext'] },
    'Preuves sociales (custom)': { components: ['stats', 'clients', 'references-strip', 'testimonial'] },
    'Outils (custom)': { components: ['commpulse', 'fabrique', 'tools-grid', 'resources-grid', 'articles'] },
    'CTA / Forms (custom)': { components: ['cta', 'contact-form'] }
  },
  components: {
    hero: {
      fields: {
        titleLine1: { type: 'text' },
        titleLine2: { type: 'text' },
        subtitle: { type: 'textarea' },
        backgroundImage: imageField('Image de fond'),
      },
      render: ({ titleLine1, titleLine2, subtitle, backgroundImage }) => (
        <div className="relative h-[400px] flex flex-col items-center justify-center text-white text-center p-8 bg-gray-900 border-dashed border-2 border-transparent hover:border-blue-400">
          {backgroundImage && <img draggable="false" style={{ pointerEvents: "none" }} src={backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />}
          <div className="relative z-10 ">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{titleLine1}<br/>{titleLine2}</h1>
            <p className="text-xl">{subtitle}</p>
          </div>
        </div>
      )
    },
    'service-hero': {
      fields: {
        tag: { type: 'text' },
        title: { type: 'text' },
        subtitle: { type: 'textarea' },
        backgroundImage: imageField('Image de fond'),
      },
      render: ({ tag, title, subtitle, backgroundImage }) => (
        <div className="relative h-[350px] flex flex-col items-center justify-center text-white p-8 bg-blue-900 border-dashed border-2 border-transparent hover:border-blue-400">
          {backgroundImage && <img draggable="false" style={{ pointerEvents: "none" }} src={backgroundImage} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />}
          <div className="relative z-10 text-center max-w-3xl ">
            {tag && <span className="uppercase tracking-widest text-sm font-bold opacity-80">{tag}</span>}
            <h1 className="text-4xl font-bold mt-2 mb-4">{title}</h1>
            <p className="text-lg">{subtitle}</p>
          </div>
        </div>
      )
    },
    richtext: {
      fields: { html: { type: 'textarea' } },
      render: ({ html }) => (
        <div className="py-12 px-4 max-w-4xl mx-auto prose " dangerouslySetInnerHTML={{ __html: html || '<p>Texte par défaut...</p>' }} />
      )
    },
    'image-text': {
      fields: {
        title: { type: 'text' },
        body: { type: 'textarea' },
        image: imageField('Image'),
        imagePosition: { type: 'radio', options: [{label: 'Left', value: 'left'}, {label:'Right', value:'right'}] }
      },
      render: ({ title, body, image, imagePosition }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center ">
          {imagePosition === 'left' && image && <img draggable="false" style={{ pointerEvents: "none" }} src={image} className="w-full md:w-1/2 rounded-lg shadow-md" alt="" />}
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{body}</p>
          </div>
          {imagePosition !== 'left' && image && <img draggable="false" style={{ pointerEvents: "none" }} src={image} className="w-full md:w-1/2 rounded-lg shadow-md" alt="" />}
        </div>
      )
    },
    cta: {
      fields: { title: { type: 'text' }, body: { type: 'textarea' } },
      render: ({ title, body }) => (
        <div className="py-16 px-4 bg-pink-500 text-white text-center ">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg opacity-90">{body}</p>
          </div>
        </div>
      )
    },
    intro: {
      fields: { eyebrow: { type: 'text' }, title: { type: 'text' }, bodyHtml: { type: 'textarea' }, image: imageField('Image') },
      render: ({ eyebrow, title, bodyHtml, image }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto text-center ">
          <span className="text-pink-600 font-bold uppercase tracking-wider">{eyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-8">{title}</h2>
          <div className="text-lg text-gray-600 max-w-3xl mx-auto mb-12" dangerouslySetInnerHTML={{ __html: bodyHtml || '' }} />
          {image && <img draggable="false" style={{ pointerEvents: "none" }} src={image} className="mx-auto rounded-xl shadow-lg" alt="" />}
        </div>
      )
    },
    pitch: {
      fields: { title: { type: 'text' }, body: { type: 'textarea' } },
      render: ({ title, body }) => (
        <div className="py-16 px-4 bg-gray-50 text-center ">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
            <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap">{body}</p>
          </div>
        </div>
      )
    },
    'hub-cards': {
      fields: {
        title: { type: 'text' }, subtitle: { type: 'text' },
        items: { type: 'array', arrayFields: { title: {type:'text'}, description: {type:'textarea'}, href: {type:'text'} } }
      },
      render: ({ title, subtitle, items }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(items || []).map((item: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 mb-4">{item.description}</p>
                <div className="text-blue-600 font-medium">En savoir plus →</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'service-blocks': {
      fields: {
        title: { type: 'text' },
        items: { type: 'array', arrayFields: { title: {type:'text'}, description: {type:'textarea'} } }
      },
      render: ({ title, items }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto bg-slate-50 rounded-2xl my-8 ">
          {title && <h2 className="text-3xl font-bold mb-12 text-center">{title}</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {(items || []).map((item: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    avantages: {
      fields: {
        title: { type: 'text' }, subtitle: { type: 'text' },
        items: { type: 'array', arrayFields: { title: {type:'text'}, desc: {type:'textarea'} } }
      },
      render: ({ title, subtitle, items }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {(items || []).map((item: any, i: number) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">{i+1}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    poles: {
      fields: {
        title: { type: 'text' }, subtitle: { type: 'text' },
        items: { type: 'array', arrayFields: { title: {type:'text'}, desc: {type:'textarea'}, num: {type:'text'} } }
      },
      render: ({ title, subtitle, items }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto bg-gray-900 text-white rounded-3xl my-8 ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8">
             {(items || []).map((item: any, i: number) => (
              <div key={i} className="flex gap-4 border border-gray-800 p-6 rounded-xl">
                <div className="text-4xl font-bold text-pink-500 opacity-50">{item.num || i+1}</div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    faq: {
      fields: {
        title: { type: 'text' },
        items: { type: 'array', arrayFields: { question: {type:'text'}, answer: {type:'textarea'} } }
      },
      render: ({ title, items }) => (
        <div className="py-16 px-4 max-w-3xl mx-auto ">
          <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
          <div className="space-y-4">
            {(items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-bold">{item.question}</h3>
                <p className="text-gray-600 mt-2">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    team: {
      fields: {
        title: { type: 'text' }, subtitle: { type: 'text' },
        members: { type: 'array', arrayFields: { name: {type:'text'}, role: {type:'text'} } }
      },
      render: ({ title, subtitle, members }) => (
        <div className="py-16 px-4 max-w-6xl mx-auto ">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(members || []).map((m: any, i: number) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-bold">{m.name}</h3>
                <p className="text-sm text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    stats: {
      fields: {
        title: { type: 'text' },
        items: { type: 'array', arrayFields: { value: {type:'number'}, suffix: {type:'text'}, label: {type:'text'} } }
      },
      render: ({ title, items }) => (
         <div className="py-12 px-4 bg-blue-600 text-white ">
           {title && <h2 className="text-center text-2xl font-bold mb-8">{title}</h2>}
           <div className="max-w-4xl mx-auto flex flex-wrap justify-around text-center gap-8">
             {(items || []).map((item: any, i: number) => (
               <div key={i}>
                 <div className="text-4xl md:text-5xl font-bold mb-2">{item.value}{item.suffix}</div>
                 <div className="text-blue-200 uppercase tracking-widest text-sm">{item.label}</div>
               </div>
             ))}
           </div>
         </div>
      )
    },
    clients: {
      fields: { title: { type: 'text' } },
      render: ({ title }) => (
        <div className="py-12 px-4 text-center bg-gray-50 border-y ">
          <h2 className="text-xl font-medium text-gray-500 mb-6">{title || 'Ils nous font confiance'}</h2>
          <div className="flex justify-center gap-8 opacity-50">
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
            <div className="h-8 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      )
    },
    'references-strip': {
      label: 'Références / Logos',
      fields: {
        title: { type: 'text' },
        logos: {
          type: 'array',
          arrayFields: {
            name: { type: 'text', label: 'Nom du client' },
            logoUrl: { type: 'text', label: 'URL du logo' },
          },
          defaultItemProps: { name: 'Client', logoUrl: '' },
          getItemSummary: (item: any) => item.name || 'Logo',
        },
        grayscale: { type: 'radio', options: [{ label: 'Couleur', value: 'color' }, { label: 'Gris', value: 'grayscale' }] },
        logoHeight: { type: 'number' },
      },
      defaultProps: {
        title: 'Ils nous font confiance',
        grayscale: 'grayscale',
        logoHeight: 48,
        logos: [
          { name: 'Maroc Telecom', logoUrl: 'https://upload.wikimedia.org/wikipedia/fr/thumb/2/20/Maroc_Telecom_logo.svg/320px-Maroc_Telecom_logo.svg.png' },
          { name: 'Accor Maroc', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Accor_logo_%282023%29.svg/320px-Accor_logo_%282023%29.svg.png' },
          { name: 'OCP Group', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/OCP_Group_logo.svg/320px-OCP_Group_logo.svg.png' },
          { name: 'CFC Casablanca Finance City', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Casablanca_Finance_City_Logo.svg/320px-Casablanca_Finance_City_Logo.svg.png' },
        ],
      },
      render: ({ title, logos, grayscale, logoHeight }: any) => {
        const h = logoHeight || 48;
        const items: any[] = Array.isArray(logos) ? logos : [];
        return (
          <div className="py-12 px-4 text-center border-y bg-white">
            {title && (
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">{title}</h2>
            )}
            {items.length === 0 ? (
              <p className="text-gray-300 italic text-sm">Ajoutez des logos dans le panneau de droite →</p>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {items.map((logo: any, i: number) => (
                  logo.logoUrl ? (
                    <img
                      key={i}
                      src={logo.logoUrl}
                      alt={logo.name || ''}
                      title={logo.name || ''}
                      style={{
                        height: `${h}px`,
                        width: 'auto',
                        maxWidth: '160px',
                        objectFit: 'contain',
                        filter: grayscale === 'grayscale' ? 'grayscale(100%)' : 'none',
                        opacity: grayscale === 'grayscale' ? 0.6 : 1,
                        transition: 'filter 0.2s, opacity 0.2s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'none'; (e.currentTarget as HTMLImageElement).style.opacity = '1'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.filter = grayscale === 'grayscale' ? 'grayscale(100%)' : 'none'; (e.currentTarget as HTMLImageElement).style.opacity = grayscale === 'grayscale' ? '0.6' : '1'; }}
                    />
                  ) : (
                    <span key={i} style={{ height: `${h}px`, display: 'flex', alignItems: 'center', fontWeight: 700, color: '#9ca3af', fontSize: 14 }}>
                      {logo.name}
                    </span>
                  )
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    testimonial: {
      fields: { content: { type: 'textarea' }, author: { type: 'text' }, role: { type: 'text' }, company: { type: 'text' } },
      render: ({ content, author, role, company }) => (
        <div className="py-16 px-4 max-w-4xl mx-auto text-center ">
          <p className="text-2xl italic font-serif text-gray-700 mb-8">"{content}"</p>
          <div>
            <div className="font-bold text-lg">{author}</div>
            <div className="text-gray-500">{role} {company ? `• ${company}` : ''}</div>
          </div>
        </div>
      )
    },
    commpulse: {
        fields: { title: { type: 'text' }, body: { type: 'textarea' } },
        render: ({ title, body }) => (
          <div className="py-16 px-4 max-w-6xl mx-auto bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-3xl ">
             <div className="text-center max-w-3xl mx-auto">
               <div className="mb-4 inline-block bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Outil</div>
               <h2 className="text-3xl md:text-5xl font-bold mb-6">{title || 'CommPulse'}</h2>
               <p className="text-xl mb-8 opacity-90">{body || "Simulez l'impact de vos actions."}</p>
             </div>
          </div>
        )
    },
    fabrique: {
        fields: { title: { type: 'text' }, body: { type: 'textarea' } },
        render: ({ title, body }) => (
          <div className="py-16 px-4 bg-orange-50 ">
             <div className="max-w-4xl mx-auto text-center">
               <h2 className="text-3xl font-bold text-orange-600 mb-6">{title || 'La Fabrique 360'}</h2>
               <p className="text-lg text-gray-700">{body || 'Notre bloc de production.'}</p>
             </div>
          </div>
        )
    },
    'tools-grid': {
        fields: { title: { type: 'text' }, subtitle: { type: 'text' } },
        render: ({ title, subtitle }) => (
          <div className="py-16 px-4 max-w-6xl mx-auto ">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">{title || 'Nos Outils'}</h2>
               <p className="text-gray-600">{subtitle}</p>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-100 p-8 rounded text-center font-bold text-gray-400">[Grille générée dynamiquement]</div>
             </div>
          </div>
        )
    },
    'resources-grid': {
        fields: { title: { type: 'text' }, subtitle: { type: 'text' } },
        render: ({ title, subtitle }) => (
          <div className="py-16 px-4 max-w-6xl mx-auto ">
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">{title || 'Ressources utiles'}</h2>
               <p className="text-gray-600">{subtitle}</p>
             </div>
          </div>
        )
    },
    articles: {
        fields: { title: { type: 'text' }, limit: { type: 'number' } },
        render: ({ title, limit }) => (
          <div className="py-16 px-4 bg-slate-50 border-y ">
             <div className="max-w-6xl mx-auto">
               <h2 className="text-3xl font-bold mb-8">{title || 'Derniers articles'}</h2>
               <div className="text-gray-500 italic">[Affiche les {limit || 3} derniers articles automatiquement]</div>
             </div>
          </div>
        )
    },
    'contact-form': {
      fields: { heroTitle: { type: 'text' }, heroSubtitle: { type: 'textarea' } },
      render: ({ heroTitle, heroSubtitle }) => (
        <div className="py-16 px-4 flex flex-col md:flex-row gap-12 max-w-6xl mx-auto ">
           <div className="w-full md:w-1/2">
             <h1 className="text-4xl font-bold mb-4">{heroTitle || 'Contact'}</h1>
             <p className="text-gray-600 mb-8 w-full md:w-1/2">{heroSubtitle}</p>
           </div>
           <div className="p-8 bg-white shadow-xl rounded-xl border border-gray-100 flex-1">
             <div className="text-gray-400 text-center font-bold py-12">[Formulaire React ici dans l'affichage final]</div>
           </div>
        </div>
      )
    },

    // ════════════════════════════════════════════════════════════════
    // PACK ELEMENTOR-LIKE — Widgets atomiques génériques
    // ════════════════════════════════════════════════════════════════

    // ─── BASIQUE ─────────────────────────────────────────────────────
    heading: {
      label: 'Titre',
      fields: {
        text: { type: 'text' },
        level: { type: 'select', options: [
          { label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' },
          { label: 'H4', value: 'h4' }, { label: 'H5', value: 'h5' }, { label: 'H6', value: 'h6' },
        ]},
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' }, { label: 'Droite', value: 'right' },
        ]},
        color: { type: 'text' },
      },
      defaultProps: { text: 'Mon titre', level: 'h2', align: 'left', color: '#111827' },
      render: ({ text, level, align, color }) => {
        const Tag = (level || 'h2') as keyof JSX.IntrinsicElements;
        const sizes: Record<string, string> = { h1: 'text-5xl', h2: 'text-4xl', h3: 'text-3xl', h4: 'text-2xl', h5: 'text-xl', h6: 'text-lg' };
        return (
          <div className="px-4 py-2" style={{ textAlign: align as any }}>
            <Tag className={`font-bold ${sizes[level || 'h2']}`} style={{ color }}>{text}</Tag>
          </div>
        );
      },
    },

    paragraph: {
      label: 'Paragraphe',
      fields: {
        text: { type: 'textarea' },
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' }, { label: 'Droite', value: 'right' }, { label: 'Justifié', value: 'justify' },
        ]},
        size: { type: 'select', options: [
          { label: 'Petit', value: 'sm' }, { label: 'Normal', value: 'base' }, { label: 'Moyen', value: 'lg' }, { label: 'Grand', value: 'xl' },
        ]},
        color: { type: 'text' },
      },
      defaultProps: { text: 'Votre texte ici. Cliquez pour éditer.', align: 'left', size: 'base', color: '#374151' },
      render: ({ text, align, size, color }) => (
        <div className="px-4 py-2 max-w-4xl mx-auto" style={{ textAlign: align as any }}>
          <p className={`text-${size} whitespace-pre-wrap leading-relaxed`} style={{ color }}>{text}</p>
        </div>
      ),
    },

    button: {
      label: 'Bouton',
      fields: {
        label: { type: 'text' },
        href: { type: 'text' },
        variant: { type: 'select', options: [
          { label: 'Plein (rose)', value: 'primary' }, { label: 'Plein (noir)', value: 'dark' },
          { label: 'Outline', value: 'outline' }, { label: 'Texte', value: 'ghost' },
        ]},
        size: { type: 'radio', options: [
          { label: 'S', value: 'sm' }, { label: 'M', value: 'md' }, { label: 'L', value: 'lg' },
        ]},
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' }, { label: 'Droite', value: 'right' },
        ]},
        fullWidth: { type: 'radio', options: [{ label: 'Auto', value: 'auto' }, { label: 'Pleine largeur', value: 'full' }] },
      },
      defaultProps: { label: 'Cliquer ici', href: '#', variant: 'primary', size: 'md', align: 'left', fullWidth: 'auto' },
      render: ({ label, href, variant, size, align, fullWidth }) => {
        const variants: Record<string, string> = {
          primary: 'bg-pink-500 text-white hover:bg-pink-600',
          dark: 'bg-gray-900 text-white hover:bg-gray-800',
          outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
          ghost: 'text-pink-500 hover:underline',
        };
        const sizes: Record<string, string> = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
        return (
          <div className="px-4 py-3" style={{ textAlign: align as any }}>
            <a href={href || '#'} onClick={(e) => e.preventDefault()}
               className={`inline-block rounded-md font-semibold transition ${variants[variant || 'primary']} ${sizes[size || 'md']} ${fullWidth === 'full' ? 'w-full text-center' : ''}`}>
              {label}
            </a>
          </div>
        );
      },
    },

    image: {
      label: 'Image',
      fields: {
        src: { type: 'text' },
        alt: { type: 'text' },
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' }, { label: 'Droite', value: 'right' },
        ]},
        width: { type: 'select', options: [
          { label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: '75%', value: '75' },
          { label: '100%', value: '100' }, { label: 'Auto', value: 'auto' },
        ]},
        rounded: { type: 'select', options: [
          { label: 'Aucun', value: 'none' }, { label: 'Léger', value: 'sm' }, { label: 'Moyen', value: 'md' }, { label: 'Grand', value: 'lg' }, { label: 'Cercle', value: 'full' },
        ]},
        href: { type: 'text' },
      },
      defaultProps: { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', alt: '', align: 'center', width: '100', rounded: 'md', href: '' },
      render: ({ src, alt, align, width, rounded, href }) => {
        const widths: Record<string, string> = { '25': '25%', '50': '50%', '75': '75%', '100': '100%', auto: 'auto' };
        const rounds: Record<string, string> = { none: '0', sm: '4px', md: '8px', lg: '16px', full: '9999px' };
        const justify: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
        const img = (
          <img draggable="false" style={{ pointerEvents: 'none', width: widths[width || '100'], borderRadius: rounds[rounded || 'md'] }}
               src={src} alt={alt || ''} />
        );
        return (
          <div className="px-4 py-3 flex" style={{ justifyContent: justify[align || 'center'] }}>
            {href ? <a href={href} onClick={(e) => e.preventDefault()}>{img}</a> : img}
          </div>
        );
      },
    },

    divider: {
      label: 'Séparateur',
      fields: {
        style: { type: 'select', options: [
          { label: 'Trait plein', value: 'solid' }, { label: 'Pointillés', value: 'dashed' }, { label: 'Points', value: 'dotted' }, { label: 'Double', value: 'double' },
        ]},
        thickness: { type: 'number' },
        color: { type: 'text' },
        width: { type: 'select', options: [
          { label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: '75%', value: '75' }, { label: '100%', value: '100' },
        ]},
      },
      defaultProps: { style: 'solid', thickness: 1, color: '#e5e7eb', width: '100' },
      render: ({ style, thickness, color, width }) => (
        <div className="px-4 py-4 flex justify-center">
          <hr style={{ borderTopStyle: style as any, borderTopWidth: thickness, borderColor: color, width: `${width}%`, margin: 0 }} />
        </div>
      ),
    },

    spacer: {
      label: 'Espaceur',
      fields: { height: { type: 'number' } },
      defaultProps: { height: 50 },
      render: ({ height }) => <div style={{ height: `${height || 50}px` }} aria-hidden="true" />,
    },

    icon: {
      label: 'Icône',
      fields: {
        emoji: emojiField('Icône / Emoji'),
        size: { type: 'number' },
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' }, { label: 'Droite', value: 'right' },
        ]},
        color: { type: 'text' },
      },
      defaultProps: { emoji: '⭐', size: 64, align: 'center', color: '#ec4899' },
      render: ({ emoji, size, align, color }) => (
        <div className="px-4 py-3" style={{ textAlign: align as any }}>
          <span style={{ fontSize: `${size}px`, color, lineHeight: 1, display: 'inline-block' }}>{emoji}</span>
        </div>
      ),
    },

    // ─── LAYOUT ──────────────────────────────────────────────────────
    section: {
      label: 'Section / Container',
      fields: {
        title: { type: 'text' },
        content: { type: 'textarea' },
        bgColor: { type: 'text' },
        bgImage: imageField('Image de fond (optionnel)'),
        textColor: { type: 'text' },
        paddingY: { type: 'number' },
        maxWidth: { type: 'select', options: [
          { label: 'Étroit (640px)', value: 'sm' }, { label: 'Moyen (768px)', value: 'md' },
          { label: 'Standard (1024px)', value: 'lg' }, { label: 'Large (1280px)', value: 'xl' }, { label: 'Pleine largeur', value: 'full' },
        ]},
      },
      defaultProps: { title: 'Titre de la section', content: 'Contenu de votre section ici.', bgColor: '#f9fafb', bgImage: '', textColor: '#111827', paddingY: 64, maxWidth: 'lg' },
      render: ({ title, content, bgColor, bgImage, textColor, paddingY, maxWidth }) => {
        const widths: Record<string, string> = { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', full: '100%' };
        return (
          <div className="px-4 relative" style={{ backgroundColor: bgColor, color: textColor, paddingTop: `${paddingY}px`, paddingBottom: `${paddingY}px` }}>
            {bgImage && <img draggable="false" style={{ pointerEvents: 'none' }} src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />}
            <div className="relative mx-auto" style={{ maxWidth: widths[maxWidth || 'lg'] }}>
              {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        );
      },
    },

    columns: {
      label: 'Colonnes',
      fields: {
        count: { type: 'select', options: [
          { label: '2 colonnes', value: '2' }, { label: '3 colonnes', value: '3' }, { label: '4 colonnes', value: '4' },
        ]},
        gap: { type: 'number' },
        col1: { type: 'textarea' },
        col2: { type: 'textarea' },
        col3: { type: 'textarea' },
        col4: { type: 'textarea' },
      },
      defaultProps: { count: '3', gap: 24, col1: 'Colonne 1', col2: 'Colonne 2', col3: 'Colonne 3', col4: 'Colonne 4' },
      render: ({ count, gap, col1, col2, col3, col4 }) => {
        const n = parseInt(count || '3', 10);
        const cols = [col1, col2, col3, col4].slice(0, n);
        const gridClass: Record<number, string> = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' };
        return (
          <div className="py-12 px-4 max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 ${gridClass[n]}`} style={{ gap: `${gap}px` }}>
              {cols.map((c, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-700">{c}</p>
                </div>
              ))}
            </div>
          </div>
        );
      },
    },

    tabs: {
      label: 'Onglets',
      fields: {
        items: { type: 'array', arrayFields: { label: { type: 'text' }, content: { type: 'textarea' } } },
      },
      defaultProps: { items: [
        { label: 'Onglet 1', content: 'Contenu de l\'onglet 1' },
        { label: 'Onglet 2', content: 'Contenu de l\'onglet 2' },
        { label: 'Onglet 3', content: 'Contenu de l\'onglet 3' },
      ]},
      render: ({ items }) => (
        <div className="py-12 px-4 max-w-4xl mx-auto">
          <div className="flex border-b border-gray-200 mb-6">
            {(items || []).map((it: any, i: number) => (
              <div key={i} className={`px-6 py-3 font-semibold ${i === 0 ? 'border-b-2 border-pink-500 text-pink-500' : 'text-gray-500'}`}>
                {it.label}
              </div>
            ))}
          </div>
          <div className="text-gray-700 whitespace-pre-wrap">{(items?.[0]?.content) || ''}</div>
          <p className="text-xs text-gray-400 italic mt-4">[Aperçu : seul le 1er onglet est affiché ici. Tous les onglets seront cliquables côté public.]</p>
        </div>
      ),
    },

    accordion: {
      label: 'Accordéon',
      fields: {
        items: { type: 'array', arrayFields: { question: { type: 'text' }, answer: { type: 'textarea' } } },
      },
      defaultProps: { items: [
        { question: 'Première question ?', answer: 'Réponse à la première question.' },
        { question: 'Deuxième question ?', answer: 'Réponse à la deuxième question.' },
      ]},
      render: ({ items }) => (
        <div className="py-12 px-4 max-w-3xl mx-auto space-y-3">
          {(items || []).map((it: any, i: number) => (
            <details key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
              <summary className="font-semibold text-gray-900 cursor-pointer">{it.question}</summary>
              <p className="mt-3 text-gray-600 whitespace-pre-wrap">{it.answer}</p>
            </details>
          ))}
        </div>
      ),
    },

    // ─── MÉDIA ───────────────────────────────────────────────────────
    video: {
      label: 'Vidéo (YouTube/Vimeo)',
      fields: {
        url: { type: 'text' },
        ratio: { type: 'radio', options: [
          { label: '16:9', value: '16-9' }, { label: '4:3', value: '4-3' }, { label: '1:1', value: '1-1' },
        ]},
      },
      defaultProps: { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', ratio: '16-9' },
      render: ({ url, ratio }) => {
        const padding: Record<string, string> = { '16-9': '56.25%', '4-3': '75%', '1-1': '100%' };
        return (
          <div className="py-8 px-4 max-w-4xl mx-auto">
            <div style={{ position: 'relative', paddingBottom: padding[ratio || '16-9'], height: 0, overflow: 'hidden', borderRadius: '8px', background: '#000' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '14px' }}>
                ▶ Vidéo : <span className="ml-2 opacity-60">{url}</span>
              </div>
            </div>
          </div>
        );
      },
    },

    gallery: {
      label: 'Galerie d\'images',
      fields: {
        images: { type: 'array', arrayFields: { src: { type: 'text' }, alt: { type: 'text' } } },
        cols: { type: 'select', options: [
          { label: '2 colonnes', value: '2' }, { label: '3 colonnes', value: '3' }, { label: '4 colonnes', value: '4' },
        ]},
      },
      defaultProps: {
        images: [
          { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', alt: '' },
          { src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400', alt: '' },
          { src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400', alt: '' },
        ],
        cols: '3',
      },
      render: ({ images, cols }) => {
        const grid: Record<string, string> = { '2': 'md:grid-cols-2', '3': 'md:grid-cols-3', '4': 'md:grid-cols-4' };
        return (
          <div className="py-12 px-4 max-w-6xl mx-auto">
            <div className={`grid grid-cols-2 gap-4 ${grid[cols || '3']}`}>
              {(images || []).map((img: any, i: number) => (
                <img key={i} draggable="false" style={{ pointerEvents: 'none' }}
                     src={img.src} alt={img.alt || ''} className="w-full h-48 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        );
      },
    },

    carousel: {
      label: 'Carousel / Slider',
      fields: {
        slides: { type: 'array', arrayFields: { image: { type: 'text' }, caption: { type: 'text' } } },
      },
      defaultProps: { slides: [
        { image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200', caption: 'Slide 1' },
        { image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200', caption: 'Slide 2' },
      ]},
      render: ({ slides }) => (
        <div className="py-8 px-4 max-w-5xl mx-auto">
          <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
            {slides?.[0]?.image && (
              <img draggable="false" style={{ pointerEvents: 'none' }} src={slides[0].image} alt="" className="w-full h-full object-cover opacity-80" />
            )}
            <div className="absolute inset-0 flex items-end p-6">
              <div className="text-white text-2xl font-bold">{slides?.[0]?.caption}</div>
            </div>
            <div className="absolute bottom-3 right-3 flex gap-1">
              {(slides || []).map((_: any, i: number) => (
                <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 italic mt-2 text-center">[Aperçu : slide 1 affichée. Le carousel sera animé côté public.]</p>
        </div>
      ),
    },

    map: {
      label: 'Carte (Google Maps)',
      fields: {
        address: { type: 'text' },
        zoom: { type: 'number' },
        height: { type: 'number' },
      },
      defaultProps: { address: 'Casablanca, Maroc', zoom: 14, height: 400 },
      render: ({ address, zoom, height }) => (
        <div className="py-8 px-4 max-w-5xl mx-auto">
          <div style={{ height: `${height}px` }} className="bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <div className="font-semibold">{address}</div>
              <div className="text-sm opacity-70">Zoom : {zoom}</div>
            </div>
          </div>
        </div>
      ),
    },

    // ─── INTERACTIF ──────────────────────────────────────────────────
    'icon-box': {
      label: 'Icon Box',
      fields: {
        emoji: emojiField('Icône / Emoji'),
        title: { type: 'text' },
        description: { type: 'textarea' },
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' },
        ]},
      },
      defaultProps: { emoji: '🚀', title: 'Mon service', description: 'Description courte et impactante de votre service ou avantage.', align: 'center' },
      render: ({ emoji, title, description, align }) => (
        <div className="px-4 py-6" style={{ textAlign: align as any }}>
          <div className="text-5xl mb-4">{emoji}</div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
        </div>
      ),
    },

    counter: {
      label: 'Compteur animé',
      fields: {
        value: { type: 'number' },
        prefix: { type: 'text' },
        suffix: { type: 'text' },
        label: { type: 'text' },
        color: { type: 'text' },
      },
      defaultProps: { value: 250, prefix: '', suffix: '+', label: 'Clients satisfaits', color: '#ec4899' },
      render: ({ value, prefix, suffix, label, color }) => (
        <div className="px-4 py-6 text-center">
          <div className="text-5xl font-bold" style={{ color }}>{prefix}{value}{suffix}</div>
          <div className="text-gray-600 mt-2 uppercase tracking-wider text-sm">{label}</div>
        </div>
      ),
    },

    'pricing-table': {
      label: 'Tableau de prix',
      fields: {
        title: { type: 'text' },
        price: { type: 'text' },
        period: { type: 'text' },
        features: { type: 'array', arrayFields: { text: { type: 'text' } } },
        ctaLabel: { type: 'text' },
        ctaHref: { type: 'text' },
        highlighted: { type: 'radio', options: [{ label: 'Standard', value: 'no' }, { label: 'En vedette', value: 'yes' }] },
      },
      defaultProps: {
        title: 'Pro', price: '49€', period: '/mois', highlighted: 'no',
        features: [{ text: 'Fonctionnalité A' }, { text: 'Fonctionnalité B' }, { text: 'Support prioritaire' }],
        ctaLabel: 'Commencer', ctaHref: '#',
      },
      render: ({ title, price, period, features, ctaLabel, ctaHref, highlighted }) => (
        <div className="px-4 py-8 max-w-sm mx-auto">
          <div className={`p-8 rounded-2xl border-2 ${highlighted === 'yes' ? 'border-pink-500 bg-pink-50 shadow-xl' : 'border-gray-200 bg-white'}`}>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <div className="mb-6"><span className="text-4xl font-bold">{price}</span><span className="text-gray-500">{period}</span></div>
            <ul className="space-y-2 mb-6">
              {(features || []).map((f: any, i: number) => (
                <li key={i} className="flex items-center gap-2 text-gray-700"><span className="text-green-500">✓</span>{f.text}</li>
              ))}
            </ul>
            <a href={ctaHref || '#'} onClick={(e) => e.preventDefault()}
               className={`block text-center py-3 rounded-md font-semibold ${highlighted === 'yes' ? 'bg-pink-500 text-white' : 'bg-gray-900 text-white'}`}>
              {ctaLabel}
            </a>
          </div>
        </div>
      ),
    },

    'testimonial-card': {
      label: 'Carte témoignage',
      fields: {
        quote: { type: 'textarea' },
        author: { type: 'text' },
        role: { type: 'text' },
        avatar: { type: 'text' },
        rating: { type: 'number' },
      },
      defaultProps: { quote: '« Une équipe exceptionnelle, à l\'écoute et créative. »', author: 'Jean Dupont', role: 'CEO, Entreprise', avatar: '', rating: 5 },
      render: ({ quote, author, role, avatar, rating }) => (
        <div className="px-4 py-8 max-w-2xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-yellow-400 text-xl mb-4">{'★'.repeat(rating || 5)}{'☆'.repeat(5 - (rating || 5))}</div>
            <p className="text-lg italic text-gray-700 mb-6">{quote}</p>
            <div className="flex items-center gap-4">
              {avatar && <img draggable="false" style={{ pointerEvents: 'none' }} src={avatar} alt="" className="w-12 h-12 rounded-full object-cover" />}
              <div>
                <div className="font-bold">{author}</div>
                <div className="text-sm text-gray-500">{role}</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    'cta-banner': {
      label: 'Bannière CTA',
      fields: {
        title: { type: 'text' },
        description: { type: 'textarea' },
        btnLabel: { type: 'text' },
        btnHref: { type: 'text' },
        bgColor: { type: 'text' },
        textColor: { type: 'text' },
      },
      defaultProps: { title: 'Prêt à commencer ?', description: 'Rejoignez des centaines d\'entreprises qui nous font confiance.', btnLabel: 'Démarrer maintenant', btnHref: '#', bgColor: '#111827', textColor: '#ffffff' },
      render: ({ title, description, btnLabel, btnHref, bgColor, textColor }) => (
        <div className="py-16 px-4" style={{ backgroundColor: bgColor, color: textColor }}>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg opacity-80 mb-8">{description}</p>
            <a href={btnHref || '#'} onClick={(e) => e.preventDefault()}
               className="inline-block bg-pink-500 text-white px-8 py-4 rounded-md font-semibold hover:bg-pink-600 transition">
              {btnLabel}
            </a>
          </div>
        </div>
      ),
    },

    alert: {
      label: 'Alerte / Notification',
      fields: {
        type: { type: 'select', options: [
          { label: 'Info (bleu)', value: 'info' }, { label: 'Succès (vert)', value: 'success' },
          { label: 'Avertissement (jaune)', value: 'warning' }, { label: 'Erreur (rouge)', value: 'error' },
        ]},
        title: { type: 'text' },
        message: { type: 'textarea' },
      },
      defaultProps: { type: 'info', title: 'Information', message: 'Ceci est un message important pour vos visiteurs.' },
      render: ({ type, title, message }) => {
        const styles: Record<string, string> = {
          info: 'bg-blue-50 border-blue-400 text-blue-800',
          success: 'bg-green-50 border-green-400 text-green-800',
          warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
          error: 'bg-red-50 border-red-400 text-red-800',
        };
        const icons: Record<string, string> = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
        return (
          <div className="px-4 py-4 max-w-4xl mx-auto">
            <div className={`border-l-4 p-4 rounded ${styles[type || 'info']}`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{icons[type || 'info']}</span>
                <div>
                  <div className="font-bold">{title}</div>
                  <p className="mt-1 whitespace-pre-wrap">{message}</p>
                </div>
              </div>
            </div>
          </div>
        );
      },
    },

    // ─── SOCIAL ──────────────────────────────────────────────────────
    'social-icons': {
      label: 'Icônes réseaux sociaux',
      fields: {
        facebook: { type: 'text' },
        instagram: { type: 'text' },
        linkedin: { type: 'text' },
        twitter: { type: 'text' },
        youtube: { type: 'text' },
        align: { type: 'radio', options: [
          { label: 'Gauche', value: 'left' }, { label: 'Centré', value: 'center' }, { label: 'Droite', value: 'right' },
        ]},
        size: { type: 'number' },
      },
      defaultProps: { facebook: '#', instagram: '#', linkedin: '#', twitter: '', youtube: '', align: 'center', size: 32 },
      render: ({ facebook, instagram, linkedin, twitter, youtube, align, size }) => {
        const items = [
          { url: facebook, icon: 'f', bg: '#1877F2' },
          { url: instagram, icon: '📷', bg: '#E4405F' },
          { url: linkedin, icon: 'in', bg: '#0A66C2' },
          { url: twitter, icon: '𝕏', bg: '#000000' },
          { url: youtube, icon: '▶', bg: '#FF0000' },
        ].filter(i => i.url);
        const justify: Record<string, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };
        return (
          <div className="px-4 py-4 flex gap-3" style={{ justifyContent: justify[align || 'center'] }}>
            {items.map((it, i) => (
              <a key={i} href={it.url} onClick={(e) => e.preventDefault()}
                 className="rounded-full text-white flex items-center justify-center font-bold"
                 style={{ width: `${size}px`, height: `${size}px`, fontSize: `${(size || 32) / 2.5}px`, backgroundColor: it.bg }}>
                {it.icon}
              </a>
            ))}
          </div>
        );
      },
    },

    'latest-posts': {
      label: 'Derniers articles (auto)',
      fields: {
        title: { type: 'text' },
        limit: { type: 'number' },
        showImage: { type: 'radio', options: [{ label: 'Oui', value: 'yes' }, { label: 'Non', value: 'no' }] },
      },
      defaultProps: { title: 'Articles récents', limit: 3, showImage: 'yes' },
      render: ({ title, limit, showImage }) => (
        <div className="py-12 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: limit || 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow border border-gray-100">
                {showImage === 'yes' && <div className="h-40 bg-gradient-to-br from-pink-200 to-purple-200" />}
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">Article #{i + 1}</div>
                  <div className="font-bold text-gray-900">Titre dynamique</div>
                  <div className="text-sm text-gray-600 mt-2">Extrait dynamique chargé depuis le blog…</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic mt-4 text-center">[Aperçu : les vrais articles seront chargés côté public.]</p>
        </div>
      ),
    },

  }
};
