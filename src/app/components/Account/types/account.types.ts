import { Details } from "../../Walkthrough/types/walkthrough.types";
import {
  Attachment,
  Child,
  ChildReference,
  Fulfiller,
  OrderMarket,
  Template,
} from "../../Sell/types/sell.types";
import { EncryptedData } from "../../Common/types/common.types";
import { SetStateAction } from "react";

export interface Order {
  orderId: string;
  totalPrice: string;
  currency: string;
  buyer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  collection: {
    collectionId: string;
    metadata: {
      images: string[];
      title: string;
    };
  };
  isFulfilled: boolean;
  status: Status;
  amount: string;
  details?: Details | EncryptedData | string;
  decrypted: boolean;
}

export enum StatusMarket {
  Paid = "Paid",
  Cancelled = "Cancelled",
  Refunded = "Refunded",
  Disputed = "Disputed",
}

export enum PaymentType {
  Child = "Child",
  Parent = "Parent",
  Template = "Template",
  Fulfiller = "Fulfiller",
}

export enum Status {
  Fulfilled = "Fulfilled",
  Shipped = "Shipped",
  Shipping = "Shipping",
  Designing = "Designing",
}

export type OrderMarketProps = {
  order: OrderMarket;
  orderOpen: boolean[];
  setOrderOpen: (
    e: SetStateAction<{ prerolls: boolean[]; market: boolean[] }>
  ) => void;
  index: number;
  handleDecryptFulfillment: (order: Order | OrderMarket, prerolls: boolean) => Promise<void>;
  decryptLoading: boolean[];
  dict: any;
  connected: boolean;
  chainId: number | undefined;
};

export type OrderProps = {
  order: Order;
  orderOpen: boolean[];
  setOrderOpen: (
    e: SetStateAction<{ prerolls: boolean[]; market: boolean[] }>
  ) => void;
  index: number;
  handleDecryptFulfillment: (order: Order, prerolls: boolean) => Promise<void>;
  decryptLoading: boolean[];
  dict: any;
  connected: boolean;
  chainId: number | undefined;
};

export interface DesignerFormData {
  title: string;
  description: string;
  link: string;
  image: File | string | null;
}

export interface DesignerProps {
  dict: any;
}

export interface Parent {
  infraId: string;
  designId: string;
  totalPhysicalPrice: string;
  canCreate: boolean;
  canApprove: boolean;
  parentContract: string;
  designer: string;
  scm: string;
  title: string;
  symbol: string;
  digitalPrice: string;
  physicalPrice: string;
  printType: string;
  availability: string;
  digitalMarketsOpenToAll: boolean;
  physicalMarketsOpenToAll: boolean;
  authorizedMarkets: MarketContract[];
  status: string;
  infraCurrency: string;
  totalPurchases: string;
  maxDigitalEditions: string;
  maxPhysicalEditions: string;
  currentDigitalEditions: string;
  currentPhysicalEditions: string;
  childReferences: ChildReference[];
  tokenIds: string[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  uri: string;
  metadata: ParentMetadata;
  authorizedChildren: Child[];
  authorizedTemplates: Template[];
  workflow: Workflow;
}

export interface Workflow {
  estimatedDeliveryDuration: string;
  digitalSteps: FulfillmentStep[];
  physicalSteps: FulfillmentStep[];
}

export interface FulfillmentStep {
  primaryPerformer: string;
  instructions: string;
  fulfiller?: Fulfiller;
}

export interface ParentMetadata {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  prompt: string;
  attachments: Attachment[];
  aiModel: string;
  loras: string[];
  workflow: string;
  version: string;
  customFields?: Record<string, string>;
}

export interface MarketContract {
  id: string;
  infraId: string;
  deployer: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  contractAddress: string;
  title: string;
  isActive: boolean;
  symbol: string;
  marketURI: string;
  marketMetadata?: ParentContractMetadata;
  fulfillerContract: string;
}

export interface ParentContractMetadata {
  title: string;
  description: string;
  image: string;
}

export interface ParentProps {
  dict: any;
}
