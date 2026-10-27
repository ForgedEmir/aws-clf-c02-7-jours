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

<section class="card"><h3>L’infrastructure mondiale AWS</h3><p class="sub">Région ⊃ zones de disponibilité (AZ) ⊃ datacenters. À droite, ce qui vit en dehors des Régions.</p>
<div class="dia-wrap"><svg class="dia" viewBox="0 0 690 300" role="img" aria-label="Une Région contient au moins trois zones de disponibilité, chacune avec des datacenters">
 <rect class="sv-a" x="8" y="8" width="452" height="284" rx="14"/>
 <text class="sv-t b" x="24" y="34">Région AWS · ex. eu-west-3 (Paris)</text>
 <text class="sv-m sm" x="24" y="52">Zone géographique isolée : tes données y restent sauf si tu les déplaces</text>
 <rect class="sv-b" x="24" y="68" width="130" height="190" rx="10"/><text class="sv-t b" x="38" y="90">AZ A</text>
 <rect class="sv-w" x="38" y="102" width="102" height="62" rx="6"/><text class="sv-t sm" x="89" y="138" text-anchor="middle">Datacenter</text>
 <rect class="sv-w" x="38" y="176" width="102" height="62" rx="6"/><text class="sv-t sm" x="89" y="212" text-anchor="middle">Datacenter</text>
 <rect class="sv-b" x="170" y="68" width="130" height="190" rx="10"/><text class="sv-t b" x="184" y="90">AZ B</text>
 <rect class="sv-w" x="184" y="102" width="102" height="62" rx="6"/><text class="sv-t sm" x="235" y="138" text-anchor="middle">Datacenter</text>
 <rect class="sv-w" x="184" y="176" width="102" height="62" rx="6"/><text class="sv-t sm" x="235" y="212" text-anchor="middle">Datacenter</text>
 <rect class="sv-b" x="316" y="68" width="130" height="190" rx="10"/><text class="sv-t b" x="330" y="90">AZ C</text>
 <rect class="sv-w" x="330" y="102" width="102" height="62" rx="6"/><text class="sv-t sm" x="381" y="138" text-anchor="middle">Datacenter</text>
 <rect class="sv-w" x="330" y="176" width="102" height="62" rx="6"/><text class="sv-t sm" x="381" y="212" text-anchor="middle">Datacenter</text>
 <line class="sv-l" x1="154" y1="160" x2="170" y2="160"/><line class="sv-l" x1="300" y1="160" x2="316" y2="160"/>
 <text class="sv-m sm" x="24" y="280">Au moins 3 AZ par Région, isolées, reliées par fibre privée à faible latence</text>
 <text class="sv-t b" x="482" y="34">Hors des Régions</text>
 <circle class="sv-af" cx="492" cy="72" r="7"/><text class="sv-t b" x="508" y="76">Edge locations</text><text class="sv-m sm" x="508" y="93">Des centaines · CloudFront, Route 53</text>
 <circle cx="492" cy="132" r="7" fill="var(--ok)" style="fill:var(--ok)"/><text class="sv-t b" x="508" y="136">Local Zones</text><text class="sv-m sm" x="508" y="153">AWS au plus près d’une grande ville</text>
 <circle cx="492" cy="192" r="7" style="fill:var(--amber)"/><text class="sv-t b" x="508" y="196">Wavelength</text><text class="sv-m sm" x="508" y="213">Dans le réseau 5G d’un opérateur</text>
 <circle cx="492" cy="252" r="7" style="fill:var(--muted)"/><text class="sv-t b" x="508" y="256">Outposts</text><text class="sv-m sm" x="508" y="273">Racks AWS dans TON datacenter</text>
