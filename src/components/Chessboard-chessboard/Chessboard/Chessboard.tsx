import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import "./Chessboard.css";
import Tile from "../Tile/Tile";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
} from "../Constants";
import { Piece, Position } from "../models";
import boardCompanents from "../Referee-main/Referee"
import { backend } from "../../../App";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TaskProps from "../../Chessboard-panel/Panel"
import useSound from 'use-sound';
import { PieceType, TeamType } from "../Types";
import { Board } from "../models/Board";
import { User } from "../../../App";

interface Props {
  playMove: (piece: Piece, position: Position) => Promise<boolean>;
  pieces: Piece[];
  fenComponents: boardCompanents;
  setSolved: (sol: number) => any;
  solved: number;
  activeIndex: number;
  setActiveIndex: (index:number) => any;
  lengthOfArray: number;
  arrayOfObjects: TaskProps[];
  isTest: boolean;
  closed: boolean;
  setPopOpen: (pop: boolean) => any;
  setBoard: (previousBoard: any) => any;
  board: Board;
  user: User;
  arrayOfSolved: Set<number>;
}

let totalTurns = 0;
let promoteLetter: string;
const rightMove : Position[] = [new Position(-1,-1), new Position(-1,-1)];
let _promote: (arg0: PieceType) => void


export default function Chessboard({playMove, pieces, fenComponents, setSolved, solved, activeIndex, setActiveIndex, lengthOfArray, arrayOfObjects, isTest, closed, setPopOpen, setBoard, user, arrayOfSolved} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const [lives, setLives] = useState<number>(3);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [moveSound] = useSound('move-self.mp3');
  const [wrongSound] = useSound('wrong.mp3');
  const [winSound] = useSound('win.wav', { volume: 0.2 });
  const modalRef = useRef<HTMLDivElement>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [sendPromote, setSendPromote] = useState<boolean>(false);
  const [GRID_SIZE, setGridSize] = useState<number>(0);
  const [boardSize, setBoardSize] = useState<number>(0);
  
  useEffect(() => {
    (
      async() => {
        if(window.screen.width < 1200) {
          setGridSize(35);
          setBoardSize(280);
        }
        else {
          setGridSize(57.2);
          setBoardSize(458.4);
        }
      }
    )()
  },[])

  const botMove = async(botPosition:Position[]) => {
    const botMove = pieces.find((p) => p.samePosition(botPosition[0]));
    botMove?.possibleMoves?.push(botPosition[1]);
    if(botMove) playMove(botMove.clone(), botPosition[1]);
    return true;
  }

  const win = async() => {
    if(arrayOfSolved && !arrayOfSolved.has(arrayOfObjects[activeIndex].puzzle_id)) arrayOfSolved.add(arrayOfObjects[activeIndex].puzzle_id)
    localStorage.setItem(location.state.id, JSON.stringify(arrayOfSolved));
    if (lengthOfArray - 1 === activeIndex) {
          winSound();
          navigate("/")
    } 
    else if(closed === true)
    {
      winSound();
      setPopOpen(true);
    }
    else 
    {
        winSound();
        setActiveIndex(activeIndex + 1)
        setSolved(solved - 1);
        totalTurns = 0;
    }
  }

  const nullRightMoves = () => {
    rightMove[0].x = -1;
    rightMove[0].y = -1;
    rightMove[1].x = -1;
    rightMove[1].y = -1;
  }

  useEffect(() => {  
    (
      async () => {
        totalTurns = 0
        setLives(3);
        setActivePiece(null);
        nullRightMoves();
      }
    )();
  }, [activeIndex]);

  const promoteNow = async(playedPiece: Piece, destination: Position) => {
    let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;
    if (destination.y === promotionRow && playedPiece.isPawn) {
        setSendPromote(true);
        modalRef.current?.classList.remove("hidden");
        setPromotionPawn((previousPromotionPawn) => {
            const clonedPlayedPiece = playedPiece.clone();
            clonedPlayedPiece.position = destination.clone();
            return clonedPlayedPiece;
        });
        const promise = new Promise((resolved:(arg0:PieceType)=>void) => {_promote = resolved})
        let type;
        await promise.then((res) => {type = res});
        return true;
    }
    return false;
  }

  function promotePawn(pieceType: PieceType) {
    _promote(pieceType);
    if (promotionPawn === undefined) {
        return;
    }
    setBoard((previousBoard: { clone: () => any; }) => {
        const clonedBoard = previousBoard.clone();
        clonedBoard.pieces = clonedBoard.pieces.reduce((results: any, piece: { samePiecePosition: (arg0: any) => any; position: { clone: () => Position; }; team: TeamType; skin: TeamType; }) => {
            if (piece.samePiecePosition(promotionPawn)) {
                results.push(new Piece(piece.position.clone(), pieceType,
                    piece.team, true, piece.skin));
            } else {
                results.push(piece);
            }
            return results;
        }, [] as Piece[]);

        clonedBoard.calculateAllMoves();
        return clonedBoard;
    })
    if(pieceType === 'rook') promoteLetter = 'R';
    if(pieceType === 'knight') promoteLetter = 'K';
    if(pieceType === 'bishop') promoteLetter = 'B';
    if(pieceType === 'queen') promoteLetter = 'Q';
    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return (promotionPawn?.team === TeamType.OUR) ? "w" : "b";
  }

  const playMoveFunction = async (pos1: Position, pos2: Position, currentPiece: Piece) => {
    await fetch( `${backend}/api/checkbefore`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
            // credentials: 'include',
            body: JSON.stringify({
                id: arrayOfObjects[activeIndex].puzzle_id,
                turn: totalTurns,
                team: currentPiece.skin,
                move: [pos1,pos2],
                lives: lives,
                user_id: user.user_id,
            })
    }).then((response) => {
      if (response && response.status === 200) {
        response.json().then((data) => {
          if (data.correct === "yes") {
            playMove(currentPiece.clone(), pos2);
          }
        })
      }
    })

    await promoteNow(currentPiece.clone(), pos2)

    await fetch( `${backend}/api/checkmove`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
            // credentials: 'include',
            body: JSON.stringify({
                id: arrayOfObjects[activeIndex].puzzle_id,
                turn: totalTurns,
                team: currentPiece.skin,
                move: [pos1,pos2],
                lives: lives,
                user_id: user.user_id,
                //promote: (sendPromote ? promoteLetter : undefined)
            })
    }).then((response) => {
      if (response && response.status === 200) {
        response.json().then((data) => {
          if (data.correct === "yes") {
            nullRightMoves();
            setLives(3);
            if (data.botMove === "WIN") {
              setTimeout(() => {
                win();
              }, 1000);
            } else {
                const botPosition = [new Position(data.botMove[0].x, data.botMove[0].y), new Position(data.botMove[1].x, data.botMove[1].y)];
                setTimeout(() => {
                  botMove(botPosition);
                  moveSound();
                }, 500);
                if(data.win === "WIN") {
                  setTimeout(() => {
                    win();
                  }, 1000);
                }
            }
          } else {
            wrongSound();
            if(rightMove[0].x === -1 && lives !== 0) setLives(lives - 1)
            totalTurns--;
            
            if (data.solut) 
            {
              const rightPosition = [new Position(data.solut[0].x, data.solut[0].y), new Position(data.solut[1].x, data.solut[1].y)];
              rightMove[0].x = rightPosition[0].x;
              rightMove[0].y = rightPosition[0].y;
              rightMove[1].x = rightPosition[1].x;
              rightMove[1].y = rightPosition[1].y;
            }
          }
        })
      }
    })
  }
  
  async function clickPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (activePiece === null || element.classList.contains("chess-piece")) {
      if (element.classList.contains("chess-piece") && chessboard) {
        const grabX = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
        const grabY = Math.abs(
          Math.ceil((e.clientY + window.scrollY - chessboard.offsetTop - boardSize) / GRID_SIZE)
        );
        setGrabPosition(new Position(grabX, grabY));
  
        const x = e.clientX - GRID_SIZE / 2 + window.scrollX;
        const y = 7 - e.clientY - GRID_SIZE / 2 + window.scrollY;
        element.style.position = "static";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
  
        setActivePiece(element);
      }
    } else{
      if (activePiece && chessboard) {
        activePiece.style.zIndex = "1";

        const x = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
        const y = Math.abs(
          Math.ceil((e.clientY - chessboard.offsetTop - boardSize  + window.scrollY) / GRID_SIZE)
        );
            
        const currentPiece = pieces.find((p) =>
          p.samePosition(grabPosition)
        );

        if (currentPiece && currentPiece?.possibleMoves?.some(p => p.samePosition(new Position(x, y)))) {
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
      let highlightRightMove1 = (fenComponents.turn === 'b' && (i === rightMove[0].x && j === rightMove[0].y)) || (fenComponents.turn === 'w' && (i === rightMove[0].x && j === rightMove[0].y)) ? true : false;
      let highlightRightMove2 = (fenComponents.turn === 'b' && (i === rightMove[1].x && j === rightMove[1].y)) || (fenComponents.turn === 'w' && (i === rightMove[1].x && j === rightMove[1].y)) ? true : false;
      board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} symbol={symbol} digit={digit} highlightRightMove1={highlightRightMove1} highlightRightMove2={highlightRightMove2}/> );
    }
  }

  return (
    <div className="chessboardWrapper">
        <div className="modal hidden" ref={modalRef}>
            <div className="modal-body">
                <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} />
                <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} />
                <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} />
                <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} />
            </div>
        </div>
      <div className="task-name">{arrayOfObjects[activeIndex]?.subtopic}</div>
      <div className="task-description">{arrayOfObjects[activeIndex]?.title}</div>
      <div className="chessboard-board">
        {isTest === true ?       
          <div id="chessboard" ref={chessboardRef}> {board} </div>
        :
          <div onClick={(e) => clickPiece(e)} id="chessboard" ref={chessboardRef}> {board} </div>
        }
      </div>
      <div className="turn"><img className="move_symbol" src={`/assets/images/${fenComponents.turn}_move.svg`}/>Ход {fenComponents.turn ? (fenComponents.turn === "w" ? "Белых" : "Черных") : "..."}</div>
      <div className="lives">Осталось жизней: <span>{lives}</span></div>
    </div>
  );
}