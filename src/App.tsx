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
  id: number;
  email: string;
  token: string;    
}

function App() {

  const [user, setUser] = useState<User>({id:0,email:"",token:""});
  const [checkUserLog, setUserLog] = useState<boolean>(false);

  useEffect(() => {
    (
    async () => {

      if(user.token !== '') setUserLog(true);
      else setUserLog(false)
      
    })();
}, [user.token])

  return (
    <div className="app">
        <Header checkUserLog={checkUserLog}/>
        <BrowserRouter>
          <Routes>
            <Route path="/subscription" element={<Podpiska />}/>
            <Route path="/registration" element={<Reg setUser={setUser}/>}/>
            <Route path="/login" element={<Login setUser={setUser}/>}/>
            <Route path="/" element={<Main />} />
            <Route path="/topic" element={<Panel />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
        <Footer />
    </div>
  );
}

export default App; 
export const backend = "http://192.168.232.253:10000"
//export const backend = "https://chess-leader-school.onrender.com"

export default interface UserProps {
  id: number;
  email: string;
  token: string;    
}
