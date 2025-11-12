import { useEffect, useState } from "react";
import xrpl from "xrpl";

export default function XRPLStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let client;

    const checkConnection = async () => {
      try {
        client = new xrpl.Client("wss://s1.ripple.com");
        await client.connect();
        setIsConnected(true);
        setIsLoading(false);
      } catch (err) {
        console.error("XRPL connection error:", err);
        setIsConnected(false);
        setIsLoading(false);
      } finally {
        if (client && client.isConnected()) {
          client.disconnect();
        }
      }
    };

    checkConnection();

    return () => {
      if (client && client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-white/60">Checking XRPL...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-3 py-2 hover:scale-105 transition-transform duration-200">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected
              ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
              : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          }`}
          title={isConnected ? "XRPL Connected" : "XRPL Disconnected"}
        ></div>
        <span className="text-xs text-white/60 uppercase tracking-wider">
          XRPL
        </span>
      </div>
    </div>
  );
}
