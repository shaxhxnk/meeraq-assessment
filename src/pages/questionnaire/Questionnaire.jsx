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
import { AddQuestionnaire } from "./AddQuestionnaire";
import { EditQuestionnaire } from "./EditQuestionnaire";
import { ViewQuestionnaires } from "./ViewQuestionnaires";

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export const Questionnaire = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [currentQuestionnaireData, setCurrentQuestionnaireData] =
    useState(null);
  const [editQuestionnaire, setEditQuestionnaire] = useState(false);
  const [addQuestionnaireModal, setAddQuestionnaireModal] = useState(false);
  const [addQuestionnaire, setAddQuestionnaire] = useState(false);
  const [deleteQuestionnaireModal, setDeleteQuestionnaireModal] =
    useState(false);
  const [viewQuestionnaire, setViewQuestionnaire] = useState(false);

  const {
    data: getQuestionnaireData,
    isLoading: getQuestionnaireLoading,
    error: getQuestionnaireError,
    getData: getQuestionnaire,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-questionnaires/`
  );

  const {
    data: deleteQuestionnaireData,
    isLoading: deleteQuestionnaireLoading,
    error: deleteQuestionnaireError,
    deleteData: deleteQuestionnaire,
    resetState: resetDeleteQuestionnaireState,
  } = useDeleteApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/delete-questionnaire/`
  );

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

  const handleAdd = () => {
    setAddQuestionnaireModal(true);
  };

  const handleAddConfirm = () => {
    setAddQuestionnaire(true);
    setAddQuestionnaireModal(false);
  };

  const handleEdit = (questionnaire) => {
    setCurrentQuestionnaireData(questionnaire);
    setEditQuestionnaire(true);
  };

  const handleDelete = (questionnaire) => {
    setCurrentQuestionnaireData(questionnaire);
    setDeleteQuestionnaireModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteQuestionnaire(currentQuestionnaireData);
  };
  const onCreateQuestionnaire = () => {
    setCurrentQuestionnaireData(null);
    setAddQuestionnaire(false);
    getQuestionnaire();
  };

  const onEditQuestionnaire = () => {
    onEditBack();
  };

  const onEditBack = () => {
    setCurrentQuestionnaireData(null);
    setEditQuestionnaire(false);
    getQuestionnaire();
    clearSearch();
  };

  const handleViewQuestionnaire = (questionnaire) => {
    setCurrentQuestionnaireData(questionnaire);
    setViewQuestionnaire(true);
  };

  const onViewBack = () => {
    setCurrentQuestionnaireData(null);
    setViewQuestionnaire(false);
  };
  const handleEditFromView = (questionnaire) => {
    onViewBack();
    setCurrentQuestionnaireData(questionnaire);
    setEditQuestionnaire(true);
  };
  const columns = [
    {
      title: "Questionnaire Name",
      dataIndex: "name",
      key: "name",
      render: (name, questionnaire) => {
        return (
          <div className="flex items-center space-x-2">
            <div className="">
              <FileTextOutlined />
            </div>
            <div
              onClick={() => handleViewQuestionnaire(questionnaire)}
              className="cursor-pointer hover:text-primary-1 text-primary-2"
            >
              {name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Created on",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => {
        return <>{formatTimestamp(created_at)}</>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, questionnaire) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(questionnaire)}>
              <span>Edit</span>
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(questionnaire)}>
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
    if (deleteQuestionnaireData) {
      setDeleteQuestionnaireModal(false);
      getQuestionnaire();
      resetDeleteQuestionnaireState();
    }
  }, [deleteQuestionnaireData]);

  const questionnairesList = (
    <>
      <Header>
        <div className="flex justify-between">
          All Questionnaires
          <div className="text-right">
            <Button
              className=" mr-2"
              onClick={() => handleAdd()}
              type="primary"
            >
              <AddRounded />
              New Questionnaire
            </Button>
          </div>
        </div>
      </Header>
      <div className="m-4">
        <div className="">
          <Input
            placeholder="Questionnaire Name Search..."
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
            className="!w-[260px] mt-2 ml-2"
          />
        </div>

        <Table
          className="mt-4"
          columns={columns}
          dataSource={searchedData || getQuestionnaireData}
          pagination={{ pageSize: 10 }}
        />

        <Modal
          title={"Add New Questionnaire"}
          open={addQuestionnaireModal}
          onOk={handleAddConfirm}
          onCancel={() => setAddQuestionnaireModal(false)}
          okText="Confirm"
        >
          <p>Enter Questionnaire name:</p>
          <Input
            value={currentQuestionnaireData?.name}
            onChange={(e) =>
              setCurrentQuestionnaireData({
                ...currentQuestionnaireData,
                name: e.target.value,
              })
            }
          />
        </Modal>
        <Modal
          title="Delete Questionnaire"
          open={deleteQuestionnaireModal}
          onOk={handleDeleteConfirm}
          onCancel={() => setDeleteQuestionnaireModal(false)}
          okText="Yes"
          confirmLoading={deleteQuestionnaireLoading}
        >
          Are you sure you want to delete{" "}
          <strong>{currentQuestionnaireData?.name}</strong> Questionnaire ?
        </Modal>
      </div>
    </>
  );

  return (
    <>
      {addQuestionnaire ? (
        <AddQuestionnaire
          currentQuestionnaireData={currentQuestionnaireData}
          onCreateQuestionnaire={onCreateQuestionnaire}
        />
      ) : editQuestionnaire ? (
        <EditQuestionnaire
          currentQuestionnaireData={currentQuestionnaireData}
          onEditQuestionnaire={onEditQuestionnaire}
          onEditBack={onEditBack}
        />
      ) : viewQuestionnaire ? (
        <ViewQuestionnaires
          currentQuestionnaireData={currentQuestionnaireData}
          onViewBack={onViewBack}
          handleEditFromView={handleEditFromView}
        />
      ) : (
        questionnairesList
      )}
    </>
  );
};
