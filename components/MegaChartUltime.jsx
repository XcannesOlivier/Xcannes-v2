"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { getBookIdFromPair } from "../utils/xrpl";
import { calcRSI, calcMACD, calcBollinger } from "../utils/TechnicalIndicators";

export default function MegaChartUltimate({ pair = "XRP/RLUSD" }) {
  const chartRef = useRef();
  const rsiRef = useRef();
  const [theme, setTheme] = useState("dark");
  const [showRSI, setShowRSI] = useState(true);
  const [showMACD, setShowMACD] = useState(true);
  const [showBB, setShowBB] = useState(true);
  const [interval, setInterval] = useState("1d");

  const fetchData = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.url) return [];
    const now = new Date();
    const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const url = `https://data.xrplf.org/v1/iou/market_data/${book.url}?interval=${interval}&start=${start}`;
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

    draw();
    return () => {
      if (chart) chart.remove();
      if (rsiChart) rsiChart.remove();
    };
  }, [pair, theme, showRSI, showMACD, showBB, interval]);

  const handleFullscreen = () => {
    const el = chartRef.current;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  return (
    <div className="w-full relative px-2">
      <div className="flex flex-wrap gap-2 justify-between mb-2">
        <div className="flex flex-wrap gap-2">
          {["1m", "5m", "15m", "1h", "1d"].map((i) => (
            <button
              key={i}
              onClick={() => setInterval(i)}
              className={`px-2 py-1 text-sm rounded ${interval === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
          >
            {theme === "dark" ? "Clair" : "Sombre"}
          </button>
          <button
            onClick={handleFullscreen}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          >
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
