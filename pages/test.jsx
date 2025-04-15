import dynamic from "next/dynamic";
const ChartTest = dynamic(() => import("../components/XrplCandleChartTest"), { ssr: false });

export default function TestPage() {
  return (
    <div>
      <h1>Test Chart XCS/RLUSD</h1>
      <ChartTest />
    </div>
  );
}
