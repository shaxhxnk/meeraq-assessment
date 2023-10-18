import { useEffect, useMemo, useState } from "react";
import React from "react";
import { Header } from "../../components/header/Header";
import {
  Button,
  Input,
  Table,
  Menu,
  Dropdown,
  Modal,
  Form,
  Spin,
  Radio,
  DatePicker,
} from "antd";
import { AddRounded, SearchOutlined } from "@mui/icons-material";
import { useGetApi } from "../../hooks/useGetApi";
import { usePostApi } from "../../hooks/usePostApi";
import { usePutApi } from "../../hooks/usePutApi";
import { useDeleteApi } from "../../hooks/useDeleteApi";
import { CloseCircleOutlined } from "@ant-design/icons";
import { MoreOutlined } from "@ant-design/icons";
import { formatTimestamp } from "../../utils/convertSlotToString";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const categories = {
  questionnaire: "Questionnaire",
  responses: "Responses",
  results: "Results",
};

export const ViewAssessment = () => {
  const location = useLocation();
  const [assessmentData, setAssessmentData] = useState(
    location?.state?.assessment
  );
  console.log(assessmentData);
  const [selectedCategory, setSelectedCategory] = useState("questionnaire");
  const navigate = useNavigate();

  const questionnaireTab = (
    <div className="m-4 mt-8">
      <p className="text-lg font-Inter font-semibold">
        {assessmentData?.questionnaire?.name}
      </p>
      <div className="p-4 mt-4 border-l border-r border-t h-full">
        {assessmentData?.questionnaire?.questions?.map((question, index) => (
          <div className="mr-4">
            <div key={index} className="p-2 w-full bg-bg-1  rounded-t-lg">
              <p className="text-l font-semibold">
                {question?.competency?.name}
              </p>
            </div>
            <div className="p-4">
              <p className="m-2">
                <strong>Self Question:</strong> {question?.self_question}
              </p>

              {assessmentData?.assessment_type === "360" && (
                <>
                  <hr />
                  <p className="m-2">
                    <strong>Observer Question:</strong>{" "}
                    {question?.observer_question}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {assessmentData?.descriptive_questions?.length > 0 && (
        <div className="mt-8 ">
          <p className="text-lg font-Inter font-semibold">
            Descriptive Questions
          </p>
          <div className="m-8 mt-4">
            <ul className=" list-decimal ">
              {assessmentData?.descriptive_questions?.map((question, index) => (
                <li className="mb-1" key={index}> {question.trim()}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  const responsesTab = (
    <div className="m-4 mt-8">
      <p>No Data To Show</p>
    </div>
  );
  const resultsTab = (
    <div className="m-4 mt-8">
      <p>No Data To Show</p>
    </div>
  );

  useEffect(() => {
    if (!assessmentData) {
      navigate("/assessments");
    }
  }, []);

  return (
    <>
      <Header>
        <div className="flex justify-between">
          <div className="flex items-center">
            <ArrowLeftOutlined
              className="mr-4 cursor-pointer"
              onClick={() => navigate("/assessments")}
            />
            <div className="text-lg">{assessmentData?.name}</div>
            <div
              className={`capitalize ml-4 px-3 rounded-lg ${
                assessmentData?.status === "ongoing"
                  ? "bg-success-bg text-success "
                  : assessmentData?.status === "draft"
                  ? "bg-gray-200 text-gray-600"
                  : assessmentData?.status === "completed"
                  ? "bg-text-5 text-text-4"
                  : ""
              }`}
            >
              {assessmentData?.status}
            </div>
            <div
              className={`capitalize ml-4 px-3 rounded-lg bg-primary-4 text-primary-1 py-0.5 flex items-center`}
            >
              <div className="w-2 h-2 bg-primary-1 rounded-full mr-2"></div>
              {assessmentData?.assessment_type} Assessment
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-base font-normal">Assessment End Date</div>
            <DatePicker
              format={"DD-MM-YYYY"}
              disabled
              defaultValue={dayjs(assessmentData?.assessment_end_date)}
            />
            <Button
              className=" mr-2"
              //   onClick={() => handleEditFromView(currentQuestionnaireData)}
            >
              <AddRounded /> Add Participants
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <div className="justify-start items-start flex">
          {Object.keys(categories).map((category, index) => {
            return (
              <div
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`flex p-2 ml-2 justify-center items-center space-x-4 rounded-lg border cursor-pointer shadow-md !w-[138px] ${
                  selectedCategory === category
                    ? "border-primary-1 bg-primary-4"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedCategory === category && (
                  <CheckOutlined className="mr-2" />
                )}
                {`${categories[category]}`}
              </div>
            );
          })}
        </div>

        {selectedCategory === "questionnaire" ? (
          <>{questionnaireTab}</>
        ) : selectedCategory === "responses" ? (
          <>{responsesTab}</>
        ) : selectedCategory === "results" ? (
          <> {resultsTab}</>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
