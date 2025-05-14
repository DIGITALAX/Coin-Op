import Modals from "../components/Modals/modules/Modals";
import Footer from "../components/Common/modules/Footer";
import Prerolls from "../components/Prerolls/modules/Prerolls";
import Header from "../components/Common/modules/Header";

export type tParams = Promise<{ lang: string }>;

export default function Wrapper({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <div className="relative overflow-x-hidden w-full h-fit flex flex-col selection:bg-oscurazul selection:text-white gap-5 items-center justify-start">
      <Header params={params} />
      <div className="relative overflow-hidden w-full h-fit xl:h-[60rem] flex flex-col xl:flex-row px-2 preG:px-6 gap-10 xl:items-start xl:justify-between items-center justify-start">
        <Prerolls left={true} params={params} />
        {children}
        <Prerolls right={true} params={params} />
      </div>
      <Footer params={params} />
      <Modals params={params} />
    </div>
  );
}
