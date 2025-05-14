const buildTextQuery = (inputText: string): Object | void => {
  const trimmedInputText = inputText?.trim();
  if (trimmedInputText === "" || !trimmedInputText) return;

  const commonWords = new Set([
    "a",
    "and",
    "or",
    "the",
    "in",
    "on",
    "for",
    "with",
  ]);
  const fieldsToSearch = ["tags", "prompt", "title", "description"];

  const searchWords = trimmedInputText
    ?.split(/\s+/)
    ?.map((word) => word?.trim())
    ?.filter(
      (word) =>
        word && (word.length > 1 || trimmedInputText?.split(/\s+/).length === 1)
    )
    ?.filter((word) => !commonWords.has(word.toLowerCase()));

  let orConditions: any[] = [];
  fieldsToSearch?.forEach((field) => {
    searchWords?.forEach((word) => {
      orConditions.push({ [`${field}_contains_nocase`]: word });
    });
  });

  const query = {
    and: [
      {
        origin: "1",
      },
      {
        metadata_: { or: orConditions },
      },
    ],
  };

  return query;
};

export default buildTextQuery;

export const combineQueryObjects = (obj1: any, obj2: any) => {
  const obj1CollectionMetadataOrConditions = obj1.or[0].metadata_.or;

  if (obj2.or[0].hasOwnProperty("metadata_")) {
    obj2.or[0].metadata_.or = [
      ...obj2.or[0].metadata_.or,
      ...obj1CollectionMetadataOrConditions,
    ];
  } else {
    obj2.or.unshift({
      metadata_: { or: obj1CollectionMetadataOrConditions },
    });
  }

  return obj2;
};
