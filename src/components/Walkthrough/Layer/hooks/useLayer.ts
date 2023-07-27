import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { getTemplatesByPrintType } from "../../../../../graphql/subgraph/queries/getTemplates";
import { setPrintTypeLayers } from "../../../../../redux/reducers/printTypeLayersSlice";
import { setLayerToSynth } from "../../../../../redux/reducers/layerToSynthSlice";
import { Layer } from "../types/layer.types";

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

      let newLayers: Layer[] = [];

      for (let i = 0; i < data?.data?.fgotemplateCreateds?.length; i++) {
        let results: string[] = [];

        for (
          let j = 0;
          j < data?.data?.fgotemplateCreateds[i]?.childTokenURIs?.length;
          j++
        ) {
          results.push(
            data?.data?.fgotemplateCreateds[i]?.childTokenURIs[j]?.split(",")
          );
        }

        newLayers.push({
          ...data?.data?.fgotemplateCreateds[i],
          childTokenURIs: results,
        });
      }

      dispatch(setPrintTypeLayers(newLayers));
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
