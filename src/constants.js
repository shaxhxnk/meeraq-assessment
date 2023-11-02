const PMO_ASSESSMENT_ARR = [
  "/assessments",
  "/view-assessment",
  "/create-assessment",
  "/edit-assessment",
  "/competencies",
  "/questions",
  "/questionnaire",
  "/notifications",
];

const PARTICIPANT_ASSESSMENT_ARR = [
  "/participant/assessments",
  "/participant/results",
  "/notifications",
];

export const USER_BASED_ROUTES = {
  pmo: [...PMO_ASSESSMENT_ARR, { path: "/assessments" }],
  learner: [...PARTICIPANT_ASSESSMENT_ARR,{ path: "/participant/assessments" }],
};
