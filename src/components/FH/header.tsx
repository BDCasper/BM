import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import Main from "../Main/Main";
import MediaQuery from "react-responsive";
import { User } from "../../App";
import Podpiska from "../Podpiska/podpiska";
import i18n from "../../i18n/i18n";
import { useTranslation } from "react-i18next";

interface Props {
    checkUserLog: boolean;
    setInp: (inp:string) => any;
    user: User;
    popOpen: boolean;
    setPopOpen: (popOpen:boolean) => any;
    allowSearch: boolean;
    isSubscribed: boolean;
}

export default function Header({checkUserLog, setInp, user, popOpen, setPopOpen, allowSearch, isSubscribed}:Props) {

    const [token, setToken] = useState<string>(localStorage && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : '');

    const [inputText, setInputText] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);

    const {t} = useTranslation();
    const observer = useRef<IntersectionObserver | null>(null); // Store observer

    // Helper function to add the "visible" class when the block comes into view
    const observeBlocks = () => {
      const themeBlocks = document.querySelectorAll('.header');
      observer.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible'); // Add the class when it enters the viewport
              observer.current?.unobserve(entry.target); // Stop observing once it's visible
            }
          });
        },
        { threshold: 0.1 } // Trigger when 10% of the block is visible
      );

      themeBlocks.forEach((block) => {
        observer.current?.observe(block); // Observe each theme-block
      });
    };


    const changeLanguage = (lng: string) => {
      i18n.changeLanguage(lng);
    };
  
    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      changeLanguage(event.target.value);
    };

    const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
        if( e.key === 'Enter' ) setInp(inputText);
    };

    useEffect(() => {
        (
            async() => {
                observeBlocks();
                return () => {
                    observer.current?.disconnect();
                };
            }
        )()
    },[user.user_id])

    useEffect(() => {
        (
        async() => {
            if(inputText === '') setInp('')
        })();
    },[inputText]);
    
    const popup = (
        <div className={popOpen ? "sub-show" : "hidden"}>
            <Podpiska setPopOpen={setPopOpen} user={user} isSubscribed={isSubscribed}/>
        </div>
    )

    return (
        <>
            {popOpen && popup}
            <div className="header">
                <a className="headerImg" href="/"><img src="/assets/images/footer-logo.svg"/></a>
                <MediaQuery minWidth={1200}>
                    <div className="header-allCourse" onClick={() => sessionStorage.removeItem("scrollPosition")}><a href="/">{t('Главная')}</a></div>
                    <div className="header-web-site"><a href="https://school.bm-chess.com/" target="_blank">{t('Сайт школы')}</a></div>
                    <div className="header-subscribe" onClick={() => setPopOpen(true)}>{t('Подписка')}</div>
                    {allowSearch === true ? 
                        <div className="header-search ">
                            <img src="/assets/images/search.svg" className="header-loop"/>
                            <input type="text" className="header-searchBar" onKeyUp={handleKeywordKeyPress} onChange={(e) => setInputText(e.target.value)}/>
                            <button className="header-poisk" onClick={() => setInp(inputText)}>{t('Поиск')}</button>
                        </div> 
                    :
                        <div className="header-search sHidden">
                            <img src="/assets/images/search.svg" className="header-loop"/>
                            <input type="text" className="header-searchBar"/>
                            <button name="button" className="header-poisk">{t('Поиск')}</button>
                        </div>
                    }
                    {!user.user_id ? (
                        <>
                            <div className="header-reg"><a href="/registration">{t('Регистрация')}</a></div>
                            <div className="header-login"><a href="/login">{t('Вход')}</a></div>
                        </>
                    ) : (
                            <>
                                <div className="header-rating"><a href="/rating">{t('Рейтинг')}</a></div>
                                <div className="header-username">{user.username ? user.username : user.email}</div>
                                <a href="/profile" className="header-profile"><img className="header-profile-image" src={user && user.pfp ? user.pfp : "/assets/images/header-profile.svg"}/></a>
                            </>
                    )}
                    <div className="header-lang"> 
                        <select onChange={handleLanguageChange} defaultValue={i18n.language}>
                            <option value="ru">Русский</option>
                            <option value="kk">Қазақ</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </MediaQuery>
                <MediaQuery maxWidth={1200}>
                    <div className="header-lang">
                        <select onChange={handleLanguageChange} defaultValue={i18n.language}>
                            <option value="ru">Русский</option>
                            <option value="kk">Қазақ</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    {user.user_id && <div className="header-username">{user.email}</div>}
                    <div className='menu-container'>
                        <div className='menu-trigger' onClick={()=>{setOpen(!open)}}>
                            <img src={`/assets/images/burger-${open ? 'grey' : 'red'}.svg`} alt=""/>
                        </div>
                        <div className={`header-dropdown-menu ${open ? 'active' : 'inactive'}`} >
                            <ul>
                                <li className = 'header-dropdownItem'>
                                    <a href="/">{t('Главная')}</a>
                                </li>
                                <li className = 'header-dropdownItem'>
                                    <a href="/subscription">{t('Подписка')}</a>
                                </li>
                                <li className = 'header-dropdownItem'>
                                    <a href="https://school.bm-chess.com/" target="_blank">{t('Сайт школы')}</a>
                                </li>

                                {!user.user_id ? (
                                    <>
                                    <li className = 'header-dropdownItem'>
                                        <a href="/login">{t('Вход')}</a>
                                    </li>
                                    <li className = 'header-dropdownItem'>
                                        <a href="/registration">{t('Регистрация')}</a>
                                    </li>
                                    </>
                                ) : (
                                    <li className = 'header-dropdownItem'>
                                        <a href="/profile">{t('Профиль')}</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </MediaQuery>
            </div>
        </>
    );
}