import React, { FormEvent, useEffect } from "react";
import "./login.css"
import { useState } from "react";
import { backend } from "../../App";
import UserProps from "../../App"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



export default function Login() {
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [emailEmpty, setEmailEmpty] = useState<boolean>(true);
    const [passwordEmpty, setPasswordEmpty] = useState<boolean>(true);
    const [accExist, setAccExist] = useState<boolean>(true);
    const navigate = useNavigate();
    const {t} = useTranslation();


    const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
        if( e.key === 'Enter' ) login(e);
    };

    useEffect(() => {
        (
        async () => {
            setEmail(email.trim());
            setPassword(password.trim())
        })();
    }, [email, password])

    const login = async(e: FormEvent) => {
        e.preventDefault();
        setAccExist(true)
        setEmailEmpty(true);
        setPasswordEmpty(true);
        if(email.length === 0 || password.length === 0) {
            if(email.length === 0) setEmailEmpty(false);
            if(password.length === 0) setPasswordEmpty(false);
            return;
        }

        await fetch(`${backend}/api/login`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => { 
            if (response && response.status === 200)
            {
                response.json().then((data) => {
                    localStorage.setItem('token', JSON.stringify(data.token));
                    navigate("/");
                    window.location.reload();
                })
            }
            else{
                setAccExist(false);
            }
        })

        await fetch( `${backend}/api/refresh`, {
            headers: { 'Content-Type': 'apppcation/json' },
            //credentials: 'include'
        }).then((res) => {
            if (res && res.status === 200) {
                alert('darova')
            } 
        })
    }


    return(
        <div className="log-page">
            <div className="log-ramka">
                <img src="/assets/images/logo.svg" className="log-logo"/>
                <div className="log-text">{t('Добро пожаловать в шахматную школу')}</div>
                <div className="log-text">{t('"Будущие миллионеры"')}</div>
                <div className="log-inputs">
                    <div className="log-email">
                        <div className={emailEmpty ? "log-input-text" : "log-input-text log-empty"}>{t('E-mail')}</div>
                        <input type="text" className={emailEmpty ? "logBar" : "logBar log-incorrectBar"} onKeyUp={handleKeywordKeyPress} onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </div>
                    <div className="log-password">
                        <div className={passwordEmpty ? "log-input-text" : "log-input-text log-empty"}>{t('Пароль')}</div>
                        <input type="password" className={passwordEmpty ? "logBar" : "logBar log-incorrectBar"} onKeyUp={handleKeywordKeyPress} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="log-button" onClick={login}>{t('Войти')}</button>
                    <div className="log-password-recover"><a href="">{t('Забыли пароль?')}</a></div>
                    {(!accExist) && <div className="log-email-incorrect">{t('Неправильно введены эл. адресс или пароль')}</div>}
                    <div className="log-to-reg-text">{t('Нет аккаунта?')} <a href="/registration">{t('Зарегистрироваться')}</a></div>
                    <div className="log-to-reg"></div>
                    <div className="log-google"><img src="/assets/images/google-logo.svg" className="log-google-logo"/><p>{t('Войти через Google')}</p></div>
                </div>
            </div>
        </div>
    );
}