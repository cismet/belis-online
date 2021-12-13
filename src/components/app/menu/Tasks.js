import { Button, Table, Typography } from "antd";
import { useEffect, useState } from "react";
// import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getLogin } from "../../../core/store/slices/auth";
import { getDB, getTasks } from "../../../core/store/slices/offlineActionDb";

const Tasks = () => {
  const dispatch = useDispatch();
  const offlineActionDb = useSelector(getDB);
  const tasks = useSelector(getTasks);
  const login = useSelector(getLogin);
  const [showAll, setShowAll] = useState(false);
  const [shownTasks, setShownTasks] = useState([]);

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
