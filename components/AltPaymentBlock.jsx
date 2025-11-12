"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { stripePromise } from "../lib/stripe";
import { useXumm } from "../context/XummContext";

export default function AltPaymentBlock({
  title = "Buy XCS with Fiat Currency",
}) {
  const router = useRouter();
  const isDex = router.pathname === "/dex";
  const blockRef = useRef();
  const [visible, setVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isConnected } = useXumm();

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

  const paymentMethods = [
    { name: "Visa", logo: "/assets/img/payments/visa.png" },
    { name: "MasterCard", logo: "/assets/img/payments/mastercard.png" },
    { name: "Apple Pay", logo: "/assets/img/payments/applepay.png" },
  ];

  return (
    <div
      ref={blockRef}
      className={`bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10 text-center">
        <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
          Buy XCS with Fiat
        </h2>
        <p className="text-sm text-white/60">
          Purchase XCS tokens using credit card or Apple Pay
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Payment Methods Grid */}
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40 mb-3 text-center">
            Accepted Payment Methods
          </p>
          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="group bg-white/5 rounded-lg p-4 border border-white/10 hover:border-xcannes-green/40 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-center h-16">
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Connection Status */}
        {isConnected ? (
          <div className="bg-xcannes-green/10 border border-xcannes-green/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✓</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-xcannes-green mb-1">
                  Wallet Connected
                </p>
                <p className="text-xs text-white/60">
                  Your XCS tokens will be sent directly to your connected wallet
                  after payment.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ⓘ</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-400 mb-1">
                  Optional: Connect Wallet
                </p>
                <p className="text-xs text-white/60">
                  Connect your XRPL wallet in the header for automatic delivery,
                  or simply provide your address during checkout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-xcannes-green hover:bg-xcannes-green/90 text-black font-semibold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>��</span>
              <span>Buy with Card / Apple Pay</span>
            </>
          )}
        </button>

        {/* Info Footer */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            Powered by Stripe • Secure Checkout
          </p>
        </div>
      </div>
    </div>
  );
}
