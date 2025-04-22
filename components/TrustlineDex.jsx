import { useState } from "react";

export default function TrustlineDex() {
  const [copied, setCopied] = useState(false);
  const trustlineURL =
    "https://xrpl.services?issuer=rBxQY3dc4mJtcDA5UgmLvtKsdc7vmCGgxx&currency=XCS&limit=2006400";

  const handleCopy = () => {
    navigator.clipboard.writeText(trustlineURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black border border-white/20 rounded-lg p-4 font-orbitron font-[500] text-white text-sm ">
      <h3 className="text-lg text-xcannes-green mb-3">⚡ Ajouter la Trustline</h3>
      <div className="flex items-center gap-2">
        <a
          href={trustlineURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-white text-black px-4 py-2 font-[400] rounded hover:underline truncate"
        >
          {trustlineURL}
        </a>
        <button
          onClick={handleCopy}
          className="px-3 py-2 text-xs bg-xcannes-green text-white rounded hover:bg-xcannes-blue-light hover:text-white transition"
        >
          {copied ? "✅ Copié" : "📋 Copier"}
        </button>
      </div>
    </div>
  );
}
