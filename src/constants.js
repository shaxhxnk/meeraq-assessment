const PMO_ASSESSMENT_ARR = [
  "/assessments",
  "/competencies",
  "/questions",
  "/questionnaire",
  "/notifications",
];

const PARTICIPANT_ASSESSMENT_ARR = [];

export const USER_BASED_ROUTES = {
  pmo: [...PMO_ASSESSMENT_ARR, { path: "/assessments" }],
  learner: [...PARTICIPANT_ASSESSMENT_ARR],
};
