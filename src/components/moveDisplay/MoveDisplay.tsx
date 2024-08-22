import React from 'react';
import './MoveDisplay.css'; // We'll create this CSS file for styling

interface MoveDisplayProps {
  bestMove: string;
  secondBestMove: string;
}

const MoveDisplay: React.FC<MoveDisplayProps> = ({ bestMove, secondBestMove }) => {
  return (
    <div className="move-display-container">
      <div className="move-display">
        <h3>Лучший ход</h3>
        <p className="best-move">{bestMove}</p>
      </div>
    </div>
  );
};

export default MoveDisplay;