</svg></div>
<div class="legend"><span>Panne d’un datacenter → <b>multi-AZ</b></span><span>Panne d’une Région ou catastrophe → <b>multi-Région</b></span><span>Choisir une Région : conformité, latence, services dispo, prix</span></div>
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
<p class="note" style="margin-top:10px">Les 4 phases du CAF : <b>Envision → Align → Launch → Scale</b>.</p>
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
<p class="note" style="margin-top:10px">Outils : <b>Migration Hub</b> (suivi), <b>Application Discovery Service</b> (inventaire), <b>Application Migration Service</b> (rehost), <b>DMS</b> (bases de données), <b>Snow Family</b> (transfert physique).</p>
</section>`,
 traps:["« Économies d’échelle » ≠ « dépense variable ». Payer à l’usage = dépense variable ; prix bas grâce au volume = économies d’échelle.","Survivre à la panne d’un datacenter = multi-AZ, pas multi-Région (plus cher et pas nécessaire).","Le pilier Durabilité parle d’environnement. L’optimisation des coûts parle d’argent.","Replatform garde le code mais change la plateforme (ex. Oracle sur serveur → RDS). Refactor réécrit l’application."]},

{n:2,short:"Responsabilité & IAM",title:"Responsabilité partagée et identités (IAM)",dom:2,time:"≈ 4 h",
 lede:"Qui sécurise quoi entre toi et AWS, puis comment donner exactement les bons accès : utilisateurs, groupes, rôles, politiques, Organizations.",
 steps:[["Lire la leçon : dessine le schéma de responsabilité partagée de mémoire","50 min"],["Cloud Quest : mission sur IAM / sécurité","60 min"],["Synthèse GitHub : Security & Compliance (partie IAM)","30 min"],["Quiz du jour, viser 80 % ou plus","30 min"],["Refaire les erreurs du jour 1 (onglet Erreurs)","20 min"]],
 lesson:`
<section class="card"><h3>Le modèle de responsabilité partagée</h3><p class="sub">AWS sécurise le cloud. Toi, tu sécurises ce que tu mets dedans.</p>
<div class="stack" style="gap:8px">
 <div class="tile w"><p class="k">client · sécurité DANS le cloud</p>
  <div class="grid" style="margin-top:6px"><div><b>Données clients</b><p>Classification, chiffrement côté client ou serveur</p></div><div><b>IAM</b><p>Utilisateurs, rôles, MFA, permissions</p></div><div><b>OS invité et applis</b><p>Patchs de l’OS sur EC2, pare-feu, security groups</p></div><div><b>Réseau</b><p>Configuration du trafic, chiffrement en transit</p></div></div></div>
 <div class="tile" style="background:var(--accent-soft);border-color:var(--accent)"><p class="k">AWS · sécurité DU cloud</p>
  <div class="grid" style="margin-top:6px"><div><b>Logiciel</b><p>Compute, stockage, bases, réseau</p></div><div><b>Hyperviseur</b><p>Virtualisation des serveurs</p></div><div><b>Matériel</b><p>Régions, AZ, edge locations</p></div><div><b>Physique</b><p>Gardes, accès aux bâtiments, destruction des disques</p></div></div></div>
