import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ContactSection } from "@/components/contact-section";
import { StatsSection } from "@/components/stats-section";

const clientCategories = [
  {
    name: "Bâtiment et Travaux Publics (BTP)",
    clients: [
      { name: "LafargeHolcim", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/lafargeholcim.jpg" },
      { name: "Weber", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/weber.jpg" },
      { name: "Lafarge Placo", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/lafargeplaco.jpg" },
      { name: "DLM", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/DLM.jpg" },
      { name: "AkzoNobel", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/akzonobel.jpg" },
      { name: "Saint-Gobain", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/saintgobain.jpg" },
      { name: "Mawadis", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/mawadis.jpg" },
      { name: "Norton", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/norton.jpg" },
    ],
  },
  {
    name: "Industrie",
    clients: [
      { name: "SNEP", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/SNEP.jpg" },
      { name: "Mitsui", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/mitsui.jpg" },
      { name: "Vinci Energies", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO_VINCI_ENERGIES.png" },
      { name: "Bel", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/BEL.jpg" },
      { name: "ABB", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/ABB.jpg" },
      { name: "Qapco", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/qapco.jpg" },
      { name: "Cosumar", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/cosumar.jpg" },
      { name: "Sews", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/sews.jpg" },
      { name: "Schneider Electric", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/schneiderelectric.jpg" },
      { name: "Dacia", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/dacia.jpg" },
      { name: "Lesieur Cristal", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/lesieurcristal.jpg" },
      { name: "Iveco", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/iveco.jpg" },
      { name: "Renault", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/renault.jpg" },
      { name: "CNH", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/CNH.jpg" },
      { name: "Air Liquide", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/airliquide.jpg" },
    ],
  },
  {
    name: "IT",
    clients: [
      { name: "Edit Info", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/editinfo.jpg" },
      { name: "First Informatique", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/firstinformatique.jpg" },
      { name: "HR Access", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/hraccess.jpg" },
      { name: "Groupelec", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/groupelec.jpg" },
      { name: "Ingram", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/ingram.jpg" },
      { name: "Avaya", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/avaya.jpg" },
      { name: "Cires Telecom", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/cirestelecom.jpg" },
      { name: "Intel", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/intel.jpg" },
      { name: "Arrow", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/arrow.jpg" },
      { name: "Dell", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/dell.jpg" },
      { name: "Huawei", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/huawei.jpg" },
      { name: "Insoft", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/insoft.jpg" },
      { name: "Skatys", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/skatys.jpg" },
      { name: "Redington", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/redington.jpg" },
    ],
  },
  {
    name: "Transport et Logistique",
    clients: [
      { name: "Maghreb Solution", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/maghrebsolution.jpg" },
      { name: "Tanger Med", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/trangermed.jpg" },
      { name: "Qatar Airways", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/qatarairways.jpg" },
      { name: "FedEx", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/fedex.jpg" },
      { name: "Bolloré", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/bollore.jpg" },
      { name: "TMSA", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/TMSA.jpg" },
      { name: "SJL", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/sjl.jpg" },
      { name: "TM2", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/TM2.jpg" },
    ],
  },
  {
    name: "Administration",
    clients: [
      { name: "Casa Tram", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/casa-tram.jpg" },
      { name: "Wilaya de Casablanca", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/wilayadecasa.jpg" },
      { name: "Casa Transport", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/casa-transport.jpg" },
      { name: "Casa Patrimoine", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/casa-patrimoine.jpg" },
      { name: "Casa Aménagement", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/casa-amenagement.jpg" },
      { name: "UITP", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/UITP.jpg" },
      { name: "CRI", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/CRI.jpg" },
      { name: "Entraide", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/entraide.jpg" },
    ],
  },
  {
    name: "Finance et Assurance",
    clients: [
      { name: "Finea", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/finea.jpg" },
      { name: "Agma", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/agma.jpg" },
      { name: "AXA", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/axa.jpg" },
      { name: "HPS", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo_hps.png" },
      { name: "CMMB", logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo-CMMB.png" },
    ],
  },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <section className="relative pt-20 min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://epitaphe.ma/wp-content/uploads/2020/05/nos-references-clients.jpg')"
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6" data-testid="text-references-title">
            <span className="inline-block bg-primary px-4 py-2">Ils nous font</span>
            <br />
            <span className="inline-block bg-primary px-4 py-2 mt-2">confiance</span>
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" data-testid="text-references-subtitle">
            Des rencontres et... des réalisations !
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6">
            Depuis 2005, Epitaphe 360 a eu le plaisir de travailler aussi bien avec des multinationales, des grands groupes que des TPME. Dans de nombreux secteurs d'activité, des challenges nous ont réunis, des réalisations nous ont confortés et des réussites nous ont enchantés.
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-6">
            Il est une citation célèbre qui dit : "L'essentiel de la vie sont les êtres que l'on rencontre sur son chemin".
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8">
            Au nom de l'équipe de Epitaphe 360, Merci pour chacune de ces rencontres.
          </p>
          <p className="text-xl font-bold text-primary">Merci à chacun de nos clients!</p>
        </div>

        {clientCategories.map((category, idx) => (
          <div key={category.name} className="mb-16">
            <h3 
              className="text-xl md:text-2xl font-bold text-center mb-8 text-primary"
              data-testid={`text-category-${idx}`}
            >
              {category.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
              {category.clients.map((client) => (
                <div 
                  key={client.name}
                  className="bg-white dark:bg-card rounded-md p-4 flex items-center justify-center aspect-[3/2] hover-elevate transition-all"
                  data-testid={`card-client-${client.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <StatsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
