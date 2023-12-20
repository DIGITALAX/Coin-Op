import { AnyAction, Dispatch } from "redux";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import { setModalOpen } from "../../../redux/reducers/modalOpenSlice";

const errorChoice = async (
  err: any,
  runner: (() => Promise<void>) | (() => void),
  dispatch: Dispatch<AnyAction>
) => {
  if (err?.message?.includes("User rejected the request")) return;
  if (
    !err?.messages?.includes("Block at number") &&
    !err?.message?.includes("could not be found")
  ) {
    dispatch(
      setModalOpen({
        actionOpen: true,
        actionMessage:
          "Something went wrong indexing your interaction. Try again?",
      })
    );
    console.error(err.message);
  } else {
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: "Successfully Indexed",
      })
    );

    if (runner() instanceof Promise) {
      await runner();
    } else {
      runner();
    }

    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionOpen: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  }
};

export default errorChoice;
