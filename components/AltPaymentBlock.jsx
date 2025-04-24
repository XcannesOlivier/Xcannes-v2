import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { stripePromise } from "../lib/stripe";
import { useXumm } from "../context/XummContext";
import XummConnectButton from "./XummConnectButton";

export default function AltPaymentBlock({ title = "Accédez à XCS en toute simplicité" }) {
  const router = useRouter();
  const isDex = router.pathname === "/dex";
  const blockRef = useRef();
  const [visible, setVisible] = useState(false);

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

  return (
    <div
      ref={blockRef}
      className={`p-6 rounded-xl my-10 text-center mt-0 mb-0 text-white font-montserrat font-[400] items-start border ${
        isDex ? "bg-black/80" : "bg-black"
      } ${isDex ? "" : "border border-white border-opacity-50"} ${visible ? "visible" : ""}`}
      style={isDex ? { borderColor: "rgba(174, 175, 174, 0.5)" } : {}}
    >
      <h2 className="text-2xl font-orbitron font-[500] mb-4" style={{ color: "#16b303" }}>
        Accédez à{" "}
        <span className="inline-flex items-baseline">
          <img
            src="/assets/img/ui/navHeadergreen.png"
            alt="X"
            className="
              inline-block 
              h-[1.3em] sm:h-[1.3em] md:h-[1.3em] 
              w-auto 
              translate-y-[7px] sm:translate-y-[7px] md:translate-y-[8px] 
              -mr-[7px] sm:-mr-[7px] md:-mr-[7px] 
              brightness-110 saturate-150
            "
          />
          CS en toute simplicité
        </span>
      </h2>

      <p className="mb-4 text-gray-300 text-sm">par carte bancaire, ApplePay ...</p>

      <div
        className={`flex justify-center gap-2 mb-6 rounded-xl p-0 ${
          isDex ? "bg-black/10 " : "bg-black"
        }`}
      >
        {[
          { alt: "Visa", src: "visa.png" },
          { alt: "MasterCard", src: "mastercard.png" },
          { alt: "Apple Pay", src: "applepay.png" }
        ].map(({ alt, src }) => (
          <div
            key={alt}
            className="bg-transparent rounded-lg p-3 shadow-sm transition-transform duration-500 ease-in-out hover:scale-150"
          >
            <img
              src={`/assets/img/payments/${src}`}
              alt={alt}
              className="w-15 h-15 object-contain"
            />
          </div>
        ))}
      </div>

      <button
        onClick={async () => {
          const stripe = await stripePromise;
          const res = await fetch("/api/create-checkout-session", {
            method: "POST",
          });
          const { id } = await res.json();
          const result = await stripe.redirectToCheckout({ sessionId: id });
          if (result.error) console.error(result.error.message);
        }}
        className="bg-xcannes-green text-white font-montserrat font-[500] px-6 py-2 border border-xcannes-green rounded transition duration-300 transform hover:scale-105"
      >
        Acheter par Carte / ApplePay
      </button>

      <p className="mt-3 text-xs text-xcannes-yellow italic">
        {isConnected
          ? "✅ Votre wallet est connecté, vous recevrez vos XCS automatiquement après le paiement."
          : "⚠️ Pour recevoir vos XCS après paiement, veuillez connecter votre wallet XRPL ou fournir votre adresse."}
      </p>

      {!isConnected && (
        <div className="mt-3">
          <XummConnectButton />
        </div>
      )}
    </div>
  );
}
