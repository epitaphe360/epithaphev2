const clients = [
  {
    name: "Qatar Airways",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/Logo_Qatar_Airways.png",
  },
  {
    name: "HPS",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo_hps.png",
  },
  {
    name: "CMMB",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo-CMMB.png",
  },
  {
    name: "DataProtect",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo_dataprotect.png",
  },
  {
    name: "XCOM",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/logo-xcom.png",
  },
  {
    name: "Vinci Energies",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO_VINCI_ENERGIES.png",
  },
  {
    name: "Schneider Electric",
    logo: "https://epitaphe.ma/wp-content/uploads/2020/05/Logo_Schneider_Electric.png",
  },
];

export function ClientsSection() {
  return (
    <section
      className="py-16 md:py-24 bg-secondary/30 overflow-hidden"
      data-testid="section-clients"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground"
            data-testid="text-clients-title"
          >
            Ils nous font confiance
          </h2>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-secondary/30 to-transparent z-10" />

        <div className="flex animate-scroll items-center">
          {[...clients, ...clients, ...clients].map((client, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 md:mx-12"
              data-testid={`client-logo-${index}`}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-12 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
