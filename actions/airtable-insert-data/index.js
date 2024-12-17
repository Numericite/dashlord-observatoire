const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const field_names = {
  id: "ID_JDMA",
  edition: "Lien vers statistiques édition",
  noMaj: "MAJ manuelle de la satisfaction",
  jdmaCount: "[Dashlord] - JDMA nombre de réponses",
  jdmaSatisfactionCount: "[Dashlord] - JDMA satisfaction nombre de réponses",
  jdmaSatisfactionCount3M:
    "[Dashlord] - JDMA satisfaction nombre de réponses (3 mois)",
  jdmaSatisfactionMark: "[Dashlord] - JDMA satisfaction note",
  jdmaSatisfactionMark3M: "[Dashlord] - JDMA satisfaction note (3 mois)",
  jdmaComprehensionCount: "[Dashlord] - JDMA complexité nombre de réponses",
  jdmaComprehensionMark: "[Dashlord] - JDMA complexité note",
  jdmaAutonomyCount: "[Dashlord] - JDMA autonomie nombre de réponses",
  jdmaAutonomyMark: "[Dashlord] - JDMA autonomie note",
  jdmaContactCount:
    "[Dashlord] - JDMA aide joignable et efficace nombre de réponses",
  jdmaContactMark: "[Dashlord] - JDMA aide joignable et efficace note",
  jdmaContactReachabilityCount:
    "[Dashlord] - JDMA aide joignable nombre de réponses",
  jdmaContactReachabilityMark: "[Dashlord] - JDMA aide joignable note",
  jdmaContactSatisfactionCount:
    "[Dashlord] - JDMA aide efficace nombre de réponses",
  jdmaContactSatisfactionMark: "[Dashlord] - JDMA aide efficace note",
  updownUptime: "[Dashlord] - UpDown disponibilité",
  updownResponseTime: "[Dashlord] - UpDown temps de réponse",
};

