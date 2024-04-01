import { useEffect, useState } from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { backend } from "../../App";
import {useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Podpiska from "../Podpiska/podpiska";
import { arch } from "os";

interface Props {
  puzzle_id: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
  weight: number;
  mode: string;
  difficulty: string;
  variants: string[];
  closed: boolean;
}

interface Test {
  qTitles: string[];
  qVariants: string[];
}

interface PanelProps {
  popOpen: boolean;
  setPopOpen: (pop: boolean) => any;
}

export let arrayOfSolved:number[][] = [
  [],
  [],
  [],
  [],
  []
];

export default function Panel({popOpen, setPopOpen}:PanelProps) {

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  const [arrayOfObjects, setArrayOfObjects] = useState<Props[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isTest, setIsTest] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test>({qTitles: ["How to win", "how to win", "how to win", "how to win", "how to win"], qVariants:["YES", "YES", "YES", "YES", "YES",]});

  const handlePopUp = async() => {
    setPopOpen(!popOpen);
  }

  useEffect(() => {
    (
      async () => {
        // const value = localStorage.getItem(location.state.id);
        // if (typeof value === 'string') {
        //   const solved = JSON.parse(value)
        //   if (solved) {
        //     arrayOfSolved[location.state.id-1] = solved;
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
        if(activeIndex === 0 && arrayOfObjects[0]) setCurrentFen(arrayOfObjects[activeIndex].fen)
      }
      )();
    },[activeIndex]);

  useEffect (() => {
    (
      async () => {
        if(arrayOfObjects[activeIndex+1] && arrayOfSolved[location.state.id - 1]) {
          if(arrayOfObjects[activeIndex+1].closed === true && !popOpen && arrayOfSolved[location.state.id - 1].includes(arrayOfObjects[activeIndex].puzzle_id)) {
            if(arrayOfObjects[activeIndex-1]) setActiveIndex(activeIndex-1)
            else navigate('/');
          }
        } 
      }
    )();
  },[popOpen]);
    
    useEffect(() => {
      (
        async () => {
          arrayOfObjects[0] ? setCurrentFen(arrayOfObjects[0].fen) : console.log("жду");
          setSolved(arrayOfObjects.length);
      }
    )();
  },[arrayOfObjects])

    const popup = (
      <div className={popOpen ? "sub-show" : "hidden"}>
          <Podpiska setPopOpen={setPopOpen}/>
      </div>
    )

    return (
      <div className="chess-page">
        {popOpen && popup}
        <div className="progressBar">
          <div className="progress-line" style={{width: `${(arrayOfSolved[location.state.id-1]) ? 100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length : 0}%`}}></div>
          <div className="progress-percentage">{Math.ceil((arrayOfSolved[location.state.id-1]) ? 100*arrayOfSolved[location.state.id-1].length/arrayOfObjects.length : 0)}% выполнено</div>
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
                arrayOfObjects={arrayOfObjects}
                isTest={arrayOfObjects[activeIndex] ? (arrayOfObjects[activeIndex].mode === 'test' ? true : false) : false}
                closed={arrayOfObjects[activeIndex+1] ? arrayOfObjects[activeIndex+1].closed : false}
                setPopOpen={setPopOpen}
                />
              </div>
            </div>
              <div className="spisok">
              {location.state.topic && <div className="topic"><p>{location.state.topic}</p></div>}
                <div className="spisokList">
                  {arrayOfObjects.map((puzzle, index) => (
                    <>
                      {puzzle.mode === 'test' ?  
                        <div className="test">
                          <div className="qAmount"></div>
                        </div>
                        :
                        <div className={puzzle.closed === false ? (index === activeIndex ? "zadachi active" :"zadachi") : "zadachi zadachi-closed"} key={puzzle.puzzle_id} onClick={() => {
                          if(puzzle.closed === false)
                          {
                            setActiveIndex(index)
                            setCurrentFen(arrayOfObjects[index].fen)
                          }
                          else setPopOpen(true);
                          }}>
                          <div className="block-checkSign"><img alt="" className={arrayOfSolved[location.state.id-1] ? (arrayOfSolved[location.state.id-1].includes(puzzle.puzzle_id) ? "solved" : "hidden") : ''} src="/assets/images/solved.svg" /></div>
                          {puzzle.closed === true && <div className="spisok-lock"><img src="/assets/images/spisok-lock.png" className="spisok-lock-img" alt="" /></div>}
                          <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                          <div className="zadachi-text" >
                            <div className="id" >Задание №{index+1}</div>
                            <div className="title" >{puzzle.subtopic}</div>
                          </div>
                        </div>
                      }
                    </>
                  ))}
                </div>
              </div>
          </div>
          <div className="arrows">
            <div className="leftArrowWrap" onClick={() => arrayOfObjects[activeIndex - 1] ? setActiveIndex(activeIndex - 1) : null}>
            <img className="arrow" src="/assets/images/leftArrow.svg" />
            </div>
            <div className="rightArrowWrap" onClick={() => {
              if(arrayOfObjects[activeIndex + 1] && arrayOfObjects[activeIndex + 1].closed === false) setActiveIndex(activeIndex + 1);
              else setPopOpen(true);
              }}>
              <img className="arrow" src="/assets/images/rightArrow.svg" /></div>
          </div>
        </div>
      </div>
    );

}

export default interface TaskProps {
  puzzle_id: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
}
