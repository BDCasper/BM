import React, { useEffect } from "react";
import "./reg.css"
import { backend } from "../../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reg() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string>("");
    const [emailFree, setEmailFree] = useState<boolean>(true);
    const [emailNotEmpty, setEmailNotEmpty] = useState<boolean>(true);
    const [emailCorrect, setEmailCorrect] = useState<boolean>(true);
    const [passwordNotEmpty, setPasswordNotEmpty] = useState<boolean>(true);
    const [passwordCorrect, setPasswordCorrect] = useState<boolean>(true);
    const eRegex : RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const pRegex : RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/;
    const navigate = useNavigate();

    useEffect(() => {
        (
        async () => {
            setEmail(email.trim());
            setPassword(password.trim())
        })();
    }, [email, password])

    const register = async() => {
        if(email.length === 0 || password.length === 0 || !eRegex.test(email) ) {
            setEmailNotEmpty(true);
            setEmailCorrect(true);
            setPasswordNotEmpty(true);
            setPasswordCorrect(true);
            setEmailFree(true);
            if(email.length === 0) setEmailNotEmpty(false);
            if(password.length === 0) setPasswordNotEmpty(false);
            if(!eRegex.test(email)) setEmailCorrect(false);
            //if(!pRegex.test(password)) setPasswordCorrect(false);
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
                    navigate("/login")
                })
            }
            if(response.status === 400)
            {
                setEmailFree(false);
            }
        })
    }

    return(
        <div className="reg-page">
            <div className="reg-ramka">
                <img src="/assets/images/logo.svg" className="reg-logo" alt=""/>
                <div className="reg-text">Добро пожаловать в шахматную школу</div>
                <div className="reg-text">"Будущие миллионеры"</div>
                <div className="reg-inputs">
                    <div className="email">
                        <div className={!emailNotEmpty||!emailCorrect||!emailFree ? "email-text incorrect" : "email-text"}>E-mail</div>
                        <input type="text" className={!emailNotEmpty||!emailCorrect||!emailFree ? "emailBar incorrectBar" : "emailBar"} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="password">
                        <div className={!passwordNotEmpty||!passwordCorrect ? "password-text incorrect" : "password-text"}>Придумайте пароль</div>
                        <input type="password" className={!passwordNotEmpty||!passwordCorrect ? "passwordBar incorrectBar" : "passwordBar"} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="reg-button" onClick={register}>Зарегистрироваться</button>
                    {(!emailFree) && <div className="reg-email-incorrect">Данный эл. адресс уже зарегестрирован</div>}
                    <div className="reg-to-log">Уже есть аккаунт? <a href="/login">Войти</a></div>
                    <div className="reg-google"><img src="/assets/images/google-logo.svg" className="reg-google-logo" alt=""/><p>Войти через Google</p></div>
                </div>
            </div>
        </div>
    );
}