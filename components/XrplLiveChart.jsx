"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const PAIR_TO_BOOKID = {
  "XCS/XRP": {
    taker_gets: { currency: "XCS", issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx" },
    taker_pays: { currency: "XRP" },
  },
  "XCS/USD": {
    taker_gets: { currency: "XCS", issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx" },
    taker_pays: { currency: "USD", issuer: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq" },
  },
  "XCS/EUR": {
    taker_gets: { currency: "XCS", issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx" },
    taker_pays: { currency: "EUR", issuer: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq" },
  },
  "XCS/RLUSD": {
    taker_gets: { currency: "XCS", issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx" },
    taker_pays: {
      currency: "524C555344000000000000000000000000000000",
      issuer: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
    },
  },
  "XRP/RLUSD": {
    taker_gets: { currency: "XRP" },
    taker_pays: {
      currency: "524C555344000000000000000000000000000000",
      issuer: "rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De",
    },
  },
};

const XrplLiveChart = ({ pair = "XRP/RLUSD", streamUrl = "wss://s2.ripple.com" }) => {
  const chartRef = useRef();
  const chartInstance = useRef(null);
  const candleSeries = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Init Chart
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

  useEffect(() => {
    if (!pair || !streamUrl || !candleSeries.current) return;
    const book = PAIR_TO_BOOKID[pair];
    if (!book) return;

    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => {
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
        if (data.type === "transaction" && data.engine_result === "tesSUCCESS") {
          const time = Math.floor(Date.now() / 1000);
          const candle = {
            time,
            open: Math.random(),
            high: Math.random() + 0.5,
            low: Math.random() - 0.5,
            close: Math.random(),
          };
          candleSeries.current.update(candle);
        }
      } catch (e) {
        console.warn("⚠️ Erreur WebSocket:", e);
      }
    };

    ws.onerror = (err) => console.error("❌ WebSocket error:", err);
    ws.onclose = () => console.log("🔌 WebSocket fermée pour:", pair);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [pair, streamUrl]);

  return <div ref={chartRef} style={{ width: "100%", height: "400px", border: "2px dashed red" }}></div>;
};

export default XrplLiveChart;
