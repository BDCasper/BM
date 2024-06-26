import React, { useEffect, useState } from "react";
import "./header.css";
import Main from "../Main/Main";
import MediaQuery from "react-responsive";
import { User } from "../../App";
import Podpiska from "../Podpiska/podpiska";

interface Props {
    checkUserLog: boolean;
    setInp: (inp:string) => any;
    user: User;
    popOpen: boolean;
    setPopOpen: (popOpen:boolean) => any;
}

export default function Header({checkUserLog, setInp, user, popOpen, setPopOpen}:Props) {

    const [token, setToken] = useState<string>(localStorage && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : '');

    const [inputText, setInputText] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
        if( e.key === 'Enter' ) setInp(inputText);
    };

    useEffect(() => {
        (
        async() => {
            if(inputText === '') setInp('')
        })();
    },[inputText]);
    
    const popup = (
        <div className={popOpen ? "sub-show" : "hidden"}>
            <Podpiska setPopOpen={setPopOpen}/>
        </div>
    )

    return (
        <div className="header">
            {popOpen && popup}
            <a className="headerImg" href="/"><img src="/assets/images/footer-logo.svg"/></a>
            <MediaQuery minWidth={1200}>
                <div className="allCourse"><a href="/">Главная</a></div>
                <div className="web-site"><a href="https://school.bm-chess.com/" target="_blank">Сайт школы</a></div>
                <div className="subscribe" onClick={() => setPopOpen(true)}>Подписка</div>
                {window.location.pathname === '/' ? 
                    <div className="search ">
                        <img src="assets/images/search.svg" className="loop"/>
                        <input type="text" className="searchBar" onKeyUp={handleKeywordKeyPress} onChange={(e) => setInputText(e.target.value)}/>
                        <button className="poisk" onClick={() => setInp(inputText)}>Поиск</button>
                    </div> 
                :
                    <div className="search sHidden">
                        <img src="assets/images/search.svg" className="loop"/>
                        <input type="text" className="searchBar"/>
                        <button name="button" className="poisk">Поиск</button>
                    </div>
                }
                {!token?.includes('.') ? (
                    <>
                        <div className="reg"><a href="/registration">Регистрация</a></div>
                        <div className="login"><a href="/login">Вход</a></div>
                    </>
                ) : (
                        <>
                            <div className="username">{user.email}</div>
                            <a href="/profile" className="header-profile"><img src="assets/images/header-profile.svg"/></a>
                        </>
                )}
                <div className="lang">RU</div>
            </MediaQuery>
            <MediaQuery maxWidth={1200}>
                <div className="lang">RU</div>
                {token?.includes('.') && <div className="username">{user.email}</div>}
                <div className='menu-container'>
                    <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                        <img src={`assets/images/burger-${open ? 'grey' : 'red'}.svg`} alt=""/>
                    </div>
                    <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
                        <ul>
                            <li className = 'dropdownItem'>
                                <a href="/">Все курсы</a>
                            </li>
                            <li className = 'dropdownItem'>
                                <a href="/subscription">Подписка</a>
                            </li>
                            <li className = 'dropdownItem'>
                                <a href="https://school.bm-chess.com/" target="_blank">Сайт школы</a>
                            </li>

                            {!token?.includes('.') ? (
                                <>
                                <li className = 'dropdownItem'>
                                    <a href="/login">Вход</a>
                                </li>
                                <li className = 'dropdownItem'>
                                    <a href="/registration">Регистрация</a>
                                </li>
                                </>
                            ) : (
                                <li className = 'dropdownItem'>
                                    <a href="/profile">Профиль</a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </MediaQuery>
            

        </div>
    );
}