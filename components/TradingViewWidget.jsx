import { useEffect, useRef } from "react";

export default function TradingViewWidget({ pair }) {
  const container = useRef();

  useEffect(() => {
    const widgetScript = document.createElement("script");
    widgetScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    widgetScript.type = "text/javascript";
    widgetScript.async = true;
    widgetScript.innerHTML = JSON.stringify({
      symbols: [[pair]],
      width: "100%",
      height: "100%",
      colorTheme: "dark",
      isTransparent: false,
      locale: "fr"
    });

    container.current.innerHTML = "";
    container.current.appendChild(widgetScript);
  }, [pair]);

  return (
    <div
      className=" w-full h-[600px] sm:h-[350px] md:h-[450px] lg:h-[700px]"
      
    >
      <div ref={container} className="tradingview-widget-container h-full w-full" />
    </div>
  );
}
