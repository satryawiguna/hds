"use client";

import { Toaster as Sonner } from "sonner";

export const Toaster = () => {
  return (
    <Sonner
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
        },
      }}
    />
  );
};
