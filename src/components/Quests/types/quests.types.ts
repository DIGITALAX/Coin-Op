import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export interface Quest {
  participantAddress: string;
  participantId: string;
  pointScore: string;
  questsCompleted: string;
  questStartTime: string;
  questsCompletedIds: string[];
  withPKP: boolean;
  transactionHash: string;
  totalQuests: string;
}

export type QuestStatsProps = {
  questInfo: Quest | undefined;
  getQuestInformation: () => Promise<void>;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
  connected: boolean;
  questsLoading: boolean;
};

export type QuestListProps = {
  questPoints: number[];
  questInfo: Quest | undefined;
  questsLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  connected: boolean;
  router: NextRouter;
  connectedPKP: any;
  chain: number | undefined;
  openChainModal: (() => void) | undefined;
};
