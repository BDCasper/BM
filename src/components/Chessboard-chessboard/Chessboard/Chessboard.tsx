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
  mode: string;
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
const rightMove : Position[] = [new Position(-1,-1), new Position(-1,-1)];
let _promote: (arg0: PieceType) => void


export default function Chessboard({playMove, pieces, fenComponents, setSolved, solved, activeIndex, setActiveIndex, lengthOfArray, arrayOfObjects, mode, closed, setPopOpen, setBoard, board, user, arrayOfSolved, gameWithFriend, everyMove,movePtr, handleAnimation, setReviewMode, setProgress, gameWithBot} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const [lives, setLives] = useState<number>(3);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [moveSound] = useSound('/move-self.mp3', { volume: 0.2 });
  const [wrongSound] = useSound('/wrong.mp3', { volume: 0.2 });
  const [winSound] = useSound('/win.wav', { volume: 0.2 });
  const modalRef = useRef<HTMLDivElement>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [GRID_SIZE, setGridSize] = useState<number>(0);
  const [boardSize, setBoardSize] = useState<number>(0);
  const [review, setReview] = useState<boolean>(false);
  const [winPopUp, setWinPopUp] = useState<boolean>(false);
  const {t} = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [arrowStart, setArrowStart] = useState<Position | null>(null);
  const [initialMousePosition, setInitialMousePosition] = useState<Position | null>(null);
  const [playSide, setPlaySide] = useState<string>('');
  const promoteLetterRef = useRef<string>('');
  const requestLetterRef = useRef<string>('');
  const [firstTurn, setFirstTurn] = useState<string>(fenComponents.turn);

  
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

  useEffect(() => {
    (
      async() => {
        if(totalTurns === 0){
          setPlaySide(fenComponents.turn);
        }
      }
    )()
  },[fenComponents.turn])

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
    let solvedCheck = false;
    if(arrayOfSolved && !arrayOfSolved.has(arrayOfObjects[activeIndex].puzzle_id)) {
      solvedCheck = true;
      arrayOfSolved.add(arrayOfObjects[activeIndex].puzzle_id)
    }
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
    if(chk === true && solvedCheck) {
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

  const promoteNow = async (playedPiece: Piece, destination: Position) => {
    let promotionRow = (playedPiece.team === TeamType.OUR) ? 7 : 0;

    // Check if the move is a promotion
    if (destination.y === promotionRow && playedPiece.isPawn) {
        modalRef.current?.classList.remove("hidden");

        // Clone the played pawn and prepare it for promotion
        setPromotionPawn(() => {
            const clonedPlayedPiece = playedPiece.clone();
            clonedPlayedPiece.position = destination.clone();
            return clonedPlayedPiece;
        });

        // Wait for user input to resolve the promotion type
        const pieceType = await new Promise<PieceType>((resolve) => {
            _promote = resolve; // The resolution function is called from the promotePawn method
        });

        return true; // Promotion happened
    }
    return false; // No promotion needed
  };

  function promotePawn(pieceType: PieceType) {
    if (!promotionPawn) return;

    _promote(pieceType);

    promoteLetterRef.current = pieceType === 'rook' ? 'R' :
                               pieceType === 'knight' ? 'N' :
                               pieceType === 'bishop' ? 'B' :
                               'Q'; // Default to Queen if none of the other cases
    console.log(promoteLetterRef.current);
    console.log(requestLetterRef.current);
    if(promoteLetterRef.current !== requestLetterRef.current){
      promoteLetterRef.current = '';
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

    modalRef.current?.classList.add("hidden");
  }

  function promotionTeamType() {
    return (promotionPawn?.skin === TeamType.OUR) ? "w" : "b";
  }

  const playMoveFunction = async (pos1: Position, pos2: Position, currentPiece: Piece) => {
    const clonedBoard = board;
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
            requestLetterRef.current = data.prom;
            console.log(data.prom, 'backend');
            playMove(currentPiece.clone(), pos2);
          }
        })
      }
    })
    
    const promotionHappened = await promoteNow(currentPiece.clone(), pos2);
    
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
                prom: promoteLetterRef.current === '' ? undefined : promoteLetterRef.current
            })
    }).then((response) => {
      if (response && response.status === 200) {
        response.json().then((data) => {
          if (data.correct === "yes") {
            if(mode !== 'labirint') fenComponents.turn === "w" ? fenComponents.turn = "b" : fenComponents.turn = "w"
            nullRightMoves();
            setLives(3);
            if (data.botMove === "WIN") {
              setTimeout(() => {
                win();
              }, 1000);
            } else {
              if(mode !== 'labirint') {
                const botPosition = [new Position(data.botMove[0].x, data.botMove[0].y), new Position(data.botMove[1].x, data.botMove[1].y)];
                setTimeout(() => {
                  botMove(botPosition);
                  fenComponents.turn === "w" ? fenComponents.turn = "b" : fenComponents.turn = "w"
                  moveSound();
                }, 500);
              }
              if(data.win === "WIN") {
                setTimeout(() => {
                  win();
                }, 1000);
              }
            }
          } else {
            if(promoteLetterRef.current === '') setBoard(clonedBoard);
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
    moveSound();
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
      const x = e.clientX - 30 + window.scrollX;
      const y = e.clientY - 30 + window.scrollY;
      activePiece.style.position = "absolute";
      activePiece.style.zIndex = '2';
      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
  
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
            } else if (mode === 'basic'){
              playWithBot(currentPiece.clone(), new Position(x,y))
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
  
    ctx.globalAlpha = 0.5;
    
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

  const drawCircle = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }
  
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("2D context not available on canvas");
      return;
    }
  
    // Calculate coordinates for the center of the circle
    const centerX = x * GRID_SIZE + GRID_SIZE / 2;
    const centerY = canvas.height - (y * GRID_SIZE + GRID_SIZE / 2);
    const radius = (GRID_SIZE / 2) - 1; // Radius is now 2px smaller than the cell
  
    // Set transparency
    ctx.globalAlpha = 0.5; // Adjust the transparency level here
  
    // Draw the circle that is 2px smaller than the cell
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = "red"; // Use the same red color as the arrow
    ctx.lineWidth = 3; // Match the stroke width of the arrow
    ctx.stroke();
  
    // Reset transparency for future drawings
    ctx.globalAlpha = 1.0;
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
  
    setArrowStart(new Position(x, y));
    setInitialMousePosition(new Position(x,y));
  };  

  const onRightMouseUp = (e: React.MouseEvent) => {
    if (e.button !== 2) return;
  
    const chessboard = chessboardRef.current;
    if (!chessboard) return;
  
    const x = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE);
    const y = Math.abs(
      Math.ceil((e.clientY + window.scrollY - chessboard.offsetTop - boardSize) / GRID_SIZE)
    );
  
    if (!arrowStart) {
      clearArrows();
      return;
    }
  
    // Check if the mouse position has changed; if not, draw a circle
    if (arrowStart.x === x && arrowStart.y === y) {
      drawCircle(x, y);
    } else {
      drawArrow(arrowStart.x, arrowStart.y, x, y);
    }
  
    setArrowStart(null);
    setInitialMousePosition(null);
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
      let digit = (i === 0) ? playSide === 'w' ? VERTICAL_AXIS[j] : playSide === 'b' ? VERTICAL_AXIS[7-j] : '' : '';
      let symbol = (j === 0) ? playSide === 'w' ? HORIZONTAL_AXIS[i] : playSide === 'b' ? HORIZONTAL_AXIS[7-i] : '' : '';
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
      {mode === 'labirint' && 
      <>
        <div className="task-title">{t(arrayOfObjects[activeIndex]?.title)}</div>
      </>
      }
      <div className="chessboard-board">
        {isMobile ? 
        <>
          <div onClick={(e) => mode === 'test' ? null : clickPiece(e)} id="chessboard" ref={chessboardRef}> {boardDraw} </div>
        </>
        :
        <>
          <div 
          onMouseMove={(e) => movePiece(e)}
          onMouseDown={(e) => mode === 'test' ? null : grabPiece(e)}
          onMouseUp={(e) => mode === 'test' ? null : dropPiece(e)}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => clearArrows()}
          onMouseDownCapture={onRightMouseDown}
          onMouseUpCapture={onRightMouseUp} id="chessboard" ref={chessboardRef}> {boardDraw} </div>
          <canvas ref={canvasRef} className={gameWithFriend ? "arrow-canvas-gameWithFriend" : (arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].puzzle_id === -1 ? "arrow-canvas-basicTask" : mode === 'test' ? "arrow-canvas-test" : mode === 'labirint' ? "arrow-canvas-labirint" : "arrow-canvas-tasks")} width={boardSize} height={boardSize}></canvas>
        </>
        }
      </div>
      {mode === 'labirint' && 
      <>
        <div className="task-title-rules">
          <div>Правила:</div>
          <div>1. Ходить только одной фигурой</div>
          <div>2. Нельзя вставать под бой</div>
          <div>3. Можно есть фигуры противника</div>
          <div>4. Противник не ходит</div>
        </div>
      </>
      }
      {arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].puzzle_id !== -1 && <div className="turn"><img className="move_symbol" src={`/assets/images/${firstTurn}_move.svg`}/>{t('Ход')} {firstTurn ? (firstTurn === "w" ? t('Белых') : t('Черных')) : "..."}</div>}
      {arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].puzzle_id === -1 && <div className="task-title">{t(arrayOfObjects[activeIndex]?.title)}</div>}
      {mode !== 'test' && gameWithFriend === undefined && <div className="lives">{t('Осталось жизней')}: <span>{lives}</span></div>}
    </div>
  );
}