# Vérification du contenu (1er novembre 2026)

Le contenu a été relu contre le [guide officiel CLF-C02](https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html), version 1.3 du 29 octobre 2026, et contre la documentation AWS du jour. AWS publie chaque révision environ un mois avant qu'elle n'arrive dans l'examen : les deux versions des plans de support sont donc enseignées.

## Ce qui a changé dans le guide

| Sujet | Avant | Guide v1.3 |
|---|---|---|
| Plans de support | Basic, Developer, Business, Enterprise On-Ramp, Enterprise | Basic, Business Support+, Enterprise, Unified Operations |
| Hors programme | | Wavelength, Network Firewall, FSx for Lustre, CodeDeploy, Transfer Family, AWS IQ |
| Absents de la liste | Snow Family, DataSync, Audit Manager, Kendra, AppSync, CodeCommit, Cloud9 | |
| Renommés | QuickSight, SageMaker | Amazon Quick, SageMaker AI |
| Dans la liste, souvent oubliés | | Migration Evaluator, Elastic Disaster Recovery, WorkSpaces Secure Browser, AppStream 2.0, Client VPN, PrivateLink |

## Corrections apportées

- **Plans de support (jour 6)** : nouvelle grille en premier (Business Support+ dès 29 $/mois et 30 min pour un système critique, Enterprise dès 5 000 $/mois avec TAM désigné et 15 min, Unified Operations dès 50 000 $/mois et 5 min), ancienne grille gardée à part, retirée le 1er janvier 2027. Les questions 6-09, 6-10, 6-11, 6-12, 6-19, 6-20 et 6-29 ont été réécrites : plusieurs bonnes réponses changeaient (par exemple « 30 min au plus bas prix » donnait Enterprise On-Ramp, c'est maintenant Business Support+).
- **Wavelength** : hors programme. La question 1-04 est remplacée par une question sur les bénéfices du CAF, le distracteur de la question 1-27 est remplacé, la fiche est retirée.
- **Network Firewall** : hors programme. Tuile du jour 3 et fiche retirées, distracteur de la question 3-16 remplacé.
- **FSx for Lustre** : hors programme. Jour 5 et fiche FSx corrigés (Windows File Server, NetApp ONTAP, OpenZFS).
- **CodeDeploy** : hors programme. Jour 5 corrigé, distracteurs des questions 4-24 et 5-21 remplacés.
- **QuickSight** devient **Amazon Quick** : jour 5, questions 5-31 et 5-32, fiche.
- **Snowball Edge** : plus proposé aux nouveaux clients depuis le 7 novembre 2025 et absent de la liste 2026. Gardé avec cet avertissement, car il apparaît encore dans les banques de questions.
- **Migration** : Snow Family retiré des outils du jour 1, ajout de Migration Evaluator et de SCT.
- **Offre gratuite** : depuis le 15 juillet 2025, les nouveaux comptes reçoivent des crédits au lieu des « 12 mois gratuits » (question 6-24).
- **Divers** : ElastiCache cite Valkey, Security Hub cite Security Hub CSPM, S3 chiffre par défaut en SSE-S3, contrôles hérités ajoutés au modèle de responsabilité partagée, catégorie « excellence opérationnelle » ajoutée à la fiche Trusted Advisor.

## Ajouts pour couvrir le guide

- Jour 1 : l'économie du cloud (coûts fixes et variables, BYOL ou licence incluse, rightsizing, automatisation), les 4 bénéfices du CAF, les AZ sans point de panne unique.
- Jour 2 : politiques gérées ou personnalisées, fédération, rôles inter-comptes, rangement des secrets.
- Jour 3 : où sont les journaux (CloudTrail, CloudWatch Logs, VPC Flow Logs, logs d'accès) et où lire la doc sécurité et conformité.
- Jour 4 : facturation à la seconde, Capacity Reservations, flexibilité et partage des RI, PrivateLink et VPC endpoints, Client VPN, WorkSpaces, AppStream 2.0 et Secure Browser.
- Jour 5 : Elastic Disaster Recovery, base sur EC2 ou managée, SCT, X-Ray, console, CLI, SDK et IaC, Amplify, Service Catalog et Service Quotas.
- Jour 6 : coûts de transfert (entre AZ, entre Régions), offre gratuite, Health API, avantages partenaires, Marketplace, solutions architects, Prescriptive Guidance, Support Center, Knowledge Center.
- 32 nouvelles questions (211 au total) et 23 nouvelles fiches (189 au total).

## Sources croisées

- AWS : guide CLF-C02 (domaines, services dans et hors programme, révisions), page de la certification (65 questions, 90 min, 100 $, français disponible), [plans](https://aws.amazon.com/premiumsupport/plans/) et [tarifs](https://aws.amazon.com/premiumsupport/pricing/) du support, [annonce des nouveaux plans](https://aws.amazon.com/blogs/aws/new-and-enhanced-aws-support-plans-add-ai-capabilities-to-expert-guidance) du 2 décembre 2025, [disponibilité de Snowball Edge](https://docs.aws.amazon.com/snowball/latest/developer-guide/snowball-edge-availability-change.html).
- Vidéos YouTube récentes (transcriptions lues) : le cours CLF-C02 2026 d'Andrew Brown enseigne encore l'ancienne grille de support et insiste sur le fait que les plans tombent à l'examen ; des séries de questions d'entraînement 2026 reviennent sans cesse sur la responsabilité partagée, NAT gateway, Access Analyzer, Spot, Config, Compute Optimizer, Migration Evaluator, One Zone-IA et Cognito.
- r/AWSCertifications : les retours de 2026 insistent sur les 6 piliers Well-Architected, sur la lecture attentive (on élimine souvent deux réponses, les deux restantes se ressemblent) et sur les examens blancs, qui font la plus grosse différence.
- Un [article d'octobre 2026](https://dev.to/thibaudlepan/aws-support-plans-changed-and-most-clf-c02-notes-have-not-5fll) confirme que la plupart des fiches en ligne ont gardé l'ancienne grille de support.
