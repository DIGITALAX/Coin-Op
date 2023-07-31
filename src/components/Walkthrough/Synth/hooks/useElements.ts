import { useState } from "react";

type UseElementsReturnType = {
  history: Map<string, any[]>;
  index: Map<string, number>;
  setState: (patternId: string, action: any, overwrite?: boolean) => void;
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
};

const useElements = (): UseElementsReturnType => {
  const [index, setIndex] = useState(new Map<string, number>());
  const [history, setHistory] = useState(new Map<string, any[]>());

  const setState = (patternId: string, action: any, overwrite = false) => {
    setHistory((prevHistory) => {
      const newHistory = new Map(prevHistory);

      if (!newHistory.has(patternId)) {
        newHistory.set(patternId, []);
        setIndex((prevIndex) => new Map(prevIndex.set(patternId, -1)));
      }

      let newState =
        typeof action === "function"
          ? action(newHistory.get(patternId)![index.get(patternId)!])
          : action;

      if (overwrite) {
        newHistory.set(patternId, newState);
      } else {
        newHistory.set(patternId, [
          ...newHistory.get(patternId)!.slice(0, index.get(patternId)! + 1),
          newState[newState.length - 1],
        ]);
        setIndex(
          (prevIndex) =>
            new Map(
              prevIndex.set(patternId, newHistory.get(patternId)!.length - 1)
            )
        );
      }
      return newHistory;
    });
  };

  const undo = (patternId: string) => {
    setIndex((prevIndex) => {
      const newIndex = new Map(prevIndex);
      const currentValue = newIndex.get(patternId);
      if (currentValue !== undefined && currentValue > 0) {
        newIndex.set(patternId, currentValue - 1);
      }
      return newIndex;
    });
  };

  const redo = (patternId: string) => {
    setIndex((prevIndex) => {
      const newIndex = new Map(prevIndex);
      const currentValue = newIndex.get(patternId);
      if (
        currentValue !== undefined &&
        currentValue < history.get(patternId)!.length - 1
      ) {
        newIndex.set(patternId, currentValue + 1);
      }
      return newIndex;
    });
  };

  return {
    history,
    index,
    setState,
    undo,
    redo,
  };
};

export default useElements;
