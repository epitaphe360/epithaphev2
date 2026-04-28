-- ============================================================
-- MIGRATION 017: Contenu HTML des pages statiques dans la DB
-- Rend toutes les pages éditables via le CMS visuel (GrapesJS)
-- Idempotent: INSERT ... ON CONFLICT DO UPDATE
-- ============================================================

-- ─── Page : À Propos ─────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'À Propos',
  'a-propos',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  5,
  'À propos — Epitaphe 360, agence de communication 360° à Casablanca',
  'Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises et multinationales au Maroc dans leurs défis de communication : événementiel, branding, digital, QHSE, RSE et plus.',
  '<section class="py-16 bg-gray-50 border-t">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl font-bold mb-8">Notre mission</h2>
    <div class="grid md:grid-cols-2 gap-10">
      <div>
        <p class="text-gray-600 leading-relaxed mb-4">
          Epitaphe 360 est une agence de communication globale qui conçoit et produit des
          solutions créatives à fort impact. Notre force : une maîtrise totale de la chaîne de
          valeur, de l''idée à l''exécution.
        </p>
        <p class="text-gray-600 leading-relaxed">
          Nous comprenons vos contraintes en tant que CEO, Directeur marketing ou de
          communication : des délais serrés, des attentes élevées, un besoin constant
          d''innovation. C''est pour cela que nous avons choisi de faire autrement.
        </p>
      </div>
      <div>
        <ul class="space-y-3">
          <li>✓ Maîtrise totale de A à Z — de l''idée à l''exécution</li>
          <li>✓ Approche personnalisée — solutions sur mesure</li>
          <li>✓ Atelier interne — rapidité et réactivité garanties</li>
          <li>✓ KPI et suivi — mesure de l''impact de vos solutions</li>
          <li>✓ Optimisation de votre temps et de vos budgets</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="py-16">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl font-bold mb-4 text-center">Nos expertises</h2>
    <p class="text-center text-gray-500 mb-10">Six pôles d''excellence pour toute votre communication.</p>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="border rounded-xl p-6">
        <h3 class="font-bold mb-2">Nos pôles d''expertise</h3>
        <p class="text-gray-500 text-sm">COM'' Interne, Marque Employeur, QHSE, RSE, Événementiel</p>
        <a href="/nos-poles" class="text-orange-500 font-semibold text-sm mt-4 inline-block">En savoir plus →</a>
      </div>
      <div class="border rounded-xl p-6">
        <h3 class="font-bold mb-2">La Fabrique 360</h3>
        <p class="text-gray-500 text-sm">Branding de siège, stands, enseignes, impression, lettrage</p>
        <a href="/la-fabrique" class="text-orange-500 font-semibold text-sm mt-4 inline-block">En savoir plus →</a>
      </div>
      <div class="border rounded-xl p-6">
        <h3 class="font-bold mb-2">Architecture de Marque</h3>
        <p class="text-gray-500 text-sm">Identité visuelle, expérience client, communication corporate</p>
        <a href="/architecture-de-marque" class="text-orange-500 font-semibold text-sm mt-4 inline-block">En savoir plus →</a>
      </div>
      <div class="border rounded-xl p-6">
        <h3 class="font-bold mb-2">Événementiel</h3>
        <p class="text-gray-500 text-sm">Conventions, galas, roadshows, salons professionnels</p>
        <a href="/evenements" class="text-orange-500 font-semibold text-sm mt-4 inline-block">En savoir plus →</a>
      </div>
      <div class="border rounded-xl p-6">
        <h3 class="font-bold mb-2">Scoring BMI 360™</h3>
        <p class="text-gray-500 text-sm">8 outils d''intelligence communicationnelle et d''aide à la décision</p>
        <a href="/outils" class="text-orange-500 font-semibold text-sm mt-4 inline-block">En savoir plus →</a>
      </div>
      <div class="border rounded-xl p-6">
        <h3 class="font-bold mb-2">Ressources</h3>
        <p class="text-gray-500 text-sm">Articles, guides et études de cas pour booster votre communication</p>
        <a href="/ressources" class="text-orange-500 font-semibold text-sm mt-4 inline-block">En savoir plus →</a>
      </div>
    </div>
  </div>
</section>

