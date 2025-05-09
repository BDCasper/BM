import { useEffect, useRef, useState } from "react";
import { Piece, Position } from "../models";
import { Board } from "../models/Board";
import { Pawn } from "../models/Pawn";
import { bishopMove, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves, kingMove, knightMove, pawnMove, queenMove, rookMove } from "../referee";
import { PieceType, TeamType } from "../Types";
import Chessboard from "../Chessboard/Chessboard";
import TaskProps from "../../Chessboard-panel/Panel"
import { User } from "../../../App";
import useSound from "use-sound";
import { DecodeFen } from "../../FEN tools/fenDecoder";
import EncodeFen from "../../FEN tools/fen-encoder";
import { fenComponents } from "../../fenComponents";
import { useNavigate } from "react-router-dom";
import { backend } from "../../../App";
import ChessClock from "../Chess clock/chessClock";
import InitialTime from "./initialTime";
import ChessboardBot from "../Chessboard-botGame/Chessboard-botGame";

interface RefereeProps {
    setSolved: (solved: number) => any;
    fenCode: string;
    solved: number;
    activeIndex: number;
    setActiveIndex: (index: number) => any;
    lengthOfArray: number;
    arrayOfObjects: TaskProps[];
    mode: string;
    closed: boolean;
    setPopOpen: (pop: boolean) => any;
    user: User;
    arrayOfSolved: Set<number>;
    gameWithFriend: boolean|undefined;
    handleAnimation: (check: boolean) => any;
    setProgress: (num: number) => any;
    level: number
    moveTurn: string;
}

