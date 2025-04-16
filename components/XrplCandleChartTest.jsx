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

      // 📥 Charger les données mock depuis un fichier
      fetch("/mock-data/mock-candles.json")
        .then(res => res.json())
        .then(data => {
          console.log("✅ Data loaded from mock-candles.json:", data);
          candleSeries.setData(data);
        })
        .catch(err => {
          console.error("❌ Failed to load mock data:", err);
        });

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