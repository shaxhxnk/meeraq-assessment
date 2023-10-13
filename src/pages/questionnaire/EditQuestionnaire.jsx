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
import { CloseOutlined } from "@ant-design/icons";



export const EditQuestionnaire = ({
  currentQuestionnaireData,
  onEditQuestionnaire,
  onEditBack,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [addQuestionModalVisible, setAddQuestionModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionnaireData, setQuestionnaireData] = useState(null);
  const [filteredQuestionsData, setFilteredQuestionsData] = useState(null);
  const [searchTextInsideModal, setSearchTextInsideModal] = useState("");
  const [searchedDataInsideModal, setSearchedDataInsideModal] = useState(null);
  const [deleteQuestionData, setDeleteQuestionData] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const {
    data: getQuestionData,
    isLoading: getQuestionLoading,
    error: getQuestionError,
    getData: getQuestion,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-questions/`
  );

  const {
    data: editQuestionnaireData,
    isLoading: editQuestionnaireLoading,
    error: editQuestionnaireError,
    putData: editQuestionnaire,
    resetState: resetEditQuestionnaireState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/edit-questionnaire/`
  );

  const {
    data: deleteQuestionInQuestionnaireData,
    isLoading: deleteQuestionInQuestionnaireLoading,
    error: deleteQuestionInQuestionnaireError,
    putData: deleteQuestionInQuestionnaire,
    resetState: resetDeleteQuestionInQuestionnaireState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/edit-questionnaire/`
  );

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = currentQuestionnaireData?.questions?.filter(
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

  const handleSearchInsideModal = (searchText) => {
    setSearchTextInsideModal(searchText);
    if (!searchText) {
      setSearchedDataInsideModal(null);
    } else {
      const searchData = filteredQuestionsData?.filter(
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

      setSearchedDataInsideModal(searchData);
    }
  };

  const clearSearchInsideModal = () => {
    setSearchTextInsideModal("");
    setSearchedDataInsideModal(null);
  };
  const handleSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedQuestions(selectedRows);
    setQuestionnaireData({
      ...currentQuestionnaireData,
      questions: selectedRowKeys,
    });
  };

  const handleSelectChangeInsideModal = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedQuestions(selectedRows);

    const updatedQuestionIDs = [
      ...currentQuestionnaireData.questions.map((question) => question.id),
      ...selectedRowKeys,
    ];

    setQuestionnaireData({
      ...currentQuestionnaireData,
      questions: updatedQuestionIDs,
    });
  };

  const handleClearSelection = () => {
    setSelectedRowKeys([]);
    setSelectedQuestions([]);
  };

  const handleAddQuestionsToQuestionnaireModalOpen = () => {
    handleClearSelection();
    clearSearch();
    clearSearchInsideModal();
    setAddQuestionModalVisible(true);
    setQuestionnaireData(null);
  };

  const handleAddQuestionsToQuestionnaire = () => {
    editQuestionnaire(questionnaireData);
  };

  const handleAddModalCancel = () => {
    handleClearSelection();
    clearSearchInsideModal();
    setAddQuestionModalVisible(false);
  };

  const handleDeleteSelection = () => {
    const updatedQuestions = currentQuestionnaireData.questions.filter(
      (question) => !selectedRowKeys.includes(question.id)
    );

    setQuestionnaireData({
      ...currentQuestionnaireData,
      questions: updatedQuestions.map((question) => question.id),
    });
    setDeleteModalVisible(true);
  };
  const handleDeleteConfirm = () => {
    deleteQuestionInQuestionnaire(questionnaireData);
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
    <div className="flex justify-between items-center">
      <div className="text-gray-500  ml-2">
        {selectedRowKeys?.length} questions selected
      </div>
      <div className=" flex items-center">
        <Button
          className="mr-4 pb-2"
          onClick={() => handleDeleteSelection()}
          disabled={selectedRowKeys?.length < 1}
        >
          Delete Selected Questions
        </Button>

        <Button
          className=""
          onClick={() => handleAddQuestionsToQuestionnaireModalOpen()}
          type="primary"
        >
          <AddRounded /> Add Question to Questionnaire
        </Button>
      </div>
    </div>
  );
  useEffect(() => {
    if (getQuestionData && currentQuestionnaireData) {
      const filteredQuestions = getQuestionData.filter(
        (question) =>
          !currentQuestionnaireData.questions.some(
            (existingQuestion) => existingQuestion.id === question.id
          )
      );
      setFilteredQuestionsData(filteredQuestions);
    }
  }, [getQuestionData, currentQuestionnaireData]);

  useEffect(() => {
    if (editQuestionnaireData) {
      setAddQuestionModalVisible(false);
      getQuestion();
      onEditQuestionnaire();
      resetEditQuestionnaireState();
    }
  }, [editQuestionnaireData]);

  useEffect(() => {
    if (deleteQuestionInQuestionnaireData) {
      setDeleteModalVisible(false);
      onEditBack();
      resetDeleteQuestionInQuestionnaireState();
    }
  }, [deleteQuestionInQuestionnaireData]);

  return (
    <>
      <Header>
        <div className="flex items-center">
          <CloseOutlined 
            className="mr-4 cursor-pointer"
            onClick={onEditBack}
          />
          <div>Editing {currentQuestionnaireData?.name}</div>
        </div>
      </Header>{" "}
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
          dataSource={searchedData || currentQuestionnaireData?.questions}
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
          title={`Select Questions to Add to Questionnaire`}
          open={addQuestionModalVisible}
          onOk={handleAddQuestionsToQuestionnaire}
          onCancel={() => handleAddModalCancel()}
          okText="Confirm"
          className="lg:!w-[1000px] md:!w-[600px] sm:!w-[400px]"
          confirmLoading={editQuestionnaireLoading}
        >
          <div className="overflow-y-auto custom-scrollbar max-h-[600px] m-4">
            <Input
              placeholder="Search..."
              value={searchTextInsideModal}
              onChange={(event) => handleSearchInsideModal(event.target.value)}
              prefix={<SearchOutlined style={{ color: "gray" }} />}
              suffix={
                searchTextInsideModal && (
                  <CloseCircleOutlined
                    style={{ color: "gray", cursor: "pointer" }}
                    onClick={clearSearchInsideModal}
                  />
                )
              }
              className="!w-[250px] mt-2 ml-2"
            />

            <Table
              className="mt-4"
              columns={columns}
              dataSource={searchedDataInsideModal || filteredQuestionsData}
              pagination={{ pageSize: 10 }}
              rowKey="id"
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedRowKeys,
                onChange: handleSelectChangeInsideModal,
              }}
            />
          </div>
        </Modal>

        <Modal
          title="Delete Selected Questions From Questionnaire"
          open={deleteModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={() => setDeleteModalVisible(false)}
          okText="Yes"
          confirmLoading={deleteQuestionInQuestionnaireLoading}
        >
          Are You sure you want to delete these questions from questionnaire ?
        </Modal>
      </div>
    </>
  );
};