const Referee: React.FC<RefereeProps> = ({setSolved, fenCode, solved, activeIndex, setActiveIndex, lengthOfArray, arrayOfObjects, mode, closed, setPopOpen, user, arrayOfSolved, gameWithFriend, handleAnimation, setProgress, level, moveTurn}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);
    const [newboard, setNewBoard] = useState<fenComponents>({squares: [], turn: '', castling: '', enPassantSquare: null,});
    const [fen, setFen] = useState<Piece[]>([]);
    const [winSound] = useSound('win.wav', { volume: 0.2 });
    const [moveSound] = useSound('/move-self.mp3', { volume: 0.2 });
    const [everyMove, setEveryMove] = useState<Board[]>([]);
    const [movePtr, setMovePtr] = useState<number>(0);
    const [reviewMode, setReviewMode] = useState<boolean>(false);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [initialTime, setInitialTime] = useState<string>('');
    const [initialPopupOpen, setInitialPopupOpen] = useState<boolean>(true);
    const closePopup = () => setInitialPopupOpen(false);
    const [winner, setWinner] = useState<string>('');
    const [botMove, setBotMove] = useState<Position[]>([new Position(-1,-1)]);
    const [increment, setIncrement] = useState<string>('');
    const [giveUp, setGiveUp] = useState<string>('');

    useEffect(() => {
        (
            async () => {
                const newboard = DecodeFen(fenCode, moveTurn);
                setNewBoard(newboard);
                setFen(newboard.squares);
            }
          )();
    }, [fenCode])

    useEffect(() => {
        // Add the event listener on mount
        window.addEventListener('keydown', changeMove);
    
        // Remove the event listener on unmount
        return () => {
          window.removeEventListener('keydown', changeMove);
        };
      }, [changeMove, movePtr, everyMove]);

    const setGame = async(inTime: string, incr:string) => {
        setInitialTime(inTime);
        setIncrement(incr);
    }

    useEffect(() => {
        (
            async () => {
                if(winner !== ''){
                    checkmateModalRef.current?.classList.remove("hidden");
                    winSound();
                    setInitialTime('');
                }
            }
          )();
    }, [winner])

    const initialBoard: Board = new Board(fen, mode === 'botGame' && moveTurn === 'b' ? 2 : 1);
    initialBoard.calculateAllMoves();
    const [board, setBoard] = useState<Board>(initialBoard.clone());

    useEffect(() => {
        (
            async () => {
                setBoard(new Board(fen, mode === 'botGame' && moveTurn === 'b' ? 2 : 1).clone())
            }
        )();
      }, [fen]);

      useEffect(() => {
        (
            async () => {
                if(board?.pieces?.length !== 0 && initialPopupOpen === false)
                {
                    board.calculateAllMoves()
                    let possible = '';
                    if(board.currentTeam === 'w' && board.castlingMoves[1] && board.castlingMoves[1].length > 0){
                        if(board.castlingMoves[1].some((pos) => pos.x === 6 && pos.y === 0)){
                            possible += 'K'
                        }
                        if(board.castlingMoves[1].some((pos) => pos.x === 2 && pos.y === 0)){
                            possible += 'Q'
                        }
                    }
                    if(board.currentTeam === 'b' && board.castlingMoves[0].length > 0){
                        if(board.castlingMoves[0].some((pos) => pos.x === 6 && pos.y === 7) && board.pieces.some((pi) => pi.type === PieceType.KING && pi.position.x === 4)){
                            possible += 'k'
                        }
                        if(board.castlingMoves[0].some((pos) => pos.x === 2 && pos.y === 7) && board.pieces.some((pi) => pi.type === PieceType.KING && pi.position.x === 4)){
                            possible += 'q'
                        }
                    }
                    if(mode === 'botGame'){
                        const finalBoard: fenComponents = {
                            squares: board.pieces,
                            turn: board.currentTeam,
                            castling: possible,
                            enPassantSquare: null,
                        };
                        const encoder = EncodeFen(finalBoard)
                        await fetch( `${backend}/api/bestmove`, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                                // credentials: 'include',
                                body: JSON.stringify({
                                fen: encoder,
                                level: level,
                                team: 'b'
                            })
                        }).then((response) => {
                        if (response && response.status === 200) {
                            response.json().then((data) => {
                                setBotMove([new Position(data.position.fromX, data.position.fromY), new Position(data.position.toX, data.position.toY)]);
                                })
                            }
                        })
                    }
                }
            }
        )();
      }, [board, initialPopupOpen]);


    const playMove = async(playedPiece: Piece, destination: Position): Promise<boolean> => {

        if (playedPiece.possibleMoves === undefined) return false;
        
        let playedMoveIsValid = false;
        
        const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

        if (!validMove) return false;
        const enPassantMove = isEnPassantMove(
            playedPiece.position,
            destination,
            playedPiece.type,
            playedPiece.team
        );  
        setMovePtr(movePtr + 1);
        
        setBoard((previousBoard) => {
            const clonedBoard = previousBoard.clone();
            if(mode === 'labirint' || mode === 'basic') clonedBoard.totalTurns += 2;
            else clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove,
                validMove, playedPiece,
                destination);

            everyMove.push(clonedBoard);

            if(clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
                setMovePtr(everyMove.length-1)
                if(gameWithFriend) winSound();
            }
            return clonedBoard;
        })

        moveSound();
        return playedMoveIsValid;
    }

    function isEnPassantMove(
        initialPosition: Position,
        desiredPosition: Position,
        type: PieceType,
        team: TeamType
    ) {
        const pawnDirection = team === TeamType.OUR ? 1 : -1;

        if (type === PieceType.PAWN) {
            if (
                (desiredPosition.x - initialPosition.x === -1 ||
                    desiredPosition.x - initialPosition.x === 1) &&
                desiredPosition.y - initialPosition.y === pawnDirection
            ) {
                const piece = board?.pieces?.find(
                    (p) =>
                        p.position.x === desiredPosition.x &&
                        p.position.y === desiredPosition.y - pawnDirection &&
                        p.isPawn &&
                        (p as Pawn).enPassant
                );
                if (piece) {
                    return true;
                }
            }
        }

        return false;
    }

    function isValidMove(initialPosition: Position, desiredPosition: Position, type: PieceType, team: TeamType) {
        let validMove = false;
        switch (type) {
            case PieceType.PAWN:
                validMove = pawnMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KNIGHT:
                validMove = knightMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.BISHOP:
                validMove = bishopMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.ROOK:
                validMove = rookMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.QUEEN:
                validMove = queenMove(initialPosition, desiredPosition, team, board.pieces);
                break;
            case PieceType.KING:
                validMove = kingMove(initialPosition, desiredPosition, team, board.pieces);
        }

        return validMove;
    }


    const flipBoard = (board: Board): Board => {
        // Calculate all possible moves on the original board
        board.calculateAllMoves();
    
        // Create flipped pieces with flipped positions and possible moves
        const flippedPieces: Piece[] = board.pieces.map(piece => {
            const flippedPosition = new Position(7 - piece.position.x, 7 - piece.position.y);
            
            // Flip possible moves
            const flippedPossibleMoves = piece.possibleMoves?.map(move => new Position(7 - move.x, 7 - move.y));
    
            // Create a new flipped piece
            const flippedPiece = new Piece(
                flippedPosition,
                piece.type,
                piece.team === TeamType.OUR ? TeamType.OPPONENT : TeamType.OUR,
                piece.hasMoved,
                piece.skin
            );
    
            flippedPiece.image = piece.image;
            flippedPiece.possibleMoves = flippedPossibleMoves;
    
            // Handle en passant for pawns
            if (piece.type === PieceType.PAWN) {
                (flippedPiece as Pawn).enPassant = (piece as Pawn).enPassant;
            }
    
            return flippedPiece;
        });
    
        // Create a new Board instance with the flipped pieces and same turn count
        const flippedBoard = new Board(flippedPieces, board.totalTurns+1);
        // Recalculate all possible moves on the flipped board
        flippedBoard.calculateAllMoves();
    
        return flippedBoard;
    };

    const handleFlip = async() => {
        setIsFlipped(!isFlipped);
        const newBoard = flipBoard(board)
        setBoard(newBoard);
    }

    useEffect(() => {
        (
            async() => {
                setEveryMove([]);
            }
        )()
    }, [activeIndex])

    function changeMove(event: KeyboardEvent) {
        if (everyMove && everyMove.length !== 0) {
          newboard.turn === "w" ? (newboard.turn = "b") : (newboard.turn = "w");
    
          if (event.key === "ArrowRight" && movePtr + 1 < everyMove.length) {
            if (movePtr === everyMove.length - 1) {
              setBoard(everyMove[movePtr]);
              setMovePtr(movePtr + 1);
            } else {
              setBoard(everyMove[movePtr + 1]);
              setMovePtr(movePtr + 1);
            }
          }
          if (event.key === "ArrowLeft" && movePtr - 1 >= 0) {
            setBoard(everyMove[movePtr - 1]);
            if (movePtr !== 0) setMovePtr(movePtr - 1);
          }
        }
      }

    function GiveUp() {
        setGiveUp(moveTurn === 'w' ? TeamType.OPPONENT : TeamType.OUR);
        checkmateModalRef.current?.classList.remove("hidden");
    }

    function restartGame(way: string) {
        if(way === 'continue'){
            setWinner('')
            setInitialTime('');
            checkmateModalRef.current?.classList.add("hidden");
        }
        if(way === 'restart'){
            checkmateModalRef.current?.classList.add("hidden");
            setBoard(initialBoard.clone());
            setGiveUp('');
            window.location.reload();
        }
    }


    return (
        <div className="referee">
            {gameWithFriend && initialPopupOpen && <InitialTime onClose={closePopup} onSave={setGame}/>}
            {mode === 'botGame' && initialPopupOpen && <InitialTime onClose={closePopup} onSave={setGame}/>}
            {(gameWithFriend || mode === 'botGame') &&
            <>
                <div className="modal-checkmate hidden" ref={checkmateModalRef}>
                    <div className="modal-body-checkmate">
                        <div className="checkmate-body-checkmate">
                            {
                                board.winningTeam === TeamType.NONE ?
                                <>
                                    <span>Ничья!</span>
                                    <button onClick={() => restartGame('restart')}>Играть снова</button>
                                </>
                                :
                                <>
                                    <span>Победа {board.winningTeam ? (board.winningTeam === TeamType.OUR ? "белых" : "чёрных") : winner === 'w' ? "чёрных" : winner === 'b' ? "белых" : giveUp === TeamType.OUR ? "белых" : giveUp === TeamType.OPPONENT ? "черных" : ''}!</span>
                                    <div>
                                        <button onClick={() => restartGame('restart')}>Играть снова</button>
                                        {winner && <button className="checkmate-body-checkmate-continue" onClick={() => restartGame('continue')}>Продолжить партию</button>}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
                
            </>
            }

            {
                gameWithFriend &&
                <button className="chessBoard-flipBoard" onClick={handleFlip}>Перевернуть доску</button>
            }

            {
                mode === 'botGame' ? 
                <div className={mode === 'botGame' ? initialTime === '' ? 'chessboard-botGame' : 'chessboard-botGame-wTimer' : ''}>
                    {initialTime !== '' && mode === 'botGame' && <ChessClock initialTime={Number(initialTime)} teamTurn={isFlipped === false ? (board.currentTeam === TeamType.OUR ? 'white' : 'black') : (board.currentTeam === TeamType.OUR ? 'black' : 'white')} checkStart={board.totalTurns > 1} isFlipped={isFlipped} setWinner={setWinner} increment={Number(increment)}/>}
                    <ChessboardBot playMove={playMove}
                        pieces={board?.pieces} 
                        fenComponents={newboard} 
                        setPopOpen={setPopOpen}
                        setBoard={setBoard}
                        everyMove={everyMove}
                        movePtr={movePtr}
                        botMover={botMove}
                        firstMove={moveTurn === 'b' ? 'yes' : 'no'}
                        />
                    <button className="chessboard-botGame-giveUpButton" onClick={GiveUp}>Сдаться</button>
                </div>
                :
                <div className={gameWithFriend ? initialTime === '' ? 'chessboard-gameWithFriend' : 'chessboard-gameWithFriend-wTimer' : ''}>
                    {initialTime !== '' && gameWithFriend && <ChessClock initialTime={Number(initialTime)} teamTurn={isFlipped === false ? (board.currentTeam === TeamType.OUR ? 'white' : 'black') : (board.currentTeam === TeamType.OUR ? 'black' : 'white')} checkStart={board.totalTurns > 1} isFlipped={isFlipped} setWinner={setWinner} increment={Number(increment)}/>}
                    <Chessboard playMove={playMove}
                        pieces={board?.pieces} 
                        fenComponents={newboard} 
                        setSolved={setSolved} 
                        solved={solved} 
                        activeIndex={activeIndex} 
                        setActiveIndex={setActiveIndex} 
                        lengthOfArray={lengthOfArray} 
                        arrayOfObjects={arrayOfObjects}
                        mode={mode}
                        closed={closed}
                        setPopOpen={setPopOpen}
                        setBoard={setBoard}
                        board={board}
                        user={user}
                        arrayOfSolved={arrayOfSolved}
                        gameWithFriend={gameWithFriend}
                        everyMove={everyMove}
                        movePtr={movePtr}
                        handleAnimation={handleAnimation}
                        setReviewMode={setReviewMode}
                        setProgress={setProgress}
                        gameWithBot={gameWithFriend}
                        setEveryMove={setEveryMove}
                        />
                </div>
            }
        </div>
    )
}

export default Referee;
export default interface boardCompanents{squares: Piece[];
    turn: string;
    castling: string;
    enPassantSquare: string | null;};