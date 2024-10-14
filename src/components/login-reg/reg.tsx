import React, { useEffect } from "react";
import "./reg.css"
import { backend } from "../../App";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


export default function Reg() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState<string>("");
    const [userName, setUserName] = useState<string>("");
    const [emailFree, setEmailFree] = useState<boolean>(true);
    const [emailEmpty, setEmailEmpty] = useState<boolean>(false);
    const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false);
    const [usernameEmpty, setUsernameEmpty] = useState<boolean>(false);
    const [emailCorrect, setEmailCorrect] = useState<boolean>(true);
    const [passwordCorrect, setPasswordCorrect] = useState<boolean>(true);
    const eRegex : RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const pRegex : RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/;
    const navigate = useNavigate();
    const {t} = useTranslation();


    const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
        if( e.key === 'Enter' ) register();
    };

    useEffect(() => {
        (
        async () => {
            setEmail(email.trim());
            setPassword(password.trim())
        })();
    }, [email, password])

    const register = async() => {
        setEmailCorrect(true);
        setPasswordCorrect(true);
        setEmailFree(true);
        setEmailEmpty(false);
        setPasswordEmpty(false);
        setUsernameEmpty(false);
        if(email.length === 0 || password.length === 0 || userName.length === 0 || !eRegex.test(email) ) {
            if(email.length === 0) setEmailEmpty(true);
            if(userName.length === 0) setUsernameEmpty(true);
            if(password.length === 0) setPasswordEmpty(true);
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
                password: password,
                username: userName
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
                <div className="reg-text">{t('Добро пожаловать в шахматную школу')}</div>
                <div className="reg-text">{t('"Будущие миллионеры"')}</div>
                <div className="reg-inputs">
                    <div className="email">
                        <div className={emailEmpty || !emailCorrect || !emailFree ? "reg-input-text incorrect" : "reg-input-text"}>{t('E-mail')}</div>
                        <input type="text" className={emailEmpty || !emailCorrect || !emailFree ? "regBar incorrectBar" : "regBar"} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="reg-username">
                        <div className={ usernameEmpty ? "reg-input-text incorrect" : "reg-input-text"}>{t('Придумайте имя пользователя')}</div>
                        <input type="text" className={ usernameEmpty ? "regBar incorrect" : "regBar"} onKeyUp={handleKeywordKeyPress} onChange={(e) => setUserName(e.target.value)}/>
                    </div>
                    <div className="password">
                        <div className={ passwordEmpty || !passwordCorrect ? "reg-input-text incorrect" : "reg-input-text"}>{t('Придумайте пароль')}</div>
                        <input type="password" className={ passwordEmpty || !passwordCorrect ? "regBar incorrectBar" : "regBar"} onKeyUp={handleKeywordKeyPress} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="reg-button" onClick={register}>{t('Зарегистрироваться')}</button>
                    {(!emailFree) && <div className="reg-email-incorrect">{t('Данный эл. адресс уже зарегестрирован')}</div>}
                    <div className="reg-to-log">{t('Уже есть аккаунт?')} <a href="/login">{t('Войти')}</a></div>
                    <div className="reg-google"><img src="/assets/images/google-logo.svg" className="reg-google-logo" alt=""/><p>{t('Войти через Google')}</p></div>
                </div>
            </div>
        </div>
    );
}