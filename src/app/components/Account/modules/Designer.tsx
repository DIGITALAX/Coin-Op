"use client";

import { useAccount } from "wagmi";
import useDesigner from "../hooks/useDesigner";
import { DesignerFormData, DesignerProps } from "../types/account.types";
import Image from "next/image";
import { AiOutlineLoading } from "react-icons/ai";

export default function Designer({ dict }: DesignerProps) {
  const { isConnected } = useAccount();
  const {
    designer,
    designerLoading,
    createDesignerLoading,
    handleCreateDesigner,
    formData,
    setFormData,
  } = useDesigner();

  const handleInputChange = (field: keyof DesignerFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async () => {
    const isEdit = !!designer?.designerId;
    await handleCreateDesigner(isEdit);
  };

  if (!isConnected) {
    return null;
  }

  if (designerLoading) {
    return (
      <div className="relative w-full h-fit flex flex-col gap-4">
        <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center text-white">
          {dict?.Account?.designer}
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="relative h-12 border border-white w-full"
            id="staticLoad"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full h-fit flex flex-col gap-4 text-white">
      <div className="font-monu text-2xl text-left w-fit h-fit flex justify-start items-center">
        {dict?.Account?.designer}
      </div>

      <div
        className={`relative w-full border border-white bg-smo/10 p-2 h-fit`}
      >
        <div className="relative w-full h-fit flex flex-col gap-3">
          <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
            <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
              {dict?.Account?.designerTitle}
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="relative bg-black border border-white w-full h-6 p-1 font-sat"
              placeholder={dict?.Account?.designerTitlePlaceholder}
            />
          </div>

          <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
            <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
              {dict?.Account?.designerDescription}
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="relative bg-black border border-white w-full h-16 p-1 font-sat resize-none"
              placeholder={dict?.Account?.designerDescriptionPlaceholder}
            />
          </div>

          <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
            <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
              {dict?.Account?.designerLink}
            </div>
            <input
              type="url"
              value={formData.link}
              onChange={(e) => handleInputChange("link", e.target.value)}
              className="relative bg-black border border-white w-full h-6 p-1 font-sat"
              placeholder={dict?.Account?.designerLinkPlaceholder}
            />
          </div>

          <div className="relative w-full h-fit items-start justify-center flex flex-col gap-2">
            <div className="relative w-fit h-fit flex items-center justify-center font-satB break-all">
              {dict?.Account?.designerImage}
            </div>
            <div className="relative w-full h-fit flex gap-2 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="relative bg-black border border-white w-full h-6 p-1 font-sat text-xs"
              />
              {(formData.image || designer?.metadata?.image) && (
                <div className="relative w-10 h-10 border border-white">
                  <Image
                    draggable={false}
                    src={
                      formData.image instanceof File
                        ? URL.createObjectURL(formData.image)
                        : typeof formData.image === "string"
                        ? formData.image.includes("ipfs://")
                          ? `https://gateway.pinata.cloud/ipfs/${
                              formData.image.split("ipfs://")[1]
                            }`
                          : formData.image
                        : designer?.metadata?.image?.includes("ipfs://")
                        ? `https://gateway.pinata.cloud/ipfs/${
                            designer.metadata.image.split("ipfs://")[1]
                          }`
                        : designer?.metadata?.image || ""
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            onClick={
              formData.title.trim() &&
              formData.description.trim() &&
              !createDesignerLoading
                ? handleSubmit
                : undefined
            }
            className={`relative min-w-fit w-40 h-8 justify-center flex items-center flex-col text-base text-black font-monu border border-black bg-sol ${
              !createDesignerLoading &&
              formData.title.trim() &&
              formData.description.trim() &&
              "cursor-pointer hover:opacity-70"
            } ${
              (!formData.title.trim() ||
                !formData.description.trim() ||
                createDesignerLoading) &&
              "opacity-50"
            }`}
          >
            <div
              className={`relative flex w-fit h-fit items-center justify-center text-center text-xxs px-2 py-1 ${
                createDesignerLoading && "animate-spin"
              }`}
            >
              {createDesignerLoading ? (
                <AiOutlineLoading size={12} color="black" />
              ) : designer?.designerId ? (
                dict?.Account?.updateDesigner
              ) : (
                dict?.Account?.createDesigner
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
