import React, { useState, useEffect } from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PageMeta } from '@/components/seo/page-meta';

const DEFAULT_QUESTIONS = [
  { id: 'q1', text: "L'identite visuelle de la marque est deployee de maniere coherente partout." },
  { id: 'q2', text: "Le positionnement de marque est compris par 100% de la direction." },
  { id: 'q3', text: "Nous avons une charte editoriale claire." }
];

export default function BrandMaturityPage() {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);

  useEffect(() => {
    fetch('/api/scoring-questions/brandmaturity')
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
        title="BMI 360™ — Brand Maturity Index"
        description="Diagnostic de la maturité de votre marque. Le Brand Maturity Index pour la C-Suite par Epitaphe 360."
        canonicalPath="/tools/brandmaturity"
        noIndex
      />
      <Navigation />
      <ScoringForm
        toolId="brandmaturity"
        toolName="BMI 360"
        description="Brand Maturity Index. Le diagnostic ultime pour la C-Suite."
        questions={questions}
      />
      <Footer />
    </>
  );
}