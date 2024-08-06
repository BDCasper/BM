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
import {isMobile} from 'react-device-detect';
import WinPopup from "../winPopUp/winPopUp";
import { useTranslation } from "react-i18next";


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
  gameWithFriend: boolean|undefined;
  everyMove: Board[];
  movePtr: number;
  handleAnimation: (check: boolean) => any;
  setReviewMode: (check: boolean) => any;
  setProgress: (num: number) => any;
  gameWithBot: boolean|undefined;
}

let totalTurns = 0;
let promoteLetter: string;
const rightMove : Position[] = [new Position(-1,-1), new Position(-1,-1)];
let _promote: (arg0: PieceType) => void


export default function Chessboard({playMove, pieces, fenComponents, setSolved, solved, activeIndex, setActiveIndex, lengthOfArray, arrayOfObjects, isTest, closed, setPopOpen, setBoard, board, user, arrayOfSolved, gameWithFriend, everyMove,movePtr, handleAnimation, setReviewMode, setProgress, gameWithBot} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const [lives, setLives] = useState<number>(3);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [moveSound] = useSound('move-self.mp3');
  const [wrongSound] = useSound('wrong.mp3');
  const [winSound] = useSound('win.wav', { volume: 0.2 });
  const [topicWin] = useSound('topicWin.mp3');
  const modalRef = useRef<HTMLDivElement>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [sendPromote, setSendPromote] = useState<boolean>(false);
  const [GRID_SIZE, setGridSize] = useState<number>(0);
  const [boardSize, setBoardSize] = useState<number>(0);
  const [review, setReview] = useState<boolean>(false);
  const [winPopUp, setWinPopUp] = useState<boolean>(false);
  const {t} = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [arrowStart, setArrowStart] = useState<Position | null>(null);
  const [isDrawingArrow, setIsDrawingArrow] = useState<boolean>(false);
  
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
    const botMove = pieces?.find((p) => p.samePosition(botPosition[0]));
    botMove?.possibleMoves?.push(botPosition[1]);
    if(botMove) {
      playMove(botMove.clone(), botPosition[1]);
      rightMove[0].x = botPosition[0].x;
      rightMove[0].y = botPosition[0].y;
      rightMove[1].x = botPosition[1].x;
      rightMove[1].y = botPosition[1].y;
    }
    return true;
  }


  const win = async() => {
    setReview(true);
    setReviewMode(true);
    setWinPopUp(true);
    if(arrayOfSolved && !arrayOfSolved.has(arrayOfObjects[activeIndex].puzzle_id)) arrayOfSolved.add(arrayOfObjects[activeIndex].puzzle_id)
    winSound();
    let chk;
    // let ind = 0;
    chk = false;
    let cnt = 0;
    if(arrayOfSolved && arrayOfObjects) {
      arrayOfObjects.map((puz) => {
          if(arrayOfSolved.has(puz.puzzle_id)) cnt++;
        }
      )
      setProgress(cnt);
    }
    for(let i = 0; i < lengthOfArray; i++)
    {
      chk = true;
      if(!arrayOfSolved.has(arrayOfObjects[i].puzzle_id)) {
        chk = false;
        break;
      }
    }
    if(chk === true) {
      handleAnimation(true);
    }
    // if (lengthOfArray - 1 === activeIndex) {
    //   if(chk) {
    //     winSound();
    //     setActiveIndex(ind)
    //   }
    //   else {
    //     topicWin();
    //     navigate("/")
    //   }
    //   chk = false;
    // } 
    // else if(closed === true)
    // {
    //   winSound();
    //   setPopOpen(true);
    // }
    // else 
    // {
    //     winSound();
    //     if(arrayOfSolved.has(arrayOfObjects[activeIndex + 1].puzzle_id) && chk) setActiveIndex(ind)
    //     else setActiveIndex(activeIndex + 1)
    //     chk = false;
    //     totalTurns = 0;
    // }
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
        setReview(false);
        setReviewMode(false);
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
    return (promotionPawn?.skin === TeamType.OUR) ? "w" : "b";
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
            fenComponents.turn === "w" ? fenComponents.turn = "b" : fenComponents.turn = "w"
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
                  fenComponents.turn === "w" ? fenComponents.turn = "b" : fenComponents.turn = "w"
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
            if(activePiece)
            {
              activePiece.style.position = "relative";
              activePiece.style.removeProperty("top");
              activePiece.style.removeProperty("left");
            }
            if(lives !== 0) setLives(lives - 1)
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

  const playWithBot = async(currentPiece: Piece, pos2: Position) => {
    await playMove(currentPiece.clone(), pos2)
    await promoteNow(currentPiece.clone(), pos2)
  }
  
  function grabPiece(e: React.MouseEvent) {
    if (e.nativeEvent.button === 2) return;
    clearArrows();
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
        element.style.zIndex = '1';
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        setActivePiece(element);
      }
    }
  }

  function movePiece(e: React.MouseEvent) {
    if (e.nativeEvent.button === 2) return;
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 130;
      const minY = chessboard.offsetTop - 80;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth + 80;
      const maxY = chessboard.offsetTop + chessboard.clientHeight + 40;
      const x = e.clientX - 30 + window.scrollX;
      const y = e.clientY - 30 + window.scrollY;
      activePiece.style.position = "absolute";
      activePiece.style.zIndex = '2';
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
  
      if (x < minX) {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
          setActivePiece(null);
      }

      if (x > maxX) {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
          setActivePiece(null);
      }

      if (y < minY) {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
          setActivePiece(null);
      }

      if (y > maxY) {
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
          setActivePiece(null);
      }
    }
  }

  const dropPiece = async(e: React.MouseEvent) => {
      if (e.nativeEvent.button === 2) return;
      if (activePiece && chessboardRef.current) {
        activePiece.style.zIndex = "1";

        const x = Math.floor((e.clientX - chessboardRef.current.offsetLeft + window.scrollX) / GRID_SIZE);
        const y = Math.abs(
          Math.ceil((e.clientY - chessboardRef.current.offsetTop - boardSize  + window.scrollY) / GRID_SIZE)
        );
            
        const currentPiece = pieces?.find((p) =>
          p.samePosition(grabPosition)
        );


        if (currentPiece && currentPiece?.possibleMoves?.some(p => p.samePosition(new Position(x, y)))) {
            totalTurns++;
            if(gameWithFriend || review){
              playWithBot(currentPiece.clone(), new Position(x,y))
              if(fenComponents.turn === "w") fenComponents.turn = "b";
              else fenComponents.turn = "w";
            }
            else await playMoveFunction(grabPosition, new Position(x,y), currentPiece);
        }else{
          //RESETS THE PIECE POSITION
          activePiece.style.position = "relative";
          activePiece.style.removeProperty("top");
          activePiece.style.removeProperty("left");
        }

        setActivePiece(null);
      }
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
            
        const currentPiece = pieces?.find((p) =>
          p.samePosition(grabPosition)
        );

        if (currentPiece && currentPiece?.possibleMoves?.some(p => p.samePosition(new Position(x, y)))) {
            totalTurns++;
            if(gameWithFriend || review){
              playWithBot(currentPiece.clone(), new Position(x,y))
              if(fenComponents.turn === "w") fenComponents.turn = "b";
              else fenComponents.turn = "w";
            } 
            else playMoveFunction(grabPosition, new Position(x,y), currentPiece);
            
        }

        setActivePiece(null);
      }

    }
  }

  const drawArrow = (startX: number, startY: number, endX: number, endY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("2D context not available on canvas");
      return;
    }

    if(startX === endX && startY === endY) return;
  
    // Clear the canvas
  
    // Calculate coordinates
    const fromX = startX * GRID_SIZE + GRID_SIZE / 2;
    const fromY = canvas.height - (startY * GRID_SIZE + GRID_SIZE / 2);
    const toX = endX * GRID_SIZE + GRID_SIZE / 2;
    const toY = canvas.height - (endY * GRID_SIZE + GRID_SIZE / 2);
  
    console.log(`Drawing arrow from (${fromX}, ${fromY}) to (${toX}, ${toY})`);
  
    // Calculate arrow properties
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
  
    // Draw the arrow
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.stroke();
  };

  const clearArrows = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
  
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("2D context not available on canvas");
      return;
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const onRightMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 2) return;

    const chessboard = chessboardRef.current;
    if (!chessboard) return;

    const x = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
    const y = Math.abs(
      Math.ceil((e.clientY + window.scrollY - chessboard.offsetTop - boardSize) / GRID_SIZE)
    );

    console.log(x, y);

    setArrowStart(new Position(x, y));
  };

  const onRightMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 2) return;

    const chessboard = chessboardRef.current;
    if (!chessboard) return;

    if (!arrowStart) {
      clearArrows();
      return;
    }

    const x = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
    const y = Math.abs(
      Math.ceil((e.clientY + window.scrollY - chessboard.offsetTop - boardSize) / GRID_SIZE)
    );
    console.log(x, y);

    drawArrow(arrowStart.x, arrowStart.y, x, y);
    setArrowStart(null);
  };

  let boardDraw = [];
  for (let j = 7; j >= 0; j--) {
    for (let i = 0; i < 8; i++) {
      const number = j + i + 2;
      const piece = pieces?.find((p) =>
        p.samePosition(new Position(i, j))
      );
      let image = piece ? piece.image : undefined;
      let currentPiece = activePiece != null ? pieces?.find(p => p.samePosition(grabPosition)) : undefined;
      let highlight = currentPiece?.possibleMoves ? 
      currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;
      let digit = (i === 0) ? VERTICAL_AXIS[gameWithFriend ? j : fenComponents.turn === 'w' ? j : 7 - j] : '';
      let symbol = (j === 0) ? HORIZONTAL_AXIS[gameWithFriend ? i : fenComponents.turn === 'w' ? i : 7 - i] : '';
      let highlightRightMove1 = (fenComponents.turn === 'b' && (i === rightMove[0].x && j === rightMove[0].y)) || (fenComponents.turn === 'w' && (i === rightMove[0].x && j === rightMove[0].y)) ? true : false;
      let highlightRightMove2 = (fenComponents.turn === 'b' && (i === rightMove[1].x && j === rightMove[1].y)) || (fenComponents.turn === 'w' && (i === rightMove[1].x && j === rightMove[1].y)) ? true : false;
      boardDraw.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} symbol={symbol} digit={digit} highlightRightMove1={highlightRightMove1} highlightRightMove2={highlightRightMove2}/> );
    }
  }

  return (
    <div className="chessboardWrapper">
      {winPopUp === true &&
        <WinPopup onClose={setWinPopUp} activeIndex={activeIndex} setActiveIndex={setActiveIndex} lengthOfArray={lengthOfArray} />
      }
      <div className="modal hidden" ref={modalRef}>
          <div className="modal-body">
              <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} />
              <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} />
              <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} />
              <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} />
          </div>
      </div>
      
      <div className="task-name">{t(arrayOfObjects[activeIndex]?.subtopic)}</div>
      <div className="chessboard-board">
        {isMobile ? 
        <>
          <div onClick={(e) => isTest === true ? null : clickPiece(e)} id="chessboard" ref={chessboardRef}> {boardDraw} </div>
        </>
        :
        <>
          <div 
          onMouseMove={(e) => movePiece(e)}
          onMouseDown={(e) => isTest === true? null : grabPiece(e)}
          onMouseUp={(e) => isTest === true? null : dropPiece(e)}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => clearArrows()}
          onMouseDownCapture={onRightMouseDown}
          onMouseUpCapture={onRightMouseUp} id="chessboard" ref={chessboardRef}> {boardDraw} </div>
          <canvas ref={canvasRef} className={gameWithFriend ? "arrow-canvas-gameWithFriend" : (arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].puzzle_id === -1 ? "arrow-canvas-basicTask" : "arrow-canvas-tasks")} width={boardSize} height={boardSize}></canvas>
        </>
        }
      </div>
      {arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].puzzle_id !== -1 && <div className="turn"><img className="move_symbol" src={`/assets/images/${fenComponents.turn}_move.svg`}/>{t('Ход')} {fenComponents.turn ? (fenComponents.turn === "w" ? t('Белых') : t('Черных')) : "..."}</div>}
      {arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].puzzle_id === -1 && <div className="task-title">{t(arrayOfObjects[activeIndex]?.title)}</div>}
      {isTest === false && gameWithFriend===undefined && <div className="lives">{t('Осталось жизней')}: <span>{lives}</span></div>}
    </div>
  );
}