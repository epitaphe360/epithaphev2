import React from 'react';
import ScoringForm from '../../components/tools/ScoringForm';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

const questions = [
  { id: 'q1', text: "Nous avons un protocole de gestion de crise teste ces 12 derniers mois." },
  { id: 'q2', text: "Une cellule de veille reputationnelle est active 24/7." },
  { id: 'q3', text: "Les porte-paroles sont formes au media training de crise." }
];

export default function SafeSignalPage() {
  return (
    <>
      <Navigation />
      <ScoringForm 
        toolId="safesignal"
        toolName="SafeSignal�"
        description="Crisis &amp; Reputation Radar par Epitaphe360. Etes-vous prets pour la prochaine crise ?"
        questions={questions}
      />
      <Footer />
    </>
  );
}
