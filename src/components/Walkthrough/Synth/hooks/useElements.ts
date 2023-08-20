import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setElements } from "../../../../../redux/reducers/setElementsSlice";
import lodash from "lodash";

type UseElementsReturnType = {
  history: Map<string, any[]>;
  index: Map<string, number>;
  setState: (
    patternId: string,
    action: any,
    overwrite?: boolean,
    resize?: boolean,
    continuousDrawing?: boolean
  ) => void;
  undo: (patternId: string) => void;
  redo: (patternId: string) => void;
};

const useElements = (): UseElementsReturnType => {
  const dispatch = useDispatch();
  const [index, setIndex] = useState(new Map<string, number>());
  const [history, setHistory] = useState(new Map<string, any[]>());
  const [redoStack, setRedoStack] = useState(new Map<string, any[]>());
  const [updatedHistory, setUpdatedHistory] = useState<any[]>([]);

  const setState = (
    patternId: string,
    action: any,
    overwrite = false,
    resize = false,
    continuousDrawing = false
  ) => {
    setHistory((prevHistory) => {
      const newHistory = new Map(prevHistory);

      if (!newHistory.has(patternId)) {
        newHistory.set(patternId, []);
        setIndex((prevIndex) => {
          const updatedIndex = new Map(prevIndex);
          updatedIndex.set(patternId, -1);
          return updatedIndex;
        });
      }

      let currentIdx = index.get(patternId);
      if (currentIdx === undefined) {
        currentIdx = 0;
        setIndex((prevIndex) => new Map(prevIndex.set(patternId, currentIdx!)));
      }

      let newState: any[] = action;

      if (resize) {
        newHistory.set(patternId, newState);
      } else if (overwrite) {
        if (continuousDrawing) {
          // Assuming you add a continuousDrawing flag
          const currentHistory = newHistory.get(patternId)!;
          currentHistory[currentHistory.length - 1] =
            newState[newState.length - 1];
          newHistory.set(patternId, currentHistory);
        } else {
          newHistory.set(patternId, newState);
          setIndex((prevIndex) => {
            const updatedIndex = new Map(prevIndex);
            updatedIndex.set(patternId, newState.length - 1);
            return updatedIndex;
          });
        }
      } else {
        const updatedHistory = newHistory.get(patternId)!.slice(0, currentIdx);

        newHistory.set(patternId, [
          ...updatedHistory,
          newState[newState.length - 1],
        ]);
        setIndex((prevIndex) => {
          const updatedIndex = new Map(prevIndex);
          const currentValue = updatedIndex.get(patternId) || 0;
          updatedIndex.set(patternId, currentValue + 1);
          return updatedIndex;
        });
      }
      setUpdatedHistory(lodash.cloneDeep(newHistory.get(patternId)!));
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

  useEffect(() => {
    if (updatedHistory?.length > 0) {
      dispatch(setElements(updatedHistory));
      setUpdatedHistory([]);
    }
  }, [updatedHistory]);

  return {
    history,
    index,
    setState,
    undo,
    redo,
  };
};

export default useElements;
