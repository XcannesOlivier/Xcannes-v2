"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";

export default function XrplCandleChartRaw({
  pair = "XCS/XRP",
  interval = "1m",
  onPairChange,
  onIntervalChange,
  availablePairs = [],
  availableIntervals = ["30s", "1m", "5m", "15m", "1h", "4h", "1d", "1M", "1y"],
}) {
  const chartRef = useRef();
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const timeScaleRef = useRef(null);

  // États pour les fonctionnalités modernes
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  const [showVolume, setShowVolume] = useState(true);
  const [loading, setLoading] = useState(true);
  const [noDataMessage, setNoDataMessage] = useState(null);
  const [stats24h, setStats24h] = useState({
    high: null,
    low: null,
    volume: null,
  });

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

    let durationInDays;
    if (interval === "30s" || interval === "1m") durationInDays = 1;
    else if (interval === "5m") durationInDays = 2;
    else if (interval === "15m") durationInDays = 6;
    else if (interval === "1h") durationInDays = 14;
    else if (interval === "4h") durationInDays = 30;
    else if (interval === "1d") durationInDays = 200;
    else if (interval === "1M") durationInDays = 365;
    else if (interval === "1y") durationInDays = 365 * 5;
    else durationInDays = 1;

    const durationMs = durationInDays * 24 * 60 * 60 * 1000;
    const start = new Date(now.getTime() - durationMs);

    return { start: start.toISOString(), end: undefined };
  };

  const fetchMarketData = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.url) return [];

    console.log(
      `⚠️ L'API XRPLF Data (data.xrplf.org) est actuellement hors service.`
    );
    console.log(
      `ℹ️ Le graphique de chandelles nécessite une connexion directe au ledger XRPL.`
    );
    console.log(
      `🔧 Solution temporaire : Utilisez l'Order Book ci-dessous pour les prix en temps réel.`
    );

    // L'API data.xrplf.org ne fonctionne plus
    // TODO: Implémenter une solution avec WebSocket directement au ledger XRPL
    return [];
  };

  useEffect(() => {
    let chart;
    let observer;

    const setupChart = async () => {
      setLoading(true);
      setNoDataMessage(null);
      const data = await fetchMarketData();
      if (!data.length) {
        setLoading(false);
        setNoDataMessage(
          `Aucune donnée de trading disponible pour ${pair}. L'API de données historiques (data.xrplf.org) semble actuellement indisponible. Nous travaillons à implémenter une source de données alternative.`
        );
        return;
      }

      chart = createChart(chartRef.current, {
        width: chartRef.current.clientWidth || 800,
        height: 500,
        layout: {
          background: { color: "#0a0f0d" },
          textColor: "#9ca3af",
        },
        grid: {
          vertLines: { color: "#1a1f1d" },
          horzLines: { color: "#1a1f1d" },
        },
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
          scaleMargins: {
            top: 0.1,
            bottom: showVolume ? 0.25 : 0.1,
          },
        },
      });

      timeScaleRef.current = chart.timeScale();

      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: "#16b303",
        downColor: "#dc2626",
        borderUpColor: "#16b303",
        borderDownColor: "#dc2626",
        wickUpColor: "#16b303",
        wickDownColor: "#dc2626",
      });

      candleSeriesRef.current.setData(data);

      // Ajouter le volume si activé (toujours afficher même si volume = 0)
      if (showVolume) {
        volumeSeriesRef.current = chart.addHistogramSeries({
          color: "#16b303",
          priceFormat: { type: "volume" },
          priceScaleId: "",
          scaleMargins: { top: 0.8, bottom: 0 },
        });

        const volumeData = data.map((d) => ({
          time: d.time,
          value: d.volume || 0,
          color: d.close >= d.open ? "#16b30340" : "#dc262640",
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      // Calculer les statistiques
      const realData = data.filter(
        (c) => c.open !== 0 || c.high !== 0 || c.low !== 0 || c.close !== 0
      );

      if (realData.length > 0) {
        const lastCandle = realData[realData.length - 1];
        const firstCandle = realData[0];

        setCurrentPrice(lastCandle.close);

        const change = lastCandle.close - firstCandle.close;
        const changePercent = (change / firstCandle.close) * 100;
        setPriceChange({ value: change, percent: changePercent });

        // Stats 24h (dernières 24h de données)
        const last24hData = realData.slice(-Math.min(realData.length, 1440)); // 1440 = 24h en minutes
        const high24h = Math.max(...last24hData.map((d) => d.high));
        const low24h = Math.min(...last24hData.map((d) => d.low));
        const volume24h = last24hData.reduce(
          (sum, d) => sum + (d.volume || 0),
          0
        );

        setStats24h({
          high: high24h,
          low: low24h,
          volume: volume24h,
        });
      }

      // 📅 Autozoom horizontal
      const first = realData[0]?.time;
      const last = realData[realData.length - 1]?.time;

      if (first && last && chart?.timeScale) {
        const margin = Math.floor((last - first) * 0.05);
        chart.timeScale().setVisibleRange({
          from: first - margin,
          to: last + margin,
        });
      }

      // 💹 Autozoom vertical (prix)
      const highs = realData.map((d) => d.high);
      const lows = realData.map((d) => d.low);
      const maxPrice = Math.max(...highs);
      const minPrice = Math.min(...lows);
      const marginY = (maxPrice - minPrice) * 0.1;

      chart.priceScale("right").setVisibleRange({
        from: minPrice - marginY,
        to: maxPrice + marginY,
      });

      setLoading(false);

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
  }, [pair, interval, showVolume]);

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6">
      {/* Header moderne avec prix et contrôles */}
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

          {/* Contrôles */}
          <div className="flex items-center gap-2 flex-wrap">
            {availablePairs.length > 0 && onPairChange && (
              <select
                value={pair}
                onChange={(e) => onPairChange(e.target.value)}
                className="bg-black/60 border border-white/10 px-3 py-1.5 rounded text-xs text-white font-medium hover:border-white/20 transition-all"
              >
                {availablePairs.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            )}

            {availableIntervals.length > 0 && onIntervalChange && (
              <select
                value={interval}
                onChange={(e) => onIntervalChange(e.target.value)}
                className="bg-black/60 border border-white/10 px-3 py-1.5 rounded text-xs text-white font-medium hover:border-white/20 transition-all"
              >
                {availableIntervals.map((int) => (
                  <option key={int} value={int}>
                    {int}
                  </option>
                ))}
              </select>
            )}

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
            <button
              onClick={() => {
                if (timeScaleRef.current) timeScaleRef.current.fitContent();
              }}
              className="px-3 py-1.5 rounded text-xs font-medium bg-white/10 text-white/60 hover:bg-white/20 transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative w-full">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-xcannes-green border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-white/60 text-sm">Chargement des données...</p>
            </div>
          </div>
        )}

        {noDataMessage && !loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="text-center max-w-md px-6">
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-lg font-semibold text-white mb-2">
                Service de données indisponible
              </p>
              <p className="text-sm text-white/60 mb-4">{noDataMessage}</p>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <p className="text-xs text-white/60 leading-relaxed">
                  L'API data.xrplf.org ne répond plus correctement. Le Order
                  Book en temps réel fonctionne toujours via
                  wss://xrplcluster.com
                </p>
              </div>
              <div className="text-xs text-white/40">
                En attendant, consultez l'Order Book ci-dessous pour les prix en
                temps réel
              </div>
            </div>
          </div>
        )}

        <div
          ref={chartRef}
          className="w-full relative z-0"
          style={{ height: "500px", minHeight: "500px" }}
        />
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-white/40 mb-1">24h High</p>
          <p className="text-sm font-semibold text-white">
            {stats24h.high ? stats24h.high.toFixed(6) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">24h Low</p>
          <p className="text-sm font-semibold text-white">
            {stats24h.low ? stats24h.low.toFixed(6) : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">24h Volume</p>
          <p className="text-sm font-semibold text-white">
            {stats24h.volume
              ? stats24h.volume.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-white/40 mb-1">Market Cap</p>
          <p className="text-sm font-semibold text-white">-</p>
        </div>
      </div>
    </div>
  );
}
