import { COIN_OP_PARENT } from "@/app/lib/constants";
import { ensureMetadata } from "@/app/lib/helpers/metadata";
import { useState, useEffect, useCallback, useContext } from "react";
import { getAllParents } from "../../../../../graphql/queries/getItems";
import { ModalContext } from "@/app/providers";

const ITEMS_PER_PAGE = 20;

export const useAppMarket = (dict: any) => {
  const context = useContext(ModalContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [skip, setSkip] = useState<number>(0);

  const fetchParentItems = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const currentSkip = reset ? 0 : skip;
        const result = await getAllParents(
          COIN_OP_PARENT,
          ITEMS_PER_PAGE,
          currentSkip
        );

        if (result?.data?.parents) {
          const processedItems = await Promise.all(
            result.data.parents.map(async (parent: any) => {
              const processedParent = await ensureMetadata(parent);
              const normalizedChildReferences =
                processedParent?.childReferences?.map((child: any) => ({
                  ...child,
                  child: child?.isTemplate
                    ? child?.childTemplate ?? child?.child
                    : child?.child,
                })) ?? [];
              return {
                ...processedParent,
                childReferences: normalizedChildReferences,
              };
            })
          );

          if (reset) {
            context?.setParents(processedItems);
            setSkip(ITEMS_PER_PAGE);
          } else {
            context?.setParents((prev) => [...prev, ...processedItems]);
            setSkip((prev) => prev + ITEMS_PER_PAGE);
          }

          if (processedItems.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          }
        } else {
          if (reset) {
            context?.setParents([]);
          }
          setHasMore(false);
        }
      } catch (err) {
        setError(dict?.failedToLoadParentItems);
        if (reset) {
          context?.setParents([]);
        }
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [skip, loading, dict]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchParentItems(false);
    }
  }, [fetchParentItems, loading, hasMore]);


  useEffect(() => {
    if (Number(context?.parents?.length) < 1) {
      fetchParentItems(true);
    }
  }, []);

  return {
    loading,
    error,
    hasMore,
    loadMore,
  };
};
