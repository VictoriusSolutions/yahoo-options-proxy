export default async function handler(req, res) {
  const { symbol = "AAPL", date } = req.query;

  const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-options?symbol=${symbol}${date ? `&date=${date}` : ''}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": process.env.RAPIDAPI_HOST,
      },
    });

    const data = await response.json();

    const result = {
      calls: data.options?.[0]?.calls || [],
      puts: data.options?.[0]?.puts || [],
      expirationDate: data.options?.[0]?.expirationDate || null,
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Proxy request failed", detail: error.message });
  }
}