</div>
<p class="note" style="margin-top:10px">Contrôles <b>partagés</b> : gestion des correctifs, gestion de la configuration, formation et sensibilisation. Chacun s’en occupe pour sa propre couche.</p>
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
<div class="dia-wrap"><svg class="dia" viewBox="0 0 680 230" role="img" aria-label="Utilisateurs dans un groupe auquel une politique est attachée ; une instance EC2 assume un rôle pour lire S3">
 <defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="sv-ar" d="M0,0 L10,5 L0,10 z"/></marker></defs>
 <rect class="sv-w" x="20" y="22" width="110" height="38" rx="8"/><text class="sv-t" x="75" y="46" text-anchor="middle">Alice</text>
 <rect class="sv-w" x="20" y="72" width="110" height="38" rx="8"/><text class="sv-t" x="75" y="96" text-anchor="middle">Bob</text>
 <line class="sv-ln" x1="130" y1="41" x2="188" y2="62" marker-end="url(#ar)"/><line class="sv-ln" x1="130" y1="91" x2="188" y2="76" marker-end="url(#ar)"/>
 <rect class="sv-a" x="190" y="44" width="130" height="50" rx="8"/><text class="sv-t b" x="255" y="66" text-anchor="middle">Groupe « Devs »</text><text class="sv-m sm" x="255" y="83" text-anchor="middle">hérite des droits</text>
 <rect class="sv-s" x="380" y="20" width="280" height="96" rx="8"/><text class="sv-t b" x="396" y="42">Politique IAM (JSON)</text>
 <text class="sv-t mo" x="396" y="64">"Effect": "Allow",</text><text class="sv-t mo" x="396" y="82">"Action": "s3:GetObject",</text><text class="sv-t mo" x="396" y="100">"Resource": "arn:aws:s3:::photos/*"</text>
 <line class="sv-ln" x1="378" y1="69" x2="322" y2="69" marker-end="url(#ar)"/><text class="sv-m sm" x="350" y="62" text-anchor="middle">attachée</text>
 <rect class="sv-b" x="20" y="150" width="110" height="50" rx="8"/><text class="sv-t b" x="75" y="172" text-anchor="middle">Instance EC2</text><text class="sv-m sm" x="75" y="189" text-anchor="middle">ton appli</text>
 <line class="sv-ln" x1="130" y1="175" x2="188" y2="175" marker-end="url(#ar)"/><text class="sv-m sm" x="159" y="166" text-anchor="middle">assume</text>
 <rect class="sv-g" x="190" y="150" width="130" height="50" rx="8"/><text class="sv-t b" x="255" y="172" text-anchor="middle">Rôle IAM</text><text class="sv-m sm" x="255" y="189" text-anchor="middle">identifiants temporaires</text>
 <line class="sv-ln" x1="320" y1="175" x2="378" y2="175" marker-end="url(#ar)"/>
 <rect class="sv-b" x="380" y="150" width="130" height="50" rx="8"/><text class="sv-t b" x="445" y="180" text-anchor="middle">Bucket S3</text>
 <text class="sv-wt sm b" x="530" y="170">Aucune clé d’accès</text><text class="sv-wt sm b" x="530" y="186">dans le code</text>
</svg></div>
<div class="grid" style="margin-top:12px">
 <div class="tile"><b>Utilisateur root</b><p>Accès total. MFA, pas de clés d’accès, jamais au quotidien.</p></div>
 <div class="tile"><b>Moindre privilège</b><p>Uniquement les droits nécessaires. Par défaut : tout est refusé.</p></div>
 <div class="tile"><b>Politique d’identité</b><p>Attachée à un utilisateur, groupe ou rôle.</p></div>
 <div class="tile"><b>Politique de ressource</b><p>Attachée à la ressource, ex. bucket policy S3.</p></div>
 <div class="tile"><b>IAM Identity Center</b><p>Connexion unique des EMPLOYÉS à plusieurs comptes.</p></div>
 <div class="tile"><b>Amazon Cognito</b><p>Connexion des CLIENTS de ton appli web ou mobile.</p></div>
 <div class="tile"><b>Credential report</b><p>CSV : tous les utilisateurs et l’état de leurs identifiants.</p></div>
 <div class="tile"><b>IAM Access Analyzer</b><p>Trouve les ressources partagées avec l’extérieur.</p></div>
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
 <div class="tile"><p class="k">protéger</p><b>Network Firewall</b><p>Pare-feu réseau managé pour tes VPC.</p></div>
 <div class="tile w"><p class="k">détecter</p><b>Amazon GuardDuty</b><p>Détection de menaces : lit CloudTrail, VPC Flow Logs, DNS. Sans agent.</p></div>
 <div class="tile w"><p class="k">détecter</p><b>Amazon Inspector</b><p>Scan de vulnérabilités (CVE) : EC2, images ECR, Lambda.</p></div>
 <div class="tile w"><p class="k">détecter</p><b>Amazon Macie</b><p>Trouve les données sensibles (PII, cartes) dans S3.</p></div>
 <div class="tile w"><p class="k">centraliser</p><b>AWS Security Hub</b><p>Tableau unique des alertes + contrôles de bonnes pratiques.</p></div>
 <div class="tile"><p class="k">enquêter</p><b>Amazon Detective</b><p>Visualise les liens et trouve la cause racine d’une alerte.</p></div>
 <div class="tile"><p class="k">auditer</p><b>AWS Audit Manager</b><p>Collecte des preuves en continu pour TES audits.</p></div>
 <div class="tile"><p class="k">auditer</p><b>AWS Artifact</b><p>Télécharge les rapports de conformité d’AWS.</p></div>
 <div class="tile"><p class="k">signaler</p><b>AWS Trust &amp; Safety</b><p>Signaler un abus venant de ressources AWS (spam, attaque).</p></div>
