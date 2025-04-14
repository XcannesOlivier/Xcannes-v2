import { useXumm } from "../context/XummContext";

export default function XummConnectButton({ small = false }) {
  const { wallet, isConnected, connect, disconnect } = useXumm();

  const baseClass = small
    ? "text-xs px-3 py-1"
    : "text-sm px-5 py-2";

  const style = `
    ${baseClass}
    rounded-full font-medium transition duration-300
    ${isConnected ? "bg-green-600 text-white hover:bg-green-700" : "bg-blue-600 text-white hover:bg-blue-700"}
  `;

  return (
    <button onClick={isConnected ? disconnect : connect} className={style}>
      {isConnected ? "✅ Connecté" : "🔑 Se connecter"}
    </button>
  );
}