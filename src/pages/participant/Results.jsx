import { useEffect, useState } from "react";
import { Header } from "../../components/header/Header";
import { useGetApi } from "../../hooks/useGetApi";
import { SearchOutlined } from "@mui/icons-material";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Input, Radio, Space, Spin } from "antd";
import { useSelector } from "react-redux";
import { CheckOutlined } from "@ant-design/icons";

const categories = {
  responses: "Responses",
  results: "Results",
};

export const Results = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [assessmentValue, setAssessmentValue] = useState(null);
  const [currentAssessmentData, setCurrentAssessmentData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("responses");
  const { user } = useSelector((state) => state.auth);

  const {
    data: getAssessmentData,
    isLoading: getAssessmentLoading,
    error: getAssessmentError,
    getData: getAssessment,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/assessments-of-participant/${user?.email}`
  );

  const {
    data: getResultResponseData,
    isLoading: getResultResponseLoading,
    error: getResultResponseError,
    getData: getResultResponse,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-response-result/${user?.email}`
  );

  const calculateResponseOfQuestion = (questionId) => {
    if (getResultResponseData) {
      const assessmentResponse = getResultResponseData?.find(
        (response) => response.assessment.id === currentAssessmentData.id
      );

      return assessmentResponse.participant_response[questionId];
    }
    return 0;
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = getAssessmentData?.filter((assessment) =>
        assessment?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };
 
  const handleOnChangeAssessmentRadio = (e) => {
    setAssessmentValue(e.target.value);
    const selectedAssessment = getAssessmentData.find(
      (assessment) => assessment.id === e.target.value
    );
    setCurrentAssessmentData(selectedAssessment);
  };

  useEffect(() => {
    if (getAssessmentData && getAssessmentData.length > 0) {
      setAssessmentValue(getAssessmentData[0].id);
      setCurrentAssessmentData(getAssessmentData[0]);
    }
  }, [getAssessmentData]);

  if (getAssessmentLoading) {
    return <Spin />;
  } else {
    return (
      <>
        <Header>Results</Header>
        <div className="m-4">
          <div className="flex m-4 border border-gray-300 rounded-t-lg">
            <div className="w-1/4 border-r border-gray-300 ">
              <div className="p-4 w-full bg-bg-1 border-b border-gray-300 rounded-tl-lg">
                <p className="text-xl font-semibold">Assessments</p>
              </div>
              <div className="p-4 border-b border-gray-300">
                <Input
                  placeholder="Assessment Name Search..."
                  value={searchText}
                  onChange={(event) => handleSearch(event.target.value)}
                  prefix={<SearchOutlined style={{ color: "gray" }} />}
                  suffix={
                    searchText && (
                      <CloseCircleOutlined
                        style={{ color: "gray", cursor: "pointer" }}
                        onClick={clearSearch}
                      />
                    )
                  }
                  className="max-w-[250px] lg:ml-3"
                />
              </div>
              <div
                className="overflow-y-auto custom-scrollbar p-6"
                style={{ height: "calc(100vh - 210px)" }}
              >
                <Radio.Group
                  onChange={handleOnChangeAssessmentRadio}
                  value={assessmentValue}
                >
                  <Space direction="vertical">
                    {(searchedData ? searchedData : getAssessmentData)?.map(
                      (assessment, index) => (
                        <Radio
                          key={assessment.id}
                          value={assessment.id}
                          className={index > 0 ? "mt-4" : ""}
                        >
                          {assessment.name}
                        </Radio>
                      )
                    )}
                  </Space>
                </Radio.Group>
              </div>
            </div>
            <div className="w-3/4">
              <div className="p-4 w-full bg-bg-1 border-b  border-gray-300 rounded-tr-lg">
                <p className="text-xl font-semibold pl-4">
                  {currentAssessmentData?.name}
                </p>
              </div>
              <div className="m-4 lg:h-[550px] overflow-y-auto custom-scrollbar">
                <div className="flex space-x-2 ">
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
                {selectedCategory === "responses" && (
                  <div className="m-4">
                    {currentAssessmentData && (
                      <div>
                        {Object.values(
                          currentAssessmentData.questionnaire.questions.reduce(
                            (competencies, question) => {
                              if (!competencies[question.competency.name]) {
                                competencies[question.competency.name] = [];
                              }
                              competencies[question.competency.name].push(
                                question
                              );
                              return competencies;
                            },
                            {}
                          )
                        ).map((questions, index) => (
                          <div key={index} className={`border-t border-l border-r border-gray ${index===0? "rounded-t-lg":""}`}>
                            <div className={`p-4 border-b border-gray bg-gray-100 ${index===0? "rounded-t-lg":""}`}>
                              <p className=" text-text-2 text-base font-semibold leading-6">
                                {questions[0].competency.name}
                              </p>
                            </div>

                            {questions.map((question, index) => (
                              <div key={question.id} className="">
                                <div className="border-b border-gray p-4">
                                  {" "}
                                  <p className="text-text-1 text-regular  text-base ml-2 font-normal leading-6 tracking-[0.035em]">
                                    {`${index + 1}. `}
                                    {question.self_question}
                                  </p>
                                  <div className="flex items-center justify-start ml-2.5 mt-4 mb-2 text-center  gap-6">
                                    {currentAssessmentData?.rating_type ===
                                    "1-10"
                                      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map(
                                          (number, index) => (
                                            <div
                                              key={index}
                                              className={`border rounded-full w-12 h-12 flex items-center justify-center  ${
                                                index < 3
                                                  ? "border-red-700"
                                                  : index < 7
                                                  ? "border-amber-500"
                                                  : "border-success"
                                              } ${
                                                calculateResponseOfQuestion(
                                                  question.id
                                                ) === number && number <= 3
                                                  ? "bg-red-600 text-white"
                                                  : calculateResponseOfQuestion(
                                                      question.id
                                                    ) === number && number <= 7
                                                  ? "bg-rating-1 text-white"
                                                  : calculateResponseOfQuestion(
                                                      question.id
                                                    ) === number && number <= 10
                                                  ? "bg-success text-white"
                                                  : ""
                                              }`}
                                            >
                                              {number}
                                            </div>
                                          )
                                        )
                                      : currentAssessmentData?.rating_type ===
                                        "1-5"
                                      ? [1, 2, 3, 4, 5]?.map(
                                          (number, index) => (
                                            <div
                                              key={index}
                                              className={`border rounded-full w-12 h-12 flex items-center justify-center  cursor-pointer ${
                                                index < 2
                                                  ? "border-red-700 "
                                                  : index < 3
                                                  ? "border-amber-500 "
                                                  : "border-success "
                                              } ${
                                                calculateResponseOfQuestion(
                                                  question.id
                                                ) === number && number <= 2
                                                  ? "bg-red-600 text-white"
                                                  : calculateResponseOfQuestion(
                                                      question.id
                                                    ) === number && number <= 3
                                                  ? "bg-rating-1 text-white"
                                                  : calculateResponseOfQuestion(
                                                      question.id
                                                    ) === number && number <= 5
                                                  ? "bg-success text-white"
                                                  : ""
                                              }`}
                                            >
                                              {number}
                                            </div>
                                          )
                                        )
                                      : null}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-between mb-2 mr-4 ml-4"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
};
