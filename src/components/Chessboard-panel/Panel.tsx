import { useEffect, useState, useRef } from "react";
import Referee from "../Chessboard-chessboard/Referee-main/Referee";
import "./Panel.css"
import { backend } from "../../App";
import {redirect, useLocation, useParams} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Podpiska from "../Podpiska/podpiska";
import useSound from 'use-sound';
import MediaQuery from "react-responsive";
import { User } from "../../App";
import ThreeScene from "../winScene";
import WinPopup from "../Chessboard-chessboard/winPopUp/winPopUp";
import { useTranslation } from "react-i18next";
import Data from "../BasicData";
import { videoFiles } from "../QazaqVideos";
import { mathFiles } from "../math&logic";


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
  url: string;
}

interface PanelProps {
  popOpen: boolean;
  setPopOpen: (pop: boolean) => any;
  user: User;
  arrayOfSolved: Set<number>;
  isSubscribed: boolean;
}

export default function Panel({popOpen, setPopOpen, user, arrayOfSolved, isSubscribed}:PanelProps) {
  const navigate = useNavigate();

  const [fenCode, setCurrentFen] = useState<string>("");
  const [solved, setSolved] = useState<number>(0);
  const [arrayOfObjects, setArrayOfObjects] = useState<Props[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [answered, setAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>();
  const [progressWidthcnt, setProgressWidthcnt] = useState<number>(0);
  const location = useLocation(); 
  const [winSound] = useSound('/win.wav', { volume: 0.2 });
  const [wrongSound] = useSound('/wrong.mp3');
  const [gameWithFriend, setGameWithFriend] = useState<boolean|undefined>(true);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [chooseQ, setChooseQ] = useState<number>(-1);
  const [startAnimation, setStartAnimation] = useState(false);
  const [winPopUp, setWinPopUp] = useState<boolean>(false);
  const {t} = useTranslation();
  const scrollToBoard = useRef<null | HTMLDivElement>(null);
  const params = useParams();
  const [idNum, setIdNum] = useState<number>(Number(params.id && params.id[5]))

  const executeScroll = () => scrollToBoard.current?.scrollIntoView();

  const handleProgress = async() => {
    let cnt = 0;
    if(arrayOfSolved && arrayOfObjects) {
      arrayOfObjects.map((puz) => {
          if(arrayOfSolved.has(puz.puzzle_id)) cnt++;
        }
      )
      setProgressWidthcnt(cnt);
    }
  }

  const handleAnimation = () => {
      setStartAnimation(true);
  };

  useEffect(() => {
    (
      async () => {
        scrollToBoard.current?.scrollIntoView()
      }
    )();
  }, []);


  useEffect(() => {
    (
      async () => {
        if(user){
          if(location.state === null && params.id && !params.id.includes('basic') && params.id !== "math&logic"){
            if(params.id === undefined) navigate('/'); 
            await fetch( `${backend}/api/topic?id=${params.id ? params.id : 1}`, {
              headers: { 'Content-Type': 'apppcation/json' },
              // credentials: 'include'
            }).then((res) => {
              if (res && res.status === 200) {
              res.json().then((data) => {
                setArrayOfObjects(data);
              });
              } else {
                console.log("No FEN :(")
                navigate('/')
                console.log(res.status)
              }
            })
          }
        } else {
          navigate('/login');
        }
        await handleProgress();
      }
    )();
  }, [params.id]);


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
            handleProgress();
            if(arrayOfObjects[activeIndex+1]) 
            {
              setActiveIndex(activeIndex+1);
            }
            else {
              handleAnimation();
              setTimeout(() => {
                navigate("/")
              }, 4000);
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
        if(params.id !== "videoKZ" && params.id !== "math&logic" && !params.id?.includes('basic')){
          activeIndex ? setCurrentFen(arrayOfObjects[activeIndex].fen) : console.log();
          setChooseQ(-1);
          if(arrayOfObjects[0] && arrayOfObjects[activeIndex].mode === 'video') setVideoUrl(arrayOfObjects[activeIndex].url);
          if(activeIndex === 0 && arrayOfObjects[0]){
            setCurrentFen(arrayOfObjects[activeIndex].fen)
          }
          setAnswered(false);
        } else if(params.id === "videoKZ") {
          setVideoUrl(videoFiles[activeIndex].url);
        } else if(params.id.includes('basic')){
          if(Data[idNum-1][activeIndex].mode === 'video') setVideoUrl(location.state.data[activeIndex].url);
        } else {
          setVideoUrl(mathFiles[activeIndex].url);
        }
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
          if (arrayOfObjects[0]){
          if(arrayOfObjects[0].mode === 'video') setVideoUrl(arrayOfObjects[activeIndex].url);
            setCurrentFen(arrayOfObjects[0].fen);
            await handleProgress();
          }
          setSolved(arrayOfObjects.length);
      }
    )();
  },[arrayOfObjects, arrayOfSolved])

  const popup = (
      <div className={popOpen ? "sub-show" : "hidden"}>
          <Podpiska setPopOpen={setPopOpen} user={user} isSubscribed={isSubscribed}/>
      </div>
  )

  return (
      <>
      { startAnimation === true &&
        <div className="chess-win-scene">
          <ThreeScene startAnimation={startAnimation} handleAnimation={setStartAnimation}/>
        </div>
      }
      {winPopUp === true &&
        <WinPopup onClose={setWinPopUp} activeIndex={activeIndex} setActiveIndex={setActiveIndex} lengthOfArray={arrayOfObjects.length} />
      }
        {
          params.id && params.id !== 'GameWithBot'
          ?
          <>
          {  
            (location.state && location.state.gameWithFriend === undefined) || location.state === null ?
            <>
            <div className="chess-page">
              {
                params.id && params.id.includes('basic') ? 
                <div className="panel-content">
                  <div className="panel-spisok">
                    <div className="panel" ref={scrollToBoard}>
                      <button onClick={executeScroll} className="panel-size-button"><img src="/assets/images/resize.png" alt="" /></button>
                      {
                        Data[idNum-1][activeIndex].mode === 'video' ?
                          <>
                            <div className="task-name" >{Data[idNum-1][activeIndex].topic}</div>
                            <video key={videoUrl} width="700" height="500" className="panel-video" controls> 
                                <source src={`https://drzmjhmnb3llr.cloudfront.net/videos/${videoUrl}` } type="video/mp4" /> 
                            </video> 
                          </>
                        :
                          <div className="referee">
                            <Referee fenCode={Data[idNum-1][activeIndex].fen} 
                            setSolved={setSolved} 
                            solved={solved} 
                            activeIndex={activeIndex} 
                            setActiveIndex={setActiveIndex} 
                            lengthOfArray={location.state.data.length} 
                            arrayOfObjects={location.state.data}
                            mode='basic'
                            closed={true}
                            setPopOpen={setPopOpen}
                            user={user}
                            arrayOfSolved={arrayOfSolved}
                            gameWithFriend={undefined}
                            handleAnimation={setStartAnimation}
                            setProgress={setProgressWidthcnt}
                            level={-1}
                            moveTurn={''}
                            />
                          </div>
                      }    
                    </div>
                    <div className="spisok">
                      <div className="topic"><p>{t("Математика и Логика на шахматной доске")}</p></div>
                        <div className="spisokList">
                          {Data[idNum-1].map((puzzle, index) => (
                            puzzle.mode === 'video' ?
                            <>
                              <div className={index === activeIndex ? "zadachi zadachi-active" :"zadachi"} key={index} onClick={() => {
                                setActiveIndex(index)
                              }}>
                              <div className="zadachi-content">
                                <div className="block-checkSign"><img alt="" className="video-player" src='/assets/images/video-lesson.png'/></div>
                                  <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                  <div className="zadachi-text" >
                                    <div className="id" >{t('Видео')} №{index+1}</div>
                                    <div className="title" >{t(puzzle.topic)}</div>
                                  </div>
                              </div>
                            </div>
                            </>
                            :
                            <div className={index === activeIndex ? "zadachi zadachi-active" :"zadachi"} key={index} onClick={() => {
                                setActiveIndex(index)
                              }}>
                              <div className="zadachi-content">
                                  <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                  <div className="zadachi-text" >
                                    <div className="id" >{t('Задание')} №{index+1}</div>
                                    <div className="title" >{t(puzzle.topic)}</div>
                                  </div>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                  </div>
                </div>
                :
                params.id && params.id === "videoKZ" ?
                <div className="panel-content">
                  <div className="panel-spisok">
                    <div className="panel" ref={scrollToBoard}>
                      <button onClick={executeScroll} className="panel-size-button"><img src="/assets/images/resize.png" alt="" /></button>    
                      <video key={videoUrl} width="700" height="500" className="panel-video" controls> 
                          <source src={`https://drzmjhmnb3llr.cloudfront.net/daryn/${videoUrl}` } type="video/mp4" /> 
                      </video> 
                    </div>
                    <div className="spisok">
                      <div className="topic"><p>Бейне сабақтар</p></div>
                        <div className="spisokList">
                          {videoFiles.map((puzzle, index) => (
                            <div className={index === activeIndex ? "zadachi zadachi-active" :"zadachi"} key={index} onClick={() => {
                                setActiveIndex(index)
                              }}>
                              <div className="zadachi-content">
                                <div className="block-checkSign"><img alt="" className="video-player" src='/assets/images/video-lesson.png'/></div>
                                  <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                  <div className="zadachi-text" >
                                    <div className="id" >{t('Бейне')} №{index+1}</div>
                                    <div className="title" >{t(puzzle.topic)}</div>
                                  </div>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                  </div>
                    <div className="arrows">
                        <div className="leftArrowWrap" onClick={() => videoFiles[activeIndex - 1] ? setActiveIndex(activeIndex - 1) : null}>
                          <img className="arrow" src="/assets/images/leftArrow.svg" />
                        </div>
                        <div className="rightArrowWrap" onClick={() => {
                          if(videoFiles[activeIndex + 1]) setActiveIndex(activeIndex + 1);
                          }}>
                          <img className="arrow" src="/assets/images/rightArrow.svg" />
                        </div>
                    </div>
                </div>
                :
                params.id && params.id === 'math&logic' ?
                <div className="panel-content">
                  <div className="panel-spisok">
                    <div className="panel" ref={scrollToBoard}>
                      <button onClick={executeScroll} className="panel-size-button"><img src="/assets/images/resize.png" alt="" /></button>   
                      <div className="task-name" >{mathFiles[activeIndex].topic}</div>
                      <video key={videoUrl} width="700" height="500" className="panel-video" controls> 
                          <source src={`https://drzmjhmnb3llr.cloudfront.net/videos/${videoUrl}` } type="video/mp4" /> 
                      </video> 
                    </div>
                    <div className="spisok">
                      <div className="topic"><p>{t("Математика и Логика на шахматной доске")}</p></div>
                        <div className="spisokList">
                          {mathFiles.map((puzzle, index) => (
                            <div className={index === activeIndex ? "zadachi zadachi-active" :"zadachi"} key={index} onClick={() => {
                                setActiveIndex(index)
                              }}>
                              <div className="zadachi-content">
                                <div className="block-checkSign"><img alt="" className="video-player" src='/assets/images/video-lesson.png'/></div>
                                  <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                  <div className="zadachi-text" >
                                    <div className="id" >{t('Видео')} №{index+1}</div>
                                    <div className="title" >{t(puzzle.topic)}</div>
                                  </div>
                              </div>
                            </div>
                          ))}
                        </div>
                    </div>
                  </div>
                    <div className="arrows">
                        <div className="leftArrowWrap" onClick={() => videoFiles[activeIndex - 1] ? setActiveIndex(activeIndex - 1) : null}>
                          <img className="arrow" src="/assets/images/leftArrow.svg" />
                        </div>
                        <div className="rightArrowWrap" onClick={() => {
                          if(videoFiles[activeIndex + 1]) setActiveIndex(activeIndex + 1);
                          }}>
                          <img className="arrow" src="/assets/images/rightArrow.svg" />
                        </div>
                    </div>
                </div>
                :
                <>
                  {popOpen && popup}
                  <div className="progressBar">
                    <div className="progress-line" style={{width: `${(arrayOfSolved && arrayOfObjects) ? 100*progressWidthcnt/arrayOfObjects.length : 0}%`}}></div>
                    <div className="progress-percentage">{(arrayOfSolved && arrayOfObjects && arrayOfObjects.length !== 0) ? Math.ceil(100*progressWidthcnt/arrayOfObjects.length) : 0}% {t('выполнено')}</div>
                  </div>
                  <div className="panel-content">
                    <div className="panel-spisok">
                      <div className="panel" ref={scrollToBoard}>
                        <button onClick={executeScroll} className="panel-size-button"><img src="/assets/images/resize.png" alt="" /></button>   
                        {
                          arrayOfObjects[0] && arrayOfObjects[activeIndex].mode === 'video' && videoUrl !== '' ?
                            <video key={videoUrl} width="700" height="500" className="panel-video" controls> 
                                <source src={`https://drzmjhmnb3llr.cloudfront.net/videos/${videoUrl}` } type="video/mp4" /> 
                            </video> 
                          :
                            <div className="referee">
                              <Referee fenCode={fenCode} 
                              setSolved={setSolved} 
                              solved={solved} 
                              activeIndex={activeIndex} 
                              setActiveIndex={setActiveIndex} 
                              lengthOfArray={arrayOfObjects.length} 
                              arrayOfObjects={arrayOfObjects}
                              mode={arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].mode}
                              closed={arrayOfObjects[activeIndex+1] ? arrayOfObjects[activeIndex+1].closed : false}
                              setPopOpen={setPopOpen}
                              user={user}
                              arrayOfSolved={arrayOfSolved}
                              gameWithFriend={undefined}
                              handleAnimation={setStartAnimation}
                              setProgress={setProgressWidthcnt}
                              level={-1}
                              moveTurn={''}
                              />
                            </div>
                        } 
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
                        {arrayOfObjects[0] && <div className="topic"><p>{arrayOfObjects[0].topic}</p></div>}
                          <div className="spisokList">
                            {arrayOfObjects.map((puzzle, index) => (
                                  <div className={ isSubscribed === true ? (index === activeIndex ? "zadachi zadachi-active" :"zadachi") : puzzle.closed === false ? (index === activeIndex ? "zadachi zadachi-active" :"zadachi") : "zadachi zadachi-closed"} key={puzzle.puzzle_id} onClick={() => {
                                    if(isSubscribed === true || puzzle.closed === false)
                                    {
                                      setActiveIndex(index);
                                      setCurrentFen(arrayOfObjects[index].fen);
                                    }
                                    else setPopOpen(true);
                                    }}>
                                      {puzzle.mode === 'test' ? 
                                        <>
                                        <div className="zadachi-content">
                                          <div>
                                          <div className="block-checkSign"><img alt="" className={arrayOfSolved ? (arrayOfSolved.has(puzzle.puzzle_id) ? "solved" : "solved black") : ''} src={arrayOfSolved ? (arrayOfSolved.has(puzzle.puzzle_id) ? "/assets/images/asyk-win.svg" : "/assets/images/asyk-wait.svg") : '' }/></div>
                                          </div>
                                          {isSubscribed === false && puzzle.closed === true && <div className="spisok-lock"><img src="/assets/images/spisok-lock.png" className="spisok-lock-img" alt="" /></div>}
                                          <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                          <div className="zadachi-text" >
                                            <div className="id" >{t('Задание')} №{index+1}</div>
                                            <div className="title" >{t(puzzle.title)}</div>
                                          </div>
                                        </div>
                                        {(isSubscribed === true || !puzzle.closed) && index === activeIndex && 
                                          <div className="zadachi-test">
                                            {JSON.parse(puzzle.variants).map((variant: string, ind: number) => (
                                                <tr key={ind} className= {chooseQ === ind ? "zadachi-test-q activeQ" : "zadachi-test-q"} onClick={() => {
                                                  setChooseQ(ind)
                                                  setAnswer(variant)
                                                  }}>
                                                  <td><input type="radio" className="zadachi-test-r" checked={chooseQ === ind} onChange={() => setAnswer(variant)} name="inp"/></td>
                                                  <td className="zadachi-test-t">{t(variant)}</td>
                                                </tr>
                                            ))}
                                            {!isCorrect && answer && answered && <div className="zadachi-wrongAnswer">{t('Неправильный ответ')}</div>}
                                            <button className="zadachi-test-b" onClick={handleAnswer}>{t('Отправить')}</button>
                                          </div>
                                        }
                                        </>
                                      : puzzle.mode === 'video' ?
                                      <>
                                        <div className="zadachi-content">
                                          <div className="block-checkSign"><img alt="" className="video-player" src='/assets/images/video-lesson.png'/></div>
                                            <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                            <div className="zadachi-text" >
                                              <div className="id" >{t('Задание')} №{index+1}</div>
                                              <div className="title" >{t(puzzle.topic)}</div>
                                            </div>
                                        </div>
                                      </>
                                      :
                                        <>
                                          <div className="zadachi-content">
                                          {(isSubscribed === true || puzzle.closed === false) && <div className="block-checkSign"><img alt="" className={arrayOfSolved ? (arrayOfSolved.has(puzzle.puzzle_id) ? "solved" : "solved black") : ''} src={arrayOfSolved ? (arrayOfSolved.has(puzzle.puzzle_id) ? "/assets/images/asyk-win.svg" : "/assets/images/asyk-wait.svg") : '' }/></div>}
                                            {isSubscribed === false && puzzle.closed === true && <div className="spisok-lock"><img src="/assets/images/spisok-lock.png" className="spisok-lock-img" alt="" /></div>}
                                            <div className="block-spisokImg"><img alt="" className={index === activeIndex ? "spisokImg-active" :"spisokImg"} src={index === activeIndex ? "/assets/images/active-piece.svg" :"/assets/images/spisokImg.svg"} /></div>
                                            <div className="zadachi-text" >
                                              <div className="id" >{t('Задание')} №{index+1}</div>
                                              <div className="title" >{t(puzzle.subtopic)}</div>
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
                          <img className="arrow" src="/assets/images/rightArrow.svg" />
                        </div>
                      </div>
                    </MediaQuery>
                  </div>
                </>
              }
              </div>
            </>
            :
            <div className="gameWithFriend" ref={scrollToBoard}>
                <Referee fenCode={location.state && location.state.basicFenCode} 
                      setSolved={setSolved} 
                      solved={solved} 
                      activeIndex={activeIndex} 
                      setActiveIndex={setActiveIndex} 
                      lengthOfArray={arrayOfObjects.length} 
                      arrayOfObjects={arrayOfObjects}
                      mode={arrayOfObjects[activeIndex] && arrayOfObjects[activeIndex].mode}
                      closed={arrayOfObjects[activeIndex+1] ? arrayOfObjects[activeIndex+1].closed : false}
                      setPopOpen={setPopOpen}
                      user={user}
                      arrayOfSolved={arrayOfSolved}
                      gameWithFriend={location.state && location.state.gameWithFriend}
                      handleAnimation={setStartAnimation}
                      setProgress={setProgressWidthcnt}
                      level={-1}
                      moveTurn={''}
                      />
            </div>
            }          
            </>
            :
            <>
              <div className="gameWithFriend" ref={scrollToBoard}>
                <Referee fenCode={location.state && location.state.basicFenCode} 
                      setSolved={setSolved} 
                      solved={solved} 
                      activeIndex={activeIndex} 
                      setActiveIndex={setActiveIndex} 
                      lengthOfArray={arrayOfObjects.length} 
                      arrayOfObjects={arrayOfObjects}
                      mode={'botGame'}
                      closed={arrayOfObjects[activeIndex+1] ? arrayOfObjects[activeIndex+1].closed : false}
                      setPopOpen={setPopOpen}
                      user={user}
                      arrayOfSolved={arrayOfSolved}
                      gameWithFriend={undefined}
                      handleAnimation={setStartAnimation}
                      setProgress={setProgressWidthcnt}
                      level={location.state && location.state.level}
                      moveTurn={location.state && location.state.moveTurn}
                      />
              </div>
            </>
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
