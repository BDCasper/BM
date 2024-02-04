import "./Tile.css";

interface Props1 {
  image?: string;
  number: number;
  highlight: boolean;
  digit: string;
  symbol: string;
}

export default function Tile({ number, image, highlight, symbol, digit }: Props1) {
  const className: string = ["tile",
    number % 2 === 0 && "black-tile",
    number % 2 !== 0 && "white-tile",
    highlight && "tile-highlight",
    image && "chess-piece-tile"].filter(Boolean).join(' ');
  return (
    <div className={className}>
      {image && <div style={{ backgroundImage: `url(${image})` }} className="chess-piece"></div>}
      <p id="symbol">{symbol}</p>
      <p id="digit">{digit}</p>
    </div>
  );
}