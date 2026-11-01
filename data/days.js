/* Leçons des 7 jours : texte, schémas SVG, pièges. */
window.DAYS=[
{n:1,short:"Concepts cloud",title:"Le cloud et l’infrastructure mondiale",dom:1,time:"≈ 4 h",
 lede:"Pourquoi le cloud, comment AWS est découpé dans le monde, et les trois cadres que l’examen adore : Well-Architected, CAF et les 7 R de migration.",
 steps:[["Lire la leçon et refaire chaque schéma de tête sur une feuille","60 min"],["AWS Cloud Quest : première mission (Cloud Practitioner)","60 min"],["Synthèse GitHub : section Cloud Concepts","30 min"],["Quiz du jour, viser 80 % ou plus","30 min"],["Relire les explications des questions ratées","20 min"]],
 lesson:`
<section class="card"><h3>Les 6 avantages du cloud</h3><p class="sub">Phrases officielles, à reconnaître mot pour mot dans les questions.</p>
<div class="grid">
 <div class="tile"><p class="k">CapEx → OpEx</p><b>Dépense variable</b><p>Plus d’achat de serveurs à l’avance : tu paies ce que tu consommes.</p></div>
 <div class="tile"><p class="k">volume</p><b>Économies d’échelle</b><p>AWS agrège des millions de clients, donc des prix plus bas pour tous.</p></div>
 <div class="tile"><p class="k">capacité</p><b>Arrêter de deviner</b><p>Plus besoin de prévoir le pic : tu montes et descends à la demande.</p></div>
 <div class="tile"><p class="k">vitesse</p><b>Rapidité et agilité</b><p>Des ressources en minutes au lieu de semaines : on expérimente plus.</p></div>
 <div class="tile"><p class="k">datacenter</p><b>Fini l’entretien</b><p>Tu arrêtes de payer racks, électricité, clim : tu te concentres sur tes clients.</p></div>
 <div class="tile"><p class="k">monde</p><b>Global en minutes</b><p>Tu déploies dans plusieurs Régions du monde en quelques clics.</p></div>
</div></section>

<section class="card"><h3>L’économie du cloud</h3><p class="sub">Le guide officiel insiste sur ces notions : coûts fixes ou variables, licences, bonne taille, automatisation.</p>
<div class="grid">
 <div class="tile"><p class="k">sur site</p><b>Coûts fixes</b><p>Serveurs achetés d’avance, datacenter, électricité, clim, personnel, même quand rien ne tourne.</p></div>
 <div class="tile"><p class="k">cloud</p><b>Coûts variables</b><p>Tu paies à l’usage et tu éteins ce qui ne sert pas. Le TCO (coût total de possession) compare les deux.</p></div>
 <div class="tile"><p class="k">licences</p><b>BYOL ou licence incluse</b><p>BYOL : tu réutilises tes licences (souvent sur Dedicated Hosts). Licence incluse : le prix de l’instance la contient.</p></div>
 <div class="tile"><p class="k">taille</p><b>Rightsizing</b><p>Choisir la plus petite ressource qui tient la charge réelle. Outil : Compute Optimizer.</p></div>
 <div class="tile"><p class="k">automatiser</p><b>Moins d’erreurs, plus vite</b><p>IaC, Auto Scaling, sauvegardes planifiées : moins de travail manuel, des déploiements reproductibles.</p></div>
 <div class="tile"><p class="k">volume</p><b>Économies d’échelle</b><p>AWS achète en masse et baisse ses prix : tu en profites sans rien faire.</p></div>
</div></section>

<section class="card"><h3>L’infrastructure mondiale AWS</h3><p class="sub">Région ⊃ zones de disponibilité (AZ) ⊃ datacenters. Le deuxième onglet montre ce qui vit en dehors des Régions.</p>
<div class="viz" data-viz="global-infra"></div>
<div class="legend"><span>Les AZ ne partagent <b>aucun point de panne unique</b></span><span>Panne d’un datacenter → <b>multi-AZ</b></span><span>Catastrophe régionale, latence mondiale, souveraineté → <b>multi-Région</b></span><span>Choisir une Région : conformité, latence, services dispo, prix</span></div>
</section>

<section class="card"><h3>Qui gère quoi : sur site, IaaS, PaaS, SaaS</h3><p class="sub">Plus tu vas vers la droite, plus AWS gère à ta place.</p>
<div class="tbl-wrap"><table class="m">
<tr><th></th><th>Sur site</th><th>IaaS<span class="tag">EC2</span></th><th>PaaS<span class="tag">Elastic Beanstalk</span></th><th>SaaS<span class="tag">appli prête</span></th></tr>
<tr><td class="h">Données</td><td class="c">Toi</td><td class="c">Toi</td><td class="c">Toi</td><td class="c">Toi</td></tr>
<tr><td class="h">Application</td><td class="c">Toi</td><td class="c">Toi</td><td class="c">Toi</td><td class="a">Fournisseur</td></tr>
<tr><td class="h">Runtime, middleware</td><td class="c">Toi</td><td class="c">Toi</td><td class="a">AWS</td><td class="a">Fournisseur</td></tr>
<tr><td class="h">Système d’exploitation</td><td class="c">Toi</td><td class="c">Toi</td><td class="a">AWS</td><td class="a">Fournisseur</td></tr>
<tr><td class="h">Virtualisation, serveurs</td><td class="c">Toi</td><td class="a">AWS</td><td class="a">AWS</td><td class="a">Fournisseur</td></tr>
<tr><td class="h">Datacenter physique</td><td class="c">Toi</td><td class="a">AWS</td><td class="a">AWS</td><td class="a">Fournisseur</td></tr>
</table></div>
<div class="legend"><span><i style="background:var(--amber-soft)"></i>Toi (client)</span><span><i style="background:var(--accent-soft)"></i>AWS / fournisseur</span><span>Modèles de déploiement : <b>Cloud</b> · <b>Hybride</b> (sur site + cloud connectés) · <b>Sur site</b> (cloud privé)</span></div>
</section>

<section class="card"><h3>AWS Well-Architected Framework : 6 piliers</h3><p class="sub">Un temple : si un pilier manque, l’architecture penche.</p>
<div class="dia-wrap"><svg class="dia" viewBox="0 0 680 250" role="img" aria-label="Six piliers : excellence opérationnelle, sécurité, fiabilité, efficacité des performances, optimisation des coûts, durabilité">
 <polygon class="sv-a" points="20,72 340,12 660,72"/>
 <text class="sv-t b" x="340" y="58" text-anchor="middle">Well-Architected Framework</text>
 <rect class="sv-b" x="40" y="82" width="80" height="116" rx="4"/><text class="sv-t sm b" x="80" y="134" text-anchor="middle"><tspan x="80">Excellence</tspan><tspan x="80" dy="15">opération.</tspan></text>
 <rect class="sv-b" x="144" y="82" width="80" height="116" rx="4"/><text class="sv-t sm b" x="184" y="142" text-anchor="middle">Sécurité</text>
 <rect class="sv-b" x="248" y="82" width="80" height="116" rx="4"/><text class="sv-t sm b" x="288" y="142" text-anchor="middle">Fiabilité</text>
 <rect class="sv-b" x="352" y="82" width="80" height="116" rx="4"/><text class="sv-t sm b" x="392" y="134" text-anchor="middle"><tspan x="392">Efficacité</tspan><tspan x="392" dy="15">des perfs</tspan></text>
 <rect class="sv-b" x="456" y="82" width="80" height="116" rx="4"/><text class="sv-t sm b" x="496" y="134" text-anchor="middle"><tspan x="496">Optimisat.</tspan><tspan x="496" dy="15">des coûts</tspan></text>
 <rect class="sv-g" x="560" y="82" width="80" height="116" rx="4"/><text class="sv-t sm b" x="600" y="142" text-anchor="middle">Durabilité</text>
 <rect class="sv-w" x="20" y="206" width="640" height="32" rx="6"/><text class="sv-t" x="340" y="227" text-anchor="middle">Tes charges de travail (workloads)</text>
</svg></div>
<div class="grid" style="margin-top:10px">
 <div class="tile"><b>Excellence opérationnelle</b><p>Automatiser, petits changements fréquents, apprendre des incidents.</p></div>
 <div class="tile"><b>Sécurité</b><p>Protéger données et systèmes, traçabilité, moindre privilège.</p></div>
 <div class="tile"><b>Fiabilité</b><p>Se rétablir des pannes, s’adapter à la demande.</p></div>
 <div class="tile"><b>Efficacité des performances</b><p>Bons types et tailles de ressources, serverless, global.</p></div>
 <div class="tile"><b>Optimisation des coûts</b><p>Éviter les dépenses inutiles, payer à l’usage.</p></div>
 <div class="tile"><b>Durabilité</b><p>Réduire l’impact environnemental, maximiser l’utilisation.</p></div>
</div>
<p class="note" style="margin-top:10px">Outil gratuit associé : <b>AWS Well-Architected Tool</b>, qui évalue tes charges de travail contre ces piliers.</p>
</section>

<section class="card"><h3>AWS Cloud Adoption Framework (CAF) : 6 perspectives</h3><p class="sub">Comment une entreprise organise son passage au cloud.</p>
<div class="triad">
 <div class="tile w"><p class="k">côté métier</p><b>Business</b><p>Stratégie, portefeuille, innovation, produits.</p></div>
 <div class="tile w"><p class="k">côté métier</p><b>People</b><p>Formation, culture, organisation, gestion du changement.</p></div>
 <div class="tile w"><p class="k">côté métier</p><b>Governance</b><p>Programmes, risques, gestion financière du cloud.</p></div>
 <div class="tile"><p class="k">côté technique</p><b>Platform</b><p>Architecture, ingénierie de la plateforme, CI/CD.</p></div>
 <div class="tile"><p class="k">côté technique</p><b>Security</b><p>Identités, détection, protection des données.</p></div>
 <div class="tile"><p class="k">côté technique</p><b>Operations</b><p>Surveillance, incidents, disponibilité au quotidien.</p></div>
</div>
<p class="note" style="margin-top:10px">Les 4 phases du CAF : <b>Envision → Align → Launch → Scale</b>. Les 4 bénéfices annoncés : <b>moins de risque métier</b>, <b>meilleure performance ESG</b> (environnement, social, gouvernance), <b>plus de chiffre d’affaires</b>, <b>plus d’efficacité opérationnelle</b>.</p>
</section>

<section class="card"><h3>Les 7 R de la migration</h3><p class="sub">Classés de l’effort le plus faible au plus fort.</p>
<div class="bars">
 <div class="bar"><span><b>Retire</b> · supprimer</span><div class="tr"><div class="fl g" style="width:4%"></div></div><span class="v">on éteint</span></div>
 <div class="bar"><span><b>Retain</b> · garder</span><div class="tr"><div class="fl g" style="width:4%"></div></div><span class="v">plus tard</span></div>
 <div class="bar"><span><b>Rehost</b> · lift &amp; shift</span><div class="tr"><div class="fl" style="width:25%"></div></div><span class="v">tel quel → EC2</span></div>
 <div class="bar"><span><b>Relocate</b></span><div class="tr"><div class="fl" style="width:28%"></div></div><span class="v">VMware → AWS</span></div>
 <div class="bar"><span><b>Repurchase</b></span><div class="tr"><div class="fl" style="width:42%"></div></div><span class="v">passer au SaaS</span></div>
 <div class="bar"><span><b>Replatform</b></span><div class="tr"><div class="fl w" style="width:58%"></div></div><span class="v">→ service managé</span></div>
 <div class="bar"><span><b>Refactor</b></span><div class="tr"><div class="fl w" style="width:100%"></div></div><span class="v">réécrire (cloud natif)</span></div>
</div>
<p class="note" style="margin-top:10px">Outils : <b>Migration Evaluator</b> (étude de coûts avant de migrer), <b>Application Discovery Service</b> (inventaire), <b>Migration Hub</b> (suivi), <b>Application Migration Service</b> (rehost), <b>DMS</b> (bases, réplication continue) et <b>SCT</b> (conversion de schéma entre moteurs).</p>
</section>`,
 traps:["« Économies d’échelle » ≠ « dépense variable ». Payer à l’usage = dépense variable ; prix bas grâce au volume = économies d’échelle.","Survivre à la panne d’un datacenter = multi-AZ, pas multi-Région (plus cher et pas nécessaire).","Le pilier Durabilité parle d’environnement. L’optimisation des coûts parle d’argent.","Replatform garde le code mais change la plateforme (ex. Oracle sur serveur → RDS). Refactor réécrit l’application.","Les 4 bénéfices du CAF : risque métier réduit, performance ESG, revenus, efficacité opérationnelle. Jamais « plus de responsabilité de sécurité pour AWS »."]},

{n:2,short:"Responsabilité & IAM",title:"Responsabilité partagée et identités (IAM)",dom:2,time:"≈ 4 h",
 lede:"Qui sécurise quoi entre toi et AWS, puis comment donner exactement les bons accès : utilisateurs, groupes, rôles, politiques, Organizations.",
 steps:[["Lire la leçon : dessine le schéma de responsabilité partagée de mémoire","50 min"],["Cloud Quest : mission sur IAM / sécurité","60 min"],["Synthèse GitHub : Security & Compliance (partie IAM)","30 min"],["Quiz du jour, viser 80 % ou plus","30 min"],["Refaire les erreurs du jour 1 (onglet Erreurs)","20 min"]],
 lesson:`
<section class="card"><h3>Le modèle de responsabilité partagée</h3><p class="sub">AWS sécurise le cloud. Toi, tu sécurises ce que tu mets dedans.</p>
<div class="viz" data-viz="shared-responsibility"></div>
<div class="stack" style="gap:8px">
 <div class="tile w"><p class="k">client · sécurité DANS le cloud</p>
  <div class="grid" style="margin-top:6px"><div><b>Données clients</b><p>Classification, chiffrement côté client ou serveur</p></div><div><b>IAM</b><p>Utilisateurs, rôles, MFA, permissions</p></div><div><b>OS invité et applis</b><p>Patchs de l’OS sur EC2, pare-feu, security groups</p></div><div><b>Réseau</b><p>Configuration du trafic, chiffrement en transit</p></div></div></div>
 <div class="tile" style="background:var(--accent-soft);border-color:var(--accent)"><p class="k">AWS · sécurité DU cloud</p>
  <div class="grid" style="margin-top:6px"><div><b>Logiciel</b><p>Compute, stockage, bases, réseau</p></div><div><b>Hyperviseur</b><p>Virtualisation des serveurs</p></div><div><b>Matériel</b><p>Régions, AZ, edge locations</p></div><div><b>Physique</b><p>Gardes, accès aux bâtiments, destruction des disques</p></div></div></div>
</div>
<p class="note" style="margin-top:10px">Contrôles <b>partagés</b> : gestion des correctifs, gestion de la configuration, formation et sensibilisation. Chacun s’en occupe pour sa propre couche. Contrôles <b>hérités</b> : physiques et environnementaux, entièrement chez AWS.</p>
</section>

<section class="card"><h3>La ligne bouge selon le service</h3><p class="sub">Plus le service est managé, plus la part d’AWS monte.</p>
<div class="tbl-wrap"><table class="m">
<tr><th></th><th>Données et accès</th><th>Code / appli</th><th>OS invité et patchs</th><th>Moteur / runtime</th><th>Matériel</th></tr>
<tr><td class="h">EC2<span class="tag">IaaS</span></td><td class="c">Toi</td><td class="c">Toi</td><td class="c">Toi</td><td class="c">Toi</td><td class="a">AWS</td></tr>
<tr><td class="h">RDS<span class="tag">managé</span></td><td class="c">Toi</td><td class="c">Toi (schéma, requêtes)</td><td class="a">AWS</td><td class="a">AWS</td><td class="a">AWS</td></tr>
<tr><td class="h">Lambda<span class="tag">serverless</span></td><td class="c">Toi</td><td class="c">Toi</td><td class="a">AWS</td><td class="a">AWS</td><td class="a">AWS</td></tr>
<tr><td class="h">S3<span class="tag">stockage objet</span></td><td class="c">Toi (bucket policy, chiffrement)</td><td class="n">non</td><td class="a">AWS</td><td class="a">AWS</td><td class="a">AWS</td></tr>
</table></div></section>

<section class="card"><h3>IAM : qui a le droit de faire quoi</h3><p class="sub">Une personne = un utilisateur. Une équipe = un groupe. Un service AWS = un rôle. Les droits = une politique JSON.</p>
<div class="viz" data-viz="iam"></div>
<div class="grid" style="margin-top:12px">
 <div class="tile"><b>Utilisateur root</b><p>Accès total. MFA, pas de clés d’accès, jamais au quotidien.</p></div>
 <div class="tile"><b>Moindre privilège</b><p>Uniquement les droits nécessaires. Par défaut : tout est refusé.</p></div>
 <div class="tile"><b>Politique d’identité</b><p>Attachée à un utilisateur, groupe ou rôle.</p></div>
 <div class="tile"><b>Politique de ressource</b><p>Attachée à la ressource, ex. bucket policy S3.</p></div>
 <div class="tile"><b>IAM Identity Center</b><p>Connexion unique des EMPLOYÉS à plusieurs comptes.</p></div>
 <div class="tile"><b>Amazon Cognito</b><p>Connexion des CLIENTS de ton appli web ou mobile.</p></div>
 <div class="tile"><b>Credential report</b><p>CSV : tous les utilisateurs et l’état de leurs identifiants.</p></div>
 <div class="tile"><b>IAM Access Analyzer</b><p>Trouve les ressources partagées avec l’extérieur.</p></div>
 <div class="tile"><b>Politiques gérées ou personnalisées</b><p>Gérées par AWS : prêtes à l’emploi. Gérées par le client : sur mesure et réutilisables. Inline : collées à une seule identité.</p></div>
 <div class="tile"><b>Fédération</b><p>Les employés gardent leur annuaire (Active Directory, Okta) et reçoivent un accès temporaire à AWS.</p></div>
 <div class="tile"><b>Rôle inter-comptes</b><p>Un utilisateur du compte A assume un rôle du compte B : aucun deuxième identifiant.</p></div>
 <div class="tile"><b>Ranger les secrets</b><p>Secrets Manager (rotation auto) ou Systems Manager Parameter Store. Jamais dans le code.</p></div>
</div></section>

<section class="card"><h3>AWS Organizations : plusieurs comptes, une seule tête</h3><p class="sub">Les SCP fixent un plafond de permissions. Elles n’accordent rien, elles limitent, même l’admin d’un compte membre.</p>
<div class="dia-wrap"><svg class="dia" viewBox="0 0 680 220" role="img" aria-label="Compte de gestion avec deux unités organisationnelles et leurs comptes">
 <rect class="sv-a" x="250" y="10" width="180" height="46" rx="8"/><text class="sv-t b" x="340" y="30" text-anchor="middle">Compte de gestion</text><text class="sv-m sm" x="340" y="47" text-anchor="middle">facture consolidée</text>
 <line class="sv-ln" x1="300" y1="56" x2="190" y2="90"/><line class="sv-ln" x1="380" y1="56" x2="490" y2="90"/>
 <rect class="sv-b" x="90" y="90" width="200" height="56" rx="8"/><text class="sv-t b" x="190" y="112" text-anchor="middle">OU Production</text><text class="sv-wt sm b" x="190" y="132" text-anchor="middle">SCP : Régions UE uniquement</text>
 <rect class="sv-b" x="390" y="90" width="200" height="56" rx="8"/><text class="sv-t b" x="490" y="112" text-anchor="middle">OU Développement</text><text class="sv-wt sm b" x="490" y="132" text-anchor="middle">SCP : pas d’instances GPU</text>
 <line class="sv-ln" x1="150" y1="146" x2="115" y2="172"/><line class="sv-ln" x1="230" y1="146" x2="265" y2="172"/><line class="sv-ln" x1="490" y1="146" x2="490" y2="172"/>
 <rect class="sv-s" x="60" y="172" width="110" height="34" rx="6"/><text class="sv-t sm" x="115" y="194" text-anchor="middle">Compte A</text>
 <rect class="sv-s" x="210" y="172" width="110" height="34" rx="6"/><text class="sv-t sm" x="265" y="194" text-anchor="middle">Compte B</text>
 <rect class="sv-s" x="435" y="172" width="110" height="34" rx="6"/><text class="sv-t sm" x="490" y="194" text-anchor="middle">Compte C</text>
</svg></div>
<p class="note">Pour créer tout ça automatiquement avec des garde-fous : <b>AWS Control Tower</b>. Rapports de conformité d’AWS (SOC, ISO, PCI) : <b>AWS Artifact</b>.</p>
</section>

<section class="card"><h3>Tâches réservées à l’utilisateur root</h3>
<div class="grid"><div class="tile w"><b>Paramètres du compte</b><p>Changer l’e-mail, le nom, le mot de passe root</p></div><div class="tile w"><b>Plan AWS Support</b><p>Le changer ou l’annuler</p></div><div class="tile w"><b>Fermer le compte</b><p>Clôture définitive</p></div><div class="tile w"><b>Restaurer IAM</b><p>Si un admin s’est bloqué tout seul</p></div></div>
</section>`,
 traps:["Sur EC2, les patchs de l’OS sont pour TOI. Sur RDS ou Lambda, c’est AWS.","Une SCP n’accorde jamais de droits : elle fixe le maximum autorisé dans les comptes membres.","Cognito = clients de ton appli. IAM Identity Center = employés qui accèdent à AWS.","AWS Artifact = rapports d’AWS. AWS Audit Manager = preuves sur TON usage d’AWS."]},

{n:3,short:"Services sécurité",title:"Services de sécurité, chiffrement et surveillance",dom:2,time:"≈ 4 h 30",
 lede:"Une douzaine de services aux noms proches. On les range par mission : protéger, détecter, enquêter, auditer, chiffrer.",
 steps:[["Lire la leçon, puis réciter la triade CloudTrail / Config / CloudWatch","50 min"],["Cloud Quest : mission sécurité ou surveillance","60 min"],["Fiches : un nom de service → une phrase, à voix haute","30 min"],["Quiz du jour, viser 80 % ou plus","30 min"],["Refaire toutes tes erreurs accumulées","30 min"]],
 lesson:`
<section class="card"><h3>La carte des services de sécurité</h3><p class="sub">Range chaque service dans sa colonne : c’est ce que les questions testent.</p>
<div class="grid">
 <div class="tile"><p class="k">protéger</p><b>AWS WAF</b><p>Bloque injection SQL, XSS, bots (couche 7, HTTP).</p></div>
 <div class="tile"><p class="k">protéger</p><b>AWS Shield</b><p>Anti-DDoS. Standard gratuit pour tous, Advanced = équipe 24/7 + protection des coûts.</p></div>
 <div class="tile"><p class="k">protéger</p><b>Firewall Manager</b><p>Gère WAF, Shield et security groups sur toute l’organisation.</p></div>
 <div class="tile"><p class="k">protéger</p><b>Produits tiers</b><p>Pare-feu, antivirus ou SIEM d’éditeurs tiers, achetés dans AWS Marketplace.</p></div>
 <div class="tile w"><p class="k">détecter</p><b>Amazon GuardDuty</b><p>Détection de menaces : lit CloudTrail, VPC Flow Logs, DNS. Sans agent.</p></div>
 <div class="tile w"><p class="k">détecter</p><b>Amazon Inspector</b><p>Scan de vulnérabilités (CVE) : EC2, images ECR, Lambda.</p></div>
 <div class="tile w"><p class="k">détecter</p><b>Amazon Macie</b><p>Trouve les données sensibles (PII, cartes) dans S3.</p></div>
 <div class="tile w"><p class="k">centraliser</p><b>AWS Security Hub</b><p>Tableau unique des alertes + contrôles de bonnes pratiques (cette partie contrôles s’appelle désormais Security Hub CSPM).</p></div>
 <div class="tile"><p class="k">enquêter</p><b>Amazon Detective</b><p>Visualise les liens et trouve la cause racine d’une alerte.</p></div>
 <div class="tile"><p class="k">auditer · hors liste 2026</p><b>AWS Audit Manager</b><p>Collecte des preuves en continu pour TES audits.</p></div>
 <div class="tile"><p class="k">auditer</p><b>AWS Artifact</b><p>Télécharge les rapports de conformité d’AWS.</p></div>
 <div class="tile"><p class="k">signaler</p><b>AWS Trust &amp; Safety</b><p>Signaler un abus venant de ressources AWS (spam, attaque).</p></div>
</div></section>

<section class="card"><h3>La triade de surveillance</h3><p class="sub">Trois services, trois questions différentes. C’est le piège le plus fréquent de l’examen.</p>
<div class="triad">
 <div class="tile"><p class="k">AWS CloudTrail</p><p class="big">Qui a fait quoi ?</p><p>Journal de chaque appel API : utilisateur, heure, IP. « Qui a supprimé ce bucket ? »</p></div>
 <div class="tile"><p class="k">AWS Config</p><p class="big">C’était configuré comment ?</p><p>Historique de configuration + règles de conformité. « Ce security group est-il conforme ? »</p></div>
 <div class="tile"><p class="k">Amazon CloudWatch</p><p class="big">Ça tourne comment ?</p><p>Métriques, logs, alarmes, tableaux de bord. « CPU au-dessus de 80 % ? »</p></div>
</div></section>

<section class="card"><h3>Où trouver les journaux et la doc sécurité</h3><p class="sub">Le guide demande de savoir où sont capturés les journaux et où lire l’information de sécurité.</p>
<div class="grid">
 <div class="tile"><p class="k">journaux</p><b>CloudTrail</b><p>Appels API, livrés dans un bucket S3 ou dans CloudWatch Logs.</p></div>
 <div class="tile"><p class="k">journaux</p><b>CloudWatch Logs</b><p>Logs des applis, des instances et de Lambda, avec recherche et alarmes.</p></div>
 <div class="tile"><p class="k">journaux</p><b>VPC Flow Logs</b><p>Trafic IP accepté et refusé, vers CloudWatch Logs ou S3.</p></div>
 <div class="tile"><p class="k">journaux</p><b>Logs d’accès</b><p>S3 et les load balancers peuvent journaliser chaque requête dans un bucket S3.</p></div>
 <div class="tile w"><p class="k">doc</p><b>Security Center et Security Blog</b><p>Bonnes pratiques, bulletins et annonces de sécurité d’AWS.</p></div>
 <div class="tile w"><p class="k">doc</p><b>Knowledge Center et re:Post</b><p>Réponses aux questions fréquentes, communauté et experts AWS.</p></div>
 <div class="tile w"><p class="k">conformité</p><b>AWS Compliance</b><p>Programmes par pays et par secteur (RGPD, HIPAA, PCI DSS) et liste des services couverts par chacun.</p></div>
 <div class="tile w"><p class="k">conformité</p><b>AWS Artifact</b><p>Les rapports et accords à télécharger pour ton auditeur.</p></div>
</div></section>

<section class="card"><h3>Où se place chaque protection</h3><p class="sub">Le trajet d’une requête depuis Internet jusqu’à ton serveur.</p>
<div class="viz" data-viz="defense"></div>
</section>

<section class="card"><h3>Chiffrement et secrets</h3>
<div class="grid">
 <div class="tile"><p class="k">clés</p><b>AWS KMS</b><p>Crée et gère les clés, intégré à S3, EBS, RDS. Multi-locataire, géré par AWS.</p></div>
 <div class="tile"><p class="k">clés</p><b>AWS CloudHSM</b><p>Module matériel DÉDIÉ à toi seul. Tu as le contrôle exclusif des clés.</p></div>
 <div class="tile"><p class="k">secrets</p><b>Secrets Manager</b><p>Mots de passe et clés d’API, avec rotation automatique.</p></div>
 <div class="tile"><p class="k">certificats</p><b>AWS Certificate Manager</b><p>Certificats SSL/TLS publics gratuits, renouvelés automatiquement.</p></div>
</div>
<div class="flow" style="margin-top:12px">
 <div class="st a"><b>Au repos</b><span>EBS et RDS chiffrés avec KMS. S3 chiffre tout nouvel objet par défaut (SSE-S3), ou avec tes clés KMS (SSE-KMS)</span></div>
 <div class="st a"><b>En transit</b><span>Données qui voyagent : HTTPS/TLS, VPN IPsec</span></div>
</div></section>`,
 traps:["CloudTrail = qui a fait l’action. Config = état de la configuration. CloudWatch = performances et alarmes.","GuardDuty détecte des menaces dans les journaux. Inspector cherche des failles logicielles. Macie cherche des données sensibles dans S3.","Shield Standard est gratuit et activé pour tout le monde. Seul Advanced est payant.","Rotation automatique des mots de passe → Secrets Manager, pas Parameter Store ni KMS."]},

{n:4,short:"Calcul & réseau",title:"Calcul (EC2, serverless) et réseau (VPC)",dom:3,time:"≈ 5 h",
 lede:"Le plus gros domaine de l’examen (34 %). Les options d’achat EC2, du serveur à la fonction, puis le réseau : VPC, connexions hybrides, DNS et diffusion mondiale.",
 steps:[["Lire la leçon calcul + modes d’achat EC2","50 min"],["Dessiner le schéma VPC de mémoire (public, privé, NAT, IGW)","20 min"],["Cloud Quest : missions EC2 et réseau","75 min"],["Quiz du jour, viser 80 % ou plus","35 min"],["Refaire les erreurs accumulées","30 min"]],
 lesson:`
<section class="card"><h3>Du serveur à la fonction</h3><p class="sub">Plus tu vas à droite, moins tu gères de choses, et moins tu as de contrôle.</p>
<div class="viz" data-viz="compute"></div>
<div class="spectrum"><div class="grad"></div><div class="ends"><span>plus de contrôle</span><span>moins de gestion</span></div>
<div class="stops">
 <div><b>Amazon EC2</b>Serveur virtuel. Tu gères l’OS. IaaS.</div>
 <div><b>Lightsail</b>Serveur simple, prix mensuel fixe (blog, WordPress).</div>
 <div><b>Elastic Beanstalk</b>Tu déposes ton code, AWS déploie. PaaS.</div>
 <div><b>ECS / EKS + Fargate</b>Conteneurs sans gérer de serveurs.</div>
 <div><b>AWS Lambda</b>Fonction lancée par un événement, 15 min max, payée à la ms.</div>
</div></div>
<div class="grid" style="margin-top:14px">
 <div class="tile"><p class="k">familles EC2</p><b>Usage général (M, T)</b><p>Équilibré : web, petites bases.</p></div>
 <div class="tile"><p class="k">familles EC2</p><b>Calcul (C)</b><p>Beaucoup de CPU : calcul scientifique, jeux.</p></div>
 <div class="tile"><p class="k">familles EC2</p><b>Mémoire (R, X)</b><p>Beaucoup de RAM : bases en mémoire.</p></div>
 <div class="tile"><p class="k">familles EC2</p><b>Stockage (I, D)</b><p>Disques locaux très rapides.</p></div>
 <div class="tile"><p class="k">familles EC2</p><b>Accéléré (P, G)</b><p>GPU : machine learning, rendu.</p></div>
 <div class="tile"><p class="k">autres</p><b>AWS Batch</b><p>Milliers de jobs par lots, planifiés par AWS.</p></div>
</div></section>

<section class="card"><h3>Payer EC2 : les options d’achat</h3><p class="sub">Réduction maximale par rapport au tarif à la demande.</p>
<div class="bars">
 <div class="bar"><span><b>On-Demand</b></span><div class="tr"><div class="fl" style="width:1%"></div></div><span class="v">0 %</span></div>
 <div class="bar"><span><b>Compute Savings Plans</b></span><div class="tr"><div class="fl" style="width:66%"></div></div><span class="v">≤ 66 %</span></div>
 <div class="bar"><span><b>EC2 Instance Savings Plans</b></span><div class="tr"><div class="fl" style="width:72%"></div></div><span class="v">≤ 72 %</span></div>
 <div class="bar"><span><b>Reserved Instances</b></span><div class="tr"><div class="fl" style="width:72%"></div></div><span class="v">≤ 72 %</span></div>
 <div class="bar"><span><b>Spot</b></span><div class="tr"><div class="fl g" style="width:90%"></div></div><span class="v">≤ 90 %</span></div>
</div>
<div class="grid" style="margin-top:14px">
 <div class="tile"><b>On-Demand</b><p>Court, imprévisible, ne doit pas être interrompu. Aucun engagement. Linux et Windows facturés à la seconde (60 s minimum).</p></div>
 <div class="tile"><b>Savings Plans</b><p>Engagement en $/heure sur 1 ou 3 ans. Compute = flexible (famille, Région, Fargate, Lambda).</p></div>
 <div class="tile"><b>Reserved Instances</b><p>1 ou 3 ans, charge stable. Plus tu paies d’avance (All Upfront), plus c’est bas.</p></div>
 <div class="tile"><b>Spot</b><p>Capacité inutilisée. Peut être reprise avec 2 min de préavis. Jobs interruptibles.</p></div>
 <div class="tile w"><b>Dedicated Hosts</b><p>Un serveur physique entier pour toi : licences BYOL par socket ou cœur.</p></div>
 <div class="tile w"><b>Dedicated Instances</b><p>Matériel non partagé, mais sans visibilité sur le serveur physique.</p></div>
 <div class="tile w"><b>Capacity Reservations</b><p>Capacité On-Demand garantie dans une AZ, sans durée d’engagement. Payée même si elle reste vide.</p></div>
 <div class="tile w"><b>Flexibilité des RI</b><p>Standard : la plus forte remise. Convertible : on peut changer de famille. Remises partagées entre les comptes d’une organisation.</p></div>
</div></section>

<section class="card"><h3>Le réseau : un VPC type</h3><p class="sub">Ton réseau privé dans une Région, réparti sur deux AZ pour la haute disponibilité.</p>
<div class="viz" data-viz="vpc"></div>
<div class="legend"><span><b>Public</b> = route vers l’Internet gateway</span><span><b>NAT gateway</b> = le privé sort sur Internet, personne n’entre</span><span><b>DX</b> = Direct Connect</span></div>
<div class="tbl-wrap" style="margin-top:12px"><table class="m">
<tr><th></th><th>Security group</th><th>Network ACL</th></tr>
<tr><td class="h">S’applique à</td><td class="a">l’instance</td><td class="c">le sous-réseau</td></tr>
<tr><td class="h">État</td><td class="a">AVEC état (stateful) : la réponse repasse toute seule</td><td class="c">SANS état (stateless) : règles dans les deux sens</td></tr>
<tr><td class="h">Règles</td><td class="a">Autoriser uniquement</td><td class="c">Autoriser ET refuser</td></tr>
</table></div></section>

<section class="card"><h3>Relier, router, diffuser</h3>
<div class="grid">
 <div class="tile"><p class="k">hybride</p><b>Direct Connect</b><p>Ligne privée dédiée, débit constant, pas d’Internet. Des semaines à installer.</p></div>
 <div class="tile"><p class="k">hybride</p><b>Site-to-Site VPN</b><p>Tunnel chiffré via Internet. Prêt en quelques minutes.</p></div>
 <div class="tile"><p class="k">hub</p><b>Transit Gateway</b><p>Un hub central pour relier des dizaines de VPC et sites.</p></div>
 <div class="tile"><p class="k">1 à 1</p><b>VPC peering</b><p>Relie deux VPC directement.</p></div>
 <div class="tile"><p class="k">DNS</p><b>Route 53</b><p>Noms de domaine, DNS, health checks, routage et bascule.</p></div>
 <div class="tile"><p class="k">cache</p><b>CloudFront</b><p>CDN : met en cache le contenu web dans les edge locations.</p></div>
 <div class="tile"><p class="k">accélérer</p><b>Global Accelerator</b><p>2 IP statiques anycast, TCP/UDP, réseau AWS. Sans cache.</p></div>
 <div class="tile"><p class="k">API</p><b>API Gateway</b><p>Crée et expose des API REST ou WebSocket, souvent devant Lambda.</p></div>
 <div class="tile"><p class="k">haute dispo</p><b>ELB + Auto Scaling</b><p>Répartir le trafic sur plusieurs AZ + ajuster le nombre d’instances.</p></div>
 <div class="tile"><p class="k">privé</p><b>PrivateLink · VPC endpoints</b><p>Atteindre S3 ou un service AWS ou partenaire depuis le VPC, sans passer par Internet.</p></div>
 <div class="tile"><p class="k">télétravail</p><b>Client VPN</b><p>Les portables des employés se connectent au VPC par un VPN géré.</p></div>
 <div class="tile"><p class="k">postes</p><b>WorkSpaces · AppStream 2.0 · Secure Browser</b><p>Bureau virtuel complet · une appli diffusée en streaming · un navigateur sécurisé pour les applis web internes.</p></div>
</div></section>`,
 traps:["Interruptible et le moins cher → Spot. Ne doit pas être interrompu et court → On-Demand.","Licences par socket ou cœur → Dedicated Hosts, pas Dedicated Instances.","Security group = stateful, instance, allow seulement. NACL = stateless, sous-réseau, allow + deny.","CloudFront met en cache du contenu HTTP. Global Accelerator donne des IP statiques et accélère TCP/UDP, sans cache.","Connexion chiffrée dès aujourd’hui → VPN. Débit constant et privé → Direct Connect.","Atteindre S3 depuis un sous-réseau privé sans Internet → VPC endpoint, pas NAT gateway.","Capacité garantie sans engagement d’un an → Capacity Reservation, pas Reserved Instance."]},

{n:5,short:"Stockage, bases, IA",title:"Stockage, bases de données, analytique et IA",dom:3,time:"≈ 5 h",
 lede:"Choisir le bon stockage et la bonne base selon la situation, puis reconnaître les services d’analytique, d’IA, d’intégration et de déploiement.",
 steps:[["Lire la leçon stockage + classes S3","40 min"],["Lire bases de données, analytique, IA","50 min"],["Cloud Quest : missions stockage et bases","60 min"],["Quiz du jour (le plus long), viser 80 % ou plus","40 min"],["Refaire les erreurs accumulées","30 min"]],
 lesson:`
<section class="card"><h3>Trois façons de stocker</h3>
<div class="viz" data-viz="storage"></div>
<div class="triad">
 <div class="tile"><p class="k">bloc</p><p class="big">Amazon EBS</p><p>Un disque dur pour UNE instance EC2 (dans une AZ). Volume de démarrage. Persiste après l’arrêt. À l’opposé : l’instance store, éphémère.</p></div>
 <div class="tile"><p class="k">fichiers</p><p class="big">EFS / FSx</p><p>Système de fichiers partagé par des centaines d’instances. EFS = Linux (NFS), multi-AZ. FSx = Windows File Server (SMB), NetApp ONTAP, OpenZFS. FSx for Lustre est hors programme.</p></div>
 <div class="tile"><p class="k">objet</p><p class="big">Amazon S3</p><p>Fichiers illimités dans des buckets, accès par URL ou API. Durabilité 99,999999999 % (11 neuf).</p></div>
</div>
<div class="grid" style="margin-top:12px">
 <div class="tile"><b>Storage Gateway</b><p>Hybride : tes applis sur site utilisent S3, avec un cache local.</p></div>
 <div class="tile"><b>Elastic Disaster Recovery</b><p>Réplique en continu tes serveurs vers AWS pour redémarrer en minutes après un sinistre.</p></div>
 <div class="tile w"><b>Snowball Edge</b><p>Appareil physique pour transférer des To hors ligne. Plus proposé aux nouveaux clients depuis le 7 novembre 2025 et absent de la liste 2026, mais encore présent dans de vieilles questions.</p></div>
 <div class="tile"><b>DataSync</b><p>Transfert de fichiers en ligne, automatisé, vers S3, EFS, FSx.</p></div>
 <div class="tile"><b>AWS Backup</b><p>Sauvegardes centralisées de tous les services.</p></div>
</div></section>

<section class="card"><h3>Les classes S3, du chaud au froid</h3><p class="sub">Plus c’est froid, moins le stockage coûte, et plus la récupération coûte ou prend du temps.</p>
<div class="tbl-wrap"><table class="m">
<tr><th>Classe</th><th>Quand l’utiliser</th><th>Récupération</th><th>AZ</th></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 var(--amber)">S3 Standard</td><td>Accès fréquent</td><td>millisecondes</td><td>≥ 3</td></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 color-mix(in srgb,var(--amber) 80%,var(--accent))">Intelligent-Tiering</td><td>Accès inconnu ou changeant : AWS déplace tout seul</td><td>millisecondes</td><td>≥ 3</td></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 color-mix(in srgb,var(--amber) 60%,var(--accent))">Standard-IA</td><td>Peu fréquent, mais vite quand il faut</td><td>millisecondes</td><td>≥ 3</td></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 color-mix(in srgb,var(--amber) 45%,var(--accent))">One Zone-IA</td><td>Peu fréquent ET recréable si perdu</td><td>millisecondes</td><td class="c">1 seule</td></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 color-mix(in srgb,var(--amber) 30%,var(--accent))">Glacier Instant Retrieval</td><td>Archive consultée environ 1 fois par trimestre</td><td>millisecondes</td><td>≥ 3</td></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 color-mix(in srgb,var(--amber) 15%,var(--accent))">Glacier Flexible Retrieval</td><td>Archive 1 à 2 fois par an</td><td>minutes à 12 h</td><td>≥ 3</td></tr>
<tr><td class="h" style="box-shadow:inset 4px 0 var(--accent)">Glacier Deep Archive</td><td>Conservation légale 7 à 10 ans, le moins cher</td><td>12 à 48 h</td><td>≥ 3</td></tr>
</table></div>
<p class="note" style="margin-top:8px">Les <b>règles de cycle de vie</b> S3 déplacent automatiquement les objets vers une classe plus froide après X jours, ou les suppriment. À part : <b>S3 Express One Zone</b>, une seule AZ, pour une latence de quelques millisecondes.</p>
</section>

<section class="card"><h3>Quelle base de données ?</h3><p class="sub">Lis le besoin, trouve le service.</p>
<div class="grid">
 <div class="tile"><p class="k">SQL relationnel</p><b>Amazon RDS</b><p>MySQL, PostgreSQL, Oracle, SQL Server… managé. Multi-AZ = haute dispo, read replicas = lecture.</p></div>
 <div class="tile"><p class="k">SQL haute perf</p><b>Amazon Aurora</b><p>Compatible MySQL et PostgreSQL, jusqu’à 5× plus rapide, stockage qui grandit tout seul.</p></div>
 <div class="tile"><p class="k">NoSQL clé-valeur</p><b>Amazon DynamoDB</b><p>Serverless, latence de quelques ms à toute échelle.</p></div>
 <div class="tile"><p class="k">cache</p><b>Amazon ElastiCache</b><p>Cache en mémoire (Valkey, Redis OSS, Memcached) devant une base.</p></div>
 <div class="tile"><p class="k">entrepôt</p><b>Amazon Redshift</b><p>Analytique SQL sur des pétaoctets.</p></div>
 <div class="tile"><p class="k">graphe</p><b>Amazon Neptune</b><p>Relations : réseaux sociaux, recommandations, fraude.</p></div>
 <div class="tile"><p class="k">documents</p><b>Amazon DocumentDB</b><p>JSON, compatible MongoDB.</p></div>
 <div class="tile"><p class="k">migration</p><b>AWS DMS + SCT</b><p>DMS migre la base, la source reste en service. SCT convertit le schéma vers un autre moteur (ex. Oracle → Aurora PostgreSQL).</p></div>
 <div class="tile w"><p class="k">choisir</p><b>Base sur EC2 ou managée</b><p>Sur EC2 : contrôle total, mais OS, patchs, sauvegardes et haute dispo pour toi. RDS, Aurora, DynamoDB : AWS s’en charge.</p></div>
</div></section>

<section class="card"><h3>La chaîne de l’analytique</h3>
<div class="flow">
 <div class="st"><b>Kinesis</b><span>ingérer des flux en temps réel</span></div><span class="arrow">→</span>
 <div class="st a"><b>S3</b><span>lac de données</span></div><span class="arrow">→</span>
 <div class="st"><b>Glue</b><span>cataloguer, ETL</span></div><span class="arrow">→</span>
 <div class="st"><b>Athena · Redshift · EMR</b><span>SQL sur S3 · entrepôt · Spark/Hadoop</span></div><span class="arrow">→</span>
 <div class="st"><b>Amazon Quick</b><span>tableaux de bord (ex-QuickSight)</span></div>
</div>
<p class="note" style="margin-top:8px">Recherche et analyse de logs : <b>Amazon OpenSearch Service</b>.</p>
</section>

<section class="card"><h3>IA et machine learning</h3><p class="sub">Un service = une capacité. Associe le verbe au nom.</p>
<div class="grid">
 <div class="tile"><p class="k">voir</p><b>Rekognition</b><p>Visages, objets dans images et vidéos.</p></div>
 <div class="tile"><p class="k">lire</p><b>Textract</b><p>Texte, tableaux et formulaires de documents scannés.</p></div>
 <div class="tile"><p class="k">comprendre</p><b>Comprehend</b><p>Sentiment, entités, sujets d’un texte.</p></div>
 <div class="tile"><p class="k">traduire</p><b>Translate</b><p>Traduction entre langues.</p></div>
 <div class="tile"><p class="k">écouter</p><b>Transcribe</b><p>Parole → texte.</p></div>
 <div class="tile"><p class="k">parler</p><b>Polly</b><p>Texte → parole.</p></div>
 <div class="tile"><p class="k">discuter</p><b>Lex</b><p>Chatbots vocaux et texte.</p></div>
 <div class="tile"><p class="k">chercher · hors liste 2026</p><b>Kendra</b><p>Recherche intelligente dans des documents.</p></div>
 <div class="tile w"><p class="k">construire</p><b>SageMaker AI</b><p>Créer, entraîner, déployer TES modèles ML.</p></div>
 <div class="tile w"><p class="k">générer</p><b>Amazon Bedrock</b><p>IA générative via API avec des modèles de fondation de plusieurs fournisseurs.</p></div>
 <div class="tile w"><p class="k">assister</p><b>Amazon Q</b><p>Assistant d’IA générative pour le travail et le code.</p></div>
</div></section>

<section class="card"><h3>Intégration, déploiement, gestion</h3>
<div class="grid">
 <div class="tile"><p class="k">file</p><b>SQS</b><p>File d’attente : découpler, absorber les pics. Un consommateur traite chaque message.</p></div>
 <div class="tile"><p class="k">pub/sub</p><b>SNS</b><p>Pousse un message vers plusieurs abonnés : e-mail, SMS, SQS, Lambda.</p></div>
 <div class="tile"><p class="k">événements</p><b>EventBridge</b><p>Bus d’événements et tâches planifiées.</p></div>
 <div class="tile"><p class="k">orchestrer</p><b>Step Functions</b><p>Enchaîner des étapes dans un workflow visuel.</p></div>
 <div class="tile"><p class="k">IaC</p><b>CloudFormation</b><p>Infrastructure en modèles YAML/JSON, reproductible. CDK = même chose en code.</p></div>
 <div class="tile"><p class="k">opérer</p><b>Systems Manager</b><p>Patchs de flotte, commandes à distance, Session Manager sans SSH.</p></div>
 <div class="tile"><p class="k">CI/CD</p><b>CodePipeline · CodeBuild</b><p>Pipeline de livraison automatique · compilation et tests managés. CodeDeploy est hors programme.</p></div>
 <div class="tile"><p class="k">déboguer</p><b>AWS X-Ray</b><p>Trace une requête à travers tes microservices pour trouver la lenteur.</p></div>
 <div class="tile"><p class="k">accéder</p><b>Console, CLI, SDK, IaC</b><p>Console pour une action ponctuelle. CLI et SDK pour scripter. CloudFormation pour recréer le même environnement à l’identique.</p></div>
 <div class="tile"><p class="k">métier</p><b>Amazon Connect · Amazon SES</b><p>Centre de contact cloud · envoi d’e-mails depuis une appli.</p></div>
 <div class="tile"><p class="k">web et mobile</p><b>AWS Amplify</b><p>Créer et héberger une appli web ou mobile full-stack.</p></div>
 <div class="tile"><p class="k">gouverner</p><b>Service Catalog · Service Quotas</b><p>Catalogue interne de produits approuvés · voir et relever les limites de ton compte.</p></div>
 <div class="tile"><p class="k">objets</p><b>IoT Core</b><p>Connecter des appareils connectés.</p></div>
</div></section>`,
 traps:["Accès inconnu ou changeant → Intelligent-Tiering. Millisecondes et rare → Glacier Instant Retrieval.","One Zone-IA seulement si les données sont recréables : une seule AZ.","EBS = une instance, une AZ. EFS = partagé entre beaucoup d’instances et d’AZ.","SNS pousse vers plusieurs abonnés. SQS stocke dans une file en attendant le traitement.","SageMaker = tu construis ton modèle. Bedrock = tu utilises des modèles de fondation existants."]},

{n:6,short:"Facturation & support",title:"Facturation, prix et plans de support",dom:4,time:"≈ 3 h 30",
 lede:"Seulement 12 % de l’examen, mais des points faciles : quel outil de coût pour quel moment, et quel plan de support pour quel besoin.",
 steps:[["Lire la leçon, apprendre le tableau des plans de support","40 min"],["Cloud Quest : mission facturation ou coûts","45 min"],["Refaire TOUTES les erreurs accumulées depuis le jour 1","45 min"],["Quiz du jour, viser 85 % ou plus","30 min"],["Relire les pièges des jours 1 à 5","30 min"]],
 lesson:`
<section class="card"><h3>Les outils de coûts, sur une ligne de temps</h3>
<div class="flow">
 <div class="st"><b>Avant</b><span><b>Pricing Calculator</b> : estimer le coût d’une architecture</span></div><span class="arrow">→</span>
 <div class="st a"><b>Pendant</b><span><b>Budgets</b> : alertes de seuil (réel ou prévu)<br><b>Cost Anomaly Detection</b> : dépenses anormales (ML)</span></div><span class="arrow">→</span>
 <div class="st"><b>Après</b><span><b>Cost Explorer</b> : graphiques, 12 mois, prévisions<br><b>Cost and Usage Report</b> : le détail le plus fin, dans S3</span></div><span class="arrow">→</span>
 <div class="st"><b>Optimiser</b><span><b>Compute Optimizer</b> : bonne taille d’instance<br><b>Trusted Advisor</b> : recommandations</span></div>
</div>
<div class="grid" style="margin-top:12px">
 <div class="tile"><b>Facturation consolidée</b><p>Via Organizations : une seule facture, remises sur volume cumulées, RI et Savings Plans partagés.</p></div>
 <div class="tile"><b>Tags de répartition des coûts</b><p>Étiquettes (ex. departement=marketing) pour ventiler la facture.</p></div>
 <div class="tile"><b>Moteurs de coût</b><p>Calcul, stockage, transfert de données SORTANT. L’entrant est gratuit.</p></div>
 <div class="tile"><b>Payer moins</b><p>Payer à l’usage, réserver (RI, Savings Plans), payer moins en consommant plus (paliers S3).</p></div>
 <div class="tile w"><b>Transfert de données</b><p>Entrant : gratuit. Vers Internet : payant. Entre deux Régions : payant. Entre deux AZ d’une même Région : payant aussi. Dans la même AZ en IP privée : gratuit.</p></div>
 <div class="tile w"><b>Offre gratuite</b><p>Des services toujours gratuits dans des limites (ex. 1 million de requêtes Lambda par mois). Depuis le 15 juillet 2025, les nouveaux comptes reçoivent des crédits (jusqu’à 200 $) au lieu des « 12 mois gratuits ».</p></div>
</div></section>

<section class="card"><h3>Les plans AWS Support</h3><p class="sub">Le guide officiel (version du 29 octobre 2026) utilise la nouvelle gamme. Apprends-la en premier, puis sache reconnaître les anciens noms.</p>
<div class="tbl-wrap"><table class="m">
<tr><th></th><th>Prix de départ</th><th>Accès technique</th><th>Système critique en panne</th><th>TAM</th><th>Trusted Advisor</th></tr>
<tr><td class="h">Basic<span class="tag">gratuit</span></td><td>0 $</td><td class="n">non : service client compte et facturation 24/7, docs, re:Post</td><td class="n">non</td><td class="n">non</td><td>contrôles essentiels</td></tr>
<tr><td class="h">Business Support+</td><td>29 $/mois par compte</td><td class="a">24/7 tél., chat, web</td><td class="a">&lt; 30 min</td><td class="n">non</td><td class="a">tous les contrôles</td></tr>
<tr><td class="h">Enterprise</td><td>5 000 $/mois</td><td class="a">24/7</td><td class="a">&lt; 15 min</td><td class="c">TAM désigné</td><td class="a">tous + Priority</td></tr>
<tr><td class="h">Unified Operations</td><td>50 000 $/mois</td><td class="a">24/7</td><td class="a">&lt; 5 min</td><td class="c">équipe désignée : TAM, ingénieur, spécialiste facturation</td><td class="a">tous + Priority</td></tr>
</table></div>
<p class="note" style="margin-top:8px">Dans les trois plans payants : production en panne &lt; 1 h, production altérée &lt; 4 h, système altéré &lt; 12 h, question générale &lt; 24 h. Le prix réel est le plus élevé entre ce minimum et un pourcentage de ta facture AWS.</p>
<div class="bars" style="margin-top:14px">
 <div class="bar"><span>Business Support+</span><div class="tr"><div class="fl w" style="width:100%"></div></div><span class="v">30 min</span></div>
 <div class="bar"><span>Enterprise</span><div class="tr"><div class="fl" style="width:50%"></div></div><span class="v">15 min</span></div>
 <div class="bar"><span>Unified Operations</span><div class="tr"><div class="fl g" style="width:16.7%"></div></div><span class="v">5 min</span></div>
</div>
<p class="note" style="margin-top:8px">Barres = délai pour un système critique en panne, à l’échelle (30 min = barre pleine).</p>
<div class="tile w" style="margin-top:14px"><p class="k">ancienne grille · retirée le 1er janvier 2027</p><b>Developer, Business, Enterprise On-Ramp</b><p>Beaucoup de cours et de banques de questions l’utilisent encore. Si une question cite ces noms, réponds avec cette grille.</p></div>
<div class="tbl-wrap" style="margin-top:10px"><table class="m">
<tr><th>Ancien plan</th><th>Accès technique</th><th>Réponse la plus rapide</th><th>TAM</th></tr>
<tr><td class="h">Developer</td><td>e-mail, heures ouvrées</td><td>&lt; 12 h · système altéré</td><td class="n">non</td></tr>
<tr><td class="h">Business</td><td class="a">24/7 tél., chat, e-mail</td><td class="a">&lt; 1 h · production en panne</td><td class="n">non</td></tr>
<tr><td class="h">Enterprise On-Ramp</td><td class="a">24/7</td><td class="a">&lt; 30 min · critique en panne</td><td class="c">pool de TAM + Concierge</td></tr>
<tr><td class="h">Enterprise</td><td class="a">24/7</td><td class="a">&lt; 15 min · critique en panne</td><td class="c">TAM désigné + Concierge</td></tr>
</table></div>
<p class="note" style="margin-top:8px">Ce qui ne change pas d’une grille à l’autre : Basic est gratuit et sans support technique ; TAM désigné → Enterprise ; tous les contrôles Trusted Advisor → dès le premier plan 24/7 (Business Support+, ou Business dans l’ancienne grille).</p>
</section>

<section class="card"><h3>Trusted Advisor et l’écosystème</h3>
<div class="grid">
 <div class="tile"><p class="k">Trusted Advisor</p><b>6 catégories</b><p>Optimisation des coûts, performance, sécurité, tolérance aux pannes, quotas de service, excellence opérationnelle.</p></div>
 <div class="tile"><b>AWS Health Dashboard</b><p>Événements AWS (maintenance, pannes) qui touchent TES ressources. En programme : AWS Health API (plans payants).</p></div>
 <div class="tile"><b>AWS Marketplace</b><p>Logiciels tiers facturés sur ta facture AWS, avec gestion des coûts, de la gouvernance et des droits de licence.</p></div>
 <div class="tile"><b>AWS Partner Network</b><p>Éditeurs (ISV) et intégrateurs (SI). Avantages partenaires : formations et certifications, événements, remises sur volume.</p></div>
 <div class="tile"><b>AWS re:Post</b><p>Questions-réponses communautaires, gratuit.</p></div>
 <div class="tile"><b>Professional Services</b><p>Experts AWS pour accompagner de gros projets.</p></div>
 <div class="tile"><b>Concierge</b><p>Ancienne grille : experts facturation et compte (Enterprise et On-Ramp). Unified Operations : un spécialiste facturation désigné.</p></div>
 <div class="tile"><b>Trust &amp; Safety</b><p>Signaler un abus venant de ressources AWS.</p></div>
 <div class="tile"><b>Solutions architects</b><p>Experts AWS qui conseillent sur l’architecture, souvent via ton équipe de compte.</p></div>
 <div class="tile"><b>Prescriptive Guidance</b><p>Stratégies, guides et modèles validés par AWS pour migrer et moderniser.</p></div>
 <div class="tile"><b>Support Center</b><p>Dans la console : ouvrir et suivre tes cas de support.</p></div>
 <div class="tile"><b>Knowledge Center</b><p>Articles qui répondent aux questions les plus fréquentes des clients.</p></div>
</div></section>`,
 traps:["Estimer AVANT de déployer → Pricing Calculator. Analyser le PASSÉ → Cost Explorer. Être ALERTÉ → Budgets.","Gamme actuelle : le moins cher avec accès 24/7 → Business Support+ (30 min pour un système critique). TAM désigné au plus bas prix → Enterprise. 5 min → Unified Operations.","Ancienne grille : 30 min → Enterprise On-Ramp, e-mail en heures ouvrées → Developer. Ces plans disparaissent le 1er janvier 2027.","Tous les contrôles Trusted Advisor dès Business Support+ (ancienne grille : dès Business).","Transfert entre deux AZ de la même Région : payant. Dans la même AZ en IP privée : gratuit.","Le transfert de données ENTRANT est gratuit, le SORTANT est payant."]},

{n:7,short:"Examen blanc",title:"Révision finale et examen blanc",dom:0,time:"≈ 4 h",
 lede:"Les paires qui piègent, la tactique du jour J, puis l’examen blanc chronométré dans les conditions réelles : 65 questions, 90 minutes, répartition officielle des domaines.",
 steps:[["Relire le tableau des paires qui piègent","25 min"],["Examen blanc n° 1 (65 questions, 90 min)","90 min"],["Relire chaque erreur et son explication","40 min"],["Examen blanc n° 2, viser 80 % ou plus","90 min"],["Réserver l’examen pour demain sur le site officiel AWS","10 min"]],
 lesson:`
<section class="card"><h3>Les paires qui piègent</h3><p class="sub">Si tu sais différencier ces paires, tu évites la majorité des erreurs.</p>
<div class="tbl-wrap"><table class="m">
<tr><th>Si la question dit…</th><th>Réponse</th><th>Et pas…</th></tr>
<tr><td>qui a fait l’action, historique des appels API</td><td class="a">CloudTrail</td><td>Config (configuration), CloudWatch (métriques)</td></tr>
<tr><td>menaces dans les journaux</td><td class="a">GuardDuty</td><td>Inspector (failles), Macie (données sensibles S3)</td></tr>
<tr><td>clients de mon appli mobile</td><td class="a">Cognito</td><td>IAM Identity Center (employés)</td></tr>
<tr><td>module matériel dédié</td><td class="a">CloudHSM</td><td>KMS (multi-locataire)</td></tr>
<tr><td>rapports de conformité d’AWS</td><td class="a">Artifact</td><td>Audit Manager (tes preuves)</td></tr>
<tr><td>ligne privée, débit constant</td><td class="a">Direct Connect</td><td>VPN (Internet chiffré, rapide à monter)</td></tr>
<tr><td>IP statiques, UDP, jeu</td><td class="a">Global Accelerator</td><td>CloudFront (cache web)</td></tr>
<tr><td>plusieurs abonnés reçoivent le message</td><td class="a">SNS</td><td>SQS (file d’attente)</td></tr>
<tr><td>pare-feu sans état, refuser une IP</td><td class="a">Network ACL</td><td>Security group (avec état, allow seulement)</td></tr>
<tr><td>disque partagé par beaucoup d’instances</td><td class="a">EFS</td><td>EBS (une instance, une AZ)</td></tr>
<tr><td>flexible : famille, Région, Fargate, Lambda</td><td class="a">Compute Savings Plans</td><td>Reserved Instances (liées)</td></tr>
<tr><td>estimer avant de construire</td><td class="a">Pricing Calculator</td><td>Cost Explorer (le passé)</td></tr>
<tr><td>même code, base managée</td><td class="a">Replatform</td><td>Rehost (tel quel), Refactor (réécrire)</td></tr>
<tr><td>24/7 au plus bas prix (gamme actuelle)</td><td class="a">Business Support+</td><td>Enterprise (TAM désigné), Basic (pas de support technique)</td></tr>
<tr><td>accès privé à un service, sans Internet</td><td class="a">VPC endpoint / PrivateLink</td><td>NAT gateway (sortie vers Internet)</td></tr>
<tr><td>convertir un schéma Oracle vers PostgreSQL</td><td class="a">AWS SCT</td><td>DMS seul (déplace les données)</td></tr>
<tr><td>équipe DDoS 24/7, protection des coûts</td><td class="a">Shield Advanced</td><td>Shield Standard (gratuit)</td></tr>
</table></div></section>

<section class="card"><h3>Tactique du jour J</h3>
<div class="grid">
 <div class="tile"><p class="k">1</p><b>Réponds à tout</b><p>Une mauvaise réponse ne retire pas de points. Ne laisse jamais une case vide.</p></div>
 <div class="tile"><p class="k">2</p><b>Élimine d’abord</b><p>Raye les 2 réponses absurdes, puis compare les 2 restantes avec les paires ci-dessus.</p></div>
 <div class="tile"><p class="k">3</p><b>Lis les mots-clés</b><p>« le moins cher », « le moins d’effort », « le plus sécurisé » changent la réponse.</p></div>
 <div class="tile"><p class="k">4</p><b>Choisis 2 ou 3</b><p>Le nombre de réponses est indiqué. Vérifie-le avant de valider.</p></div>
 <div class="tile"><p class="k">5</p><b>Marque et avance</b><p>Bloqué plus de 90 s ? Marque la question, reviens à la fin.</p></div>
 <div class="tile"><p class="k">6</p><b>Doute ?</b><p>AWS préfère souvent le service managé ou serverless, et le moindre privilège.</p></div>
</div>
<p class="note" style="margin-top:10px">15 des 65 questions ne comptent pas (questions en test), mais tu ne sais pas lesquelles : traite-les toutes sérieusement. Le score est compensatoire : tu peux rater un domaine et réussir l’examen.</p>
<p class="note" style="margin-top:6px">Listés hors programme dans le guide 2026 : Wavelength, Network Firewall, FSx for Lustre, CodeDeploy, Transfer Family, AWS IQ. Absents de la liste mais encore vus dans de vieilles questions : Snow Family, DataSync, Audit Manager, Kendra.</p>
</section>`,
 traps:["Toujours vérifier « Choisis 2 » avant de valider.","« Le moins d’effort opérationnel » pointe presque toujours vers un service managé ou serverless."]}
];
