import React, { useEffect, useState } from "react";
import "./profile.css"
import { Calendar } from 'primereact/calendar';
import { backend } from "../../App";
import { useNavigate } from "react-router-dom";

interface User {
    user_id?: number;
    name?: string; 
    surname?: string;  
    email?: string; 
    phone?: string; 
    birth_date?: string; 
    location?: string; 
    subscribed?: string;
    score?: number;
}

interface Props {
    setUserLog: (use: boolean) => any;
    user: User;
}

export default function Profile({setUserLog, user}:Props) {
    const [name, setName] = useState<string>('');   
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('assets/images/profile-avatar.svg');
    const navigate = useNavigate();

    useEffect(() => {
        (
         async() => {
            setName(user.name ? user.name : name);
            setSurname(user.surname ? user.surname : surname);
            setEmail(user.email ? user.email : email);
            setPhone(user.phone ? user.phone : phone);
            setBirth(user.birth_date ? user.birth_date : birth);
            setLocation(user.location ? user.location : location);
         } 
        )();
      }, [user])

    const logout = async() => {

        await fetch(`${backend}/api/logout`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }).then((response) => { 
            if (response && response.status === 200)
            {
                window.sessionStorage.setItem("token", "");
                setUserLog(false);
                navigate('/login');
                window.location.reload();
            }
            if(response.status === 400)
            {
                alert("Ploha")
            }
        })
    }

    return(
        <div className="profile">
            <div className="profile-ramka">
                <div className="profile-upper-text">Личный профиль</div>
                <div className="profile-image-block">                
                    <div className="profile-image" style={{backgroundImage: `url(${avatar})`}}></div>
                    <img alt="" src="assets/images/profile-edit.svg" className="profile-edit"/>
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
                <button className="profile-logout" onClick={logout}>Выйти</button>
            </div>
        </div>
    )
}