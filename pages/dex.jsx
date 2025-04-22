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
import XummConnectButton from "../components/XummConnectButton";
import { useXumm } from "../context/XummContext";
import TrustlineDex from "../components/TrustlineDex";


// 📈 Chart dynamique sans SSR
const XrplCandleChartRaw = dynamic(() => import("../components/MegaChartUltimate"), {
  ssr: false,
});


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
      <Head>
        <title>DEX - XCannes</title>
      </Head>

      <Header />

      <main
        className="relative w-full min-h-screen text-white pt-28 pb-0 mb-0 bg-cover bg-center bg-no-repeat bg-fixed font-montserrat font-[300]"
        style={{ backgroundColor: "#202320" }}
      >
        <div className="absolute inset-0 bg-black/0 z-0" />

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl font-orbitron font-[500] text-xcannes-green mb-6">XCannes DEX</h1>

          {/* 🎯 Sélecteurs */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div>
              <label className="mr-2 font-[500]">Choisir une paire :</label>
              <select
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
                className="bg-black/80 border border-white border-opacity-40 px-4 py-2 rounded text-white"
              >
                {PAIRS.map((pair) => (
                  <option key={pair} value={pair}>
                    {pair}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mr-2 font-[500]">Timeframe :</label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="bg-black/80 border border-white border-opacity-40 px-4 py-2 rounded text-white"
              >
                {["30s","1m", "5m", "15m","1h", "4h", "1d", "1M", "1y"].map((int) => (
                  <option key={int} value={int}>
                    {int}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ Graphique */}
          <XrplCandleChartRaw
            key={`${selectedPair}-${interval}`}
            pair={selectedPair}
            interval={interval}
          />

<div className="grid md:grid-cols-[2fr_1fr] gap-6 mt-5 items-start">
  <TradeBox pair={selectedPair} />
  <div className="space-y-6">
    <AltPaymentBlock isDex={isDex} />
    <TrustlineDex />
  </div>
</div>


          <TradeHistory pair={selectedPair} />
          <OrderBook pair={selectedPair} />

          <div className="my-12 text-center">
            <XummConnectButton />
            {isConnected && (
              <p className="text-xs text-green-400 mt-2 break-all">
                🔗 Wallet connecté : {wallet}
              </p>
            )}
          </div>
        </div>

        <FooterPro />
      </main>
    </>
  );
}
