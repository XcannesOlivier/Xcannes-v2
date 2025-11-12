import Head from "next/head";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";

export default function Disclaimer() {
  const { t } = useTranslation("common");

  const sections = [
    {
      number: "01",
      icon: "📋",
      title: "Présentation et Acceptation des Conditions",
      content: [
        "En accédant au site <strong>xcannes.com</strong> ou en utilisant nos services (DEX, wallets, API), vous acceptez pleinement et sans réserve ces Conditions Générales d'Utilisation (CGU).",
        "Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.",
        "L'utilisation continue du site après toute modification des CGU constitue une acceptation de ces modifications.",
      ],
    },
    {
      number: "02",
      icon: "🪙",
      title: "Nature et Usage du Token XCS",
      content: [
        "XCS est un <strong>actif numérique</strong> basé sur le XRPL (XRP Ledger) conçu pour représenter et soutenir l'écosystème de XCANNES.",
        "Il ne constitue <strong>pas un produit financier</strong>, ni une valeur mobilière, ni une offre d'investissement.",
        "Aucune garantie de rentabilité, de valorisation future ou de liquidité n'est offerte.",
        "<strong class='text-xcannes-green'>⚠️ AVERTISSEMENT IMPORTANT :</strong> XCANNES n'est pas responsable des fluctuations de prix du XCS sur les marchés. La valeur peut augmenter ou diminuer de manière significative.",
        "XCS peut être utilisé pour des services dans l'écosystème XCANNES, mais son utilité peut évoluer.",
      ],
    },
    {
      number: "03",
      icon: "🔐",
      title: "Accès au Site et Services",
      content: [
        "Vous devez avoir <strong>au moins 18 ans</strong> (ou l'âge de la majorité dans votre juridiction).",
        "Respecter les lois et régulations de votre pays concernant les cryptomonnaies et actifs numériques.",
        "Ne pas utiliser XCS ou nos services à des fins illégales (blanchiment d'argent, financement du terrorisme, etc.).",
        "XCANNES se réserve le droit de refuser l'accès à ses services dans certaines juridictions.",
        "Les utilisateurs de pays où les cryptomonnaies sont interdites utilisent les services à leurs propres risques.",
      ],
    },
    {
      number: "04",
      icon: "🛡️",
      title: "Sécurité et Responsabilité",
      content: [
        "<strong class='text-xcannes-green'>🚨 AVERTISSEMENTS CRITIQUES :</strong>",
        "• XCANNES ne vous demandera <strong>JAMAIS</strong> vos clés privées, phrases de récupération (seed phrases) ou mots de passe.",
        "• Soyez extrêmement vigilant(e) face aux tentatives de phishing, faux sites web et arnaques.",
        "• Vérifiez toujours l'URL du site : <strong>xcannes.com</strong> (méfiez-vous des fautes d'orthographe).",
        "• Vous êtes <strong>seul(e) responsable</strong> de la sécurité de vos wallets et clés privées.",
        "• En cas de perte de vos clés privées, XCANNES <strong>ne pourra pas récupérer vos fonds</strong>.",
        "• Activez l'authentification à deux facteurs (2FA) sur tous vos comptes liés aux cryptomonnaies.",
        "• N'investissez que ce que vous pouvez vous permettre de perdre.",
      ],
    },
    {
      number: "05",
      icon: "🔄",
      title: "Transactions et Échanges",
      content: [
        "XCS peut être échangé sur des plateformes DEX (XCANNES DEX, XRP Toolkit) ou CEX partenaires (Bitrue, etc.).",
        "Nous ne garantissons pas la disponibilité ou la liquidité de XCS sur toutes les plateformes.",
        "<strong>Toutes les transactions blockchain sont définitives et irréversibles.</strong>",
        "XCANNES ne prend pas en charge les frais de transaction (gas fees, network fees) imposés par les exchanges, wallets ou la blockchain.",
        "Vérifiez toujours l'adresse du destinataire avant d'envoyer des tokens - les erreurs ne peuvent pas être annulées.",
        "Les délais de transaction dépendent de la congestion du réseau XRPL et peuvent varier.",
        "XCANNES n'est pas responsable des erreurs de manipulation de votre part (mauvaise adresse, mauvais montant, etc.).",
      ],
    },
    {
      number: "06",
      icon: "🔒",
      title: "Données Personnelles et Confidentialité",
      content: [
        "XCANNES respecte la vie privée des utilisateurs conformément au RGPD (pour les résidents de l'UE).",
        "Aucune donnée personnelle n'est partagée avec des tiers sans votre consentement explicite.",
        "Des cookies et technologies similaires peuvent être utilisés pour améliorer l'expérience utilisateur.",
        "Vous avez le droit d'accéder, de modifier ou de supprimer vos données personnelles.",
        "Les transactions blockchain sont publiques et transparentes par nature - XCANNES ne contrôle pas cette transparence.",
        "📌 Consultez notre <a href='/confidentialite' class='underline text-xcannes-green hover:text-xcannes-green/80'>Politique de Confidentialité</a> pour plus d'informations détaillées.",
      ],
    },
    {
      number: "07",
      icon: "⚖️",
      title: "Réglementation et Conformité",
      content: [
        "XCANNES opère dans un cadre décentralisé et s'efforce de respecter les lois applicables.",
        "<strong class='text-xcannes-green'>⚠️ RESPONSABILITÉ DE L'UTILISATEUR :</strong> Chaque utilisateur doit vérifier la légalité de l'utilisation de XCS et des cryptomonnaies dans son pays de résidence.",
        "XCANNES <strong>ne fournit aucun conseil</strong> financier, juridique, fiscal ou d'investissement.",
        "Consultez un professionnel qualifié avant de prendre des décisions financières.",
        "XCANNES se réserve le droit de coopérer avec les autorités réglementaires si nécessaire.",
        "Les utilisateurs sont responsables de déclarer leurs gains/pertes en cryptomonnaies selon les lois fiscales de leur juridiction.",
        "XCS n'est pas enregistré comme valeur mobilière dans aucune juridiction à ce jour.",
      ],
    },
    {
      number: "08",
      icon: "⚠️",
      title: "Risques et Limitations de Responsabilité",
      content: [
        "<strong class='text-xcannes-green'>AVERTISSEMENT SUR LES RISQUES :</strong>",
        "• <strong>Volatilité :</strong> Le prix du XCS peut fluctuer de manière extrême et imprévisible.",
        "• <strong>Perte totale :</strong> Vous pouvez perdre la totalité de votre investissement.",
        "• <strong>Absence de garantie :</strong> XCANNES ne garantit pas le fonctionnement continu de ses services.",
        "• <strong>Bugs et failles :</strong> Des erreurs techniques peuvent survenir malgré nos efforts.",
        "• <strong>Évolution réglementaire :</strong> Les lois sur les cryptomonnaies peuvent changer et affecter XCS.",
        "• <strong>Cyberattaques :</strong> Malgré nos mesures de sécurité, aucun système n'est infaillible.",
        "XCANNES décline toute responsabilité pour les pertes financières, manques à gagner ou dommages indirects.",
        "Les services sont fournis « en l'état » sans garantie d'aucune sorte.",
      ],
    },
    {
      number: "09",
      icon: "📅",
      title: "Modifications des CGU",
      content: [
        "XCANNES peut modifier ces conditions à tout moment pour refléter les changements réglementaires, techniques ou opérationnels.",
        "Les mises à jour seront publiées sur le site avec une nouvelle date de version.",
        "Les modifications importantes seront notifiées par email ou notification sur le site (si possible).",
        "L'utilisation continue des services après modification constitue une acceptation des nouvelles CGU.",
        "Il est de votre responsabilité de consulter régulièrement cette page.",
      ],
    },
    {
      number: "10",
      icon: "🌍",
      title: "Droit Applicable et Juridiction",
      content: [
        "Ces CGU sont régies par les lois de la juridiction où XCANNES est enregistré.",
        "Tout litige sera soumis à la juridiction exclusive des tribunaux compétents de cette juridiction.",
        "En cas de conflit, une résolution à l'amiable sera privilégiée avant toute action en justice.",
        "Certaines clauses peuvent être inapplicables dans votre juridiction - les autres clauses restent valides.",
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Conditions Générales & Disclaimer - XCANNES (XCS)</title>
        <meta
          name="description"
          content="Conditions générales d'utilisation, avertissements sur les risques et informations légales concernant le token XCS et les services XCANNES."
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <Header />

      <div className="min-h-screen bg-xcannes-background py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-xcannes-green mb-3 font-light">
              Conditions Légales
            </p>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
              Conditions Générales & Disclaimer
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-6">
              Veuillez lire attentivement ce document avant d'utiliser XCS ou
              nos services.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-white/40">
              <span>📅 Mise à jour : 12 Novembre 2025</span>
              <span>•</span>
              <span>📜 Version 2.0</span>
            </div>
          </div>

          {/* Avertissement principal */}
          <div className="bg-black/40 backdrop-blur-sm border border-xcannes-green/30 rounded-xl p-8 mb-12">
            <div className="flex items-start gap-4">
              <span className="text-4xl">⚠️</span>
              <div className="flex-1">
                <h2 className="text-xl font-orbitron font-bold text-xcannes-green mb-3">
                  Avertissement sur les Risques
                </h2>
                <div className="text-white/70 space-y-2 text-sm leading-relaxed">
                  <p>
                    • Les cryptomonnaies sont des actifs{" "}
                    <strong>hautement volatils et spéculatifs</strong>.
                  </p>
                  <p>
                    • Vous pouvez{" "}
                    <strong>perdre la totalité de votre investissement</strong>.
                  </p>
                  <p>
                    • N'investissez{" "}
                    <strong>
                      que ce que vous pouvez vous permettre de perdre
                    </strong>
                    .
                  </p>
                  <p>
                    • Ce n'est <strong>pas un conseil financier</strong> -
                    consultez un professionnel.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-xcannes-green/20 transition-all duration-300"
              >
                {/* Header de section */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-xcannes-green/10 flex items-center justify-center">
                      <span className="text-sm font-orbitron font-bold text-xcannes-green">
                        {section.number}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{section.icon}</span>
                      <h2 className="text-xl md:text-2xl font-orbitron font-semibold text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Contenu de section */}
                <div className="p-6">
                  <div className="space-y-3 text-white/70 leading-relaxed">
                    {section.content.map((item, idx) => (
                      <p
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: item }}
                        className="text-sm md:text-base"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section Contact */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 mt-12">
            <div className="text-center">
              <span className="text-4xl mb-4 block">💬</span>
              <h2 className="text-2xl font-orbitron font-bold text-white mb-6">
                Contact et Support
              </h2>
              <div className="space-y-3 text-white/70">
                <p className="flex items-center justify-center gap-2">
                  <span>📧</span>
                  <strong className="text-white">Email :</strong>
                  <a
                    href="mailto:support@xcannes.com"
                    className="text-xcannes-green hover:text-xcannes-green/80 underline transition-colors"
                  >
                    support@xcannes.com
                  </a>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>🌐</span>
                  <strong className="text-white">Site officiel :</strong>
                  <a
                    href="https://xcannes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xcannes-green hover:text-xcannes-green/80 underline transition-colors"
                  >
                    xcannes.com
                  </a>
                </p>
                <p className="flex items-center justify-center gap-2">
                  <span>🐦</span>
                  <strong className="text-white">Twitter :</strong>
                  <a
                    href="https://twitter.com/XCannes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xcannes-green hover:text-xcannes-green/80 underline transition-colors"
                  >
                    @XCannes
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer avec boutons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-xcannes-green hover:bg-xcannes-green/90 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <span>←</span>
              <span>Retour à l'accueil</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium px-8 py-3 rounded-lg transition-all duration-300"
            >
              <span>💬</span>
              <span>Nous contacter</span>
            </Link>
          </div>

          {/* Footer legal */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-xs">
            <p>© 2025 XCANNES. Tous droits réservés.</p>
            <p className="mt-2">
              XCS Token • XRPL Native • Issuer:
              rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx
            </p>
          </div>
        </div>
      </div>

      <FooterPro />
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
