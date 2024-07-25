export const ReverseFen = async(fen: string) => {
    const parts = fen.split(" ");
    const board = parts[0];
    const sideToMove = parts[1];
    const castlingRights = parts[2];
    const enPassant = parts[3];
    const halfmoveClock = parts[4];
    const fullmoveNumber = parts[5];


    // Flip the board
    const rows = board.split("/");
    const flippedRows = rows.reverse().map(row => {
        return row.split('').map(char => {
            if (char >= '1' && char <= '8') return char; // keep numbers as is
            if (char >= 'a' && char <= 'z') return char.toUpperCase(); // lowercase to uppercase
            if (char >= 'A' && char <= 'Z') return char.toLowerCase(); // uppercase to lowercase
            return char;
        }).join('');
    });

    // Swap side to move
    const flippedSideToMove = sideToMove;

    // Update castling rights
    const flipCastling = (castling: string): string => {
        let newCastlingRights = '';
        if (castling.includes('K')) newCastlingRights += 'k';
        if (castling.includes('Q')) newCastlingRights += 'q';
        if (castling.includes('k')) newCastlingRights += 'K';
        if (castling.includes('q')) newCastlingRights += 'Q';
        return newCastlingRights || '-';
    };
    const flippedCastlingRights = flipCastling(castlingRights);

    // Mirror en passant square if applicable
    const flipEnPassant = (square: string): string => {
        if (square === '-') return square;
        const file = square[0];
        const rank = square[1];
        const flippedRank = (parseInt(rank, 10) === 3) ? '6' : (parseInt(rank, 10) === 6) ? '3' : rank;
        return file + flippedRank;
    };
    const flippedEnPassant = flipEnPassant(enPassant);

    return `${flippedRows.join("/")} ${flippedSideToMove} ${flippedCastlingRights} ${flippedEnPassant} ${halfmoveClock} ${fullmoveNumber}`;
}
