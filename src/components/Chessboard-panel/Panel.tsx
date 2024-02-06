import { useEffect, useState } from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { backend } from "../../App";

export default function Panel() {

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  const [arrayOfFens, setArrayOfFens] = useState<string[]>([""]);

  useEffect(() => {
    (
      async () => {
        await fetch( `http://${backend}/api/tema1` /*backend*/, {
          headers: { 'Content-Type': 'application/json' },
          // credentials: 'include'
        }).then((res) => {
          if (res && res.status === 200) {
          res.json().then((data) => data.map((fen: any) => fen.fen)).then((fens) => setArrayOfFens(fens))
          } else {
            console.log("No FEN :(")
          }
        })
      }
    )();
  }, []);

  useEffect(() => {
    (
      async () => {
        setCurrentFen(arrayOfFens[solved]);
      }
    )();
  },[solved]);

  useEffect(() => {
    (
      async () => {
        setCurrentFen(arrayOfFens[solved]);
      }
    )();
  },[arrayOfFens]);

    return (
      <>
        
        <div id="panel">    

          <div id="referee">
            <Referee fenCode={fenCode} setSolved={setSolved} solved={solved}/>
          </div>

        </div>

      </>
    );

}
