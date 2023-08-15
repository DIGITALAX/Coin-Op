import { useState } from "react";
import { setQuestPrelude } from "../../../../redux/reducers/questPreludeSlice";
import { useDispatch } from "react-redux";

const useQuest = () => {
  // there is a contract with the sign ups and tehy can sign up,
  // api checks if they have bought preroll, have a lens account,
  // contract adds to their wallet point score according to each item
  // pkp initiates and signs the transaction for each sign up after each login/load checking how much they have completed, manual fallback tambien
  const dispatch = useDispatch();
  const [questSignUpLoading, setQuestSignUpLoading] = useState<boolean>(false);

  const signUpForQuest = async (): Promise<void> => {
    setQuestSignUpLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    dispatch(setQuestPrelude(false));
    setQuestSignUpLoading(false);
  };

  return {
    questSignUpLoading,
    signUpForQuest,
  };
};

export default useQuest;
