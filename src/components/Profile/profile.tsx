import React from "react";
import "./profile.css"
import { Calendar } from 'primereact/calendar';


export default function Profile() {


    return(
        <div className="profile">
            <div className="profile-ramka">
                <div className="profile-upper-text">Личный профиль</div>
                <div className="profile-image-block">                
                    <div className="profile-image" style={{backgroundImage: 'url("assets/images/profile-avatar.svg")'}}></div>
                    <img src="assets/images/profile-edit.svg" className="profile-edit"/>
                </div>
                <div className="profile-inputs">
                    <div className="profile-inputs-block">
                        <div className="profile-name">Имя</div>
                        <input type="text" className="profile-input"/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Фамилия</div>
                        <input type="text" className="profile-input"/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">E-mail</div>
                        <input type="text" className="profile-input"/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Телефон</div>
                        <input type="text" className="profile-input"/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Дата рождения</div>
                        <input type="text" className="profile-input"/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Местоположение</div>
                        <input type="text" className="profile-input"/>
                    </div>
                </div>
            </div>
        </div>
    )
}