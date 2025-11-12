"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { stripePromise } from "../lib/stripe";
import { useXumm } from "../context/XummContext";

export default function SetupPanel() {
  const router = useRouter();
  const { isConnected } = useXumm();
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visible, setVisible] = useState(false);
  const blockRef = useRef();

  const trustlineData = {
    issuer: "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx",
    currency: "XCS",
    limit: "2006400",
  };

  const trustlineURL = `https://xrpl.services?issuer=${trustlineData.issuer}&currency=${trustlineData.currency}&limit=${trustlineData.limit}`;

  const paymentMethods = [
    { name: "Visa", logo: "/assets/img/payments/visa.png" },
    { name: "MasterCard", logo: "/assets/img/payments/mastercard.png" },
    { name: "Apple Pay", logo: "/assets/img/payments/applepay.png" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (blockRef.current) observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie:", err);
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const { id } = await res.json();
      const result = await stripe.redirectToCheckout({ sessionId: id });
      if (result.error) {
        console.error(result.error.message);
        alert("Payment error: " + result.error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      ref={blockRef}
      className={`bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-orbitron font-bold text-white mb-2 text-center">
          Get Started with XCS
        </h2>
        <p className="text-sm text-white/60 text-center">
          Add trustline or purchase tokens with fiat currency
        </p>
      </div>

      {/* Content Grid: 2 colonnes */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {/* COLONNE 1 : Fiat Purchase */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white/60"></div>
            <h3 className="text-lg font-orbitron font-bold text-white">
              Buy with Fiat
            </h3>
          </div>

          {/* Payment Methods */}
          <div>
            <p className="text-xs uppercase tracking-wider text-white/40 mb-3">
              Accepted Payments
            </p>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="group bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-center h-12">
                    <img
                      src={method.logo}
                      alt={method.name}
                      className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wallet Status */}
          {isConnected ? (
            <div className="bg-xcannes-green/10 border border-xcannes-green/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">✓</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-xcannes-green mb-1">
                    Wallet Connected
                  </p>
                  <p className="text-xs text-white/60">
                    Tokens will be sent to your wallet after payment.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">ℹ️</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white/80 mb-1">
                    Optional: Connect Wallet
                  </p>
                  <p className="text-xs text-white/60">
                    Connect in header or provide address at checkout.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Button */}
          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Processing...</span>
              </>
            ) : (
              <>
                <span>�</span>
                <span className="text-sm">Buy with Card / Apple Pay</span>
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-xs text-white/40 text-center">
            Powered by Stripe • Secure Checkout
          </p>
        </div>

        {/* COLONNE 2 : Trustline Setup */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-xcannes-green"></div>
            <h3 className="text-lg font-orbitron font-bold text-white">
              Add Trustline
            </h3>
          </div>

          {/* Trustline Info Cards */}
          <div className="space-y-2">
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

            <div className="grid grid-cols-2 gap-2">
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
          </div>

          {/* Trustline Actions */}
          <div className="space-y-2">
            <a
              href={trustlineURL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full bg-xcannes-green hover:bg-xcannes-green/90 text-black font-semibold px-4 py-3 rounded-lg transition-all group"
            >
              <span className="flex items-center gap-2 text-sm">
                <span>🔗</span>
                <span>Add via XRPL Services</span>
              </span>
              <span className="opacity-60 group-hover:opacity-100">→</span>
            </a>

            <button
              onClick={() => handleCopy(trustlineURL)}
              className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg transition-all text-sm"
            >
              <span>{copied ? "✓" : "�"}</span>
              <span>{copied ? "Copied!" : "Copy URL"}</span>
            </button>
          </div>

          {/* Trustline Info */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-white/70 leading-relaxed">
              A trustline allows your wallet to hold XCS tokens. Setup once per
              wallet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
