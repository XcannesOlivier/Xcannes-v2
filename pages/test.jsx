import dynamic from "next/dynamic";

const XrplLiveChart = dynamic(() => import("../components/XrplLiveChart"), {
  ssr: false,
});

export default function TestPage() {
  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">🔥 Test Chart Live - XRP/RLUSD</h1>
      <XrplLiveChart />
    </div>
  );
}

