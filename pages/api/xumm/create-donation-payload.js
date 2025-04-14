export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
  
    const { amount, destination } = req.body;
  
    const payload = {
      txjson: {
        TransactionType: "Payment",
        Destination: destination,
        Amount: String(Math.floor(parseFloat(amount) * 1000000)) // XRP en drops
      },
      options: {
        submit: true,
        return_url: {
          web: "https://xrdoge.org", // à personnaliser
          app: "https://xumm.app"
        }
      }
    };
  
    try {
      const result = await fetch("https://xumm.app/api/v1/platform/payload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.XUMM_API_KEY,
          "X-API-Secret": process.env.XUMM_API_SECRET
        },
        body: JSON.stringify(payload)
      });
  
      const json = await result.json();
  
      if (!json || !json.uuid) throw new Error("Erreur création payload");
  
      res.status(200).json(json);
    } catch (err) {
      console.error("Erreur XUMM:", err);
      res.status(500).json({ error: "Échec création payload XUMM" });
    }
  }
  