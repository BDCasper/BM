import { useEffect, useState } from "react";
import { backend } from "../../App";
import "./Main.css"
import { useNavigate } from "react-router-dom";
import MediaQuery from "react-responsive";

interface Props {
    topic_id: number;
    topic: string;
    difficulty: string;
    lessons: number;
    puzzles: number;
}

interface MainProps {
  inp: string;
}

export default function Main({inp}:MainProps) {
    const [topicList, setTopicList] = useState<Props[]>([]);
    const navigate = useNavigate();
    const [filterTopic, setFilter] = useState<string>('');
    const arrOfDif = ['easy', 'medium', 'hard'];
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
              });
              } else {
                console.log("No FEN :(")
              }
            })
          }
        )();
      }, []);

    return(
      <div className="main-page">
          <div className="course-list">
            <div className={filterTopic === '' ? "all-courses setOn" : "all-courses"} onClick={() => setFilter('')}>
                <div className="podpiska-text">Все курсы</div>
                <img className="podpiskaImg" src={filterTopic === '' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
            <div className="podpiska">
              <div className={filterTopic === 'easy' ? "podpiska1 setOn" : "podpiska1"} onClick={() => setFilter('easy')}>
              <div className="podpiska-text">Начинающий</div>
              <img className="podpiskaImg" src={filterTopic === 'easy' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'medium' ? "podpiska2 setOn" : "podpiska2"} onClick={() => setFilter('medium')}>
              <div className="podpiska-text">Продолжающий</div>
              <img className="podpiskaImg" src={filterTopic === 'medium' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
              <div className={filterTopic === 'hard' ? "podpiska3 setOn" : "podpiska3"} onClick={() => setFilter('hard')}>
              <div className="podpiska-text">Продвинутый</div>
              <img className="podpiskaImg" src={filterTopic === 'hard' ? "/assets/images/podpiskaArrowWhite.svg" : "/assets/images/podpiskaArrow.svg"}/>
              </div>
            </div>
          </div>
        <div className="main-panel">
          <div className="main-panel-content">
          {arrOfDif.filter((dif) => dif.includes(filterTopic)).map((dif) => (
            <div key={dif}>
              <p className="levelName">{dif === 'easy' ? "Для начинающих" : dif === 'medium' ? "Для продолжающих" : dif === 'hard' ? "Для продвинутых" : ''}</p>
              <div className="pro-level">
                {inp !== '' ? 
                  <>
                  {topicList.filter((topics) => topics.difficulty.includes(dif)).map((topic) => (
                    <>
                    {topic.topic.trim().toUpperCase().includes(inp.trim().toUpperCase()) &&
                    <div key={topic.topic_id} className="theme-block" onClick={() => {
                      navigate("/topic", {state:{id:topic.topic_id, topic:topic.topic}})}}>
                        <div className="themeImg"><img src="/assets/images/courseImg.svg"/></div>
                        <div className="theme-content">
                            <div className="theme-text">
                                <div className="theme-name">{topic.topic}</div>
                                <ul className="theme-info">
                                    <li className="theme-lessons"><span>{topic.lessons} уроков</span></li> 
                                    <li className="theme-puzzles"><span>{topic.puzzles} задачи</span></li>
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
                  {topicList.filter((topic) => topic.difficulty.includes(dif)).map((topic) => (
                    <div key={topic.topic_id} className="theme-block" onClick={() => navigate("/topic", {state:{id:topic.topic_id, topic:topic.topic}})}>
                        <div className="themeImg"><img src="/assets/images/courseImg.svg" className="themeImgSize"/></div>
                        <div className="theme-content">
                            <div className="theme-text">
                                <div className="theme-name">{topic.topic}</div>
                                <ul className="theme-info">
                                    <li className="theme-lessons"><span>{topic.lessons} уроков</span></li> 
                                    <li className="theme-puzzles"><span>{topic.puzzles} задачи</span></li>
                                </ul>
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