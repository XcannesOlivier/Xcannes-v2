"use client";

import { useState } from "react";

export default function TrustlineDex() {
  const [copied, setCopied] = useState(false);
  
  const trustlineData = {
    issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
    currency: "XCS",
    limit: "2006400"
  };
  
  const trustlineURL = `https://xrpl.services?issuer=${trustlineData.issuer}&currency=${trustlineData.currency}&limit=${trustlineData.limit}`;

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie:", err);
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-xcannes-green"></div>
          <h3 className="text-lg font-orbitron font-bold text-white">Add Trustline</h3>
        </div>
        <p className="text-xs text-white/40 mt-1">Required to trade XCS tokens</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        
        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Issuer</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-white truncate flex-1">
                {trustlineData.issuer}
              </p>
              <button
                onClick={() => handleCopy(trustlineData.issuer)}
                className="text-white/60 hover:text-xcannes-green transition-colors text-xs"
                title="Copy issuer"
              >
                📋
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Currency</p>
            <p className="text-sm font-semibold text-xcannes-green">
              {trustlineData.currency}
            </p>
          </div>

          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-xs text-white/40 mb-1">Trust Limit</p>
            <p className="text-sm font-semibold text-white">
              {parseInt(trustlineData.limit).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          {/* XRPL Services Button */}
          <a
            href={trustlineURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-xcannes-green hover:bg-xcannes-green/90 text-black font-semibold px-4 py-3 rounded-lg transition-all group"
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">🔗</span>
              <span>Add via XRPL Services</span>
            </span>
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">→</span>
          </a>

          {/* Copy URL Button */}
          <button
            onClick={() => handleCopy(trustlineURL)}
            className="flex items-center justify-between w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-3 rounded-lg transition-all group"
          >
            <span className="flex items-center gap-2 text-sm">
              <span>{copied ? "✓" : "📋"}</span>
              <span className="truncate">{copied ? "Copied!" : "Copy Trustline URL"}</span>
            </span>
            {copied && (
              <span className="text-xcannes-green text-xs font-semibold">Success</span>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="flex-1">
              <p className="text-sm text-white/80 leading-relaxed">
                A trustline allows your wallet to hold XCS tokens. You only need to set this up once per wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Quick Steps</p>
          <div className="space-y-2">
            {[
              "Connect your XRPL wallet (XUMM recommended)",
              "Click 'Add via XRPL Services' button",
              "Confirm the trustline in your wallet",
              "Start trading XCS tokens!"
            ].map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-white/60">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-xcannes-green/20 text-xcannes-green flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
