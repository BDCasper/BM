import React, { useState, useEffect } from "react";
import "./chessClock.css";

interface ChessClockProps {
  initialTime: number; // initial time in seconds for each player
  teamTurn: "white" | "black"; // a variable that changes based on the player's turn
  checkStart: boolean;
  isFlipped: boolean;
  setWinner: (win: string) => any;
}

const ChessClock: React.FC<ChessClockProps> = ({ initialTime, teamTurn, checkStart, isFlipped, setWinner }) => {
  const [whiteTime, setWhiteTime] = useState(initialTime*60);
  const [blackTime, setBlackTime] = useState(initialTime*60);
  const [isRunning, setIsRunning] = useState(false);

  // Effect to start the clock automatically after the first move
  useEffect(() => {
    if (!isRunning && teamTurn !== null && checkStart) {
      setIsRunning(true);
    }
  }, [teamTurn]);

  // Effect to handle the countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        if (teamTurn === "white") {
          setWhiteTime((prevTime) => Math.max(prevTime - 1, 0));
        } else if (teamTurn === "black") {
          setBlackTime((prevTime) => Math.max(prevTime - 1, 0));
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, teamTurn]);

  const handleReset = () => {
    setWhiteTime(initialTime);
    setBlackTime(initialTime);
    setIsRunning(false);
  };

  useEffect(() => {
    (
      async() => {
        if(whiteTime === 0 || blackTime === 0){
          if(whiteTime === 0){
            setWinner('b')
            return;
          }
          if(blackTime === 0){
            setWinner('w')
            return;
          }
        }
      }
    )()
  },[whiteTime, blackTime])


  return (
    <div className="container">
      <div className="clock-container">
        {
            isFlipped === true ? 
            <>
                <div className={`clock ${teamTurn === "white" && isRunning ? "active" : ""}`}>
                    <h2 className="player-label">Белые</h2>
                    <div className="time">{formatTime(whiteTime)}</div>
                </div>
                <div className={`clock ${teamTurn === "black" && isRunning ? "active" : ""}`} id="secondClock">
                    <h2 className="player-label">Черные</h2>
                    <div className="time">{formatTime(blackTime)}</div>
                </div>
            </>
            :
            <>
                <div className={`clock ${teamTurn === "black" && isRunning ? "active" : ""}`}>
                    <h2 className="player-label">Черные</h2>
                    <div className="time">{formatTime(blackTime)}</div>
                </div>
                <div className={`clock ${teamTurn === "white" && isRunning ? "active" : ""}`} id="secondClock">
                    <h2 className="player-label">Белые</h2>
                    <div className="time">{formatTime(whiteTime)}</div>
                </div>
            </>
        }
      </div>
      {/* <div className="button-container">
        <button className="button" onClick={handleReset}>Reset</button>
      </div> */}
    </div>
  );
};

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;  
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default ChessClock;
