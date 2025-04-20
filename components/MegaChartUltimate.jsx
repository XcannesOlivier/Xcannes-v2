"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";
import { calcRSI, calcMACD, calcBollinger } from "../utils/Technicallndicators";

export default function MegaChartUltimate({ pair = "XRP/RLUSD", interval = "1d" }) {
  const chartRef = useRef();
  const rsiRef = useRef();
  const [theme, setTheme] = useState("dark");
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(true);
  const [showBB, setShowBB] = useState(true);

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

  const fetchData = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.url) return [];

    const { start, end } = getStartEndTimestamps(interval);

    const url = `https://data.xrplf.org/v1/iou/market_data/${book.url}?interval=${interval}&start=${start}` +
                (end ? `&end=${end}` : '');

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    return json.map(c => ({
      time: Math.floor(new Date(c.timestamp).getTime() / 1000),
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
      volume: c.volume || 0,
    }));
  };

  useEffect(() => {
    let chart, rsiChart;
    const container = chartRef.current;

    const draw = async () => {
      const data = await fetchData();
      if (!data.length) return;
      const bb = showBB ? calcBollinger(data) : [];
      const rsi = showRSI ? calcRSI(data) : [];
      const macdData = showMACD ? calcMACD(data) : [];

      chart = createChart(container, {
        width: container.clientWidth,
        height: 0.6 * window.innerHeight,
        layout: {
          background: { color: theme === "dark" ? "#000" : "#fff" },
          textColor: theme === "dark" ? "#fff" : "#000",
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: interval === "1m",
          rightOffset: 2,
          barSpacing: 10,
          lockVisibleTimeRangeOnResize: false,
        },
        grid: {
          vertLines: { color: "#2B2B43" },
          horzLines: { color: "#363C4E" },
        },
        crosshair: { mode: 1 },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: {
          axisPressedMouseMove: true,
          axisDoubleClickReset: true,
          mouseWheel: true,
          pinch: true,
        },
      });

      const candleSeries = chart.addCandlestickSeries();
      candleSeries.setData(data);

      if (showBB) {
        chart.addLineSeries({ color: "#ff9900" }).setData(bb.map(b => ({ time: b.time, value: b.upper })));
        chart.addLineSeries({ color: "#ff9900" }).setData(bb.map(b => ({ time: b.time, value: b.lower })));
        chart.addLineSeries({ color: "#999" }).setData(bb.map(b => ({ time: b.time, value: b.basis })));
      }

      chart.addHistogramSeries({
        color: "#4A90E2",
        priceFormat: { type: "volume" },
        scaleMargins: { top: 0.85, bottom: 0 },
      }).setData(data.map(d => ({ time: d.time, value: d.volume })));

      if (showMACD) {
        chart.addLineSeries({ color: "#00ffff" }).setData(macdData.map(d => ({ time: d.time, value: d.macd })));
        chart.addLineSeries({ color: "#ffa500" }).setData(macdData.map(d => ({ time: d.time, value: d.signal })));
        chart.addHistogramSeries({ color: "#ccc" }).setData(macdData.map(d => ({ time: d.time, value: d.histogram })));
      }

      const tooltipEl = document.createElement("div");
      tooltipEl.style = "position: absolute; display: none; background: #222; color: #fff; padding: 6px 8px; font-size: 12px; border-radius: 4px; pointer-events: none; z-index: 1000;";
      container.appendChild(tooltipEl);

      chart.subscribeCrosshairMove(param => {
        if (!param.point || !param.time || !param.seriesData) {
          tooltipEl.style.display = "none";
          return;
        }
        const c = param.seriesData.get(candleSeries);
        if (!c) return;
        tooltipEl.innerHTML = `
          <div><strong>O:</strong> ${c.open}</div>
          <div><strong>H:</strong> ${c.high}</div>
          <div><strong>L:</strong> ${c.low}</div>
          <div><strong>C:</strong> ${c.close}</div>`;
        tooltipEl.style.left = param.point.x + 20 + "px";
        tooltipEl.style.top = param.point.y + "px";
        tooltipEl.style.display = "block";
      });

      chart.timeScale().fitContent();

      if (showRSI) {
        rsiChart = createChart(rsiRef.current, {
          width: container.clientWidth,
          height: 0.25 * window.innerHeight,
          layout: {
            background: { color: theme === "dark" ? "#000" : "#fff" },
            textColor: theme === "dark" ? "#fff" : "#000",
          },
          timeScale: { timeVisible: false },
          grid: {
            vertLines: { color: "#2B2B43" },
            horzLines: { color: "#363C4E" },
          },
        });
        rsiChart.addLineSeries({ color: "#00ff00" }).setData(rsi);
      }
    };

    const observer = new ResizeObserver(() => {
      if (chart) chart.applyOptions({ width: container.clientWidth });
      if (rsiChart && rsiRef.current) {
        rsiChart.applyOptions({ width: rsiRef.current.clientWidth });
      }
    });

    observer.observe(container);
    if (rsiRef.current) observer.observe(rsiRef.current);

    draw();

    return () => {
      if (chart) chart.remove();
      if (rsiChart) rsiChart.remove();
      observer.disconnect();
    };
  }, [pair, theme, showRSI, showMACD, showBB, interval]);

  const handleFullscreen = () => {
    const el = chartRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  return (
    <div className="w-full relative px-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))} className="px-3 py-1 bg-gray-700 text-white rounded text-sm">
          {theme === "dark" ? "Clair" : "Sombre"}
        </button>
        <button onClick={handleFullscreen} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
          Plein écran
        </button>
        <label className="text-sm">
          <input type="checkbox" checked={showRSI} onChange={() => setShowRSI(!showRSI)} className="mr-1" />RSI
        </label>
        <label className="text-sm">
          <input type="checkbox" checked={showMACD} onChange={() => setShowMACD(!showMACD)} className="mr-1" />MACD
        </label>
        <label className="text-sm">
          <input type="checkbox" checked={showBB} onChange={() => setShowBB(!showBB)} className="mr-1" />Bollinger
        </label>
      </div>
      <div ref={chartRef} className="w-full" />
      {showRSI && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-1">RSI (14)</h3>
          <div ref={rsiRef} className="w-full" />
        </div>
      )}
    </div>
  );
}
