import { gql } from "@apollo/client";
import { graphClient, graphClientTestnet } from "../../../lib/subgraph/client";

const QUESTS = `
  query($participantAddress: String) {
    newQuestSignUps(where: {participantAddress: $participantAddress},orderBy: blockTimestamp, orderDirection: desc) {
        participantAddress
        participantId
        pointScore
        questsCompleted
        questStartTime
        questsCompletedIds
        withPKP
        transactionHash
    }
  }
`;

const POINTS_QUEST = `
query {
  pointsPerQuestSets {
    pointScores
  }
}`;

export const getQuestByAddress = async (
  participantAddress: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(QUESTS),
    variables: {
      participantAddress,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getAllQuestsPoints = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(POINTS_QUEST),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
