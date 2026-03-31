import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ScoringLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reutilisation de la meme route pour la demo, idealement on aurait /api/admin/leads
    fetch('/api/portal/reports')
      .then(res => res.json())
      .then(data => { setLeads(data); setLoading(false); });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Leads Scoring (BMI 360)</h1>
          <p className="text-zinc-500">Gerez les prospects generes par vos outils d'intelligence.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Derniers Audits Realises</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Outil</TableHead>
                <TableHead>Score Global</TableHead>
                <TableHead>Maturite</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8 text-zinc-500">Chargement...</TableCell></TableRow>
              ) : leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{lead.toolId}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{lead.globalScore}%</div>
                  </TableCell>
                  <TableCell>
                    Niveau {lead.maturityLevel}/5
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-teal-600 hover:underline text-sm font-medium">Contacter</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
