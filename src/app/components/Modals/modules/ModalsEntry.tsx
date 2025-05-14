"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import ImageLarge from "./ImageLarge";
import General from "./General";
import SearchExpand from "./SearchExpand";
import ApiAdd from "./ApiAdd";
import Index from "./Index";
import FullScreenVideo from "./FullScreenVideo";
import Signless from "./Signless";
import CrearCuenta from "./CrearCuenta";
import Who from "./Who";
import QuoteBox from "./QuoteBox";
import PostCollect from "./PostCollect";
import { Indexar } from "../../Common/types/common.types";

const ModalsEntry = ({ dict }: { dict: any }) => {
  const context = useContext(ModalContext);

  return (
    <>
      {context?.quoteBox && <QuoteBox dict={dict} />}
      {context?.postCollect?.id && <PostCollect dict={dict} />}
      {context?.reactBox && <Who dict={dict} />}
      {context?.fullScreenVideo?.open && <FullScreenVideo />}
      {context?.indexar !== Indexar.Inactivo && <Index />}
      {context?.openApiKey && <ApiAdd dict={dict} />}
      {context?.searchExpand && <SearchExpand dict={dict} />}
      {context?.modalOpen && <General dict={dict} />}
      {context?.verImagen && <ImageLarge />}
      {context?.crearCuenta && <CrearCuenta dict={dict} />}
      {context?.signless && <Signless dict={dict} />}
    </>
  );
};

export default ModalsEntry;
