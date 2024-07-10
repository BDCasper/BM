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

    return(
        <div className="footer">
            {popOpen && popup}
            <div className="footer-content">
                <img src="/assets/images/footer-logo.svg" className="footerImg"/>
                <div className="footer-text">
                    <div className="footer-text-top">
                        <div className="footer-text-font"><a href="/">{t('Главная')}</a></div>
                        <div className="footer-text-font" onClick={() => setPopOpen(true)}>{t('Служба поддержки')}</div>
                        <div className="footer-text-font">{t('Контакты')}</div>
                    </div>
                    <div className="footer-text-bottom">{t('Политика пользования')}</div>
                </div>
            </div>
            <div className="rights">
                <div className="rights-text">{t('Все права защищены')}</div>
            </div>
        </div>
    );
}
