import React, { useState } from "react";
import "./footer.css";
import Support from "./support/support";
import { useTranslation } from "react-i18next";


export default function Footer() {

    const [popOpen, setPopOpen] = useState<boolean>(false);
    const {t} = useTranslation();

    const popup = (
        <div className={popOpen ? "sub-show" : "hidden"}>
            <Support popOpen={popOpen} setPopOpen={setPopOpen}/>
        </div>
    )

    const handleDownload = (fileName:string) => {
        // Path to the file in the public folder or any accessible path
        const fileUrl = `${process.env.PUBLIC_URL}/${fileName}`; // Replace 'sample.pdf' with your file name
    
        // Create an anchor element programmatically
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName; // Specify the file name for download
    
        // Append the link to the body (necessary for some browsers)
        document.body.appendChild(link);
    
        // Trigger the download by clicking the link
        link.click();
    
        // Remove the link from the DOM
        document.body.removeChild(link);
    };

    return(
        <div className="footer">
            {popOpen && popup}
            <div className="footer-content">
                <div className="footer-text">
                    <div className="footer-text-top">
                        <div className="footer-text-font"><span><a href="/">{t('Главная')}</a></span></div>
                        <div className="footer-text-font"><span>|</span></div>
                        <div className="footer-text-font"><span onClick={() => setPopOpen(true)}>{t('Служба поддержки')}</span></div>
                        <div className="footer-text-font"><span>|</span></div>
                        <div className="footer-text-font"><span><a href="https://docs.google.com/document/d/1U-DGqlcf67K90ine2QH5_jwX1n1NUevC/edit?usp=sharing&ouid=109692704920288354799&rtpof=true&sd=true" target="_blank">{t('Пользовательское соглашение')}</a></span></div>
                        <div className="footer-text-font"><span>|</span></div>
                        <div className="footer-text-font"><span><a href="https://docs.google.com/document/d/1XMvWw5hMLYBI7BrKl-EFUM6Dwjgm0cOv/edit?usp=sharing&ouid=109692704920288354799&rtpof=true&sd=true" target="_blank">{t('Публичная оферта')}</a></span></div>
                        <div className="footer-text-font"><span>|</span></div>
                        <div className="footer-text-font"><span><a href="https://docs.google.com/document/d/1Wegzp2Fd5HJia0nuAdqkqXjvhfTH2YGG/edit?usp=sharing&ouid=109692704920288354799&rtpof=true&sd=true" target="_blank">{t('Политика конфиденциальности')}</a></span></div>
                    </div>
                </div>
            </div>
            <div className="rights">
                <div className="rights-text">{t('© Все права защищены')}. ИП "CHESSLEADER"</div>
                <div className="rights-text">{t('Республика Казахстан, город Астана, улица Куйши Дина, дом 28, квартира 91')}</div>
            </div>
        </div>
    );
}
