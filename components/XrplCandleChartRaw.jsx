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

  useEffect(() => {
    let chart;
    const client = new Client("wss://s1.ripple.com");

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

    const fetchHistoricalTrades = async () => {
      const book = getBookIdFromPair(pair);
      if (!book?.taker_gets?.issuer) return;

      await client.connect();

      const response = await client.request({
        command: "account_tx",
        account: book.taker_gets.issuer,
        ledger_index_min: -10000,
        ledger_index_max: -1,
        limit: 200,
      });

      const trades = response.result.transactions
        .filter((tx) => tx.tx.TransactionType === "OfferCreate")
        .map((tx) => ({
          executed_time: new Date(tx.tx.date * 1000 + 946684800000), // Ripple Epoch to JS time
          rate: getAmount(tx.tx.TakerGets) / getAmount(tx.tx.TakerPays),
        }));

      return trades;
    };

    const setupChart = async () => {
      const trades = await fetchHistoricalTrades();
      if (!trades || !trades.length) return;

      const intervalSec = intervalMap[interval] || 60;
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

      const prices = data.flatMap((c) => [c.low, c.high]);
      updatePriceScale(chart, Math.min(...prices), Math.max(...prices));

      chart.timeScale().fitContent();

      const observer = new ResizeObserver(() => {
        chart.applyOptions({ width: chartRef.current.clientWidth });
      });
      observer.observe(chartRef.current);

      return () => {
        observer.disconnect();
        chart.remove();
        client.disconnect();
      };
    };

    setupChart();

    return () => {
      if (client.isConnected()) client.disconnect();
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
