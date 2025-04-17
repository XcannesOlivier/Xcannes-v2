"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";
import { getBookIdFromPair } from "../utils/xrpl";

export default function XrplCandleChartRaw({ pair = "XCS/XRP", interval = "1m" }) {
  const chartRef = useRef();
  const candleSeriesRef = useRef(null);
  const lastCandleRef = useRef(null);
  const timeScaleRef = useRef(null); // ✅ Pour contrôler le zoom depuis un bouton


  useEffect(() => {
    let chart;
    let socket;

    const bookId = getBookIdFromPair(pair);

    if (!bookId || !bookId.url) {
      console.warn("❌ Paire inconnue dans getBookIdFromPair:", pair);
      return;
    }

    const PAIR_ID = bookId.url;

    const loadInitialData = async () => {
      try {
        const getLimitFromInterval = (interval) => {
          switch (interval) {
            case "1m": return 500;    // ~8h20 de données
            case "5m": return 500;    // ~1 jour 17h
            case "1h": return 500;    // ~20 jours
            case "1d": return 200;    // ~6 mois
            case "1w": return 60;     // ~1 an
            case "1M": return 36;     // ~3 ans
            case "1Y": return 10;     // ~10 ans
            case "all": return 1000;  // full historique dispo
            default: return 200;      // fallback
          }
        };
        
        const limit = getLimitFromInterval(interval);

        const res = await axios.get(
          `https://data.xrplf.org/v1/iou/exchanges/${PAIR_ID}?interval=${interval}&limit=${limit}`
        );
        
        let data = res.data.map((item) => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        if (!data.length) {
          data = [
            { time: 1713312000, open: 0.5, high: 0.6, low: 0.4, close: 0.55 },
            { time: 1713315600, open: 0.55, high: 0.57, low: 0.5, close: 0.53 },
          ];
        }

        lastCandleRef.current = data[data.length - 1];

        chart = createChart(chartRef.current, {
          width: chartRef.current.clientWidth,
          height: 400,
          layout: { background: { color: "#000" }, textColor: "#fff" },
          grid: {
            vertLines: { color: "#2B2B43" },
            horzLines: { color: "#363C4E" },
          },
          timeScale: {
            borderColor: "#485c7b",
            timeVisible: true, // ✅ Affiche la date & l'heure sur l'axe horizontal
            secondsVisible: interval === "1m", // ✅ Affiche les secondes uniquement si interval = "1m"
          },
          priceScale: { borderColor: "#485c7b" },
        });
        
        // ✅ On stocke le timeScale dans le ref pour le bouton Reset Zoom
        timeScaleRef.current = chart.timeScale();
        
        
        candleSeriesRef.current = chart.addCandlestickSeries({
          upColor: "#16b303",
          downColor: "#e70707",
          borderVisible: false,
          wickUpColor: "#16b303",
          wickDownColor: "#e70707",
        });

        candleSeriesRef.current.setData(data);

        // 🔍 Zoom glissant sur les 30 derniers jours
        if (data.length > 0) {
          const lastCandle = data[data.length - 1];
          const lastTime = lastCandle.time;
          const thirtyDaysAgo = lastTime - 2592000;

          chart.timeScale().setVisibleRange({
            from: thirtyDaysAgo,
            to: lastTime,
          });
        }

        const observer = new ResizeObserver(() => {
          chart.applyOptions({ width: chartRef.current.clientWidth });
        });
        observer.observe(chartRef.current);

        setupWebSocket();

        return () => {
          observer.disconnect();
          chart.remove();
          if (socket) socket.close();
        };
      } catch (err) {
        console.error("❌ Erreur fetch initial XRPL:", err);
      }
    };

    const setupWebSocket = () => {
      socket = new WebSocket("wss://s1.ripple.com");

      socket.onopen = () => {
        console.log("✅ WebSocket connecté XRPL");
        socket.send(
          JSON.stringify({
            id: 1,
            command: "subscribe",
            streams: ["transactions"],
          })
        );
      };

      socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type !== "transaction" || !data.transaction) return;

        const tx = data.transaction;
        if (tx.TransactionType !== "OfferCreate") return;

        const now = Math.floor(Date.now() / 1000);
        const bucketTime = now - (now % 60);

        const takerGets = parseFloat(tx.TakerGets?.value || tx.TakerGets || 0);
        const takerPays = parseFloat(tx.TakerPays?.value || tx.TakerPays || 0);
        if (!takerGets || !takerPays || isNaN(takerGets) || isNaN(takerPays)) return;

        const price = takerGets / takerPays;

        let last = lastCandleRef.current;

        if (!last || last.time !== bucketTime) {
          const newCandle = {
            time: bucketTime,
            open: price,
            high: price,
            low: price,
            close: price,
          };
          candleSeriesRef.current.update(newCandle);
          lastCandleRef.current = newCandle;
        } else {
          last.high = Math.max(last.high, price);
          last.low = Math.min(last.low, price);
          last.close = price;
          candleSeriesRef.current.update(last);
        }
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
      };
    };

    loadInitialData();
  }, [pair, interval]);

  return (
    <div
      ref={chartRef}
      style={{
        height: "400px",
        backgroundColor: "#000",
        border: "1px solid #444",
        borderRadius: "10px",
        marginTop: "1rem",
      }}
    />
  );
}
<div className="mt-2 text-right">
  <button
    onClick={() => {
      if (timeScaleRef.current) {
        timeScaleRef.current.fitContent(); // ✅ Reset auto
      }
    }}
    className="bg-xcannes-green text-black px-4 py-2 rounded text-sm hover:bg-green-400 transition"
  >
    🔄 Reset Zoom
  </button>
</div>