</div></section>

<section class="card"><h3>La triade de surveillance</h3><p class="sub">Trois services, trois questions différentes. C’est le piège le plus fréquent de l’examen.</p>
<div class="triad">
 <div class="tile"><p class="k">AWS CloudTrail</p><p class="big">Qui a fait quoi ?</p><p>Journal de chaque appel API : utilisateur, heure, IP. « Qui a supprimé ce bucket ? »</p></div>
 <div class="tile"><p class="k">AWS Config</p><p class="big">C’était configuré comment ?</p><p>Historique de configuration + règles de conformité. « Ce security group est-il conforme ? »</p></div>
 <div class="tile"><p class="k">Amazon CloudWatch</p><p class="big">Ça tourne comment ?</p><p>Métriques, logs, alarmes, tableaux de bord. « CPU au-dessus de 80 % ? »</p></div>
</div></section>

<section class="card"><h3>Où se place chaque protection</h3><p class="sub">Le trajet d’une requête depuis Internet jusqu’à ton serveur.</p>
<div class="dia-wrap"><svg class="dia" viewBox="0 0 690 140" role="img" aria-label="Internet, Shield, CloudFront avec WAF, load balancer, EC2 avec security group">
 <defs><marker id="ar2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path class="sv-ar" d="M0,0 L10,5 L0,10 z"/></marker></defs>
 <rect class="sv-s" x="8" y="40" width="88" height="60" rx="8"/><text class="sv-t b" x="52" y="75" text-anchor="middle">Internet</text>
 <line class="sv-ln" x1="96" y1="70" x2="116" y2="70" marker-end="url(#ar2)"/>
 <rect class="sv-w" x="118" y="40" width="120" height="60" rx="8"/><text class="sv-t b" x="178" y="65" text-anchor="middle">AWS Shield</text><text class="sv-m sm" x="178" y="84" text-anchor="middle">DDoS couches 3-4</text>
 <line class="sv-ln" x1="238" y1="70" x2="258" y2="70" marker-end="url(#ar2)"/>
 <rect class="sv-a" x="260" y="40" width="140" height="60" rx="8"/><text class="sv-t b" x="330" y="65" text-anchor="middle">CloudFront + WAF</text><text class="sv-m sm" x="330" y="84" text-anchor="middle">filtre HTTP, couche 7</text>
 <line class="sv-ln" x1="400" y1="70" x2="420" y2="70" marker-end="url(#ar2)"/>
 <rect class="sv-b" x="422" y="40" width="108" height="60" rx="8"/><text class="sv-t b" x="476" y="65" text-anchor="middle">Load balancer</text><text class="sv-m sm" x="476" y="84" text-anchor="middle">certificat ACM</text>
 <line class="sv-ln" x1="530" y1="70" x2="550" y2="70" marker-end="url(#ar2)"/>
 <rect class="sv-g" x="552" y="40" width="130" height="60" rx="8"/><text class="sv-t b" x="617" y="65" text-anchor="middle">EC2</text><text class="sv-m sm" x="617" y="84" text-anchor="middle">security group : IP/port</text>
 <text class="sv-m sm" x="345" y="128" text-anchor="middle">GuardDuty surveille l’ensemble en arrière-plan, Inspector scanne l’instance</text>
</svg></div></section>

<section class="card"><h3>Chiffrement et secrets</h3>
<div class="grid">
 <div class="tile"><p class="k">clés</p><b>AWS KMS</b><p>Crée et gère les clés, intégré à S3, EBS, RDS. Multi-locataire, géré par AWS.</p></div>
 <div class="tile"><p class="k">clés</p><b>AWS CloudHSM</b><p>Module matériel DÉDIÉ à toi seul. Tu as le contrôle exclusif des clés.</p></div>
 <div class="tile"><p class="k">secrets</p><b>Secrets Manager</b><p>Mots de passe et clés d’API, avec rotation automatique.</p></div>
 <div class="tile"><p class="k">certificats</p><b>AWS Certificate Manager</b><p>Certificats SSL/TLS publics gratuits, renouvelés automatiquement.</p></div>
