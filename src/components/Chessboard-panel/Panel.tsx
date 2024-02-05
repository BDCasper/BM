import { useEffect, useState } from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { backend } from "../../App";

export default function Panel() {

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  let arrayOfFens: string[] = [""]


  useEffect(() => {
    (
      async () => {
        await fetch(backend, {
          headers: { 'Content-Type': 'application/json' },
          // credentials: 'include'
        }).then((res) => {
          if (res && res.status === 200) {
            res.json().then((data) => {
              const fens: string[] = data.map((fen: any) => fen.fen)
              arrayOfFens = fens //TODO
              setCurrentFen(arrayOfFens[solved])
            })
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
        console.log(solved)
        setCurrentFen(arrayOfFens[solved])
        console.log(fenCode)
      }
    )();
  }, [solved]);

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
