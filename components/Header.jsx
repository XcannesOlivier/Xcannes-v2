import Link from "next/link";
import XummConnectButton from "./XummConnectButton";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Header() {
  const router = useRouter();
  const isDex = router.pathname === "/dex";
  const isHome = router.pathname === "/";

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const changeLanguage = (e) => {
    const newLocale = e.target.value;
    if (newLocale !== router.locale) {
      router.push(router.pathname, router.asPath, { locale: newLocale });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full h-16 fixed top-0 left-0 z-50 px-6 flex items-center justify-between font-montserrat transition-all duration-300 border-b ${
        scrolled
          ? "bg-black/95 backdrop-blur-md border-white/10"
          : "bg-black/80 backdrop-blur-sm border-white/5"
      } text-white`}
    >
      {/* Logo simple texte style banque suisse */}
      <Link href="/">
        <div className="flex items-center gap-3 group">
          <span className="text-xl md:text-2xl font-orbitron font-bold tracking-tight text-white group-hover:text-xcannes-green transition-colors duration-300">
            XCANNES
          </span>
          <span className="hidden md:inline text-xs text-white/40 font-light">
            | Digital Asset Exchange
          </span>
        </div>
      </Link>

      {/* Navigation épurée */}
      <nav className="hidden md:flex items-center gap-8 font-[300] text-sm">
        <Link
          href={isDex ? "/" : "/dex"}
          className="hover:text-xcannes-green transition-colors duration-200"
        >
          {isDex ? "Home" : "Trading"}
        </Link>

        <select
          onChange={changeLanguage}
          value={router.locale}
          className="bg-transparent border border-white/20 text-white text-xs rounded px-3 py-1.5 cursor-pointer hover:border-white/40 transition-colors duration-200 focus:outline-none focus:border-xcannes-green"
          aria-label="Sélectionner la langue"
        >
          <option value="fr" className="bg-black">
            FR
          </option>
          <option value="en" className="bg-black">
            EN
          </option>
          <option value="es" className="bg-black">
            ES
          </option>
          <option value="ja" className="bg-black">
            JA
          </option>
        </select>

        {isDex && <XummConnectButton small />}
      </nav>

      {/* Menu mobile minimaliste */}
      <button
        className="md:hidden text-white text-2xl focus:outline-none hover:text-xcannes-green transition-colors"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? "×" : "☰"}
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/95 backdrop-blur-md text-white flex flex-col items-center gap-6 py-8 md:hidden border-b border-white/10">
          <Link
            href={isDex ? "/" : "/dex"}
            onClick={() => setMenuOpen(false)}
            className="hover:text-xcannes-green transition-colors"
          >
            {isDex ? "Home" : "Trading"}
          </Link>

          <select
            onChange={changeLanguage}
            value={router.locale}
            className="bg-transparent border border-white/20 text-white text-xs rounded px-3 py-1.5 cursor-pointer"
          >
            <option value="fr" className="bg-black">
              🇫🇷 Français
            </option>
            <option value="en" className="bg-black">
              �� English
            </option>
            <option value="es" className="bg-black">
              🇪🇸 Español
            </option>
            <option value="ja" className="bg-black">
              🇯🇵 日本語
            </option>
          </select>

          {isDex && <XummConnectButton small />}
        </div>
      )}
    </header>
  );
}
