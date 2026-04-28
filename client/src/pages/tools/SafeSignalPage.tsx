import React, { useState, useEffect } from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PageMeta } from '@/components/seo/page-meta';

const DEFAULT_QUESTIONS = [
  { id: 'q1', text: "Nous avons un protocole de gestion de crise teste ces 12 derniers mois." },
  { id: 'q2', text: "Une cellule de veille reputationnelle est active 24/7." },
  { id: 'q3', text: "Les porte-paroles sont formes au media training de crise." }
];

export default function SafeSignalPage() {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);

  useEffect(() => {
    fetch('/api/scoring-questions/safesignal')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.questions?.length) {
          setQuestions(d.questions.map((q: { id: string; text: string }) => ({ id: q.id, text: q.text })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <PageMeta
        title="SafeSignal™ — Scoring QHSE & Communication de Crise"
        description="Évaluez votre niveau de préparation à la crise et l'efficacité de votre communication sécurité QHSE."
        canonicalPath="/tools/safesignal"
        noIndex
      />
      <Navigation />
      <ScoringForm
        toolId="safesignal"
        toolName="SafeSignal"
        description="Crisis et Reputation Radar par Epitaphe360. Etes-vous prets pour la prochaine crise ?"
        questions={questions}
      />
      <Footer />
    </>
  );
}