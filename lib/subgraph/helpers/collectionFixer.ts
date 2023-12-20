import { Preroll } from "@/components/Common/types/common.types";
import fetchIPFSJSON from "../../lens/helpers/fetchIpfsJson";

const collectionFixer = async (
  collection: Preroll,
  index: number
): Promise<Preroll> => {
  let ipfs = {};
  if (!collection?.collectionMetadata?.title && collection?.pubId) {
    let data = await fetchIPFSJSON(collection?.uri);
    const { cover, ...rest } = data;
    ipfs = {
      collectionMetadata: {
        ...rest,
        mediaCover: rest?.cover,
      },
    };
  }
  const coll = {
    ...collection,
    ...ipfs,
  };

  return {
    ...coll,
    collectionMetadata: {
      ...coll?.collectionMetadata,
      sizes:
        typeof coll?.collectionMetadata?.sizes === "string"
          ? (coll?.collectionMetadata?.sizes as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.collectionMetadata?.sizes,
      colors:
        typeof coll?.collectionMetadata?.colors === "string"
          ? (coll?.collectionMetadata?.colors as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.collectionMetadata?.colors,
      mediaTypes:
        typeof coll?.collectionMetadata?.mediaTypes === "string"
          ? (coll?.collectionMetadata?.mediaTypes as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.collectionMetadata?.mediaTypes,
      access:
        typeof coll?.collectionMetadata?.access === "string"
          ? (coll?.collectionMetadata?.access as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.collectionMetadata?.access,
      communities:
        typeof coll?.collectionMetadata?.communities === "string"
          ? (coll?.collectionMetadata?.communities as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.collectionMetadata?.communities,
      tags:
        typeof coll?.collectionMetadata?.tags === "string"
          ? (coll?.collectionMetadata?.tags as any)
              ?.split(",")
              ?.map((word: string) => word.trim())
              ?.filter((word: string) => word.length > 0)
          : coll?.collectionMetadata?.tags,
    },
    prices: coll?.prices?.map((price: string) =>
      String(Number(price) / 10 ** 18)
    ),
    newDrop: index < 28 ? true : false,
    currentIndex: 0,
    chosenSize:
      typeof coll?.collectionMetadata?.sizes === "string"
        ? (coll?.collectionMetadata?.sizes as any)
            ?.split(",")
            ?.map((word: string) => word.trim())
            ?.filter((word: string) => word.length > 0)?.[0]
        : coll?.collectionMetadata?.sizes?.[0],
    chosenColor:
      typeof coll?.collectionMetadata?.colors === "string"
        ? (coll?.collectionMetadata?.colors as any)
            ?.split(",")
            ?.map((word: string) => word.trim())
            ?.filter((word: string) => word.length > 0)?.[0]
        : coll?.collectionMetadata?.colors?.[0],
    bgColor:
      coll.printType === "3"
        ? "#32C5FF"
        : coll.printType === "2"
        ? "#6236FF"
        : coll.printType === "1"
        ? "#FFC800"
        : coll.printType === "4"
        ? "#29C28A"
        : "#B620E0",
  } as Preroll;
};

export default collectionFixer;
