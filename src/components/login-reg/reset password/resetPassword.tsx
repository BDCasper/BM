import React, { FormEvent, useEffect } from "react";
import "./resetPassword.css"
import { useState } from "react";
import { backend } from "../../../App";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

export default function ResetPassword() {
    
    const [newPassword, setNewPassword] = useState<string>("");
    const [passwordEmpty, setPasswordEmpty] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [wrongCode, setWrongCode] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {t} = useTranslation();

    useEffect(() => {
        (
        async () => {
            setNewPassword(newPassword.trim());
            setCode(code.trim());
        })();
    }, [code, newPassword])

    console.log(location.state.code)

    const handleReset = async(e: FormEvent) => {
        e.preventDefault();
        setPasswordEmpty(false);
        setWrongCode(false);
        if(newPassword.length === 0 || code.length === 0) {
            if(newPassword.length === 0) setPasswordEmpty(true);
            if(code.length === 0) setWrongCode(true);
            return;
        }

        await fetch(`${backend}/api/reset-password`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                token: code,
                newPassword: newPassword
            })
        }).then((response) => { 
            if (response && response.status === 200)
            {
                response.json().then((data) => {
                    navigate("/login", {state: {newPassword: true}});
                })
            }
            else if(response && response.status === 400) {
                setWrongCode(true);
            }
        })

    }

    return(
        <div className="resetPassword-page">
            <div className="resetPassword-ramka">
                <img src="/assets/images/logo.svg" className="resetPassword-logo"/>
                <div className="resetPassword-text">{t('Восстановить пароль')}</div>
                <div className="resetPassword-inputs">
                    <div className="resetPassword-email">
                        <div className="resetPassword-input-text">{t('Введите код')}</div>
                        <input type="text" className={!wrongCode ? "resetPasswordBar" : "resetPasswordBar resetPassword-incorrectBar"} onChange={(e) => setCode(e.target.value)} value={code}/>
                        {(wrongCode) && <div className="resetPassword-email-incorrect">{t('Введите код присланный на почтв')}</div>}
                    </div>
                    <div className="resetPassword-password">
                        <div className="resetPassword-input-text">{t('Придумайте пароль')}</div>
                        <input type="password" className={!passwordEmpty ? "resetPasswordBar" : "resetPasswordBar resetPassword-incorrectBar"} onChange={(e) => setNewPassword(e.target.value)}/>
                        {(passwordEmpty) && <div className="resetPassword-email-incorrect">{t('Введите новый пароль')}</div>}
                    </div>
                    <button className="resetPassword-button" onClick={handleReset}>{t('Обновить пароль')}</button>
                </div>
            </div>
        </div>
    );
}