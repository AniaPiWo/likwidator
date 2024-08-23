"use client";
import React from "react";
import useSWR from "swr";
import { getImagesFromDatabase } from "@/actions/image";

type Props = {};

export const ImagesGallery = (props: Props) => {
  const { data: images, error } = useSWR("images", getImagesFromDatabase);

  if (error) return <div>Failed to load images</div>;
  if (!images) return <div>Loading...</div>;

  return (
    <div>
      <h2>Images Gallery</h2>
      <div className="grid grid-cols-3 gap-4">
        {(images as { id: string; base64: string }[]).map(
          (image: { id: string; base64: string }) => (
            <div key={image.id} className="border p-2">
              <img
                src={image.base64}
                alt={`Image ${image.id}`}
                className="w-full h-auto"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};
