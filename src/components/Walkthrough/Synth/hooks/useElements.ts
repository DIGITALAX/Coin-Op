import { useState } from "react";
import lodash from "lodash";
import { SvgPatternType } from "../types/synth.types";

const useElements = (initialState: any, pattern: boolean) => {
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
    if ((!pattern && index > 0) || (pattern && index > 1)) {
      if (pattern) {
        const lastElements = lodash.filter(
          history[index - 1],
          (element: SvgPatternType) => {
            return (
              element.type !== "pattern" 
            );
          }
        );
        if (lastElements?.length > 0 || history[2]) {
          setIndex((prevState) => prevState - 1);
        }
      } else {
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
