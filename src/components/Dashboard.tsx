import React from "react";
import Link from "next/link";

type Props = {};

export const Dashboard = (props: Props) => {
  return (
    <div className="flex flex-col gap-16 p-4 m-4">
      Dashboard
      <Link href="/new-case">
        <button className="btn btn-primary">Nowa szkoda</button>
      </Link>
    </div>
  );
};
