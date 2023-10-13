import { useEffect, useState } from "react";
import React from "react";
import { Header } from "../../components/header/Header";
import { Button, Input, Table, Menu, Dropdown, Modal, Form, Spin } from "antd";
import { AddRounded, SearchOutlined } from "@mui/icons-material";
import { useGetApi } from "../../hooks/useGetApi";
import { usePostApi } from "../../hooks/usePostApi";
import { usePutApi } from "../../hooks/usePutApi";
import { useDeleteApi } from "../../hooks/useDeleteApi";
import { CloseCircleOutlined } from "@ant-design/icons";
import { MoreOutlined } from "@ant-design/icons";

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

export const Competencies = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedData, setSearchedData] = useState(null);
  const [addEditDeleteCompetencyData, setAddEditDeleteCompetencyData] =
    useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const {
    data: createCompetencyData,
    isLoading: createCompetencyLoading,
    postData: createCompetency,
    resetState: resetCreateCompetencyState,
  } = usePostApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/create-competency/`
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
    data: editCompetencyData,
    isLoading: editCompetencyLoading,
    error: editCompetencyError,
    putData: editCompetency,
    resetState: resetEditCompetencyState,
  } = usePutApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/edit-competency/`
  );

  const {
    data: deleteCompetencyData,
    isLoading: deleteCompetencyLoading,
    error: deleteCompetencyError,
    deleteData: deleteCompetency,
    resetState: resetDeleteCompetencyState,
  } = useDeleteApi(
    `${process.env.REACT_APP_BASE_URL}/assessmentApi/delete-competency/`
  );

  const handleSearch = (searchText) => {
    setSearchText(searchText);
    if (!searchText) {
      setSearchedData(null);
    } else {
      const searchData = getCompetencyData?.filter((competency) =>
        competency?.name?.toLowerCase()?.includes(searchText?.toLowerCase())
      );
      setSearchedData(searchData);
    }
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchedData(null);
  };

  const handleEdit = (competency) => {
    setAddEditDeleteCompetencyData(competency);
    setEditModalVisible(true);
  };

  const handleAdd = () => {
    setAddEditDeleteCompetencyData(null);
    setAddModalVisible(true);
  };

  const handleAddEditModalConfirm = () => {
    if (editModalVisible) {
      editCompetency(addEditDeleteCompetencyData);
    } else if (addModalVisible) {
      createCompetency(addEditDeleteCompetencyData);
    }
  };

  const handleDelete = (competency) => {
    setAddEditDeleteCompetencyData(competency);
    setDeleteModalVisible(true);
  };

  const handleAddEditModalCancel = () => {
    setEditModalVisible(false);
    setAddModalVisible(false);
  };

  const handleDeleteConfirm = () => {
    deleteCompetency(addEditDeleteCompetencyData);
  };

  const columns = [
    {
      title: "Competency Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created on",
      dataIndex: "created_on",
      key: "created_on",
      render: (created_on) => {
        return <>{formatTimestamp(created_on)}</>;
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, competency) => {
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(competency)}>
              <span>Edit</span>
            </Menu.Item>
            <Menu.Item key="delete" onClick={() => handleDelete(competency)}>
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
    if (createCompetencyData) {
      setAddModalVisible(false);
      getCompetency();
      resetCreateCompetencyState();
    }
  }, [createCompetencyData]);

  useEffect(() => {
    if (editCompetencyData) {
      setEditModalVisible(false);
      getCompetency();
      resetEditCompetencyState();
    }
  }, [editCompetencyData]);

  useEffect(() => {
    if (deleteCompetencyData) {
      setDeleteModalVisible(false);
      getCompetency();
      resetDeleteCompetencyState();
    }
  }, [deleteCompetencyData]);

  if (getCompetencyLoading) {
    return <Spin />;
  } else {
    return (
      <>
        <Header>
          <div className="flex justify-between">
            All Competencies
            <div className="text-right">
              <Button
                className="mr-2"
                onClick={() => handleAdd()}
                type="primary"
              >
                <AddRounded />
                New Compentency
              </Button>
            </div>
          </div>
        </Header>
        <div className="m-4">
          <div className="">
            <Input
              placeholder="Competency Name Search..."
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
            dataSource={searchedData || getCompetencyData}
            pagination={{ pageSize: 10 }}
          />
          <Modal
            title={editModalVisible ? "Edit Competency" : "Add New Competency"}
            open={editModalVisible || addModalVisible}
            onOk={handleAddEditModalConfirm}
            onCancel={() => handleAddEditModalCancel()}
            okText="Confirm"
            confirmLoading={editCompetencyLoading || createCompetencyLoading}
          >
            <p>Enter Competency name:</p>
            <Input
              value={addEditDeleteCompetencyData?.name}
              onChange={(e) =>
                setAddEditDeleteCompetencyData({
                  ...addEditDeleteCompetencyData,
                  name: e.target.value,
                })
              }
            />
          </Modal>
          <Modal
            title="Delete Competency"
            open={deleteModalVisible}
            onOk={handleDeleteConfirm}
            onCancel={() => setDeleteModalVisible(false)}
            okText="Yes"
            confirmLoading={deleteCompetencyLoading}
          >
            Are you sure you want to delete{" "}
            <strong>{addEditDeleteCompetencyData?.name}</strong> Competency ?
          </Modal>
        </div>
      </>
    );
  }
};
