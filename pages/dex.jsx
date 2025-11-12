"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";
import OrderBook from "../components/OrderBook";
import TradeHistory from "../components/TradeHistory";
import AltPaymentBlock from "../components/AltPaymentBlock";
import TradeBox from "../components/TradeBox";
import { useXumm } from "../context/XummContext";
import TrustlineDex from "../components/TrustlineDex";
import SEOHead from "../components/SEOHead";
import PriceTicker from "../components/PriceTicker";

// 📈 Chart dynamique sans SSR
const XrplCandleChartRaw = dynamic(
  () => import("../components/XrplCandleChartRaw").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white/60 text-sm">Chargement du graphique...</p>
          </div>
        </div>
      </div>
    ),
  }
);

// 🎯 Liste des paires disponibles (clefs utilisées dans getBookIdFromPair)
const PAIRS = ["XCS/XRP", "XCS/USD", "XCS/EUR", "XCS/RLUSD", "XRP/RLUSD"];

export default function Dex() {
  const router = useRouter();
  const isDex = router.pathname === "/dex";

  const [selectedPair, setSelectedPair] = useState("XRP/RLUSD");
  const [interval, setInterval] = useState("1d");
  const { wallet, isConnected } = useXumm();

  return (
    <>
      <SEOHead
        title="DEX XCannes - Échange crypto instantané"
        description="Plateforme d'échange décentralisée pour XCS. Trading en temps réel sur XRPL avec paires XCS/XRP, XCS/USD, XCS/EUR."
        canonical="/dex"
      />

      <Header />

      <PriceTicker pairs={PAIRS} fixed={true} />

      <main className="relative w-full min-h-screen text-white pt-36 pb-0 mb-0 bg-cover bg-center bg-no-repeat bg-fixed font-montserrat font-[300] bg-xcannes-background">
        <div className="absolute inset-0 bg-black/0 z-0" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-orbitron font-[500] text-xcannes-green mb-6">
            Trading
          </h1>

          {/* ✅ Graphique avec sélecteurs intégrés */}
          <XrplCandleChartRaw
            key={`${selectedPair}-${interval}`}
            pair={selectedPair}
            interval={interval}
            onPairChange={setSelectedPair}
            onIntervalChange={setInterval}
            availablePairs={PAIRS}
          />

          <div className="grid md:grid-cols-[1fr_1fr] gap-6 mt-0  mb-5 items-start">
            <TradeBox pair={selectedPair} />
            <AltPaymentBlock isDex={isDex} />
          </div>

          <TrustlineDex />
          <OrderBook pair={selectedPair} />
          <TradeHistory pair={selectedPair} />

          {isConnected && (
            <div className="my-12 text-center">
              <p className="text-xs text-green-400 break-all">
                🔗 Wallet connecté : {wallet}
              </p>
            </div>
          )}
        </div>
      </main>

      <FooterPro />
    </>
  );
}
