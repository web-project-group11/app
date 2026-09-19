export const searchAll = async (req, res, params, options) => {
  const { query, genre, year, cursor } = req.query;

  // console.log("========== NEW SEARCH ==========");
  // console.log(req.query);

  if (!query) {
    return res.status(400).json({
      message: 'Name parameter is required when search type is "All"',
    });
  }

  let decodedCursor = null;

  if (cursor) {
    decodedCursor = JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  }

  params.set("query", query);

  let results = [];

  let tmdbPage = decodedCursor?.tmdbPage || 1;
  let offset = decodedCursor?.offset || 0;

  // Jos edellinen sivu käsiteltiin kokonaan,
  // aloitetaan suoraan seuraavalta TMDB-sivulta.

  let totalPages = Infinity;
  let hasMore = true;

  const maxSearchs = 50;
  let searchs = 0;

  try {
    while (
      results.length < 20 &&
      tmdbPage <= totalPages &&
      searchs < maxSearchs
    ) {
      params.set("page", tmdbPage);

      const fetchUrl = `https://api.themoviedb.org/3/search/multi?${params}`;

      // console.log("Fetching URL:", fetchUrl);

      const fetchResult = await fetch(fetchUrl, options);
      const fetchData = await fetchResult.json();

      totalPages = fetchData.total_pages;

      // console.log("TotalPages:", totalPages);

      const pageResults = fetchData.results;

      for (let i = offset; i < pageResults.length; i++) {
        const result = pageResults[i];

        if (result.media_type !== "movie" && result.media_type !== "tv") {
          continue;
        }

        // Genre filter
        if (genre && !result.genre_ids?.includes(Number(genre))) {
          continue;
        }

        // Year filter
        if (year) {
          if (result.media_type === "tv") {
            if (!result.first_air_date?.startsWith(year)) {
              continue;
            }
          } else {
            if (!result.release_date?.startsWith(year)) {
              continue;
            }
          }
        }

        const alreadyExists = results.some(
          (item) =>
            item.id === result.id && item.media_type === result.media_type,
        );

        if (alreadyExists) {
          continue;
        }

        results.push(result);

        offset = i + 1;

        if (results.length === 20) {
          break;
        }
      }

      // Saatiin 20 tulosta
      if (results.length === 20) {
        // Jos koko TMDB-sivu käsiteltiin,
        // seuraava cursor menee seuraavalle sivulle.
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

    // Onko vielä TMDB-sivuja jäljellä?
    if (tmdbPage > totalPages) {
      hasMore = false;
    }

    // console.log("Offset:", offset, "TmdbPage:", tmdbPage);

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
