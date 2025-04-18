import xrpl from "xrpl";

async function testXRPL() {
  const client = new xrpl.Client("wss://s1.ripple.com"); // 🟢 Connexion au réseau principal

  try {
    await client.connect();
    const response = await client.request({ command: "server_info" });
    console.log("✅ Connecté au XRP Ledger !");
    console.log("🧠 Info serveur:", response.result.info);
  } catch (err) {
    console.error("❌ Erreur de connexion XRPL:", err);
  } finally {
    client.disconnect();
  }
}

testXRPL();
