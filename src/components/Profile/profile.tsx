import React, { useEffect, useState, useRef } from "react";
import "./profile.css"
import { Calendar } from 'primereact/calendar';
import { backend } from "../../App";
import { useNavigate } from "react-router-dom";
import InputMask from 'react-input-mask';
import { User } from "../../App";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ReactFlagsSelect from "react-flags-select";

interface Props {
    setUserLog: (use: boolean) => any;
    user: User;
    token: string;
}

export default function Profile({setUserLog, user, token}:Props) {
    const [name, setName] = useState<string>('');   
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [checkPhone, setCheckPhone] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [birth, setBirth] = useState<string>('');
    const [location, setLocation] = useState<string>('');
    const [avatar, setAvatar] = useState<string>('');
    const [inpChange, setInpChange] = useState<boolean>(false);
    const [buttonName, setButtonName] = useState<string>("Изменить");
    const [score, setScore] = useState<number>(0);
    const navigate = useNavigate();
    const [selected, setSelected] = useState("");
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
                if(token === null || token === '') navigate('/login');
            }
        )()
    },[])


    const handleUserChange = async() => {

        if(buttonName === "Изменить")
        {
            setButtonName("Сохранить");
            setInpChange(!inpChange);
            return;
        }

        if(checkPhone && buttonName === "Сохранить")
        {
            console.log(username)
            await fetch(`${backend}/api/profile/save`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: name,
                    email: email,
                    phone: phone,
                    username: username,
                    birth: birth,
                    location: location
                })
            }).then((response) => { 
                if (response && response.status === 200)
                {
                    response.json().then((data) => { 
                        console.log(data);
                    })
                }
                if(response.status === 400)
                {
                }
            })
            setButtonName("Изменить");
            setInpChange(!inpChange);
        }
    }


    useEffect(() => {
        (
            async() => {
                setCheckPhone(true);
                if(phone !== '' && phone.length < 11) setCheckPhone(false);
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
            setUsername(user.username ? user.username : username);
            setEmail(user.email ? user.email : email);
            setPhone(user.phone ? user.phone : phone);
            setBirth(user.birth_date ? user.birth_date : birth);
            setLocation(user.location ? user.location : location);
         } 
        )();
      }, [user])


    const logout = async() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id')
        setUserLog(false);
        navigate('/login');
        window.location.reload();
        await fetch(`${backend}/api/logout`, {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        }).then((response) => { 
            if (response && response.status === 200)
            {
            }
            if(response.status === 400)
            {
            }
        })
    }

    return(
        <div className="profile">
            {token !== null && token !== '' &&
                <div className="profile-ramka">
                    <div className="profile-upper-text">Личный профиль</div>
                    <div className="profile-image-block">                
                        <div className="profile-image-wrapper" style={{backgroundImage: `url(assets/images/profile-avatar.svg)`}}><img alt="" src={avatar} className="profile-image"/></div>
                        <button className="edit-button" onClick={handleAvatarUpload}><img alt="" src="assets/images/profile-edit.svg" className="profile-edit"/></button>
                        <input type="file" ref={fileUploadRef} onChange={uploadProfileImage} hidden/>
                    </div>
                    <div className="profile-score">Количество очков: {user.score ? user.score : 0} <img src="/assets/images/asyk-win.svg" alt="" /></div>
                        <div className="profile-username">
                            <div className="profile-name">Имя пользователя</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                    <div className="profile-inputs">
                        <div className="profile-inputs-block">
                            <div className="profile-name">Имя</div>
                            <input type="text" className={inpChange ? "profile-input" : "profile-input input-disabled"} value={name} onChange={(e) => setName(e.target.value)}/>
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
                            <ReactFlagsSelect selected={location} onSelect={(code) => setLocation(code)}  searchable={true} className={inpChange ? "profile-country" : "profile-country input-disabled"}/>
                        </div>
                    </div>
                    <button className="profile-button" onClick={handleUserChange}>{buttonName}</button>
                    <button className="profile-logout" onClick={logout}>Выйти</button>
                </div>
            }
        </div>
    )
}