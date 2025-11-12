import { useXumm } from "../context/XummContext";

export default function XummConnectButton({ small = false }) {
  const { wallet, isConnected, connect, disconnect } = useXumm();

  if (isConnected) {
    return (
      <div className="inline-flex items-center gap-3">
        {/* Badge connecté */}
        <div
          className={`flex items-center gap-3 ${
            small ? "px-4 py-2" : "px-6 py-3"
          } bg-xcannes-green/10 border border-xcannes-green/30 rounded-lg backdrop-blur-sm`}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-xcannes-green animate-pulse" />
            <span
              className={`${
                small ? "text-xs" : "text-sm"
              } font-medium text-xcannes-green`}
            >
              Connecté
            </span>
          </div>
          <span
            className={`${
              small ? "text-xs" : "text-sm"
            } font-mono text-white/60`}
          >
            {wallet.slice(0, 6)}...{wallet.slice(-4)}
          </span>
        </div>

        {/* Bouton déconnexion */}
        <button
          onClick={disconnect}
          className={`${
            small ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
          } bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 border border-white/10 hover:border-red-500/40 rounded-lg font-medium transition-all duration-300`}
          aria-label="Se déconnecter du wallet"
        >
          <span className="hidden sm:inline">Déconnecter</span>
          <span className="sm:hidden">✕</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className={`${
        small ? "px-4 py-1.5 text-xs" : "px-5 py-2 text-sm"
      } bg-[#3052ff] hover:bg-[#2642d9] text-white font-medium rounded-lg transition-all duration-200`}
      aria-label="Connecter votre wallet XRPL"
    >
      Connecter Wallet
    </button>
  );
}