<section class="py-16 bg-gray-900 text-white">
  <div class="max-w-6xl mx-auto px-6">
    <h2 class="text-3xl font-bold mb-10 text-center">Epitaphe 360 en chiffres</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-4xl font-bold text-orange-400 mb-2">20+</div>
        <p class="text-gray-300">Années d''expérience</p>
      </div>
      <div>
        <div class="text-4xl font-bold text-orange-400 mb-2">500+</div>
        <p class="text-gray-300">Clients accompagnés</p>
      </div>
      <div>
        <div class="text-4xl font-bold text-orange-400 mb-2">1200+</div>
        <p class="text-gray-300">Projets réalisés</p>
      </div>
      <div>
        <div class="text-4xl font-bold text-orange-400 mb-2">360°</div>
        <p class="text-gray-300">Vision communication</p>
      </div>
    </div>
  </div>
</section>',
  '{"grapesjs":{"html":"<section class=\"py-16 bg-gray-50 border-t\"><div class=\"max-w-6xl mx-auto px-6\"><h2 class=\"text-3xl font-bold mb-8\">Notre mission</h2><div class=\"grid md:grid-cols-2 gap-10\"><div><p class=\"text-gray-600 leading-relaxed mb-4\">Epitaphe 360 est une agence de communication globale qui conçoit et produit des solutions créatives à fort impact. Notre force : une maîtrise totale de la chaîne de valeur, de l''idée à l''exécution.</p><p class=\"text-gray-600 leading-relaxed\">Nous comprenons vos contraintes en tant que CEO, Directeur marketing ou de communication : des délais serrés, des attentes élevées, un besoin constant d''innovation. C''est pour cela que nous avons choisi de faire autrement.</p></div><div><ul class=\"space-y-3\"><li>✓ Maîtrise totale de A à Z — de l''idée à l''exécution</li><li>✓ Approche personnalisée — solutions sur mesure</li><li>✓ Atelier interne — rapidité et réactivité garanties</li><li>✓ KPI et suivi — mesure de l''impact de vos solutions</li><li>✓ Optimisation de votre temps et de vos budgets</li></ul></div></div></div></section>","css":"","components":""}}',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  status            = EXCLUDED.status,
  template          = EXCLUDED.template,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  content           = EXCLUDED.content,
  sections          = EXCLUDED.sections,
  published_at      = EXCLUDED.published_at,
  updated_at        = NOW();

-- ─── Page : FAQ ──────────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'FAQ',
  'faq',
  'PUBLISHED',
  'GRAPES_JS',
  false,
  10,
  'FAQ — Questions fréquentes | Epitaphe 360',
  'Toutes les réponses à vos questions sur Epitaphe 360 : délais, devis, scoring BMI 360™, espace client, production et expertises communication.',
  '<div class="max-w-3xl mx-auto px-4 py-16">

  <h2 class="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">Général</h2>
  <div class="border rounded-2xl px-6 mb-10">
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Qu''est-ce qu''une agence de communication 360° ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Une agence 360° gère l''ensemble des aspects de votre communication : stratégie, création graphique, production (impression, signalétique, stands), événementiel et digital. Epitaphe 360 maîtrise toute la chaîne de valeur, de l''idée à l''exécution, avec un atelier de production interne à Casablanca.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Dans quels secteurs intervenez-vous ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Nous intervenons dans tous les secteurs : banque & finance, industrie, énergie, télécommunications, grande distribution, immobilier, pharma, et associations. Nos clients incluent des multinationales, des grands groupes marocains et des PME ambitieuses.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Êtes-vous basés uniquement à Casablanca ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Notre siège est à Casablanca (Rez-de-chaussée, 7-9 Rue Bussang, Maarif). Nous intervenons sur tout le Maroc et pouvons accompagner des projets à l''international selon les besoins.</p>
    </details>
  </div>

  <h2 class="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">La Fabrique 360</h2>
  <div class="border rounded-2xl px-6 mb-10">
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Quels sont vos délais de production habituels ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Les délais varient selon le type de projet : de 48h pour des impressions simples à 4-6 semaines pour un stand sur mesure ou un habillage complet de siège. Nous nous engageons toujours sur des délais réalistes et les respectons.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Proposez-vous des devis gratuits ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Oui, tous nos devis sont gratuits et détaillés. Utilisez notre formulaire de contact ou le module de demande de brief pour nous transmettre votre projet. Nous vous répondons sous 24 à 48h ouvrées.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Faites-vous de la pose et installation ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Oui, notre équipe assure la pose et l''installation sur site pour toutes nos productions : enseignes, signalétiques, habillage de siège, stands et décors événementiels.</p>
    </details>
  </div>

  <h2 class="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">Scoring BMI 360™</h2>
  <div class="border rounded-2xl px-6 mb-10">
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Qu''est-ce que le scoring BMI 360™ ?</summary>
      <p class="text-gray-600 mt-3 pb-1">BMI 360™ (Brand Marketing Intelligence) est notre suite d''outils propriétaires d''évaluation communicationnelle. Elle comprend 8 scores thématiques (CommPulse™, TalentPrint™, SafeSignal™, ImpactTrace™, EventImpact™, SpaceScore™, FinNarrative™, Tableau BMI 360™) qui mesurent l''efficacité de votre communication par axe.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Les outils de scoring sont-ils gratuits ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Les outils de scoring sont accessibles depuis votre espace client. Une version de démonstration gratuite est disponible pour CommPulse™ et TalentPrint™. Pour un accès complet et l''accompagnement d''un consultant, contactez-nous.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Comment interpréter les résultats du scoring ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Chaque outil génère un score de 0 à 100, accompagné d''une analyse par dimension et d''un plan d''action personnalisé. Nos consultants peuvent vous accompagner dans la lecture et la mise en œuvre des recommandations.</p>
    </details>
  </div>

  <h2 class="text-xs font-bold uppercase tracking-widest text-orange-500 mb-4">Espace Client</h2>
  <div class="border rounded-2xl px-6 mb-10">
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Comment accéder à mon espace client ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Votre espace client est accessible à l''adresse /espace-client. Si vous n''avez pas encore de compte, contactez-nous pour l''activation. Vous y trouverez le suivi de vos projets, vos documents et vos factures.</p>
    </details>
    <details class="py-4 border-b last:border-0">
      <summary class="font-semibold cursor-pointer">Puis-je suivre l''avancement de mon projet en temps réel ?</summary>
      <p class="text-gray-600 mt-3 pb-1">Oui, votre espace client inclut un module de suivi de projet avec timeline, statuts d''avancement, livrables et commentaires. Vous êtes notifié à chaque étape clé de votre projet.</p>
    </details>
  </div>

