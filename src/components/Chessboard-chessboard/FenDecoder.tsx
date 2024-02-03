import { useState } from "react";
// import { Piece } from "./models";
// import { Position } from "./models";
// import { PieceType, TeamType } from "./Types";

// interface fenComponents {
//     squares: Piece[];
//     turn: string;
//     castling: string;
//     enPassantSquare: string | null;
//   }

// export default function fenDecoder(){  
//   const DecodeFen: any = (fen: String)=>{
//     const board: fenComponents = {
//       squares: [],
//       turn: '',
//       castling: '',
//       enPassantSquare: null,
//     };

//     const parts = fen.split(' ');
    
//     board.turn = parts[1];

//     let row = 0;
//     let col = 0;
    
//     for (let i = 0; i < parts[0].length; i++) {
//         const char = parts[0][i];
//         if (char === '/') {
//           row += 1;
//           col = 0;
//         } else if (isNaN(Number(char))) {
//           const piece: Piece = parts[1] === 'w' ? new Piece(
//             new Position(col, 7-row), 
              
//             char.toUpperCase() === 'R' ? PieceType.ROOK : 
//                 (char.toUpperCase() === "N" ? PieceType.KNIGHT : 
//                 (char.toUpperCase() === "B" ? PieceType.BISHOP : 
//                 (char.toUpperCase() === "Q" ? PieceType.QUEEN : 
//                 (char.toUpperCase() === "K" ? PieceType.KING : 
//                 PieceType.PAWN)))),

//             char === char.toUpperCase() ? TeamType.OUR : TeamType.OPPONENT,
//             false,
//             char === char.toUpperCase() ? TeamType.OUR: TeamType.OPPONENT
//           ) : new Piece(
//             new Position(7-col, row), 
              
//             char.toUpperCase() === 'R' ? PieceType.ROOK : 
//                 (char.toUpperCase() === "N" ? PieceType.KNIGHT : 
//                 (char.toUpperCase() === "B" ? PieceType.BISHOP : 
//                 (char.toUpperCase() === "Q" ? PieceType.QUEEN : 
//                 (char.toUpperCase() === "K" ? PieceType.KING : 
//                 PieceType.PAWN)))),

//             char === char.toUpperCase() ? TeamType.OPPONENT : TeamType.OUR,
//             false,
//             char === char.toUpperCase() ? TeamType.OUR : TeamType.OPPONENT
//           )

//           board.squares.push(piece);
//           col += 1;
//         } else {
//           col += Number(char);
//         }
//     }

//     // Parse additional FEN information
//     board.castling = parts[2];
//     board.enPassantSquare = parts[3] === '-' ? null : parts[3];
    
//     return board;
//   }

// }