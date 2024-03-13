import React from "react";
import "./profile.css"


export default function Profile() {


    return(
        <div className="profile">
            <div className="profile-ramka">
                <div className="profile-upper-text">Личный профиль</div>
                <div className="profile-image-block">                
                    <div className="profile-image" style={{backgroundImage: 'url("assets/images/profile-avatar.png")'}}></div>
                    <img src="assets/images/profile-edit.svg" className="profile-edit"/>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    )
}