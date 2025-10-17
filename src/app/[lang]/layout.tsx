import Modals from "../components/Modals/modules/Modals";
import Footer from "../components/Common/modules/Footer";
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
      {children}
      <Footer params={params} />
      <Modals params={params} />
    </div>
  );
}
