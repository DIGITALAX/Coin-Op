import { AnyAction, Dispatch } from "redux";
import { setIndexModal } from "../../../redux/reducers/indexModalSlice";
import { setModalOpen } from "../../../redux/reducers/modalOpenSlice";
import { TFunction } from "i18next";

const errorChoice = async (
  err: any,
  runner: (() => Promise<void>) | (() => void),
  dispatch: Dispatch<AnyAction>,
  t: TFunction<"common", undefined>
) => {
  if (err?.message?.includes("User rejected the request")) return;
  if (
    !err?.messages?.includes("Block at number") &&
    !err?.message?.includes("could not be found")
  ) {
    dispatch(
      setModalOpen({
        actionOpen: true,
        actionMessage: t("try"),
      })
    );
    console.error(err.message);
  } else {
    dispatch(
      setIndexModal({
        actionOpen: true,
        actionMessage: t("succ"),
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
