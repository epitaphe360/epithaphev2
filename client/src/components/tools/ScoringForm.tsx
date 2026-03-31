import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export interface Question {
  id: string;
  text: string;
}

interface ScoringFormProps {
  toolId: string;
  toolName: string;
  description: string;
  questions: Question[];
}

export default function ScoringForm({ toolId, toolName, description, questions }: ScoringFormProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (val: number) => {
    const newAnswers = { ...answers, [questions[step].id]: val };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitAssessment(newAnswers);
    }
  };

  const submitAssessment = async (finalAnswers: Record<string, number>) => {
    setLoading(true);
    try {
      const res = await fetch('/api/scoring/' + toolId, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen pt-32 pb-16 px-4 bg-zinc-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full text-center py-12 shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="text-4xl text-primary font-bold">Votre Rapport {toolName}</CardTitle>
            <CardDescription className="text-xl mt-2">Niveau de maturite : {result.maturityLevel}/5</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-8xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-700">
              {result.globalScore}%
            </div>
            <p className="text-zinc-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
              Nous avons bien enregistre vos resultats. Un expert Epitaphe360 vous contactera rapidement.
            </p>
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg rounded-full bg-teal-600 hover:bg-teal-700">
                Retour a l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 bg-neutral-950 text-white flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <div className="mb-16 text-center">
          <h1 className="text-5xl sm:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-600 tracking-tight">
            {toolName}
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">{description}</p>
        </div>

        <Card className="bg-neutral-900 border-neutral-800 shadow-2xl">
          <CardHeader className="border-b border-neutral-800 pb-6">
            <CardTitle className="text-neutral-400 text-sm font-medium uppercase tracking-wider">
              Question {step + 1} / {questions.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-10 pb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-12 leading-snug">
              {questions[step].text}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[0, 2, 5, 8, 10].map((score) => (
                <Button 
                  key={score}
                  onClick={() => handleAnswer(score)}
                  variant="outline"
                  className="h-20 text-lg hover:bg-teal-600 border-neutral-700 hover:border-teal-500 text-neutral-300 hover:text-white transition-all duration-300"
                  disabled={loading}
                >
                  {score === 0 ? 'Pas du tout' : score === 10 ? 'Absolument' : score}
                </Button>
              ))}
            </div>
            
            <div className="mt-12 flex gap-2 justify-center">
              {questions.map((_, i) => (
                <div 
                  key={i} 
                  className={"h-2 rounded-full transition-all duration-500  + (i === step ? 'w-12 bg-teal-500' : 'w-4 bg-neutral-800') + "} 
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
