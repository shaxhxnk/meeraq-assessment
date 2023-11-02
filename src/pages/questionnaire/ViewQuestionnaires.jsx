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
import { ArrowLeftOutlined } from "@ant-design/icons";


export const ViewQuestionnaires = ({
  currentQuestionnaireData,
  onViewBack,
  handleEditFromView
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);

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

  return (
    <>
      <Header>
        <div className="flex justify-between">
          <div className="flex items-center">
            <ArrowLeftOutlined
              className="mr-4 cursor-pointer"
              onClick={onViewBack}
            />
            <div>{currentQuestionnaireData?.name}</div>
          </div>
          <div className="text-right">
            <Button
              className=" mr-2"
              onClick={() => handleEditFromView(currentQuestionnaireData)}
           
            >
              Edit Questionnaire
            </Button>
          </div>
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
        />
      </div>
    </>
  );
};
