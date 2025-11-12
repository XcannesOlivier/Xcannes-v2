export default function BuyXCSSection() {
  return (
    <section className="relative w-screen to-white pt-5 pb-5 px-4 sm:px-6 text-black overflow-hidden font-montserrat font-[300]">
      {/* Background image */}
      <div className="absolute inset-0 bg-xcannes-background animate-fade-in"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl text-xcannes-green font-orbitron font-[500] mb-3 animate-slide-down">
          Comment acheter du XCS ?
        </h2>

        <p className="text-base sm:text-lg text-white/80 font-[400] mb-10 sm:mb-12 animate-fade-in">
          Démarrez votre parcours Web3 en 3 étapes simples !
        </p>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-left">
          {/* Étape 1 */}
          <div className="relative overflow-hidden bg-xcannes-background text-white/90 shadow-2xl border-l-4 border-xcannes-green rounded-lg p-5 group hover:shadow-xcannes-green/20 transition-all duration-300">
            {/* Gros numéro en arrière-plan */}
            <div className="absolute -top-4 -right-4 text-[120px] font-orbitron font-bold text-xcannes-green/10 group-hover:text-xcannes-green/20 transition-colors duration-300 select-none">
              01
            </div>

            <h3 className="relative text-lg sm:text-xl text-xcannes-green font-[500] mb-2">
              Installez un wallet XRPL
            </h3>
            <p className="relative mb-4 text-sm text-white/70">
              Téléchargez un wallet compatible avec le XRP Ledger comme{" "}
              <strong>Xaman (ex-Xumm)</strong> puis créez et sécurisez votre
              portefeuille pour recevoir vos tokens.
            </p>
            <div className="relative flex flex-col items-start gap-2">
              <a
                href="https://xumm.app/?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="justify-content text-sm font-[500] text-white bg-xcannes-green/80 px-4 py-2 rounded transition transform duration-300 hover:scale-105 text-center"
              >
                Installer le Wallet
              </a>
              <a
                href="/activate-wallet"
                className="justify-content text-sm font-[500] text-white bg-xcannes-green/80 px-4 py-2 rounded transition transform duration-300 hover:scale-105 text-center"
              >
                Activer le Wallet Xaman
              </a>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="relative overflow-hidden bg-xcannes-background text-white/90 shadow-2xl border-l-4 border-xcannes-green rounded-lg p-5 group hover:shadow-xcannes-green/20 transition-all duration-300">
            {/* Gros numéro en arrière-plan */}
            <div className="absolute -top-4 -right-4 text-[120px] font-orbitron font-bold text-xcannes-green/10 group-hover:text-xcannes-green/20 transition-colors duration-300 select-none">
              02
            </div>

            <h3 className="relative text-lg sm:text-xl text-xcannes-green font-[500] mb-2">
              Ajoutez la Trustline
            </h3>
            <p className="relative mb-4 text-sm text-white/70">
              Ajoutez une trustline pour autoriser votre wallet à recevoir le
              jeton XCS en toute sécurité.
            </p>
            <a
              href="https://xrpl.services?issuer=rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx&currency=XCS&limit=2006400"
              className="relative inline-block text-sm font-[500] text-white bg-xcannes-green/80 px-4 py-2 rounded transition transform duration-300 hover:scale-105"
            >
              Ajouter la Trustline
            </a>
          </div>

          {/* Étape 3 */}
          <div className="relative overflow-hidden bg-xcannes-background text-white/90 shadow-2xl border-l-4 border-xcannes-green rounded-lg p-5 group hover:shadow-xcannes-green/20 transition-all duration-300">
            {/* Gros numéro en arrière-plan */}
            <div className="absolute -top-4 -right-4 text-[120px] font-orbitron font-bold text-xcannes-green/10 group-hover:text-xcannes-green/20 transition-colors duration-300 select-none">
              03
            </div>

            <h3 className="relative text-lg sm:text-xl text-xcannes-green font-[500] mb-2">
              Achetez du XCS
            </h3>
            <p className="relative mb-4 text-sm text-white/70">
              Achetez vos tokens XCS directement via notre DEX ou auprès de
              partenaires centralisés comme Bitrue.
            </p>
            <a
              href="/dex"
              className="relative inline-block text-sm font-[500] text-white bg-xcannes-green/80 px-4 py-2 rounded transition transform duration-300 hover:scale-105"
            >
              Acheter sur XCannes Dex
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
