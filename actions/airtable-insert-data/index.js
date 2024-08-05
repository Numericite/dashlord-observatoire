const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const field_names = {
  id: "ID",
  edition: "Lien vers statistiques édition",
  noMaj: "MAJ manuelle de la satisfaction",
  // a11y: '[Dashlord] - Mention accessibilité',
  // a11yLink: "[Dashlord] - Lien de la déclaration d'accessibilité",
  // rgaaTaux: '[Dashlord] - Taux RGAA',
  // rgaaDate: "[Dashlord] - Date de la déclaration d'accessibilité",
  jdmaCount: "[Dashlord] - JDMA nombre de réponses",
  jdmaSatisfactionCount: "[Dashlord] - JDMA satisfaction nombre de réponses",
  jdmaSatisfactionMark: "[Dashlord] - JDMA satisfaction note",
  // jdmaEasyCount: '[Dashlord] - JDMA facilité nombre de réponses',
  // jdmaEasyMark: '[Dashlord] - JDMA facilité note',
  jdmaComprehensionCount: "[Dashlord] - JDMA complexité nombre de réponses",
  jdmaComprehensionMark: "[Dashlord] - JDMA complexité note",
  jdmaAutonomyCount: "[Dashlord] - JDMA autonomie nombre de réponses",
  jdmaAutonomyMark: "[Dashlord] - JDMA autonomie note",
  jdmaContactCount: "[Dashlord] - JDMA aide nombre de réponses",
  jdmaContactMark: "[Dashlord] - JDMA aide note",
};

const insertAirtableData = async (
  id,
  api_key,
  base_id,
  procedures_table_name,
  a11y_json,
  rgaa_json,
  jdma_json
) => {
  const body = { fields: {} };

  // // A11Y
  // const a11y = JSON.parse(JSON.parse(a11y_json).toString());
  // body.fields[field_names.a11y] = a11y.mention
  //   ? a11y.mention
  //   : 'Aucune mention';
  // body.fields[field_names.a11yLink] = a11y.declarationUrl
  //   ? a11y.declarationUrl
  //   : '';

  // //RGAA
  // const rgaa = JSON.parse(JSON.parse(rgaa_json).toString());
  // body.fields[field_names.rgaaTaux] = rgaa.taux ? rgaa.taux + '%' : '';
  // body.fields[field_names.rgaaDate] = rgaa.date ? rgaa.date : '';
  //JDMA
  const jdma = JSON.parse(JSON.parse(jdma_json).toString());

  if (!jdma.data || !jdma.metadata) {
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

  // jdma help
  if (
    jdma.data.contact !== undefined &&
    jdma.metadata.contact_count !== undefined
  ) {
    body.fields[field_names.jdmaContactCount] = jdma.metadata.contact_count;
    body.fields[field_names.jdmaContactMark] = jdma.data.contact;
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
      console.log(`case "${field_names.noMaj}" cochée, pas de mise à jour...`);
    }
  }
};

module.exports = { insertAirtableData };

if (require.main === module) {
  insertAirtableData(
    process.argv[process.argv.length - 7],
    process.argv[process.argv.length - 6],
    process.argv[process.argv.length - 5],
    process.argv[process.argv.length - 4],
    process.argv[process.argv.length - 3],
    process.argv[process.argv.length - 2],
    process.argv[process.argv.length - 1]
  );
}
