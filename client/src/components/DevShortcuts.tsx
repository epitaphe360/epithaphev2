import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Database, ShieldAlert, Users, Activity, X, BugPlay } from "lucide-react";

export default function DevShortcuts() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button 
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-2xl bg-teal-600 hover:bg-teal-500"
        size="icon"
      >
        <BugPlay className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-neutral-950 border border-neutral-800 p-4 rounded-xl shadow-2xl w-72 text-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Dev Menu</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-white" onClick={() => setOpen(false)}>
          <X className="w-4 h-4"/>
        </Button>
      </div>

      <div className="space-y-2 flex flex-col">
        <Button variant="outline" className="w-full justify-start border-neutral-700 hover:bg-neutral-800 hover:text-teal-400" onClick={async () => {
          await fetch('/api/dev/seed');
          alert('Donnees injectees avec succes ! Rechargez la page.');
        }}>
          <Database className="w-4 h-4 mr-2" /> 1. Injecter Données de Test
        </Button>
        
        <Link href="/admin/leads">
          <Button variant="outline" className="w-full justify-start border-neutral-700 hover:bg-neutral-800 hover:text-white">
            <ShieldAlert className="w-4 h-4 mr-2" /> Admin: Table leads
          </Button>
        </Link>
        
        <Link href="/portal">
          <Button variant="outline" className="w-full justify-start border-neutral-700 hover:bg-neutral-800 hover:text-white">
            <Users className="w-4 h-4 mr-2" /> Portail Client B2B
          </Button>
        </Link>
        
        <Link href="/tools/bmi360">
          <Button variant="outline" className="w-full justify-start border-neutral-700 hover:bg-neutral-800 hover:text-white">
            <Activity className="w-4 h-4 mr-2" /> Outil: BMI 360™
          </Button>
        </Link>
      </div>
    </div>
  );
}
