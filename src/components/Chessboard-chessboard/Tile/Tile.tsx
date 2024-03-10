import "./Tile.css";

interface Props1 {
  image?: string;
  number: number;
  highlight: boolean;
  digit: string;
  symbol: string;
  highlightRightMove1: boolean;
  highlightRightMove2: boolean;
}

export default function Tile({ number, image, highlight, symbol, digit, highlightRightMove1, highlightRightMove2}: Props1) {
  const className: string = ["tile",
    number % 2 === 0 && "black-tile",
    number % 2 !== 0 && "white-tile",
    highlight && "tile-highlight",
    image && "chess-piece-tile",
    (highlightRightMove1 && number % 2 === 0) && "rightMoveBlack1",
    (highlightRightMove1 && number % 2 !== 0) && "rightMoveWhite1",
    (highlightRightMove2 && number % 2 === 0) && "rightMoveBlack2",
    (highlightRightMove2 && number % 2 !== 0) && "rightMoveWhite2",].filter(Boolean).join(' ');
  return (
    <div className={className}>
      {image && <div style={{ backgroundImage: `url(${image})`}} className="chess-piece"></div>}
      <p id="symbol">{symbol}</p>
      <p id="digit">{digit}</p>
    </div>
  );
}