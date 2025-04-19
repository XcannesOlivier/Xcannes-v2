"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";

export default function XrplCandleChartRaw({ pair = "XCS/XRP", interval = "1m" }) {
  const chartRef = useRef();
  const candleSeriesRef = useRef(null);
  const timeScaleRef = useRef(null);

  const intervalMap = {
    "30s": 30,
    "1m": 60,
    "5m": 300,
    "15m": 900,
    "1h": 3600,
    "4h": 14400,
    "1d": 86400,
    "1M": 2628000,
    "1y": 31536000,
  };

  // 👇 Fonction pour calculer start/end selon l'interval
  const getStartEndTimestamps = (interval) => {
    const now = new Date();

    const defaultCandleCount = {
      "30s": 60,   // 30 minutes
      "1m": 60,    // 1h
      "5m": 72,    // 6h
      "15m": 48,   // 12h
      "1h": 24,    // 1 jour
      "4h": 18,    // 3 jours
      "1d": 30,    // 1 mois
      "1M": 6,     // 6 mois
      "1y": 12     // 12 ans (symbolique)
    };

    const candleCount = defaultCandleCount[interval] || 60;
    const secondsPerCandle = intervalMap[interval] || 60;
    const durationMs = candleCount * secondsPerCandle * 1000;

    const start = new Date(now.getTime() - durationMs);
    return {
      start: start.toISOString(),
      end: now.toISOString(),
    };
  };

  const fetchMarketData = async () => {
    try {
      const book = getBookIdFromPair(pair);
      if (!book?.url) return [];

      const { start, end } = getStartEndTimestamps(interval); // 🔥 intégration ici

      const url = `https://data.xrplf.org/v1/iou/market_data/${book.url}?interval=${interval}&start=${start}&end=${end}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      // On transforme les données XRPL vers le format Lightweight Charts
      return json.map((candle) => ({
        time: Math.floor(new Date(candle.timestamp).getTime() / 1000),
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));
    } catch (err) {
      console.error("❌ Erreur fetch bougies XRPL:", err);
      return [];
    }
  };

  useEffect(() => {
    let chart;
    let observer;

    const setupChart = async () => {
      const data = await fetchMarketData();
      if (!data.length) return;

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
          timeVisible: true,
        },
        priceScale: {
          borderColor: "#485c7b",
          autoScale: true,
        },
      });

      timeScaleRef.current = chart.timeScale();

      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: "#16b303",
        downColor: "#e70707",
        borderVisible: false,
        wickUpColor: "#16b303",
        wickDownColor: "#e70707",
      });

      candleSeriesRef.current.setData(data);
      chart.timeScale().fitContent();

      observer = new ResizeObserver(() => {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      });
      observer.observe(chartRef.current);
    };

    setupChart();

    return () => {
      if (observer) observer.disconnect();
      if (chart) chart.remove();
    };
  }, [pair, interval]);

  return (
    <div
      style={{
        height: "400px",
        backgroundColor: "#000",
        border: "1px solid #444",
        borderRadius: "10px",
        marginTop: "1rem",
      }}
    >
      <div ref={chartRef} style={{ height: "100%" }} />
      <div className="mt-2 text-right">
        <button
          onClick={() => {
            if (timeScaleRef.current) timeScaleRef.current.fitContent();
          }}
          className="bg-xcannes-green text-black px-4 py-2 rounded text-sm hover:bg-green-400 transition"
        >
          🔄 Reset Zoom
        </button>
      </div>
    </div>
  );
}

