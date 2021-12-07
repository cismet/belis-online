import { useEffect, useState } from "react";

import dexieworker from "workerize-loader!../../../core/workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
// import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getTeam, setTeam } from "../../../core/store/slices/team";
import { getDB } from "../../../core/store/slices/offlineActionDb";
import { actionSchema } from "../../../core/commons/schema";
import { getLogin } from "../../../core/store/slices/auth";
import { getTaskForAction } from "../../../core/commons/taskHelper";
import { Card, Button, Table, Typography } from "antd";
const Tasks = () => {
  const dexieW = dexieworker();
  const dispatch = useDispatch();
  const offlineActionDb = useSelector(getDB);
  const login = useSelector(getLogin);
  const [showAll, setShowAll] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [shownTasks, setShownTasks] = useState([]);

  useEffect(() => {
    try {
      const query = offlineActionDb.actions
        .find()
        .where("applicationId")
        .eq(login + "@belis")
        .sort({ createdAt: "desc" });
      query.$.subscribe((results) => {
        console.log("results", results);

        const tasks = [];
        for (const result of results) {
          const task = getTaskForAction(result);
          console.log("result.deleted", result.deleted);

          tasks.push(task);
        }
        setTasks(tasks);
      });
    } catch (e) {
      console.log("Error in fetching tasks");
    }
  }, []);

  useEffect(() => {
    let results;

    if (showAll) {
      results = tasks;
    } else {
      const now = new Date().getTime();

      results = tasks.filter((result) => {
        return (
          result.statusCode !== 200 ||
          now - new Date(result.datum).getTime() < 1000 * 60 * 60 * 24 * 3
        ); // 3 day
      });
    }
    setShownTasks(results);
  }, [showAll, tasks]);

  const iconSize = 23;
  const columns = [
    {
      title: "Aktion",
      dataIndex: "aktion",
      key: "aktion",
      align: "center",
      render: (x) => (
        <Typography.Text style={{ fontSize: iconSize, color: "grey" }}>{x}</Typography.Text>
      ),
    },

    {
      title: "Datum",
      dataIndex: "datum",
      key: "datum",
      render: (date) => new Date(date).toLocaleString(),
    },
    { title: "Fachobjekt", dataIndex: "fachobjekt", key: "fachobjekt" },
    { title: "Beschreibung", dataIndex: "beschreibung", key: "beschreibung" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (x, record) => <Typography.Text style={{ fontSize: iconSize }}>{x}</Typography.Text>,
    },
  ];

  return (
    <div>
      {showAll && (
        <Button style={{ float: "right", marginBottom: 10 }} onClick={() => setShowAll(!showAll)}>
          Nur Fehler und letzte Aktionen anzeigen
        </Button>
      )}
      {!showAll && (
        <Button style={{ float: "right", marginBottom: 10 }} onClick={() => setShowAll(!showAll)}>
          Alle Aktionen anzeigen
        </Button>
      )}
      <Table key={"table." + showAll} dataSource={shownTasks} columns={columns} />
    </div>
  );
};

export default Tasks;
