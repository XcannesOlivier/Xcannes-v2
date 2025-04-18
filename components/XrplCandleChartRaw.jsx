"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";
import { getBookIdFromPair } from "../utils/xrpl";

export default function XrplCandleChartRaw({ pair = "XCS/XRP", interval = "1m" }) {
  const chartRef = useRef();
  const candleSeriesRef = useRef(null);
  const lastCandleRef = useRef(null);
  const timeScaleRef = useRef(null);

  useEffect(() => {
    let chart;

    const intervalMap = {
      "1m": "1m",
      "5m": "5m",
      "15m": "15m",
      "30m": "30m",
      "1h": "1h",
      "4h": "4h",
      "1d": "1d",
      "1w": "1w",
      "1M": "1M",
      "1Y": "1Y",
    };

    const formatCandleData = (data) => {
      return data.map((entry) => ({
        time: Math.floor(new Date(entry.timestamp).getTime() / 1000),
        open: parseFloat(entry.open),
        high: parseFloat(entry.high),
        low: parseFloat(entry.low),
        close: parseFloat(entry.close),
      }));
    };

    const updatePriceScale = (chart, min, max) => {
      const margin = 0.02;
      if (!min || !max || isNaN(min) || isNaN(max) || min === max) {
        chart.priceScale().applyOptions({ autoScale: true });
        return;
      }

      chart.priceScale().applyOptions({
        autoScale: false,
        minValue: min * (1 - margin),
        maxValue: max * (1 + margin),
      });
    };

    const loadCandleData = async () => {
      try {
        const book = getBookIdFromPair(pair);
        if (!book || !book.url) return;

        const [base, counter] = book.url.split("_");

        const res = await axios.get(
          `https://data.xrplf.org/v1/iou/market_data/${base}/${counter}?interval=${intervalMap[interval] || "1m"}`
        );

        const candles = formatCandleData(res.data);
        if (!candles.length) return;

        lastCandleRef.current = candles[candles.length - 1];

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
            secondsVisible: interval === "1m",
          },
          priceScale: {
            borderColor: "#485c7b",
            autoScale: false,
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

        candleSeriesRef.current.setData(candles);

        const prices = candles.flatMap((c) => [c.low, c.high]);
        updatePriceScale(chart, Math.min(...prices), Math.max(...prices));

        chart.timeScale().fitContent();

        const observer = new ResizeObserver(() => {
          chart.applyOptions({ width: chartRef.current.clientWidth });
        });
        observer.observe(chartRef.current);

        return () => {
          observer.disconnect();
          chart.remove();
        };
      } catch (err) {
        console.error("❌ Erreur API XRPL market_data:", err);
      }
    };

    loadCandleData();
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
