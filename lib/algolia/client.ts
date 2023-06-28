import algoliasearch from "algoliasearch";

export const initializeAlgolia = () => {
  const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_ID!, process.env.NEXT_PUBLIC_ALGOLIA_KEY!);
  const index = client.initIndex("coinop");

  return index;
};
