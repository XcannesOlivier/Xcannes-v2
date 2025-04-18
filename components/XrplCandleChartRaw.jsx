"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";
import { Client } from "xrpl";
import { getBookIdFromPair } from "../utils/xrpl";

export default function XrplCandleChartRaw({ pair = "XCS/XRP", interval = "1m" }) {
  const chartRef = useRef();
  const candleSeriesRef = useRef(null);
  const lastCandleRef = useRef(null);
  const timeScaleRef = useRef(null);

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

  const getAmount = (value) => {
    if (typeof value === "object") return parseFloat(value.value);
    return parseFloat(value) / 1_000_000;
  };

  const aggregateCandles = (trades, intervalSec) => {
    const buckets = new Map();
    trades.forEach((trade) => {
      const time = Math.floor(new Date(trade.executed_time).getTime() / 1000);
      const bucket = time - (time % intervalSec);
      const price = parseFloat(trade.rate);
      if (!price || isNaN(price)) return;

      if (!buckets.has(bucket)) {
        buckets.set(bucket, { time: bucket, open: price, high: price, low: price, close: price });
      } else {
        const c = buckets.get(bucket);
        c.high = Math.max(c.high, price);
        c.low = Math.min(c.low, price);
        c.close = price;
      }
    });
    return Array.from(buckets.values()).sort((a, b) => a.time - b.time);
  };

  const fetchHistoricalTrades = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.taker_gets?.issuer) return [];

    const client = new Client("wss://s1.ripple.com");
    try {
      await client.connect();
      const res = await client.request({
        command: "account_tx",
        account: book.taker_gets.issuer,
        ledger_index_min: -100000,
        ledger_index_max: -1,
        limit: 200,
      });

      const trades = res.result.transactions
        .filter((tx) => tx.tx.TransactionType === "OfferCreate")
        .map((tx) => {
          const time = new Date(tx.tx.date * 1000 + 946684800000); // Ripple epoch → JS
          const gets = getAmount(tx.tx.TakerGets);
          const pays = getAmount(tx.tx.TakerPays);
          const rate = gets && pays ? gets / pays : null;
          return {
            executed_time: time,
            rate,
          };
        })
        .filter((t) => t.rate); // Nettoyage

      await client.disconnect();
      return trades;
    } catch (err) {
      console.error("❌ XRPL Client fetch trades error:", err);
      return [];
    }
  };

  useEffect(() => {
    let chart;
    const intervalSec = intervalMap[interval] || 60;

    const renderChart = async () => {
      const trades = await fetchHistoricalTrades();
      if (!trades.length) return;

      const data = aggregateCandles(trades, intervalSec);
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

      const observer = new ResizeObserver(() => {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      });

      observer.observe(chartRef.current);

      return () => {
        observer.disconnect();
        chart.remove();
      };
    };

    renderChart();
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
