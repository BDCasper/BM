import React from "react";
import "./podpiska.css"

export default function Podpiska() {


    return(
        <div className="sub">
            <div className="sub-ramka">
                <div className="sub-upper-text">
                    <div className="sub-title">ПОДПИСКА</div>
                    <div className="sub-status">Неактивировано</div>
                    <div className="sub-descr">Безлимитный доступ ко всем урокам</div>
                </div>
                <div className="sub-lenta">
                    <div className="sub-lenta-center"><span className="sub-lenta-center-text">33$ в месяц</span></div>
                    <div className="sub-lenta-sides">
                        <div className="sub-lenta-left"></div>
                        <div className="sub-lenta-right"></div>
                    </div>
                </div>
                <div className="sub-numbers">
                        <ul>
                            <li>22 курса</li>
                            <li>200 уроков</li>
                            <li>4000 задач</li>
                        </ul>
                </div>
            </div>

        </div>
    );
}