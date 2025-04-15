"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function XrplCandleChartTest() {
  const chartRef = useRef();

  useEffect(() => {
    try {
      if (!chartRef.current) return;

      const chart = createChart(chartRef.current, {
        width: 800,
        height: 400,
        layout: {
          background: { color: "#fff" },
          textColor: "#000",
        },
        grid: {
          vertLines: { color: "#ccc" },
          horzLines: { color: "#ccc" },
        },
      });

      const series = chart.addCandlestickSeries({
        upColor: '#0f0',
        downColor: '#f00',
        borderVisible: false,
        wickUpColor: '#0f0',
        wickDownColor: '#f00',
      });

      series.setData([
        { time: 1713180000, open: 0.5, high: 0.6, low: 0.4, close: 0.55 },
        { time: 1713180600, open: 0.55, high: 0.57, low: 0.5, close: 0.53 },
        { time: 1713181200, open: 0.53, high: 0.58, low: 0.52, close: 0.56 },
      ]);
    } catch (err) {
      console.error("🔥 Crash chart test :", err);
    }
  }, []);

  return <div ref={chartRef}></div>;
}
