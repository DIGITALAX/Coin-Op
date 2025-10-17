import { useEffect, useState } from "react";

const useAppMarket = () => {
  const [appMarketLoading, setAppMarketLoading] = useState<boolean>(false);
  const [appMarket, setAppMarket] = useState<[]>([]);
  const [data, setData] = useState<{hasMore: boolean; skip: number}>({
    hasMore: true,
    skip: 0
  })

  const getAppMarket = async () => {
    setAppMarketLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setAppMarketLoading(false);
  };

  const getMoreAppMarket = async () => {
    setAppMarketLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setAppMarketLoading(false);
  };

  useEffect(() => {
    if (!appMarketLoading && appMarket.length < 1) {
      getAppMarket();
    }
  }, []);

  return {
    appMarketLoading,
    appMarket,
    getMoreAppMarket,
    data
  };
};

export default useAppMarket;
