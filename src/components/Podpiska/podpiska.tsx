import React, { useEffect, useState } from "react";
import { backend } from "../../App";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';
import "./podpiska.css"

interface Props {
    setPopOpen: (pop: boolean) => any;
}

export default function Podpiska({setPopOpen}:Props) {

    const navigate = useNavigate();
    const [choose, setChoose] = useState<number>(1);
    const [paymentData, setPaymentData] = useState<object>({
        amount: 8990,                  
        currency: "KZT",                
        order_id: "pay_" + (new Date()).getTime(),        
        description: "test",
        payment_type: "pay",
        payment_method: "ecom", 
        success_url: "bm-chess.com",
        failure_url: "bm-chess.com",
        callback_url: "bm-chess.com",
        merchant_term_url: "bm-chess.com",
        payment_lifetime: 6000,
        create_recurrent_profile: false,
        recurrent_profile_lifetime: 9999,
        lang: "ru",
        items: [
                {
                    merchant_id: "1a49fb7e-4c75-4317-b421-c4da40668e1e",
                    service_id: "bc69c289-4b0a-4c6f-ab20-12884716b7c5",
                    merchant_name: "Test",
                    name: "hello",
                    quantity: 1,
                    amount_one_pcs: 8990,
                    amount_sum: 8990,
                }
            ],    
    });

    useEffect(() => {
        (
            async() => {
                if(choose === 1) {
                    setPaymentData({
                        amount: 8990,                  
                        currency: "KZT",                
                        order_id: "pay_" + (new Date()).getTime(),        
                        description: "test",
                        payment_type: "pay",
                        payment_method: "ecom", 
                        success_url: "bm-chess.com",
                        failure_url: "bm-chess.com",
                        callback_url: "bm-chess.com",
                        merchant_term_url: "bm-chess.com",
                        payment_lifetime: 6000,
                        create_recurrent_profile: false,
                        recurrent_profile_lifetime: 9999,
                        lang: "ru",
                        items: [
                                {
                                    merchant_id: "1a49fb7e-4c75-4317-b421-c4da40668e1e",
                                    service_id: "bc69c289-4b0a-4c6f-ab20-12884716b7c5",
                                    merchant_name: "Test",
                                    name: "hello",
                                    quantity: 1,
                                    amount_one_pcs: 8990,
                                    amount_sum: 8990,
                                }
                            ],    
                    })
                }
                if(choose === 2) {
                    setPaymentData({
                        amount: 18990,                  
                        currency: "KZT",                
                        order_id: "pay_" + (new Date()).getTime(),        
                        description: "test",
                        payment_type: "pay",
                        payment_method: "ecom", 
                        success_url: "bm-chess.com",
                        failure_url: "bm-chess.com",
                        callback_url: "bm-chess.com",
                        merchant_term_url: "bm-chess.com",
                        payment_lifetime: 6000,
                        create_recurrent_profile: false,
                        recurrent_profile_lifetime: 9999,
                        lang: "ru",
                        items: [
                                {
                                    merchant_id: "1a49fb7e-4c75-4317-b421-c4da40668e1e",
                                    service_id: "bc69c289-4b0a-4c6f-ab20-12884716b7c5",
                                    merchant_name: "Test",
                                    name: "hello",
                                    quantity: 1,
                                    amount_one_pcs: 18990,
                                    amount_sum: 18990,
                                }
                            ],    
                    })
                }
                if(choose === 3) {
                    setPaymentData({
                        amount: 26990,                  
                        currency: "KZT",                
                        order_id: "pay_" + (new Date()).getTime(),        
                        description: "test",
                        payment_type: "pay",
                        payment_method: "ecom", 
                        success_url: "bm-chess.com",
                        failure_url: "bm-chess.com",
                        callback_url: "bm-chess.com",
                        merchant_term_url: "bm-chess.com",
                        payment_lifetime: 6000,
                        create_recurrent_profile: false,
                        recurrent_profile_lifetime: 9999,
                        lang: "ru",
                        items: [
                                {
                                    merchant_id: "1a49fb7e-4c75-4317-b421-c4da40668e1e",
                                    service_id: "bc69c289-4b0a-4c6f-ab20-12884716b7c5",
                                    merchant_name: "Test",
                                    name: "hello",
                                    quantity: 1,
                                    amount_one_pcs: 26990,
                                    amount_sum: 26990,
                                }
                            ],    
                    })
                }
            }
        )()
    },[choose])

    const api_key_base64 = btoa("95d8d6be-c16c-4565-a086-301145b2c093");
    const request_data_base64 = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(paymentData)));
    const reqData = request_data_base64;
    const sign = CryptoJS.HmacSHA512(request_data_base64, "dbdb378ea0c5a07951140a1b207bc24cb3f8441b00239f674b2d5771e6b74fff").toString()

    const makePayment = async() => {
        if(sessionStorage.getItem("user_id")){
            await fetch(`https://api.onevisionpay.com/payment/create`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + api_key_base64 },
                body: JSON.stringify({
                    data: reqData,
                    sign: sign
                }
                )
            }).then((response) => { 
                if (response && response.status === 200)
                {
                    response.json().then((data) => {
                        window.location.href = JSON.parse(atob(data.data)).payment_page_url;
                    })
                }
                else{
                }
            })
        }
        else {
            navigate("/login");
        }
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
                            <div className={choose === 1 ? "sub-lenta-item sub-lenta-item-active" : "sub-lenta-item"} onClick={() => choose !== 1 ? setChoose(1): null}>
                                <div>1 месяц</div>
                                <div>8990 ₸</div>
                            </div>
                            <div className={choose === 2 ? "sub-lenta-item sub-lenta-item-active" : "sub-lenta-item"} onClick={() => choose !== 2 ? setChoose(2): null}>
                                <div>3 месяца</div>
                                <div>18990 ₸ (30% скидка)</div>
                            </div>
                            <div className={choose === 3 ? "sub-lenta-item sub-lenta-item-active" : "sub-lenta-item"} onClick={() => choose !== 3 ? setChoose(3): null}>
                                <div>6 месяцев</div>
                                <div>26990 ₸ (50% скидка)</div>
                            </div>
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