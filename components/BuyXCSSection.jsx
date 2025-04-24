export default function BuyXCSSection() {
  return (
    <section className="relative w-screen to-white py-0 px-4 sm:px-6 text-black overflow-hidden font-montserrat font-[300]">
      {/* Background image */}
      <div
        className="absolute inset-0  animate-fade-in"
        style={{
          backgroundImage: "url('/assets/img/bg-buy-xcs1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      ></div>

     <div className="relative max-w-5xl mx-auto text-center">
     <h2 className="text-3xl sm:text-4xl text-[#16b303] font-orbitron font-[500] mb-3 animate-slide-down">
  Comment acheter du{" "}
  <span className="inline-flex items-baseline">
    <img
      src="/assets/img/ui/navHeadergreen.png"
      alt="X"
      className="
  h-[1.4em] sm:h-[1.4em] md:h-[1.4em] 
  w-auto 
  translate-y-[11px] sm:translate-y-[13px] md:translate-y-[13px] 
  -mr-[8px] sm:-mr-[9px] md:-mr-[10px] 
  brightness-110 saturate-150
"
    />
    CS ?
  </span>
</h2>

        <p className="text-base sm:text-lg text-[white] font-[500] mb-10 sm:mb-12 animate-fade-in">
        Démarrez votre parcours Web3 en 3 étapes simples !
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-left">
          {/* Étape 1 */}
          <div className="bg-[#202320] text-white shadow-2xl border-l-4 border-[#16b303] rounded-lg p-5 hover:shadow-2xl transition hover:scale-[1.02] ">
            <h3 className="text-lg sm:text-xl font-[500] mb-2">1. Installez un wallet XRPL</h3>
            <p className="mb-4 text-sm">
            Téléchargez un wallet compatible avec le XRP Ledger comme <strong>Xaman (ex-Xumm)</strong> puis créez et sécurisez votre portefeuille pour recevoir vos tokens.
            </p>
            <div className="flex flex-col items-start  gap-2">
           
  <a
    href="https://xumm.app/?lang=en"
    target="_blank"
    rel="noopener noreferrer"
    className="justify-content text-sm font-[500] text-white bg-[#16b303] px-4 py-2 rounded transition transform duration-300 hover:scale-105 text-center"
  >
    Installer le Wallet
  </a>
  <a
    href="/activate-wallet"
    className="justify-content text-sm font-[500] text-white bg-[#16b303] px-4 py-2 rounded transition transform duration-300 hover:scale-105 text-center"
  >
    Activer le Wallet Xaman
    </a>
    </div>
    </div>


          {/* Étape 2 */}
          <div className="bg-[#202320] text-white shadow-2xl border-1-4 border-[#16b303] rounded-lg p-5 hover:shadow-2xl transition hover:scale-[1.02] ">
            <h3 className="text-lg sm:text-xl font-[500] mb-2">2. Ajoutez la Trustline</h3>
            <p className="mb-4 text-sm">
            Ajoutez une trustline pour autoriser votre wallet à recevoir le jeton XCS en toute sécurité.
            </p>
            <a
              href="https://xrpl.services?issuer=rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx&currency=XCS&limit=2006400"
              className="inline-block text-sm font-[500] text-white bg-[#16b303] px-4 py-2 rounded transition transform duration-300 hover:scale-105"
            >
              Ajouter la Trustline
            </a>
          </div>

          {/* Étape 3 */}
          <div className="bg-[#202320] text-white shadow-2xl border-l-4 border-[#16b303] rounded-lg p-5 hover:shadow-2xl transition hover:scale-[1.02] ">
            <h3 className="text-lg sm:text-xl font-[500] mb-2">3. Achetez du XCS</h3>
            <p className="mb-4 text-sm">
            Achetez vos tokens XCS directement via notre DEX ou auprès de partenaires centralisés comme Bitrue.
            </p>
            <a
              href="/dex"
              className="inline-block text-sm font-[500] text-white bg-[#16b303] px-4 py-2 rounded transition transform duration-300 hover:scale-105"
            >
              Acheter sur XCannes Dex
            </a>
          </div>
        </div>

        {/* Logos partenaires */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-5 items-center">
          <a
            href="https://xumm.app/?lang=en"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center opacity-100 hover:opacity-100 hover:scale-150 transition duration-500 ease-in-out cursor-pointer"
          >
            <img
              src="/assets/img/socials/logoxummblue.png"
              alt="Xaman"
              className="h-12 w-20 sm:h-12 sm:w-20 mx-auto mb-2"
            />
            <p className="text-xs text-white">Xaman Wallet</p>
          </a>

          <a
            href="https://www.youtube.com/@xcannes"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center opacity-100 hover:opacity-100 hover:scale-150 transition duration-500 ease-in-out cursor-pointer"
          >
            <img
              src="/assets/img/socials/youtube-transparent.png"
              alt="YouTube"
              className="h-12 w-[80px] max-w-[80px] mx-auto mb-1"
            />
            <p className="text-xs text-white">Tutoriels Vidéo</p>
          </a>

          <a
            href="/dex"
            className="block text-center opacity-100 hover:opacity-100 hover:scale-150 transition duration-500 ease-in-out cursor-pointer"
          >
            <img
              src="/assets/img/socials/logoxcannesdexred.png"
              alt="XCannes DEX"
              className="h-12 w-[80px] max-w-[80px] mx-auto mb-1"
            />
            <p className="text-xs text-white">XCannes DEX</p>
          </a>

          <a
            href="https://www.bitrue.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center opacity-100 hover:opacity-100 hover:scale-150 transition duration-500 ease-in-out cursor-pointer"
          >
            <img
              src="/assets/img/socials/logobitrue.jpg"
              alt="Bitrue"
              className="h-12 w-20 sm:h-12 sm:w-20 mx-auto mb-2"
            />
            <p className="text-xs text-white">Bitrue CEX</p>
          </a>
        </div>
      </div>
    </section>
  );
}
