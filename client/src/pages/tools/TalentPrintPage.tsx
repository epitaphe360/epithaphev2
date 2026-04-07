import React from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const questions = [
  { id: 'q1', text: "Notre promesse employeur (EVP) correspond a la realite vecue par les employes." },
  { id: 'q2', text: "Les metriques de retention des talents sont excellentes." },
  { id: 'q3', text: "Nous attirons facilement les meilleurs profils de notre secteur." },
  { id: 'q4', text: "Le parcours d'onboarding est structure et impactant." }
];

export default function TalentPrintPage() {
  return (
    <>
      <Navigation />
      <ScoringForm 
        toolId="talentprint"
        toolName="TalentPrint�"
        description="The Employer Branding Engine by Epitaphe360. Quel est votre niveau d'attractivite RH ?"
        questions={questions}
      />
      <Footer />
    </>
  );
}
