import React, { useState } from "react";
import "./header.css";
import Main from "../Main/Main";
import { useHref } from "react-router-dom";

interface Props {
    checkUserLog: boolean;
}

export default function Header({checkUserLog}:Props) {

    return (
        <div className="header">
            <img src="/assets/images/footer-logo.svg" className="headerImg"/>
            <div className="header-left">
            <div className="allCourse"><a href="/">Все курсы</a></div>
            <a className="subscribe" href="/subscription"><div >Подписка</div></a>
                <div className="search"><img src="assets/images/search.svg" className="loop"/><input type="text" className="searchBar"/><button className="poisk" onClick={() => console.log("hello")}>Поиск</button></div>
            </div>
            {checkUserLog === false ?(
                <div className="header-right">
                    <div className="reg"><a href="/registration">Регистрация</a></div>
                    <div className="login"><a href="/login">Вход</a></div>
                </div>
            ) : (
                <div className="header-right">
                    <a href="/profile" className="header-profile"><img src="assets/images/header-profile.svg"/></a>
                </div>
            )}
            <div className="lang">RU</div>

        </div>
    );
}