</div>
<div class="flow" style="margin-top:12px">
 <div class="st a"><b>Au repos</b><span>Données stockées : EBS, S3 (SSE), RDS chiffrés avec KMS</span></div>
 <div class="st a"><b>En transit</b><span>Données qui voyagent : HTTPS/TLS, VPN IPsec</span></div>
</div></section>`,
 traps:["CloudTrail = qui a fait l’action. Config = état de la configuration. CloudWatch = performances et alarmes.","GuardDuty détecte des menaces dans les journaux. Inspector cherche des failles logicielles. Macie cherche des données sensibles dans S3.","Shield Standard est gratuit et activé pour tout le monde. Seul Advanced est payant.","Rotation automatique des mots de passe → Secrets Manager, pas Parameter Store ni KMS."]},

{n:4,short:"Calcul & réseau",title:"Calcul (EC2, serverless) et réseau (VPC)",dom:3,time:"≈ 5 h",
 lede:"Le plus gros domaine de l’examen (34 %). Les options d’achat EC2, du serveur à la fonction, puis le réseau : VPC, connexions hybrides, DNS et diffusion mondiale.",
 steps:[["Lire la leçon calcul + modes d’achat EC2","50 min"],["Dessiner le schéma VPC de mémoire (public, privé, NAT, IGW)","20 min"],["Cloud Quest : missions EC2 et réseau","75 min"],["Quiz du jour, viser 80 % ou plus","35 min"],["Refaire les erreurs accumulées","30 min"]],
 lesson:`
<section class="card"><h3>Du serveur à la fonction</h3><p class="sub">Plus tu vas à droite, moins tu gères de choses, et moins tu as de contrôle.</p>
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
 <div class="tile"><b>On-Demand</b><p>Court, imprévisible, ne doit pas être interrompu. Aucun engagement.</p></div>
 <div class="tile"><b>Savings Plans</b><p>Engagement en $/heure sur 1 ou 3 ans. Compute = flexible (famille, Région, Fargate, Lambda).</p></div>
 <div class="tile"><b>Reserved Instances</b><p>1 ou 3 ans, charge stable. Plus tu paies d’avance (All Upfront), plus c’est bas.</p></div>
 <div class="tile"><b>Spot</b><p>Capacité inutilisée. Peut être reprise avec 2 min de préavis. Jobs interruptibles.</p></div>
 <div class="tile w"><b>Dedicated Hosts</b><p>Un serveur physique entier pour toi : licences BYOL par socket ou cœur.</p></div>
 <div class="tile w"><b>Dedicated Instances</b><p>Matériel non partagé, mais sans visibilité sur le serveur physique.</p></div>
</div></section>

