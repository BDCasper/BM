import { Piece, Position } from "../Chessboard-chessboard/models";
import { PieceType, TeamType } from "../Chessboard-chessboard/Types";
import { fenComponents } from "../fenComponents";

export default function EncodeFen(board: fenComponents) {
  let fen = '';

  for (let row = 7; row >= 0; row--) {
    let emptySquares = 0;
    
    for (let col = 0; col < 8; col++) {
      const piece = board.squares.find(p => p.position.x === col && p.position.y === row);
      
      if (piece) {
        if (emptySquares > 0) {
          fen += emptySquares;
          emptySquares = 0;
        }

        const pieceType = piece.type === PieceType.ROOK ? 'R' :
                          piece.type === PieceType.KNIGHT ? 'N' :
                          piece.type === PieceType.BISHOP ? 'B' :
                          piece.type === PieceType.QUEEN ? 'Q' :
                          piece.type === PieceType.KING ? 'K' :
                          'P';
        
        fen += piece.team === TeamType.OUR ? pieceType : pieceType.toLowerCase();
      } else {
        emptySquares += 1;
      }
    }

    if (emptySquares > 0) {
      fen += emptySquares;
    }

    if (row > 0) {
      fen += '/';
    }
  }

  fen += ` ${board.turn}`;
  fen += ` ${board.castling || '-'}`;
  fen += ` ${board.enPassantSquare || '-'}`;
  fen += ` 0 1`; // For simplicity, assuming no halfmove clock and fullmove number

  return fen;
};
