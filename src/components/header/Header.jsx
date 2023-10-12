import React from "react";

export const Header = ({ children }) => {
  return (
    <div className="border-0 border-b p-4 font-semibold bg-white">
      {children}
    </div>
  );
};
