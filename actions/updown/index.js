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

const getUpdownData = async (updownToken, updownApiKey, startDate, endDate) => {

  // Get data from the last three months within startDate and endDate
  const threeMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 3)).getTime();
  const newStartDate = threeMonthAgo > parseInt(startDate) ? threeMonthAgo : parseInt(startDate);
  const newEndDate = new Date().getTime() < parseInt(endDate) ? new Date().getTime() : parseInt(endDate);

  const params = {
    from: new Date(newStartDate).toISOString(),
    to: new Date(newEndDate).toISOString(),
  };

  const metrics_url = `https://updown.io/api/checks/${updownToken}/metrics?${encodeQueryParams(params)}`;

  fetch(metrics_url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": updownApiKey
    },
  }).then((response) => {
    response.json().then((json) => {
      if (json.uptime) {
        console.log(JSON.stringify(json));
      } else {
        console.log("{}")
      }
    });
  });
};

module.exports = { getUpdownData };

if (require.main === module) {
  getUpdownData(
    process.argv[process.argv.length - 4],
    process.argv[process.argv.length - 3],
    process.argv[process.argv.length - 2],
    process.argv[process.argv.length - 1]
  );
}
