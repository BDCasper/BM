import "./rating.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { backend } from "../../App";
import { User } from "../../App";

interface RatingUser {
    username: string,
    location: string,
    score: number
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
              await fetch(`${backend}/api/rating?location=KZ&?id=${user.user_id}`, {
                  method: "GET",
                  headers: { 'Content-Type': 'application/json'},
                  credentials: 'include',
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

      console.log(userRating)

    return(
        <div className="rating">
            <div className="rating-time-wrapper">
                <div className={interval === 'week' ? "rating-time-item rating-time-item-active" : "rating-time-item"} onClick={() => setInterval('week')}>Неделя</div>
                <div className={interval === 'month' ? "rating-time-item rating-time-item-active" : "rating-time-item"} onClick={() => setInterval('month')}>Месяц</div>
                <div className={interval === 'all' ? "rating-time-item rating-time-item-active" : "rating-time-item"} onClick={() => setInterval('all')}>Всё время</div>
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
                                <td>{usr.score}</td>
                            </tr>
                        )}
                        <tr>
                            <td>{userRating}</td>
                            <td>{user.username}</td>
                            <td>{user.location}</td>
                            <td>{user.score}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}