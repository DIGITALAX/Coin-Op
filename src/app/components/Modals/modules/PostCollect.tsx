import { ModalContext } from "@/app/providers";
import {
  bigDecimal,
  evmAddress,
  SimpleCollectAction,
} from "@lens-protocol/client";
import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import useCollectConfig from "../hooks/useCollectConfig";
import { ASSETS } from "@/app/lib/constants";
import { SimpleCollect } from "../../Common/types/common.types";

const PostCollect: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { drops, setDrops } = useCollectConfig(dict);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] md:w-[50vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-center justify-start">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() =>
                context?.setPostCollect((prev) => ({
                  type: prev.type,
                }))
              }
            />
          </div>
          <div
            className={`relative rounded-md flex gap-5 w-full items-center justify-center h-full`}
          >
            <div className="relative w-full h-full flex flex-col flex-wrap justify-start items-center gap-3 break-words p-3">
              <div className="relative h-full w-full flex flex-wrap gap-4 items-start justify-center">
                {[
                  {
                    type: "drop",
                    title: dict.Common.who,
                    dropValues: [dict.Common.todos, dict.Common.seguidor],
                    dropOpen: drops.whoCollectsOpen,
                    chosenValue: context?.postCollect?.type?.followerOnGraph
                      ? dict.Common.seguidor
                      : dict.Common.todos,
                    showObject: true,
                    openDropdown: () =>
                      setDrops((prev) => ({
                        ...prev,
                        whoCollectsOpen: !prev.whoCollectsOpen,
                      })),
                    setValue: (item: string) => {
                      context?.setPostCollect((prev) => {
                        let col = prev?.type;
                        let followerOnGraph =
                          item === dict.Common.seguidor
                            ? {
                                followerOnGraph: {
                                  globalGraph: true as true,
                                },
                              }
                            : {};
                        if (!followerOnGraph?.followerOnGraph) {
                          const { followerOnGraph, ...all } = col!;
                          col = all;
                        }

                        col =
                          drops?.award == "No"
                            ? {
                                ...col,
                                ...followerOnGraph,
                                payToCollect: null,
                              }
                            : {
                                ...col,
                                ...followerOnGraph,
                              };

                        return {
                          ...prev,
                          type: col as any,
                        };
                      });

                      setDrops((prev) => ({
                        ...prev,
                        whoCollectsOpen: false,
                      }));
                    },
                  },
                  {
                    type: "drop",
                    title: dict.Common.award,
                    dropValues: [dict.Common.yes, "No"],
                    dropOpen: drops.creatorAwardOpen,
                    chosenValue: drops.award,
                    showObject: true,
                    openDropdown: () =>
                      setDrops((prev) => ({
                        ...prev,
                        creatorAwardOpen: !prev.creatorAwardOpen,
                      })),
                    setValue: (item: string) => {
                      context?.setPostCollect((prev) => {
                        let col = prev?.type;

                        let followerOnGraph =
                          context?.postCollect?.type?.followerOnGraph ===
                          dict.Common.seguidor
                            ? {
                                followerOnGraph: {
                                  globalGraph: true as true,
                                },
                              }
                            : {};

                        if (!followerOnGraph?.followerOnGraph) {
                          const { followerOnGraph, ...all } = col!;
                          col = all;
                        }

                        col =
                          item == "No"
                            ? {
                                ...col,
                                ...followerOnGraph,
                                payToCollect: null,
                              }
                            : ({
                                ...col,
                                payToCollect: {
                                  ...col?.payToCollect,
                                  referralShare: 0,

                                  amount: {
                                    value: "10",
                                    currency: evmAddress(
                                      ASSETS[0]?.contract?.address
                                    ),
                                  },
                                },
                              } as any);

                        return {
                          ...prev,
                          type: col as any,
                        };
                      });

                      setDrops((prev) => ({
                        ...prev,
                        creatorAwardOpen: false,
                        award: item,
                      }));
                    },
                  },
                  {
                    type: "input",
                    title: dict.Common.awardAmount,
                    chosenValue:
                      context?.postCollect?.type?.payToCollect?.amount?.value ||
                      "0",
                    showObject: drops.award === dict.Common.yes ? true : false,
                    setValue: (item: string) => {
                      if (isNaN(Number(item))) return;
                      context?.setPostCollect((prev) => {
                        let col = prev?.type ?? {
                          payToCollect: {
                            referralShare: 0,

                            amount: {
                              value: "10",
                              currency: evmAddress(
                                ASSETS[0]?.contract?.address
                              ),
                            },
                          },
                        };

                        col = {
                          ...col,
                          payToCollect: {
                            ...col?.payToCollect,
                            amount: {
                              currency: evmAddress(
                                ASSETS?.find(
                                  (at) =>
                                    at?.contract?.address?.toLowerCase() ==
                                    context?.postCollect?.type?.payToCollect?.amount?.currency?.toLowerCase()
                                )?.contract?.address ??
                                  ASSETS[0]?.contract?.address
                              ),
                              value: item,
                            },
                          },
                        } as SimpleCollect;

                        return {
                          ...prev,
                          type: col,
                        };
                      });
                    },
                  },
                  {
                    type: "drop",
                    title: dict.Common.moneda,
                    dropValues: ASSETS?.map((item) => item.symbol),
                    chosenValue:
                      ASSETS?.find((item) => {
                        if (
                          item.contract.address ===
                          context?.postCollect?.type?.payToCollect?.amount
                            ?.currency
                        ) {
                          return item;
                        }
                      })?.symbol ?? ASSETS?.[0]?.symbol,
                    dropOpen: drops.currencyOpen,
                    showObject: drops.award === dict.Common.yes ? true : false,
                    openDropdown: () =>
                      setDrops((prev) => ({
                        ...prev,
                        currencyOpen: !prev.currencyOpen,
                      })),
                    setValue: (item: string) => {
                      setDrops((prev) => ({
                        ...prev,
                        currencyOpen: false,
                      }));

                      context?.setPostCollect((prev) => {
                        let col = prev?.type ?? {
                          payToCollect: {
                            amount: {
                              value: "10",
                              currency: evmAddress(
                                ASSETS[0]?.contract?.address?.toLowerCase()
                              ),
                            },
                          },
                        };

                        return {
                          ...prev,
                          type: {
                            ...col,
                            payToCollect: {
                              ...col?.payToCollect,
                              amount: {
                                ...col?.payToCollect?.amount!,
                                currency: evmAddress(
                                  ASSETS?.find((val) => item == val?.symbol)
                                    ?.contract?.address!
                                ),
                              },
                            },
                          } as SimpleCollect,
                        };
                      });
                    },
                  },
                  {
                    type: "input",
                    title: dict.Common.ref,
                    chosenValue: String(
                      context?.postCollect?.type?.payToCollect?.referralShare ||
                        0
                    ),
                    showObject: drops.award === dict.Common.yes ? true : false,
                    setValue: (item: string) => {
                      if (isNaN(Number(item))) return;
                      context?.setPostCollect((prev) => {
                        let col = prev?.type ?? {
                          payToCollect: {
                            amount: {
                              value: "10",
                              curency: evmAddress(
                                ASSETS?.[0]?.contract?.address
                              ),
                            },
                          },
                        };

                        return {
                          ...prev,
                          type: {
                            ...col,
                            payToCollect: {
                              ...col?.payToCollect!,
                              referralShare: Number(item),
                            },
                          } as SimpleCollect,
                        };
                      });
                    },
                  },
                  {
                    type: "drop",
                    title: dict.Common.limit,
                    dropValues: [dict.Common.yes, "No"],
                    dropOpen: drops.editionOpen,
                    chosenValue: drops.edition,
                    showObject: true,
                    openDropdown: () =>
                      setDrops((prev) => ({
                        ...prev,
                        editionOpen: !prev.editionOpen,
                      })),
                    setValue: (item: string) => {
                      setDrops((prev) => ({
                        ...prev,
                        edition: item,
                      }));

                      context?.setPostCollect((prev) => ({
                        ...prev,
                        type:
                          drops?.edition == "No"
                            ? {
                                ...prev.type,
                                collectLimit: null,
                              }
                            : {
                                ...prev.type,
                              },
                      }));

                      setDrops((prev) => ({
                        ...prev,
                        editionOpen: false,
                      }));
                    },
                  },
                  {
                    type: "input",
                    title: dict.Common.edition,
                    chosenValue:
                      context?.postCollect?.type?.collectLimit || "0",
                    showObject:
                      drops?.edition === dict.Common.yes ? true : false,
                    setValue: (item: string) => {
                      if (isNaN(Number(item))) return;
                      context?.setPostCollect((prev) => ({
                        ...prev,
                        type:
                          drops?.edition == "No"
                            ? {
                                collectLimit: null,
                              }
                            : {
                                collectLimit: Number(item),
                              },
                      }));
                    },
                  },
                  {
                    type: "drop",
                    title: dict.Common.time,
                    dropValues: [dict.Common.yes, "No"],
                    dropOpen: drops.timeOpen,
                    chosenValue: drops.time,
                    showObject: true,
                    openDropdown: () =>
                      setDrops((prev) => ({
                        ...prev,
                        timeOpen: !prev.timeOpen,
                      })),
                    setValue: (item: string) => {
                      setDrops((prev) => ({
                        ...prev,
                        time: item,
                      }));

                      context?.setPostCollect((prev) => {
                        let col = {};
                        if (item === dict.Common.yes) {
                          col = {
                            endsAt: new Date(
                              new Date().getTime() + 24 * 60 * 60 * 1000
                            ) as any,
                          };
                        } else {
                          col = {
                            endsAt: null,
                          };
                        }

                        return {
                          ...prev,
                          type: col,
                        };
                      });

                      setDrops((prev) => ({
                        ...prev,
                        timeOpen: false,
                      }));
                    },
                  },
                ].map(
                  (
                    item: {
                      type: string;
                      title: string;
                      showObject: boolean;
                      dropOpen?: boolean;
                      chosenValue: string | number;
                      dropValues?: string[];
                      openDropdown?: () => void;
                      setValue: (item: string) => void;
                    },
                    indexTwo: number
                  ) => {
                    return (
                      item.showObject &&
                      (item.type === "drop" ? (
                        <div
                          className="relative flex items-center justify-center flex-col w-40 h-fit pb-1.5 gap-2"
                          key={indexTwo}
                        >
                          <div className="relative w-full h-fit flex items-start justify-start font-mana text-white text-xs">
                            {item?.title}
                          </div>
                          <div className="relative w-full h-9 p-px rounded-sm flex flex-row items-center justify-center font-mana text-sol text-center border border-white">
                            <div className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center rounded-sm p-2 gap-2">
                              <div
                                className={`relative flex items-center justify-center cursor-pointer w-4 h-3 ${
                                  item.dropOpen && "-rotate-90"
                                }`}
                                onClick={() => item.openDropdown!()}
                              >
                                <div className="relative w-fit h-fit text-xs">
                                  #
                                </div>
                              </div>
                              <div className="relative w-full h-full p-1.5 bg-offBlack text-xs flex items-center justify-center">
                                {item.chosenValue}
                              </div>
                            </div>
                          </div>
                          {item.dropOpen && (
                            <div className="absolute flex items-start justify-center w-full h-fit max-height-[7rem] overflow-y-scroll z-50 bg-offBlack top-16 p-px border border-white rounded-sm">
                              <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
                                {item.dropValues?.map(
                                  (value: string, indexThree: number) => {
                                    return (
                                      <div
                                        key={indexThree}
                                        className="relative w-full h-8 py-px bg-offBlack items-center justify-center flex text-sol text-xs uppercase font-mana hover:bg-mist hover:text-black cursor-pointer"
                                        onClick={() => {
                                          item.setValue(
                                            indexTwo === 4
                                              ? ASSETS[indexThree].symbol
                                              : value
                                          );
                                          item.openDropdown!();
                                        }}
                                      >
                                        {value}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          className="relative flex items-center justify-center flex-col w-40 h-fit pb-1.5 gap-2"
                          key={indexTwo}
                        >
                          <div className="relative w-full h-fit flex items-start justify-start font-mana text-white text-xs">
                            {item?.title}
                          </div>
                          <div className="relative w-full h-9 p-px rounded-sm flex flex-row items-center justify-center font-mana text-sol text-center border border-white">
                            <div
                              className={`relative flex items-center justify-center cursor-pointer w-4 h-3`}
                            >
                              <div className="relative w-fit h-fit text-xs">
                                #
                              </div>
                            </div>
                            <input
                              className="relative bg-offBlack flex flex-row text-xs w-full h-full justify-start items-center rounded-sm p-2 gap-2"
                              onChange={(e) => item.setValue(e.target.value)}
                              value={item.chosenValue || ""}
                            />
                          </div>
                        </div>
                      ))
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCollect;
