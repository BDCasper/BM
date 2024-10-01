import {useEffect, useRef, useState } from "react";
import "./Chessboard-botGame.css";
import Tile from "../Tile/Tile";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
} from "../Constants";
import { Piece, Position } from "../models";
import boardCompanents from "../Referee-main/Referee"
import { backend } from "../../../App";
import { useLocation, useNavigate} from "react-router-dom";
import TaskProps from "../../Chessboard-panel/Panel"
import useSound from 'use-sound';
import { PieceType, TeamType } from "../Types";
import { Board } from "../models/Board";
import { User } from "../../../App";
import {isMobile} from 'react-device-detect';
import WinPopup from "../winPopUp/winPopUp";
import { fenComponents } from "../../fenComponents";
import { useTranslation } from "react-i18next";
import EncodeFen from "../../FEN tools/fen-encoder";


interface Props {
  playMove: (piece: Piece, position: Position) => Promise<boolean>;
  pieces: Piece[];
  fenComponents: boardCompanents;
  setPopOpen: (pop: boolean) => any;
  setBoard: (previousBoard: any) => any;
  everyMove: Board[];
  movePtr: number;
  botMover: Position[];
}

let totalTurns = 0;
let promoteLetter: string;
const rightMove : Position[] = [new Position(-1,-1), new Position(-1,-1)];
let _promote: (arg0: PieceType) => void


export default function ChessboardBot({playMove, pieces, fenComponents, setPopOpen, setBoard, everyMove, movePtr, botMover} : Props) {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
  const chessboardRef = useRef<HTMLDivElement>(null);
  const [moveSound] = useSound('move-self.mp3');
  const modalRef = useRef<HTMLDivElement>(null);
  const [promotionPawn, setPromotionPawn] = useState<Piece>();
  const [sendPromote, setSendPromote] = useState<boolean>(false);
  const [GRID_SIZE, setGridSize] = useState<number>(0);
  const [boardSize, setBoardSize] = useState<number>(0);
  const {t} = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [arrowStart, setArrowStart] = useState<Position | null>(null);
  const [initialMousePosition, setInitialMousePosition] = useState<Position | null>(null);
  const [botAllowToMove, setBotAllowToMove] = useState<boolean>(false);
  
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
        rightMove[0].x = -1;
        rightMove[0].y = -1;
        rightMove[1].x = -1;
        rightMove[1].y = -1;
      }
    )()
  },[])

  const botMove = async(botPosition:Position[]) => {
    const botMove = pieces?.find((p) => p.samePosition(botPosition[0]));
    if(botMove) {
      playMove(botMove.clone(), botPosition[1]);
      rightMove[0].x = botPosition[0].x;
      rightMove[0].y = botPosition[0].y;
      rightMove[1].x = botPosition[1].x;
      rightMove[1].y = botPosition[1].y;
    }
    return true;
  }

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

  useEffect(() => {
    (
      async() => {
        if(botMover[0].x !== -1 && botAllowToMove){
          botMove(botMover);
          moveSound();
          fenComponents.turn === "w" ? fenComponents.turn = "b" : fenComponents.turn = "w"
          setBotAllowToMove(false);
        }
      }
    )()
  },[botMover])

  const playMoveFunction = async (pos1: Position, pos2: Position, currentPiece: Piece) => {
    await playMove(currentPiece.clone(), pos2);
    await promoteNow(currentPiece.clone(), pos2)
    setBotAllowToMove(true);
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
            await playMoveFunction(grabPosition, new Position(x,y), currentPiece);
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
            await playMoveFunction(grabPosition, new Position(x,y), currentPiece);
            
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
      let digit = (i === 0) ? VERTICAL_AXIS[j] : '';
      let symbol = (j === 0) ? HORIZONTAL_AXIS[i] : '';
      let highlightRightMove1 = (fenComponents.turn === 'b' && (i === rightMove[0].x && j === rightMove[0].y)) || (fenComponents.turn === 'w' && (i === rightMove[0].x && j === rightMove[0].y)) ? true : false;
      let highlightRightMove2 = (fenComponents.turn === 'b' && (i === rightMove[1].x && j === rightMove[1].y)) || (fenComponents.turn === 'w' && (i === rightMove[1].x && j === rightMove[1].y)) ? true : false;
      boardDraw.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} symbol={symbol} digit={digit} highlightRightMove1={highlightRightMove1} highlightRightMove2={highlightRightMove2}/> );
    }
  }

  return (
    <div className="chessboardWrapper2">
      <div className="modal hidden" ref={modalRef}>
          <div className="modal-body">
              <img onClick={() => promotePawn(PieceType.ROOK)} src={`/assets/images/rook_${promotionTeamType()}.png`} />
              <img onClick={() => promotePawn(PieceType.BISHOP)} src={`/assets/images/bishop_${promotionTeamType()}.png`} />
              <img onClick={() => promotePawn(PieceType.KNIGHT)} src={`/assets/images/knight_${promotionTeamType()}.png`} />
              <img onClick={() => promotePawn(PieceType.QUEEN)} src={`/assets/images/queen_${promotionTeamType()}.png`} />
          </div>
      </div>
      
      <div className="chessboard-board">
        {isMobile ? 
        <>
          <div onClick={(e) => clickPiece(e)} id="chessboard" ref={chessboardRef}> {boardDraw} </div>
        </>
        :
        <>
          <div 
          onMouseMove={(e) => movePiece(e)}
          onMouseDown={(e) => grabPiece(e)}
          onMouseUp={(e) => dropPiece(e)}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => clearArrows()}
          onMouseDownCapture={onRightMouseDown}
          onMouseUpCapture={onRightMouseUp} id="chessboard" ref={chessboardRef}> {boardDraw} </div>
          <canvas ref={canvasRef} className="arrow-canvas-botGame" width={boardSize} height={boardSize}></canvas>
        </>
        }
      </div>
    <div className="turn"><img className="move_symbol" src={`/assets/images/${fenComponents.turn}_move.svg`}/>{t('Ход')} {fenComponents.turn ? (fenComponents.turn === "w" ? t('Белых') : t('Черных')) : "..."}</div>
    </div>
  );
}