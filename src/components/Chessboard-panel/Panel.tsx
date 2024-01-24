import react from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"

export default function Panel() {

    return (
      <>
        
        <div id="panel">    
          <p id="task-name">Связка</p>
          <p id="task-description">Найти лучшую связку</p>
          <div id="referee">
            <Referee/>
          </div>

        </div>

      </>
    );

}