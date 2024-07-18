import { useEffect, useState } from "react";
import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import Main from "./components/Main/Main";
import Header from "./components/FH/header";
import Footer from "./components/FH/footer";
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Reg from "./components/login-reg/reg";
import Login from "./components/login-reg/login";
import Profile from "./components/Profile/profile";
import MediaQuery from "react-responsive";
import ChessboardEdit from "./components/Chessboard-edit/ChessboardEdit";
import Rating from "./components/Rating/rating";
import { SpeedInsights } from "@vercel/speed-insights/react";

export interface User {
  user_id?: number;
  name?: string; 
  username?: string;  
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
  const [arrayOfSolved, setArrayOfSolved] = useState<Set<number>>(new Set([1,2,3]));
  const [token, setToken] = useState<string>(localStorage && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : '');
  const location = useLocation();

  useEffect(() => {
    (
      async () => {
        if(token !== ''){
          await fetch(`${backend}/api/profile`, {
              method: "GET",
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              credentials: 'include',
          }).then((response) => {
            if (response && response.status === 200) {
              response.json().then((data) => {
                setUser(data.user);
                setArrayOfSolved(new Set<number>(data.solved));
              })
            }
          })
        }
      })();
  }, [token])


  return (
    <div className="app">
        <SpeedInsights/>
        <MediaQuery minWidth={1200}>
          <img src="assets/images/ornament-left.jpg" alt="" className="ornament-left"/>
          <img src="assets/images/ornament-right.jpg" alt="" className="ornament-right"/>
        </MediaQuery>
        <Header checkUserLog={checkUserLog} setInp={setInp} user={user} popOpen={popOpen} setPopOpen={setPopOpen} allowSearch={location.pathname === '/'}/>
        <Routes>
          <Route path="/registration" element={<Reg/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Main inp={inp} user={user}/>} />
          {user && <Route path="/topic" element={<Panel popOpen={popOpen} setPopOpen={setPopOpen} user={user} arrayOfSolved={arrayOfSolved}/>} />}
          {user && <Route path="/profile" element={<Profile setUserLog={setUserLog} user={user} token={token}/>} />}
          <Route path="/editor" element={<ChessboardEdit/>}/>
          <Route path="/rating" element={<Rating user={user}/>}/>
        </Routes>
        <Footer />
    </div>
  );
}

export default App; 
//export const backend = "http://195.49.215.186:10000";
//export const backend = "http://195.49.215.186:10000";
//export const backend = "https://bm-back.onrender.com";
export const backend = "https://api.bm-chess.com";

