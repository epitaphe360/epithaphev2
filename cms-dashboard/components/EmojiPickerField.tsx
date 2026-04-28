/**
 * EmojiPickerField — sélecteur d'emoji visuel pour les champs icône dans Puck.
 * - Recherche par mot-clé
 * - Catégories : Étoiles & Formes / Événementiel / Business / Créatif / Nature / Smileys / Symboles
 * - Saisie manuelle possible
 */

import React, { useState, useRef, useEffect } from 'react';

// ─── Catalogue d'emojis par catégorie ────────────────────────────────────────
const EMOJI_CATALOG: { category: string; emojis: { e: string; k: string }[] }[] = [
  {
    category: '⭐ Étoiles & Formes',
    emojis: [
      { e: '⭐', k: 'étoile star' },
      { e: '🌟', k: 'étoile brillante star glow' },
      { e: '✨', k: 'étincelles sparkles' },
      { e: '💫', k: 'vertige étoile' },
      { e: '🔥', k: 'feu fire flamme' },
      { e: '💎', k: 'diamant gem bijou' },
      { e: '🏆', k: 'trophée champion' },
      { e: '🥇', k: 'médaille or gold' },
      { e: '🎖️', k: 'médaille award' },
      { e: '🎗️', k: 'ruban ribbon' },
      { e: '🏅', k: 'médaille sport' },
      { e: '⚡', k: 'éclair lightning' },
      { e: '🌈', k: 'arc-en-ciel rainbow' },
      { e: '🔮', k: 'boule cristal magic' },
      { e: '💡', k: 'ampoule idée idea' },
      { e: '🎯', k: 'cible target objectif' },
    ],
  },
  {
    category: '🎪 Événementiel',
    emojis: [
      { e: '🎪', k: 'cirque tente événement' },
      { e: '🎶', k: 'musique notes concert' },
      { e: '🎵', k: 'note musique' },
      { e: '🎸', k: 'guitare rock' },
      { e: '🎹', k: 'piano clavier' },
      { e: '🥁', k: 'batterie drums' },
      { e: '🎤', k: 'micro microphone scène' },
      { e: '🎧', k: 'casque audio dj' },
      { e: '🎼', k: 'partition musique' },
      { e: '🎻', k: 'violon' },
      { e: '🎺', k: 'trompette' },
      { e: '🪗', k: 'accordéon' },
      { e: '🎭', k: 'théâtre masques' },
      { e: '🎨', k: 'palette art créatif' },
      { e: '🎬', k: 'clap cinéma film' },
      { e: '🎤', k: 'chant spectacle' },
      { e: '🎡', k: 'grande roue fête foraine' },
      { e: '🎢', k: 'montagnes russes' },
      { e: '🎠', k: 'manège carrousel' },
      { e: '🎆', k: 'feux artifice' },
      { e: '🎇', k: 'feux scintillants' },
      { e: '🥂', k: 'champagne toast fête' },
      { e: '🍾', k: 'champagne bouteille' },
      { e: '🎉', k: 'confettis fête party' },
      { e: '🎊', k: 'boule confettis' },
      { e: '🪩', k: 'disco ball boule' },
      { e: '💃', k: 'danse danseuse' },
      { e: '🕺', k: 'danse homme' },
      { e: '🎟️', k: 'ticket billet' },
      { e: '🎫', k: 'billet entrée' },
      { e: '🎙️', k: 'micro studio' },
      { e: '📸', k: 'photo appareil' },
    ],
  },
  {
    category: '💼 Business & Services',
    emojis: [
      { e: '💼', k: 'mallette business travail' },
      { e: '📊', k: 'graphique stats analyse' },
      { e: '📈', k: 'croissance hausse' },
      { e: '🤝', k: 'poignée main partenariat' },
      { e: '💰', k: 'argent money sac' },
      { e: '💳', k: 'carte paiement' },
      { e: '🏦', k: 'banque finance' },
      { e: '📋', k: 'presse-papiers liste' },
      { e: '📝', k: 'stylo note' },
      { e: '✉️', k: 'email lettre' },
      { e: '📧', k: 'email message' },
      { e: '📞', k: 'téléphone appel' },
      { e: '🖥️', k: 'ordinateur écran' },
      { e: '📱', k: 'mobile smartphone' },
      { e: '🖱️', k: 'souris ordinateur' },
      { e: '⌨️', k: 'clavier keyboard' },
      { e: '🔑', k: 'clé key accès' },
      { e: '🔒', k: 'cadenas sécurité' },
      { e: '🛡️', k: 'bouclier protection' },
      { e: '📦', k: 'colis package livraison' },
      { e: '🚀', k: 'fusée lancement startup' },
      { e: '⚙️', k: 'engrenage paramètres' },
      { e: '🔧', k: 'clé outil' },
      { e: '🛠️', k: 'outils' },
      { e: '📡', k: 'antenne signal' },
      { e: '🌐', k: 'web monde globe' },
      { e: '🗂️', k: 'dossiers fichiers' },
      { e: '📌', k: 'punaise repère' },
      { e: '🗓️', k: 'calendrier date' },
      { e: '⏰', k: 'alarme réveil temps' },
      { e: '⏱️', k: 'chronomètre' },
      { e: '💬', k: 'commentaire bulle' },
      { e: '🗣️', k: 'parole annonce' },
      { e: '👥', k: 'groupe équipe' },
      { e: '👤', k: 'personne profil' },
      { e: '🏢', k: 'immeuble bureau entreprise' },
      { e: '🏗️', k: 'construction' },
      { e: '🏪', k: 'boutique commerce' },
    ],
  },
  {
    category: '🎨 Créatif & Design',
    emojis: [
      { e: '🎨', k: 'peinture art design' },
      { e: '✏️', k: 'crayon dessin' },
      { e: '🖊️', k: 'stylo écriture' },
      { e: '🖌️', k: 'pinceau peinture' },
      { e: '📐', k: 'équerre mesure design' },
      { e: '📏', k: 'règle mesure' },
      { e: '🖼️', k: 'tableau cadre image' },
      { e: '📷', k: 'appareil photo' },
      { e: '🎥', k: 'caméra vidéo' },
      { e: '🎞️', k: 'film pellicule' },
      { e: '🖋️', k: 'stylo plume écriture' },
      { e: '📚', k: 'livres bibliothèque' },
      { e: '📖', k: 'livre ouvert' },
      { e: '💡', k: 'idée créativité' },
      { e: '🔭', k: 'télescope vision' },
      { e: '🔬', k: 'microscope recherche' },
      { e: '🧪', k: 'tube essai expérience' },
      { e: '🧬', k: 'adn science' },
      { e: '🎭', k: 'masques théâtre' },
      { e: '🏛️', k: 'monument architecture' },
    ],
  },
  {
    category: '🌿 Nature & Lieux',
    emojis: [
      { e: '🌿', k: 'herbe nature' },
      { e: '🌸', k: 'fleur cerisier' },
      { e: '🌺', k: 'hibiscus fleur' },
      { e: '🌻', k: 'tournesol fleur' },
      { e: '🌲', k: 'arbre forêt' },
      { e: '🏔️', k: 'montagne sommet' },
      { e: '🌊', k: 'vague mer ocean' },
      { e: '☀️', k: 'soleil ensoleillé' },
      { e: '🌙', k: 'lune nuit' },
      { e: '🌍', k: 'terre monde' },
      { e: '🏖️', k: 'plage mer été' },
      { e: '🏕️', k: 'camping nature' },
      { e: '🗺️', k: 'carte map voyage' },
      { e: '✈️', k: 'avion voyage transport' },
      { e: '🚂', k: 'train transport' },
      { e: '🚗', k: 'voiture transport' },
      { e: '🏠', k: 'maison maison' },
      { e: '🏡', k: 'maison jardin' },
      { e: '🌅', k: 'coucher soleil lever' },
      { e: '⛰️', k: 'montagne' },
    ],
  },
  {
    category: '😀 Personnes & Smileys',
    emojis: [
      { e: '😀', k: 'sourire heureux' },
      { e: '😊', k: 'sourire doux' },
      { e: '🥰', k: 'amour coeur' },
      { e: '😍', k: 'admirateur yeux coeur' },
      { e: '🤩', k: 'étoile yeux impressed' },
      { e: '😎', k: 'cool lunettes' },
      { e: '🤔', k: 'réflexion penser' },
      { e: '💪', k: 'muscle force bras' },
      { e: '🙌', k: 'mains applaudissement' },
      { e: '👏', k: 'applaudir' },
      { e: '🤜', k: 'poing droit' },
      { e: '👍', k: 'pouce ok approuver' },
      { e: '✌️', k: 'paix victoire' },
      { e: '🫶', k: 'coeur mains amour' },
      { e: '🧠', k: 'cerveau intelligence' },
      { e: '👀', k: 'yeux regarder' },
      { e: '❤️', k: 'coeur amour' },
      { e: '💛', k: 'coeur jaune' },
      { e: '💜', k: 'coeur violet' },
      { e: '🖤', k: 'coeur noir' },
      { e: '🫀', k: 'coeur organe' },
    ],
  },
  {
    category: '🔢 Symboles & Flèches',
    emojis: [
      { e: '✅', k: 'check coché validé' },
      { e: '❌', k: 'croix non interdit' },
      { e: '⚠️', k: 'avertissement attention' },
      { e: '❓', k: 'question interrogation' },
      { e: '❗', k: 'exclamation important' },
      { e: '➕', k: 'plus ajout' },
      { e: '➖', k: 'moins retrait' },
      { e: '▶️', k: 'play lecture démarrer' },
      { e: '⏸️', k: 'pause stop' },
      { e: '🔁', k: 'répéter boucle' },
      { e: '🔄', k: 'actualiser recharger' },
      { e: '🔀', k: 'aléatoire shuffle' },
      { e: '➡️', k: 'flèche droite' },
      { e: '⬆️', k: 'flèche haut' },
      { e: '⬇️', k: 'flèche bas' },
      { e: '↩️', k: 'retour gauche' },
      { e: '🔗', k: 'lien chaîne' },
      { e: '📎', k: 'trombone attaché' },
      { e: '🔖', k: 'marque-page signet' },
      { e: '🏷️', k: 'étiquette tag label' },
      { e: '📢', k: 'mégaphone annonce' },
      { e: '📣', k: 'mégaphone alerte' },
      { e: '🔔', k: 'cloche notification' },
      { e: '🔕', k: 'cloche silencieux' },
      { e: '♾️', k: 'infini forever' },
      { e: '©️', k: 'copyright' },
      { e: '®️', k: 'registered marque' },
      { e: '™️', k: 'trademark marque déposée' },
    ],
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────
interface Props {
  value: string;
  onChange: (emoji: string) => void;
  label?: string;
}

export function EmojiPickerField({ value, onChange, label = 'Icône (emoji)' }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);

  // Fermer en cliquant en dehors
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Filtrer si recherche active
  const query = search.trim().toLowerCase();
  const filteredCatalog = query
    ? [{
        category: '🔍 Résultats',
        emojis: EMOJI_CATALOG.flatMap((c) => c.emojis).filter((e) => e.k.includes(query)),
      }]
    : EMOJI_CATALOG;

  return (
    <div style={{ position: 'relative', userSelect: 'none' }} ref={panelRef}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
        {label}
      </label>

      {/* Bouton déclencheur */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 8,
          background: '#fff',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 500,
          color: '#111',
          width: '100%',
        }}
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>{value || '⭐'}</span>
        <span style={{ flex: 1, textAlign: 'left', color: '#6b7280' }}>
          {value || 'Choisir une icône…'}
        </span>
        <span style={{ color: '#9ca3af', fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Saisie manuelle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <input
          type="text"
          value={value}
          maxLength={8}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ou saisir directement : 🎯"
          style={{
            flex: 1,
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            padding: '4px 8px',
            fontSize: 13,
            color: '#374151',
          }}
        />
      </div>

      {/* Panneau picker */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 9999,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            maxHeight: 340,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Recherche */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher : fête, étoile, musique…"
              style={{
                width: '100%',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                padding: '5px 10px',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Grille */}
          <div style={{ overflow: 'auto', flex: 1, padding: '6px 8px' }}>
            {filteredCatalog.map((cat) => (
              <div key={cat.category} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 2px' }}>
                  {cat.category}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {cat.emojis.map((item) => (
                    <button
                      key={item.e}
                      type="button"
                      title={item.k}
                      onClick={() => { onChange(item.e); setOpen(false); setSearch(''); }}
                      style={{
                        width: 34,
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                        border: value === item.e ? '2px solid #6366f1' : '2px solid transparent',
                        borderRadius: 6,
                        background: value === item.e ? '#eef2ff' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={(e) => { if (value !== item.e) (e.currentTarget as HTMLButtonElement).style.background = '#f3f4f6'; }}
                      onMouseLeave={(e) => { if (value !== item.e) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                    >
                      {item.e}
                    </button>
                  ))}
                  {cat.emojis.length === 0 && (
                    <p style={{ fontSize: 12, color: '#9ca3af', padding: '4px 2px' }}>Aucun résultat</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPickerField;
