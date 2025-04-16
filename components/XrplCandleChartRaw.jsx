"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";

const PAIR_ID = "XRP/rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De_524C555344000000000000000000000000000000"; // XCS/RLUSD

export default function XrplCandleChartRaw() {
  const chartRef = useRef();
  const candleSeriesRef = useRef(null);
  const lastCandleRef = useRef(null);

  useEffect(() => {
    let chart;
    let socket;

    const loadInitialData = async () => {
      try {
        const res = await axios.get(
          https://data.xrplf.org/v1/iou/exchanges/${PAIR_ID}?interval=1m&limit=100
        );

        let data = res.data.map(item => ({
          time: Math.floor(new Date(item.executed_time).getTime() / 1000),
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
        }));

        // fallback mock si vide
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
          timeScale: { borderColor: "#485c7b" },
          priceScale: { borderColor: "#485c7b" },
        });

        candleSeriesRef.current = chart.addCandlestickSeries({
          upColor: '#16b303',
          downColor: '#e70707',
          borderVisible: false,
          wickUpColor: '#16b303',
          wickDownColor: '#e70707',
        });

        candleSeriesRef.current.setData(data);

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
        console.log("✅ XRPL WebSocket connecté");
        socket.send(JSON.stringify({
          id: 1,
          command: "subscribe",
          streams: ["transactions"]
        }));
      };

      socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type !== "transaction" || !data.transaction) return;

        const tx = data.transaction;
        if (tx.TransactionType !== "OfferCreate") return;

        // On simule que ça concerne notre paire ici (à affiner si besoin)
        const now = Math.floor(Date.now() / 1000);
        const bucketTime = now - (now % 60);

        const price = parseFloat(tx.TakerGets?.value || tx.TakerGets || 0) / parseFloat(tx.TakerPays?.value || tx.TakerPays || 1);
        if (!price || isNaN(price)) return;

        let last = lastCandleRef.current;

        // Nouvelle bougie
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
          // Mise à jour de la dernière
          last.high = Math.max(last.high, price);
          last.low = Math.min(last.low, price);
          last.close = price;
          candleSeriesRef.current.update(last);
        }
      };

      socket.onerror = err => {
        console.error("❌ WebSocket error:", err);
      };
    };

    loadInitialData();
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        height: "400px",
        backgroundColor: "#000",
        border: "1px solid #444",
        borderRadius: "10px",
        marginTop: "1rem"
      }}
    />
  );
}