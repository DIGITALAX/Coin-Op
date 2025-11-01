import { Parent } from "../../Account/types/account.types";
import { FulfillmentStep } from "../../AppMarket/types/appmarket.types";
import { EncryptedData } from "../../Common/types/common.types";
import { Details } from "../../Walkthrough/types/walkthrough.types";

export interface SellProps {
  dict: any;
  searchParams: { sessionId?: string; data?: string };
}

export interface SellData {
  front: {
    compositeImage: string;
    templateId: string;
    template: Template;

    templateContract: string;
    children: {
      childId: string;
      childContract: string;
      child: Child;
      canvasImage: string;
    }[];
  };
  back?: {
    compositeImage: string;
    templateId: string;
    template: Template;
    templateContract: string;
    children: {
      childId: string;
      childContract: string;
      child: Child;
      canvasImage: string;
    }[];
  };
  type: "hoodie" | "shirt" | "poster" | "sticker";
  fulfiller: Fulfiller;
  material: {
    childId: string;
    child: Child;
    childContract: string;
  };
  color: {
    childId: string;
    child: Child;
    childContract: string;
  };
}

export interface ResponseData {
  front: {
    compositeImage: string;
    templateId: string;
    templateContract: string;
    children: {
      childId: string;
      childContract: string;
      canvasImage: string;
    }[];
  };
  back?: {
    compositeImage: string;
    templateId: string;
    templateContract: string;
    children: {
      childId: string;
      childContract: string;
      canvasImage: string;
    }[];
  };
  fulfiller: Fulfiller;
  material: {
    childId: string;
    childContract: string;
  };
  color: {
    childId: string;
    childContract: string;
  };
}

export interface Fulfiller {
  title: string;
  uri: string;
  base: number;
  address: string;
  vig: number;
}

export interface SellSessionResponse {
  sessionId: string;
}

export interface SellSessionRequest {
  data: SellData;
}

export interface Template {
  templateId: string;
  maxDigitalEditions: string;
  currentDigitalEditions: string;
  templateContract: string;
  supplier: string;
  childType: string;
  infraId: string;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  version: string;
  maxPhysicalEditions: string;
  currentPhysicalEditions: string;
  uriVersion: string;
  usageCount: string;
  supplyCount: string;
  infraCurrency: string;
  uri: string;
  metadata: ChildMetadata;
  status: string;
  availability: string;
  isImmutable: boolean;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  digitalReferencesOpenToAll: boolean;
  physicalReferencesOpenToAll: boolean;
  standaloneAllowed: string;
  childReferences: ChildReference[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface ChildReference {
  childContract: string;
  childId: string;
  isTemplate?: boolean;
  child?: Child;
  placementURI: string;
  amount: string;
}

export interface Designer {
  id: string;
  designerId: string;
  designer: string;
  infraId: string;
  blockNumber: string;
  isActive: boolean;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  version: string;
  metadata: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  accessControlContract: string;
}

export interface ChildMetadata {
  title: string;
  description: string;
  image: string;
  attachments: Attachment[];
  tags: string[];
  prompt: string;
  aiModel: string;
  loras: string[];
  workflow: string;
  version: string;
}

export interface Attachment {
  uri: string;
  type: string;
}

export interface Child {
  childId: string;
  childContract: string;
  supplier: string;
  infraId: string;
  childType: string;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  version: string;
  maxPhysicalEditions: string;
  currentPhysicalEditions: string;
  uriVersion: string;
  usageCount: string;
  supplyCount: string;
  infraCurrency: string;
  uri: string;
  metadata: ChildMetadata;
  status: string;
  availability: string;
  isImmutable: boolean;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  digitalReferencesOpenToAll: boolean;
  physicalReferencesOpenToAll: boolean;
  standaloneAllowed: boolean;
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
}

export interface OrderMarket {
  orderStatus: string;
  orderId: string;
  fulfillmentData: Details | EncryptedData | string;
  blockTimestamp: string;
  transactionHash: string;
  blockNumber: string;
  decrypted: boolean;
  parentId: string;
  parentAmount: string;
  parentContract: string;
  isPhysical: boolean;
  fulfillment: {
    estimatedDeliveryDuration: string;
    digitalSteps: FulfillmentStep[];
    physicalSteps: FulfillmentStep[];
    currentStep: string;
    createdAt: string;
    lastUpdated: string;
    isPhysical: boolean;
    fulfillmentOrderSteps: {
      notes: string;
      completedAt: string;
      isCompleted: boolean;
      stepIndex: string;
    }[];
  };
  payments: {
    fulfillerId: string;
    amount: string;
    recipient: string;
    paymentType: string;
  }[];
  parent: Parent;
}
