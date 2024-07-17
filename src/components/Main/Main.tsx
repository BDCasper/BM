import { useEffect, useState } from "react";
import { backend } from "../../App";
import "./Main.css"
import { useNavigate } from "react-router-dom";
import { User } from "../../App";
import MediaQuery from "react-responsive";
import { useTranslation } from "react-i18next";

const arrOfFigures = ["Пешка", "Слон", "Ладья", "Ферзь", "Король", "Конь", "Слон"];

interface Props {
    topic_id: number;
    topic: string;
    difficulty: string;
    lessons: number;
    puzzles: number;
}

interface MainProps {
  inp: string;
  user: User;
}

export default function Main({inp, user}:MainProps) {
    const [topicList, setTopicList] = useState<Props[]>([]);
    const navigate = useNavigate();
    const [filterTopic, setFilter] = useState<string>('');
    const arrOfDif = ['easy', 'medium', 'hard'];

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

    useEffect(() => {
        (
          async () => {
            await fetch( `${backend}/api/topics`, {
              headers: { 'Content-Type': 'apppcation/json' },
              // credentials: 'include'
            }).then((res) => {
              if (res && res.status === 200) {
              res.json().then((data) => {
                setTopicList(data);
                topicList.sort();
              });
              } else {
                console.log("No DATA:(")
              }
            })
          }
        )();
      }, []);


    return(
      <div className="main-page">
        <div className="lists-wrapper">
          <div className="course-list">
            <div className={filterTopic === '' ? "all-courses setOn" : "all-courses"} onClick={() => setFilter('')}>
                <div className="podpiska-text">{t('Все курсы')}</div>
                <img className="podpiskaImg" src={filterTopic === '' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
            <div className="podpiska">
              <div className={filterTopic === 'easy' ? "podpiska1 setOn" : "podpiska1"} onClick={() => setFilter('easy')}>
              <div className="podpiska-text">{t('Начинающий')}</div>
              <img className="podpiskaImg" src={filterTopic === 'easy' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'medium' ? "podpiska2 setOn" : "podpiska2"} onClick={() => setFilter('medium')}>
              <div className="podpiska-text">{t('Продолжающий')}</div>
              <img className="podpiskaImg" src={filterTopic === 'medium' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'hard' ? "podpiska3 setOn" : "podpiska3"} onClick={() => setFilter('hard')}>
              <div className="podpiska-text">{t('Продвинутый')}</div>
              <img className="podpiskaImg" src={filterTopic === 'hard' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
            </div>
          </div>
          <div className="game-list">
            <div className="game-type" onClick={() => navigate("/topic", {state:{gameWithBot: true, basicFenCode: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}})}>
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
                  {topicList.filter((topics) => topics.difficulty.includes(dif)).map((topic, ind) => (
                    <>
                    {topic.topic.trim().toUpperCase().includes(inp.trim().toUpperCase()) &&
                    <div key={topic.topic_id} className="theme-block" onClick={() => user.user_id ? navigate("/topic", {state:{id:topic.topic_id, topic:topic.topic}}) : navigate("/login")}>
                        <div className="themeImg"><img src={!arrOfFigures.includes(topic.topic) ? `/kids_photo/img${ind+1 <= 18 ? ind+1 : ind > 18 ? ind%18 : 1}.JPG` : "/assets/images/courseImg.svg"} className="themeImgSize"/></div>
                        <div className="theme-content">
                            <div className="theme-text">
                                <div className="theme-name">{t(topic.topic)}</div>
                                <ul className="theme-info">
                                    <li className="theme-lessons"><span>{topic.lessons} {getNoun(topic.lessons, "урок", "урока", "уроков")}</span></li> 
                                    <li className="theme-puzzles"><span>{topic.puzzles} {getNoun(topic.puzzles, "задача", "задачи", "задач")}</span></li>
                                </ul>
                            </div>
                        </div>
                      </div>
                    }
                    </>
                  ))}
                  </> 
                :
                  <>
                  {topicList.filter((topic) => topic.difficulty.includes(dif)).map((topic, ind) => (
                    <div key={topic.topic_id} className="theme-block" onClick={() => user.user_id ? navigate("/topic", {state:{id:topic.topic_id, topic:topic.topic}}) : navigate("/login")}>
                        <div className="themeImg"><img src={!arrOfFigures.includes(topic.topic) ? `/kids_photo/img${ind+1 <= 18 ? ind+1 : ind > 18 ? ind%18 : 1}.JPG` : "/assets/images/courseImg.svg"} className="themeImgSize"/></div>
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