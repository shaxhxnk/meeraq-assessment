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
} from "antd";
import { AddRounded, EditOutlined } from "@mui/icons-material";
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
    const observerskey = Object.keys(values).filter((key) =>
      key.startsWith("observers[")
    );
    for (let i = 0; i < observerskey.length / 2; i++) {
      const observerName = values[`observers[${i}].observerName`];
      const observerEmail = values[`observers[${i}].observerEmail`];

      observers.push({
        observerName,
        observerEmail,
      });
    }

    addParticipant({
      assessment_id: assessmentData.id,
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
          <>{responsesTab}</>
        ) : selectedCategory === "results" ? (
          <> {resultsTab}</>
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
