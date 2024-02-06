import { useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
} from "../Constants";
import { Piece, Position } from "../models";
import boardCompanents from "../Referee-main/Referee"
import { TeamType } from "../Types";
import { backend } from "../../../App";

interface Props {
  playMove: (piece: Piece, position: Position) => boolean;
  pieces: Piece[];
  fenComponents: boardCompanents;
  setSolved: (sol: number) => any;
  solved: number
}

let totalTurns = 0;

export default function Chessboard({playMove, pieces, fenComponents, setSolved, solved} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const chessboardRef = useRef<HTMLDivElement>(null);

  const playMoveFunction = async (pos1: Position, pos2: Position, currentPiece: Piece) => {
    let botPosition: Position[] = [];

    await fetch( `http://${backend}/api/checkmove` /*backend*/, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
            // credentials: 'include',
            body: JSON.stringify({
                id: solved+1,
                turn: totalTurns,
                team: currentPiece.skin,
                move: [pos1,pos2]
            })
    }).then((response) => {
      if (response && response.status === 200) {
        response.json().then((data) => {
          if (data.correct === "yes") {

            playMove(currentPiece.clone(), pos2)            
            if (data.botMove === "WIN") {
              setSolved(solved+1);
              totalTurns = 0;
            } else {
              botPosition = [new Position(data.botMove[0].x, data.botMove[0].y), new Position(data.botMove[1].x, data.botMove[1].y)];
              setTimeout(() => {
                const botMove = pieces.find((p) => p.samePosition(botPosition[0]));
                botMove?.possibleMoves?.push(botPosition[1]);
                if(botMove) playMove(botMove.clone(), botPosition[1]);
              },300)
            }
          } else {
            alert("ДАЛБАЕБ НАХУЙ НАУЧИСЬ ИГРАТЬ")
            totalTurns--;
          }
        })
      }
    })
  }

  function clickPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (activePiece === null || element.classList.contains("chess-piece")) {
      if (element.classList.contains("chess-piece") && chessboard) {
  
        const grabX = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
        const grabY = Math.abs(
          Math.ceil((e.clientY + window.scrollY - chessboard.offsetTop - 458.4) / GRID_SIZE)
        );
  
        setGrabPosition(new Position(grabX, grabY));
  
        const x = e.clientX - GRID_SIZE / 2 + window.scrollX;
        const y = e.clientY - GRID_SIZE / 2 + window.scrollY;
        element.style.position = "static";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
  
        setActivePiece(element);
      }
    } else{
      if (activePiece && chessboard) {
        activePiece.style.zIndex = "0";

        const x = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
        const y = Math.abs(
          Math.ceil((e.clientY - chessboard.offsetTop - 458.4  + window.scrollY) / GRID_SIZE)
        );
            
        const currentPiece = pieces.find((p) =>
          p.samePosition(grabPosition)
        );

        if (currentPiece) {
          totalTurns++;
          playMoveFunction(grabPosition, new Position(x,y), currentPiece);
        }

        setActivePiece(null);
      }

    }
  }

  let board = [];

  for (let j = 7; j >= 0; j--) {
    for (let i = 0; i < 8; i++) {
      const number = j + i + 2;
      const piece = pieces.find((p) =>
        p.samePosition(new Position(i, j))
      );
      let image = piece ? piece.image : undefined;
      let currentPiece = activePiece != null ? pieces.find(p => p.samePosition(grabPosition)) : undefined;
      let highlight = currentPiece?.possibleMoves ? 
      currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;
      let digit = (i === 0) ? VERTICAL_AXIS[fenComponents.turn === 'w' ? j : 7 - j] : '';
      let symbol = (j === 0) ? HORIZONTAL_AXIS[fenComponents.turn === 'w' ? i : 7 - i] : '';
      board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} symbol={symbol} digit={digit} /> );
    }
  }

  return (
    <>
      <div
        onClick={(e) => clickPiece(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </>
  );
}