import { useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessagesModal } from "../../../../redux/reducers/messagesModalSlice";
import { RootState } from "../../../../redux/store";
import { setModalOpen } from "../../../../redux/reducers/modalOpenSlice";
import { setSubscriptionInfo } from "../../../../redux/reducers/subscriptionInfoSlice";
import { useRouter } from "next/router";

const useSubscription = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [subscriptionLoading, setSubscriptionLoading] =
    useState<boolean>(false);
  const subscriptionInfo = useSelector(
    (state: RootState) => state.app.subscriptionInfoReducer.value
  );

  const handleSubscription = async (): Promise<void> => {
    setSubscriptionLoading(true);
    try {
      if (!stripe || !elements) {
        return;
      }

      if (
        subscriptionInfo?.email.trim() === "" ||
        subscriptionInfo?.firstName.trim() === "" ||
        subscriptionInfo?.lastName.trim() === ""
      ) {
        dispatch(
          setModalOpen({
            actionOpen: true,
            actionMessage: "Fill out your Contact & Payment details first.",
          })
        );
        return;
      }

      const cardElement = elements.getElement("card");

      if (!cardElement) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
        return;
      }

      const result = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (result.error) {
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage: "Something went wrong. Try again?",
          })
        );
        return;
      }

      const paymentMethodId = result.paymentMethod.id;
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: subscriptionInfo!.email,
          firstName: subscriptionInfo!.firstName,
          lastName: subscriptionInfo!.lastName,
          paymentMethodId,
        }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setSubscriptionLoading(false);
        dispatch(
          setSubscriptionInfo({
            email: "",
            firstName: "",
            lastName: "",
          })
        );
        dispatch(
          setMessagesModal({
            actionOpen: true,
            actionMessage:
              "Subscription Confirmed. Return to your account page soon for next steps and keep an eye out on your email for web3 and AI instructables.",
          })
        );
        await router.push("account");
      }
    } catch (err: any) {
      setSubscriptionLoading(false);
      dispatch(
        setMessagesModal({
          actionOpen: true,
          actionMessage: "Something went wrong. Try again?",
        })
      );
      console.error(err.messsage);
    }
  };

  return {
    handleSubscription,
    subscriptionLoading,
  };
};

export default useSubscription;
