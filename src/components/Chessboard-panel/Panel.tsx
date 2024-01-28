import react from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { Piece, Position } from "../Chessboard-chessboard/models";
import fenComponents from "../../App"

interface PanelProps {
  fen: Piece[];
  fenComponents: fenComponents;
  setNewPosition: (param: Position) => any;
  botPosition: Position[];
}

const Panel: React.FC<PanelProps> = ({ fen, fenComponents, setNewPosition, botPosition}) => {
    return (
      <>
        
        <div id="panel">    
          <p id="task-name">Связка</p>
          <p id="task-description">Найти лучшую связку</p>
          <div id="referee">
            <Referee fen={fen} fenComponents={fenComponents} setNewPosition={setNewPosition} botPosition={botPosition}/>
          </div>

        </div>

      </>
    );

}

export default Panel;