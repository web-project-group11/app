export const searchTv = async (req, res, params, options) => {
  const { query, genre, year, page } = req.query;
//   console.log("TVSEARCH - Search parameters:", { query, genre, year, page });

    if (query.length === 0) {
    return res
      .status(400)
      .json({
        message: 'Name parameter is required when search type is "tv" ',
      });
  }

  let fetchUrl;
  if (query) {
    params.append("query", query);
    if (year) {
      params.append("primary_release_year", year);
    }
    fetchUrl = `https://api.themoviedb.org/3/search/tv?${params}`;
  } else {
    params.append("with_genres", genre);
    params.append("primary_release_year", year);
    fetchUrl = `https://api.themoviedb.org/3/search/tv?${params}`;
  }

  // console.log("Fetching movies from URL:", fetchUrl);

  try {
    const result = await fetch(fetchUrl, options);
    const data = await result.json();
    console.log("Total pages: ", data.total_pages);
    let results = data.results;

    if (genre) {
      results = results.filter((movie) =>
        movie.genre_ids.includes(Number(genre)),
      );
    }

    return res.status(200).json(
      {
        results: results,
        total_pages: data.total_pages,
        poster_path: data.poster_path,
      } || [],
    );
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
};
