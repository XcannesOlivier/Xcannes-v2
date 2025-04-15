"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function XrplCandleChartTest() {
  const chartRef = useRef();

  useEffect(() => {
    if (!chartRef.current) return;

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

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#16b303',
      downColor: '#e70707',
      borderVisible: false,
      wickUpColor: '#16b303',
      wickDownColor: '#e70707',
    });

    // ✅ Format de temps ISO (YYYY-MM-DD)
    candleSeries.setData([
      { time: '2024-04-01', open: 0.5, high: 0.6, low: 0.4, close: 0.55 },
      { time: '2024-04-02', open: 0.55, high: 0.57, low: 0.5, close: 0.53 },
      { time: '2024-04-03', open: 0.53, high: 0.58, low: 0.52, close: 0.56 },
    ]);

    return () => {
      chart.remove();
    };
  }, []);

  return <div ref={chartRef}></div>;
}
