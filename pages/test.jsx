import dynamic from "next/dynamic";

// ⚠️ Utilise maintenant le nouveau composant !
const BinanceStyleChart = dynamic(() => import("../components/BinanceStyleChart"), {
  ssr: false,
});

export default function TestPage() {
  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">🔥 Test Chart Live - XRP/RLUSD</h1>
      <BinanceStyleChart pair="XRP/RLUSD" />
    </div>
  );
}