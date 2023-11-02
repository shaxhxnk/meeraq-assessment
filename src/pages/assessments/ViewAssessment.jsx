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
  Tooltip,
  Space,
  Select,
  Progress,
} from "antd";
import { AddRounded, EditOutlined, SearchOutlined } from "@mui/icons-material";
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
import moment from "moment";

const categories = {
  questionnaire: "Questionnaire",
  responses: "Responses",
  results: "Results",
};

function disabledDate(current) {
  return current && current < moment().endOf("day");
}

export const ViewAssessment = () => {
  const location = useLocation();
  const [assessmentData, setAssessmentData] = useState(
    location?.state?.assessment
  );

  const [selectedCategory, setSelectedCategory] = useState("questionnaire");
  const [addParticipantModal, setAddParticipantModal] = useState(false);
  const [form] = Form.useForm();
  const [participantFields, setParticipantFields] = useState([]);
  const [observerFields, setObserverFields] = useState([]);
  const [editAssessmentEndDateEnabled, setEditAssessmentEndDateEnabled] =
    useState(false);
  const [assessmentEndDateFieldData, setAssessmentEndDateFieldData] = useState(
    dayjs(assessmentData?.assessment_end_date)
  );

  const {
    data: addParticipantData,
    isLoading: addParticipantLoading,
    error: addParticipantError,
    putData: addParticipant,
    resetState: resetAddParticipantState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/add-participant-observer-to-assessment/`
  );

  const {
    data: editStatusOrEndDataData,
    isLoading: editStatusOrEndDataLoading,
    error: editStatusOrEndDataError,
    putData: editStatusOrEndData,
    resetState: resetEditStatusOrEndDataState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/assessment-status-end-data-change/`
  );

  const addParticipantField = () => {
    setParticipantFields([...participantFields, {}]);
  };

  const addObserverField = () => {
    setObserverFields([...observerFields, {}]);
  };

  const navigate = useNavigate();

  const handleAddParticipantConfirm = async () => {
    const values = await form.validateFields();

    const participants = values.participants;

    const observers = [];
  
    for (let i = 0; i < assessmentData?.number_of_observers; i++) {
      const observerName = values[`observers[${i}].observerName`];
      const observerEmail = values[`observers[${i}].observerEmail`];
      const observerType = values[`observers[${i}].observerType`];

      observers.push({
        observerName,
        observerEmail,
        observerType,
      });
    }
    
    addParticipant({
      assessment_id: assessmentData?.id,
      participants: participants,
      observers: observers,
    });
  };

  const handleStatusChange = (status) => {
    editStatusOrEndData({
      id: assessmentData.id,
      status: status,
      assessment_end_date: assessmentData.assessment_end_date,
    });
  };
  const handleEditAssessmentEndDate = () => {
    editStatusOrEndData({
      id: assessmentData.id,
      status: assessmentData.status,
      assessment_end_date: assessmentEndDateFieldData.format("YYYY-MM-DD"),
    });
  };

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
                <li className="mb-1" key={index}>
                  {" "}
                  {question.trim()}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (!assessmentData) {
      navigate("/assessments");
    }
  }, []);

  useEffect(() => {
    if (addParticipantData) {
      setAddParticipantModal(false);
      setAssessmentData(addParticipantData?.assessment_data);
      form.resetFields();
    }
  }, [addParticipantData]);

  useEffect(() => {
    if (editStatusOrEndDataData) {
      setAssessmentData(editStatusOrEndDataData?.assessment_data);
      setAssessmentEndDateFieldData(
        dayjs(editStatusOrEndDataData?.assessment_data?.assessment_end_date)
      );
      setEditAssessmentEndDateEnabled(false);
      resetEditStatusOrEndDataState();
    }
  }, [editStatusOrEndDataData]);

  const statusOptions = ["ongoing", "draft", "completed"];
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
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => handleStatusChange(key)}>
                  {statusOptions
                    .filter((status) => status !== assessmentData?.status)
                    .map((status) => (
                      <Menu.Item key={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Menu.Item>
                    ))}
                </Menu>
              }
            >
              <div
                className={`capitalize ml-4 px-3 rounded-lg cursor-pointer ${
                  assessmentData?.status === "ongoing"
                    ? "bg-success-bg text-success "
                    : assessmentData?.status === "draft"
                    ? "bg-gray-200 text-gray-600"
                    : assessmentData?.status === "completed"
                    ? "bg-gray-200 text-gray-600"
                    : ""
                }`}
              >
                {assessmentData?.status}
              </div>
            </Dropdown>
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
              disabled={!editAssessmentEndDateEnabled}
              value={dayjs(assessmentData?.assessment_end_date)}
            />
            <Tooltip title={"Click to edit assessment end date."}>
              <EditOutlined
                className="mr-1 cursor-pointer"
                onClick={() => setEditAssessmentEndDateEnabled(true)}
              />
            </Tooltip>
            <Button
              className=" mr-2"
              onClick={() => setAddParticipantModal(true)}
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
          <>{<ParticipantResponses assessmentData={assessmentData} />}</>
        ) : selectedCategory === "results" ? (
          <> {<ParticipantResult assessmentData={assessmentData} />}</>
        ) : (
          <></>
        )}

        <Modal
          title="Add Participant"
          open={addParticipantModal}
          onOk={handleAddParticipantConfirm}
          onCancel={() => setAddParticipantModal(false)}
          okText="Confirm"
          confirmLoading={addParticipantLoading}
        >
          <div className="overflow-y-auto custom-scrollbar h-[450px] p-4">
            <Form form={form}>
              <Form.List name="participants" initialValue={[""]}>
                {(fields, { add, remove }) => (
                  <div className="">
                    <p className="font-Inter font-semibold text-xl">
                      Participant
                    </p>
                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                      <div key={key}>
                        <Form.Item
                          {...restField}
                          name={[name, "participantName"]}
                          fieldKey={[fieldKey, "participantName"]}
                          label={`Name of Participant`}
                          rules={[
                            {
                              required: true,
                              message:
                                "Please enter a name for the participant!",
                            },
                          ]}
                          labelCol={{ span: 24 }}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "participantEmail"]}
                          fieldKey={[fieldKey, "participantEmail"]}
                          label={`Email Id of Participant `}
                          rules={[
                            {
                              type: "email",
                              message: "Invalid email format",
                            },
                            {
                              required: true,
                              message:
                                "Please enter an email address for the participant!",
                            },
                          ]}
                          labelCol={{ span: 24 }}
                        >
                          <Input />
                        </Form.Item>
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
              {assessmentData?.assessment_type === "360" && (
                <p className="font-Inter font-semibold text-xl">Observer</p>
              )}
              {Array.from({ length: assessmentData?.number_of_observers }).map(
                (_, index) => (
                  <div key={index}>
                    <Form.Item
                      name={`observers[${index}].observerName`}
                      label={`Name for Observer ${index + 1}`}
                      rules={[
                        {
                          required: true,
                          message: "Please enter a name for the Observer!",
                        },
                      ]}
                      labelCol={{ span: 24 }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={`observers[${index}].observerEmail`}
                      label={`Email Id for Observer ${index + 1}`}
                      rules={[
                        {
                          type: "email",
                          message: "Invalid email format",
                        },
                        {
                          required: true,
                          message:
                            "Please enter an email address for the Observer!",
                        },
                      ]}
                      labelCol={{ span: 24 }}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={`observers[${index}].observerType`}
                      label={`Type for Observer ${index + 1}`}
                      rules={[
                        {
                          required: true,
                          message: "Please select a type for the Observer!",
                        },
                      ]}
                      labelCol={{ span: 24 }}
                    >
                      <Select>
                        <Select.Option key={"manager"} value={"manager"}>
                          Manager
                        </Select.Option>
                        <Select.Option key={"reportee"} value={"reportee"}>
                          Reportee
                        </Select.Option>
                        <Select.Option key={"peer"} value={"peer"}>
                          Peer
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                )
              )}
            </Form>
          </div>
        </Modal>

        <Modal
          title="Edit Assessment End Date"
          open={editAssessmentEndDateEnabled}
          onOk={handleEditAssessmentEndDate}
          onCancel={() => setEditAssessmentEndDateEnabled(false)}
          okText="Confirm"
          confirmLoading={editStatusOrEndDataLoading}
        >
          <label className="text-sm font-medium mr-2">
            Enter Assessment End Date:
          </label>
          <DatePicker
            format={"DD-MM-YYYY"}
            value={assessmentEndDateFieldData}
            onChange={setAssessmentEndDateFieldData}
            placeholder="Select Assessment End Date"
            disabledDate={disabledDate}
            className="m-2"
          />
        </Modal>
      </div>
    </>
  );
};

