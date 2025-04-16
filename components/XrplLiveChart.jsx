// 📦 Fichier : components/XrplLiveChart.jsx

"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl"; // 🔁 utilitaire pour convertir la paire

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
    const bookId = getBookIdFromPair(pair);
    if (!bookId || !streamUrl || !candleSeries.current) return;

    console.log("📡 Connecting WebSocket for:", pair);
    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ WebSocket ouverte pour:", pair);
    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket fermée pour:", pair);

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        console.log("📩 Message reçu:", data);

        const candle = {
          time: Math.floor(Date.now() / 1000),
          open: parseFloat(data.open),
          high: parseFloat(data.high),
          low: parseFloat(data.low),
          close: parseFloat(data.close),
        };

        if (candle.open && candle.high && candle.low && candle.close) {
          candleSeries.current.update(candle);
        }
      } catch (e) {
        console.warn("⚠️ Erreur WebSocket message:", e);
      }
    };

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

export default XrplLiveChart;
