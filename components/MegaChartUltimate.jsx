"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";

function MegaChartUltimate({ pair = "XRP/RLUSD", interval = "1d" }) {
  const chartContainerRef = useRef();
  const chartInstanceRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  const [showVolume, setShowVolume] = useState(true);
  const [loading, setLoading] = useState(true);

  const intervalZoomMap = {
    "30s": 0.1,
    "1m": 0.5,
    "5m": 1,
    "15m": 2.5,
    "1h": 7,
    "4h": 20,
    "1d": 105,
    "1M": 365 * 3,
    "1y": 365 * 10,
  };

  const getStartEndTimestamps = (interval) => {
    const now = new Date();
    const durationInDays = intervalZoomMap[interval] || 1;
    const durationMs = durationInDays * 24 * 60 * 60 * 1000;
    const end = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const start = new Date(end.getTime() - durationMs);
    return { start: start.toISOString(), end: end.toISOString() };
  };

  const fetchData = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.url) return [];
    const { start } = getStartEndTimestamps(interval);
    const url = `https://data.xrplf.org/v1/iou/market_data/${book.url}?interval=${interval}&start=${start}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.map((c) => ({
        time: Math.floor(new Date(c.timestamp).getTime() / 1000),
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume || 0,
      }));
    } catch (err) {
      console.error("Erreur fetch:", err);
      return [];
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: "#0a0f0d" }, textColor: "#9ca3af" },
      grid: {
        vertLines: { color: "#1a1f1d" },
        horzLines: { color: "#1a1f1d" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#16b303",
          width: 1,
          style: 3,
          labelBackgroundColor: "#16b303",
        },
        horzLine: {
          color: "#16b303",
          width: 1,
          style: 3,
          labelBackgroundColor: "#16b303",
        },
      },
      timeScale: {
        borderColor: "#2a2f2d",
        timeVisible: true,
        secondsVisible: interval === "30s" || interval === "1m",
      },
      rightPriceScale: {
        borderColor: "#2a2f2d",
        scaleMargins: { top: 0.1, bottom: showVolume ? 0.25 : 0.1 },
      },
    });
    chartInstanceRef.current = chart;
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#16b303",
      downColor: "#dc2626",
      borderUpColor: "#16b303",
      borderDownColor: "#dc2626",
      wickUpColor: "#16b303",
      wickDownColor: "#dc2626",
    });
    let volumeSeries = null;
    if (showVolume) {
      volumeSeries = chart.addHistogramSeries({
        color: "#16b303",
        priceFormat: { type: "volume" },
        priceScaleId: "",
        scaleMargins: { top: 0.8, bottom: 0 },
      });
    }
    setLoading(true);
    fetchData().then((data) => {
      if (data.length > 0) {
        candleSeries.setData(data);
        if (showVolume && volumeSeries) {
          const volumeData = data.map((d) => ({
            time: d.time,
            value: d.volume,
            color: d.close >= d.open ? "#16b30340" : "#dc262640",
          }));
          volumeSeries.setData(volumeData);
        }
        const lastCandle = data[data.length - 1];
        const firstCandle = data[0];
        setCurrentPrice(lastCandle.close);
        const change = lastCandle.close - firstCandle.open;
        const changePercent = (change / firstCandle.open) * 100;
        setPriceChange({ value: change, percent: changePercent });
        chart.timeScale().fitContent();
      }
      setLoading(false);
    });
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.remove();
        chartInstanceRef.current = null;
      }
    };
  }, [pair, interval, showVolume]);

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-2xl font-orbitron font-bold text-white">
                {pair}
              </h2>
              {currentPrice && (
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-semibold text-white">
                    {currentPrice.toFixed(6)}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      priceChange.value >= 0
                        ? "text-xcannes-green"
                        : "text-red-500"
                    }`}
                  >
                    {priceChange.value >= 0 ? "+" : ""}
                    {priceChange.value.toFixed(6)} (
                    {priceChange.percent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                showVolume
                  ? "bg-xcannes-green text-black"
                  : "bg-white/10 text-white/60 hover:bg-white/20"
              }`}
            >
              Volume
            </button>
          </div>
        </div>
      </div>
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white/60 text-sm">Chargement des données...</p>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="w-full" />
      </div>
      <div className="p-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-white/40 mb-1">24h High</p>
          <p className="text-sm font-semibold text-white">-</p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">24h Low</p>
          <p className="text-sm font-semibold text-white">-</p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">24h Volume</p>
          <p className="text-sm font-semibold text-white">-</p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">Market Cap</p>
          <p className="text-sm font-semibold text-white">-</p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(MegaChartUltimate);
