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

  // 🔄 Convertisseur à adapter selon structure des messages XRPL
  const convertXrplToCandle = (data) => {
    // TODO : adapter ça selon la vraie structure
    return {
      time: Math.floor(Date.now() / 1000), // timestamp UNIX secondes
      open: parseFloat(data.open || 0),
      high: parseFloat(data.high || 0),
      low: parseFloat(data.low || 0),
      close: parseFloat(data.close || 0),
    };
  };

  useEffect(() => {
    if (!pair || !streamUrl || !candleSeries.current) return;

    console.log("📡 Connecting WebSocket for:", pair);
    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        console.log("📩 Message reçu :", data);
        const candle = convertXrplToCandle(data);
        candleSeries.current.update(candle);
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

export default XrplLiveChart;
