"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import axios from "axios";
import { getBookIdFromPair } from "../utils/xrpl";

const BinanceStyleChart = ({ pair, streamUrl = "wss://s2.ripple.com" }) => {
  const chartRef = useRef();
  const chartInstance = useRef();
  const candleSeries = useRef();
  const wsRef = useRef();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.innerHTML = "";
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 400,
      layout: { background: { color: "#000" }, textColor: "#fff" },
      grid: { vertLines: { color: "#222" }, horzLines: { color: "#222" } },
      timeScale: { borderColor: "#444" },
      priceScale: { borderColor: "#444" },
    });
    chartInstance.current = chart;

    candleSeries.current = chart.addCandlestickSeries({
      upColor: "#0f0",
      downColor: "#f00",
      borderVisible: false,
      wickUpColor: "#0f0",
      wickDownColor: "#f00",
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
    const fetchCandles = async () => {
      try {
        const bookId = getBookIdFromPair(pair);
        if (!bookId) return;

        const url = `https://data.xrplf.org/v1/iou/ticker_data/${pair}?interval=5m&limit=100`;
        const res = await axios.get(url);
        const rawData = res.data;

        const candles = rawData.map((d) => ({
          time: Math.floor(new Date(d.date_from).getTime() / 1000),
          open: +d.first,
          high: +d.high,
          low: +d.low,
          close: +d.last,
        }));

        candleSeries.current.setData(candles);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement HTTP candles:", err);
        setLoading(false);
      }
    };

    fetchCandles();
  }, [pair]);

  useEffect(() => {
    const book = getBookIdFromPair(pair);
    if (!book || !streamUrl || !candleSeries.current) return;

    const ws = new WebSocket(streamUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          id: `${pair}-live`,
          command: "subscribe",
          books: [
            {
              taker_gets: book.taker_gets,
              taker_pays: book.taker_pays,
              both: false,
              snapshot: false,
              depth: 1,
            },
          ],
        })
      );
    };

    ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        if (data.type === "transaction") {
          const candle = {
            time: Math.floor(Date.now() / 1000),
            open: Math.random(),
            high: Math.random() + 0.5,
            low: Math.random() - 0.5,
            close: Math.random(),
          };
          candleSeries.current.update(candle);
        }
      } catch (e) {
        console.warn("Erreur WebSocket:", e);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket fermé pour:", pair);

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [pair, streamUrl]);

  return (
    <div className="mt-4">
      {loading && <p className="text-gray-400 mb-2">Chargement des chandeliers...</p>}
      <div
        ref={chartRef}
        style={{ width: "100%", height: "400px", border: "2px dashed red" }}
      ></div>
    </div>
  );
};

export default BinanceStyleChart;
