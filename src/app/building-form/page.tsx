import React from "react";
import { BuildingForm } from "@/components/BuildingForm";

type Props = {};

const page = (props: Props) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <BuildingForm />
    </main>
  );
};

export default page;
