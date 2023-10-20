import React, { useEffect } from "react";
import { Layout } from "antd";
import { Route, Routes } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getSession } from "./redux/services/authService";
import { PmoAssessmentNavigation } from "./components/navigation/PmoAssessmentNavigation";
import { ParticipantAssessmentNavigation } from "./components/navigation/ParticipantAssessmentNavigation";
import { Navigation } from "./components/navigation/Navigation";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Navbar } from "./components/navbar/Navbar";
import { AuthenticatedRoutes } from "./components/authenticated-routes/AuthenticatedRoutes";
import { Login } from "./pages/login/Login";
import { ForgotPassword } from "./pages/forgot-password/ForgotPassword";
import { ResetPassword } from "./pages/reset-password/ResetPassword";
import { PageNotFound } from "./pages/page-not-found/PageNotFound";
import { Assessments } from "./pages/assessments/Assessments";
import { NotificationPage } from "./pages/notification/NotificationPage";
import { Competencies } from "./pages/competencies/Competencies";
import { Questions } from "./pages/questions/Questions";
import { Questionnaire } from "./pages/questionnaire/Questionnaire";
import { ViewAssessment } from "./pages/assessments/ViewAssessment";
import { CreateAssessment } from "./pages/assessments/CreateAssessment";
import { SharedAssessments } from "./pages/participant/SharedAssessments";
import { Results } from "./pages/participant/Results";
import { StartAssessment } from "./pages/participant/start-assessment/StartAssessment";
import { ObserverLogin } from "./pages/observer/ObserverLogin";
import { ObserversAssessment } from "./pages/observer/ObserversAssessment";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const { pathname } = useLocation();

  let custom_menu;
  if (isAuthenticated) {
    if (user.user.type === "pmo") {
      custom_menu = <PmoAssessmentNavigation />;
    } else if (user.user.type === "learner") {
      custom_menu = <ParticipantAssessmentNavigation />;
    } else {
      custom_menu = <Navigation />;
    }
  }

  useEffect(() => {
    dispatch(getSession());
  }, [dispatch]);

  const PMO_ASSESSMENT_ROUTES = (
    <>
      <Route path="/assessments" element={<Assessments />} />
      <Route path="/view-assessment" element={<ViewAssessment />} />
      <Route path="/create-assessment" element={<CreateAssessment />} />
      <Route path="/edit-assessment" element={<CreateAssessment />} />
      <Route path="/competencies" element={<Competencies />} />
      <Route path="/questions" element={<Questions />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
    </>
  );

  const PARTICIPANT_ASSESSMENT_ROUTES = (
    <>
      <Route path="/participant/assessments" element={<SharedAssessments />} />
      <Route path="/participant/results" element={<Results />} />
    </>
  );


  return (
    <div className="App">
      <Layout>
        {isAuthenticated && pathname !=="/meeraq/assessment" && <Sidebar menu={custom_menu} />}
        <Layout.Content className="content">
          {pathname !== "/" && <Navbar menu={custom_menu} />}
          <div
            className="relative"
            style={
              isAuthenticated && !pathname.startsWith("/e/call")
                ? {}
                : {
                    height: "100vh",
                    overflowY: "auto",
                  }
            }
          >
            {process.env.REACT_APP_ENVIRONMENT === "qa" && (
              <span className="bg-red-500 text-white p-2 rounded absolute w-[4rem] flex left-[50%] right-[50%]">
                Testing{" "}
              </span>
            )}
            <Routes>
              <Route index element={<Login />} />{" "}
              <Route path={`/forgot-password`} element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route
                path="/observer-detail"
                element={<ObserverLogin />}
              />
              <Route
                path="/observer-assessment"
                element={<ObserversAssessment />}
              />
              <Route
                path="/meeraq/assessment"
                element={<StartAssessment />}
              />
              <Route element={<AuthenticatedRoutes />}>
                <Route path="/notifications" element={<NotificationPage />} />

                {PMO_ASSESSMENT_ROUTES}
                {PARTICIPANT_ASSESSMENT_ROUTES}
              </Route>
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </div>
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default App;
