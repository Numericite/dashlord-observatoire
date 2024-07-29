const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const encodeQueryParams = (params) => {
  return Object.keys(params)
    .map((key) => {
      const value = params[key];
      return (
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(
          typeof value === "object" ? JSON.stringify(value) : value
        )
      );
    })
    .join("&");
};

const getXWikiJdmaData = (id, startDate, endDate) => {
  const params = {
    input: {
      json: {
        product_id: id,
        start_date: startDate,
        end_date: endDate,
      },
    },
  };

  const url = `https://jedonnemonavis.numerique.gouv.fr/api/trpc/answer.getObservatoireStats?${encodeQueryParams(
    params
  )}`;

  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    response.json().then((json) => {
      const data = json.result?.data?.json;

      if (data) {
        console.log(data);
      }
    });
  });
};

module.exports = { getXWikiJdmaData };

if (require.main === module) {
  getXWikiJdmaData(
    process.argv[process.argv.length - 3],
    process.argv[process.argv.length - 2],
    process.argv[process.argv.length - 1]
  );
}
