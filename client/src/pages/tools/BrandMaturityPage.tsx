import React from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const questions = [
  { id: 'q1', text: "L'identite visuelle de la marque est deployee de maniere coherente partout." },
  { id: 'q2', text: "Le positionnement de marque est compris par 100% de la direction." },
  { id: 'q3', text: "Nous avons une charte editoriale cliare." }
];

export default function BrandMaturityPage() {
  return (
    <>
      <Navigation />
      <ScoringForm 
        toolId="brandmaturity"
        toolName="BMI 360�"
        description="Brand Maturity Index. Le diagnostic ultime pour la C-Suite."
        questions={questions}
      />
      <Footer />
    </>
  );
}
