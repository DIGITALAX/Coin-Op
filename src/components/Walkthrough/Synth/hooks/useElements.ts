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
  const [redoStack, setRedoStack] = useState(new Map<string, any[]>());

  const setState = (patternId: string, action: any, overwrite = false) => {
    setHistory((prevHistory) => {
      const newHistory = new Map(prevHistory);

      if (!newHistory.has(patternId)) {
        newHistory.set(patternId, []);
        setIndex((prevIndex) => new Map(prevIndex.set(patternId, -1)));
      }

      let newState: any[] =
        typeof action === "function"
          ? action(newHistory.get(patternId)![index.get(patternId)!])
          : action;

      if (overwrite) {
        newHistory.set(patternId, newState);
        setIndex(
          (prevIndex) => new Map(prevIndex.set(patternId, newState.length - 1))
        );
      } else {
        const currentIndex = index.get(patternId)!;
        const updatedHistory = newHistory
          .get(patternId)!
          .slice(0, currentIndex); // change here
        newHistory.set(patternId, [
          ...updatedHistory,
          newState[newState.length - 1],
        ]);
        setIndex(
          (prevIndex) => new Map(prevIndex.set(patternId, currentIndex + 1))
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

        setRedoStack((prevRedo) => {
          const newRedo = new Map(prevRedo);
          const currentRedo = newRedo.get(patternId) || [];
          const undoneAction = history.get(patternId)![currentValue];
          newRedo.set(patternId, [undoneAction, ...currentRedo]);
          return newRedo;
        });
      }

      return newIndex;
    });
  };

  const redo = (patternId: string) => {
    setIndex((prevIndex) => {
      const newIndex = new Map(prevIndex);
      const currentValue = newIndex.get(patternId);
      const currentRedo = redoStack.get(patternId) || [];
      const currentHistory = history.get(patternId) || [];

      if (
        currentValue !== undefined &&
        currentValue < currentHistory.length - 1 &&
        currentRedo.length > 0
      ) {
        newIndex.set(patternId, currentValue + 1);

        setRedoStack((prevRedo) => {
          const newRedo = new Map(prevRedo);
          newRedo.set(patternId, currentRedo.slice(1));
          return newRedo;
        });

        setHistory((prevHistory) => {
          const newHistory = new Map(prevHistory);

          if (
            currentRedo[0] &&
            !currentHistory.some((el) => el.id === currentRedo[0].id)
          ) {
            newHistory.set(patternId, [...currentHistory, currentRedo[0]]);
          }
          return newHistory;
        });
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
