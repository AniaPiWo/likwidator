import React from "react";
import { CapturePic } from "@/components/CapturePic";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <CapturePic />;
    </div>
  );
};

export default page;
