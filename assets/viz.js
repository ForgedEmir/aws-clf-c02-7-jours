/* Scènes pédagogiques en CSS 3D. Les textes restent dans le plan de l'écran. */
(function () {
"use strict";
const item = (id, name, text, x, y, z = 20, w = 100, h = 66, kind = "") => ({ id, name, text, x, y, z, w, h, kind });
const frame = (name, x, y, w, h, z = 0) => ({ name, x, y, w, h, z });
const view = (name, items, frames = [], links = [], context = "") => ({ name, items, frames, links, context });
const shared = ["EC2", "RDS", "Lambda", "S3"];
const layers = (name, labels, owners, explanation, context = "") => {
  const result = view(name, labels.map((label, i) => Object.assign(
    item("layer" + i, label, explanation[i], -160, (i - (labels.length - 1) / 2) * 46, (labels.length - 1 - i) * 12, 210, 64, owners[i]),
    { owner: owners[i] }
  )), [], [], context);
  result.layers = true;
  return result;
};
const sharedLayers = name => {
  const labels = ["Données clients", "Identités et accès (IAM)", "Application et code", "OS invité et patchs", "Runtime ou moteur", "Virtualisation", "Matériel et datacenters"];
  const client = name === "EC2" ? 5 : name === "S3" ? 2 : 3;
  const owners = labels.map((_, i) => i < client ? "client" : "aws");
  const explanations = labels.map((label, i) => `${label} : ${owners[i] === "client" ? "à ta charge" : "géré par AWS"}.`);
  if (name === "RDS") {
    labels[4] = "Moteur de base (patchs)";
    explanations[1] = "Tu gères IAM et les comptes de la base.";
    explanations[4] = "AWS patche le moteur de base de données.";
  }
  if (name === "Lambda") explanations[2] = "Tu gères le code de ta fonction et ses permissions IAM.";
  if (name === "S3") {
    explanations[1] = "Tu gères IAM, la bucket policy, le blocage de l’accès public et le choix du chiffrement.";
    explanations[2] = "S3 : aucune couche application à gérer côté client. AWS gère le service.";
    explanations[3] = "S3 : aucun OS invité à administrer côté client.";
  }
  const notes = { EC2: "Tu configures aussi les security groups.", RDS: "Tu configures les comptes de la base, les security groups, le chiffrement et les sauvegardes.", Lambda: "Ton code, tes données et les permissions IAM restent à ta charge.", S3: "Aucune application ni OS à administrer. Tu choisis les accès et le chiffrement." };
  return layers(name, labels, owners, explanations, notes[name]);
};
const storageClasses = [
  ["S3 Standard", "Récupération en millisecondes. Stockage dans au moins 3 AZ."],
  ["S3 Intelligent-Tiering", "Déplace automatiquement les objets selon leur accès. Accès en millisecondes dans les niveaux d’accès immédiat."],
  ["S3 Standard-IA", "Accès peu fréquent, récupération en millisecondes."],
  ["S3 One Zone-IA", "Accès peu fréquent, récupération en millisecondes. Une seule AZ."],
  ["S3 Glacier Instant Retrieval", "Récupération en millisecondes. Pour un accès environ trimestriel."],
  ["S3 Glacier Flexible Retrieval", "Récupération de quelques minutes à 12 h."],
  ["S3 Glacier Deep Archive", "Le moins cher de cette échelle. Moins de 12 h en standard, jusqu’à 48 h en bulk."]
];
const scenes = {
  "global-infra": {
    title: "Du datacenter au monde", intro: "Explore les périmètres. Une Région contient plusieurs AZ, chacune contient un ou plusieurs datacenters.",
    key: "Panne d’un datacenter : multi-AZ. Catastrophe régionale : multi-Région. Choisis une Région selon la conformité et la souveraineté, la latence, les services disponibles et les prix.",
    views: [
      view("Région et AZ", [
        item("region", "Région · Paris", "Exemple : eu-west-3, Paris. Une Région AWS contient au moins 3 AZ physiquement isolées, séparées de plusieurs kilomètres, toutes à moins de 100 km les unes des autres.", 0, -160, 3, 430, 40, "base"),
        ...[-155, 0, 155].map((x, i) => item("az" + i, "AZ " + (i + 1), "Une AZ contient un ou plusieurs datacenters distincts. Alimentation, réseau et connectivité sont redondants. Les AZ sont isolées physiquement. Elles ne partagent aucun point de panne unique.", x, 0, 36, 130, 144)),
        item("network", "Réseau privé", "Les AZ sont reliées par un réseau privé redondant à faible latence. Déploie sur plusieurs AZ pour résister à la panne d’un datacenter.", 0, 155, 12, 420, 24, "base")
      ], [frame("Région", 0, 0, 490, 355)], [["az0", "az1"], ["az1", "az2"], ["az2", "network"], ["az0", "network"]]),
      view("Au-delà de la Région", [
        item("region", "Région AWS", "Les extensions complètent la Région. Pour une catastrophe régionale, prévois une architecture multi-Région.", 0, 0, 36, 120, 90),
        item("edge", "Edge locations", "Des centaines dans le monde : cache CloudFront et DNS Route 53.", -175, -95, 20, 112, 68),
        item("local", "Local Zones", "Extension d’une Région près d’une grande ville, pour une latence de quelques millisecondes.", 175, -95, 20, 112, 68),
        item("wave", "Wavelength Zones", "Infrastructure AWS dans le réseau 5G d’un opérateur télécom. Hors programme dans le guide CLF-C02 2026.", -175, 95, 20, 112, 68, "secondary"),
        item("outpost", "Outposts", "Racks AWS installés dans TON datacenter.", 175, 95, 20, 112, 68)
      ], [], [["region", "edge"], ["region", "local"], ["region", "wave"], ["region", "outpost"]])
    ]
  },
  "shared-responsibility": {
    title: "Qui sécurise quelle couche ?", intro: "Chaque dalle représente une couche. Change de service : la ligne sépare tes responsabilités de celles d’AWS.",
    key: "Contrôles partagés : correctifs, configuration, sensibilisation et formation, chacun pour sa couche. Contrôles hérités : physiques et environnementaux.",
    views: shared.map(sharedLayers)
  },
  vpc: {
    title: "Un réseau, deux AZ", intro: "Région → VPC 10.0.0.0/16 → deux AZ. Chaque AZ contient un sous-réseau public (ALB, NAT) et un sous-réseau privé (EC2, RDS). Compare ensuite les filtres.",
    key: "Un VPC est régional. Un sous-réseau appartient à une seule AZ. Une NAT gateway permet aux instances privées de sortir vers Internet, sans accepter de connexion entrante depuis Internet.",
    views: [
      view("Architecture", [
        item("igw", "Internet gateway", "Les sous-réseaux publics ont une route vers l’Internet gateway. Elle relie le VPC à Internet.", 0, -190, 24, 150, 32),
        item("alb", "ALB · 2 AZ", "Un Application Load Balancer est réparti sur les sous-réseaux publics des deux AZ.", 0, -120, 24, 350, 32),
        item("nat1", "NAT · AZ 1", "NAT gateway dans le sous-réseau public de l’AZ 1. Les instances privées l’utilisent pour sortir vers Internet.", -155, -44, 26, 86, 40),
        item("nat2", "NAT · AZ 2", "NAT gateway dans le sous-réseau public de l’AZ 2. Aucune connexion initiée depuis Internet n’entre par la NAT gateway.", 155, -44, 26, 86, 40),
        item("ec2a", "EC2 · AZ 1", "Instances EC2 dans un sous-réseau privé de l’AZ 1.", -155, 45, 24, 100, 46),
        item("ec2b", "EC2 · AZ 2", "Instances EC2 dans un sous-réseau privé de l’AZ 2.", 155, 45, 24, 100, 46),
        item("rds1", "RDS primaire", "Base RDS primaire dans l’AZ 1, avec un standby Multi-AZ dans l’autre AZ.", -155, 125, 24, 100, 40),
        item("rds2", "RDS standby", "Standby RDS Multi-AZ dans l’AZ 2, pour la disponibilité.", 155, 125, 24, 100, 40)
      ], [frame("Région", 0, 0, 550, 340, -5), frame("VPC · 10.0.0.0/16", 0, 5, 500, 282), frame("AZ 1", -145, 5, 215, 266, 2), frame("AZ 2", 145, 5, 215, 266, 2), frame("Public 1", -145, -72, 195, 102, 4), frame("Public 2", 145, -72, 195, 102, 4), frame("Privé 1", -145, 76, 195, 135, 4), frame("Privé 2", 145, 76, 195, 135, 4)], [["igw", "alb"], ["alb", "ec2a"], ["alb", "ec2b"], ["ec2a", "nat1"], ["ec2b", "nat2"], ["rds1", "rds2"]], "Haut : Internet et sous-réseaux publics. Bas : sous-réseaux privés. À gauche : AZ 1. À droite : AZ 2."),
      view("Filtrage", [
        item("internet", "Internet → IGW", "Une requête venant d’Internet passe par l’Internet gateway, puis le filtrage du sous-réseau et celui de l’instance.", -180, -95, 20, 100, 55),
        item("nacl", "Network ACL", "Entoure le sous-réseau. Sans état : vérifie aussi le trafic de retour. Règles allow ET deny, évaluées dans l’ordre des numéros.", 0, 0, 16, 280, 170, "outline"),
        item("sg", "Security group", "Entoure l’instance. Avec état : le retour est autorisé pour une connexion permise. Règles allow uniquement.", 35, 25, 43, 155, 100, "outline"),
        item("instance", "Instance EC2", "Le trajet est Internet → Internet gateway → Network ACL du sous-réseau → security group → instance EC2.", 35, 25, 72, 80, 48)
      ], [frame("Sous-réseau", 0, 0, 260, 155)], [["internet", "instance"]]),
      view("Ton datacenter", [
        item("dc", "Ton datacenter", "Deux façons de relier ton datacenter au VPC : un VPN sur Internet ou une ligne Direct Connect.", -180, 0, 24, 110, 120),
        item("vpn", "Site-to-Site VPN", "Tunnel IPsec chiffré via Internet. Prêt en quelques minutes.", 0, -83, 35, 140, 70),
        item("dx", "Direct Connect", "Ligne privée dédiée, débit constant. Installation en plusieurs semaines.", 0, 83, 35, 140, 70),
        item("vpc", "VPC régional", "Le VPC s’étend sur les deux AZ de cette architecture.", 180, 0, 24, 110, 120)
      ], [], [["dc", "vpn"], ["vpn", "vpc"], ["dc", "dx"], ["dx", "vpc"]])
    ]
  },
  storage: {
    title: "Choisir son stockage", intro: "Trois familles, trois usages. La seconde vue descend des objets les plus chauds vers l’archive.",
    key: "Bloc : attaché à une instance. Fichiers : partage d’un système de fichiers. Objet : buckets et API. Les règles de cycle de vie S3 déplacent les objets vers le froid.",
    views: [
      view("Bloc · fichiers · objet", [
        item("ebs", "Bloc · EBS", "Volume attaché à une instance EC2, dans UNE AZ. Persiste après l’arrêt. Snapshots incrémentiels stockés dans S3.", -174, -55, 42, 135, 110),
        item("store", "Instance store", "Disque physique de l’hôte, éphémère. Données perdues à l’arrêt ou à la résiliation, contrairement à EBS.", -174, 85, 16, 135, 66, "base"),
        item("efs", "Fichiers · EFS", "NFS pour Linux. Partagé par des milliers d’instances sur plusieurs AZ. Grandit automatiquement.", 0, -55, 42, 135, 110),
        item("fsx", "Amazon FSx", "Windows File Server (SMB), NetApp ONTAP et OpenZFS. FSx for Lustre (calcul haute performance) est hors programme dans le guide 2026.", 0, 85, 16, 135, 66, "base"),
        item("s3", "Objet · S3", "Buckets et objets jusqu’à 5 To. Durabilité : 99,999999999 %. Accès par API ou URL.", 174, -55, 42, 135, 110)
      ], [frame("Bloc", -174, 0, 155, 270), frame("Fichiers", 0, 0, 155, 270), frame("Objet", 174, 0, 155, 270)]),
      view("Classes S3", storageClasses.map(([name, text], i) => item("class" + i, name, text, (i - 3) * 69, (i - 3) * 17, 100 - i * 13, 62, 155)), [], storageClasses.slice(1).map((_, i) => ["class" + i, "class" + (i + 1)]), "1 → 7 : du chaud au froid. Les règles de cycle de vie déplacent les objets vers le froid."),
      view("Express One Zone", [item("express", "S3 Express One Zone", "Une seule AZ, latence de quelques millisecondes et très haute performance. À considérer à part de l’échelle d’archivage.", 0, 0, 55, 260, 155)], [frame("Une AZ", 0, 0, 380, 240)])
    ]
  },
  iam: {
    title: "Des identités aux permissions", intro: "Sépare les personnes, les politiques et les rôles assumés par les services.",
    key: "Par défaut, tout est refusé. Un Deny explicite l’emporte toujours. Aucune clé d’accès dans le code.",
    views: [view("Accès IAM", [
      item("root", "Root", "Accès total. Active MFA, ne crée pas de clés d’accès et ne l’utilise jamais au quotidien.", -185, -110, 20, 110, 50),
      item("users", "Utilisateurs IAM", "Les utilisateurs IAM sont regroupés dans des groupes.", -175, -5, 24, 120, 65),
      item("group", "Groupe", "La politique JSON attachée au groupe accorde des permissions à ses utilisateurs.", 0, -5, 30, 110, 65),
      item("policy", "Politique JSON", "Effect, Action, Resource : indique l’effet (Allow ou Deny), les actions et les ressources visées.", 175, -5, 24, 120, 65),
      item("ec2", "EC2 assume un rôle", "Une instance EC2 assume un rôle IAM. Les identifiants sont temporaires, sans clé dans le code.", -100, 110, 30, 140, 55),
      item("s3", "Lecture de S3", "Le rôle autorise l’instance à lire un bucket S3 selon sa politique de permissions.", 100, 110, 30, 140, 55)
    ], [], [["users", "group"], ["policy", "group"], ["ec2", "s3"]])]
  },
  defense: {
    title: "Une défense en profondeur", intro: "Suis le trajet d’une requête, puis découvre les services qui surveillent en arrière-plan.",
    key: "Shield protège contre les DDoS. WAF filtre les requêtes HTTP. Les outils de détection complètent ces barrières.",
    views: [view("Trajet de la requête", [
      ["Internet", "La requête arrive depuis Internet."],
      ["AWS Shield", "DDoS : Standard est gratuit et automatique, couches 3 et 4. Advanced est payant, avec équipe 24/7, protection des coûts et protection aussi en couche 7."],
      ["CloudFront + WAF", "AWS WAF : règles HTTP de couche 7 contre injection SQL, XSS, IP et bots, ici avec CloudFront."],
      ["ALB + ACM", "Application Load Balancer avec un certificat TLS fourni par AWS Certificate Manager (ACM)."],
      ["Network ACL", "Filtre au périmètre du sous-réseau."],
      ["Security group", "Filtre au périmètre de l’instance."],
      ["Instance EC2", "La requête atteint l’instance après les couches de protection."]
    ].map(([name, text], i) => item("step" + i, name, text, [-180, 0, 180, 180, 0, -180, -180][i], [-130, -130, -130, 0, 0, 0, 130][i], 20, 140, 74)), [], Array.from({ length: 6 }, (_, i) => ["step" + i, "step" + (i + 1)]), "Suis les flèches de 1 à 7 : les protections filtrent la requête avant EC2."),
    view("Détection", [
      item("guard", "GuardDuty", "Détecte les menaces dans CloudTrail, VPC Flow Logs et DNS.", -125, -75, 30, 180, 90),
      item("inspect", "Inspector", "Scanne les vulnérabilités de l’instance.", 125, -75, 30, 180, 90),
      item("macie", "Macie", "Détecte les données sensibles dans S3.", -125, 85, 30, 180, 90),
      item("hub", "Security Hub", "Centralise les alertes de sécurité.", 125, 85, 54, 180, 90)
    ], [], [["guard", "hub"], ["inspect", "hub"], ["macie", "hub"]])]
  },
  compute: {
    title: "Du contrôle à l’abstraction", intro: "Du matériel aux données, chaque dalle indique qui gère la couche. Compare les services pour voir le partage évoluer.",
    key: "Les données et ton application restent à ta charge. Pour ECS et EKS, le partage dépend du choix EC2 ou Fargate.",
    views: [
      ["EC2", "IaaS. Tu gères l’OS, le runtime, l’application et les données. AWS gère le matériel et la virtualisation.", 2],
      ["Lightsail", "Serveur simple à prix mensuel fixe. Tu gères l’OS du serveur, le runtime, l’application et les données. AWS gère le matériel et la virtualisation.", 2],
      ["Beanstalk", "Elastic Beanstalk (PaaS) : tu déposes le code. AWS gère le matériel, la virtualisation, l’OS et le runtime. Tu gères l’application et les données.", 4],
      ["ECS / EKS", "Conteneurs sur EC2 ou Fargate. Sur EC2, tu gères les hôtes et leur OS. Sur Fargate, AWS gère les serveurs et l’OS. Tu gères ton image, ses dépendances, l’application et les données.", 3],
      ["Lambda", "Fonction déclenchée par un événement, 15 minutes maximum, facturée à la milliseconde. AWS gère matériel, virtualisation, OS et runtime. Tu gères application et données.", 4]
    ].map(([name, text, count]) => {
      const labels = ["Données", "Application", "Runtime", "OS", "Virtualisation", "Matériel"];
      const owners = labels.map((_, i) => i < 6 - count ? "client" : "aws");
      if (name === "ECS / EKS") { owners[2] = "client"; owners[3] = "mixed"; }
      return layers(name, labels, owners, labels.map((label, i) => `${label} : ${owners[i] === "aws" ? "géré par AWS" : owners[i] === "mixed" ? "tu gères l’OS des hôtes sur EC2 ; AWS le gère sur Fargate" : "à ta charge"}.`), text);
    })
  }
};
const escape = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let serial = 0;
function mountOne(root, scene) {
  const uid = "scene-" + ++serial;
  const isMobile = () => matchMedia("(max-width:759px)").matches;
  const defaults = () => ({ tilt: scene.views[0].layers ? 38 : isMobile() ? 20 : 34, yaw: isMobile() ? -5 : -14 });
  let current = 0, selected = 0, { tilt, yaw } = defaults(), mobile = isMobile(), drag = null, moved = false;
  const ownerName = owner => owner === "client" ? "Toi" : owner === "mixed" ? "Selon le mode" : "AWS";
  const shortName = n => {
    const names = { region: "Région Paris", network: "Réseau privé", users: "Utilisateurs", group: "Groupe IAM", policy: "Politique JSON", root: "Root · MFA", ec2: "EC2 + rôle IAM", s3: root.dataset.viz === "iam" ? "Bucket S3" : "Objet · S3", internet: "Internet / IGW", instance: "EC2", nacl: "Network ACL", sg: "Security group", wave: "Wavelength (hors guide)", class0: "Standard", class1: "Intelligent", class2: "Standard-IA", class3: "One Zone-IA", class4: "Glacier Instant", class5: "Glacier Flexible", class6: "Deep Archive" };
    return n.owner || n.id === "region" && n.name === "Région AWS" ? n.name : names[n.id] || n.name;
  };
  root.classList.add("viz-ready");
  root.setAttribute("role", "group"); root.setAttribute("aria-labelledby", uid);
  root.innerHTML = `<div class="viz-header"><span class="viz-kicker">Explorer pour comprendre</span><h4 id="${uid}">${escape(scene.title)}</h4><p>${escape(scene.intro)}</p></div>
    <div class="viz-seg" role="group" aria-label="Vue du schéma">${scene.views.map((v, i) => `<button type="button" data-mode="${i}" aria-pressed="${i === 0}">${escape(v.name)}</button>`).join("")}</div>
    <div class="viz-legend" hidden><span class="client">Toi · client</span><span class="aws">AWS</span><span class="mixed" hidden>Selon EC2 ou Fargate</span></div>
    <p class="viz-context"></p>
    <div class="viz-stage" tabindex="0" role="group" aria-label="Scène 3D. Glisse horizontalement ou utilise les flèches pour tourner. Début rétablit la vue."><div class="viz-world" aria-hidden="true"></div><div class="viz-markers" aria-hidden="true"><svg class="viz-leaders"></svg><div class="viz-sharingline"></div></div></div>
    <div class="viz-tools"><span>Glisse pour tourner · flèches au clavier</span><button type="button" class="viz-reset">Recentrer</button></div>
    <div class="viz-parts" role="group" aria-label="Éléments à explorer"></div>
    <div class="viz-inspector" role="status" aria-live="polite" aria-atomic="true"><span class="viz-index"></span><div><h5></h5><p></p></div></div>
    <p class="viz-key">${escape(scene.key)}</p>
    <details class="viz-summary"><summary>Lire le résumé sans 3D</summary>${scene.views.map(v => `<div><h5>${escape(v.name)}</h5>${v.context ? `<p>${escape(v.context)}</p>` : ""}<dl>${v.items.map(n => `<dt>${escape(n.name)}${n.owner ? " · " + ownerName(n.owner) : ""}</dt><dd>${escape(n.text)}</dd>`).join("")}</dl></div>`).join("")}</details>`;
  const stage = root.querySelector(".viz-stage"), world = root.querySelector(".viz-world"), markers = root.querySelector(".viz-markers"), parts = root.querySelector(".viz-parts");
  const leaders = root.querySelector(".viz-leaders"), sharing = root.querySelector(".viz-sharingline");
  let badges = [];
  function project() {
    const v = scene.views[current], width = stage.clientWidth, height = stage.clientHeight;
    if (!width) return;
    const rad = Math.PI / 180, cx = Math.cos(tilt * rad), sx = Math.sin(tilt * rad), cz = Math.cos(yaw * rad), sz = Math.sin(yaw * rad);
    const projected = (x, y, z, scale) => {
      const xx = (x * cz - y * sz) * scale, yy = x * sz + y * cz;
      const ry = (yy * cx - z * sx) * scale, rz = (yy * sx + z * cx) * scale, p = 900 / (900 - rz);
      return { x: width / 2 + xx * p, y: height / 2 + ry * p };
    };
    const corners = [...v.items, ...v.frames].flatMap(n => [-1, 1].flatMap(a => [-1, 1].map(b => projected(n.x + a * n.w / 2, n.y + b * n.h / 2, n.z, 1))));
    const extentX = Math.max(...corners.map(p => Math.abs(p.x - width / 2))) * 2;
    const extentY = Math.max(...corners.map(p => Math.abs(p.y - height / 2))) * 2;
    const scale = v.layers ? Math.min(1, width * .43 / 280) : Math.min(1.15, (width - 20) / extentX, (height - 46) / extentY);
    world.style.transform = `translate(-50%,-50%) scale(${scale}) rotateX(${tilt}deg) rotateZ(${yaw}deg)`;
    const points = v.items.map(n => projected(n.x, n.y, n.z, scale));
    const sizes = badges.map(b => ({ w: b.offsetWidth, h: b.offsetHeight }));
    const places = points.map((p, i) => ({ x: p.x, y: p.y, w: sizes[i].w, h: sizes[i].h }));
    if (v.layers) {
      const gap = 36, start = (height - (v.items.length - 1) * gap) / 2;
      places.forEach((p, i) => { p.x = width * .68; p.y = start + i * gap; });
    } else {
      // On sépare les étiquettes entières, puis on relie leur position au volume.
      const clamp = p => { p.x = Math.max(p.w / 2 + 7, Math.min(width - p.w / 2 - 7, p.x)); p.y = Math.max(p.h / 2 + 8, Math.min(height - p.h / 2 - 8, p.y)); };
      places.forEach(clamp);
      for (let pass = 0; pass < 48; pass++) {
        let collisions = false;
        for (let i = 0; i < places.length; i++) for (let j = i + 1; j < places.length; j++) {
          const a = places[i], b = places[j], dx = b.x - a.x, dy = b.y - a.y;
          const ox = (a.w + b.w) / 2 + 6 - Math.abs(dx), oy = Math.max(34, (a.h + b.h) / 2 + 6) - Math.abs(dy);
          if (ox <= 0 || oy <= 0) continue;
          collisions = true;
          if (ox < oy && Math.abs(dx) > 15) { const shift = Math.sign(dx || 1) * (ox / 2 + .5); a.x -= shift; b.x += shift; }
          else { const shift = Math.sign(dy || (j - i)) * (oy / 2 + .5); a.y -= shift; b.y += shift; }
          clamp(a); clamp(b);
        }
        if (!collisions) break;
      }
    }
    badges.forEach((b, i) => { b.style.left = places[i].x + "px"; b.style.top = places[i].y + "px"; });
    leaders.setAttribute("viewBox", `0 0 ${width} ${height}`);
    leaders.innerHTML = points.map((p, i) => {
      const q = places[i], x = v.layers ? q.x - q.w / 2 : q.x;
      return `<path d="M${p.x},${p.y} L${x},${q.y}"/><circle cx="${p.x}" cy="${p.y}" r="2"/>`;
    }).join("");
    sharing.hidden = !v.layers;
    if (v.layers) {
      const last = v.items.reduce((result, n, i) => n.owner !== "aws" ? i : result, -1);
      sharing.style.left = places[0].x - places[0].w / 2 + "px";
      sharing.style.transform = `translateY(${(places[last].y + places[last + 1].y) / 2}px)`;
    }
  }
  function select(i) {
    selected = i;
    const n = scene.views[current].items[i];
    root.querySelector(".viz-index").textContent = i + 1;
    root.querySelector(".viz-inspector h5").textContent = n.name;
    root.querySelector(".viz-inspector p").textContent = n.text;
    [...parts.children].forEach((b, k) => b.setAttribute("aria-pressed", k === i));
    [...world.querySelectorAll(".viz-volume")].forEach((b, k) => b.classList.toggle("chosen", k === i));
    badges.forEach((b, k) => b.classList.toggle("chosen", k === i));
  }
  function draw() {
    const v = scene.views[current], legend = root.querySelector(".viz-legend"), context = root.querySelector(".viz-context");
    root.classList.toggle("viz-layered", !!v.layers); stage.classList.toggle("layered", !!v.layers);
    context.textContent = v.context; context.hidden = !v.context;
    legend.hidden = !v.layers; legend.querySelector(".mixed").hidden = !v.items.some(n => n.owner === "mixed");
    const boxStyle = n => `left:calc(50% + ${n.x}px);top:calc(50% + ${n.y}px);width:${n.w}px;height:${n.h}px;--depth:12px;transform:translate(-50%,-50%) translateZ(${n.z}px)`;
    if (v.layers && world.querySelectorAll(".viz-volume").length === v.items.length) {
      world.querySelectorAll(".viz-volume").forEach((el, i) => { el.className = "viz-volume " + v.items[i].kind; el.style.cssText = boxStyle(v.items[i]); });
    } else {
      const arrow = ["vpc", "iam", "defense"].includes(root.dataset.viz);
      world.innerHTML = v.frames.map(f => `<div class="viz-frame" style="${boxStyle(f)}"></div>`).join("") +
        `<svg class="viz-wires" viewBox="-300 -180 600 360"><defs><marker id="${uid}-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10"/></marker></defs>${v.links.map(([a, b]) => {
          const p = v.items.find(n => n.id === a), q = v.items.find(n => n.id === b), dx = q.x - p.x, dy = q.y - p.y;
          const edge = n => Math.min(.4, 1 / Math.max(Math.abs(dx) / (n.w / 2 + 8), Math.abs(dy) / (n.h / 2 + 8)));
          const start = arrow ? edge(p) : 0, end = arrow ? edge(q) : 0;
          return `<path d="M${p.x + dx * start},${p.y + dy * start} L${q.x - dx * end},${q.y - dy * end}"${arrow ? ` marker-end="url(#${uid}-arrow)"` : ""}/>`;
        }).join("")}</svg>` +
        v.items.map((n, i) => `<div class="viz-volume ${n.kind}" data-volume="${i}" style="${boxStyle(n)}">${root.dataset.viz === "global-infra" && /^az/.test(n.id) ? '<i class="viz-datacenter"></i><i class="viz-datacenter second"></i>' : ""}</div>`).join("");
    }
    markers.querySelectorAll(".viz-marker").forEach(el => el.remove());
    markers.insertAdjacentHTML("beforeend", v.items.map((n, i) => `<span class="viz-marker ${n.owner || n.kind}" data-marker="${i}"><i>${i + 1}</i><b>${escape(shortName(n))}</b>${n.owner ? `<em>${ownerName(n.owner)}</em>` : ""}</span>`).join(""));
    badges = [...markers.querySelectorAll(".viz-marker")];
    parts.innerHTML = v.items.map((n, i) => `<button type="button" data-part="${i}" aria-pressed="false"${n.kind === "secondary" ? ' class="secondary"' : ""}><span>${i + 1}</span>${escape(n.name)}</button>`).join("");
    parts.scrollLeft = 0;
    root.querySelectorAll("[data-mode]").forEach((b, i) => b.setAttribute("aria-pressed", i === current));
    project(); select(0);
  }
  root.addEventListener("click", e => {
    const mode = e.target.closest("[data-mode]"), part = e.target.closest("[data-part]");
    if (mode) { current = +mode.dataset.mode; draw(); }
    if (part) select(+part.dataset.part);
    if (e.target.closest(".viz-reset")) { ({ tilt, yaw } = defaults()); project(); }
    if (e.target.closest(".viz-stage") && !moved) {
      const hit = badges.findIndex(b => { const r = b.getBoundingClientRect(); return e.clientX >= r.left - 4 && e.clientX <= r.right + 4 && e.clientY >= r.top - 8 && e.clientY <= r.bottom + 8; });
      if (hit >= 0) { select(hit); return; }
      const shape = e.target.closest("[data-volume]");
      if (shape) select(+shape.dataset.volume);
    }
  });
  stage.addEventListener("keydown", e => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(e.key)) return;
    e.preventDefault(); e.stopPropagation();
    if (e.key === "Home") ({ tilt, yaw } = defaults());
    else if (e.key === "ArrowLeft") yaw -= 6;
    else if (e.key === "ArrowRight") yaw += 6;
    else tilt = Math.max(10, Math.min(65, tilt + (e.key === "ArrowUp" ? -4 : 4)));
    yaw = Math.max(-45, Math.min(45, yaw)); project();
  });
  stage.addEventListener("pointerdown", e => { if (!e.isPrimary || e.button !== 0) return; drag = { x: e.clientX, y: e.clientY, yaw, tilt, id: e.pointerId }; moved = false; });
  let paint = 0;
  stage.addEventListener("pointermove", e => {
    if (!drag || drag.id !== e.pointerId) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) > 6 && !moved) { moved = true; stage.classList.add("is-dragging"); stage.setPointerCapture(e.pointerId); }
    if (!moved) return;
    yaw = Math.max(-45, Math.min(45, drag.yaw + dx * .25));
    if (e.pointerType === "mouse") tilt = Math.max(10, Math.min(65, drag.tilt - dy * .15));
    if (!paint) paint = requestAnimationFrame(() => { paint = 0; project(); });
  });
  const stop = e => { if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId); drag = null; stage.classList.remove("is-dragging"); };
  stage.addEventListener("pointerup", stop); stage.addEventListener("pointercancel", stop);
  draw();
  const observer = new ResizeObserver(() => {
    if (mobile !== isMobile()) { mobile = isMobile(); ({ tilt, yaw } = defaults()); }
    project();
  });
  observer.observe(stage);
  return () => { observer.disconnect(); if (paint) cancelAnimationFrame(paint); };
}
let cleanups = [];
window.VIZ = { mount(root) {
  cleanups = cleanups.filter(entry => { if (entry.root.isConnected) return true; entry.dispose(); return false; });
  root.querySelectorAll(".viz[data-viz]").forEach(el => {
    if (el.classList.contains("viz-ready") || !scenes[el.dataset.viz]) return;
    cleanups.push({ root: el, dispose: mountOne(el, scenes[el.dataset.viz]) });
  });
} };
})();
