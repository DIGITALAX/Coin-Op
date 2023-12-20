import { Preroll } from "@/components/Common/types/common.types";
import { Profile } from "@/components/Common/types/generated";
import toHexWithLeadingZero from "./toHexWithLeadingZero";
import collectionFixer from "./collectionFixer";
import getPublication from "../../../graphql/lens/queries/publication";

const handleCollectionProfilesAndPublications = async (
  collections: Preroll[],
  lens: Profile | undefined
): Promise<Preroll[] | undefined> => {
  try {
    const promises = [...(collections || [])]?.map(
      async (collection: Preroll, index: number) => {
        if (collection?.profileId && collection?.pubId) {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(collection?.profileId)
              )}-${toHexWithLeadingZero(Number(collection?.pubId))}`,
            },
            lens?.id
          );

          const coll = await collectionFixer(collection, index);
          return {
            ...coll,
            profile: publication?.data?.publication?.by as Profile,
            publication: publication?.data?.publication,
          } as Preroll;
        }
      }
    );
    const colls = await Promise.all(promises);
    return colls?.filter(Boolean) as Preroll[];
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublications;
