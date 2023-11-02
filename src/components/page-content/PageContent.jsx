import React from "react";

export const PageContent = ({ children }) => {
  return (
    <div className="p-2">
      <div className="bg-white p-2">{children}</div>
    </div>
  );
};
