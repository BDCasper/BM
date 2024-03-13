import React, { useEffect } from "react";
import "./reg.css"
import { backend } from "../../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserProps from "../../App"

interface Props {
    setUser: (user:UserProps) => any;
}

export default function Reg({setUser}: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string>("");
    const [emailFree, setEmailFree] = useState<boolean>(true);
    const [emailEmpty, setEmailEmpty] = useState<boolean>(true);
    const [passwordEmpty, setPasswordEmpty] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        (
        async () => {
            setEmail(email.trim());
            setPassword(password.trim())
        })();
    }, [email, password])

    const register = async() => {
        if(email.length === 0 || password.length === 0) {
            setEmailEmpty(true);
            setPasswordEmpty(true);
            if(email.length === 0) setEmailEmpty(false);
            if(password.length === 0) setPasswordEmpty(false);
            return;
        }

        await fetch(`${backend}/api/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => { 
            if (response && response.status === 201)
            {
                response.json().then((data) => {
                    setUser(data);
                    navigate("/login")
                })
            }
            if(response.status === 400)
            {
                response.json().then((data) => {
                    setEmailFree(false);
                })
            }
        })
    }

    return(
        <div className="reg-page">
            <div className="reg-ramka">
                <img src="/assets/images/logo.svg" className="reg-logo"/>
                <div className="reg-text">Добро пожаловать в шахматную школу "Будущие миллионеры"</div>
                <div className="reg-inputs">
                    <div className="email">
                        <div className={emailEmpty ? "email-text" : "email-text incorrect"}>E-mail</div>
                        <input type="text" className={emailEmpty ? "emailBar" : "emailBar incorrectBar"} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="password">
                        <div className={passwordEmpty ? "password-text" : "password-text incorrect"}>Придумайте пароль</div>
                        <input type="text" className={passwordEmpty ? "passwordBar" : "passwordBar incorrectBar"} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="reg-button" onClick={register}>Зарегистрироваться</button>
                    {!emailFree && <div className="reg-email-incorrect">Данный эл. адресс недействителен</div>}
                    <div className="reg-to-log">Уже есть аккаунт? <a href="/login">Войти</a></div>
                    <div className="reg-google"><img src="/assets/images/google-logo.svg" className="reg-google-logo"/><p>Войти через Google</p></div>
                </div>
            </div>
        </div>
    );
}