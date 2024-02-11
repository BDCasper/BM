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

export default function Panel() {

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  const [arrayOfObjects, setArrayOfObjects] = useState<Props[]>([]);
  const [arrayOfSolved, setArrayOfSolved] = useState<number[][]>(
    [
      [],
      [],
      [],
      [],
      []
    ]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const location = useLocation();



  // useEffect(() => {
  //   localStorage.setItem(location.state.id, JSON.stringify(arrayOfSolved[location.state.id-1]));
  // }, [arrayOfSolved]); TODO бля((

  useEffect(() => {
    (
      async () => {
        // const value = localStorage.getItem(location.state.id);
        // console.log(value)
        // if (typeof value === 'string') {
        //   const solved = JSON.parse(value)
        //   if (solved) {
        //     const temp = arrayOfSolved;
        //     temp[location.state.id-1].push(solved);
        //     setArrayOfSolved(temp);
        //   }
        // }

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
        console.log(arrayOfSolved)
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
      <>
        <div className="progressBar">
          <div className="progress-line" style={{width: `${100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length}%`}}></div>
          <div className="progress-percentage">{Math.ceil(100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length)}% выполнено</div>
        </div>
        <div className="panel">    
          <div className="referee">
            <Referee fenCode={fenCode} 
            setSolved={setSolved} 
            solved={solved} 
            activeIndex={activeIndex} 
            setActiveIndex={setActiveIndex} 
            lengthOfArray={arrayOfObjects.length} 
            arrayOfObjects={arrayOfObjects}
            arrayOfSolved={arrayOfSolved}/>
          </div>
        </div>
        <div className="spisok">
          <div className="topic"><p>Связка</p></div>
            <div className="spisokList">
              {arrayOfObjects.map((puzzle, index) => (
                <>
                    <div className={index === activeIndex ? "zadachi active" :"zadachi"} key={puzzle.puzzleid} onClick={() => {setActiveIndex(index)
                      setCurrentFen(arrayOfObjects[index].fen)}}>
                      <img className="spisokImg" src="/assets/images/spisokImg.svg"/>
                      <img className={arrayOfSolved[location.state.id-1].includes(puzzle.puzzleid) ? "solved" : "hidden"} src="/assets/images/solved.svg" />
                      <div className="zadachi-text">
                        <div className="id">Задание №{index+1}</div>
                        <div className="title">{puzzle.subtopic}</div>
                      </div>
                    </div>
                </>
              ))}
            </div>
        </div>
      </>
    );

}

export default interface TaskProps {
  puzzleid: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
}