<section class="card"><h3>Le réseau : un VPC type</h3><p class="sub">Ton réseau privé dans une Région, réparti sur deux AZ pour la haute disponibilité.</p>
<div class="dia-wrap"><svg class="dia" viewBox="0 0 700 380" role="img" aria-label="VPC avec sous-réseaux publics et privés sur deux zones, load balancer, NAT gateway et connexion vers le datacenter">
 <rect class="sv-w" x="8" y="140" width="94" height="96" rx="8"/><text class="sv-t b" x="55" y="182" text-anchor="middle"><tspan x="55">Ton</tspan><tspan x="55" dy="16">datacenter</tspan></text>
 <line class="sv-ln" x1="102" y1="170" x2="146" y2="170"/><text class="sv-t sm b" x="124" y="162" text-anchor="middle">DX</text>
 <line class="sv-l" x1="102" y1="212" x2="146" y2="212"/><text class="sv-t sm b" x="124" y="204" text-anchor="middle">VPN</text>
 <rect class="sv-l" x="128" y="8" width="564" height="364" rx="14"/><text class="sv-m sm" x="144" y="28">Région</text>
 <rect class="sv-b" x="146" y="48" width="532" height="310" rx="12"/><text class="sv-t b" x="162" y="72">VPC 10.0.0.0/16</text>
 <rect class="sv-a" x="350" y="34" width="150" height="28" rx="6"/><text class="sv-t sm b" x="425" y="53" text-anchor="middle">Internet gateway</text>
 <rect class="sv-l" x="162" y="84" width="248" height="262" rx="10"/><text class="sv-m sm" x="174" y="100">AZ A</text>
 <rect class="sv-l" x="418" y="84" width="248" height="262" rx="10"/><text class="sv-m sm" x="430" y="100">AZ B</text>
 <rect class="sv-g" x="174" y="108" width="224" height="98" rx="8"/><text class="sv-t sm b" x="186" y="126">Sous-réseau public</text>
 <rect class="sv-g" x="430" y="108" width="224" height="98" rx="8"/><text class="sv-t sm b" x="442" y="126">Sous-réseau public</text>
 <rect class="sv-af" x="232" y="136" width="380" height="28" rx="14"/><text class="sv-o sm b" x="422" y="155" text-anchor="middle">Application Load Balancer (sur les 2 AZ)</text>
 <rect class="sv-w" x="186" y="172" width="96" height="26" rx="6"/><text class="sv-t sm" x="234" y="189" text-anchor="middle">NAT gateway</text>
 <rect class="sv-s" x="174" y="218" width="224" height="116" rx="8"/><text class="sv-t sm b" x="186" y="236">Sous-réseau privé</text>
 <rect class="sv-s" x="430" y="218" width="224" height="116" rx="8"/><text class="sv-t sm b" x="442" y="236">Sous-réseau privé</text>
 <rect class="sv-w" x="194" y="252" width="84" height="40" rx="6"/><text class="sv-t sm b" x="236" y="276" text-anchor="middle">EC2</text>
 <rect class="sv-w" x="450" y="252" width="84" height="40" rx="6"/><text class="sv-t sm b" x="492" y="276" text-anchor="middle">EC2</text>
 <rect class="sv-a" x="552" y="252" width="84" height="40" rx="6"/><text class="sv-t sm b" x="594" y="276" text-anchor="middle">RDS</text>
 <rect x="188" y="246" width="96" height="52" rx="8" style="fill:none;stroke:var(--accent);stroke-width:1.3;stroke-dasharray:3 3"/>
 <text class="sv-m sm" x="194" y="316">pointillés = security group</text>
</svg></div>
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
</div></section>`,
 traps:["Interruptible et le moins cher → Spot. Ne doit pas être interrompu et court → On-Demand.","Licences par socket ou cœur → Dedicated Hosts, pas Dedicated Instances.","Security group = stateful, instance, allow seulement. NACL = stateless, sous-réseau, allow + deny.","CloudFront met en cache du contenu HTTP. Global Accelerator donne des IP statiques et accélère TCP/UDP, sans cache.","Connexion chiffrée dès aujourd’hui → VPN. Débit constant et privé → Direct Connect."]},

{n:5,short:"Stockage, bases, IA",title:"Stockage, bases de données, analytique et IA",dom:3,time:"≈ 5 h",
 lede:"Choisir le bon stockage et la bonne base selon la situation, puis reconnaître les services d’analytique, d’IA, d’intégration et de déploiement.",
 steps:[["Lire la leçon stockage + classes S3","40 min"],["Lire bases de données, analytique, IA","50 min"],["Cloud Quest : missions stockage et bases","60 min"],["Quiz du jour (le plus long), viser 80 % ou plus","40 min"],["Refaire les erreurs accumulées","30 min"]],
 lesson:`
<section class="card"><h3>Trois façons de stocker</h3>
<div class="triad">
 <div class="tile"><p class="k">bloc</p><p class="big">Amazon EBS</p><p>Un disque dur pour UNE instance EC2 (dans une AZ). Volume de démarrage. Persiste après l’arrêt. À l’opposé : l’instance store, éphémère.</p></div>
 <div class="tile"><p class="k">fichiers</p><p class="big">EFS / FSx</p><p>Système de fichiers partagé par des centaines d’instances. EFS = Linux multi-AZ. FSx = Windows (SMB), Lustre (calcul intensif).</p></div>
 <div class="tile"><p class="k">objet</p><p class="big">Amazon S3</p><p>Fichiers illimités dans des buckets, accès par URL ou API. Durabilité 99,999999999 % (11 neuf).</p></div>