</div>',
  '{"grapesjs":{"html":"","css":"","components":""}}',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  status            = EXCLUDED.status,
  template          = EXCLUDED.template,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  content           = EXCLUDED.content,
  sections          = EXCLUDED.sections,
  published_at      = EXCLUDED.published_at,
  updated_at        = NOW();

-- ─── Page : Mentions Légales ─────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Mentions Légales',
  'mentions-legales',
  'PUBLISHED',
  'GRAPES_JS',
  false,
  20,
  'Mentions Légales — Epitaphe 360',
  'Mentions légales du site Epitaphe 360, agence de communication 360° à Casablanca.',
  '<div class="max-w-3xl mx-auto px-6 py-16 space-y-8">

  <h2 class="text-2xl font-bold">Éditeur du site</h2>
  <p><strong>Épitaphe 360</strong><br>
  Rez de chaussée Immeuble 7-9 Rue Bussang<br>
  Casablanca, Maroc<br>
  Téléphone : +212 662 744 741<br>
  Email : info@epitaphe.ma</p>

  <h2 class="text-2xl font-bold">Directeur de la publication</h2>
  <p>Le directeur de la publication est le représentant légal de la société Épitaphe 360.</p>

  <h2 class="text-2xl font-bold">Hébergement</h2>
  <p>Ce site est hébergé par Railway / Vercel.<br>
  Les informations d''hébergement sont disponibles sur demande.</p>

  <h2 class="text-2xl font-bold">Propriété intellectuelle</h2>
  <p>L''ensemble du contenu de ce site (textes, images, vidéos, graphismes, logo, icônes, etc.) est la propriété exclusive d''Épitaphe 360 ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site est interdite, sauf autorisation écrite préalable.</p>

  <h2 class="text-2xl font-bold">Limitation de responsabilité</h2>
  <p>Épitaphe 360 ne saurait être tenue responsable des dommages directs et indirects causés au matériel de l''utilisateur lors de l''accès au site. Épitaphe 360 décline toute responsabilité quant à l''utilisation qui pourrait être faite des informations et contenus présents sur le site.</p>

  <h2 class="text-2xl font-bold">Liens hypertextes</h2>
  <p>Le site peut contenir des liens hypertextes vers d''autres sites. Épitaphe 360 n''exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité les concernant.</p>

  <h2 class="text-2xl font-bold">Droit applicable</h2>
  <p>Les présentes mentions légales sont soumises au droit marocain. En cas de litige, les tribunaux de Casablanca seront compétents.</p>

