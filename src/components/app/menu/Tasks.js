import { useEffect, useState } from "react";

import dexieworker from "workerize-loader!../../../core/workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getTeam, setTeam } from "../../../core/store/slices/team";
import { getDB } from "../../../core/store/slices/offlineDb";
import { actionSchema } from "../../../core/commons/schema";
import { getLogin } from "../../../core/store/slices/auth";
import { Table } from "antd";
const Tasks = () => {
  const dexieW = dexieworker();
  const dispatch = useDispatch();
  const offlineDb = useSelector(getDB);
  const login = useSelector(getLogin);
  console.log("offlineDb", offlineDb);

  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    try {
      const query = offlineDb.actions
        .find()
        .where("applicationId")
        .eq(login + "@belis")
        .sort({ createdAt: "desc" });
      query.$.subscribe((results) => {
        const tasks = [];
        for (const result of results) {
          const task = {};
          for (const key of Object.keys(actionSchema.properties)) {
            task[key] = result[key];
          }
          tasks.push(task);
        }

        setTasks(tasks);
      });
    } catch (e) {
      console.log("Error in fetching tasks");
    }
  }, []);

  const columns = [
    { title: "Typ", dataIndex: "action", key: "action" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "angelegt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
    },
    {
      title: "abgearbeitet",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
    },
    {
      title: "fertig",
      dataIndex: "isCompleted",
      key: "isCompleted",
      render: (isCompleted) => (isCompleted === true ? "Ja" : "Nö"),
    },
  ];
  console.log("tasks ", tasks);

  return (
    <div>
      <Table dataSource={tasks} columns={columns} />
    </div>
  );
};

export default Tasks;
