import { useWindowSize } from "@react-hook/window-size";
import localforage from "localforage";
import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import IconComp from "react-cismap/commons/Icon";
import { CACHE_JWT } from "react-cismap/tools/fetching";
import { useDispatch, useSelector } from "react-redux";
import { getLogin, storeJWT, storeLogin } from "../../core/store/slices/auth";
import { initialize as initializeOfflineDB } from "../../core/store/slices/offlineDb";
import { DOMAIN, REST_SERVICE } from "../../constants/belis";
const LoginForm = ({
  setJWT = (jwt) => {
    console.log("you need to set the attribute setJWT in the <Login> component", jwt);
  },
  loginInfo,
  setLoginInfo = () => {},
  setLoggedOut,
}) => {
  const dispatch = useDispatch();

  const [windowWidth, windowHeight] = useWindowSize();
  const pwFieldRef = useRef();
  const userFieldRef = useRef();
  const storedLogin = useSelector(getLogin);

  const _height = windowHeight || 800 - 180;
  const modalBodyStyle = {
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: _height,
  };

  const productionMode = process.env.NODE_ENV === "production";

  useEffect(() => {
    (async () => {
      try {
        const result = await fetch("devSecrets.json");
        const cheats = await result.json();
        console.log("x", cheats);
        if (cheats.cheatingUser) {
          setUser(cheats.cheatingUser);
        }
        if (cheats.cheatingPassword) {
          setPw(cheats.cheatingPassword);
        }
      } catch (e) {
        console.log("no devSecrets.json found");
      }
    })();
  }, [productionMode]);

  const [user, _setUser] = useState(storedLogin);
  const [pw, setPw] = useState("");
  const [cacheDataAvailable, setCacheDataAvailable] = useState(false);

  window.localforage = localforage;
  const setUser = (user) => {
    // eslint-disable-next-line
    //    localforage.setItem("@" + appKey + "." + "auth" + "." + "user", user);
    _setUser(user);
  };

  /*eslint no-useless-concat: "off"*/
  const login = () => {
    fetch(REST_SERVICE + "/users", {
      method: "GET",
      headers: {
        Authorization: "Basic " + btoa(user + "@" + DOMAIN + ":" + pw),
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.status >= 200 && response.status < 300) {
          response.json().then(function (responseWithJWT) {
            const jwt = responseWithJWT.jwt;
            setLoginInfo({
              color: "#79BD9A",
              text: "Anmeldung erfolgreich. Daten werden geladen.",
            });
            setTimeout(() => {
              dispatch(storeJWT(jwt));
              dispatch(storeLogin(user));
              setJWT(jwt);
              setLoggedOut(false);
              setLoginInfo();
              // initializeOfflineDB(jwt, dispatch);
            }, 500);
          });
        } else {
          setLoginInfo({
            color: "#FF8048",
            text: "Bei der Anmeldung ist ein Fehler aufgetreten. ",
          });
          setTimeout(() => {
            setLoginInfo();
          }, 2500);
        }
      })
      .catch(function (err) {
        setLoginInfo({ color: "#FF3030", text: "Bei der Anmeldung ist ein Fehler aufgetreten." });
        setTimeout(() => {
          setLoginInfo();
        }, 2500);
      });
  };

  return (
    <Modal
      style={{
        zIndex: 3000000000,
      }}
      height='100%'
      size='l'
      show={true}
      //   onHide={close}
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <div>
            <div>
              <IconComp name={"user"} /> Anmeldung
            </div>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle} id='potenzialflaechen-online' key='login'>
        <Form>
          <Form.Group controlId='potenzialflaechen-online-login'>
            <Form.Label>WuNDa Benutzername</Form.Label>
            <Form.Control
              value={user}
              ref={userFieldRef}
              onChange={(e) => {
                setUser(e.target.value);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  // login();
                  if (pwFieldRef.current) {
                    pwFieldRef.current.focus();
                  }
                }
              }}
              placeholder='Login hier eingeben'
            />
            {/* <Form.Text className='text-muted'>
              We'll never share your email with anyone else.
            </Form.Text> */}
          </Form.Group>

          <Form.Group controlId='potenzialflaechen-online-pass'>
            <Form.Label>Passwort</Form.Label>
            <Form.Control
              ref={pwFieldRef}
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
              }}
              type='password'
              placeholder='Password'
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  login();
                }
              }}
            />
          </Form.Group>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "baseline",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {loginInfo?.text && (
              <div style={{ margin: 10, color: loginInfo?.color || "black", maxWidth: 200 }}>
                <b>{loginInfo?.text}</b>
              </div>
            )}
            <div style={{ flexShrink: 100 }}></div>
            <div>
              {cacheDataAvailable === true && (
                <Button
                  onClick={(e) => {
                    setLoginInfo({
                      color: "#79BD9A",
                      text: "Alte Daten werden aus dem Cache übernommen.",
                    });
                    setTimeout(() => {
                      setJWT(CACHE_JWT);
                      setLoggedOut(false);
                      setLoginInfo();
                    }, 500);
                  }}
                  style={{ margin: 5, marginTop: 30 }}
                  variant='secondary'
                >
                  Offline arbeiten
                </Button>
              )}
              <Button
                onClick={(e) => {
                  login();
                }}
                style={{ margin: 5, marginTop: 30 }}
                variant='primary'
              >
                Anmeldung
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default LoginForm;
