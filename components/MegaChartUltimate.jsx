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

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  };

  const fetchData = async () => {
    const book = getBookIdFromPair(pair);
    if (!book?.url) return [];
  
    const { start } = getStartEndTimestamps(interval); // plus besoin de `end`
  
    const url = `https://data.xrplf.org/v1/iou/market_data/${book.url}?interval=${interval}&start=${start}`;
  
    try {
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
    } catch (err) {
      console.error("Erreur fetch:", err);
      return [];
    }
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

      const candleSeries = chart.addCandlestickSeries({
        upColor: "#16b303",           // 💚 Bougie verte haussière (corps)
        borderUpColor: "#16b303",     // 💚 Contour de la bougie haussière
        wickUpColor: "#16b303",       // 💚 Mèche haute haussière
        downColor: "#e70707",         // ❤️ Bougie rouge baissière (corps)
        borderDownColor: "#e70707",   // ❤️ Contour de la bougie baissière
        wickDownColor: "#e70707",     // ❤️ Mèche basse baissière
      });
      
      candleSeries.setData(data);

      if (showBB) {
        chart.addLineSeries({ color: "#e3ca06" }).setData(bb.map(b => ({ time: b.time, value: b.upper })));
        chart.addLineSeries({ color: "#e3ca06" }).setData(bb.map(b => ({ time: b.time, value: b.lower })));
        chart.addLineSeries({ color: "#999" }).setData(bb.map(b => ({ time: b.time, value: b.basis })));
      }

      chart.addHistogramSeries({
        color: "#4A90E2",
        priceFormat: { type: "volume" },
        scaleMargins: { top: 0.85, bottom: 0 },
      }).setData(data.map(d => ({ time: d.time, value: d.volume })));

      if (showMACD) {
        chart.addLineSeries({ color: "#0695d9" }).setData(macdData.map(d => ({ time: d.time, value: d.macd })));
        chart.addLineSeries({ color: "#e3ca06" }).setData(macdData.map(d => ({ time: d.time, value: d.signal })));
        chart.addHistogramSeries({ color: "#ccc" }).setData(macdData.map(d => ({ time: d.time, value: d.histogram })));
      }

      const highs = data.map(d => d.high);
      const lows = data.map(d => d.low);
      const maxPrice = Math.max(...highs);
      const minPrice = Math.min(...lows);
      const marginY = (maxPrice - minPrice) * 0.1;

      chart.priceScale('right').setVisibleRange({
        from: minPrice - marginY,
        to: maxPrice + marginY,
      });

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
        rsiChart.addLineSeries({ color: "#16b303" }).setData(rsi);
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
        <button
          onClick={() => {
            if (chartRef.current) {
              chartRef.current.chart.timeScale().fitContent();
              chartRef.current.chart.priceScale("right").setAutoScale(true);
            }
          }}
          className="bg-xcannes-green text-black px-3 py-1 rounded text-sm"
        >
          🔄 Reset Zoom
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
      <div ref={chartRef} className="w-full border border-white/40 " />
      {showRSI && (
        <div className="mt-4">
          <h3 className="text-3m font-semibold mb-1">RSI (14)</h3>
          <div ref={rsiRef} className="w-full" />
        </div>
      )}
    </div>
  );
}

