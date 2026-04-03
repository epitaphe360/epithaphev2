/**
 * Espace Client — Coffre-Fort Numérique
 * /espace-client/documents
 *
 * Documents: liste par projet, download via URL signée, upload (si autorisé)
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  FileText, Download, Upload, ChevronRight, Shield,
  AlertCircle, Loader2, Search, LogOut, FolderOpen,
  FileArchive, FileSpreadsheet, File, Eye, X,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";

const TOKEN_KEY = "epitaphe_client_token";

interface Document {
  id: number; name: string; fileType: string;
  fileSize: string | null; url: string; uploadedAt: string;
  projectId: number; projectTitle?: string;
}

interface Project {
  id: number; title: string; type: string;
  documents: Document[];
}

function fileIcon(type: string) {
  const t = type.toUpperCase();
  if (t === "PDF")  return <File className="w-5 h-5 text-red-500" />;
  if (t === "ZIP" || t === "RAR") return <FileArchive className="w-5 h-5 text-yellow-500" />;
  if (t === "XLSX" || t === "XLS" || t === "CSV") return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
  return <FileText className="w-5 h-5 text-[#C8A96E]" />;
}

function isPreviewable(doc: Document): boolean {
  const t = doc.fileType?.toUpperCase() ?? "";
  const url = doc.url ?? "";
  return t === "PDF" || url.match(/\.(pdf|png|jpg|jpeg|gif|webp|svg)(\?|$)/i) !== null;
}

function isImage(doc: Document): boolean {
  return /\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/i.test(doc.url ?? "");
}

function DocumentPreviewModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}>
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 truncate">{doc.name}</p>
          <div className="flex items-center gap-2">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" download
              className="flex items-center gap-1.5 text-xs text-[#C8A96E] hover:text-[#b8965e] transition-colors px-3 py-1.5 rounded-lg border border-[#C8A96E]/30">
              <Download className="w-3.5 h-3.5" /> Télécharger
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center min-h-64">
          {isImage(doc) ? (
            <img src={doc.url} alt={doc.name} className="max-w-full max-h-full object-contain p-4" />
          ) : (
            <iframe src={doc.url} title={doc.name} className="w-full h-full min-h-[70vh] border-0" />
          )}
        </div>
      </div>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DocumentsPage() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    if (!token) { setLocation("/espace-client"); return; }

    (async () => {
      try {
        const res = await fetch("/api/client/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { setLocation("/espace-client"); return; }
        if (!res.ok) throw new Error("Erreur serveur");
        const data: Project[] = await res.json();
        setProjects(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, setLocation]);

  // Aplatir tous les documents
  const allDocs: (Document & { projectTitle: string })[] = projects.flatMap((p) =>
    (p.documents ?? []).map((d) => ({ ...d, projectTitle: p.title }))
  );

  const filtered = search.trim()
    ? allDocs.filter(
        (d) =>
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.projectTitle.toLowerCase().includes(search.toLowerCase())
      )
    : allDocs;

  const totalDocs = allDocs.length;

  return (
    <>
      <PageMeta
        title="Mes Documents — Espace Client Epitaphe360"
        description="Accédez à tous vos fichiers et livrables en toute sécurité."
        canonicalPath="/espace-client/documents"
      />
      <Navigation />

      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/espace-client"><span className="hover:text-[#C8A96E] cursor-pointer">Espace Client</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700">Mes Documents</span>
          </nav>

          {/* En-tête */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#C8A96E]/10 rounded-xl">
                  <Shield className="w-6 h-6 text-[#C8A96E]" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Coffre-Fort Numérique</h1>
              </div>
              <p className="text-gray-500 text-sm">
                {totalDocs} fichier{totalDocs !== 1 ? "s" : ""} · Accès chiffré et sécurisé
              </p>
            </div>
            <button
              onClick={() => { localStorage.removeItem(TOKEN_KEY); setLocation("/espace-client"); }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un fichier ou un projet..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] text-sm transition"
            />
          </div>

          {/* Contenu */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8A96E]" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" /> {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">
                {search ? "Aucun résultat pour cette recherche" : "Aucun document disponible"}
              </p>
              {!search && (
                <p className="text-sm mt-2">
                  Vos livrables apparaîtront ici une fois mis à disposition par votre chef de projet.
                </p>
              )}
            </div>
          ) : (
            /* Grouper par projet */
            projects
              .filter((p) => {
                const docs = filtered.filter((d) => d.projectId === p.id);
                return docs.length > 0;
              })
              .map((p, i) => {
                const docs = filtered.filter((d) => d.projectId === p.id);
                return (
                  <motion.section
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden"
                  >
                    {/* Titre du projet */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <FolderOpen className="w-5 h-5 text-[#C8A96E]" />
                        <span className="font-semibold text-gray-800">{p.title}</span>
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                          {docs.length} fichier{docs.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Link href={`/espace-client/projets/${p.id}`}>
                        <span className="text-xs text-[#C8A96E] hover:underline cursor-pointer">
                          Voir le projet →
                        </span>
                      </Link>
                    </div>

                    {/* Liste documents */}
                    <div className="divide-y divide-gray-50">
                      {docs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50 transition group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                              {fileIcon(doc.fileType)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-800 text-sm truncate">{doc.name}</p>
                              <p className="text-xs text-gray-400">
                                {doc.fileType}
                                {doc.fileSize && ` · ${doc.fileSize}`}
                                {` · ${fmtDate(doc.uploadedAt)}`}
                              </p>
                            </div>
                          </div>
                          <div className="ml-4 shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            {isPreviewable(doc) && (
                              <button onClick={() => setPreviewDoc(doc)}
                                className="p-2 rounded-lg text-gray-400 hover:text-[#C8A96E] hover:bg-[#C8A96E]/10 transition"
                                title="Aperçu">
                                <Eye className="w-4 h-4" />
                              </button>
                            )}
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" download
                              className="p-2 rounded-lg text-gray-400 hover:text-[#C8A96E] hover:bg-[#C8A96E]/10 transition"
                              title={`Télécharger ${doc.name}`}>
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                );
              })
          )}

          {/* Info sécurité */}
          <div className="mt-8 p-4 bg-[#C8A96E]/5 border border-[#C8A96E]/20 rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#C8A96E] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Accès sécurisé AES-256</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Tous vos fichiers sont stockés en toute sécurité. Les liens de téléchargement
                sont protégés et n'expirent pas. Pour tout problème d'accès, contactez votre chef de projet.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {previewDoc && <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </>
  );
}
