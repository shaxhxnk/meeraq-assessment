import React from "react";

export const ObserverAssessmentSubmissionPage = () => {
  return (
    <div>
      <div className="flex p-6 justify-center items-center gap-10 self-stretch rounded-t-lg border-t border-r border-l border-stroke-2 bg-primary-4">
        <p className="text-text-1 font-inter font-semibold text-24 leading-36">
          Performance Evaluation Assessment
        </p>
      </div>
      <div className="flex p-6 justify-center items-center gap-10 self-stretch">
        <div className="text-regular border rounded p-2">
          Your assessment has been successfully submitted.
        </div>
      </div>
    </div>
  );
};
