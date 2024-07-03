import React, { useState } from "react";
import "./footer.css";
import Support from "./support/support";

export default function Footer() {

    const [popOpen, setPopOpen] = useState<boolean>(false);

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
                        <div className="footer-text-font"><a href="/">Главная</a></div>
                        <div className="footer-text-font" onClick={() => setPopOpen(true)}>Служба поддержки</div>
                        <div className="footer-text-font">Контакты</div>
                    </div>
                    <div className="footer-text-bottom">Политика пользования</div>
                </div>
            </div>
            <div className="rights">
                <div className="rights-text">Все права защищены</div>
            </div>
        </div>
    );
}
