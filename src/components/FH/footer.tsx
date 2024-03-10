import React from "react";
import "./footer.css";

export default function Footer() {

    return(
        <div className="footer">
            <div className="footer-content">
                <img src="/assets/images/footer-logo.svg" className="footerImg"/>
                <div className="footer-text">
                    <div className="footer-text-font">Главная</div>
                    <div className="footer-text-font">Контакты</div>
                    <div className="footer-text-font">Служба поддержки</div>
                    <div className="footer-text-font">Политика пользования</div>
                </div>
            </div>
            <div className="rights">
                <div className="rights-text">Все права защищены</div>
            </div>
        </div>
    );
}
