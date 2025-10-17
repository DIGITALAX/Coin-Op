import { useEffect, useMemo, useState } from "react";
import { Child, ResponseData, SellData, Template } from "../types/sell.types";
import { createImageUrl, revokeImageUrl } from "@/app/lib/helpers/imageUtils";
import { FULFILLERS } from "@/app/lib/constants";
import { getChild, getTemplate } from "../../../../../graphql/queries/getItems";
import { ensureMetadata } from "@/app/lib/helpers/metadata";

const useSellData = (searchParams: {
  sessionId?: string | undefined;
  data?: string | undefined;
}) => {
  const [sellData, setSellData] = useState<SellData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSellData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (searchParams.sessionId) {
          const response = await fetch(
            `/api/create-sell-session?sessionId=${searchParams.sessionId}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch session: ${response.statusText}`);
          }

          const data = (await response.json()) as ResponseData;

          console.log({data})

          const resultFront = await getTemplate(
            Number(data.front.templateId),
            data.front.templateContract
          );
          let templateDataBack: Template | undefined,
            templateDataFront: Template;
          templateDataFront = resultFront?.data?.templates?.[0];
          if (templateDataFront?.childReferences) {
            templateDataFront.childReferences =
              templateDataFront?.childReferences.map((childRef: any) => ({
                ...childRef,
                child: childRef.isTemplate
                  ? childRef.childTemplate
                  : childRef.child,
              }));
          }
          if (templateDataFront) {
            templateDataFront = await ensureMetadata(templateDataFront);
          }

          if (data?.back) {
            const resultBack = await getTemplate(
              Number(data.back.templateId),
              data.back.templateContract
            );
            templateDataBack = resultBack?.data?.templates?.[0];
            if (templateDataBack?.childReferences) {
              templateDataBack.childReferences =
                templateDataBack?.childReferences.map((childRef: any) => ({
                  ...childRef,
                  child: childRef.isTemplate
                    ? childRef.childTemplate
                    : childRef.child,
                }));
            }
            if (templateDataBack) {
              templateDataBack = await ensureMetadata(templateDataBack);
            }
          }

          const resultMaterial = await getChild(
            Number(data.material.childId),
            data.material.childContract
          );

          const resultColor = await getChild(
            Number(data.color.childId),
            data.color.childContract
          );

          const childDataMaterial = resultMaterial?.data?.childs?.[0];
          const childDataColor = resultColor?.data?.childs?.[0];

          const processedItemMaterial = childDataMaterial
            ? await ensureMetadata(childDataMaterial)
            : null;

          const processedItemColor = childDataColor
            ? await ensureMetadata(childDataColor)
            : null;

          setSellData({
            front: {
              ...data?.front,
              template: templateDataFront,
              children: data?.front?.children?.map((child) => ({
                ...child,
                child: templateDataFront?.childReferences.find(
                  (ch) =>
                    ch.childId == child.childId &&
                    ch.childContract == child.childContract
                )?.child as Child,
              })),
            },
            back: data?.back && {
              ...data?.back,
              template: templateDataFront,
              children: data?.back?.children?.map((child) => ({
                ...child,
                child: templateDataBack?.childReferences.find(
                  (ch) =>
                    ch.childId == child.childId &&
                    ch.childContract == child.childContract
                )?.child as Child,
              })),
            },
            fulfiller: FULFILLERS[0],
            color: {
              ...data.color,
              child: processedItemColor,
            },
            material: {
              ...data.material,
              child: processedItemMaterial,
            },
            type: "shirt",
          });
        } else if (searchParams.data) {
          try {
            const decodedData = JSON.parse(
              decodeURIComponent(searchParams.data)
            );
            setSellData(decodedData);
          } catch (e) {
            throw new Error("Invalid data parameter format");
          }
        } else {
          throw new Error("No sessionId or data provided");
        }
      } catch (err: any) {
        console.error("Error loading sell data:", err);
        setError(err.message || "Failed to load sell data");
      } finally {
        setLoading(false);
      }
    };

    loadSellData();
  }, [searchParams.sessionId, searchParams.data]);

  return {
    loading,
    error,
    sellData,
  };
};

export default useSellData;
