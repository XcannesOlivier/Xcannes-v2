"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function XrplCandleChartTest() {
  const chartRef = useRef();

  useEffect(() => {
    let chart;

    if (!chartRef.current) return;

    chart = createChart(chartRef.current, {
      width: 800,
      height: 400,
      layout: {
        background: { color: "#fff" }, // pour bien voir sur fond clair
        textColor: "#000",
      },
      grid: {
        vertLines: { color: "#ccc" },
        horzLines: { color: "#ccc" },
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#16b303",
      downColor: "#e70707",
      borderVisible: false,
      wickUpColor: "#16b303",
      wickDownColor: "#e70707",
    });

    // 🔥 Mock data 100% visible
    candleSeries.setData([
      { time: 1713180000, open: 0.5, high: 0.6, low: 0.4, close: 0.55 },
      { time: 1713180600, open: 0.55, high: 0.57, low: 0.5, close: 0.53 },
      { time: 1713181200, open: 0.53, high: 0.58, low: 0.52, close: 0.56 },
    ]);

    return () => {
      if (chart) chart.remove();
    };
  }, []);

  return <div ref={chartRef}></div>;
}
