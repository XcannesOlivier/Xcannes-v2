import Head from "next/head";
import Link from "next/link";

export default function Disclaimer() {
  return (
    <>
      <Head>
        <title>Conditions Générales - XCANNES (XCS)</title>
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-16 text-black bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Conditions Générales d’Utilisation – XCANNES (XCS)</h1>
        <p className="text-sm text-gray-600 mb-8">📅 Dernière mise à jour : Février 2025</p>

        {/* Section 1 */}
        <h2 className="text-xl font-bold mb-2">1. Présentation et Acceptation des Conditions</h2>
        <p className="mb-6">
          En accédant au site <strong>xcannes.com</strong> ou en utilisant nos services, vous acceptez pleinement et sans réserve ces Conditions Générales d’Utilisation (CGU).
        </p>

        {/* Section 2 */}
        <h2 className="text-xl font-bold mb-2">2. Nature et Usage du Token XCS</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>XCS est un actif numérique conçu pour représenter et soutenir l’écosystème de XCANNES.</li>
          <li>Il ne constitue pas un produit financier, ni une valeur mobilière ou une offre d’investissement.</li>
          <li>Aucune garantie de rentabilité ou de valorisation future n’est offerte.</li>
          <li><strong>⚠ XCANNES n’est pas responsable des fluctuations du XCS sur les marchés.</strong></li>
        </ul>

        {/* Section 3 */}
        <h2 className="text-xl font-bold mb-2">3. Accès au Site et Services</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>Vous devez avoir au moins 18 ans.</li>
          <li>Respecter les lois de votre pays.</li>
          <li>Ne pas utiliser XCS ou nos services à des fins illégales.</li>
        </ul>

        {/* Section 4 */}
        <h2 className="text-xl font-bold mb-2">4. Sécurité et Responsabilité</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>XCANNES ne vous demandera jamais vos clés privées ou phrases de récupération.</li>
          <li>🚨 Soyez vigilant(e) face aux tentatives de phishing et aux fraudes.</li>
          <li>Vous êtes seul responsable de la sécurité de vos wallets contenant des XCS.</li>
        </ul>

        {/* Section 5 */}
        <h2 className="text-xl font-bold mb-2">5. Transactions et Échanges</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>XCS peut être échangé sur des plateformes DEX ou CEX partenaires.</li>
          <li>Nous ne garantissons pas sa disponibilité sur toutes les plateformes.</li>
          <li>Toutes les transactions sont <strong>définitives et irréversibles</strong>.</li>
          <li>XCANNES ne prend pas en charge les frais imposés par les exchanges ou wallets.</li>
        </ul>

        {/* Section 6 */}
        <h2 className="text-xl font-bold mb-2">6. Données Personnelles et Confidentialité</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>XCANNES respecte la vie privée des utilisateurs.</li>
          <li>Aucune donnée n’est partagée sans consentement.</li>
          <li>Des cookies peuvent être utilisés pour améliorer l’expérience utilisateur.</li>
        </ul>
        <p className="mb-6">
          📌 Consultez notre <a href="/confidentialite" className="underline text-blue-600">Politique de Confidentialité</a> pour plus d’infos.
        </p>

        {/* Section 7 */}
        <h2 className="text-xl font-bold mb-2">7. Réglementation et Conformité</h2>
        <ul className="list-disc pl-5 mb-6">
          <li>XCANNES respecte un cadre décentralisé conforme aux lois en vigueur.</li>
          <li><strong>⚠ Chaque utilisateur doit vérifier la légalité de l’utilisation de XCS dans son pays.</strong></li>
          <li>XCANNES ne fournit aucun conseil financier, juridique ou fiscal.</li>
        </ul>

        {/* Section 8 */}
        <h2 className="text-xl font-bold mb-2">8. Modifications des CGU</h2>
        <p className="mb-6">
          XCANNES peut modifier ces conditions à tout moment.  
          📅 Les mises à jour seront publiées sur le site et prendront effet immédiatement.
        </p>

        {/* Section 9 */}
        <h2 className="text-xl font-bold mb-2">9. Contact et Support</h2>
        <p>📧 Email : <a href="mailto:support@xcannes.com" className="underline text-blue-600">support@xcannes.com</a></p>
        <p>🌐 Site officiel : <a href="https://xcannes.com" target="_blank" className="underline text-blue-600">xcannes.com</a></p>

        {/* Retour Accueil */}
        <div className="text-center mt-10">
          <Link href="/" className="inline-block bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
            ← Retour à l’accueil
          </Link>
        </div>
      </main>
    </>
  );
}
