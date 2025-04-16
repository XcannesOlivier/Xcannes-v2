"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";

const BinanceStyleChart = ({ pair = "XRP/RLUSD", streamUrl = "wss://s2.ripple.com" }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const candleSeries = useRef(null);
  const wsRef = useRef(null);
  
  const [lastPrice, setLastPrice] = useState(null);
  const [volume, setVolume] = useState(0);

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

    console.log("🔁 Nouvelle paire sélectionnée :", pair);

    const bookId = getBookIdFromPair(pair);
    if (!bookId) {
      console.warn("❌ Paire non supportée :", pair);
      return;
    }

    // Ferme ancienne connexion WebSocket si besoin
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("🟢 WebSocket ouverte pour :", pair);
      ws.send(
        JSON.stringify({
          id: `${pair}-${Date.now()}`,
          command: "subscribe",
          books: [
            {
              taker_gets: bookId.taker_gets,
              taker_pays: bookId.taker_pays,
              both: false,
              snapshot: true,
              depth: 1,
            },
          ],
        })
      );
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        if (data.type === "transaction" && data.engine_result === "tesSUCCESS") {
          const price = Math.random() * 2;  // Simule un prix réel (cela devra être remplacé par le prix réel de la transaction)
          const candle = {
            time: Math.floor(Date.now() / 1000),
            open: price,
            high: price + Math.random() * 0.5,
            low: price - Math.random() * 0.5,
            close: price + (Math.random() > 0.5 ? 0.2 : -0.2),
          };
          candleSeries.current.update(candle);

          // Mettez à jour le dernier prix et le volume
          setLastPrice(price);
          setVolume(data.taker_gets.value);
        }
      } catch (err) {
        console.warn("⚠️ Erreur dans le flux WebSocket :", err);
      }
    };

    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket fermée pour :", pair);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [pair, streamUrl]);

  return (
    <div>
      <div ref={chartRef} style={{ width: "100%", height: "400px", border: "2px dashed red" }}></div>
      <div className="text-white mt-4">
        <p><strong>Dernier prix :</strong> {lastPrice ? lastPrice.toFixed(6) : "Chargement..."}</p>
        <p><strong>Volume :</strong> {volume ? volume.toLocaleString() : "Chargement..."}</p>
      </div>
    </div>
  );
};

export default BinanceStyleChart;
