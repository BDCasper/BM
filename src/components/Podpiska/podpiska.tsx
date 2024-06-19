import React, { useEffect, useState } from "react";
import "./podpiska.css"

interface Props {
    setPopOpen: (pop: boolean) => any;
}

export default function Podpiska({setPopOpen}:Props) {
    
    return(
        <>
            <div className="sub">
                <div className="sub-block-close" onClick={() => setPopOpen(false)}></div>
                <div className="sub-block">
                <div className="sub-ramka">
                    <div className="sub-upper-text">
                        <div className="sub-title">ПОДПИСКА</div>
                        <div className="sub-status">Неактивировано</div>
                        <div className="sub-descr">Безлимитный доступ ко всем урокам</div>
                    </div>
                    <div className="sub-lenta">
                        <div className="sub-lenta-center">
                            <table>
                                <thead>
                                    <tr>
                                        <th>1 месяц:</th>
                                        <th>3 месяца:</th>
                                        <th>6 месяцев:</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>8990 ₸</td>
                                        <td>18990 ₸ (30% скидка)</td>
                                        <td>26990 ₸ (50% скидка)</td>
                                    </tr>
                                </tbody>
                            </table>    
                        </div>
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
                    <div className="sub-lower-text">
                        <ul>
                            <li>Для взрослых</li>
                            <li>Для детей</li>
                            <li>Для продолжающих</li>
                        </ul>
                    </div>
                    <button className="sub-button">Оформить подписку</button>
                </div>
                </div>
            </div>
        </>
    );
}