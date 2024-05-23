import React, { useEffect, useState, useRef } from "react";
import "./profile.css"
import { Calendar } from 'primereact/calendar';
import { backend } from "../../App";
import { useNavigate } from "react-router-dom";
import InputMask from 'react-input-mask';
import { User } from "../../App";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface Props {
    setUserLog: (use: boolean) => any;
    user: User;
    token: string;
}

export default function Profile({setUserLog, user, token}:Props) {
    const [name, setName] = useState<string>('');   
    const [surname, setSurname] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [checkPhone, setCheckPhone] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [inpChange, setInpChange] = useState<boolean>(false);
    const [buttonName, setButtonName] = useState<string>("Изменить");
    const [score, setScore] = useState<number>(0);
    const navigate = useNavigate();
    const fileUploadRef = useRef<HTMLInputElement>(null);

    const handleAvatarUpload = async() => {
        fileUploadRef.current?.click();
    }

    const uploadProfileImage = async() => {
        if(fileUploadRef.current && fileUploadRef.current.files) {
            let uploadFile = fileUploadRef.current.files[0];
            let cachedURL = URL.createObjectURL(uploadFile);
            setAvatar(cachedURL)
        }
    }

    useEffect(() => {
        (
            async() => {
                if(token === null) navigate('/login');
            }
        )()
    },[])

    const handleUserChange = async() => {

        console.log(phone)

        if(buttonName === "Изменить")
        {
            setButtonName("Сохранить");
            setInpChange(!inpChange);
        }

        if(checkPhone && buttonName === "Сохранить")
        {
            if(buttonName === "Сохранить") setButtonName("Изменить");
            setInpChange(!inpChange);
        }
    }

    useEffect(() => {
        (
            async() => {
                setCheckPhone(true);
                if(phone === '' || phone.length < 11) setCheckPhone(false);
            }
        )()
    },[phone])

    const handlePhoneChange = async(value: React.SetStateAction<string>) => {
        setPhone(value)
    }

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
            {token !== null &&
                <div className="profile-ramka">
                    <div className="profile-upper-text">Личный профиль</div>
                    <div className="profile-image-block">                
                        <div className="profile-image-wrapper" style={{backgroundImage: `url(assets/images/profile-avatar.svg)`}}><img alt="" src={avatar} className="profile-image"/></div>
                        <button className="edit-button" onClick={handleAvatarUpload}><img alt="" src="assets/images/profile-edit.svg" className="profile-edit"/></button>
                        <input type="file" ref={fileUploadRef} onChange={uploadProfileImage} hidden/>
                    </div>
                    <div className="profile-score">Количество очков: {user.score}</div>
                        <div className="profile-username">
                            <div className="profile-name">Имя пользователя</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={userName} onChange={(e) => setUserName(e.target.value)}/>
                        </div>
                    <div className="profile-inputs">
                        <div className="profile-inputs-block">
                            <div className="profile-name">Имя</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                        <div className="profile-inputs-block">
                            <div className="profile-name">Фамилия</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={surname} onChange={(e) => setSurname(e.target.value)}/>
                        </div>
                        <div className="profile-inputs-block">
                            <div className="profile-name">E-mail</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="profile-inputs-block">
                            <div className="profile-name">Телефон</div>
                            <PhoneInput containerClass={inpChange ? (checkPhone ? "phone-containter" : "phone-containter wrong-input") : "phone-containter input-disabled"} inputClass="phone-input" buttonClass="phone-input-button" country={'kz'} placeholder="+7 777 777 77 77" value={phone} inputProps={{required: true,}} onChange={handlePhoneChange}/>
                        </div>
                        <div className="profile-inputs-block">
                            <div className="profile-name">Дата рождения</div>
                            <input type="date" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={birth} onChange={(e) => setBirth(e.target.value)}/>
                        </div>
                        <div className="profile-inputs-block">
                            <div className="profile-name">Местоположение</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={location} onChange={(e) => setLocation(e.target.value)}/>
                        </div>
                    </div>
                    <button className="profile-button" onClick={handleUserChange}>{buttonName}</button>
                    <button className="profile-logout" onClick={logout}>Выйти</button>
                </div>
            }
        </div>
    )
}