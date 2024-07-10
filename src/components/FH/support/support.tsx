import "./support.css";
import React from "react";
import InputMask from 'react-input-mask';
import { useState } from "react";

interface Props {
    setPopOpen: (check: boolean) => any;
    popOpen: boolean;
}

const Support = ({setPopOpen, popOpen}:Props) => {

  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    message: ''
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const eRegex : RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const [checkPhone, setCheckPhone] = useState<boolean>(true);
  const [checkEmail, setCheckEmail] = useState<boolean>(true);

  const handleSubmit = async(e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setPopOpen(false);

    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phoneNumber', formData.phoneNumber);
    data.append('message', formData.message);

   // your URL.

    const Sheet_Url="https://script.google.com/macros/s/AKfycbxzOGWifHHAooaUaXfZ0KXgSpawqSnIXaRFnPRuIaeLqa6mPKDwNz-8G87_B9IOL4jSRw/exec"
    try {
      await fetch(Sheet_Url, {
        method: 'POST',
        body: data,
      });

      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: ''
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
        {popOpen &&
            <div className="support">
                <div className="support-close" onClick={() => setPopOpen(false)}></div>
                    <div className="support-block">
                        <div className="support-ramka">
                            <div className="support-ramka-title">Форма обратной связи</div>
                            <form className="support-form" onSubmit={handleSubmit}>
                                <label htmlFor="input">Имя</label>
                                <input className="support-bar"type="text"
                                  id="fullName"
                                  name="fullName"
                                  value={formData.fullName}
                                  onChange={handleChange}
                                  required />
                                <label htmlFor="input">Эл. Почта</label>
                                <input className={checkEmail ? "support-bar" : "support-bar support-incorrectBar"} type="email"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  required/>
                                <label htmlFor="input">Номер телефона</label>
                                <InputMask className={checkPhone ? "support-bar" : "support-bar support-incorrectBar"} mask="+7 (999) 999-99-99" placeholder="+7 (999) 999-99-99" id="phoneNumber"
                                  name="phoneNumber"
                                  value={formData.phoneNumber}
                                  onChange={handleChange}
                                  required/>
                                <label htmlFor="textarea">Сообщение</label>
                                <textarea className="support-textArea" id="message"
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  required/>
                                <button type="submit">Отправить</button>
                            </form>
                        </div>
                    </div>
            </div>
        }
    </>
  )
};

export default Support;

