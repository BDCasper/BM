import { useEffect } from "react";
import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import Main from "./components/Main/Main";
import Header from "./components/FH/header";
import Footer from "./components/FH/footer";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Reg from "./components/login-reg/reg";
import Login from "./components/login-reg/login";
import Podpiska from "./components/Podpiska/podpiska";


function App() {

  return (
    <div className="app">
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/subscription" element={<Podpiska />}/>
            <Route path="/registration" element={<Reg />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/" element={<Main />} />
            <Route path="/topic" element={<Panel />} />
          </Routes>
        </BrowserRouter>
        <Footer />
    </div>
  );
}

export default App; 
//export const backend = "http://192.168.3.253:10000"
export const backend = "https://chess-leader-school.onrender.com"


