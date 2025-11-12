import { useState } from "react";

export default function CreatorWalletBlock() {
  const [copied, setCopied] = useState(false);
  const creatorWallet = "rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx";

  const handleCopy = () => {
    navigator.clipboard.writeText(creatorWallet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="max-w-3xl mx-auto w-full border-[1.5px] border-white border-opacity-30 p-6 rounded-xl mt-10 mb-10 text-center bg-black text-white font-montserrat font-[300]">
      <h2 className="text-xl font-orbitron font-[500] mb-4 text-xcannes-green">
        Adresse du Wallet Créateur
      </h2>

      <p className="text-sm text-white mb-4">
        Voici l’adresse publique du wallet fondateur de la cryptomonnaie XCS.
      </p>

      <div className="flex items-center bg-[#f9f6f6] rounded-lg overflow-hidden px-4 py-2">
        <a
          href={`https://xrpscan.com/account/${creatorWallet}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-black text-sm font-[400] truncate whitespace-nowrap overflow-hidden max-w-[200px] sm:max-w-full underline hover:text-blue-600"
          title={creatorWallet}
        >
          {creatorWallet}
        </a>

        <button
          onClick={handleCopy}
          className="ml-4 px-4 py-2 text-sm font-[600] bg-xcannes-green text-white hover:bg-xcannes-blue-light hover:text-white transition"
        >
          {copied ? "Copié" : "Copier"}
        </button>
      </div>
    </section>
  );
}
