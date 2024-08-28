import { Piece, Position } from "../Chessboard-chessboard/models";
import { PieceType, TeamType } from "../Chessboard-chessboard/Types";
import { fenComponents } from "../fenComponents";

export const DecodeFen: any = (fen: string, move: string)=>{
  const newboard: fenComponents = {
    squares: [],
    turn: '',
    castling: '',
    enPassantSquare: null,
  };
  

  const parts = fen.split(' ');
  
  newboard.turn = move === '' ? parts[1] : move === 'b' ? TeamType.OPPONENT : TeamType.OUR;

  if(move !== '') parts[1] = move;

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