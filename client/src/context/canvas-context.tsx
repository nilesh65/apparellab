import { ProductColorType } from "@/types/product";
import { Canvas } from "fabric"
import React, { createContext, useContext, useState } from "react";

interface ListingDataType {
  selectedColors: ProductColorType[];
  title: string;
  description: string;
  sellingPrice: number;
  artworkUrl: string;
  artworkPlacement: {
    top: number;
    left: number;
    width: number;
    height: number;
    refDisplayWidth: number
  };
}

export type ListingDataKey = keyof ListingDataType;

interface CanvasContextType {
  canvasEditor: Canvas | null;
  setCanvasEditor: (canvas: Canvas | null) => void;
  listingData: ListingDataType;
  setListingData: (listingData: ListingDataType) => void;
  updatedListingState: (key: ListingDataKey, value: any) => void;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export function CanvasProvider({
  children,
  basePrice
}: {
  children: React.ReactNode;
  basePrice?: number
}) {

  const [canvasEditor, setCanvasEditor] = useState<Canvas | null>(null);
  const [listingData, setListingData] = useState<ListingDataType>({
    selectedColors: [],
    title: "",
    description: "",
    sellingPrice: basePrice || 0,
    artworkUrl: "",
    artworkPlacement: {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      refDisplayWidth: 662,
    },
  });

  const updatedListingState = (key: ListingDataKey, value: any) => {
    setListingData((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasEditor,
        setCanvasEditor,
        listingData,
        setListingData,
        updatedListingState,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )

}


export function useCanvas() {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside <CanvasProvider>");
  return ctx;
}
