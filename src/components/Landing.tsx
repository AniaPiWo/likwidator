import React from "react";
import { SignInButton } from "@clerk/nextjs";

type Props = {};

export const Landing = (props: Props) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 md:p-8 lg:p-16">
      <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl mb-4">
        Welcome to Likwidator
      </h1>

      <p className="text-base sm:text-sm md:text-md lg:text-lg w-1/3 text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vel
        lacus quis justo consectetur fermentum. Phasellus hendrerit lacus id
        vestibulum sollicitudin. Ut ut eros sit amet felis auctor aliquam ut non
        metus.
      </p>
      <SignInButton>
        <button className="btn btn-primary w-full sm:w-auto">Log In</button>
      </SignInButton>
    </div>
  );
};
