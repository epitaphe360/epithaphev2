import { Link } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <title>Page introuvable — Epitaphe 360</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-8xl font-bold text-[#C8A96E] mb-4 select-none">404</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-gray-500 max-w-md mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-[#C8A96E] hover:bg-[#b8965e] text-white font-semibold rounded-lg transition-colors"
        >
          Retour à l'accueil
        </Link>
      </main>
      <Footer />
    </div>
  );
}
