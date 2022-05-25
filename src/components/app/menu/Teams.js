import { useEffect, useState } from "react";

// import dexieworker from "workerize-loader!../../../core/workers/dexie"; // eslint-disable-line import/no-webpack-loader-syntax
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getJWT } from "../../../core/store/slices/auth";
import { renewCache } from "../../../core/store/slices/cacheControl";
import { getWorker } from "../../../core/store/slices/dexie";
import { getTeam, setTeam } from "../../../core/store/slices/team";

const Teams = () => {
  // const dexieW = dexieworker();
  const dispatch = useDispatch();
  const selectedTeam = useSelector(getTeam);
  const dexieW = useSelector(getWorker);
  const [teams, setTeams] = useState([]);
  const jwt = useSelector(getJWT);
  useEffect(() => {
    //async block
    (async () => {
      try {
        const teams = await dexieW.getAll("team");
        if (teams && teams.length > 0) {
          setTeams(teams);
        } else {
          dispatch(renewCache("team", jwt));
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
