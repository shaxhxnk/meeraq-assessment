import { useEffect, useState } from "react";
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
  Select,
} from "antd";
import { AddRounded, SearchOutlined } from "@mui/icons-material";
import { useGetApi } from "../../hooks/useGetApi";
import { usePostApi } from "../../hooks/usePostApi";
import { usePutApi } from "../../hooks/usePutApi";
import { useDeleteApi } from "../../hooks/useDeleteApi";
import { CloseCircleOutlined } from "@ant-design/icons";
import { MoreOutlined, FileTextOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export const AddQuestionnaire = ({
  currentQuestionnaireData,
  onCreateQuestionnaire,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [addQuestionData, setAddQuestionData] = useState(null);
  const [addQuestionModalVisible, setAddQuestionModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const {
    data: getQuestionData,
    isLoading: getQuestionLoading,
    error: getQuestionError,
    getData: getQuestion,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-questions/`
  );

  const {
    data: getCompetencyData,
    isLoading: getCompetencyLoading,
    error: getCompetencyError,
    getData: getCompetency,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-competencies/`
  );

  const {
    data: createQuestionData,
    isLoading: createQuestionLoading,
    postData: createQuestion,
    resetState: resetCreateQuestionState,
  } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/create-question/`
  );

  const {
    data: createQuestionnaireData,
    isLoading: createQuestionnaireLoading,
    postData: createQuestionnaire,
    resetState: resetCreateQuestionnaireState,
  } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/create-questionnaire/`
  );

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = getQuestionData?.filter(
        (question) =>
          question.self_question
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          question.observer_question
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          question.competency.name
            .toLowerCase()
            .includes(searchText.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };

  const handleAddQuestion = () => {
    setAddQuestionData(null);
    setAddQuestionModalVisible(true);
  };

  const handleAddQuestionModalConfirm = () => {
    createQuestion(addQuestionData);
  };

  const handleAddQuestionModalCancel = () => {
    setAddQuestionData(null);
    setAddQuestionModalVisible(false);
  };

  const handleSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedQuestions(selectedRows);
    setQuestionnaireData({
      ...currentQuestionnaireData,
      questions: selectedRowKeys,
    });
  };

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedQuestions([]);
  };

  const handleCreateQuestionnaire = () => {
    createQuestionnaire(questionnaireData);
  };

  const columns = [
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (_, question) => {
        return (
          <div>
            <p className="mt-2 mb-2">
              <strong>Self Question:</strong> {question.self_question}
            </p>
            <hr />
            <p className="mt-2 mb-2">
              <strong>Observer Question:</strong> {question.observer_question}
            </p>
          </div>
        );
      },
    },
    {
      title: "Competency Tagged",
      dataIndex: "competency",
      key: "competency",
      render: (_, question) => {
        return <>{question.competency.name}</>;
      },
    },
  ];

  const customFooter = () => (
    <div className="flex justify-between">
      <div className="text-gray-500 ml-2">
        {selectedRowKeys?.length} questions selected
      </div>
      <div>
        <Button
          className="mr-4"
          onClick={() => handleClearSelection()}
          disabled={selectedRowKeys?.length < 1}
        >
          Clear Selection
        </Button>
        <Button
          className=""
          onClick={() => handleCreateQuestionnaire()}
          type="primary"
          disabled={selectedRowKeys?.length < 1}
          loading={createQuestionnaireLoading}
        >
          Create Questionnaire
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    if (createQuestionData) {
      setAddQuestionModalVisible(false);
      getQuestion();
      resetCreateQuestionState();
    }
  }, [createQuestionData]);

  useEffect(() => {
    if (createQuestionnaireData) {
      onCreateQuestionnaire();
      resetCreateQuestionnaireState();
    }
  }, [createQuestionnaireData]);

  useEffect(() => {
    if (currentQuestionnaireData) {
      setQuestionnaireData(currentQuestionnaireData);
    }
  }, []);
  return (
    <>
      <Header>
        <div className="flex justify-between">
          {questionnaireData?.name}
          <div className="text-right">
            <Button
              className=" mr-2"
              onClick={() => handleAddQuestion()}
              type="primary"
            >
              <AddRounded />
              New Question
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <div className="">
          <Input
            placeholder="Search..."
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
            className="!w-[250px] mt-2 ml-2"
          />
        </div>
        <Table
          className="mt-4"
          columns={columns}
          dataSource={searchedData || getQuestionData}
          pagination={{ pageSize: 10 }}
          rowKey="id"
          rowSelection={{
            type: "checkbox",
            selectedRowKeys: selectedRowKeys,
            onChange: handleSelectChange,
          }}
          footer={customFooter}
        />

        <Modal
          title={"Add New Question"}
          open={addQuestionModalVisible}
          onOk={handleAddQuestionModalConfirm}
          onCancel={() => handleAddQuestionModalCancel()}
          okText="Confirm"
          confirmLoading={createQuestionLoading}
        >
          <div className="flex flex-col space-y-4">
            <div className="space-y-2">
              <label className="font-bold">Self Question:</label>
              <TextArea
                value={addQuestionData?.self_question}
                onChange={(e) =>
                  setAddQuestionData({
                    ...addQuestionData,
                    self_question: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold">Observer Question:</label>
              <TextArea
                value={addQuestionData?.observer_question}
                onChange={(e) =>
                  setAddQuestionData({
                    ...addQuestionData,
                    observer_question: e.target.value,
                  })
                }
                className="p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold">Competency:</label>
              <Select
                value={addQuestionData?.competency?.id}
                onChange={(value) =>
                  setAddQuestionData({
                    ...addQuestionData,
                    competency: value,
                  })
                }
                className="p-2 !w-[200px]"
              >
                {getCompetencyData?.map((competency) => (
                  <Option key={competency?.id} value={competency?.id}>
                    {competency?.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};
