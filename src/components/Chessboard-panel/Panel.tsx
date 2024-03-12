import { useEffect, useState } from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { backend } from "../../App";
import {useLocation} from 'react-router-dom';

interface Props {
  puzzleid: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
}

export let arrayOfSolved:number[][] = [
  [],
  [],
  [],
  [],
  []
];


export default function Panel() {

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  const [arrayOfObjects, setArrayOfObjects] = useState<Props[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const location = useLocation();
  
  useEffect(() => {
    (
      async () => {
        const value = localStorage.getItem(location.state.id);
        if (typeof value === 'string') {
          const solved = JSON.parse(value)
          if (solved) {
            arrayOfSolved[location.state.id-1] = solved;
          }
        }

        await fetch( `${backend}/api/topic?id=${location.state.id ? location.state.id : 1}`, {
          headers: { 'Content-Type': 'apppcation/json' },
          // credentials: 'include'
        }).then((res) => {
          if (res && res.status === 200) {
          res.json().then((data) => setArrayOfObjects(data));
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
        activeIndex ? setCurrentFen(arrayOfObjects[activeIndex].fen) : console.log("Жду");
        if(activeIndex === 0 && arrayOfObjects[0]) setCurrentFen(arrayOfObjects[activeIndex].fen)
      }
      )();
    },[activeIndex]);
    
    useEffect(() => {
      (
        async () => {
          arrayOfObjects[0] ? setCurrentFen(arrayOfObjects[0].fen) : console.log("жду");
          setSolved(arrayOfObjects.length);
      }
    )();
  },[arrayOfObjects])

    return (
      <div className="chess-page">
        <div className="progressBar">
          <div className="progress-line" style={{width: `${100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length}%`}}></div>
          <div className="progress-percentage">{Math.ceil((100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length) ? 100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length : 0)}% выполнено</div>
        </div>
        <div className="panel-content">
          <div className="panel-spisok">
            <div className="panel">    
              <div className="referee">
                <Referee fenCode={fenCode} 
                setSolved={setSolved} 
                solved={solved} 
                activeIndex={activeIndex} 
                setActiveIndex={setActiveIndex} 
                lengthOfArray={arrayOfObjects.length} 
                arrayOfObjects={arrayOfObjects}/>
              </div>
            </div>
            <div className="spisok">
              <div className="topic"><p>Связка</p></div>
              <div className="spisokList">
                {arrayOfObjects.map((puzzle, index) => (
                  <div className={index === activeIndex ? "zadachi active" :"zadachi"} key={puzzle.puzzleid} onClick={() => {setActiveIndex(index)
                    setCurrentFen(arrayOfObjects[index].fen)}}>
                    <div className="block-checkSign"><img className={arrayOfSolved[location.state.id-1].includes(puzzle.puzzleid) ? "solved" : "hidden"} src="/assets/images/solved.svg" /></div>
                    <div className="block-spisokImg"><img className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"}/></div>
                    <div className="zadachi-text">
                      <div className="id">Задание №{index+1}</div>
                      <div className="title">{puzzle.subtopic}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="arrows">
            <div className="leftArrowWrap" onClick={() => arrayOfObjects[activeIndex - 1] ? setActiveIndex(activeIndex - 1) : null}>
            <img className="arrow" src="/assets/images/leftArrow.svg" />
            </div>
            <div className="rightArrowWrap" onClick={() => arrayOfObjects[activeIndex + 1] ? setActiveIndex(activeIndex + 1) : null}>
              <img className="arrow" src="/assets/images/rightArrow.svg" /></div>
          </div>
        </div>
      </div>
    );

}

export default interface TaskProps {
  puzzleid: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
}
