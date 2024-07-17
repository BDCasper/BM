import { Piece } from "./Chessboard-chessboard/models";

export interface fenComponents {
    squares: Piece[];
    turn: string;
    castling: string;
    enPassantSquare: string | null;
}