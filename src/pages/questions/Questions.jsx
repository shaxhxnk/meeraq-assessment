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
  Spin,
} from "antd";
import { AddRounded, SearchOutlined } from "@mui/icons-material";
import { useGetApi } from "../../hooks/useGetApi";
import { usePostApi } from "../../hooks/usePostApi";
import { usePutApi } from "../../hooks/usePutApi";
import { useDeleteApi } from "../../hooks/useDeleteApi";
import { CloseCircleOutlined } from "@ant-design/icons";
import { MoreOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

export const Questions = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [addEditDeleteQuestionData, setAddEditDeleteQuestionData] =
    useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const {
    data: createQuestionData,
    isLoading: createQuestionLoading,
    postData: createQuestion,
    resetState: resetCreateQuestionState,
  } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/create-question/`
  );

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
    data: editQuestionData,
    isLoading: editQuestionLoading,
    error: editQuestionError,
    putData: editQuestion,
    resetState: resetEditQuestionState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/edit-question/`
  );

  const {
    data: deleteQuestionData,
    isLoading: deleteQuestionLoading,
    error: deleteQuestionError,
    deleteData: deleteQuestion,
    resetState: resetDeleteQuestionState,
  } = useDeleteApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/delete-question/`
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

  const handleAdd = () => {
    setAddEditDeleteQuestionData(null);
    setAddModalVisible(true);
  };

  const handleEdit = (question) => {
    setAddEditDeleteQuestionData(question);
    setEditModalVisible(true);
  };

  const handleDelete = (question) => {
    setAddEditDeleteQuestionData(question);
    setDeleteModalVisible(true);
  };

  const handleAddEditModalConfirm = () => {
    if (editModalVisible) {
      editQuestion(addEditDeleteQuestionData);
    } else if (addModalVisible) {
      createQuestion(addEditDeleteQuestionData);
    }
  };

  const handleAddEditModalCancel = () => {
    setEditModalVisible(false);
    setAddModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    deleteQuestion(addEditDeleteQuestionData);
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
    {
      title: "Action",
      key: "action",
      render: (_, question) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(question)}>
              <span>Edit</span>
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(question)}>
              <span>Delete</span>
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button onClick={(e) => e.preventDefault()}>
              <MoreOutlined />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  useEffect(() => {
    if (createQuestionData) {
      setAddModalVisible(false);
      getQuestion();
      resetCreateQuestionState();
    }
  }, [createQuestionData]);

  useEffect(() => {
    if (editQuestionData) {
      setEditModalVisible(false);
      getQuestion();
      resetEditQuestionState();
    }
  }, [editQuestionData]);

  useEffect(() => {
    if (deleteQuestionData) {
      setDeleteModalVisible(false);
      getQuestion();
      resetDeleteQuestionState();
    }
  }, [deleteQuestionData]);

  if (getQuestionLoading) {
    return <Spin />;
  } else {
    return (
      <>
        <Header>
          <div className="flex justify-between items-center">
            All Questions
            <div className="text-right">
              <Button
                className=" mr-2"
                onClick={() => handleAdd()}
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
          />
          <Modal
            title={editModalVisible ? "Edit Question" : "Add New Question"}
            open={editModalVisible || addModalVisible}
            onOk={handleAddEditModalConfirm}
            onCancel={() => handleAddEditModalCancel()}
            okText="Confirm"
            confirmLoading={editQuestionLoading}
          >
            <div className="flex flex-col space-y-4">
              <div className="space-y-2">
                <label className="font-bold">Self Question:</label>
                <TextArea
                  value={addEditDeleteQuestionData?.self_question}
                  onChange={(e) =>
                    setAddEditDeleteQuestionData({
                      ...addEditDeleteQuestionData,
                      self_question: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold">Observer Question:</label>
                <TextArea
                  value={addEditDeleteQuestionData?.observer_question}
                  onChange={(e) =>
                    setAddEditDeleteQuestionData({
                      ...addEditDeleteQuestionData,
                      observer_question: e.target.value,
                    })
                  }
                  className="p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold">Competency:</label>
                <Select
                  value={addEditDeleteQuestionData?.competency?.id}
                  onChange={(value) =>
                    setAddEditDeleteQuestionData({
                      ...addEditDeleteQuestionData,
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
          <Modal
            title="Delete Competency"
            open={deleteModalVisible}
            onOk={handleDeleteConfirm}
            onCancel={() => setDeleteModalVisible(false)}
            okText="Yes"
            confirmLoading={deleteQuestionLoading}
          >
            Are you sure you want to delete this Question ?
          </Modal>
        </div>
      </>
    );
  }
};
