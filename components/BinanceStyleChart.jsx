"use client"

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useWebSocket } from "../hooks/useWebSocket"; // import du hook WebSocket
import { useMarketData } from "../hooks/useMarketData"; // import du hook de données de marché

const BinanceStyleChart = ({ pair = "XRP/RLUSD", streamUrl = "wss://s2.ripple.com" }) => {
  const chartRef = useRef();
  const candleSeries = useRef(null);
  const [dernierPrix, setDernierPrix] = useState("Chargement...");
  const [volume, setVolume] = useState("Chargement...");

  const marketData = useMarketData(pair); // utilisation du hook pour récupérer les données du marché

  // Callback pour gérer les messages WebSocket
  const handleWebSocketMessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      if (data.type === "transaction" && data.engine_result === "tesSUCCESS") {
        const price = parseFloat(data.price);
        const candle = {
          time: Math.floor(Date.now() / 1000),
          open: price,
          high: price + Math.random() * 0.5,
          low: price - Math.random() * 0.5,
          close: price + (Math.random() > 0.5 ? 0.2 : -0.2),
        };
        candleSeries.current.update(candle);
        setDernierPrix(price.toFixed(6)); // Mise à jour du prix
        setVolume(data.volume_token1_24h || "Chargement..."); // Mise à jour du volume
      }
    } catch (err) {
      console.warn("⚠️ Erreur dans le flux WebSocket :", err);
    }
  };

  // Utilisation du hook WebSocket
  useWebSocket(streamUrl, handleWebSocketMessage);

  useEffect(() => {
    if (!chartRef.current) return;

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

    candleSeries.current = chart.addCandlestickSeries({
      upColor: "#16b303",
      downColor: "#e70707",
      borderVisible: false,
      wickUpColor: "#16b303",
      wickDownColor: "#e70707",
    });

    return () => {
      chart.remove();
    };
  }, []);

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", height: "400px", border: "2px dashed red" }}></div>

      {/* Affichage du prix et volume en temps réel */}
      <div>
        <strong>Dernier prix :</strong> {dernierPrix}
      </div>
      <div>
        <strong>Volume 24h :</strong> {volume}
      </div>
    </div>
  );
};

export default BinanceStyleChart;
