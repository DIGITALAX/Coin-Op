import { useEffect, useState } from "react";
import { getOrders } from "../../../../graphql/subgraph/queries/getOrders";
import { useAccount } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const useOrders = () => {
  const { address } = useAccount();
  const dispatch = useDispatch();
  const allOrders = useSelector(
    (state: RootState) => state.app.allOrdersReducer.value
  );
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);

  const getAllOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await getOrders(address as string);
      if (!res || res?.data?.orderCreateds?.length < 1) {
        setOrdersLoading(false);
        return;
      }
      dispatch(res?.data?.orderCreateds);
    } catch (err: any) {
      console.error(err.message);
    }
    setOrdersLoading(false);
  };

  useEffect(() => {
    if (allOrders.length < 1 || !allOrders) {
      getAllOrders();
    }
  }, []);

  return {
    ordersLoading,
  };
};

export default useOrders;