</div>',
  '{"grapesjs":{"html":"","css":"","components":""}}',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  status            = EXCLUDED.status,
  template          = EXCLUDED.template,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  content           = EXCLUDED.content,
  sections          = EXCLUDED.sections,
  published_at      = EXCLUDED.published_at,
  updated_at        = NOW();

-- ─── Page : Politique de Confidentialité ────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Politique de Confidentialité',
  'politique-confidentialite',
  'PUBLISHED',
  'GRAPES_JS',
  false,
  21,
  'Politique de Confidentialité — Epitaphe 360',
  'Politique de confidentialité et protection des données personnelles d''Epitaphe 360.',
  '<div class="max-w-3xl mx-auto px-6 py-16 space-y-8">

  <h2 class="text-2xl font-bold">Introduction</h2>
  <p>Épitaphe 360 s''engage à protéger la vie privée des utilisateurs de son site internet. La présente politique de confidentialité décrit les informations que nous collectons, comment nous les utilisons et les mesures que nous prenons pour les protéger.</p>

  <h2 class="text-2xl font-bold">Collecte des données</h2>
  <p>Nous collectons les données personnelles que vous nous fournissez volontairement via nos formulaires de contact, de brief projet, ou d''inscription à notre newsletter. Ces données peuvent inclure : nom, prénom, adresse email, numéro de téléphone, nom de l''entreprise.</p>

  <h2 class="text-2xl font-bold">Utilisation des données</h2>
  <p>Vos données personnelles sont utilisées pour :</p>
  <ul>
    <li>Répondre à vos demandes de contact et de devis</li>
    <li>Vous envoyer des informations relatives à nos services (si vous y avez consenti)</li>
    <li>Améliorer notre site internet et nos services</li>
    <li>Gérer la relation client via notre espace client sécurisé</li>
  </ul>

  <h2 class="text-2xl font-bold">Conservation des données</h2>
  <p>Vos données personnelles sont conservées pendant une durée n''excédant pas celle nécessaire aux finalités pour lesquelles elles sont collectées et traitées. Les données de contact sont conservées pendant 3 ans à compter du dernier contact.</p>

  <h2 class="text-2xl font-bold">Partage des données</h2>
  <p>Épitaphe 360 ne vend, ne loue et ne partage pas vos données personnelles avec des tiers à des fins commerciales. Vos données peuvent être communiquées à nos sous-traitants techniques (hébergeur, outils d''emailing) dans le strict cadre de la réalisation de nos services.</p>

  <h2 class="text-2xl font-bold">Cookies</h2>
  <p>Notre site utilise des cookies techniques nécessaires au bon fonctionnement du site et des cookies analytiques pour mesurer l''audience. Vous pouvez configurer votre navigateur pour refuser les cookies.</p>

  <h2 class="text-2xl font-bold">Vos droits</h2>
  <p>Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l''égard du traitement des données à caractère personnel, vous disposez des droits suivants :</p>
  <ul>
    <li>Droit d''accès à vos données personnelles</li>
    <li>Droit de rectification de vos données</li>
    <li>Droit d''opposition au traitement de vos données</li>
    <li>Droit de suppression de vos données</li>
  </ul>
  <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:info@epitaphe.ma">info@epitaphe.ma</a></p>

  <h2 class="text-2xl font-bold">Sécurité</h2>
  <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre toute perte, détournement, accès non autorisé, divulgation, altération ou destruction.</p>

  <h2 class="text-2xl font-bold">Contact</h2>
  <p><strong>Épitaphe 360</strong><br>
  Email : <a href="mailto:info@epitaphe.ma">info@epitaphe.ma</a><br>
  Téléphone : +212 662 744 741</p>

</div>',
  '{"grapesjs":{"html":"","css":"","components":""}}',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  title             = EXCLUDED.title,
  status            = EXCLUDED.status,
  template          = EXCLUDED.template,
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  content           = EXCLUDED.content,
  sections          = EXCLUDED.sections,
  published_at      = EXCLUDED.published_at,
  updated_at        = NOW();

-- ─── Vérification ────────────────────────────────────────────────────────────
SELECT slug, status, template, LEFT(content, 80) AS content_preview
FROM pages
WHERE slug IN ('a-propos', 'faq', 'mentions-legales', 'politique-confidentialite')
ORDER BY slug;
