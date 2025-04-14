export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { destination, amount, orderType } = req.body;

  if (!destination || !amount) {
    return res.status(400).json({ error: "Missing destination or amount" });
  }

  const payload = {
    txjson: {
      TransactionType: "Payment",
      Destination: destination,
      Amount: String(Math.floor(parseFloat(amount) * 1_000_000)) // en drops XRP
    },
    options: {
      submit: true,
      return_url: {
        web: "https://xcannes.xyz/dex", // 🟢 à adapter à ton domaine réel
        app: "xumm://xapp" // ou laisse vide si tu n’as pas une app native
      }
    }
  };

  try {
    const response = await fetch("https://xumm.app/api/v1/platform/payload ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.XUMM_API_KEY,
        "X-API-Secret": process.env.XUMM_API_SECRET
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!json?.uuid) {
      throw new Error("Payload creation failed");
    }

    res.status(200).json(json);
  } catch (err) {
    console.error("Erreur XUMM :", err);
    res.status(500).json({ error: "Impossible de créer le payload" });
  }
}
