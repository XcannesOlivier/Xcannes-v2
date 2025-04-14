import Head from "next/head";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";
import SlotMachineFinal from "../components/SlotMachineFinal";
import Roulette from "../components/roulette"; // ← à adapter selon ton arbo

export default function Games() {
  return (
    <>
      <Head>
        <title>XCannes Games</title>
      </Head>

      <Header />

      <main className="px-4 pt-28 pb-20 font-montserrat text-white min-h-screen bg-black">
        <h1 className="text-4xl font-orbitron font-[500] text-center text-xcannes-green mb-4">
          🎮 XCannes Games
        </h1>

        <p className="text-sm text-white/70 text-center mb-10 max-w-md mx-auto">
          Jeux communautaires Web3, animations & plaisir garanti — sur le XRPL, sans prise de tête.
        </p>

        {/* 🎰 Slot Machine intégrée directement ici */}
        <div className="mb-20">
          <SlotMachineFinal />
        </div>

        {/* 🎡 Roulette intégrée */}
        <div className="mb-20">
          <Roulette />
        </div>

        
      </main>

      <FooterPro />
    </>
  );
}
