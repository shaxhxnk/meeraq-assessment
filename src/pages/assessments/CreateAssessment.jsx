import { useEffect, useMemo, useState } from "react";
import { Header } from "../../components/header/Header";
import { CloseOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  notification,
  Radio,
  Space,
  Tooltip,
} from "antd";
import moment from "moment";
import { AddRounded, SearchOutlined } from "@mui/icons-material";
import {
  CloseCircleOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useGetApi } from "../../hooks/useGetApi";
import { usePostApi } from "../../hooks/usePostApi";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { usePutApi } from "../../hooks/usePutApi";

function disabledDate(current) {
  return current && current < moment().endOf("day");
}
export const CreateAssessment = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [assessmentDetailsForm] = Form.useForm();

  const [assessmentTypeValue, setAssessmentTypeValue] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [questionnaireValue, setQuestionnaireValue] = useState(null);
  const [currentQuestionnaireData, setCurrentQuestionnaireData] =
    useState(null);
  const [questionCount, setQuestionCount] = useState(1);
  const [questions, setQuestions] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const isEditMode = location.pathname === "/edit-assessment";

  const [assessmentData, setAssessmentData] = useState(
    location?.state?.assessment ? location?.state?.assessment : null
  );
  const [editAssessmentDataValue, setEditAssessmentDataValue] = useState(null);

  const {
    data: createAssessmentData,
    isLoading: createAssessmentLoading,
    postData: createAssessment,
    resetState: resetCreateAssessmentState,
  } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/create-assessment/`
  );

  const {
    data: editAssessmentData,
    isLoading: editAssessmentLoading,
    error: editAssessmentError,
    putData: editAssessment,
    resetState: resetEditAssessmentState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/edit-assessment/`
  );

  const {
    data: getQuestionnaireData,
    isLoading: getQuestionnaireLoading,
    error: getQuestionnaireError,
    getData: getQuestionnaire,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-questionnaires/`
  );

  const addQuestion = () => {
    setQuestionCount(questionCount + 1);
  };

  const removeQuestion = (questionNumber) => {
    const updatedQuestions = { ...questions };
    delete updatedQuestions[questionNumber];
    setQuestions(updatedQuestions);
    setQuestionCount(questionCount - 1);
  };
  const handleQuestionChange = (e, questionNumber) => {
    const value = e.target.value;
    setQuestions({ ...questions, [questionNumber]: value });
  };

  const handleSubmission = () => {
    if (isEditMode) {
      editAssessment({
        ...editAssessmentDataValue,
        descriptive_questions: Object.values(questions),
        id: assessmentData?.id,
      });
    } else {
      createAssessment({
        ...assessmentData,
        descriptive_questions: Object.values(questions),
      });
    }
  };

  const questionInputs = [];

  const handleOnChangeQuestionnaireRadio = (e) => {
    setQuestionnaireValue(e.target.value);
    const selectedQuestionnaire = getQuestionnaireData.find(
      (questionnaire) => questionnaire.id === e.target.value
    );
    setCurrentQuestionnaireData(selectedQuestionnaire);
  };

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = getQuestionnaireData?.filter((questionnaire) =>
        questionnaire.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };

  const assessmentDetailsFinish = (formData) => {
    const name = formData.name ? formData.name.trim() : "";
    const assessment_type = formData.assessment_type
      ? formData.assessment_type.trim()
      : "";
    const number_of_observers = formData.number_of_observers
      ? parseInt(formData.number_of_observers, 10)
      : 0;

    const assessment_end_date = formData.assessment_end_date
      .format("YYYY-MM-DD")
      .trim();
    const rating_type = formData.rating_type ? formData.rating_type.trim() : "";

    if (assessment_type === "360" && !number_of_observers) {
      notification.error({
        message:
          "Invalid Input: Number of Observers is required for '360 Assessment'.",
      });
    } else if (
      name &&
      assessment_type &&
      (assessment_type === "self" || number_of_observers) &&
      assessment_end_date &&
      rating_type
    ) {
      if (isEditMode) {
        editAssessment({
          name: name,
          assessment_type: assessment_type,
          number_of_observers:
            assessment_type === "self" ? 0 : number_of_observers,
          assessment_end_date: assessment_end_date,
          rating_type: rating_type,
          questionnaire: assessmentData?.questionnaire?.id,
          descriptive_questions: assessmentData?.descriptive_questions,
          id: assessmentData?.id,
        });
      } else {
        setAssessmentData({
          name,
          assessment_type,
          number_of_observers:
            assessment_type === "self" ? 0 : number_of_observers,
          assessment_end_date,
          rating_type,
        });
        setActiveStep(2);
      }
    } else {
      notification.error({
        message: "Invalid Input: Please fill in all required fields.",
      });
    }
  };

  const handleSelectQuestionnaireNext = () => {
    if (isEditMode) {
      editAssessment({
        ...editAssessmentDataValue,
        questionnaire: currentQuestionnaireData?.id,
        descriptive_questions: assessmentData?.descriptive_questions,
        id: assessmentData?.id,
      });
    } else {
      setAssessmentData({
        ...assessmentData,
        questionnaire: currentQuestionnaireData?.id,
      });
      setActiveStep(3);
    }
  };

  const handleSkipToStep3From2 = () => {
    setEditAssessmentDataValue({
      ...editAssessmentDataValue,
      questionnaire: assessmentData?.questionnaire?.id,
    });

    setActiveStep(3);
    setQuestionCount(assessmentData?.descriptive_questions?.length);
    const descriptiveQuestions = assessmentData?.descriptive_questions || [];

    const questionsObject = descriptiveQuestions.reduce(
      (result, question, index) => {
        result[index + 1] = question;
        return result;
      },
      {}
    );

    setQuestions(questionsObject);
  };

  const handleGoBackToStep1 = () => {
    setActiveStep(1);
    if (isEditMode) {
      assessmentDetailsForm.setFieldsValue({
        name: editAssessmentDataValue?.name,
        assessment_type: editAssessmentDataValue?.assessment_type,
        number_of_observers: editAssessmentDataValue?.number_of_observers,
        assessment_end_date: dayjs(
          editAssessmentDataValue?.assessment_end_date
        ),
        rating_type: editAssessmentDataValue?.rating_type,
      });
    } else {
      assessmentDetailsForm.setFieldsValue({
        name: assessmentData?.name,
        assessment_type: assessmentData?.assessment_type,
        number_of_observers: assessmentData?.number_of_observers,
        assessment_end_date: dayjs(assessmentData?.assessment_end_date),
        rating_type: assessmentData?.rating_type,
      });
    }
  };
  const handleGoBackToStep2 = () => {
    setActiveStep(2);
    if (isEditMode) {
      setQuestionnaireValue(editAssessmentDataValue?.questionnaire);
      const selectedQuestionnaire = getQuestionnaireData?.find(
        (questionnaire) =>
          questionnaire?.id === editAssessmentDataValue?.questionnaire
      );
      setCurrentQuestionnaireData(selectedQuestionnaire);
    } else {
      setQuestionnaireValue(assessmentData?.questionnaire);
      const selectedQuestionnaire = getQuestionnaireData?.find(
        (questionnaire) => questionnaire?.id === assessmentData?.questionnaire
      );
      setCurrentQuestionnaireData(selectedQuestionnaire);
    }
  };

  const handleSkipToStep3From1 = () => {
    setActiveStep(3);
    setEditAssessmentDataValue({
      name: assessmentData?.name,
      assessment_type: assessmentData?.assessment_type,
      number_of_observers: assessmentData?.number_of_observers,
      assessment_end_date: assessmentData?.assessment_end_date,
      rating_type: assessmentData?.rating_type,
      questionnaire: assessmentData?.questionnaire?.id,
    });
    setQuestionnaireValue(assessmentData?.questionnaire?.id);
    setCurrentQuestionnaireData(assessmentData?.questionnaire);
    setQuestionCount(assessmentData?.descriptive_questions?.length);
    const descriptiveQuestions = assessmentData?.descriptive_questions || [];

    const questionsObject = descriptiveQuestions.reduce(
      (result, question, index) => {
        result[index + 1] = question;
        return result;
      },
      {}
    );

    setQuestions(questionsObject);
  };

  const handleSkipToStep2From1 = () => {
    setActiveStep(2);
    setEditAssessmentDataValue({
      name: assessmentData?.name,
      assessment_type: assessmentData?.assessment_type,
      number_of_observers: assessmentData?.number_of_observers,
      assessment_end_date: assessmentData?.assessment_end_date,
      rating_type: assessmentData?.rating_type,
      questionnaire: assessmentData?.questionnaire?.id,
    });
    setQuestionnaireValue(assessmentData?.questionnaire?.id);
    setCurrentQuestionnaireData(assessmentData?.questionnaire);
  };

  for (let i = 1; i <= questionCount; i++) {
    questionInputs.push(
      <div key={i} className="mt-4">
        <label htmlFor={`question-${i}`} className="block font-medium">
          Question {i}
        </label>
        <Input.TextArea
          id={`question-${i}`}
          value={questions[i] || ""}
          onChange={(e) => handleQuestionChange(e, i)}
          className="w-full"
        />
        <Button onClick={() => removeQuestion(i)} className="mt-2 ml-2">
          Remove Input
        </Button>
      </div>
    );
  }

  const assessmentDetails = (
    <div className="flex justify-center mt-10">
      <div className="border-2 rounded-md p-4 lg:!w-[800px]">
        <p className="text-text-1 font-inter font-semibold text-xl text-20 leading-150 tracking-0.1">
          Fill all the assessment details
        </p>
        <Form
          form={assessmentDetailsForm}
          onFinish={assessmentDetailsFinish}
          onFinishFailed={() =>
            notification.error({
              message:
                "Invalid Input: Please review the highlighted fields and correct the errors.",
            })
          }
        >
          <div className="flex gap-2 mt-4">
            <div style={{ flex: 1 }}>
              <Form.Item
                name="name"
                labelCol={{ span: 24 }}
                label="Enter Assessment Name"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Assessment Name.",
                  },
                ]}
                className="mr-4"
              >
                <Input maxLength={101} placeholder="Enter Assessment Name" />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="assessment_type"
                labelCol={{ span: 24 }}
                label="Add Assessment Type"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Assessment Type.",
                  },
                ]}
              >
                <Select
                  placeholder="Select Assessment Type"
                  onChange={(value) => {
                    setAssessmentTypeValue(value);
                  }}
                >
                  <Select.Option value="self">Self Assessment</Select.Option>
                  <Select.Option value="360">360 Assessment</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-2">
            <div style={{ flex: 1 }}>
              <Form.Item
                name="number_of_observers"
                labelCol={{ span: 24 }}
                label="Number of Observers"
                rules={[
                  {
                    required: assessmentTypeValue === "self" ? false : true,
                    message: "Please Enter Number of Observers.",
                  },
                ]}
                className="mr-4"
              >
                <Select
                  placeholder="Select Number of Observers"
                  disabled={assessmentTypeValue === "self"}
                >
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                  <Select.Option value="3">3</Select.Option>
                  <Select.Option value="4">4</Select.Option>
                  <Select.Option value="5">5</Select.Option>
                </Select>
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              <Form.Item
                name="assessment_end_date"
                labelCol={{ span: 24 }}
                label="Assessment End Date"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Assessment End Date.",
                  },
                ]}
              >
                <DatePicker
                  format={"DD-MM-YYYY"}
                  placeholder="Select Assessment End Date"
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <Form.Item
                name="rating_type"
                labelCol={{ span: 24 }}
                label="Assessment Rating Type"
                rules={[
                  {
                    required: true,
                    message: "Please Enter Assessment Rating Type.",
                  },
                ]}
              >
                <Select placeholder="Select Rating Type">
                  <Select.Option value="1-5">1-5</Select.Option>
                  <Select.Option value="1-10">1-10</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Form.Item>
              <Tooltip
                title={
                  !isEditMode
                    ? "Please fill in all the required information to proceed to the next step."
                    : ""
                }
              >
                <Button
                  htmlType="submit"
                  type="primary"
                  loading={getQuestionnaireLoading}
                >
                  {isEditMode ? (
                    <div className="flex items-center">
                      <CheckOutlined className="mr-2" /> Save Changes
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Next <ArrowRightOutlined className="ml-2" />
                    </div>
                  )}
                </Button>
              </Tooltip>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
  const selectQuestionnaire = (
    <div className="flex m-4 border border-gray-300 rounded-t-lg">
      <div className="w-1/4 border-r border-gray-300 ">
        <div className="p-4 w-full bg-bg-1 border-b border-gray-300 rounded-tl-lg">
          <p className="text-xl font-semibold">Questionnaires</p>
        </div>
        <div className="p-4 border-b border-gray-300">
          <Input
            placeholder="Search Questionnaire..."
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
        <div className="overflow-y-auto custom-scrollbar h-[450px] p-6">
          <Radio.Group
            onChange={handleOnChangeQuestionnaireRadio}
            value={questionnaireValue}
          >
            <Space direction="vertical">
              {(searchedData ? searchedData : getQuestionnaireData)?.map(
                (questionnaire, index) => (
                  <Radio
                    key={questionnaire.id}
                    value={questionnaire.id}
                    className={index > 0 ? "mt-4" : ""}
                  >
                    {questionnaire.name}
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
            {currentQuestionnaireData?.name}
          </p>
        </div>
        <div className="m-4 lg:h-[450px] overflow-y-auto custom-scrollbar">
          {currentQuestionnaireData?.questions?.map((question, index) => (
            <div className="mr-4">
              <div
                key={index}
                className="p-2 w-full bg-bg-1 border border-gray-300 rounded-t-lg"
              >
                <p className="text-l font-semibold">
                  {question?.competency?.name}
                </p>
              </div>
              <div className="p-4">
                <p className="m-2">
                  <strong>Self Question:</strong> {question?.self_question}
                </p>
                {((isEditMode &&
                  editAssessmentDataValue?.assessment_type === "360") ||
                  (!isEditMode &&
                    assessmentData?.assessment_type === "360")) && (
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
        <div className="flex justify-between mb-2 mr-4 ml-4">
          <Button onClick={handleGoBackToStep1}>
            <ArrowLeftOutlined />
            Go Back to Step 1
          </Button>
          <Button
            type="primary"
            onClick={handleSelectQuestionnaireNext}
            loading={getQuestionnaireLoading}
          >
            {isEditMode ? (
              <div className="flex items-center">
                <CheckOutlined className="mr-2" /> Save Changes
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
  );
  const descriptiveQuestions = (
    <>
      <div className="flex flex-col items-center mt-6 h-[570px]">
        <div className="border-2 rounded-md p-8 lg:w-[800px] overflow-y-auto custom-scrollbar lg:h-[500px] ">
          <p className="text-text-1 font-inter font-semibold text-xl text-20 leading-150 tracking-0.1">
            Add Descriptive Question
          </p>
          <p className="font-inter text-text-4 text-sm mt-2">
            Adding descriptive questions is optional. You can continue without
            creating descriptive questions.
          </p>
          {questionInputs}
          <Button
            onClick={addQuestion}
            className="mt-4 bg-primary-4 w-full border-none text-left"
          >
            <AddRounded />
            Add Question
          </Button>
        </div>
      </div>
      <div className="flex justify-between mr-6 ml-6 ">
        <Button onClick={handleGoBackToStep2}>
          <ArrowLeftOutlined />
          Go Back to Step 2
        </Button>
        <Button
          type="primary"
          onClick={handleSubmission}
          loading={createAssessmentLoading || getQuestionnaireLoading}
        >
          <CheckOutlined />
          {isEditMode ? " Save Changes" : "Create Assessment"}
        </Button>
      </div>
    </>
  );

  useEffect(() => {
    if (getQuestionnaireData && getQuestionnaireData.length > 0) {
      setQuestionnaireValue(getQuestionnaireData[0].id);
      setCurrentQuestionnaireData(getQuestionnaireData[0]);
    }
  }, [getQuestionnaireData]);

  useEffect(() => {
    if (isEditMode) {
      if (activeStep === 1) {
        assessmentDetailsForm.setFieldsValue({
          name: assessmentData?.name,
          assessment_type: assessmentData?.assessment_type,
          number_of_observers: assessmentData?.number_of_observers,
          assessment_end_date: dayjs(assessmentData?.assessment_end_date),
          rating_type: assessmentData?.rating_type,
        });
        setAssessmentTypeValue(assessmentData?.assessment_type);
      } else if (activeStep === 2) {
        setQuestionnaireValue(assessmentData?.questionnaire.id);
        setCurrentQuestionnaireData(assessmentData?.questionnaire);
      } else if (activeStep === 3) {
      }
    }
  }, [activeStep, isEditMode]);

  useEffect(() => {
    if (createAssessmentData) {
      navigate("/assessments");
      resetCreateAssessmentState();
    }
  }, [createAssessmentData]);

  useEffect(() => {
    if (editAssessmentData) {
      navigate("/assessments");
      resetEditAssessmentState();
    }
  }, [editAssessmentData]);

  useEffect(() => {
    if (isEditMode && !assessmentData) {
      navigate("/assessments");
    }
  }, []);

  return (
    <>
      <Header>
        <div className="flex items-center">
          <CloseOutlined
            className="mr-4 cursor-pointer"
            onClick={() => navigate("/assessments")}
          />
          <div>{isEditMode ? "Edit Assessment" : "Create Assessment"}</div>
        </div>
      </Header>{" "}
      <div className="m-4 mt-0">
        <div className="flex flex-row justify-center items-center  ">
          <div
            className={`flex items-center p-2 px-6  ${
              activeStep === 1
                ? "bg-primary-4 border-b-2 border-primary-1"
                : "bg-white border-b-2"
            } ${isEditMode ? "cursor-pointer" : ""}`}
            onClick={() =>
              isEditMode && (activeStep === 2 || activeStep === 3)
                ? handleGoBackToStep1()
                : ""
            }
          >
            {!isEditMode && (
              <Badge
                style={{ color: `${activeStep === 1 ? "#7E39A4" : "black"}` }}
                color={`${activeStep === 1 ? "#F9F0FF" : "#027a48"}`}
                count={
                  activeStep === 1 ? (
                    1
                  ) : (
                    <CheckOutlined className="bg-success-bg rounded-xl p-1" />
                  )
                }
                className="mr-2"
              ></Badge>
            )}

            <div>
              {!isEditMode && <div className="text-text-4">Step 1</div>}
              <div className={`${activeStep === 1 ? "text-primary-2" : ""}`}>
                Assessment Details
              </div>
            </div>
          </div>
          <div
            className={`flex items-center p-2 px-6 ${
              activeStep === 2
                ? "bg-primary-4 border-b-2 border-primary-1"
                : "bg-white border-b-2"
            }  ${isEditMode ? "cursor-pointer" : ""}`}
            onClick={() =>
              isEditMode && activeStep === 1
                ? handleSkipToStep2From1()
                : isEditMode && activeStep === 3
                ? handleGoBackToStep2()
                : ""
            }
          >
            {!isEditMode && (
              <Badge
                style={{ color: `${activeStep === 2 ? "#7E39A4" : "black"}` }}
                color={`${activeStep === 2 ? "#F9F0FF" : "#f4f4f4"}`}
                count={
                  activeStep === 3 ? (
                    <CheckOutlined className="bg-success-bg rounded-xl p-1" />
                  ) : (
                    2
                  )
                }
                className="mr-2"
              ></Badge>
            )}
            <div>
              {!isEditMode && <div className="text-text-4">Step 2</div>}
              <div className={`${activeStep === 2 ? "text-primary-2" : ""}`}>
                Select Questionnaire
              </div>
            </div>
          </div>
          <div
            className={`flex items-center p-2 px-6 ${
              activeStep === 3
                ? "bg-primary-4 border-b-2 border-primary-1"
                : "bg-white border-b-2"
            }  ${isEditMode ? "cursor-pointer" : ""}`}
            onClick={() =>
              isEditMode && activeStep === 1
                ? handleSkipToStep3From1()
                : isEditMode && activeStep === 2
                ? handleSkipToStep3From2()
                : ""
            }
          >
            {!isEditMode && (
              <Badge
                style={{ color: `${activeStep === 3 ? "#7E39A4" : "black"}` }}
                color={`${activeStep === 3 ? "#F9F0FF" : "#f4f4f4"}`}
                count={3}
                className="mr-2"
              ></Badge>
            )}
            <div>
              {!isEditMode && <div className="text-text-4">Step 3</div>}
              <div className={`${activeStep === 3 ? "text-primary-2" : ""}`}>
                Descriptive Questions
              </div>
            </div>
          </div>
        </div>

        {activeStep === 1 ? (
          <>{assessmentDetails}</>
        ) : activeStep === 2 ? (
          <>{selectQuestionnaire}</>
        ) : (
          <>{descriptiveQuestions}</>
        )}
      </div>
    </>
  );
};
