import { useEffect } from "react";
import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import Main from "./components/Main/Main";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {

  return (
    <div className="app">
      <div id="chess-game">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/topic" element={<Panel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App; 
//export const backend = "http://192.168.3.253:10000"
export const backend = "https://chess-leader-school.onrender.com"


