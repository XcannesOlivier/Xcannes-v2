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
        isDex ? "bg-gradient-to-b from-[#202320] to-black " : "bg-gradient-to-b from-[#202320] to-black"
      }`      }
    >
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 text-center md:text-center">
        <div className="space-y-2 order-1">
          <h4 className="font-semibold text-white">Pages</h4>
          <ul className="text-sm space-y-1">
            <li><Link href="/disclaimer">Disclaimer</Link></li>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/dex">Dex</Link></li>
            <div className="mt-6">
              <a
                href="/whitepaper"
                className="inline-block  text-white font-medium py-2 px-6 rounded-xl hover:text-white transition duration-300 transform hover:scale-105 hover:shadow-xl shadow-md"
              >
                📖 Livre Blanc
              </a>
            </div>
            <li>
  <Link
    href="/games"
    className="flex items-center justify-center gap-1 text-xs sm:text-sm font-medium text-white transition transform hover:scale-105 duration-300  ease-in-out"
  >
    
    <span className="text-center leading-tight">
    ♦️Dragon<br />Casino♥️
    </span>
  </Link>
</li>

            <div className="mt-6">
              <a
                href="/tokenomics"
                className="inline-block text-white font-bold py-2 px-6 rounded-xl  hover:text-white transition duration-300 transform hover:scale-105 hover:shadow-xl shadow-md"
              >
                📊 Tokenomics
              </a>
            </div>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1 flex flex-col items-center justify-center order-3 md:order-2">
          <img
            src="/assets/img/ui/dragonshort.png"
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
                <img src={`/assets/img/socials/${s.icon}`} alt={s.name} className="w-6 h-6" />
              </a>
            ))}
          </div>

          <a
            href="/donate"
            className="inline-block bg-xcannes-green text-white font-medium py-2 px-6 rounded-xl hover:bg-lime-500 transition"
          >
            Onboard now
          </a>

          <p className="text-sm mt-4">Email : <a href="mailto:xcannesdao@gmail.com" className="underline">xcannesdao@gmail.com</a></p>

          {isConnected && (
  <p className="text-xs text-white mt-4">
    🔗 Connecté à XUMM : <span className="break-all">{wallet}</span>
  </p>
)}

        </div>

        <div className="space-y-2 order-2 md:order-3">
          <h4 className="font-semibold text-white">Links</h4>
          <ul className="text-sm space-y-1">
            <li><a href="https://coinmarketcap.com" target="_blank" rel="noreferrer">CoinMarketCap</a></li>
            <li><a href="https://coingecko.com" target="_blank" rel="noreferrer">CoinGecko</a></li>
            <li><a href="https://xrpscan.com" target="_blank" rel="noreferrer">XrpScan</a></li>
            <li><a href="https://firstledger.dev" target="_blank" rel="noreferrer">FirstLedger</a></li>
            <li><a href="https://dexscreener.com/xrpl" target="_blank" rel="noreferrer">DexScreener</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-white mt-6">
        &copy;  {new Date().getFullYear()} -Xcannes LLC – Delaware, USA  
[Company Registration Lookup](https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx)  
Powered by XRP Ledger – Built for Sovereignty

      </div>




    </footer>
  );
}
