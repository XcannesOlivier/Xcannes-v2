import { createContext, useContext, useEffect, useState } from "react";

// On n'utilise plus le SDK XUMM côté client
// Toutes les interactions XUMM se font via les API routes côté serveur

const XummContext = createContext();

export const XummProvider = ({ children }) => {
  const [wallet, setWallet] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const updateWallet = (account) => {
    if (account) {
      setWallet(account);
      setIsConnected(true);
      sessionStorage.setItem("xumm_wallet", account);
    } else {
      setWallet("");
      setIsConnected(false);
      sessionStorage.removeItem("xumm_wallet");
    }
  };

  // Fonction pour connecter via prompt utilisateur
  const connect = () => {
    const walletAddress = prompt(
      "Entrez votre adresse wallet XRPL (commence par 'r'):"
    );
    if (walletAddress && walletAddress.startsWith("r")) {
      updateWallet(walletAddress);
    } else if (walletAddress) {
      alert("Adresse invalide. Elle doit commencer par 'r'");
    }
  };

  const disconnect = () => {
    updateWallet(null);
  };

  useEffect(() => {
    // Récupère le wallet sauvegardé si existe
    const savedWallet = sessionStorage.getItem("xumm_wallet");
    if (savedWallet) {
      updateWallet(savedWallet);
    }
  }, []);

  return (
    <XummContext.Provider value={{ wallet, isConnected, connect, disconnect }}>
      {children}
    </XummContext.Provider>
  );
};

export const useXumm = () => useContext(XummContext);