</div>
<div class="grid" style="margin-top:12px">
 <div class="tile"><b>Storage Gateway</b><p>Hybride : tes applis sur site utilisent S3, avec un cache local.</p></div>
 <div class="tile"><b>Snowball Edge</b><p>Une valise de disques envoyée par transporteur : des dizaines de To sans bonne connexion.</p></div>
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
<p class="note" style="margin-top:8px">Les <b>règles de cycle de vie</b> S3 déplacent automatiquement les objets vers une classe plus froide après X jours.</p>
</section>

<section class="card"><h3>Quelle base de données ?</h3><p class="sub">Lis le besoin, trouve le service.</p>
<div class="grid">
 <div class="tile"><p class="k">SQL relationnel</p><b>Amazon RDS</b><p>MySQL, PostgreSQL, Oracle, SQL Server… managé. Multi-AZ = haute dispo, read replicas = lecture.</p></div>
 <div class="tile"><p class="k">SQL haute perf</p><b>Amazon Aurora</b><p>Compatible MySQL et PostgreSQL, jusqu’à 5× plus rapide, stockage qui grandit tout seul.</p></div>
 <div class="tile"><p class="k">NoSQL clé-valeur</p><b>Amazon DynamoDB</b><p>Serverless, latence de quelques ms à toute échelle.</p></div>
 <div class="tile"><p class="k">cache</p><b>Amazon ElastiCache</b><p>Cache en mémoire (Redis, Memcached) devant une base.</p></div>
 <div class="tile"><p class="k">entrepôt</p><b>Amazon Redshift</b><p>Analytique SQL sur des pétaoctets.</p></div>
 <div class="tile"><p class="k">graphe</p><b>Amazon Neptune</b><p>Relations : réseaux sociaux, recommandations, fraude.</p></div>
 <div class="tile"><p class="k">documents</p><b>Amazon DocumentDB</b><p>JSON, compatible MongoDB.</p></div>
 <div class="tile"><p class="k">migration</p><b>AWS DMS</b><p>Migre une base, la source reste en service pendant la migration.</p></div>
</div></section>

<section class="card"><h3>La chaîne de l’analytique</h3>
<div class="flow">
 <div class="st"><b>Kinesis</b><span>ingérer des flux en temps réel</span></div><span class="arrow">→</span>
 <div class="st a"><b>S3</b><span>lac de données</span></div><span class="arrow">→</span>
 <div class="st"><b>Glue</b><span>cataloguer, ETL</span></div><span class="arrow">→</span>
 <div class="st"><b>Athena · Redshift · EMR</b><span>SQL sur S3 · entrepôt · Spark/Hadoop</span></div><span class="arrow">→</span>
 <div class="st"><b>QuickSight</b><span>tableaux de bord</span></div>
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
 <div class="tile"><p class="k">chercher</p><b>Kendra</b><p>Recherche intelligente dans des documents.</p></div>
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
 <div class="tile"><p class="k">CI/CD</p><b>CodePipeline, CodeBuild, CodeDeploy</b><p>Construire, tester, déployer automatiquement.</p></div>
 <div class="tile"><p class="k">utilisateurs</p><b>WorkSpaces, Connect, SES</b><p>Bureaux virtuels, centre d’appels, envoi d’e-mails.</p></div>
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
</div></section>

