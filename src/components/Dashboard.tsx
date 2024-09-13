import React from "react";
import { ImagesGallery } from "./ImagesGallery";
import Link from "next/link";
import { BuildingForm } from "./BuildingForm";

type Props = {};

export const Dashboard = (props: Props) => {
  return (
    <div>
      <BuildingForm />
      {/*   <p>Dashboard</p>
      <Link href="/new-form">
        <button className="btn btn-secondary">new form</button>
      </Link> */}
    </div>
  );
};
