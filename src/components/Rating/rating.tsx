import "./rating.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend } from "../../App";
import { User } from "../../App";

interface RatingUser {
    username: string,
    location: string,
    score: number,
    score_month: number,
    score_week: number,
}

interface Props {
    user: User;
}

export default function Rating({user} : Props){
    const [token, setToken] = useState<string>(localStorage && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : '');
    const navigate = useNavigate();
    const [topList, setTopList] = useState<RatingUser[]>([]);
    const [userRating, setUserRating] = useState<number>(-1);
    const [interval, setInterval] = useState<string>('all');

    useEffect(() => {
        (
            async() => {
                if(token === null || token === '') navigate('/login');
            }
        )()
    },[])

    useEffect(() => {
        (
          async () => {
            if(token !== ''){
              await fetch(`${backend}/api/rating?id=${user.user_id ? user.user_id : localStorage.getItem('user_id')}&period=${'all'}`, {
                  method: "GET",
                  headers: { 'Content-Type': 'application/json'},
              }).then((response) => {
                if (response && response.status === 200) {
                  response.json().then((data) => {
                    setTopList(data.top);
                    setUserRating(data.user);
                  })
                }
              })
            }
        })();
    }, [])

    const sendInterval = async (intervalcheck: string) => {
        setInterval(intervalcheck)
        await fetch(`${backend}/api/rating?id=${user.user_id ? user.user_id : localStorage.getItem('user_id')}&period=${intervalcheck}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json'},
        }).then((response) => {
        if (response && response.status === 200) {
            response.json().then((data) => {
            setTopList(data.top);
            setUserRating(data.user);
            })
        }
        })
    }


    return(
        <div className="rating">
            <div className="rating-time-wrapper">
                <div className={interval === 'week' ? "rating-time-item rating-time-item-active" : "rating-time-item"} onClick={() => sendInterval('week')}>Неделя</div>
                <div className={interval === 'month' ? "rating-time-item rating-time-item-active" : "rating-time-item"} onClick={() => sendInterval('month')}>Месяц</div>
                <div className={interval === 'all' ? "rating-time-item rating-time-item-active" : "rating-time-item"} onClick={() => sendInterval('all')}>Всё время</div>
            </div>
            <div className="rating-toplist-wrapper">
                <table>
                    <thead>
                        <tr>
                            <td>№</td>
                            <td>Имя пользователя</td>
                            <td>Страна</td>
                            <td>Счёт</td>
                        </tr>
                    </thead>
                    <tbody>
                        { topList.map((usr, index) =>   
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{usr.username}</td>
                                <td>{usr.location}</td>
                                <td>{interval === 'week' ? usr.score_week : interval === 'all' ? usr.score : usr.score_month}</td>
                            </tr>
                        )}
                        <tr>
                            <td>{userRating}</td>
                            <td>{user.username}</td>
                            <td>{user.location}</td>
                            <td>{interval === 'week' ? user.score_week : interval === 'all' ? user.score : user.score_month}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}