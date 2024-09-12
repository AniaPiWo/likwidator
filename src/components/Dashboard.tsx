import React from "react";
import { ImagesGallery } from "./ImagesGallery";
import Link from "next/link";

type Props = {};

export const Dashboard = (props: Props) => {
  return (
    <div>
      <p>Dashboard</p>
      <Link href="/new-form">
        <button className="btn btn-secondary">new form</button>
      </Link>
    </div>
  );
};
