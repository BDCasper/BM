import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { backend } from "../../App";
import {redirect, useLocation} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Podpiska from "../Podpiska/podpiska";
import useSound from 'use-sound';
import MediaQuery from "react-responsive";
import { User } from "../../App";
import Chessboard from "../Chessboard-chessboard/Chessboard/Chessboard";

interface Props {
  puzzle_id: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
  weight: number;
  mode: string;
  difficulty: string;
  variants: string;
  closed: boolean;
}

interface Test {
  qTitles: string[];
  qVariants: string[];
}

interface PanelProps {
  popOpen: boolean;
  setPopOpen: (pop: boolean) => any;
  user: User;
  arrayOfSolved: Set<number>;
}

export default function Panel({popOpen, setPopOpen, user, arrayOfSolved}:PanelProps) {

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  const [arrayOfObjects, setArrayOfObjects] = useState<Props[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>();
  const [progressWidthcnt, setProgressWidthcnt] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [winSound] = useSound('win.wav', { volume: 0.2 });
  const [wrongSound] = useSound('wrong.mp3');
  const [gameWithBot, setGameWithBot] = useState<boolean|undefined>(location.state.gameWithBot);

  const handlePopUp = async() => {
    setPopOpen(!popOpen);
  }

  useEffect(() => {
    (
      async () => {
        if(location.state.gameWithBot === undefined){
          if(location.state.id === undefined) redirect('/'); 
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
      }
    )();
  }, []);

  const handleAnswer = async() => {
    await fetch( `${backend}/api/checkmove`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
            // credentials: 'include',
            body: JSON.stringify({
                id: arrayOfObjects[activeIndex].puzzle_id,
                answer: answer,
                user_id: user.user_id
            })
    }).then((res) => {
      if (res && res.status === 200) {
        res.json().then((data) => { 
          setIsCorrect(data.correct === "yes" ? true : false);
          if(data.correct === "yes"){
            arrayOfSolved.add(arrayOfObjects[activeIndex].puzzle_id);
            setAnswered(true);
            winSound();
            if(arrayOfObjects[activeIndex+1]) 
            {
              setActiveIndex(activeIndex+1);
            }
            else {
              alert("Молодец")
              navigate("/")
            }
          } 
          else {
            wrongSound();
          }
        });
      } else {
        console.log("No answer")
      }
    })
    setAnswered(true);
  }

  useEffect(() => {
    (
      async () => {
        activeIndex ? setCurrentFen(arrayOfObjects[activeIndex].fen) : console.log();
        if(activeIndex === 0 && arrayOfObjects[0]){
          setCurrentFen(arrayOfObjects[activeIndex].fen)
        }
        setAnswered(false);
        let cnt = 0;
        if(arrayOfSolved && arrayOfObjects) {
          arrayOfObjects.map((puz) => {
              if(arrayOfSolved.has(puz.puzzle_id)) cnt++;
            }
          )
        }
        setProgressWidthcnt(cnt);
      }
      )();
    },[activeIndex]);

  useEffect (() => {
    (
      async () => {
        if(arrayOfObjects[activeIndex+1] && arrayOfSolved) {
          if(arrayOfObjects[activeIndex+1].closed === true && !popOpen && arrayOfSolved.has(arrayOfObjects[activeIndex].puzzle_id)) {
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
          arrayOfObjects[0] ? setCurrentFen(arrayOfObjects[0].fen) : console.log();
          setSolved(arrayOfObjects.length);
          let cnt = 0;
          if(arrayOfSolved && arrayOfObjects) {
          arrayOfObjects.map((puz) => {
              if(arrayOfSolved.has(puz.puzzle_id)) cnt++;
              }
            )
          }
          setProgressWidthcnt(cnt);
      }
    )();
  },[arrayOfObjects])

  const popup = (
      <div className={popOpen ? "sub-show" : "hidden"}>
          <Podpiska setPopOpen={setPopOpen}/>
      </div>
    )

    return (
      <>
        {
          location.state.gameWithBot === undefined ?
          <>
          <div className="chess-page">
            {popOpen && popup}
            <div className="progressBar">
              <div className="progress-line" style={{width: `${(arrayOfSolved && arrayOfObjects) ? 100*progressWidthcnt/arrayOfObjects.length : 0}%`}}></div>
              <div className="progress-percentage">{(arrayOfSolved && arrayOfObjects && arrayOfObjects.length !== 0) ? Math.ceil(100*progressWidthcnt/arrayOfObjects.length) : 0}% выполнено</div>
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
                    user={user}
                    arrayOfSolved={arrayOfSolved}
                    gameWithBot={gameWithBot}
                    />
                  </div>
                </div>
                <MediaQuery maxWidth={1200}>
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
                </MediaQuery>
                <div className="spisok">
                  {location.state.topic && <div className="topic"><p>{location.state.topic}</p></div>}
                    <div className="spisokList">
                      {arrayOfObjects.map((puzzle, index) => (
                            <div className={puzzle.closed === false ? (index === activeIndex ? "zadachi active" :"zadachi") : "zadachi zadachi-closed"} key={puzzle.puzzle_id} onClick={() => {
                              if(puzzle.closed === false)
                              {
                                setActiveIndex(index)
                                setCurrentFen(arrayOfObjects[index].fen)
                              }
                              else setPopOpen(true);
                              }}>
                                {puzzle.mode === 'test' ? 
                                  <>
                                  <div className="zadachi-content">
                                    <div className="block-checkSign"><img alt="" className={arrayOfSolved ? (arrayOfSolved.has(puzzle.puzzle_id) ? "solved" : "hidden") : ''} src="/assets/images/solved.svg" /></div>
                                    {puzzle.closed === true && <div className="spisok-lock"><img src="/assets/images/spisok-lock.png" className="spisok-lock-img" alt="" /></div>}
                                    <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                    <div className="zadachi-text" >
                                      <div className="id" >Задание №{index+1}</div>
                                      <div className="title" >{puzzle.title}</div>
                                    </div>
                                  </div>
                                  {!puzzle.closed && index === activeIndex && 
                                    <div className="zadachi-test">
                                      {JSON.parse(puzzle.variants).map((variant: string) => (
                                          <tr className="zadachi-test-q">
                                            <td><input type="radio" className="zadachi-test-r" onChange={() => setAnswer(variant)} name="inp"/></td>
                                            <td className="zadachi-test-t">{variant}</td>
                                          </tr>
                                      ))}
                                      {!isCorrect && answer && answered && <div className="zadachi-wrongAnswer">Неправильный ответ</div>}
                                      <button className="zadachi-test-b" onClick={handleAnswer}>Отправить</button>
                                    </div>
                                  }
                                  </>
                                : 
                                  <>
                                    <div className="zadachi-content">
                                      <div className="block-checkSign"><img alt="" className={arrayOfSolved ? (arrayOfSolved.has(puzzle.puzzle_id) ? "solved" : "hidden") : ''} src="/assets/images/solved.svg" /></div>
                                      {puzzle.closed === true && <div className="spisok-lock"><img src="/assets/images/spisok-lock.png" className="spisok-lock-img" alt="" /></div>}
                                      <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                      <div className="zadachi-text" >
                                        <div className="id" >Задание №{index+1}</div>
                                        <div className="title" >{puzzle.subtopic}</div>
                                      </div>
                                    </div>
                                  </>
                                }
                            </div>
                      ))}
                    </div>
                  </div>
              </div>
              <MediaQuery minWidth={1200}>
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
              </MediaQuery>
            </div>
            </div>
          </>
          :
          <div className="gameWithBot">
              <Referee fenCode={"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"} 
                    setSolved={setSolved} 
                    solved={solved} 
                    activeIndex={activeIndex} 
                    setActiveIndex={setActiveIndex} 
                    lengthOfArray={arrayOfObjects.length} 
                    arrayOfObjects={arrayOfObjects}
                    isTest={arrayOfObjects[activeIndex] ? (arrayOfObjects[activeIndex].mode === 'test' ? true : false) : false}
                    closed={arrayOfObjects[activeIndex+1] ? arrayOfObjects[activeIndex+1].closed : false}
                    setPopOpen={setPopOpen}
                    user={user}
                    arrayOfSolved={arrayOfSolved}
                    gameWithBot={gameWithBot}
                    />
          </div>
        }
        </>
    );

}

export default interface TaskProps {
  puzzle_id: number;
  fen: string;
  topic: string;
  subtopic: string;
  title: string;
}
