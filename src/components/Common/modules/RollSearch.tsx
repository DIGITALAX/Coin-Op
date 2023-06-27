import { FunctionComponent } from "react";

const RollSearch: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-3/4 flex flex-col justify-start h-fit gap-4">
      <input
        className="bg-black font-mega text-white text-xs w-full h-full rounded-full flex py-1 px-4 h-11 border border-white"
        placeholder={`graffiti on a wall in LES, illustration, digital art, breakcore`}
      />
      <div className="relative justify-start rounded-sm bg-white text-black font-mega text-xs cursor-pointer active:scale-95 px-1.5 py-1 w-fit h-8 items-center flex hover:opacity-70">
        search prompts
      </div>
      <div className="relative inline-flex flex-wrap gap-3"></div>
      <div className="relative w-fit h-fit ">see all</div>
    </div>
  );
};

export default RollSearch;
