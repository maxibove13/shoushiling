//Dependencies

// Components
import { MatchRow } from "../../components";

// Assets
import "./styles.scss";

const UsersMatches = ({ matches }) => {
  return (
    <>
      <div className="matches-list-container">
        <h3>Partidas en curso</h3>
        <div className="table activeMatches">
          <div className="table-header">
            <p>Oponente</p>
            <p>Marcador</p>
            <p className="hide-always">Jugadas</p>
          </div>
          {matches.some((match) => {
            return match.state === "waitingApproval" || match.state === "playing";
          }) ? (
            matches.map((match) => {
              if (match.state === "waitingApproval" || match.state === "playing") {
                return <MatchRow key={match._id} match={match} />;
              }
              return null;
            })
          ) : (
            <p className="no-matches">No tienes partidas en curso</p>
          )}
        </div>
        <h3>Últimas partidas</h3>
        <div className="table finished-matches">
          <div className="table-header">
            <p>Oponente</p>
            <p>Resultado</p>
            <p className="hide-always">Jugadas</p>
          </div>
          {matches.some((match) => {
            return match.state === "finished";
          }) ? (
            matches.map((match) => {
              if (match.state === "finished") {
                return <MatchRow key={match._id} match={match} />;
              }
              return null;
            })
          ) : (
            <p className="no-matches">Aún no tienes partidas finalizadas</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersMatches;
