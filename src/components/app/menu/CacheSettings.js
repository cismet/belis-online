import { faDownload, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { useWindowSize } from "@react-hook/window-size";
import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { getJWT, getLoginFromJWT } from "../../../core/store/slices/auth";
import {
  fillCacheInfo,
  getCacheSettings,
  isCacheFullUsable,
  renewAllSecondaryInfoCache,
  renewCache,
  setCacheUser,
} from "../../../core/store/slices/cacheControl";
import { forceRefresh } from "../../../core/store/slices/featureCollection";
import AggregatedCacheItem from "../../app/cache/AggregatedCacheItem";
import CacheItem from "../../app/cache/CacheItem";

const CacheSettings = () => {
  const dispatch = useDispatch();
  const cacheSettings = useSelector(getCacheSettings);
  const cacheReady = useSelector(isCacheFullUsable);
  const cacheReadyRef = React.useRef();
  useEffect(() => {
    cacheReadyRef.current = cacheReady;
  }, [cacheReady]);

  const jwt = useSelector(getJWT);
  // console.log("jwt", jwt);

  useEffect(() => {
    dispatch(fillCacheInfo());
  }, []);
  const [width, height] = useWindowSize();

  const modalBodyStyle = {
    zIndex: 30000000,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: height - 250,
    width: "100%",
  };

  let secondarySettings = [];
  Object.keys(cacheSettings)
    .filter((key) => cacheSettings[key].primary === undefined)
    .forEach((secondaryKey) => {
      secondarySettings.push(cacheSettings[secondaryKey]);
    });
  let primarySettings = [];
  Object.keys(cacheSettings)
    .filter((key) => cacheSettings[key].primary === true)
    .forEach((primaryKey) => {
      primarySettings.push(cacheSettings[primaryKey]);
    });

  return (
    <div style={{ marginBottom: 5 }}>
      <div>
        <Button
          style={{ margin: 3 }}
          variant='outline-primary'
          size='sm'
          onClick={() => {
            dispatch(renewAllSecondaryInfoCache(jwt));
            let index = 0;
            for (const setting of [...primarySettings]) {
              setTimeout(() => {
                dispatch(renewCache(setting.key, jwt));
              }, 100 + 10 * index++);
            }
            dispatch(setCacheUser(getLoginFromJWT(jwt)));

            const refreshChecker = setInterval(() => {
              if (cacheReadyRef.current === true) {
                clearInterval(refreshChecker);
                dispatch(forceRefresh());
              } else {
                console.log("wait");
              }
            }, 100);
          }}
        >
          <Icon icon={faDownload} /> Kompletten Cache neu füllen
        </Button>

        <Button disabled style={{ margin: 3 }} variant='outline-success' size='sm'>
          <Icon icon={faSync} /> Nur neue Objekte laden
        </Button>
      </div>
      <table
        border={0}
        style={{
          width: "100%",
          padding: 3,
        }}
      >
        <tbody>
          <tr>
            <td />
            <td
              style={{
                textAlign: "right",
                paddingLeft: "25px",
                paddingRight: "15px",
                whiteSpace: "nowrap",
              }}
            >
              # Objekte
            </td>
            <td>Name</td>
            <td
              style={{
                width: 120,
                paddingLeft: "25px",
                paddingRight: "25px",
                whiteSpace: "nowrap",
              }}
            >
              letzte Aktualisierung
            </td>
          </tr>
          {Object.keys(cacheSettings).map((key, index) => {
            if (cacheSettings[key].primary === true) {
              return (
                <CacheItem
                  key={"CacheItem." + index}
                  control={cacheSettings[key]}
                  renew={() => {
                    console.log("renew");

                    dispatch(renewCache(key, jwt));
                  }}
                />
              );
            }
          })}
          <AggregatedCacheItem
            controls={secondarySettings}
            renew={(key) => {
              dispatch(renewCache(key, jwt));
            }}
          />

          {/* <CacheItem
								control={cacheSettings.mauerlasche}
								renew={() => {
									console.log('renew');

									dispatch(renewCache('mauerlasche'));
								}}
							/> */}
        </tbody>
      </table>
    </div>
  );
};

export default CacheSettings;
