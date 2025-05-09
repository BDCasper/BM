import React, { useEffect, useState } from "react";
import { backend, User } from "../../App";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
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
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [checkPhone, setCheckPhone] = useState(false);

    const handlePhoneChange = async(value: React.SetStateAction<string>) => {
        setPhone(value)
    }

    useEffect(() => {
        (
            async() => {
                if(phone !== ''){
                    setCheckPhone(true);
                    if(phone.length < 11) setCheckPhone(false);
                }
            }
        )()
    },[phone])

    console.log(phone)

    const makePayment = async() => {
        if(sessionStorage.getItem("user_id")){
            if(checkPhone === true){

                await fetch(`${backend}/api/payment/create`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + token },
                    body: JSON.stringify({
                        user_id: user.user_id,
                        email: user.email,
                        phone: phone,
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
        }
        else {
            navigate("/login");
            setPopOpen(false);
        }
    }

    const popup = (
        <div className="sub-popup">
            <div className="sub-block-close-popup" onClick={() => setPopupOpen(false)}></div>
            <div className="sub-block-popup">
                <div className="sub-ramka-popup">
                    <div className="profile-name">Введите номер телефона</div>
                    <PhoneInput containerClass={phone === '' || checkPhone ? "phone-containter" : "phone-containter wrong-input"} inputClass="phone-input" buttonClass="phone-input-button" country={'kz'} placeholder="+7 777 777 77 77" value={phone} inputProps={{required: true,}} onChange={handlePhoneChange}/>
                    <button className="sub-button" onClick={makePayment}>Оформить подписку</button>
                </div>
            </div>
        </div>

    )

    return(
        <>
            {popupOpen && popup}
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
                    <button className="sub-button" onClick={() => setPopupOpen(true)}>Оформить подписку</button>
                </div>
                </div>
            </div>
        </>
    );
}