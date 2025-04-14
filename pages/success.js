import { useXumm } from "../context/XummContext";
import XummConnectButton from "../components/XummConnectButton";

export default function SuccessPage() {
  const { isConnected, wallet } = useXumm();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white p-8 text-center space-y-6">
      <h1 className="text-3xl font-bold text-green-400">✅ Paiement validé !</h1>

      <p className="text-lg max-w-md">
        Merci pour votre achat. Vos tokens XCS seront bientôt transférés sur votre wallet XRPL.
      </p>

      {!isConnected && (
        <>
          <p className="text-sm text-yellow-400">
            Veuillez connecter votre wallet XRPL pour recevoir vos XCS.
          </p>
          <XummConnectButton />
        </>
      )}

      {isConnected && (
        <div className="text-green-400 text-sm">
          ✅ Connecté à : <span className="break-all">{wallet}</span>
        </div>
      )}

      <div className="bg-black/40 border border-xcannes-green p-4 rounded-xl max-w-lg w-full text-sm text-gray-300 space-y-2">
        <p>⚠️ Assurez-vous que la <strong>trustline XCS</strong> est bien configurée sur votre wallet XRPL.</p>
        <p>✅ Si elle est déjà en place, <strong>vous n'avez rien à faire</strong>.</p>
        <p>❓ Sinon, vous pouvez la configurer en cliquant ci-dessous :</p>
        <a
          href="https://xumm.app/detect/xapp:trustset?issuer=rYourIssuerAddress&currency=XCS"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 bg-xcannes-green text-black font-bold py-2 px-6 rounded hover:bg-green-600 transition"
        >
          Ajouter la trustline XCS
        </a>
      </div>

      <a
        href="/"
        className="px-6 py-2 bg-xcannes-green text-black font-semibold rounded hover:bg-green-600 transition"
      >
        Retour à l’accueil
      </a>
    </div>
  );}