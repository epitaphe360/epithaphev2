import React, { useState, useEffect } from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const DEFAULT_QUESTIONS = [
  { id: 'q1', text: "Notre promesse employeur (EVP) correspond a la realite vecue par les employes." },
  { id: 'q2', text: "Les metriques de retention des talents sont excellentes." },
  { id: 'q3', text: "Nous attirons facilement les meilleurs profils de notre secteur." },
  { id: 'q4', text: "Le parcours d'onboarding est structure et impactant." }
];

export default function TalentPrintPage() {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);

  useEffect(() => {
    fetch('/api/scoring-questions/talentprint')
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
      <Navigation />
      <ScoringForm
        toolId="talentprint"
        toolName="TalentPrint"
        description="The Employer Branding Engine par Epitaphe360. Quel est votre niveau d'attractivite RH ?"
        questions={questions}
      />
      <Footer />
    </>
  );
}