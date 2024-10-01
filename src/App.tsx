import { useEffect, useState } from "react";
import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import Main from "./components/Main/Main";
import Header from "./components/FH/header";
import Footer from "./components/FH/footer";
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import Reg from "./components/login-reg/reg";
import Login from "./components/login-reg/login";
import Profile from "./components/Profile/profile";
import MediaQuery from "react-responsive";
import ChessboardEdit from "./components/Chessboard-edit/ChessboardEdit";
import Rating from "./components/Rating/rating";
import ResetPassword from "./components/login-reg/reset password/resetPassword";
import { SpeedInsights } from "@vercel/speed-insights/react";
import BotSetting from "./components/chooseBotPopup/botSetting";

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
  score_month? : number;
  score_week? : number;
  pfp? : string;
}

function App() {

  const [user, setUser] = useState<User>({});
  const [checkUserLog, setUserLog] = useState<boolean>(false);
  const [inp, setInp] = useState<string>('');
  const [popOpen, setPopOpen] = useState<boolean>(false);
  const [arrayOfSolved, setArrayOfSolved] = useState<Set<number>>(new Set([1,2,3]));
  const [token, setToken] = useState<string>(localStorage && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : '');
  const location = useLocation();
  const params = useParams();

  if (!sessionStorage.getItem('i18next') || !localStorage.getItem('i18nextLng')) {
    localStorage.setItem('i18nextLng', 'ru');
    sessionStorage.setItem('i18next','yes');
  }

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
                sessionStorage.setItem('user_id', data.user.user_id)
                setArrayOfSolved(new Set<number>(data.solved));
              })
            }
          })
          if(params.status === 'success'){
            await fetch(`${backend}/api/payment/status`, {
              method: "POST",
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              credentials: 'include',
              body: JSON.stringify({
                payment_id: localStorage.getItem('payment_id'),
                order_id: localStorage.getItem('order_id')
              })
            }).then((response) => {
              if (response && response.status === 200) {
                response.json().then((data) => {
                  console.log(data)
                })
              }
            })
          }
        }
      })();
  }, [token])

  return (
    <div className="app">
        <SpeedInsights/>
        <MediaQuery minWidth={1200}>
          <img src="/assets/images/ornament-left.jpg" alt="" className="ornament-left"/>
          <img src="/assets/images/ornament-right.jpg" alt="" className="ornament-right"/>
        </MediaQuery>
        <Header checkUserLog={checkUserLog} setInp={setInp} user={user} popOpen={popOpen} setPopOpen={setPopOpen} allowSearch={location.pathname === '/'}/>
        <Routes>
          <Route path="/registration" element={<Reg/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/recovery" element={<ResetPassword/>}/>
          <Route path="/" element={<Main inp={inp} user={user}/>} />
          {user && <Route path="/topic/:id" element={<Panel popOpen={popOpen} setPopOpen={setPopOpen} user={user} arrayOfSolved={arrayOfSolved}/>} />}
          {user && <Route path="/profile" element={<Profile setUserLog={setUserLog} user={user} token={token}/>} />}
          <Route path="/editor" element={<ChessboardEdit/>}/>
          <Route path="/rating" element={<Rating user={user}/>}/>
        </Routes>
        <Footer />
    </div>
  );
}

export default App; 
// export const backend = "http://195.49.215.186:10000";
export const backend = "https://api.bm-chess.com";

