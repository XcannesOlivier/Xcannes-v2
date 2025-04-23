import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useXumm } from "../context/XummContext";

export default function FooterPro() {
  const router = useRouter();
  const isDex = router.pathname === "/dex";
  const { wallet, isConnected } = useXumm();

  const socials = [
    { name: "Twitter", icon: "twitter.png", url: "#" },
    { name: "YouTube", icon: "youtube.png", url: "#" },
    { name: "Instagram", icon: "instagram.png", url: "#" },
    { name: "TikTok", icon: "tictoc.png", url: "#" },
    { name: "Facebook", icon: "facebook.png", url: "#" },
  ];

  return (
    <footer
      className={`w-screen max-w-none text-white pt-12 pb-8 px-6 mb-0 relative overflow-hidden ${
        isDex
          ? "bg-gradient-to-b from-[#202320] to-black"
          : "bg-gradient-to-b from-[#202320] to-black"
      }`}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 text-center md:text-center">
        {/* Colonne 1 - Pages */}
        <div className="space-y-2 order-1">
  <h4 className="font-bold text-white">Espaces</h4>
  <ul className="text-sm font-medium space-y-1">
    {[
      { href: "/", label: "Home" },
      { href: "/dex", label: "Dex" },
      { href: "/communauté", label: "Rejoignez nous" },
      { href: "/whitepaper", label: "Livre Blanc" },
      { href: "/tokenomics", label: "Tokenomics" },
      { href: "/XCannes,LLC", label: "XCannes,LLC" },
    ]
    .filter(({ href }) => href !== router.pathname) // 👈 filtre dynamique
    .map(({ href, label }) => (
      <li key={href}>
        <Link
          href={href}
          className="inline-block transition-transform duration-200 hover:scale-105 hover:text-xcannes-green"
        >
          {label}
        </Link>
      </li>
    ))}
  </ul>
</div>

        {/* Colonne 2 - Logo + Réseaux + Wallet */}
        <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center order-3 md:order-2">
          <img
            src="/assets/img/ui/dragon-mascotte.png"
            alt="Mascotte Xcannes"
            className="w-32 md:w-40 max-w-full object-contain mb-4"
          />

          <div className="flex gap-3 flex-wrap justify-center mb-6">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="transition-transform transform hover:scale-125"
              >
                <img
                  src={`/assets/img/socials/${s.icon}`}
                  alt={s.name}
                  className="w-6 h-6"
                />
              </a>
            ))}
          </div>

          <a
            href="/disclaimer"
            className="inline-block text-white text-sm font-medium py-2 px-6 rounded-xl hover:scale-105 transition"
          >
            Mention légale
          </a>

          <p className="text-sm mt-4">
            Email :{" "}
            <a href="mailto:xcannesdao@gmail.com" className="underline">
              xcannesdao@gmail.com
            </a>
          </p>

          {isConnected && (
            <p className="text-xs text-white mt-4 break-all">
              🔗 Connecté à XUMM : {wallet}
            </p>
          )}
        </div>

        {/* Colonne 3 - Liens externes */}
        <div className="space-y-2 order-2 md:order-3">
  <h4 className="font-bold text-white">Portails</h4>
  <ul className="text-sm font-medium space-y-1">
    {[
      { label: "CoinMarketCap", url: "https://coinmarketcap.com" },
      { label: "Info Compagnie", url: "https://coingecko.com" },
      { label: "XrpScan", url: "https://xrpscan.com" },
      { label: "FirstLedger", url: "https://firstledger.dev" },
      { label: "DexScreener", url: "https://dexscreener.com/xrpl" },
    ].map(({ label, url }) => (
      <li key={url}>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-block transition-transform duration-200 hover:scale-105 hover:text-xcannes-green"
        >
          {label}
        </a>
      </li>
    ))}
  </ul>
</div>
</div>
      {/* Footer final */}
      <div className="text-center text-xs text-white mt-6">
  &copy; {new Date().getFullYear()} - XCannes LLC – Delaware, USA –
  <a
    href="https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx"
    target="_blank"
    rel="noopener noreferrer"
    className="underline underline-offset-2 hover:text-xcannes-green ml-1"
  >
    Reg. No. 10157026
  </a>
  <br />
  Powered on XRP Ledger – Created to simplify Web3
</div>

    </footer>
  );
}
