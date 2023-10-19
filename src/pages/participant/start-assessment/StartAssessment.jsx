import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../../../components/header/Header";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Badge, Button, Modal, Progress, Spin } from "antd";
import MeeraqLogo from "../../../assets/meeraq_logo_color.png";
import { useGetApi } from "../../../hooks/useGetApi";
import { usePostApi } from "../../../hooks/usePostApi";
import { useSelector } from "react-redux";

export const StartAssessment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(
    location?.state?.currentAssessmentData
      ? location?.state?.currentAssessmentData
      : null
  );

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [currentCompetency, setCurrentCompetency] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState(null);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    data: getQuestionsData,
    isLoading: getQuestionsLoading,
    error: getQuestionsError,
    getData: getQuestions,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/questions-for-assessment/${assessmentData?.id}`
  );

  const {
    data: createResponseData,
    isLoading: createResponseLoading,
    postData: createResponse,
    resetState: resetCreateResponseState,
  } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/create-response/`
  );

  useEffect(() => {
    if (getQuestionsData) {
      const competencies = Object.keys(getQuestionsData);
      setCurrentCompetency(competencies[0]);
      const total = competencies.reduce((total, competency) => {
        return total + getQuestionsData[competency]?.length;
      }, 0);
      setTotalQuestions(total);
    }
  }, [getQuestionsData]);

  const handleResponse = (response) => {
    const currentQuestionId =
      getQuestionsData[currentCompetency][activeQuestion]?.id;

    setAnsweredQuestions((prevResponses) => ({
      ...prevResponses,
      [currentQuestionId]: response,
    }));

    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    if (getQuestionsData) {
      const competencies = Object.keys(getQuestionsData);
      const competencyQuestions = getQuestionsData[currentCompetency];
      if (activeQuestion < competencyQuestions?.length - 1) {
        setActiveQuestion(activeQuestion + 1);
      } else {
        const currentCompetencyIndex = competencies.indexOf(currentCompetency);
        if (currentCompetencyIndex < competencies?.length - 1) {
          setCurrentCompetency(competencies[currentCompetencyIndex + 1]);
          setActiveQuestion(0);
        } else {
          const element = document.getElementById("container");
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          setSubmitModalVisible(true);
        }
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (getQuestionsData) {
      const competencies = Object.keys(getQuestionsData);
      const competencyQuestions = getQuestionsData[currentCompetency];
      if (activeQuestion > 0) {
        setActiveQuestion(activeQuestion - 1);
      } else {
        const currentCompetencyIndex = competencies.indexOf(currentCompetency);
        if (currentCompetencyIndex > 0) {
          setCurrentCompetency(competencies[currentCompetencyIndex - 1]);
          setActiveQuestion(
            getQuestionsData[competencies[currentCompetencyIndex - 1]]?.length -
              1
          );
        } else {
          // Not doing anytihing because reached first competency first question
        }
      }
    }
  };

  const handleExitAssessmentConfirm = () => {
    navigate("/participant/assessments");
    setExitModalVisible(false);
  };

  const isLastCompetencyLastQuestion = () => {
    if (getQuestionsData) {
      const allCompetenciesList = Object.keys(getQuestionsData);
      const isLastCompetency =
        currentCompetency ===
        allCompetenciesList[allCompetenciesList?.length - 1];

      if (isLastCompetency) {
        const currentQuestions = getQuestionsData[currentCompetency];
        const isLastQuestion =
          currentQuestions && activeQuestion === currentQuestions?.length - 1;

        return isLastQuestion;
      } else {
        return false;
      }
    }
  };

  const handleSubmitConfirm = () => {
    createResponse({
      assessment_id: assessmentData?.id,
      participant_email: user?.email,
      response: answeredQuestions,
    });
  };

  useEffect(() => {
    if (getQuestionsData && currentCompetency && answeredQuestions) {
      const presentActiveQuestion =
        getQuestionsData[currentCompetency][activeQuestion]?.id;

      if (presentActiveQuestion && answeredQuestions[presentActiveQuestion]) {
        setCurrentAnswer(answeredQuestions[presentActiveQuestion]);
      } else {
        setCurrentAnswer(0);
      }
    }
  }, [activeQuestion, currentCompetency, answeredQuestions]);

  useEffect(() => {
    const element = document.getElementById("container");
    element.requestFullscreen();
  }, []);

  useEffect(() => {
    if (createResponseData) {
      navigate("/participant/assessments");
      setSubmitModalVisible(false);
    }
  }, [createResponseData]);

  if (getQuestionsLoading) {
    return (
      <div>
        {" "}
        <Spin />
      </div>
    );
  } else {
    return (
      <div id="container" className="bg-white">
        <Header>
          <div className="flex justify-between">
            <div className="flex items-center">
              <ArrowLeftOutlined
                className="mr-4 cursor-pointer"
                onClick={() => setExitModalVisible(true)}
              />
              <div className="text-xl">{assessmentData?.name}</div>
            </div>

            <div className="w-[12rem]">
              <img
                className="w-[100%] h-auto"
                src={MeeraqLogo}
                alt="Meeraq logo"
              />
            </div>
          </div>
        </Header>
        <div className="px-2">
          <div className="flex flex-row justify-start items-start overflow-x-auto custom-scrollbar ">
            {getQuestionsData &&
              Object.keys(getQuestionsData)?.map((competencyName, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 pr-8 pl-4 cursor-pointer ${
                    currentCompetency === competencyName
                      ? "bg-primary-4 border-b-2 border-primary-1"
                      : "bg-white border-b-2"
                  }`}
                  onClick={() => {
                    setCurrentCompetency(competencyName);
                    setActiveQuestion(0);
                  }}
                >
                  <Badge
                    style={{
                      color: `${
                        currentCompetency === competencyName
                          ? "#7E39A4"
                          : "black"
                      }`,
                      borderColor: `${
                        currentCompetency === competencyName
                          ? "#F9F0FF"
                          : "#f4f4f4"
                      }`,
                    }}
                    color={`${
                      currentCompetency === competencyName
                        ? "#f3dfff"
                        : "#f4f4f4"
                    }`}
                    count={index + 1}
                    className="mr-3"
                  ></Badge>
                  <div>
                    <div
                      className={`text-xs font-Inter ${
                        currentCompetency === competencyName
                          ? "text-primary-1"
                          : "text-text-4"
                      }`}
                    >
                      Competency {index + 1}
                    </div>
                    <div
                      className={`text-sm font-Inter${
                        currentCompetency === competencyName
                          ? "text-primary-2"
                          : ""
                      }`}
                    >
                      {competencyName}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex justify-center items-center mt-28 ">
            <div className="border rounded-md border-gray inline-block lg:!w-[800px]">
              <div className="flex items-center p-4 pl-8 border-b border-gray">
                <div className=" !w-[600px]">
                  <Progress
                    percent={
                      (Object.keys(answeredQuestions)?.length /
                        totalQuestions) *
                      100
                    }
                    size="large"
                    strokeColor={{ from: "#CC3A92", to: "#7E39A4" }}
                    showInfo={false}
                  />
                </div>
                <span className="ml-4">
                  {`${
                    Object.keys(answeredQuestions)?.length
                  }/${totalQuestions} Questions`}
                </span>
              </div>
              <div
                className={`text-center whitespace-normal p-10 `}
                style={{ userSelect: "none" }}
              >
                <p className="text-text-3 text-xl font-medium leading-6">
                  {getQuestionsData &&
                    getQuestionsData[currentCompetency] &&
                    getQuestionsData[currentCompetency][activeQuestion] &&
                    getQuestionsData[currentCompetency][activeQuestion]
                      ?.self_question}
                </p>
              </div>
              <div className="flex items-center justify-center px-14 mt-2 text-center !mb-[30px] gap-6">
                {assessmentData?.rating_type === "1-10"
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((number, index) => (
                      <div
                        key={index}
                        className={`border rounded-full w-12 h-12 flex items-center justify-center cursor-pointer ${
                          index < 3
                            ? "border-red-700 hover:bg-red-100"
                            : index < 7
                            ? "border-amber-500 hover:bg-amber-100"
                            : "border-success hover:bg-green-100"
                        } ${
                          currentAnswer === number && number <= 3
                            ? "bg-red-100"
                            : currentAnswer === number && number <= 7
                            ? "bg-amber-100"
                            : currentAnswer === number && number <= 10
                            ? "bg-green-100"
                            : ""
                        }`}
                        onClick={() => handleResponse(number)}
                      >
                        {number}
                      </div>
                    ))
                  : assessmentData?.rating_type === "1-5"
                  ? [1, 2, 3, 4, 5]?.map((number, index) => (
                      <div
                        key={index}
                        className={`border rounded-full w-12 h-12 flex items-center justify-center  cursor-pointer ${
                          index < 2
                            ? "border-red-700 hover:bg-red-100"
                            : index < 3
                            ? "border-amber-500 hover:bg-amber-100"
                            : "border-success hover:bg-green-100"
                        } ${
                          currentAnswer === number && number <= 2
                            ? "bg-red-100"
                            : currentAnswer === number && number <= 3
                            ? "bg-amber-100"
                            : currentAnswer === number && number <= 5
                            ? "bg-green-100"
                            : ""
                        }`}
                        onClick={() => handleResponse(number)}
                      >
                        {number}
                      </div>
                    ))
                  : null}
              </div>
              <div className="border-t border-gray flex justify-between p-4">
                <Button onClick={handlePreviousQuestion}>
                  <ArrowLeftOutlined /> Previous
                </Button>
                <Button type="primary" onClick={handleNextQuestion}>
                  {isLastCompetencyLastQuestion() ? (
                    <div className="flex items-center">
                      {" "}
                      <CheckOutlined className="mr-2" />
                      Submit
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Next <ArrowRightOutlined className="ml-2" />
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <Modal
            title="Confirm Exit Assessment"
            open={exitModalVisible}
            onOk={handleExitAssessmentConfirm}
            onCancel={() => setExitModalVisible(false)}
            okText="Yes"
          >
            Are you sure you want to exit the assessment?{" "}
            <strong>All your responses to the questions will be lost.</strong>
          </Modal>
          <Modal
            title="Submit Confirmation"
            open={submitModalVisible}
            onOk={handleSubmitConfirm}
            onCancel={() => setSubmitModalVisible(false)}
            okText="Submit"
            confirmLoading={createResponseLoading}
          >
            Are you sure you want to submit the assessment?
            <strong>
              {" "}
              Once submitted, you won't be able to edit the responses.
            </strong>
          </Modal>
        </div>
      </div>
    );
  }
};
