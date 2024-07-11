const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const getXWikiJdmaData = (id, startDate, endDate, jdmaToken) => {
  fetch(`https://jedonnemonavis.numerique.gouv.fr/api/open-api/stats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jdmaToken}`,
    },
    body: JSON.stringify({
      field_codes: ["satisfaction", "comprehension", "contact_satisfaction"],
      product_ids: [parseInt(id)],
      start_date: startDate,
      end_date: endDate,
      interval: "none",
    }),
  }).then((response) => {
    response.json().then((json) => {
      if (json.data[0]) {
        if (json.data[0].intervals[0]) {
          const data = json.data[0].intervals[0].data;
          if (data) {
            console.log(
              data.reduce(
                (acc, item) => {
                  item.number_hits.forEach((nh) => {
                    acc[item.category][nh.intention] = nh.count;

                    if (item.category === "satisfaction") {
                      acc.answersTotal += nh.count;
                    }
                  });

                  return acc;
                },
                {
                  answersTotal: 0,
                  satisfaction: {},
                  comprehension: {},
                  contact_satisfaction: {},
                  dateStart: new Date(startDate).getTime(),
                  dateEnd: new Date(endDate).getTime(),
                }
              )
            );
          }
        }
      }
    });
  });
};

module.exports = { getXWikiJdmaData };

if (require.main === module) {
  getXWikiJdmaData(
    process.argv[process.argv.length - 4],
    process.argv[process.argv.length - 3],
    process.argv[process.argv.length - 2],
    process.argv[process.argv.length - 1]
  );
}
