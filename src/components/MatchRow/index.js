//Dependencies
import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AuthContext } from "../../App";

// Assets
import "./styles.scss";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const MatchRow = ({ match, rejectedMatch }) => {
  const { state, dispatch } = useContext(AuthContext);
  const [oponentName, setOponentName] = useState(null);

  const handleResumeMatchClick = () => {
    dispatch({
      type: "RESUME_MATCH",
      payload: match,
    });
  };

  // get oponent's name
  useEffect(() => {
    let idOponent = match.player_2.id_user;
    if (state.userData._id === match.player_2.id_user) {
      idOponent = match.player_1.id_user;
    }
    console.log("here", match.player_1.id_user, state.userData._id, idOponent);

    console.log(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/nameById`
    );
    fetch(
      `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}/users/nameById`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: state.token,
        },
        body: JSON.stringify({
          id_user: idOponent,
        }),
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((oponentName) => {
        setOponentName(oponentName.name);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [state.userData._id, match, state.token]);

  const showOponentName = () => {
    return (
      <div className="oponent-name-container show-full-name">
        <p>{oponentName}</p>
      </div>
    );
  };

  if (match.state === "waitingApproval") {
    console.log(match.state);
    return (
      <>
        <div className="chooseOponent-row">
          {showOponentName()}
          {state.userData._id === match.player_1.id_user ? (
            <>
              <div className="points">
                <p>{match.player_1.points}</p>
                <p>-</p>
                <p>{match.player_2.points}</p>
              </div>
              <div className="resume-match-icon-container">
                <div className="resume-match-icon">
                  <FontAwesomeIcon icon={faArrowRight} onClick={handleResumeMatchClick} />
                </div>
              </div>
            </>
          ) : (
            <div className="accept-reject-icons">
              <FontAwesomeIcon
                className="check"
                icon={faCheck}
                onClick={handleResumeMatchClick}
              />
              <FontAwesomeIcon className="times" icon={faTimes} onClick={rejectedMatch} />
            </div>
          )}
        </div>
      </>
    );
  } else {
    return (
      <div className="chooseOponent-row">
        {showOponentName()}
        <div className="points">
          <p>
            {state.userData._id === match.player_1.id_user
              ? match.player_1.points
              : match.player_2.points}
          </p>
          <p>-</p>
          <p>
            {state.userData._id === match.player_1.id_user
              ? match.player_2.points
              : match.player_1.points}
          </p>
        </div>
        <div className="resume-match-icon-container">
          <div className="resume-match-icon">
            <FontAwesomeIcon icon={faArrowRight} onClick={handleResumeMatchClick} />
          </div>
        </div>
      </div>
    );
  }
};

export default MatchRow;
