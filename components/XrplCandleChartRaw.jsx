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
      if (!min || !max || isNaN(min) || isNaN(max) || min === max || max > 10000 || min < 0.000001) {
        chart.priceScale().applyOptions({ autoScale: true });
        return;
      }
      chart.priceScale().applyOptions({
        autoScale: false,
        minValue: min * (1 - margin),
        maxValue: max * (1 + margin),
      });
    };

    const bookId = getBookIdFromPair(pair);
    if (!bookId?.url) return;
    const PAIR_ID = bookId.url;
    const intervalSec = intervalMap[interval] || 60;

    const loadInitialData = async () => {
      try {
        const pageSize = getLimitFromInterval(interval);
        let skip = 0;
        let hasMore = true;
        let allData = [];

        while (hasMore) {
          const res = await axios.get(
            `https://data.xrplf.org/v1/iou/exchanges/${PAIR_ID}`,
            {
              params: {
                interval,
                limit: pageSize,
                skip,
              },
            }
          );
          allData = allData.concat(res.data);
          hasMore = res.headers["x-has-more-data"] === "true";
          skip += pageSize;
        }

        const filtered = allData.filter((t) => {
          const price = parseFloat(t.rate);
          return price >= 0.000001 && price <= 10000 && !isNaN(price);
        });

        const data = aggregateCandles(filtered, intervalSec);
        if (!data.length) return;

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
        console.error("❌ Erreur fetch paginé XRPL:", err);
      }
    };

    const setupWebSocket = (chartInstance) => {
      socket = new WebSocket("wss://s1.ripple.com");

      socket.onopen = () => {
        console.log("✅ WebSocket connecté");
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
        const tx = data?.transaction;
        if (data.type !== "transaction" || !tx || tx.TransactionType !== "OfferCreate") return;

        const getAmount = (value) => {
          if (!value) return 0;
          if (typeof value === "object") return parseFloat(value.value);
          return parseFloat(value) / 1_000_000;
        };

        const gets = getAmount(tx.TakerGets);
        const pays = getAmount(tx.TakerPays);
        if (!gets || !pays || isNaN(gets) || isNaN(pays) || pays === 0) return;

        const price = gets / pays;
        if (price < 0.000001 || price > 10000) return;

        const now = Math.floor(Date.now() / 1000);
        const bucketTime = now - (now % intervalSec);

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

