import React from "react";
import "./reg.css"

export default function Reg() {

    return(
        <div className="reg-page">
            <div className="reg-ramka">
                <img src="/assets/images/logo.svg" className="reg-logo"/>
                <div className="reg-text">Добро пожаловать в шахматную школу "Будущие миллионеры"</div>
                <div className="reg-inputs">
                    <div className="email">
                        <div className="email-text">E-mail</div>
                        <input type="text" className="emailBar"/>
                    </div>
                    <div className="password">
                        <div className="password-text">Придумайте пароль</div>
                        <input type="text" className="passwordBar"/>
                    </div>
                    <button className="reg-button">Зарегистрироваться</button>
                    <div className="reg-to-log">Уже есть аккаунт? <a href="/login">Войти</a></div>
                    <div className="reg-google"><img src="/assets/images/google-logo.svg" className="reg-google-logo"/><p>Войти через Google</p></div>
                </div>
            </div>
        </div>
    );
}