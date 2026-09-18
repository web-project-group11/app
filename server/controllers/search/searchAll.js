export const searchAll = async (req, res, params, options) => {
  const { query, genre, year, cursor } = req.query;
  //   console.log("Search parameters:", req.query);

  console.log(
    "========== NEW SEARCH ==========",
    req.query
  );
  if (query.length === 0) {
    return res
      .status(400)
      .json({
        message: 'Name parameter is required when search type is "All" ',
      });
  }

  let decodedCursor = null;

  if (cursor) {
    decodedCursor = JSON.parse(
      Buffer.from(cursor, "base64").toString("utf-8")
    );
  }

  params.append("query", query);

  let results = [];

  let tmdbPage = decodedCursor?.tmdbPage || 1;
  let offset = decodedCursor?.offset || 0;

  let searchs = 0;
  let hasMore = true;

  const maxSearchs = 10;

  try {
    params.set("page", tmdbPage);
    let fetchUrl = `https://api.themoviedb.org/3/search/multi?${params}`;

    // console.log("Fetching URL:", fetchUrl);
    // console.log("Fetching URL: ", fetchUrl)
    const firstFetchResult = await fetch(fetchUrl, options);
    const firstFetchData = await firstFetchResult.json();

    const totalPages = firstFetchData.total_pages;

    console.log("TotalPages:", totalPages);

    while (results.length < 20 && tmdbPage <= totalPages) {
      params.set("page", tmdbPage);

      fetchUrl = `https://api.themoviedb.org/3/search/multi?${params}`;

      console.log("Fetching URL:", fetchUrl);

      const fetchResult = await fetch(fetchUrl, options);
      const fetchData = await fetchResult.json();

      const pageResults = fetchData.results;
      // console.log("Nro 1: ", pageResults[0])
      // console.log("Tulokset: ", pageResults.length)
      // console.log("Fetchdata:", pageResults)
      // console.log("1.result: ", pageResults[0])
      for (let i = offset; i < pageResults.length; i++) {
        const result = pageResults[i];

        if (result.media_type !== "movie" && result.media_type !== "tv") {
          continue;
        }

        if (genre && !result.genre_ids?.includes(Number(genre))) {
          continue;
        }

        if (year) {
          if (result.media_type === "tv") {
            if (!result.first_air_date.startsWith(year)) {
              continue;
            }
          } else {
            if (!result.release_date.startsWith(year)) {
              continue;
            }
          }
        }

        results.push(result)

        offset = i + 1

        // console.log("1.result: ", results[0])
        if (results.length === 20) {
          break;
        }
      }

      tmdbPage++;
      offset = 0;
      searchs++;

      if (searchs > maxSearchs) {
        break;
      }
    }

    if (tmdbPage >= totalPages && offset >= pageResults.length) {
      hasMore = false;
    }

    console.log("Offset: ", offset, " TmdbPage: ", tmdbPage)
    // console.log("1.result: ", results[0])
    console.log("Tulokset: ", results.length)

    const cursor = {
      tmdbPage: tmdbPage,
      offset: offset
    };

    const cursorString = Buffer
      .from(JSON.stringify(cursor))
      .toString("base64");

    return res.status(200).json(
      {
        results: results,
        nextCursor: cursorString,
        hasMore: hasMore
      } || [],
    );
  } catch (error) {
    console.log(error)
    if (response.status === 429) {
      return res
        .status(429)
        .json({ message: "Too many requests. Please try again later." });
    }
    return res.status(error.status || 500).json({ message: error.message });
  }
};