import Head from "next/head";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";
import Link from "next/link";
import FAQSection from "../components/FAQSection";
import TokenDistributionChart from "../components/TokenDistributionChart";
import TrustlineBlock from "../components/TrustlineBlock";
import AltPaymentBlock from "../components/AltPaymentBlock";
import CreatorWalletBlock from "../components/CreatorWalletBlock";
import LangDebug from "../components/LangDebug";
import LangueActive from "../components/LangueActive";
import VisionBlock from "../components/VisionBlock";
import BuyXCSSection from "../components/BuyXCSSection.jsx";
import NotreVisionBlock from "../components/NotreVisionBlock";

export default function Home() {
  return (
    <>
      <Head>
        <title>XCannes DEX - XCS</title>
        <meta name="description" content="DEX communautaire pour le token XCS sur le XRPL." />
      </Head>

      <Header />
      <VisionBlock />
      
      <main className="flex flex-col items-center justify-center pt-28 pb-10 px-4 text-center font-montserrat font-[300]">

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-[500] mb-6 flex items-end gap-[0.25rem] leading-tight">
  Bienvenue sur
  <div className="flex items-end gap-[0.25rem] leading-tight">
  <img
    src="/assets/img/ui/navHeadergreen.png"
    alt="Logo XCannes"
    className="
      h-[3.0rem] sm:h-[4rem] md:h-[5.5rem]

      w-auto inline-block
      relative 
      top-[0.5rem] sm:top-[0.80rem] md:top-[1.4rem]
      brightness-110 saturate-150 
      p-0
      -mr-4
    "
  />
  <span className="text-xcannes-green font-orbitron font-[500]">Cannes</span>
</div>

</h1>




        <p className="text-lg max-w-xl text-gray-300 mb-8">
          Échangez le token <strong>XCannes (XCS)</strong> directement sur le XRP Ledger. Participez, gagnez, contribuez.
        </p>


        <div className="flex flex-col md:flex-row gap-6">
          <Link href="/dex">
            <button className="bg-xcannes-green px-6 py-3 rounded-xl font-[500] text-white hover:bg-xcannes-green hover:text-white transition transform hover:scale-105">
              Accéder au DEX
            </button>
          </Link>
          <Link href="/mxga">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-[500] hover:bg-blue-700 hover:text-white transition transform hover:scale-105">
              Découvrez XCS
            </button>
          </Link>
        </div>
        




        
  
  <LangueActive />
  <CreatorWalletBlock />
  <AltPaymentBlock title="Achetez XCS avec votre moyen de paiement préféré" />
  
  
  <TrustlineBlock />

        <NotreVisionBlock />
        <TokenDistributionChart />
        <BuyXCSSection />
        <FAQSection />
      </main>

      <FooterPro />
    </>
  );
}
