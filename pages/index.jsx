import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import FooterPro from "../components/FooterPro";
import Link from "next/link";
import FAQSection from "../components/FAQSection";
import TokenomicsSection from "../components/TokenomicsSection";
import TrustlineBlock from "../components/TrustlineBlock";
import AltPaymentBlock from "../components/AltPaymentBlock";
import CreatorWalletBlock from "../components/CreatorWalletBlock";
import BuyXCSSection from "../components/BuyXCSSection.jsx";
import NotreVisionBlock from "../components/NotreVisionBlock";
import SEOHead from "../components/SEOHead";
import PriceTicker from "../components/PriceTicker";

const PAIRS = ["XCS/XRP", "XCS/USD", "XCS/EUR", "XCS/RLUSD", "XRP/RLUSD"];

export default function Home() {
  return (
    <>
      <SEOHead
        title="XCannes - Digital Asset Exchange on XRP Ledger"
        description="Trade XCS tokens instantly. Fast, secure, transparent blockchain exchange built on XRPL technology."
        canonical="/"
      />

      <Header />

      {/* HERO SECTION ULTRA-MODERNE */}
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-xcannes-background">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-xcannes-green/5 via-transparent to-blue-500/5 animate-gradient" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-xcannes-green/10 border border-xcannes-green/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-xcannes-green rounded-full animate-pulse" />
            <span className="text-sm text-xcannes-green font-medium">
              Built on XRP Ledger
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-orbitron font-bold text-white mb-6 pb-4 leading-snug sm:leading-snug md:leading-snug lg:leading-snug">
            The Future of
            <span className="block bg-gradient-to-r from-xcannes-green via-emerald-400 to-green-500 bg-clip-text text-transparent">
              Digital Finance
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Trade XCS tokens with institutional-grade security.
            <br className="hidden sm:block" />
            Fast settlements, low fees, powered by blockchain technology.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link href="/dex">
              <button className="group relative px-8 py-4 bg-xcannes-green hover:bg-xcannes-green/90 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-xcannes-green/20">
                <span className="relative z-10">Start Trading</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
            <Link href="/whitepaper">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 text-white font-semibold rounded-lg transition-all duration-300">
                Read Whitepaper →
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "100M", label: "Total Supply", suffix: "" },
              { value: "<1", label: "Transaction Time", suffix: "s" },
              { value: "24/7", label: "Trading Available", suffix: "" },
              { value: "0.01", label: "Network Fees", suffix: "XRP" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-xcannes-green/40 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-2">
                  {stat.value}
                  <span className="text-xcannes-green">{stat.suffix}</span>
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Ticker - Full Width */}
        <PriceTicker pairs={PAIRS} />
      </main>

      {/* CONTENT SECTIONS */}
      <div className="bg-xcannes-background">
        <NotreVisionBlock />
        <BuyXCSSection />
        <TokenomicsSection />
        <TrustlineBlock />
        <FAQSection />
      </div>

      <FooterPro />
    </>
  );
}
