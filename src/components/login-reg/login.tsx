import React, { FormEvent, useEffect } from "react";
import "./login.css"
import { useState } from "react";
import { backend } from "../../App";
import UserProps from "../../App"
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store";
import { loginUser } from "../../store/auth/actionCreator";

interface Props {
    setUser:(user:UserProps) => any;
}   

export default function Login({setUser}:Props) {

    const dispatch = useAppDispatch();
    
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
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

    const login = async(e: FormEvent) => {
        e.preventDefault();
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
                    setUser(data);
                    console.log(data);
                    navigate("/");
                })
            }
            if(response.status === 400)
            {
                alert("Ne ZAEBIS")
            }
        })

        await fetch( `${backend}/api/refresh`, {
            headers: { 'Content-Type': 'apppcation/json' },
            //credentials: 'include'
        }).then((res) => {
            if (res && res.status === 200) {
                alert('darova')
            } else {
                alert('ne darova')
            }
        })
    }


    return(
        <div className="log-page">
            <div className="log-ramka">
                <img src="/assets/images/logo.svg" className="log-logo"/>
                <div className="log-text">Добро пожаловать в шахматную школу "Будущие миллионеры"</div>
                <div className="log-inputs">
                    <div className="log-email">
                        <div className={emailEmpty ? "log-email-text" : "log-email-text log-empty"}>E-mail</div>
                        <input type="text" className={emailEmpty ? "log-emailBar" : "log-emailBar log-incorrectBar"} onChange={(e) => setEmail(e.target.value)} value={email}/>
                    </div>
                    <div className="log-password">
                        <div className={passwordEmpty ? "log-password-text" : "log-password-text log-empty"}>Пароль</div>
                        <input type="text" className={passwordEmpty ? "log-passwordBar" : "log-passwordBar log-incorrectBar"} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button className="log-button" onClick={login}>Войти</button>
                    <div className="log-password-recover"><a href="">Забыли пароль?</a></div>
                    <span className="log-to-reg-text">Нет аккаунта? <a href="/registration">Зарегистрироваться</a></span>
                    <div className="log-to-reg"></div>
                    <div className="log-google"><img src="/assets/images/google-logo.svg" className="log-google-logo"/><p>Войти через Google</p></div>
                </div>
            </div>
        </div>
    );
}