import { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/router";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";
import OrderBook from "../components/OrderBook";
import TradeHistory from "../components/TradeHistory";
import AltPaymentBlock from "../components/AltPaymentBlock";
import TradeBox from "../components/TradeBox";
import XummConnectButton from "../components/XummConnectButton";
import { useXumm } from "../context/XummContext";
import { BinanceStyleChart } from "../components/BinanceStyleChart";

// 🟢 Composant Binance Style Chart
const BinanceStyleChart = dynamic(() => import("../components/BinanceStyleChart"), { ssr: false });

const PAIRS = {
  "XCS/XRP": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/XRP",
  "XCS/USD": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_USD",
  "XCS/EUR": "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx_XCS/rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq_EUR",
  "XCS/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
  "XRP/RLUSD": "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000",
};

export default function Dex() {
  const router = useRouter();
  const isDex = router.pathname === "/dex";
  const [selectedPair, setSelectedPair] = useState("XRP/RLUSD");
  const [marketData, setMarketData] = useState(null);
  const { wallet, isConnected } = useXumm();

  const fetchData = async () => {
    try {
      const res = await axios.get(
        'https://data.xrplf.org/v1/iou/market_data/${PAIRS[selectedPair]}?interval='
      );
      setMarketData(res.data);
    } catch (err) {
      console.error("Erreur fetch market data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPair]);

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

          <div className="mb-4">
            <label className="mr-2 font-[500]">Choisir une paire :</label>
            <select
              value={selectedPair}
              onChange={(e) => setSelectedPair(e.target.value)}
              className="bg-black/80 border border-white border-opacity-40 px-4 py-2 rounded text-white"
            >
              {Object.keys(PAIRS).map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>

          {marketData ? (
            <div className="bg-black/60 p-4 rounded border border-xcannes-green mb-8">
              <p>
                <strong>Dernier prix :</strong> {marketData?.last_price?.toFixed(6)}
              </p>
              <p>
                <strong>Variation 24h :</strong> {marketData?.change_percent_24h?.toFixed(2)}%
              </p>
              <p>
                <strong>Volume 24h :</strong> {marketData?.volume_token1_24h?.toLocaleString()} XCS
              </p>
            </div>
          ) : (
            <p className="text-gray-400 mb-8">Chargement des données...</p>
          )}

          {/* ✅ Affichage du chart façon Binance */}
          <BinanceStyleChart pair={selectedPair} streamUrl="wss://s2.ripple.com" />

          <div className="grid md:grid-cols-[2fr_1fr] gap-6 mt-5 items-start">
            <TradeBox pair={selectedPair} />
            <AltPaymentBlock isDex={isDex} />
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