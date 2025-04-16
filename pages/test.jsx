import dynamic from "next/dynamic";
import Head from "next/head";

// Important : désactiver SSR pour les graphiques interactifs
const XrplLiveChart = dynamic(() => import("../components/XrplLiveChart"), { ssr: false });

export default function TestPage() {
  return (
    <>
      <Head>
        <title>Test Chart Live - XRPL</title>
      </Head>

      <div className="p-6 min-h-screen bg-black text-white">
        <h1 className="text-2xl mb-4">🔥 Test Chart Live - XRPL</h1>

        {/* ✅ Composant live WebSocket pour XCS/RLUSD */}
        <XrplLiveChart pair="XCS/RLUSD" streamUrl="wss://s2.ripple.com" />
      </div>
    </>
  );
}
