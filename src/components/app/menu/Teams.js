import { useEffect, useState } from "react";

import dexieworker from "workerize-loader!../../../core/workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getTeam, setTeam } from "../../../core/store/slices/team";

const Teams = () => {
  const dexieW = dexieworker();
  const dispatch = useDispatch();
  const selectedTeam = useSelector(getTeam);
  const [teams, setTeams] = useState([]);
  useEffect(() => {
    //async block
    (async () => {
      try {
        const teams = await dexieW.getAll("team");

        if (teams) {
          setTeams(teams);
        }
      } catch (e) {
        console.log("Error in fetching teams");
      }
    })();
  }, []);

  return (
    <div>
      Bitte wählen Sie das gewünschte Team per Klick auf den Button:
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {teams &&
          teams.map((team, index) => {
            if (selectedTeam?.id === team.id) {
              return (
                <span key={"buttonspan." + index} style={{ padding: 3 }}>
                  <Button disabled variant='primary' key={team + index}>
                    {team.name}
                  </Button>
                </span>
              );
            } else {
              return (
                <span key={"buttonspan." + index} style={{ padding: 3 }}>
                  <Button
                    onClick={() => {
                      dispatch(setTeam(team));
                    }}
                    variant='outline-primary'
                    key={team + index}
                  >
                    {team.name}
                  </Button>
                </span>
              );
            }
          })}
      </div>
    </div>
  );
};

export default Teams;
