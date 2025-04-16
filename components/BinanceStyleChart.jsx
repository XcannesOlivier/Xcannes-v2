"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";

const BinanceStyleChart = ({ pair = "XRP/RLUSD", streamUrl = "wss://s2.ripple.com" }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const candleSeries = useRef(null);
  const wsRef = useRef(null);

  // Initialisation du graphique (une seule fois)
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

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    });

    resizeObserver.observe(chartRef.current);

    return () => {
      chart.remove();
      resizeObserver.disconnect();
    };
  }, []);

  // Mise à jour du graphique à chaque changement de paire
  useEffect(() => {
    if (!pair || !streamUrl || !chartInstance.current) return;

    console.log("🔁 Nouvelle paire sélectionnée :", pair);

    const bookId = getBookIdFromPair(pair);
    if (!bookId) {
      console.warn("❌ Paire non supportée :", pair);
      return;
    }

    if (candleSeries.current) {
      chartInstance.current.removeSeries(candleSeries.current);
    }

    candleSeries.current = chartInstance.current.addCandlestickSeries({
      upColor: "#16b303",
      downColor: "#e70707",
      borderVisible: false,
      wickUpColor: "#16b303",
      wickDownColor: "#e70707",
    });

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
          streams: ["transactions"],
        })
      );
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        if (data.type === "transaction" && data.transaction.TransactionType === "OfferCreate") {
          const tx = data.transaction;

          const gets = tx.TakerGets;
          const pays = tx.TakerPays;

          const isIOU = typeof gets === "object" && typeof pays === "object";

          let price = null;
          if (isIOU) {
            // IOU / IOU ou IOU / XRP (inverse)
            const valueGets = parseFloat(gets.value);
            const valuePays = parseFloat(pays.value);
            if (valueGets && valuePays) {
              price = valuePays / valueGets;
            }
          } else if (typeof gets === "string" && typeof pays === "object") {
            // XRP / IOU (XRP exprimé en drops)
            price = parseFloat(pays.value) / (parseFloat(gets) / 1000000);
          } else if (typeof pays === "string" && typeof gets === "object") {
            // IOU / XRP
            price = (parseFloat(pays) / 1000000) / parseFloat(gets.value);
          }

          if (price) {
            const now = Math.floor(Date.now() / 1000);
            const candle = {
              time: now,
              open: price,
              high: price,
              low: price,
              close: price,
            };
            candleSeries.current.update(candle);
          }
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
    <div
      ref={chartRef}
      style={{ width: "100%", height: "400px", border: "2px dashed red" }}
    ></div>
  );
};

export default BinanceStyleChart;
