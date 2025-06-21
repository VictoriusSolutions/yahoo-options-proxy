export default async function handler(req, res) {
  const { symbol = "AAPL" } = req.query;

  const headers = {
    "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
    "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
  };

  try {
    // Step 1: Fetch expiration dates
    const expResp = await fetch(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-options?symbol=${symbol}`,
      { headers }
    );
    const expData = await expResp.json();
    const expiration = expData.optionExpirationDates?.[0];

    if (!expiration) {
      return res.status(404).json({ error: "No expirations found for symbol" });
    }

    // Step 2: Fetch options chain for that expiration
    const chainResp = await fetch(
      `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-options?symbol=${symbol}&date=${expiration}`,
      { headers }
    );
    const chainData = await chainResp.json();

    const result = {
      calls: chainData.options?.[0]?.calls || [],
      puts: chainData.options?.[0]?.puts || [],
      expirationDate: expiration,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed", detail: error.message });
  }
}
