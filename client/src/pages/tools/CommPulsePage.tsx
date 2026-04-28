import React, { useState, useEffect } from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PageMeta } from '@/components/seo/page-meta';

const DEFAULT_QUESTIONS = [
  { id: 'q1', text: "Les collaborateurs sont informes des decisions strategiques en temps reel." },
  { id: 'q2', text: "Il existe des canaux efficaces pour les feedbacks ascendants." },
  { id: 'q3', text: "La communication interne reflete reellement la culture d'entreprise." },
  { id: 'q4', text: "Les managers de proximite sont bien equipes pour communiquer." },
  { id: 'q5', text: "Nous mesurons regulierement l'impact de notre communication interne." }
];

export default function CommPulsePage() {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);

  useEffect(() => {
    fetch('/api/scoring-questions/commpulse')
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
        title="CommPulse™ — Scoring Communication Interne"
        description="Évaluez la maturité de votre communication interne en 2 minutes. Outil de diagnostic Epitaphe 360."
        canonicalPath="/tools/commpulse"
        noIndex
      />
      <Navigation />
      <ScoringForm
        toolId="commpulse"
        toolName="CommPulse"
        description="The Internal Communication Intelligence Platform par Epitaphe360. Evaluez la maturite de votre communication interne en 2 minutes."
        questions={questions}
      />
      <Footer />
    </>
  );
}