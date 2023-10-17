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
} from "antd";
import { AddRounded, SearchOutlined } from "@mui/icons-material";
import { useGetApi } from "../../hooks/useGetApi";
import { usePostApi } from "../../hooks/usePostApi";
import { usePutApi } from "../../hooks/usePutApi";
import { useDeleteApi } from "../../hooks/useDeleteApi";
import { CloseCircleOutlined } from "@ant-design/icons";
import { MoreOutlined } from "@ant-design/icons";
import { formatTimestamp } from "../../utils/convertSlotToString";
import { CreateAssessment } from "./CreateAssessment";

const categories = {
  draft: "Draft",
  ongoing: "Ongoing",
  completed: "Completed",
};

export const Assessments = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("ongoing");
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [newAssessment, setNewAssessment] = useState(false);

  const {
    data: getAssessmentData,
    isLoading: getAssessmentLoading,
    error: getAssessmentError,
    getData: getAssessment,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/get-assessments/`
  );

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = filteredAssessments?.filter((assessment) =>
        assessment?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };

  const handleAddNewAssessment = () => {
    setNewAssessment(true);
  };
  const handleEdit = () => {};

  const handleDelete = () => {};

  const onBackNewAssessment = () => {
    setNewAssessment(false);
    getAssessment();
  };
  useEffect(() => {
    const filteredAssessments = getAssessmentData?.filter((assessment) => {
      return assessment.status === selectedCategory;
    });

    setFilteredAssessments(filteredAssessments);
  }, [getAssessmentData, selectedCategory]);

  const columns = [
    {
      title: "Assessment Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Assessment Type",
      dataIndex: "assessment_type",
      key: "assessment_type",
      render: (assessment_type) => {
        return <>{assessment_type} Assessment</>;
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        return <>1/4 Responded</>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, assessment) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(assessment)}>
              <span>Edit</span>
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(assessment)}>
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
  if (getAssessmentLoading) {
    return <Spin />;
  } else if (newAssessment) {
    return <CreateAssessment onBackNewAssessment={onBackNewAssessment} />;
  } else {
    return (
      <>
        <Header>
          <div className="flex justify-between">
            All Assessment
            <div className="text-right">
              <Button
                className="mr-2"
                onClick={() => handleAddNewAssessment()}
                type="primary"
              >
                <AddRounded />
                New Assessment
              </Button>
            </div>
          </div>
        </Header>
        <div className="m-4">
          <div className="flex justify-between mr-6">
            <div className="justify-start items-start  flex ">
              {Object.keys(categories).map((category, index) => {
                const categoryCount = getAssessmentData?.filter(
                  (assessment) => assessment.status === category
                ).length;

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex p-2 ml-2 justify-center items-center space-x-4 rounded-lg border cursor-pointer shadow-md ${
                      selectedCategory === category
                        ? "border-primary-1 bg-primary-4"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {`${categories[category]} (${categoryCount})`}
                  </div>
                );
              })}
            </div>
            <div>
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
                className="!w-[250px] mt-2 ml-2"
              />
            </div>
          </div>
          <Table
            className="mt-4"
            columns={columns}
            dataSource={searchedData || filteredAssessments}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </>
    );
  }
};