const ParticipantResponses = ({ assessmentData }) => {
  const categories = {
    participant: "Participant",
    observer: "Observer",
  };

  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [responseValue, setResponseValue] = useState(null);
  const [currentrResponseData, setCurrentResponseData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("participant");
  const [participantObservers, setParticipantObservers] = useState(null);
  const [currentObserverIdSelected, setCurrentObserverIdSelected] =
    useState(null);

  const {
    data: getParticipantsResultResponseData,
    isLoading: getParticipantsResultResponseLoading,
    error: getParticipantsResultResponseError,
    getData: getParticipantsResultResponse,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-participants-response-result/${assessmentData?.id}`
  );

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = getParticipantsResultResponseData?.filter(
        (participantResponse) =>
          participantResponse.participant?.name
            ?.toLowerCase()
            ?.includes(searchText?.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };

  const handleOnChangeRespondentsRadio = (e) => {
    setResponseValue(e.target.value);
    const selectedResponse = getParticipantsResultResponseData.find(
      (participantResponse) =>
        participantResponse.participant.id === e.target.value
    );
    setCurrentResponseData(selectedResponse);
  };

  const calculateResponseOfQuestion = (questionId) => {
    if (getParticipantsResultResponseData) {
      const assessmentResponse = getParticipantsResultResponseData.find(
        (response) =>
          response.participant.id === currentrResponseData?.participant?.id
      );

      return assessmentResponse?.participant_response[questionId];
    }
    return 0;
  };

  const calculateResponseOfQuestionForObserver = (questionId) => {};
  const handleObserverSelectChange = (value) => {
    setCurrentObserverIdSelected(value);
  };
  // console.log(assessmentData);
  useEffect(() => {
    if (assessmentData && currentrResponseData) {
      const selectedParticipantsObservers =
        assessmentData.participants_observers.find(
          (participantsObservers) =>
            participantsObservers.participant.id ===
            currentrResponseData.participant.id
        );

      if (selectedParticipantsObservers) {
        const observers = selectedParticipantsObservers.observers.map(
          (observer) => observer
        );

        setParticipantObservers(observers);
      }
    }
  }, [assessmentData, currentrResponseData]);

  useEffect(() => {
    if (
      getParticipantsResultResponseData &&
      getParticipantsResultResponseData.length > 0
    ) {
      setResponseValue(getParticipantsResultResponseData[0]?.participant?.id);
      setCurrentResponseData(getParticipantsResultResponseData[0]);
    }
  }, [getParticipantsResultResponseData]);

  if (getParticipantsResultResponseLoading) {
    return <Spin />;
  } else {
    return (
      <>
        <div className=" mt-4">
          <div className="flex m-4 border border-gray-300 rounded-t-lg">
            <div className="w-1/4 border-r border-gray-300 ">
              <div className="p-4 w-full bg-bg-1 border-b border-gray-300 rounded-tl-lg">
                <p className="text-xl font-semibold">Respondents</p>
              </div>
              <div className="p-4 border-b border-gray-300">
                <Input
                  placeholder="Respondent Name Search..."
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
                style={{ height: "calc(100vh - 42vh)" }}
              >
                <Radio.Group
                  onChange={handleOnChangeRespondentsRadio}
                  value={responseValue}
                >
                  <Space direction="vertical">
                    {(searchedData
                      ? searchedData
                      : getParticipantsResultResponseData
                    )?.map((participantResponse, index) => (
                      <Radio
                        key={participantResponse.participant.id}
                        value={participantResponse.participant.id}
                        className={index > 0 ? "mt-4" : ""}
                      >
                        {participantResponse.participant.name}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
            <div className="w-3/4">
              <div className="p-4 w-full bg-bg-1 border-b  border-gray-300 rounded-tr-lg">
                <p className="text-xl font-semibold pl-4">
                  {currentrResponseData?.participant?.name}
                </p>
              </div>
              <div className="m-2 lg:h-[450px] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between">
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
                  {selectedCategory === "observer" && (
                    <>
                      <Select
                        style={{ width: 200 }}
                        placeholder="Select a Observer"
                        onChange={handleObserverSelectChange}
                        className="mr-2 mt-1"
                        value={currentObserverIdSelected}
                      >
                        {participantObservers.map((observer) => (
                          <Select.Option key={observer.id} value={observer.id}>
                            {observer.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
                {selectedCategory === "participant" ? (
                  <div className="m-4">
                    {assessmentData && (
                      <div>
                        {Object.values(
                          assessmentData.questionnaire.questions.reduce(
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
                          <div
                            key={index}
                            className={`border-t border-l border-r border-gray ${
                              index === 0 ? "rounded-t-lg" : ""
                            }`}
                          >
                            <div
                              className={`p-4 border-b border-gray bg-gray-100 ${
                                index === 0 ? "rounded-t-lg" : ""
                              }`}
                            >
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
                                    {assessmentData?.rating_type === "1-10"
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
                                      : assessmentData?.rating_type === "1-5"
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
                ) : selectedCategory === "observer" &&
                  currentObserverIdSelected ? (
                  <div className="m-4">
                    {assessmentData && (
                      <div>
                        {Object.values(
                          assessmentData.questionnaire.questions.reduce(
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
                          <div
                            key={index}
                            className={`border-t border-l border-r border-gray ${
                              index === 0 ? "rounded-t-lg" : ""
                            }`}
                          >
                            <div
                              className={`p-4 border-b border-gray bg-gray-100 ${
                                index === 0 ? "rounded-t-lg" : ""
                              }`}
                            >
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
                                    {question.observer_question}
                                  </p>
                                  <div className="flex items-center justify-start ml-2.5 mt-4 mb-2 text-center  gap-6">
                                    {assessmentData?.rating_type === "1-10"
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
                                                calculateResponseOfQuestionForObserver(
                                                  question.id
                                                ) === number && number <= 3
                                                  ? "bg-red-600 text-white"
                                                  : calculateResponseOfQuestionForObserver(
                                                      question.id
                                                    ) === number && number <= 7
                                                  ? "bg-rating-1 text-white"
                                                  : calculateResponseOfQuestionForObserver(
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
                                      : assessmentData?.rating_type === "1-5"
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
                                                calculateResponseOfQuestionForObserver(
                                                  question.id
                                                ) === number && number <= 2
                                                  ? "bg-red-600 text-white"
                                                  : calculateResponseOfQuestionForObserver(
                                                      question.id
                                                    ) === number && number <= 3
                                                  ? "bg-rating-1 text-white"
                                                  : calculateResponseOfQuestionForObserver(
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
                ) : null}
              </div>
              <div className="flex justify-between mb-2 mr-4 ml-4"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

const ParticipantResult = ({ assessmentData }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);

  const [responseValue, setResponseValue] = useState(null);
  const [currentrResponseData, setCurrentResponseData] = useState(null);

  const {
    data: getParticipantsResultResponseData,
    isLoading: getParticipantsResultResponseLoading,
    error: getParticipantsResultResponseError,
    getData: getParticipantsResultResponse,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-participants-response-result/${assessmentData?.id}`
  );

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = getParticipantsResultResponseData?.filter(
        (participantResponse) =>
          participantResponse.participant?.name
            ?.toLowerCase()
            ?.includes(searchText?.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };

  const handleOnChangeRespondentsRadio = (e) => {
    setResponseValue(e.target.value);
    const selectedResponse = getParticipantsResultResponseData.find(
      (participantResponse) =>
        participantResponse.participant.id === e.target.value
    );
    setCurrentResponseData(selectedResponse);
  };

  useEffect(() => {
    if (
      getParticipantsResultResponseData &&
      getParticipantsResultResponseData.length > 0
    ) {
      setResponseValue(getParticipantsResultResponseData[0]?.participant?.id);
      setCurrentResponseData(getParticipantsResultResponseData[0]);
    }
  }, [getParticipantsResultResponseData]);

  return (
    <div className=" mt-4">
      <div className="flex m-4 border border-gray-300 rounded-t-lg">
        <div className="w-1/4 border-r border-gray-300 ">
          <div className="p-4 w-full bg-bg-1 border-b border-gray-300 rounded-tl-lg">
            <p className="text-xl font-semibold">Respondents</p>
          </div>
          <div className="p-4 border-b border-gray-300">
            <Input
              placeholder="Respondent Name Search..."
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
            style={{ height: "calc(100vh - 42vh)" }}
          >
            <Radio.Group
              onChange={handleOnChangeRespondentsRadio}
              value={responseValue}
            >
              <Space direction="vertical">
                {(searchedData
                  ? searchedData
                  : getParticipantsResultResponseData
                )?.map((participantResponse, index) => (
                  <Radio
                    key={participantResponse.participant.id}
                    value={participantResponse.participant.id}
                    className={index > 0 ? "mt-4" : ""}
                  >
                    {participantResponse.participant.name}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
        </div>
        <div className="w-3/4">
          <div className="p-4 w-full bg-bg-1 border-b  border-gray-300 rounded-tr-lg">
            <p className="text-xl font-semibold pl-4">
              {currentrResponseData?.participant?.name}
            </p>
          </div>
          <div className="m-2 lg:h-[450px] overflow-y-auto custom-scrollbar">
            {assessmentData && (
              <div>
                {Object.values(
                  assessmentData.questionnaire.questions.reduce(
                    (competencies, question) => {
                      if (!competencies[question.competency.name]) {
                        competencies[question.competency.name] = [];
                      }
                      competencies[question.competency.name].push(question);
                      return competencies;
                    },
                    {}
                  )
                ).map((questions, index) => (
                  <div
                    key={index}
                    className="border rounded-lg border-gray mt-4 m-8 ml-4"
                  >
                    <div className="m-4 pb-4 border-b border-gray">
                      <p className=" text-text-2 text-base font-semibold leading-6">
                        {questions[0].competency.name}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center ">
                        <div className="border-r border-gray !w-[500px]">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 ml-6  bg-rating-2 rounded-full items-center flex justify-center">
                              <p>S</p>
                            </div>
                            <p>Self</p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8  ml-6  bg-rating-2 rounded-full items-center flex justify-center ">
                              <p>M</p>
                            </div>
                            <p>Manager</p>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8  ml-6  bg-rating-2 rounded-full items-center flex justify-center ">
                              <p>S</p>
                            </div>
                            <p>Reportee</p>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8  ml-6 bg-rating-2 rounded-full items-center flex justify-center ">
                              <p>S</p>
                            </div>
                            <p>Peers</p>
                          </div>
                        </div>
                        <div className="ml-24 ">
                          <Progress
                            type="circle"
                            percent={75}
                            size="large"
                            strokeColor={{ from: "#CC3A92", to: "#7E39A4" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-between mb-2 mr-4 ml-4"></div>
        </div>
      </div>
    </div>
  );
};
