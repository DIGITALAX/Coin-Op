import Hook from "@/components/Common/modules/Hook";
import RollSearch from "@/components/Common/modules/RollSearch";
import { FunctionComponent } from "react";
import useRollSearch from "../hooks/useRollSearch";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const Header: FunctionComponent = (): JSX.Element => {
  const { handleRollSearch, prompt, setPrompt, handlePromptChoose } =
    useRollSearch();
  const router = useRouter();
  const rollSearch = useSelector(
    (state: RootState) => state.app.rollSearchReducer.value
  );
  return (
    <div className="relative w-full flex flex-col gap-20 px-3 pt-2 pb-20">
      <div className="flex flex-row items-center w-full h-fit text-white font-mega">
        <div className="relative flex flex-col justify-start w-fit h-fit items-center">
          insert api key here
        </div>
        <div className="relative flex flex-col justify-end w-fit h-fit items-center ml-auto">
          coin op
        </div>
      </div>
      <div className="relative flex flex-col items-center justify-center w-full h-fit gap-28">
        <RollSearch
          rollSearch={rollSearch}
          handleRollSearch={handleRollSearch}
          setPrompt={setPrompt}
          prompt={prompt}
          handlePromptChoose={handlePromptChoose}
          router={router}
        />
        <Hook />
      </div>
    </div>
  );
};

export default Header;
