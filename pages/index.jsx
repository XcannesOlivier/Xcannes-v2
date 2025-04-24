import Head from "next/head";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";
import Link from "next/link";
import FAQSection from "../components/FAQSection";
import TokenDistributionChart from "../components/TokenDistributionChart";
import TrustlineBlock from "../components/TrustlineBlock";
import AltPaymentBlock from "../components/AltPaymentBlock";
import CreatorWalletBlock from "../components/CreatorWalletBlock";
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
      
      <main className="flex flex-col items-center justify-center pt-18 sm:pt-5 md:pt-5 pb-5 px-4 text-center font-montserrat font-[300]">
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-orbitron font-[500] -mt-[3rem] sm:-mt-[3rem]  md:-mt-[5rem]  flex items-center justify-center flex-wrap text-white ">
  Bienvenue sur
  <span className="flex items-center -ml-3 -mt-12 sm:mt-0">
    <img
      src="/assets/img/ui/xcannesgreen.png"
      alt="Logo X"
      className="h-[12.5rem] sm:h-[16.2rem] md:h-[19rem] w-auto brightness-110 saturate-150 sm:-mt-[3rem] md:-mt-[2rem] -mt-[3rem] relative"
    />
  </span>
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
