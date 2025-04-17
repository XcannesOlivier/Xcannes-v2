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
    let socket;

    const getLimitFromInterval = (interval) => {
      switch (interval) {
        case "1m": return 1000;
        case "5m": return 1000;
        case "1h": return 1000;
        case "1d": return 500;
        case "1w": return 200;
        case "1M": return 100;
        case "1Y": return 50;
        case "all": return 2000;
        default: return 1000;
      }
    };

    const aggregateToCandles = (trades, interval) => {
      if (!trades?.length) return [];

      const intervalMap = {
        "1m": 60,
        "5m": 300,
        "15m": 900,
        "30m": 1800,
        "1h": 3600,
        "4h": 14400,
        "1d": 86400,
        "1w": 604800,
      };

      const bucketSize = intervalMap[interval] || 60;
      const buckets = new Map();

      trades.forEach((trade) => {
        const timestamp = Math.floor(new Date(trade.executed_time).getTime() / 1000);
        const bucket = timestamp - (timestamp % bucketSize);
        const price = parseFloat(trade.rate);

        if (price < 0.000001 || price > 10000 || isNaN(price)) return; // filtre safety

        if (!buckets.has(bucket)) {
          buckets.set(bucket, {
            time: bucket,
            open: price,
            high: price,
            low: price,
            close: price,
          });
        } else {
          const candle = buckets.get(bucket);
          candle.high = Math.max(candle.high, price);
          candle.low = Math.min(candle.low, price);
          candle.close = price;
        }
      });

      return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
    };

    const updatePriceScale = (chart, low, high) => {
      const margin = 0.02;
      chart.priceScale().applyOptions({
        autoScale: false,
        minValue: low * (1 - margin),
        maxValue: high * (1 + margin),
      });
    };

    const bookId = getBookIdFromPair(pair);
    if (!bookId?.url) return;
    const PAIR_ID = bookId.url;

    const loadInitialData = async () => {
      try {
        const limit = getLimitFromInterval(interval);
        const res = await axios.get(
          `https://data.xrplf.org/v1/iou/exchanges/${PAIR_ID}?interval=${interval}&limit=${limit}`
        );

        const data = aggregateToCandles(res.data, interval);

        if (!data.length) {
          console.warn("⚠️ Aucune donnée valide.");
          return;
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

        candleSeriesRef.current.setData(data);

        const prices = data.flatMap((d) => [d.low, d.high]);
        updatePriceScale(chart, Math.min(...prices), Math.max(...prices));

        const first = data[0];
        const last = data[data.length - 1];
        const duration = last.time - first.time;

        if (duration >= 2592000) {
          chart.timeScale().setVisibleRange({
            from: last.time - 2592000,
            to: last.time,
          });
        } else {
          chart.timeScale().fitContent();
        }

        const observer = new ResizeObserver(() => {
          chart.applyOptions({ width: chartRef.current.clientWidth });
        });
        observer.observe(chartRef.current);

        setupWebSocket(chart);

        return () => {
          observer.disconnect();
          chart.remove();
          if (socket) socket.close();
        };
      } catch (err) {
        console.error("❌ Erreur XRPL :", err);
      }
    };

    const setupWebSocket = (chartInstance) => {
      socket = new WebSocket("wss://s1.ripple.com");

      socket.onopen = () => {
        console.log("✅ WebSocket connecté");
        socket.send(JSON.stringify({
          id: 1,
          command: "subscribe",
          streams: ["transactions"],
        }));
      };

      socket.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type !== "transaction" || !data.transaction) return;

        const tx = data.transaction;
        if (tx.TransactionType !== "OfferCreate") return;

        // 🧠 TakerGets / TakerPays
        let gets = tx.TakerGets;
        let pays = tx.TakerPays;

        if (typeof gets === "object") gets = parseFloat(gets.value);
        else gets = parseFloat(gets) / 1_000_000;

        if (typeof pays === "object") pays = parseFloat(pays.value);
        else pays = parseFloat(pays) / 1_000_000;

        if (!gets || !pays || isNaN(gets) || isNaN(pays) || pays === 0) return;

        const price = gets / pays;

        if (price < 0.000001 || price > 10000) {
          console.warn("❌ Prix ignoré (extrême):", price);
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        const bucketTime = now - (now % 60);
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
          updatePriceScale(chartInstance, price, price);
        } else {
          last.high = Math.max(last.high, price);
          last.low = Math.min(last.low, price);
          last.close = price;
          candleSeriesRef.current.update(last);
          updatePriceScale(chartInstance, last.low, last.high);
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
            if (timeScaleRef.current) {
              timeScaleRef.current.fitContent();
            }
          }}
          className="bg-xcannes-green text-black px-4 py-2 rounded text-sm hover:bg-green-400 transition"
        >
          🔄 Reset Zoom
        </button>
      </div>
    </div>
  );
}
