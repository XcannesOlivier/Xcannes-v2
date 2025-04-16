"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const XrplLiveChart = ({ pair, streamUrl }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const candleSeries = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#000" },
        textColor: "#fff",
      },
      grid: {
        vertLines: { color: "#333" },
        horzLines: { color: "#333" },
      },
      timeScale: {
        borderColor: "#555",
      },
      priceScale: {
        borderColor: "#555",
      },
    });

    chartInstance.current = chart;

    candleSeries.current = chart.addCandlestickSeries({
      upColor: "#16b303",
      downColor: "#e70707",
      borderVisible: false,
      wickUpColor: "#16b303",
      wickDownColor: "#e70707",
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      chart.remove();
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!pair || !streamUrl || !candleSeries.current) return;

    console.log("📡 Connecting WebSocket for:", pair);
    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        console.log("📩 Message reçu :", data); // 👈 ICI
        const candle = convertXrplToCandle(data); // 💡 à implémenter ci-dessous
        if (candle) {
          candleSeries.current.update(candle);
        }
      } catch (e) {
        console.warn("⚠️ Erreur WebSocket message:", e);
      }
    };

    ws.onopen = () => console.log("✅ WebSocket ouverte pour:", pair);
    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket fermée pour:", pair);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [pair, streamUrl]);

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", height: "400px", border: "2px dashed red" }}
    ></div>
  );
};

// 🧠 Fonction temporaire de transformation XRPL → bougie (à adapter après console.log)
function convertXrplToCandle(data) {
  // 👉 Juste un exemple placeholder — à remplacer après avoir vu les logs
  if (data && data.open && data.high && data.low && data.close) {
    return {
      time: Math.floor(Date.now() / 1000),
      open: parseFloat(data.open),
      high: parseFloat(data.high),
      low: parseFloat(data.low),
      close: parseFloat(data.close),
    };
  }
  return null;
}

export default XrplLiveChart;
