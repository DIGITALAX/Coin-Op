import { useState } from "react";
import lodash from "lodash";
import { SvgPatternType } from "../types/synth.types";

const useElements = (initialState: any) => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: any, overwrite = false) => {
    const newState =
      typeof action === "function" ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = (): boolean | void => {
    if (index > 1) {
      const lastElements = lodash.filter(
        history[index - 1],
        (element: SvgPatternType) => {
          return element.type !== "pattern" && element.type !== "circle";
        }
      );
      if (lastElements?.length > 0 || history[2]) {
        setIndex((prevState) => prevState - 1);
      }
    }
  };

  const redo = (): boolean | void => {
    if (index < history.length - 1) {
      setIndex((prevState) => prevState + 1);
    }
  };

  return [history[index], setState, undo, redo];
};

export default useElements;
