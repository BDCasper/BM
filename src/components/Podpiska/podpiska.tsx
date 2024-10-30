import React, { useEffect, useState } from "react";
import { backend, User } from "../../App";
import { useNavigate } from "react-router-dom";
import "./podpiska.css"

interface Props {
    setPopOpen: (pop: boolean) => any;
    user: User;
    isSubscribed: boolean;
}

export default function Podpiska({setPopOpen, user, isSubscribed}:Props) {

    const navigate = useNavigate();
    const [choose, setChoose] = useState<number>(1);
    const [token, setToken] = useState<string>(localStorage && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : '');

    const makePayment = async() => {
        if(sessionStorage.getItem("user_id")){
            await fetch(`${backend}/api/payment/create`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + token },
                body: JSON.stringify({
                    user_id: user.user_id,
                    email: user.email,
                    phone: user.phone,
                    amount: choose === 1 ? 8990 : choose === 2 ? 18990 : 26990
                }
                )
            }).then((response) => { 
                if (response && response.status === 200)
                {
                    response.json().then((data) => {
                        localStorage.setItem("order_id", data.order_id)
                        localStorage.setItem("payment_id", data.payment_id)
                        window.location.href = data.payment_page_url;
                    })
                }
                else{
                }
            })
        }
        else {
            navigate("/login");
            setPopOpen(false);
        }
    }


    return(
        <>
            <div className="sub">
                <div className="sub-block-close" onClick={() => setPopOpen(false)}></div>
                <div className="sub-block">
                <div className="sub-ramka">
                    <div className="sub-upper-text">
                        <div className="sub-title">ПОДПИСКА</div>
                        <div className="sub-status">{isSubscribed !== null && isSubscribed === true ? "АКТИВИРОВАНО" : "Неактивированно"}</div>
                        <div className="sub-descr">Безлимитный доступ ко всем урокам</div>
                    </div>
                    <div className="sub-lenta">
                        <div className="sub-lenta-center">
                            <div className={choose === 1 ? "sub-lenta-item sub-lenta-item-active" : "sub-lenta-item"} onClick={() => choose !== 1 ? setChoose(1): null}>
                                <div>1 месяц</div>
                                <div>8990 ₸</div>
                            </div>
                            <div className={choose === 2 ? "sub-lenta-item sub-lenta-item-active" : "sub-lenta-item"} onClick={() => choose !== 2 ? setChoose(2): null}>
                                <div>3 месяца</div>
                                <div>18990 ₸ (30% скидка)</div>
                            </div>
                            <div className={choose === 3 ? "sub-lenta-item sub-lenta-item-active" : "sub-lenta-item"} onClick={() => choose !== 3 ? setChoose(3): null}>
                                <div>6 месяцев</div>
                                <div>26990 ₸ (50% скидка)</div>
                            </div>
                        </div>
                        <div className="sub-lenta-sides">
                            <div className="sub-lenta-left"></div>
                            <div className="sub-lenta-right"></div>
                        </div>
                    </div>
                    <div className="sub-numbers">
                            <ul>
                                <li>22 курса</li>
                                <li>200 уроков</li>
                                <li>4000 задач</li>
                            </ul>
                    </div>
                    <div className="sub-lower-text">
                        <ul>
                            <li>Для взрослых</li>
                            <li>Для детей</li>
                            <li>Для продолжающих</li>
                        </ul>
                    </div>
                    <button className="sub-button" onClick={makePayment}>Оформить подписку</button>
                </div>
                </div>
            </div>
        </>
    );
}