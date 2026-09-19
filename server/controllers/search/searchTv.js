export const searchTv = async (req, res, params, options) => {
  const { query, genre, year, cursor } = req.query;

  // console.log("========== TV SEARCH ==========");

  let decodedCursor = null;

  if (cursor) {
    decodedCursor = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  }

  let results = [];

  let tmdbPage = decodedCursor?.tmdbPage || 1;
  let offset = decodedCursor?.offset || 0;

  let totalPages = Infinity;
  let hasMore = true;
  let fetchUrl;

  const maxSearchs = 50;
  let searchs = 0;

  try {
    while (
      results.length < 20 &&
      tmdbPage <= totalPages &&
      searchs < maxSearchs
    ) {
      const searchParams = new URLSearchParams(params);

      if (query) {
        searchParams.set("query", query);

        if (year) {
          searchParams.set("first_air_date_year", year);
        }

        searchParams.set("page", tmdbPage);

        fetchUrl = `https://api.themoviedb.org/3/search/tv?${searchParams}`;
      } else {
        if (genre) {
          searchParams.set("with_genres", genre);
        }

        if (year) {
          searchParams.set("first_air_date_year", year);
        }

        searchParams.set("page", tmdbPage);

        fetchUrl = `https://api.themoviedb.org/3/discover/tv?${searchParams}`;
      }

      // console.log("Fetching URL:", fetchUrl);

      const fetchResult = await fetch(fetchUrl, options);
      const fetchData = await fetchResult.json();

      totalPages = fetchData.total_pages;

      // console.log("TotalPages:", totalPages);

      const pageResults = fetchData.results;

      for (let i = offset; i < pageResults.length; i++) {
        const result = pageResults[i];

        const alreadyExists = results.some(
          (item) => item.id === result.id && item.media_type === "tv",
        );

        if (alreadyExists) {
          continue;
        }

        results.push({
          ...result,
          media_type: "tv",
        });

        offset = i + 1;

        if (results.length === 20) {
          break;
        }
      }

      // Saatiin 20 tulosta
      if (results.length === 20) {
        if (offset >= pageResults.length) {
          tmdbPage++;
          offset = 0;
        }

        break;
      }

      // Nykyinen TMDB-sivu käytiin loppuun
      tmdbPage++;
      offset = 0;

      searchs++;
    }

    // Kaikki TMDB-sivut käytiin
    if (tmdbPage > totalPages) {
      hasMore = false;
    }

    // console.log("Offset:", offset);
    // console.log("TmdbPage:", tmdbPage);
    // console.log("Tulokset:", results.length);

    const nextCursor = hasMore
      ? Buffer.from(
          JSON.stringify({
            tmdbPage,
            offset,
          }),
        ).toString("base64")
      : null;

    // console.log("NextCursor:", nextCursor, "hasMore:", hasMore);

    return res.status(200).json({
      results,
      hasMore,
      nextCursor,
    });
  } catch (error) {
    console.log(error);

    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};
