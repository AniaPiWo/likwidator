import React from "react";
import Link from "next/link";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center  mt-16">
      <h1 className="text-3xl font-bold">Nowa szkoda</h1>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex  gap-4">
          Dodaj formularz szkody
          <Link href="/building-form">
            <button className="btn btn-primary">Dom</button>
          </Link>
          <button className="btn btn-primary">Pomieszczenie</button>
        </div>
        <div className="flex  gap-5">
          Dodaj notatke głosową
          <Link href="/voice-note">
            <button className="btn btn-primary">Podyktuj notatkę</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
