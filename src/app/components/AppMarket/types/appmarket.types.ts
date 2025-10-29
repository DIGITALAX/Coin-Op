import { Account, Post } from "@lens-protocol/client";
import { SetStateAction } from "react";

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

export interface Parent {
  infraId: string;
  designId: string;
  parentContract: string;
  designer: string;
  designerProfile: Designer;
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
  marketRequests: MarketRequests[];
  authorizedChildren: Child[];
  authorizedTemplates: Template[];
  workflow: Workflow;
  currentIndex: number;
  newDrop: boolean;
  chosenSize: string;
}

export interface MarketRequests {
  tokenId: string;
  marketContract: string;
  isPending: boolean;
  approved: boolean;
  timestamp: string;
}

export interface Supplier {
  id: string;
  supplierId: string;
  supplier: string;
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

export interface Template {
  templateId: string;
  templateContract: string;
  supplier: string;
  supplierProfile: Supplier;
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
  authorizedMarkets: MarketContract[];
  childReferences: ChildReference[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  authorizedParents: AuthorizedParents[];
  authorizedTemplates: AuthorizedTemplates[];
  parentRequests: ParentRequests[];
  templateRequests: TemplateRequests[];
  marketRequests: MarketRequests[];
  authorizedChildren: AuthorizedChildren[];
  physicalRights: PhysicalRights[];
}

export interface TemplateRequests {
  childId: string;
  requestedAmount: string;
  templateId: string;
  templateContract: string;
  isPending: boolean;
  approved: boolean;
  approvedAmount: string;
  timestamp: string;
  template?: {
    uri: string;
    metadata: {
      image: string;
      title: string;
    };
  };
}

export interface AuthorizedChildren {
  childContract: string;
  childId: string;
  uri: string;
  metadata: {
    title: string;
    image: string;
  };
}

export interface ParentRequests {
  childId: string;
  requestedAmount: string;
  parentId: string;
  parentContract: string;
  isPending: boolean;
  approved: boolean;
  approvedAmount: string;
  timestamp: string;
  parent?: {
    uri: string;
    metadata: {
      image: string;
      title: string;
    };
  };
}

export interface AuthorizedTemplates {
  templateContract: string;
  templateId: string;
  uri: string;
  metadata: {
    title: string;
    image: string;
  };
}

export interface PhysicalRights {
  buyer: string;
  child: {
    childId: string;
    childContract: string;
    uri: string;
    metadata: {
      title: string;
      image: string;
    };
  };
}

export interface AuthorizedParents {
  parentContract: string;
  parentId: string;
  uri: string;
  metadata: {
    title: string;
    image: string;
  };
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
  customFields?: Record<string, string>;
}

export interface ChildReference {
  parent?: Parent;
  childContract: string;
  childId: string;
  template?: Template;
  isTemplate?: boolean;
  child?: Child;
  amount: string;
  placementURI: string;
  metadata: {
    instructions: string;
    customFields: Record<string, string>;
  };
}

export interface Child {
  childId: string;
  childContract: string;
  supplier: string;
  infraId: string;
  supplierProfile: Supplier;
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
  authorizedMarkets: MarketContract[];
  createdAt: string;
  updatedAt: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  authorizedParents: AuthorizedParents[];
  authorizedTemplates: AuthorizedTemplates[];
  parentRequests: ParentRequests[];
  templateRequests: TemplateRequests[];
  marketRequests: MarketRequests[];
  authorizedChildren: AuthorizedChildren[];
  physicalRights: PhysicalRights[];
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

export interface Workflow {
  estimatedDeliveryDuration: number;
  digitalSteps: FulfillmentStep[];
  physicalSteps: FulfillmentStep[];
}

export interface Fulfiller {
  id: string;
  fulfillerId: string;
  fulfiller: string;
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

export interface SubPerformer {
  splitBasisPoints: number;
  performer: string;
}

export interface FulfillmentStep {
  primaryPerformer: string;
  instructions: string;
  subPerformers: SubPerformer[];
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
  sizes?: string[];
  customFields?: Record<string, string>;
}

export interface Attachment {
  uri: string;
  type: string;
}

export type CartItemMarket = {
  item: Parent;
  chosenAmount: number;
  chosenChildId?: string;
  chosenTemplateId?: string;
};
