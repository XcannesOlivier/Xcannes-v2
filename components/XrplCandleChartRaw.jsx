"use client";

import React, { useEffect, useRef, useState } from "react";
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

  const getStartEndTimestamps = (interval) => {
    const now = new Date();
  
    const secondsPerCandle = intervalMap[interval] || 60;
  
    // Durée globale cible par interval (en jours)
    let durationInDays;
  
    if (interval === "30s" || interval === "1m") durationInDays = 1; // 12h
    else if (interval === "5m") durationInDays = 2; // 1 jour
    else if (interval === "15m") durationInDays = 6;
    else if (interval === "1h") durationInDays = 14;
    else if (interval === "4h") durationInDays = 30;
    else if (interval === "1d") durationInDays = 200;
    else if (interval === "1M") durationInDays = 365;
    else if (interval === "1y") durationInDays = 365 * 5;
    else durationInDays = 1; // fallback
  
    const durationMs = durationInDays * 24 * 60 * 60 * 1000;
    const start = new Date(now.getTime() - durationMs);
  
    return {
      start: start.toISOString(),
      end: undefined, // laisse l'API aller jusqu’à maintenant
    };
  };
  
 

  const buildFlatLineFromTo = (startUnix, endUnix, price) => {
    const intervalSeconds = intervalMap[interval] || 60;
    const candles = [];
    let t = startUnix;

    while (t < endUnix) {
      candles.push({
        time: t,
        open: price,
        high: price,
        low: price,
        close: price,
      });
      t += intervalSeconds;
    }

    return candles;
  };

  const fetchMarketData = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.url) return [];

    let data = [];
    let depth = 0;
    let found = false;

    while (depth < 3 && !found) {
      const { start, end } = getStartEndTimestamps(interval);
      const url = `https://data.xrplf.org/v1/iou/market_data/${book.url}?interval=${interval}&start=${start}` + 
                  (end ? `&end=${end}` : '');
       

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        data = json.map((candle) => ({
          time: Math.floor(new Date(candle.timestamp).getTime() / 1000),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        if (data.length >= 1) found = true;
      } catch (err) {
        console.error("❌ Erreur fetch (depth", depth, "):", err);
      }

      depth++;
    }

    if (!found) {
      console.log(`😴 Paire ${pair} : aucun trade trouvé, aucune donnée`);
      return [];
    }

    // Ligne plate depuis 2023-01-01 jusqu'au premier trade connu
    const firstCandle = data[0];
    const flatStart = Math.floor(new Date("2024-01-12T00:00:00Z").getTime() / 1000);
    const flatEnd = firstCandle.time;

    const flatLine = buildFlatLineFromTo(flatStart, flatEnd, firstCandle.close);

    return [...flatLine, ...data];
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
