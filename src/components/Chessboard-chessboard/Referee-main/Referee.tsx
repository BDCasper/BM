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

interface RefereeProps {
    setSolved: (solved: number) => any;
    fenCode: string;
    solved: number;
    activeIndex: number;
    setActiveIndex: (index: number) => any;
    lengthOfArray: number;
    arrayOfObjects: TaskProps[];
    isTest: boolean;
    closed: boolean;
    setPopOpen: (pop: boolean) => any;
    user: User;
    arrayOfSolved: Set<number>;
    gameWithBot: boolean|undefined;
}

interface fenComponents {
    squares: Piece[];
    turn: string;
    castling: string;
    enPassantSquare: string | null;
}

const Referee: React.FC<RefereeProps> = ({setSolved, fenCode, solved, activeIndex, setActiveIndex, lengthOfArray, arrayOfObjects, isTest, closed, setPopOpen, user, arrayOfSolved, gameWithBot}) => {

    const modalRef = useRef<HTMLDivElement>(null);
    const checkmateModalRef = useRef<HTMLDivElement>(null);
    const [newboard, setNewBoard] = useState<fenComponents>({squares: [], turn: '', castling: '', enPassantSquare: null,});
    const [fen, setFen] = useState<Piece[]>([]);
    const [winSound] = useSound('win.wav', { volume: 0.2 });
    const [everyMove, setEveryMover] = useState<Board[]>([]);
    const [movePtr, setMovePtr] = useState<number>(0);

    const DecodeFen: any = (fen: String)=>{
        const newboard: fenComponents = {
          squares: [],
          turn: '',
          castling: '',
          enPassantSquare: null,
        };
        

        const parts = fen.split(' ');
        
        newboard.turn = parts[1];

        let row = 0;
        let col = 0;
        
        for (let i = 0; i < parts[0].length; i++) {
            const char = parts[0][i];
            if (char === '/') {
              row += 1;
              col = 0;
            } else if (isNaN(Number(char))) {
              const piece: Piece = parts[1] === 'w' ? new Piece(
                new Position(col, 7-row), 
                  
                char.toUpperCase() === 'R' ? PieceType.ROOK : 
                    (char.toUpperCase() === "N" ? PieceType.KNIGHT : 
                    (char.toUpperCase() === "B" ? PieceType.BISHOP : 
                    (char.toUpperCase() === "Q" ? PieceType.QUEEN : 
                    (char.toUpperCase() === "K" ? PieceType.KING : 
                    PieceType.PAWN)))),
    
                char === char.toUpperCase() ? TeamType.OUR : TeamType.OPPONENT,
                false,
                char === char.toUpperCase() ? TeamType.OUR: TeamType.OPPONENT
              ) : new Piece(
                new Position(7-col, row), 
                  
                char.toUpperCase() === 'R' ? PieceType.ROOK : 
                    (char.toUpperCase() === "N" ? PieceType.KNIGHT : 
                    (char.toUpperCase() === "B" ? PieceType.BISHOP : 
                    (char.toUpperCase() === "Q" ? PieceType.QUEEN : 
                    (char.toUpperCase() === "K" ? PieceType.KING : 
                    PieceType.PAWN)))),
    
                char === char.toUpperCase() ? TeamType.OPPONENT : TeamType.OUR,
                false,
                char === char.toUpperCase() ? TeamType.OUR : TeamType.OPPONENT
              )
    
              newboard.squares.push(piece);
              col += 1;
            } else {
              col += Number(char);
            }
        }
      
        newboard.castling = parts[2];
        newboard.enPassantSquare = parts[3] === '-' ? null : parts[3];
        
        return newboard;
    }

    useEffect(() => {
        (
            async () => {
                const newboard = DecodeFen(fenCode);
                setNewBoard(newboard);
                setFen(newboard.squares);
            }
          )();
    }, [fenCode])

    const initialBoard: Board = new Board(fen, 1);
    initialBoard.calculateAllMoves();
    const [board, setBoard] = useState<Board>(initialBoard.clone());

    useEffect(() => {
        (
            async () => {
                setBoard(new Board(fen, 1).clone())
            }
        )();
      }, [fen]);

      useEffect(() => {
        (
            async () => {
                if(board.pieces.length !== 0)
                    {
                        if(!everyMove.some((bord) => (bord === board)))
                        everyMove.push(board);
                    }
            }
        )();
      }, [board]);

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
            clonedBoard.totalTurns += 1;
            playedMoveIsValid = clonedBoard.playMove(enPassantMove,
                validMove, playedPiece,
                destination);
                
            if(clonedBoard.winningTeam !== undefined) {
                checkmateModalRef.current?.classList.remove("hidden");
                if(gameWithBot) winSound();
            }
            return clonedBoard;
        })

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
                const piece = board.pieces.find(
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

    function changeMove(way:number) {
        if(everyMove && everyMove.length !== 0){
            if(way === 1 && movePtr + 1 < everyMove.length){
                if(movePtr === everyMove.length-1) 
                {
                    setBoard(everyMove[movePtr])
                    setMovePtr(movePtr+1)
                }
                else 
                {
                    setBoard(everyMove[movePtr+1])
                    setMovePtr(movePtr+1)
                }
            }
            if(way === -1 && movePtr - 1 >= 0){
                setBoard(everyMove[movePtr-1])
                if(movePtr !== 0) setMovePtr(movePtr-1)
            }
        }
    }

    function restartGame() {
        checkmateModalRef.current?.classList.add("hidden");
        setBoard(initialBoard.clone());
    }

    return (
        <div className="referee">
            {gameWithBot &&
            <>
                <div className="modal-checkmate hidden" ref={checkmateModalRef}>
                    <div className="modal-body-checkmate">
                        <div className="checkmate-body-checkmate">
                            <span>Победа {board.winningTeam === TeamType.OUR ? "белых" : "чёрных"}!</span>
                            <button onClick={restartGame}>Играть снова</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="arrows">
                    <div className="leftArrowWrap" onClick={() => {changeMove(-1)}}>
                        <img className="arrow" src="/assets/images/leftArrow.svg" />
                    </div>
                    <div className="rightArrowWrap" onClick={() => {changeMove(1)}}>
                        <img className="arrow" src="/assets/images/rightArrow.svg" /></div>
                    </div>
                </div>
            </>

            }
            <Chessboard playMove={playMove}
                pieces={board.pieces} 
                fenComponents={newboard} 
                setSolved={setSolved} 
                solved={solved} 
                activeIndex={activeIndex} 
                setActiveIndex={setActiveIndex} 
                lengthOfArray={lengthOfArray} 
                arrayOfObjects={arrayOfObjects}
                isTest={isTest}
                closed={closed}
                setPopOpen={setPopOpen}
                setBoard={setBoard}
                board={board}
                user={user}
                arrayOfSolved={arrayOfSolved}
                gameWithBot={gameWithBot}
                everyMove={everyMove}
                movePtr={movePtr}
                />
        </div>
    )
}

export default Referee;
export default interface boardCompanents{squares: Piece[];
    turn: string;
    castling: string;
    enPassantSquare: string | null;};