import React from "react";
import "./login.css"

export default function Login() {


    return(
        <div className="log-page">
            <div className="log-ramka">
                <img src="/assets/images/logo.svg" className="log-logo"/>
                <div className="log-text">Добро пожаловать в шахматную школу "Будущие миллионеры"</div>
                <div className="log-inputs">
                    <div className="log-email">
                        <div className="log-email-text">E-mail</div>
                        <input type="text" className="log-emailBar"/>
                    </div>
                    <div className="log-password">
                        <div className="log-password-text">Пароль</div>
                        <input type="text" className="log-passwordBar"/>
                    </div>
                    <button className="log-button">Войти</button>
                    <div className="log-password-recover"><a href="">Забыли пароль?</a></div>
                    <div className="log-to-reg"><span className="log-to-reg-text">Нет аккаунта? <a href="/login">Зарегистрироваться</a></span></div>
                    <div className="log-google"><img src="/assets/images/google-logo.svg" className="log-google-logo"/><p>Войти через Google</p></div>
                </div>
            </div>
        </div>
    );
}