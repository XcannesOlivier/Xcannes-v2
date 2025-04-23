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
    <header className={`w-full h-16 fixed top-0 left-0 z-50 px-4 flex items-center justify-between font-montserrat font-[300] transition duration-300 ${
      scrolled ? "bg-black/70 backdrop-blur-sm" : "bg-black/90"
    } text-white`}>
      <Link href={isDex ? "/" : "/dex"}>
        <div className="flex items-center gap-0 h-full">
          <img
            src="/assets/img/ui/navHeader.png"
            alt="Logo XCS"
            className="h-32 sm:h-34 md:h-36 lg:h-38 object-contain transition-all duration-300"
          />
          <span className={`text-base sm:text-lg md:text-xl font-bold ml-0 ${isDex ? "text-xcannes-green" : "text-xcannes-blue-light"}`}>
            {isDex ? "DEX" : "Home"}
          </span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-6 font-[400]">
        <Link href={isDex ? "/" : "/dex"} className="transition transform hover:scale-105 duration-300">
          {isDex ? "home" : "DEX"}
        </Link>

        <Link href="/communauté" className="block text-xs sm:text-sm text-center font-medium text-white transition transform hover:scale-105 duration-300 hover:text-white">
          Communauté
        </Link>

        {isDex ? (
          <Link href="/mxga" className="transition transform hover:scale-105 duration-300">
            Vision
          </Link>
        ) : (
          <div className="relative group">
            <a href="#vision" className="cursor-pointer transition transform hover:scale-105 hover:text-xcannes-green duration-300">
              Vision
            </a>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap">
              Découvrez notre vision
            </div>
          </div>
        )}

<div className="flex gap-2 items-center">
  {["fr", "en", "es", "ja"].map((lng) => (
    <button
      key={lng}
      onClick={() => router.push(router.pathname, router.asPath, { locale: lng })}
      className={`w-6 h-4 relative transition transform hover:scale-110 ${
        router.locale === lng ? "opacity-100" : "opacity-40"
      }`}
    >
      <img
        src={`/assets/img/flags/${lng}.png`}
        alt={lng}
        className="w-full h-full object-cover rounded-sm"
      />
    </button>
  ))}
</div>


        <XummConnectButton small />
      </nav>

      <button className="md:hidden text-white text-2xl focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-black/70 backdrop-blur-sm text-white flex flex-col items-center gap-4 py-4 md:hidden transition-opacity duration-500 opacity-0 animate-fade-in font-[400]">
          <Link href={isDex ? "/" : "/dex"} onClick={() => setMenuOpen(false)}>
            {isDex ? "home" : "DEX"}
          </Link>
          <Link href="/communauté" onClick={() => setMenuOpen(false)}>Communauté</Link>
          {isDex ? (
            <Link href="/mxga" onClick={() => setMenuOpen(false)}>Vision</Link>
          ) : (
            <div className="relative group">
              <a href="#vision" onClick={() => setMenuOpen(false)} className="hover:text-xcannes-green transition">
                Vision
              </a>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none whitespace-nowrap">
                Découvrez notre vision
              </div>
            </div>
          )}
          <div className="flex gap-2 items-center">
  {["fr", "en", "es", "ja"].map((lng) => (
    <button
      key={lng}
      onClick={() => router.push(router.pathname, router.asPath, { locale: lng })}
      className={`w-6 h-4 relative transition transform hover:scale-110 ${
        router.locale === lng ? "opacity-100" : "opacity-40"
      }`}
    >
      <img
        src={`/assets/img/flags/${lng}.png`}
        alt={lng}
        className="w-full h-full object-cover rounded-sm"
      />
    </button>
  ))}
</div>

          <XummConnectButton small />
        </div>
      )}
    </header>
  );
}
