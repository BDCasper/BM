import { useEffect, useState } from "react";
import { backend } from "../../App";
import "./Main.css"
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../App";
import MediaQuery from "react-responsive";
import { useTranslation } from "react-i18next";
import Data from "../BasicData";
import BotSetting from "../chooseBotPopup/botSetting";

const arrOfFigures = ["Пешка", "Слон", "Ладья", "Ферзь", "Король", "Конь", "Слон"];

interface Props {
    topic_id: number;
    topic: string;
    difficulty: string;
    lessons: number;
    puzzles: number;
    number: number;
    solved: number;
}

interface MainProps {
  inp: string;
  user: User;
}

export default function Main({inp, user}:MainProps) {
    let token = localStorage.getItem('token');
    const [topicList, setTopicList] = useState<Props[]>([]);
    const navigate = useNavigate();
    const [filterTopic, setFilter] = useState<string>('');
    const arrOfDif = ['easy', 'medium', 'hard'];
    const [level, setLevel] = useState<number>(-1);
    const [playerSide, setPlayerSide] = useState<string>('');
    const params = useParams();
    const [settingsPopupOpen, setSettingsPopupOpen] = useState<boolean>(false);

    const {t} = useTranslation();

    function getNoun(num: number, one: string, two: string, five: string) {
      let n = Math.abs(num);
      n %= 100;
      if (n >= 5 && n <= 20 || n === 0) {
        return five;
      }
      n %= 10;
      if (n === 1) {
        return one;
      }
      if (n >= 2 && n <= 4) {
        return two;
      }
      return five;
    }

    const handleScroll = async() => {
      sessionStorage.setItem("scrollPosition", JSON.stringify(window.scrollY));
    }


    useEffect(() => {
        (
          async () => {
            await fetch( `${backend}/api/topics?id=${user.user_id ? user.user_id : sessionStorage.getItem('user_id')}`, {
              headers: { 'Content-Type': 'apppcation/json' },
              // credentials: 'include'
            }).then((res) => {
              if (res && res.status === 200) {
              res.json().then((data) => {
                setTopicList(data.topics);
              });
              } else {
                console.log("No DATA:(")
              }
            })
            if(params.status && params.status === 'success'){
              await fetch(`${backend}/api/payment/status`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                credentials: 'include',
                body: JSON.stringify({
                  payment_id: localStorage.getItem('payment_id'),
                  order_id: localStorage.getItem('order_id'),
                  user_id: user.user_id
                })
              }).then((response) => {
                if (response && response.status === 200) {
                  response.json().then((data) => {
                    console.log(data)
                  })
                }
              })
            }
          }
        )();
    }, [token]);

    useEffect(() => {
      (
        async () => {
          if(topicList.length > 10){
            const scrollPosition = sessionStorage.getItem("scrollPosition");
            if (scrollPosition) {
              window.scrollTo(0, parseInt(scrollPosition));
              sessionStorage.removeItem("scrollPosition");
            }
          }
        }
      )();
    }, [topicList]);

    const handleSettings = async() => {
      setSettingsPopupOpen(true);
    }

    useEffect(() => {
      (
        async() => {
          if(settingsPopupOpen === false && level !== -1){
            navigate("/topic/GameWithBot", {state:{basicFenCode: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", level: level, moveTurn: playerSide === 'White' ? 'w' : 'b'}})
          }
        }
      )()
    },[level, playerSide])

    return(
      <div className="main-page" onClick={handleScroll}>
        {settingsPopupOpen && <BotSetting Level={setLevel} Side={setPlayerSide} onClose={setSettingsPopupOpen} />}
        <div className="lists-wrapper">
          <div className="course-list">
            <div className="podpiska">
              <div className={filterTopic === '' ? "podpiska-item setOn" : "podpiska-item"} id="allCourses" onClick={() => setFilter('')}>
                <div className="podpiska-text">{t('Все курсы')}</div>
                <img className="podpiskaImg" src={filterTopic === '' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'easy' ? "podpiska-item setOn" : "podpiska-item"} id='firstPodpiska' onClick={() => setFilter('easy')}>
                <div className="podpiska-text">{t('Начинающий')}</div>
                <img className="podpiskaImg" src={filterTopic === 'easy' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'medium' ? "podpiska-item setOn" : "podpiska-item"}  onClick={() => setFilter('medium')}>
                <div className="podpiska-text">{t('Продолжающий')}</div>
                <img className="podpiskaImg" src={filterTopic === 'medium' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'hard' ? "podpiska-item setOn" : "podpiska-item"} id='thirdPodpiska' onClick={() => setFilter('hard')}>
                <div className="podpiska-text">{t('Продвинутый')}</div>
                <img className="podpiskaImg" src={filterTopic === 'hard' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
            </div>
          </div>
          <div className="game-list">
            <div className="game-type" onClick={handleSettings}>
                <div className="podpiska-text">{t('Играть с ботом')}</div>
                <img className="podpiskaImg" src="/assets/images/podpiskaArrow.svg"/>
            </div>
            <div className="game-type" onClick={() => navigate("/topic/playWithFriend", {state:{gameWithFriend: true, basicFenCode: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}})}>
                <div className="podpiska-text">{t('Играть вдвоём')}</div>
                <img className="podpiskaImg" src="/assets/images/podpiskaArrow.svg"/>
            </div>
            <div className="game-type" onClick={() => navigate("/editor")}>
                <div className="podpiska-text">{t('Редактор доски')}</div>
                <img className="podpiskaImg" src="/assets/images/podpiskaArrow.svg"/>
            </div>
          </div>
        </div>
        <div className="main-panel">
          <div className="main-panel-content">  
          {arrOfDif.filter((dif) => dif.includes(filterTopic)).map((dif) => (
            <div key={dif}>
              <p className="levelName">{dif === 'easy' ? t('Для начинающих') : dif === 'medium' ? t('Для продолжающих') : dif === 'hard' ? t('Для продвинутых') : ''}</p>
              <div className="pro-level">
                {inp !== '' ? 
                  <>
                  {Data.filter((topic) => topic.difficulty.includes(dif)).map((topic, ind) => (
                    <>
                      {topic.topic.trim().toUpperCase().includes(inp.trim().toUpperCase()) &&
                        <div key={ind} className="theme-block" onClick={() => user.user_id ? navigate(`/topic/basic${ind+1}`, {state:{id:-1, topic:topic.topic, data: topic}}) : navigate("/login")}>
                            <div className="themeImg"><img src={`https://drzmjhmnb3llr.cloudfront.net/photos/topic_${ind+1}.jpg`} className="themeImgSize"/></div>
                            <div className="theme-content">
                              <div className="theme-text">
                                <div className="theme-name">{t(topic.topic)}</div>
                                <div className="theme-info">
                                  <ul>
                                    <li className="theme-lessons"><span>1 урок</span></li> 
                                  </ul>
                                  <ul>
                                    <li className="theme-puzzles"><span>1 задача</span></li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        }
                    </>
                  ))}
                  {topicList.filter((topics) => topics.difficulty.includes(dif)).map((topic, ind) => (
                    <>
                    {topic.topic.trim().toUpperCase().includes(inp.trim().toUpperCase()) &&
                    <div key={topic.topic_id} className="theme-block" onClick={() => user.user_id ? navigate(`/topic/${topic.topic_id}`) : navigate("/login")}>
                        <div className="themeImg"><img src={`https://drzmjhmnb3llr.cloudfront.net/photos/topic_${ topic.number < 200 && topic.number > 7 ? topic.number : topic.number % 200 }.jpg`} className="themeImgSize"/></div>
                        <div className="theme-content">
                            <div className="theme-text">
                                <div className="theme-name">{t(topic.topic)}</div>
                                <div className="theme-info">
                                  <ul>
                                    <li className="theme-lessons"><span>{topic.lessons} {getNoun(topic.lessons, "урок", "урока", "уроков")}</span></li> 
                                  </ul>
                                  <ul>
                                    <li className="theme-puzzles"><span>{topic.puzzles} {getNoun(topic.puzzles, "задача", "задачи", "задач")}</span></li>
                                  </ul>
                                </div>
                                <div className={user.user_id ? "theme-content-percent" : "theme-content-percent hidden"}><span>{topic.solved}</span> / {topic.puzzles}</div>
                            </div>
                        </div>
                      </div>
                    }
                    </>
                  ))}
                  </> 
                :
                  <>
                  {Data.filter((topic) => topic.difficulty.includes(dif)).map((topic, ind) => (
                    <div key={ind} className="theme-block" onClick={() => user.user_id ? navigate(`/topic/basic${ind+1}`, {state:{id:-1, topic:topic.topic, data: topic}}) : navigate("/login")}>
                      <div className="themeImg"><img src={`https://drzmjhmnb3llr.cloudfront.net/photos/topic_${ind+1}.jpg`} className="themeImgSize"/></div>
                      <div className="theme-content">
                          <div className="theme-text">
                              <div className="theme-name">{t(topic.topic)}</div>
                              <div className="theme-info">
                                <ul>
                                  <li className="theme-lessons"><span>1 урок</span></li> 
                                </ul>
                                <ul>
                                  <li className="theme-puzzles"><span>1 задача</span></li>
                                </ul>
                              </div>
                          </div>
                      </div>
                    </div>
                  ))}
                  {topicList.filter((topic) => topic.difficulty.includes(dif)).map((topic, ind) => (
                    <div key={topic.topic_id} className="theme-block" onClick={() => user.user_id ? navigate(`/topic/${topic.topic_id}`) : navigate("/login")}>
                        <div className="themeImg"><img src={`https://drzmjhmnb3llr.cloudfront.net/photos/topic_${ topic.number < 200 && topic.number > 7 ? topic.number : topic.number % 200 }.jpg`} className="themeImgSize"/></div>
                        <div className="theme-content">
                            <div className="theme-text">
                                <div className="theme-name">{t(topic.topic)}</div>
                                <div className="theme-info">
                                  <ul>
                                    <li className="theme-lessons"><span>{topic.lessons} {getNoun(topic.lessons, "урок", "урока", "уроков")}</span></li> 
                                  </ul>
                                  <ul>
                                    <li className="theme-puzzles"><span>{topic.puzzles} {getNoun(topic.puzzles, "задача", "задачи", "задач")}</span></li>
                                  </ul>
                                </div>
                                <div className={user.user_id ? "theme-content-percent" : "theme-content-percent hidden"}><span>{topic.solved}</span> / {topic.puzzles}</div>
                            </div>
                        </div>
                    </div>
                  ))}
                  </>
                }
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    );
}