<section class="card"><h3>Les plans AWS Support</h3><p class="sub">Grille utilisée dans l’examen CLF-C02. Retiens surtout les temps de réponse et le TAM.</p>
<div class="tbl-wrap"><table class="m">
<tr><th></th><th>Accès technique</th><th>Réponse la plus rapide</th><th>Trusted Advisor</th><th>TAM</th></tr>
<tr><td class="h">Basic<span class="tag">gratuit</span></td><td class="n">non : compte et facturation, docs, re:Post</td><td class="n">non</td><td>contrôles essentiels</td><td class="n">non</td></tr>
<tr><td class="h">Developer</td><td>e-mail, heures ouvrées</td><td>&lt; 12 h · système altéré</td><td>contrôles essentiels</td><td class="n">non</td></tr>
<tr><td class="h">Business</td><td class="a">24/7 tél., chat, e-mail</td><td class="a">&lt; 1 h · production en panne</td><td class="a">tous les contrôles</td><td class="n">non</td></tr>
<tr><td class="h">Enterprise On-Ramp</td><td class="a">24/7</td><td class="a">&lt; 30 min · critique en panne</td><td class="a">tous</td><td class="c">pool de TAM + Concierge</td></tr>
<tr><td class="h">Enterprise</td><td class="a">24/7</td><td class="a">&lt; 15 min · critique en panne</td><td class="a">tous</td><td class="c">TAM désigné + Concierge</td></tr>
</table></div>
<div class="bars" style="margin-top:14px">
 <div class="bar"><span>Developer</span><div class="tr"><div class="fl w" style="width:100%"></div></div><span class="v">12 h</span></div>
 <div class="bar"><span>Business</span><div class="tr"><div class="fl" style="width:8.3%"></div></div><span class="v">1 h</span></div>
 <div class="bar"><span>Enterprise On-Ramp</span><div class="tr"><div class="fl" style="width:4.2%"></div></div><span class="v">30 min</span></div>
 <div class="bar"><span>Enterprise</span><div class="tr"><div class="fl g" style="width:2.1%"></div></div><span class="v">15 min</span></div>
</div>
<p class="note" style="margin-top:8px">Barres = délai de réponse le plus court, à l’échelle (12 h = barre pleine).</p>
<div class="tile w" style="margin-top:14px"><p class="k">nouveauté AWS, décembre 2025</p><b>Nouvelle gamme de plans</b><p>AWS a annoncé <b>Business Support+</b> (dès 29 $/mois, réponse en 30 min pour un cas critique), <b>Enterprise</b> (dès 5 000 $/mois, TAM désigné, 15 min) et <b>Unified Operations</b> (dès 50 000 $/mois, 5 min). Developer, Business classique et Enterprise On-Ramp sont maintenus jusqu’au 1er janvier 2027. Les questions de l’examen CLF-C02 suivent encore souvent l’ancienne grille ci-dessus : apprends-la en priorité, et retiens les nouveaux noms au cas où.</p></div>
</section>

<section class="card"><h3>Trusted Advisor et l’écosystème</h3>
<div class="grid">
 <div class="tile"><p class="k">Trusted Advisor</p><b>6 catégories</b><p>Optimisation des coûts, performance, sécurité, tolérance aux pannes, quotas de service, excellence opérationnelle.</p></div>
 <div class="tile"><b>AWS Health Dashboard</b><p>Événements AWS (maintenance, pannes) qui touchent TES ressources.</p></div>
 <div class="tile"><b>AWS Marketplace</b><p>Acheter des logiciels tiers, facturés sur ta facture AWS.</p></div>
 <div class="tile"><b>AWS Partner Network</b><p>Trouver des sociétés partenaires (conseil, intégration).</p></div>
 <div class="tile"><b>AWS re:Post</b><p>Questions-réponses communautaires, gratuit.</p></div>
 <div class="tile"><b>Professional Services</b><p>Experts AWS pour accompagner de gros projets.</p></div>
 <div class="tile"><b>Concierge</b><p>Experts facturation et compte (Enterprise et On-Ramp).</p></div>
 <div class="tile"><b>Trust &amp; Safety</b><p>Signaler un abus venant de ressources AWS.</p></div>
</div></section>`,
 traps:["Estimer AVANT de déployer → Pricing Calculator. Analyser le PASSÉ → Cost Explorer. Être ALERTÉ → Budgets.","Le moins cher avec accès 24/7 → Business. TAM désigné → Enterprise. 30 min → Enterprise On-Ramp.","Tous les contrôles Trusted Advisor dès le plan Business.","Le transfert de données ENTRANT est gratuit, le SORTANT est payant."]},

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
<p class="note" style="margin-top:10px">15 des 65 questions ne comptent pas (questions en test), mais tu ne sais pas lesquelles : traite-les toutes sérieusement.</p>
</section>`,
 traps:["Toujours vérifier « Choisis 2 » avant de valider.","« Le moins d’effort opérationnel » pointe presque toujours vers un service managé ou serverless."]}
];
