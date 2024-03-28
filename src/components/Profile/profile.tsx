import React, { useState } from "react";
import "./profile.css"
import { Calendar } from 'primereact/calendar';


export default function Profile() {
    const [name, setName] = useState<string>('');
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('assets/images/profile-avatar.svg');


    return(
        <div className="profile">
            <div className="profile-ramka">
                <div className="profile-upper-text">Личный профиль</div>
                <div className="profile-image-block">                
                    <div className="profile-image" style={{backgroundImage: `url(${avatar})`}}></div>
                    <img src="assets/images/profile-edit.svg" className="profile-edit"/>
                </div>
                <div className="profile-inputs">
                    <div className="profile-inputs-block">
                        <div className="profile-name">Имя</div>
                        <input type="text" className="profile-input" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Фамилия</div>
                        <input type="text" className="profile-input" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">E-mail</div>
                        <input type="text" className="profile-input" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Телефон</div>
                        <input type="text" className="profile-input" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Дата рождения</div>
                        <input type="date" className="profile-input" value={birth} onChange={(e) => setBirth(e.target.value)}/>
                    </div>
                    <div className="profile-inputs-block">
                        <div className="profile-name">Местоположение</div>
                        <input type="text" className="profile-input" value={location} onChange={(e) => setLocation(e.target.value)}/>
                    </div>
                </div>
                <button className="profile-button">Изменить</button>
                <div className="profile-logout">Выйти</div>
            </div>
        </div>
    )
}