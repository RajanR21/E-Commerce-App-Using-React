import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export function DefaultPagination({ active, setActive }) {
  console.log("inside pagination ", active);
  const getItemProps = (index) => ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => setActive(index),
  });

  const next = () => {
    if (active === 5) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };

  return (
    <div className="flex items-center gap-6 mt-5">
      <Button
        variant="text"
        className="flex items-center gap-6"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-5 w-5" /> Previous
      </Button>
      <div className="flex items-center gap-6">
        <IconButton {...getItemProps(1)}>1</IconButton>
        <IconButton {...getItemProps(2)}>2</IconButton>
        <IconButton {...getItemProps(3)}>3</IconButton>
      </div>
      <Button
        variant="text"
        className="flex items-center gap-6"
        onClick={next}
        disabled={active === 2}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-2 w-2" />
      </Button>
    </div>
  );
}
