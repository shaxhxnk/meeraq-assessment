import { useEffect, useState } from "react";
import { Header } from "../../components/header/Header";
import { formatTimestamp } from "../../utils/convertSlotToString";
import { FileTextOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input, Modal, Table } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@mui/icons-material";
import { useGetApi } from "../../hooks/useGetApi";
import { useSelector } from "react-redux";

export const ObserversAssessment = () => {
  const location = useLocation();
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [startModalVisible, setStartModalVisible] = useState(false);
  const [observerEmail, setObserverEmail] = useState(
    location?.state?.email ? location?.state?.email : null
  );
  const [currentAssessmentData, setCurrentAssessmentData] = useState(null);
  const navigate = useNavigate();
  const {
    data: getAssessmentData,
    isLoading: getAssessmentLoading,
    error: getAssessmentError,
    getData: getAssessment,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/observer-assessment/${observerEmail}`
  );

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

  const handleStartAssessmentConfirm = () => {
    // navigate("/meeraq/assessment", { state: { currentAssessmentData } });
  };

  const columns = [
    {
      title: "Assessment Name",
      dataIndex: "name",
      key: "name",
      render: (name, assessment) => {
        return (
          <div className="flex items-center space-x-2">
            <div className="">
              <FileTextOutlined />
            </div>
            <div className="cursor-pointer hover:text-primary-1 text-primary-2">
              {name}
            </div>
          </div>
        );
      },
    },
    {
      title: "Assessment Type",
      dataIndex: "assessment_type",
      key: "assessment_type",
      render: (assessment_type) => {
        return <div className="capilatize">{assessment_type} Assessment</div>;
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
      title: " ",
      key: "action",
      render: (_, assessment) => {
        return (
          <>
            <Button
              onClick={() => {
                setStartModalVisible(true);
                setCurrentAssessmentData(assessment);
              }}
            >
              Start
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="m-4 bg-white">
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
        <Table
          className="mt-4"
          columns={columns}
          dataSource={searchedData || getAssessmentData}
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title="Confirm Start Assessment"
          open={startModalVisible}
          onOk={handleStartAssessmentConfirm}
          onCancel={() => setStartModalVisible(false)}
          okText="Yes"
        >
          Are you sure you want to start{" "}
          <strong>{currentAssessmentData?.name}</strong> Assessment ?
        </Modal>
      </div>
    </>
  );
};
