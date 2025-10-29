import { ABIS } from "@/app/abis";
import { CartItemMarket } from "@/app/components/AppMarket/types/appmarket.types";
import {
  Child,
  ChildReference,
  Template,
} from "@/app/components/Sell/types/sell.types";
import { PublicClient } from "viem";
import { COIN_OP_MARKET } from "../constants";

export const ensurePurchasable = async (
  cart: CartItemMarket[],
  publicClient: PublicClient
): Promise<boolean> => {
  for (const entry of cart) {
    const item: any = entry.item;
    const amount = BigInt(entry.chosenAmount);

    if (item.designId) {
      const parentOk = await requireParentCanPurchase(
        item.parentContract as `0x${string}`,
        item.designId,
        amount,
        true,
        publicClient
      );
      if (!parentOk) return false;

      const childrenOk = await walkChildReferences(
        item.childReferences,
        {
          parentId: item.designId,
          parentContract: item.parentContract as `0x${string}`,
          isPhysical: true,
        },
        publicClient
      );
      if (!childrenOk) return false;
      continue;
    }

    if ((item as Template).templateId) {
      const templateOk = await requireTemplateCanPurchase(
        item.templateContract,
        item.templateId,
        amount,
        true,
        publicClient
      );
      if (!templateOk) return false;

      const placements = await fetchTemplatePlacements(
        item.templateContract,
        item.templateId,
        publicClient
      );

      const childrenOk = await walkChildReferences(
        placements,
        { isPhysical: true },
        publicClient
      );
      if (!childrenOk) return false;
      continue;
    }

    if ((item as Child).childId) {
      const childOk = await requireChildCanPurchase(
        item.childContract,
        item.childId,
        amount,
        true,
        publicClient
      );
      if (!childOk) return false;
      continue;
    }

    return false;
  }

  return true;
};

const requireParentCanPurchase = async (
  parentContract: `0x${string}`,
  parentId: string | number,
  amount: bigint,
  isPhysical: boolean,
  publicClient: PublicClient
) : Promise<boolean> => {
  const ok = await publicClient.readContract({
    address: parentContract,
    abi: ABIS.FGOParent,
    functionName: "canPurchase",
    args: [BigInt(parentId), amount, isPhysical, COIN_OP_MARKET],
  });

  return Boolean(ok);
};

const requireTemplateCanPurchase = async (
  templateContract: `0x${string}`,
  templateId: string | number,
  amount: bigint,
  isPhysical: boolean,
  publicClient: PublicClient
) : Promise<boolean> => {
  const ok = await publicClient.readContract({
    address: templateContract,
    abi: ABIS.FGOTemplateChild,
    functionName: "canPurchase",
    args: [BigInt(templateId), amount, isPhysical, COIN_OP_MARKET],
  });

  return Boolean(ok);
};

const requireChildCanPurchase = async (
  childContract: `0x${string}`,
  childId: string | number,
  amount: bigint,
  isPhysical: boolean,
  publicClient: PublicClient
) : Promise<boolean> => {
  const ok = await publicClient.readContract({
    address: childContract,
    abi: ABIS.FGOChild,
    functionName: "canPurchase",
    args: [BigInt(childId), amount, isPhysical, COIN_OP_MARKET],
  });

  return Boolean(ok);
};

const fetchTemplatePlacements = async (
  templateContract: `0x${string}`,
  templateId: string | number,
  publicClient: PublicClient
) => {
  return publicClient.readContract({
    address: templateContract,
    abi: ABIS.FGOTemplateChild,
    functionName: "getTemplatePlacements",
    args: [BigInt(templateId)],
  }) as Promise<ChildReference[]>;
};

type WalkContext = {
  parentId?: string | number;
  parentContract?: `0x${string}`;
  isPhysical: boolean;
};

const walkChildReferences = async (
  refs: ChildReference[],
  ctx: WalkContext,
  publicClient: PublicClient
) : Promise<boolean> => {
  for (const ref of refs) {
    const metadata = (await publicClient.readContract({
      address: ref.childContract as `0x${string}`,
      abi: ABIS.FGOChild,
      functionName: "getChildMetadata",
      args: [BigInt(ref.childId)],
    })) as any;

    const marketOk = await ensureMarketApproval(
      ref,
      ctx.isPhysical,
      publicClient
    );
    if (!marketOk) return false;

    const parentOk = await ensureParentApproval(ref, ctx, publicClient);
    if (!parentOk) return false;

    if (metadata.isTemplate) {
      const placements = await fetchTemplatePlacements(
        ref.childContract as `0x${string}`,
        ref.childId,
        publicClient
      );
      const nestedOk = await walkChildReferences(
        placements,
        { isPhysical: ctx.isPhysical },
        publicClient
      );
      if (!nestedOk) return false;
    }
  }

  return true;
};

const ensureMarketApproval = async (
  ref: ChildReference,
  isPhysical: boolean,
  publicClient: PublicClient
) : Promise<boolean> => {
  const ok = await publicClient.readContract({
    address: ref.childContract as `0x${string}`,
    abi: ABIS.FGOChild,
    functionName: "approvesMarket",
    args: [BigInt(ref.childId), COIN_OP_MARKET, isPhysical],
  });

  return Boolean(ok);
};

const ensureParentApproval = async (
  ref: ChildReference,
  ctx: WalkContext,
  publicClient: PublicClient
) : Promise<boolean> => {
  if (!ctx.parentId || !ctx.parentContract) return true;

  const approved = (await publicClient.readContract({
    address: ref.childContract as `0x${string}`,
    abi: ABIS.FGOChild,
    functionName: "getParentApprovedAmount",
    args: [
      BigInt(ref.childId),
      BigInt(ctx.parentId),
      ctx.parentContract,
      ctx.isPhysical,
    ],
  })) as bigint;

  return Number(approved) !== 0;
};
