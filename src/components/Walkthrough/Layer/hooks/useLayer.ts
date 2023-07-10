import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { getTemplatesByPrintType } from "../../../../../graphql/subgraph/queries/getTemplates";
import { setPrintTypeLayers } from "../../../../../redux/reducers/printTypeLayersSlice";
import { setLayerToSynth } from "../../../../../redux/reducers/layerToSynthSlice";

const useLayer = () => {
  const dispatch = useDispatch();
  const template = useSelector(
    (state: RootState) => state.app.templateReducer.value
  );
  const [layersLoading, setLayersLoading] = useState<boolean>(false);

  const getLayers = async () => {
    setLayersLoading(true);
    try {
      const data = await getTemplatesByPrintType(template.type);
      dispatch(setPrintTypeLayers(data?.data?.fgotemplateCreateds));
    } catch (err: any) {
      console.error(err.message);
    }
    setLayersLoading(false);
  };

  useEffect(() => {
    getLayers();
  }, [template]);

  return {
    layersLoading,
  };
};

export default useLayer;
