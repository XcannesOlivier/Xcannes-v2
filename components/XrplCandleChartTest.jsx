"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function XrplCandleChartTest() {
  const chartRef = useRef();

  useEffect(() => {
    try {
      console.log("📦 ChartTest mounted");

      if (!chartRef.current) {
        console.error("❌ chartRef.current is null");
        return;
      }

      const chart = createChart(chartRef.current, {
        width: 800,
        height: 400,
        layout: {
          background: { color: "#ffffff" },
          textColor: "#000000",
        },
        grid: {
          vertLines: { color: "#eee" },
          horzLines: { color: "#eee" },
        },
      });

      console.log("📈 Chart created");

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#16b303',
        downColor: '#e70707',
        borderVisible: false,
        wickUpColor: '#16b303',
        wickDownColor: '#e70707',
      });
      console.log("📊 Series added");
      
      const testData = [
        { time: 1713225600, open: 0.5, high: 0.6, low: 0.4, close: 0.55 },
        { time: 1713312000, open: 0.55, high: 0.57, low: 0.5, close: 0.53 },
        { time: 1713398400, open: 0.53, high: 0.58, low: 0.52, close: 0.56 },
      ];
      candleSeries.setData(testData);
      console.log("✅ Data injected", testData);
      

      return () => {
        chart.remove();
        console.log("🧹 Chart removed");
      };
    } catch (err) {
      console.error("🔥 Fatal crash in test chart:", err);
    }
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "400px",
        border: "2px dashed red",
        marginTop: "1rem"
      }}
    ></div>
  );
}
