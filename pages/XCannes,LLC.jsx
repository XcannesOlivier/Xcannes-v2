import Head from "next/head";
import Link from "next/link";

export default function LegalInfo() {
  return (
    <>
      <Head>
        <title>Informations Légales - XCANNES LLC</title>
      </Head>

      <main className="max-w-4xl mx-auto px-6 py-16 text-white bg-black/20 rounded-lg shadow-lg font-montserrat font-[300] relative">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-orbitron text-xcannes-green font-[600]">📄 Informations Légales – XCANNES LLC</h1>
          <p className="text-sm text-gray-400 mt-2">
            Transparence & conformité pour un Web3 crédible et responsable
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-xl text-xcannes-green font-medium mb-2">📌 Identité de l'entité</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><strong>Nom :</strong> XCANNES LLC</li>
            <li><strong>Statut :</strong> Limited Liability Company (LLC)</li>
            <li><strong>État d'enregistrement :</strong> Delaware, USA</li>
            <li><strong>Numéro de dossier (File Number) :</strong> 10157026</li>
            <li><strong>Date d'incorporation :</strong> 08 avril 2025</li>
            <li><strong>Numéro EIN (IRS) :</strong> 38-4351623</li>
          </ul>
          <p className="text-xs text-gray-400 mt-2">
            📎 <a href="/assets/docs/XCannesLLC_EIN_IRS.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-xcannes-green">Voir le document officiel (EIN PDF)</a>
          </p>
          <p className="text-xs text-gray-400">
            🔗 <a href="https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx" target="_blank" rel="noopener noreferrer" className="underline hover:text-xcannes-green">Consulter l’enregistrement sur le registre du Delaware</a>
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl text-xcannes-green font-medium mb-2">📫 Contact & Communication</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Email officiel : <a href="mailto:xcannesdao@gmail.com" className="underline hover:text-xcannes-green">xcannesdao@gmail.com</a></li>
            <li>Agent enregistré : Legalinc Corporate Services Inc., Newark, DE</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl text-xcannes-green font-medium mb-2">⚖️ Mention de conformité</h2>
          <p className="text-sm">
            XCANNES LLC est une entité indépendante construite sur le registre public XRP Ledger (XRPL). Elle n’est affiliée ni à Ripple Labs Inc., ni à l’équipe fondatrice du XRPL. Aucune promesse de rendement n’est associée au jeton XCS.
          </p>
          <p className="text-sm mt-2">
            Le projet respecte les standards de conformité en vigueur (KYC, AML) et ne propose aucun produit financier réglementé.
          </p>
        </section>

        <div className="flex justify-center mt-12">
          <Link href="/" className="px-6 py-2 rounded-full font-[500] bg-xcannes-green text-white hover:bg-lime-500 transition transform hover:scale-105 shadow">
            ⬅️ Retour à l'accueil
          </Link>
        </div>
      </main>
    </>
  );
}
