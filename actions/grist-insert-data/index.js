const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const field_names = {
  noMaj: "MaJ_Manuelle_Satisfaction:",
  jdmaCount: "Dashlord_JDMA_nombre_de_reponses",
  jdmaSatisfactionCount: "Dashlord_JDMA_satisfaction_nombre_de_reponses",
  jdmaSatisfactionCount3M:
    "Dashlord_JDMA_satisfaction_nombre_de_reponses_3_mois_",
  jdmaSatisfactionMark: "Dashlord_JDMA_satisfaction_note",
  jdmaSatisfactionMark3M: "Dashlord_JDMA_satisfaction_note_3_mois_",
  jdmaComprehensionCount: "Dashlord_JDMA_complexite_nombre_de_reponses",
  jdmaComprehensionMark: "Dashlord_JDMA_complexite_note",
  jdmaAutonomyCount: "Dashlord_JDMA_autonomie_nombre_de_reponses",
  jdmaAutonomyMark: "Dashlord_JDMA_autonomie_note",
  jdmaContactCount:
    "Dashlord_JDMA_aide_joignable_et_efficace_nombre_de_reponses",
  jdmaContactMark: "Dashlord_JDMA_aide_joignable_et_efficace_note",
  jdmaContactReachabilityCount:
    "Dashlord_JDMA_aide_joignable_nombre_de_reponses",
  jdmaContactReachabilityMark: "Dashlord_JDMA_aide_joignable_note",
  jdmaContactSatisfactionCount:
    "Dashlord_JDMA_aide_efficace_nombre_de_reponses",
  jdmaContactSatisfactionMark: "Dashlord_JDMA_aide_efficace_note",
  updownUptime: "Dashlord_UpDown_disponibilite",
  updownResponseTime: "Dashlord_UpDown_temps_de_reponse",
};

const insertGristData = async (
  id,
  api_key,
  base_id,
  procedures_table_id,
  a11y_json,
  rgaa_json,
  jdma_json,
  jdma_3months_json,
  updown_json
) => {
  const body = { id, fields: {} };
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
    if (jdma.metadata.satisfaction_count > 0) {
      body.fields[field_names.jdmaSatisfactionMark] = jdma.data.satisfaction;
    }
  }

  // 3 months jdma satisfaction
  if (
    jdma_3months.data.satisfaction !== undefined &&
    jdma_3months.metadata.satisfaction_count !== undefined
  ) {
    body.fields[field_names.jdmaSatisfactionCount3M] =
      jdma_3months.metadata.satisfaction_count;
    if (jdma_3months.metadata.satisfaction_count > 0) {
      body.fields[field_names.jdmaSatisfactionMark3M] =
        jdma_3months.data.satisfaction;
    }
  }

  // jdma comprehension
  if (
    jdma.data.satisfaction !== undefined &&
    jdma.metadata.satisfaction_count !== undefined
  ) {
    body.fields[field_names.jdmaComprehensionCount] =
      jdma.metadata.comprehension_count;
    if (jdma.metadata.comprehension_count > 0) {
      body.fields[field_names.jdmaComprehensionMark] = jdma.data.comprehension;
    }
  }

  // jdma autonomy
  if (
    jdma.data.autonomy !== undefined &&
    jdma.metadata.autonomy_count !== undefined
  ) {
    body.fields[field_names.jdmaAutonomyCount] = jdma.metadata.autonomy_count;
    if (jdma.metadata.autonomy_count > 0) {
      body.fields[field_names.jdmaAutonomyMark] = jdma.data.autonomy;
    }
  }

  // jdma help reachable & efficient
  if (
    jdma.data.contact !== undefined &&
    jdma.metadata.contact_count !== undefined
  ) {
    body.fields[field_names.jdmaContactCount] = jdma.metadata.contact_count;
    if (jdma.metadata.contact_count > 0) {
      body.fields[field_names.jdmaContactMark] = jdma.data.contact;
    }
  }

  // jdma help reachable
  if (jdma.data.contact_reachability !== undefined) {
    body.fields[field_names.jdmaContactReachabilityCount] =
      jdma.metadata.contactReachability_count;
    if (jdma.metadata.contactReachability_count > 0) {
      body.fields[field_names.jdmaContactReachabilityMark] =
        jdma.data.contact_reachability;
    }
  }

  // jdma help efficient
  if (jdma.data.contact_satisfaction !== undefined) {
    body.fields[field_names.jdmaContactSatisfactionCount] =
      jdma.metadata.contactSatisfaction_count;
    if (jdma.metadata.contactSatisfaction_count > 0) {
      body.fields[field_names.jdmaContactSatisfactionMark] =
        jdma.data.contact_satisfaction;
    }
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

  response = await fetch(
    `https://grist.numerique.gouv.fr/api/docs/${base_id}/tables/records${procedures_table_id}?${new URLSearchParams(
      {
        filter: JSON.stringify({ id: [id] }),
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
        `https://grist.numerique.gouv.fr/api/docs/${base_id}/tables/${procedures_table_id}/records`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([body]),
        }
      );
      console.log(patchDemarche);
    } else {
      console.log(`case "${field_names.noMaj}" cochée, mise à jour updown...`);
      const patchDemarche = await fetch(
        `https://grist.numerique.gouv.fr/api/docs/${base_id}/tables/${procedures_table_id}/records`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${api_key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              id,
              fields: {
                [field_names.updownResponseTime]:
                  body.fields[field_names.updownResponseTime],
                [field_names.updownUptime]:
                  body.fields[field_names.updownUptime],
              },
            },
          ]),
        }
      );
      console.log(patchDemarche);
    }
  }
};

module.exports = { insertGristData };

if (require.main === module) {
  insertGristData(
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
