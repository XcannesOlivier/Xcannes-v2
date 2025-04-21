import { useState } from "react";

export default function TrustlineBlock() {
  const [copied, setCopied] = useState(false);

  const trustlineURL =
    "https://xrpl.services?issuer=rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx&currency=XCS&limit=2006400";

  const handleCopy = () => {
    navigator.clipboard.writeText(trustlineURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="text-black font-montserrat font-[300] border border-[2.5px] border-white shadow-2xl shadow-white/20b rounded-xl p-6 sm:p-8 my-10 max-w-3xl mx-auto"
      style={{ backgroundColor: "#f5f5f5/90" }}
    >
      <h2
        className="text-2xl sm:text-3xl font-orbitron font-[500] text-center mb-6"
        style={{ color: "#16b303" }}
      >
        ⚡ Ajouter la Trustline
      </h2>

      <p className="text-sm sm:text-base text-black font-[400] mb-6 text-center">
        Pour recevoir des tokens <strong>XCS</strong> sur votre wallet XRPL (comme Xaman/Xumm),
        vous devez d’abord autoriser le jeton en ajoutant une Trustline.
      </p>

      {/* Bloc noir avec écriture blanche */}
      <div className="bg-black text-white  rounded-xl p-6 text-sm sm:text-base mb-6 relative ">
        <p>
          <span className="font-semibold">Issuer :</span> rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx
        </p>
        <p>
          <span className="font-semibold">Currency :</span> XCS
        </p>
        <p>
          <span className="font-semibold">Limit :</span> 2 006 400
        </p>

        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 text-xs font-[500] bg-xcannes-green text-white px-4 py-2 rounded hover:bg-xcannes-blue-light hover:text-white transition"
        >
          {copied ? "Copié ✅" : "📋 Copier"}
        </button>
      </div>

      <div className="text-center">
        <a
          href={trustlineURL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-xcannes-green text-white font-[500] py-3 px-6 rounded-xl hover:scale-105 transition transform duration-300"
        >
          ➕ Ajouter la Trustline
        </a>
      </div>
    </section>
  );
}
