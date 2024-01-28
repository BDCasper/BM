import React, { useEffect, useState } from 'react';
import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import { Pawn } from './components/Chessboard-chessboard/models/Pawn';
import { Piece } from './components/Chessboard-chessboard/models';
import { Position } from './components/Chessboard-chessboard/models';
import { PieceType, TeamType } from './components/Chessboard-chessboard/Types';

function App() {

  const [fen, setFen] = useState<Piece[]>([]);
  const [data, setData] = useState<String>("");
  const [board, setBoard] = useState<fenComponents>({squares: [],
                                                    turn: '',
                                                    castling: '',
                                                    enPassantSquare: null,});
  const [newPosition, setNewPosition] = useState<Position>();
  const [botPosition, setBotPosition] = useState<Position[]>([]);
  

  interface fenComponents {
    squares: Piece[];
    turn: string;
    castling: string;
    enPassantSquare: string | null;
  }

  const DecodeFen: any = (fen: String)=>{
    const board: fenComponents = {
      squares: [],
      turn: '',
      castling: '',
      enPassantSquare: null,
    };
  
    const parts = fen.split(' ');
    
    board.turn = parts[1];
    //   new Piece( new Position(0, 7), PieceType.ROOK, TeamType.OPPONENT, false)
    
    // Parse the board state
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

          board.squares.push(piece);
          col += 1;
        } else {
          col += Number(char);
        }
    }
  
    // Parse additional FEN information
    board.castling = parts[2];
    board.enPassantSquare = parts[3] === '-' ? null : parts[3];
    
    return board;
  }

  useEffect(() => {
    (
      async () => {
        // await fetch(`${backend}/api/user/`, {
        //   headers: { 'Content-Type': 'application/json' },
        //   credentials: 'include'
        // }).then((response) => {
        //   if (response && response.status === 200) {
        //     response.json().then((data) => {
        //       setData(data)
        //       console.log(data)
        //     })
        //   } else {
        //     console.log("No FEN :(")
        //   }
        // })
        setData("6r1/p7/1p2k3/2p5/2P5/1PK5/6B1/8 b - - 0 1");
        
        const board = DecodeFen(data);
        setBoard(board);
        setFen(board.squares);
        setBotPosition([new Position(6,5),new Position(6,4)]);
      }
    )();
  }, []);

  useEffect(() => {
    (
      async () => {       
        const board = DecodeFen(data)
        setBoard(board);
        setFen(board.squares);
      }
    )();
  }, [data])


  console.log(newPosition)

  return (
    <div className="app">
      <div id="chess-game">
       <Panel fen={fen} fenComponents={board} setNewPosition={setNewPosition} botPosition={botPosition}/>
      </div>
    </div>
  );
}

export default App;
export default interface fenComponents{squares: Piece[];
  turn: string;
  castling: string;
  enPassantSquare: string | null;};