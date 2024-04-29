import { useEffect, useState } from "react";
import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import Main from "./components/Main/Main";
import Header from "./components/FH/header";
import Footer from "./components/FH/footer";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Reg from "./components/login-reg/reg";
import Login from "./components/login-reg/login";
import Podpiska from "./components/Podpiska/podpiska";
import Profile from "./components/Profile/profile";

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

function App() {

  const [user, setUser] = useState<User>({});
  const [checkUserLog, setUserLog] = useState<boolean>(false);
  const [inp, setInp] = useState<string>('');
  const [popOpen, setPopOpen] = useState<boolean>(false);

  let token = JSON.parse(JSON.stringify(sessionStorage.getItem("token")));

  useEffect(() => {
    (
      async () => {
        await fetch(`${backend}/api/profile`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            credentials: 'include',
        }).then((response) => {
          if (response && response.status === 200) {
            response.json().then((data) => {
              setUser(data.user);
            })
          }
        })
      })();
  }, [token])

  return (
    <div className="app">
        <Header checkUserLog={checkUserLog} setInp={setInp}/>
        <BrowserRouter>
          <Routes>
            <Route path="/subscription" element={<Podpiska setPopOpen={setPopOpen}/>}/>
            <Route path="/registration" element={<Reg/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/" element={<Main inp={inp} />} />
            <Route path="/topic" element={<Panel popOpen={popOpen} setPopOpen={setPopOpen}/>} />
            <Route path="/profile" element={<Profile setUserLog={setUserLog} user={user}/>} />
          </Routes>
        </BrowserRouter>
        <Footer />
    </div>
  );
}

export default App; 
//export const backend = "http://192.168.236.253:10000";
export const backend = "https://chess-leader-school.onrender.com";
//export const backend = "https://bm-back.onrender.com";

