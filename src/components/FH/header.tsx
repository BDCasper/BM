import React from "react";
import "./header.css";
import Main from "../Main/Main";
import { useHref } from "react-router-dom";


export default function Header() {

    return (
        <div className="header">
            <a className="headerImg" href="/"><img  src="/assets/images/logo.svg"/></a>
            <div className="header-left">
                <div className="allCourse">Все курсы</div>
                <div className="subscribe">Подписка</div>
                <div className="search"><img src="assets/images/search.svg" className="loop"/><input type="text" className="searchBar"/><button className="poisk" onClick={() => console.log("hello")}>Поиск</button></div>
            </div>
            <div className="header-right">
            <div className="reg">Регистрация</div>
            <div className="login">Вход</div>
            <div className="lang">RU</div>
            </div>
        </div>
    );
}