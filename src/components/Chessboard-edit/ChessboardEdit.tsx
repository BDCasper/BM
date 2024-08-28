import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChessboardEdit.css"
import { VERTICAL_AXIS, HORIZONTAL_AXIS } from "../Chessboard-chessboard/Constants";
import Tile from "../Chessboard-chessboard/Tile/Tile";
import { Piece, Position } from "../Chessboard-chessboard/models";
import { Board } from "../Chessboard-chessboard/models/Board";
import { DecodeFen } from "../FEN tools/fenDecoder";
import { fenComponents } from "../fenComponents";
import { PieceType, TeamType } from "../Chessboard-chessboard/Types";
import EncodeFen from "../FEN tools/fen-encoder";
import MoveDisplay from "../moveDisplay/MoveDisplay";
import { backend } from "../../App";

const figures = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];

export default function ChessboardEdit(){

    const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
    const [grabPosition, setGrabPosition] = useState<Position>(new Position(-1, -1));
    const chessboardRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [turnColor, setTurnColor] = useState<string>('w');
    const [GRID_SIZE, setGridSize] = useState<number>(57.2);
    const [boardSize, setBoardSize] = useState<number>(458.4);
    const [review, setReview] = useState<boolean>(false);
    const [bestMove, setBestMove] = useState('');
    const [bestMove2, setBestMove2] = useState('');
    const [board, setBoard] = useState<Board>(new Board(DecodeFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", '').squares, 1));

    const playMove = async(playedPiece: Piece, destination: Position) => {

        let pieceInd = board.pieces.findIndex((p) => p === playedPiece);
        let destInd = board.pieces.findIndex((p) => p.position.x === destination.x && p.position.y === destination.y);


        if(destInd !== -1 && board.pieces[destInd] !== playedPiece) {
            deleteItem(destInd);
        }
        
        board.pieces[pieceInd].position = destination;
        
    }

    useEffect(() => {
        (
            async() => {
                if(activePiece === null) {
                    const finalBoard: fenComponents = {
                        squares: board.pieces,
                        turn: turnColor,
                        castling: '-',
                        enPassantSquare: null,
                    };
                    const encoder = EncodeFen(finalBoard);
                    await fetch( `${backend}/api/bestmove`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fen: encoder
                        })
                        // credentials: 'include'
                      }).then((res) => {
                        if (res && res.status === 200) {
                            res.json().then((data) => {
                                setBestMove(data)
                            });
                        } else {
                          console.log(res.status)
                        }
                    })
                }
            }
        )()
    },[board, activePiece, turnColor])

    const deleteItem = async(index: number | undefined) => {
        const newBoard : Board = new Board([], 1);
        for(let i = 0; i < board.pieces.length; i++){
            if(i === index) continue;
            newBoard.pieces.push(board.pieces[i]);
        }
        setBoard(newBoard);
    }

    function clearBoard() {
        setBoard(new Board([],1));
    }

    function handleStartGame(){
        let cnt = 0;
        for(let i = 0; i < board.pieces.length; i++){
            if(board.pieces[i].type === PieceType.KING){
                cnt++;
            }
        }
        console.log(board)
        if(!board.pieces.find((p) => p.type === PieceType.KING && p.team === TeamType.OUR) || !board.pieces.find((p) => p.type === PieceType.KING && p.team === TeamType.OPPONENT) || cnt !== 2) {
            alert("Невозможно начать партию");
            return;
        }

        const finalBoard: fenComponents = {
            squares: board.pieces,
            turn: turnColor,
            castling: '-',
            enPassantSquare: null,
        };


        const finalFen = EncodeFen(finalBoard);

        navigate("/topic/playWithFriend", {state:{gameWithFriend: true, basicFenCode: finalFen}})

    }

    function grabPiece(e: React.MouseEvent) {
        const element = e.target as HTMLElement;
        const chessboard = chessboardRef.current;
        if (activePiece === null || element.classList.contains("chess-piece")) {
          if (element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((e.clientX - chessboard.offsetLeft + window.scrollX) / GRID_SIZE) + 1;
            const grabY = Math.abs(
              Math.ceil((e.clientY + window.scrollY - chessboard.offsetTop - boardSize - GRID_SIZE/2) / GRID_SIZE)
            ) - 9;
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
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const minX = chessboard.offsetLeft - 130;
            const minY = chessboard.offsetTop - 620;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth + 80;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 40;
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
          if (activePiece && chessboardRef.current) {
            activePiece.style.zIndex = "1";
            const x = Math.floor((e.clientX - chessboardRef.current.offsetLeft + window.scrollX) / GRID_SIZE) + 1;
            const y = Math.abs(
              Math.ceil((e.clientY - chessboardRef.current.offsetTop - boardSize  + window.scrollY  - GRID_SIZE/2) / GRID_SIZE)
            ) - 9;

            if(grabPosition.y === 9) {
                let word = activePiece.style.backgroundImage.split('/')[5].split('_')[0];
                let pType: PieceType = word === 'rook' ? PieceType.ROOK : word === 'queen' ? PieceType.QUEEN : word === 'king' ? PieceType.KING : word === 'knight' ? PieceType.KNIGHT : word === 'pawn' ? PieceType.PAWN : word === 'bishop' ? PieceType.BISHOP : PieceType.QUEEN;
                let destInd = board.pieces.findIndex((p) => p.position.x === x && p.position.y === y);
                board.pieces.push(new Piece(new Position(x,y), pType, TeamType.OPPONENT, false, TeamType.OPPONENT))
                if(destInd !== -1 && (grabPosition.x !== x || grabPosition.y !== y)) {
                    deleteItem(destInd);
                }
            }

            if(grabPosition.y === -2) {
                let word = activePiece.style.backgroundImage.split('/')[5].split('_')[0];
                let pType: PieceType = word === 'rook' ? PieceType.ROOK : word === 'queen' ? PieceType.QUEEN : word === 'king' ? PieceType.KING : word === 'knight' ? PieceType.KNIGHT : word === 'pawn' ? PieceType.PAWN : word === 'bishop' ? PieceType.BISHOP : PieceType.QUEEN;
                let destInd = board.pieces.findIndex((p) => p.position.x === x && p.position.y === y);
                board.pieces.push(new Piece(new Position(x,y), pType, TeamType.OUR, false, TeamType.OUR))
                if(destInd !== -1 && (grabPosition.x !== x || grabPosition.y !== y)) {
                    deleteItem(destInd);
                }
            }

            const currentPiece = board?.pieces?.find((p) =>
                p.samePosition(grabPosition)
            );  

            if(x < 0 || x > 7 || y < 0 || y > 7) {
                let destInd = board.pieces.findIndex((p) => p.position.x === grabPosition.x && p.position.y === grabPosition.y);
                deleteItem(destInd)
            }

            if (currentPiece) {
                playMove(currentPiece, new Position(x,y));
            }
            else
            {
              activePiece.style.position = "relative";
              activePiece.style.removeProperty("top");
              activePiece.style.removeProperty("left");
            }

            setActivePiece(null);
          }
      }

    let boardDraw = [];
    for (let j = 7; j >= 0; j--) {
      for (let i = 0; i < 8; i++) {
        const number = j + i + 2;
        const piece = board?.pieces?.find((p) =>
            p.samePosition(new Position(i, j))
        );
        let currentPiece = activePiece != null ? board?.pieces?.find(p => p.samePosition(grabPosition)) : undefined;
        let highlight = currentPiece?.possibleMoves ? 
        currentPiece.possibleMoves.some(p => p.samePosition(new Position(i, j))) : false;
        let image = piece ? piece.image : undefined;
        let digit = i === 0 ? VERTICAL_AXIS[j] : '';
        let symbol = (j === 0) ? HORIZONTAL_AXIS[i] : '';

        boardDraw.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} symbol={symbol} digit={digit} highlightRightMove1={false} highlightRightMove2={false}/> );
      }
    }

    let boardPanelBlack = [];
    for (let i = 0; i < 6; i++){
        boardPanelBlack.push(<Tile image={`../../../assets/images/${figures[i]}_b.png`} number={4} highlight={false} symbol={''} digit={''} highlightRightMove1={false} highlightRightMove2={false}/> );
    }

    let boardPanelWhite = [];
    for (let i = 0; i < 6; i++){
        boardPanelWhite.push(<Tile image={`../../../assets/images/${figures[i]}_w.png`} number={4} highlight={false} symbol={''} digit={''} highlightRightMove1={false} highlightRightMove2={false}/> );
    }

    return (
        <div className="chessboardEdit">
            <MoveDisplay bestMove={bestMove} secondBestMove={bestMove2} />
            <div className="chessboardEdit-boardWrapper">
                <div className="chessboardEdit-boardPanel" ref={chessboardRef}
                    onMouseMove={(e) => movePiece(e)}
                    onMouseDown={(e) => grabPiece(e)}
                    onMouseUp={(e) => dropPiece(e)}>{boardPanelBlack}</div>
                <div className="chessboardEdit-border">
                    <div className="chessboardEdit-board" ref={chessboardRef}
                    onMouseMove={(e) => movePiece(e)}
                    onMouseDown={(e) => grabPiece(e)}
                    onMouseUp={(e) => dropPiece(e)}>
                        {boardDraw}
                    </div>
                </div>
                <div className="chessboardEdit-boardPanel" ref={chessboardRef}
                    onMouseMove={(e) => movePiece(e)}
                    onMouseDown={(e) => grabPiece(e)}
                    onMouseUp={(e) => dropPiece(e)}>{boardPanelWhite}
                </div>
            </div>
            <div className="chessboardEdit-panelWrapper">
                <button onClick={() => handleStartGame()}>Начать игру</button>
                <button onClick={() => setBoard(new Board(DecodeFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", '').squares, 1))}>Начальная позиция</button>
                <button onClick={() => clearBoard()}>Очистить доску</button>
                <div className="chessboardEdit-turn-title">Кто ходит первым?</div>
                <div className="chessboardEdit-turn">
                    <div className={turnColor === 'b' ? "chessboardEdit-turn-active" : ""} onClick={() => setTurnColor('b')}>
                        <img src="/assets/images/pawn_b.png" alt="" />
                    </div>
                    <div className={turnColor === 'w' ? "chessboardEdit-turn-active" : ""} onClick={() => setTurnColor('w')}>
                        <img src="/assets/images/pawn_w.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}