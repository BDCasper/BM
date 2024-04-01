import React, { useState } from "react";
import "./header.css";
import Main from "../Main/Main";

interface Props {
    checkUserLog: boolean;
    setInp: (inp:string) => any;
}

export default function Header({checkUserLog, setInp}:Props) {

    let token = JSON.parse(JSON.stringify(sessionStorage.getItem("token")));

    return (
        <div className="header">
            <a className="headerImg" href="/"><img src="/assets/images/footer-logo.svg"/></a>
            <div className="allCourse"><a href="/">Все курсы</a></div>
            <a className="subscribe" href="/subscription"><div >Подписка</div></a>
                {window.location.pathname === '/' ? 
                <div className="search ">
                    <img src="assets/images/search.svg" className="loop"/>
                    <input type="text" className="searchBar" onChange={(e) => setInp(e.target.value)}/>
                    <button className="poisk" onClick={() => console.log()}>Поиск</button>
                </div> 
            :
                <div className="search sHidden">
                    <img src="assets/images/search.svg" className="loop"/>
                    <input type="text" className="searchBar"/>
                    <button className="poisk" onClick={() => console.log("hello")}>Поиск</button>
                </div>
            }
            {!token?.includes('.') ? (
                <>
                    <div className="reg"><a href="/registration">Регистрация</a></div>
                    <div className="login"><a href="/login">Вход</a></div>
                </>
            ) : (
                    <a href="/profile" className="header-profile"><img src="assets/images/header-profile.svg"/></a>
            )}
            <div className="lang">RU</div>

        </div>
    );
}