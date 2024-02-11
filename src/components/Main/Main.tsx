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

    console.log(topicList)

    return(
        <>
            <div className="main-panel">
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
        </>
    );
}