const insertAirtableData = async (
  id,
  api_key,
  base_id,
  procedures_table_name,
  a11y_json,
  rgaa_json,
  jdma_json,
  jdma_3months_json,
  updown_json
) => {
  const body = { fields: {} };
  const jdma = JSON.parse(JSON.parse(jdma_json).toString());
  const jdma_3months = JSON.parse(JSON.parse(jdma_3months_json).toString());
  const updown = JSON.parse(JSON.parse(updown_json).toString());

  if (
    !jdma.data ||
    !jdma.metadata ||
    !jdma_3months.data ||
    !jdma_3months.metadata
  ) {
    process.exit();
  }

  body.fields[field_names.jdmaCount] = jdma.metadata.satisfaction_count
    ? parseInt(jdma.metadata.satisfaction_count)
    : 0;

  // jdma satisfaction
  if (
    jdma.data.satisfaction !== undefined &&
    jdma.metadata.satisfaction_count !== undefined
  ) {
    body.fields[field_names.jdmaSatisfactionCount] =
      jdma.metadata.satisfaction_count;
    body.fields[field_names.jdmaSatisfactionMark] = jdma.data.satisfaction;
  }

  // 3 months jdma satisfaction
  if (
    jdma_3months.data.satisfaction !== undefined &&
    jdma_3months.metadata.satisfaction_count !== undefined
  ) {
    body.fields[field_names.jdmaSatisfactionCount3M] =
      jdma_3months.metadata.satisfaction_count;
    body.fields[field_names.jdmaSatisfactionMark3M] =
      jdma_3months.data.satisfaction;
  }

  // jdma comprehension
  if (
    jdma.data.satisfaction !== undefined &&
    jdma.metadata.satisfaction_count !== undefined
  ) {
    body.fields[field_names.jdmaComprehensionCount] =
      jdma.metadata.comprehension_count;
    body.fields[field_names.jdmaComprehensionMark] = jdma.data.comprehension;
  }

  // jdma autonomy
  if (
    jdma.data.autonomy !== undefined &&
    jdma.metadata.autonomy_count !== undefined
  ) {
    body.fields[field_names.jdmaAutonomyCount] = jdma.metadata.autonomy_count;
    body.fields[field_names.jdmaAutonomyMark] = jdma.data.autonomy;
  }

  // jdma help reachable & efficient
  if (
    jdma.data.contact !== undefined &&
    jdma.metadata.contact_count !== undefined
  ) {
    body.fields[field_names.jdmaContactCount] = jdma.metadata.contact_count;
    body.fields[field_names.jdmaContactMark] = jdma.data.contact;
  }

  // jdma help reachable
  if (jdma.data.contact_reachability !== undefined) {
    body.fields[field_names.jdmaContactReachabilityCount] =
      jdma.metadata.contactReachability_count;
    body.fields[field_names.jdmaContactReachabilityMark] =
      jdma.data.contact_reachability;
  }

  // jdma help efficient
  if (jdma.data.contact_satisfaction !== undefined) {
    body.fields[field_names.jdmaContactSatisfactionCount] =
      jdma.metadata.contactSatisfaction_count;
    body.fields[field_names.jdmaContactSatisfactionMark] =
      jdma.data.contact_satisfaction;
  }

  // updown uptime
  if (updown.uptime !== undefined) {
    body.fields[field_names.updownUptime] = updown.uptime / 100;
  }

  // updown response time
  if (updown.timings !== undefined && updown.timings.response !== undefined) {
    body.fields[field_names.updownResponseTime] = updown.timings.response;
  }

  console.log("body jdma count : ", body.fields[field_names.jdmaCount]);
  console.log(
    "body jdma satisfaction count : ",
    body.fields[field_names.jdmaSatisfactionCount]
  );
  console.log(
    "body jdma satisfaction mark : ",
    body.fields[field_names.jdmaSatisfactionMark]
  );
  console.log(
    "body jdma satisfaction count 3 months : ",
    body.fields[field_names.jdmaSatisfactionCount3M]
  );
  console.log(
    "body jdma satisfaction mark 3 months : ",
    body.fields[field_names.jdmaSatisfactionMark3M]
  );
  console.log(
    "body jdma comprehension count : ",
    body.fields[field_names.jdmaComprehensionCount]
  );
  console.log(
    "body jdma comprehension mark : ",
    body.fields[field_names.jdmaComprehensionMark]
  );
  console.log(
    "body jdma autonomy count : ",
    body.fields[field_names.jdmaAutonomyCount]
  );
  console.log(
    "body jdma autonomy mark : ",
    body.fields[field_names.jdmaAutonomyMark]
  );
  console.log(
    "body jdma contact count : ",
    body.fields[field_names.jdmaContactCount]
  );
  console.log(
    "body jdma contact mark : ",
    body.fields[field_names.jdmaContactMark]
  );
  console.log(
    "body jdma contact reachability mark : ",
    body.fields[field_names.jdmaContactReachabilityMark]
  );
  console.log(
    "body jdma contact satisfaction mark : ",
    body.fields[field_names.jdmaContactSatisfactionMark]
  );
  console.log("body updown uptime : ", body.fields[field_names.updownUptime]);
  console.log(
    "body updown response time : ",
    body.fields[field_names.updownResponseTime]
  );

  let response = await fetch(
    `https://api.airtable.com/v0/${base_id}/${procedures_table_name}?${new URLSearchParams(
      {
        filterByFormula: `AND({${field_names.id}} = "${id}", FIND('Édition actuelle', ARRAYJOIN({${field_names.edition}})))`,
      }
    ).toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    }
  );
  const json = await response.json();

  const record = json.records[0];

  if (record) {
    if (!record.fields[field_names.noMaj]) {
      console.log("body", JSON.stringify(body));
      const patchDemarche = await fetch(
        `https://api.airtable.com/v0/${base_id}/${procedures_table_name}/${record.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      console.log(patchDemarche);
    } else {
      console.log(`case "${field_names.noMaj}" cochée, mise à jour updown...`);
      const patchDemarche = await fetch(
        `https://api.airtable.com/v0/${base_id}/${procedures_table_name}/${record.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fields: {
              [field_names.updownResponseTime]:
                body.fields[field_names.updownResponseTime],
              [field_names.updownUptime]: body.fields[field_names.updownUptime],
            },
          }),
        }
      );
      console.log(patchDemarche);
    }
  }
};

module.exports = { insertAirtableData };

if (require.main === module) {
  insertAirtableData(
    process.argv[process.argv.length - 9],
    process.argv[process.argv.length - 8],
    process.argv[process.argv.length - 7],
    process.argv[process.argv.length - 6],
    process.argv[process.argv.length - 5],
    process.argv[process.argv.length - 4],
    process.argv[process.argv.length - 3],
    process.argv[process.argv.length - 2],
    process.argv[process.argv.length - 1]
  );
}
