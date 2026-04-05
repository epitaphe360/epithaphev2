import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Receipt, User, LogOut, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ClientPortal() {
  const [reports, setReports] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, invRes] = await Promise.all([
          fetch('/api/portal/reports'),
          fetch('/api/portal/invoices')
        ]);
        const repData = repRes.ok ? await repRes.json() : [];
        const invData = invRes.ok ? await invRes.json() : [];
        setReports(Array.isArray(repData) ? repData : []);
        setInvoices(Array.isArray(invData) ? invData : []);
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12">
      {/* Header Portail */}
      <div className="bg-neutral-950 text-white py-12 px-6 shadow-md mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mon Espace Client</h1>
            <p className="text-zinc-400">Retrouvez tous vos audits, contrats et factures.</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-4">
            <Button variant="outline" className="border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800">
              <User className="w-4 h-4 mr-2" /> Mon Profil
            </Button>
            <Button variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-0">
              <LogOut className="w-4 h-4 mr-2" /> Deconnexion
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Principale : Rapports */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900 flex items-center">
            <FileText className="w-6 h-6 mr-3 text-teal-600" /> Mes Audits & Rapports
          </h2>
          
          {loading ? (
             <div className="text-zinc-500">Chargement des donnees...</div>
          ) : reports.length > 0 ? (
            reports.map((report: any) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow border-neutral-200">
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-teal-600 mb-1">{report.toolId.toUpperCase()}</div>
                    <CardTitle className="text-xl mb-1">Rapport de diagnostic</CardTitle>
                    <div className="text-sm text-zinc-500">Score Global: {report.globalScore}% � Maturite: {report.maturityLevel}/5</div>
                  </div>
                  <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                    Voir detail <ArrowRight className="w-4 h-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed border-2 border-neutral-300 bg-transparent">
              <CardContent className="p-12 text-center text-zinc-500">
                Aucun audit realise pour le moment.
                <br/>
                <Link href="/tools/commpulse">
                  <Button className="mt-4">Realiser un audit</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Colonne Secondaire : Facturation */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-neutral-900 flex items-center">
            <Receipt className="w-6 h-6 mr-3 text-teal-600" /> Facturation
          </h2>
          
          <Card>
            <CardContent className="p-0 divide-y divide-neutral-100">
              {loading ? (
                 <div className="p-6 text-zinc-500">Chargement...</div>
              ) : invoices.map((inv: any) => (
                <div key={inv.id} className="p-6 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-neutral-900">{inv.description}</div>
                    <div className="text-sm text-zinc-500">{inv.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{inv.amount}</div>
                    <div className={`text-xs font-medium ${inv.status === 'Paye' ? 'text-green-600' : 'text-amber-500'}`}>
                      {inv.status}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
