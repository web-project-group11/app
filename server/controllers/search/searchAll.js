export const searchAll = async (req, res, params, options) => {
  const { query, genre, year, page } = req.query;
//   console.log("Search parameters:", req.query);

  let fetchUrl;

  if (query.length === 0) {
    return res
      .status(400)
      .json({
        message: 'Name parameter is required when search type is "All" ',
      });
  }

  if (query) {
    params.append("query", query);
    fetchUrl = `https://api.themoviedb.org/3/search/multi?${params}`;
  }

  try {
    const result = await fetch(fetchUrl, options);
    const data = await result.json();
    let results = data.results;

    console.log("Total pages: ", data.total_pages);

    return res.status(200).json(
      {
        results: results,
        total_pages: data.total_pages,
        poster_path: data.poster_path,
      } || [],
    );
  } catch (error) {
    if (response.status === 429) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }
    return res.status(error.status || 500).json({ message: error.message });
  }
};