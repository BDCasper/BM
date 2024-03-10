import { useEffect, useState } from "react";
import { backend } from "../../App";
import "./Main.css"
import { useNavigate } from "react-router-dom";

interface Props {
    id: number;
    topic: string;
    lessons: number;
    puzzles: number;
}

export default function Main() {

    const [topicList, setTopicList] = useState<Props[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (
          async () => {
            await fetch( `${backend}/api/topics`, {
              headers: { 'Content-Type': 'apppcation/json' },
              // credentials: 'include'
            }).then((res) => {
              if (res && res.status === 200) {
              res.json().then((data) => setTopicList(data));
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
            <div className="all-courses"><p className="vseKursy">Все курсы</p></div>
            <div className="podpiska">
              <div className="podpiska1" onClick={() => console.log("hui")}>
              <p className="podpiska-text">Подписка PRO</p>
              <img className="podpiskaImg" src="/assets/images/podpiskaArrow.svg"/>
              </div>
              <div className="podpiska2">
              <p className="podpiska-text">Подписка PRO</p>
              <img className="podpiskaImg" src="/assets/images/podpiskaArrow.svg"/>
              </div>
              <div className="podpiska3">
              <p className="podpiska-text">Подписка PRO</p>
              <img className="podpiskaImg" src="/assets/images/podpiskaArrow.svg"/>
              </div>
            </div>
          </div>
          <div className="main-panel">
            <p className="levelName">Для начинающих</p>
            <div className="pro-level">
              {topicList.map((topic) => (
                  <div key={topic.id} className="theme-block" onClick={() => navigate("/topic", {state:{id:topic.id}})}>
                      <img className="themeImg" src="/assets/images/courseImg.svg"/>
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
            </div>
          </div>
      </div>
    );
}