import React, { useEffect, useState } from "react";
import { backend } from "../../App";
import { Buffer } from "buffer";
import * as sha512 from 'js-sha512';
import "./podpiska.css"

interface Props {
    setPopOpen: (pop: boolean) => any;
}

export default function Podpiska({setPopOpen}:Props) {
    
    const API_KEY = btoa("95d8d6be-c16c-4565-a086-301145b2c093");
    
    // const obj = {
    //     amount: 8990,
    //     currency: "KZT",
    //     description: "Подписка на 1 месяц",
    //     payment_type: "pay",
    //     payment_method: "ecom",
    //     items: [
    //         {
    //             merchant_id: "1a49fb7e-4c75-4317-b421-c4da40668e1e",
    //             service_id: "bc69c289-4b0a-4c6f-ab20-12884716b7c5",
    //             merchant_name: "Тестовый Chessleader",
    //             name: "Подписка на 1 месяц",
    //             quantity: 1,
    //             amount_one_pcs: 8990,
    //             amount_sum: 8990
    //         }
    //     ],
    //     email: "d.belkairov@gmail.com",
    //     payment_lifetime: 600,
    //     lang: "ru"
    // }

    // const obj = {
    //     amount: 8990,
    //     currency: "KZT",
    //     description: "Podpiska 1 mounth",
    //     payment_type: "pay",
    //     payment_method: "ecom",
    //     items: [
    //         {
    //             merchant_id: "1a49fb7e-4c75-4317-b421-c4da40668e1e",
    //             service_id: "bc69c289-4b0a-4c6f-ab20-12884716b7c5",
    //             merchant_name: "Chessleader",
    //             name: "Podpiska 1 mounth",
    //             quantity: 1,
    //             amount_one_pcs: 8990,
    //             amount_sum: 8990
    //         }
    //     ],
    //     email: "d.belkairov@gmail.com",
    //     payment_lifetime: 600,
    //     lang: "ru"
    // }

    // const dataJSON = JSON.stringify(obj);

    // const paymentData = window.btoa(dataJSON);
    // const sign = sha512.sha512(paymentData);

    const makePayment = async() => {
        // await fetch(`https://api.onevisionpay.com/payment/create`, {
        //     method: "POST",
        //     headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + {API_KEY} },
        //     body: JSON.stringify({
        //         data: paymentData,
        //         sign: sign
        //     })
        // }).then((response) => { 
        //     if (response && response.status === 200)
        //     {
        //         response.json().then((data) => {
                    
        //         })
        //     }
        //     else{
        //     }
        // })
    }

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
                    <button className="sub-button" onClick={makePayment}>Оформить подписку</button>
                </div>
                </div>
            </div>
        </>
    );
}