"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";
import { getBookIdFromPair } from "../utils/xrpl";

const XrplLiveChart = ({ pair, streamUrl = "wss://s2.ripple.com" }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const candleSeries = useRef(null);
  const wsRef = useRef(null);

  // 📦 Initial chart + resize handling
  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#000" }, textColor: "#fff" },
      grid: { vertLines: { color: "#333" }, horzLines: { color: "#333" } },
      timeScale: { borderColor: "#555" },
      priceScale: { borderColor: "#555" },
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

  // 📦 Initial fetch data
  useEffect(() => {
    const fetchInitialData = async () => {
      const bookId = getBookIdFromPair(pair);
      if (!bookId) return;

      try {
        const res = await axios.get(
          `https://data.xrplf.org/v1/iou/ticker_data/${bookId}?interval=1h`
        );

        const parsed = res.data.map((candle) => ({
          time: Math.floor(new Date(candle.date_from).getTime() / 1000),
          open: candle.first,
          high: candle.high,
          low: candle.low,
          close: candle.last,
        }));

        if (candleSeries.current) {
          candleSeries.current.setData(parsed);
        }
      } catch (err) {
        console.error("Erreur chargement HTTP initial:", err);
      }
    };

    fetchInitialData();
  }, [pair]);

  // 🔌 WebSocket updates
  useEffect(() => {
    const book = getBookIdFromPair(pair);
    if (!book || !streamUrl || !candleSeries.current) return;

    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket ouverte pour:", pair);
      ws.send(
        JSON.stringify({
          id: `${pair}-${Date.now()}`,
          command: "subscribe",
          books: [
            {
              taker_gets: book.taker_gets,
              taker_pays: book.taker_pays,
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
        // Ici tu peux brancher des conditions sur les messages pertinents
        if (data.type === "transaction" && data.engine_result === "tesSUCCESS") {
          const time = Math.floor(Date.now() / 1000);
          const price = Math.random(); // à remplacer par data parsing réel si dispo
          const candle = {
            time,
            open: price,
            high: price + 0.1,
            low: price - 0.1,
            close: price,
          };
          candleSeries.current.update(candle);
        }
      } catch (err) {
        console.warn("⚠️ Erreur traitement message WebSocket:", err);
      }
    };

    ws.onerror = (err) => console.error("❌ WebSocket erreur:", err);
    ws.onclose = () => console.log("🔌 WebSocket fermée pour:", pair);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [pair, streamUrl]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px", border: "2px dashed red" }}></div>;
};

export default XrplLiveChart;
