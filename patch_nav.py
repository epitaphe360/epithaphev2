with open('client/src/components/navigation.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_block = [
    '  {\n',
    '    label: "Outils",\n',
    '    href: "/outils",\n',
    '    rightAlign: true,\n',
    '    entries: [\n',
    '      { label: "BMI 360\u2122 Intelligence", description: "", href: "#", icon: null, isGroupHeader: true },\n',
    '      { label: "CommPulse\u2122",      description: "Score Communication Interne",    href: "/outils/commpulse",            icon: "BarChart2" },\n',
    '      { label: "TalentPrint\u2122",     description: "Score Marque Employeur",        href: "/outils/talentprint",          icon: "BarChart2" },\n',
    '      { label: "ImpactTrace\u2122",     description: "Score RSE et Impact",           href: "/outils/impacttrace",          icon: "BarChart2" },\n',
    '      { label: "SafeSignal\u2122",      description: "Score S\u00e9curit\u00e9 QHSE",             href: "/outils/safesignal",           icon: "BarChart2" },\n',
    '      { label: "EventImpact\u2122",     description: "Score \u00c9v\u00e9nementiel",              href: "/outils/eventimpact",          icon: "BarChart2" },\n',
    '      { label: "SpaceScore\u2122",      description: "Score Brand Physique",          href: "/outils/spacescore",           icon: "BarChart2" },\n',
    '      { label: "FinNarrative\u2122",    description: "Score Com Financi\u00e8re",          href: "/outils/finnarrative",         icon: "BarChart2" },\n',
    '      { label: "Tableau BMI 360\u2122",  description: "Vue globale de votre intelligence", href: "/outils/bmi360", icon: "BarChart2" },\n',
    '      { label: "Calculateur Fabrique", description: "Estimez vos \u00e9conomies de production", href: "/outils/calculateur-fabrique", icon: "Calculator" },\n',
    '      { label: "D\u00e9poser un brief",  description: "Formulaire strat\u00e9gique multi-\u00e9tapes", href: "/contact/brief", icon: "Mail" },\n',
    '    ],\n',
    '  },\n',
    '  {\n',
    '    label: "Espace Client",\n',
    '    rightAlign: true,\n',
    '    entries: [\n',
    '      { label: "Se connecter",     description: "Acc\u00e9der \u00e0 votre espace personnel",          href: "/espace-client",            icon: "LogIn" },\n',
    '      { label: "Mes projets",      description: "Suivi temps r\u00e9el de vos projets en cours", href: "/espace-client/projets",    icon: "FolderOpen" },\n',
    '      { label: "Mes documents",    description: "Coffre-fort num\u00e9rique et livrables sign\u00e9s",  href: "/espace-client/documents",  icon: "Lock" },\n',
    '      { label: "Mon abonnement",   description: "Plans, facturation et devis",                href: "/espace-client/abonnement", icon: "UserCircle" },\n',
    '    ],\n',
    '  },\n',
    '  { label: "Contact", href: "/contact" },\n',
]

# Lines 124-154 (0-indexed 123-153) are the Outils+EspaceClient+Contact block
new_lines = lines[:123] + new_block + lines[155:]

with open('client/src/components/navigation.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Done. New file has', len(new_lines), 'lines')
