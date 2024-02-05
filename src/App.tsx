import "./App.css" 
import Panel from './components/Chessboard-panel/Panel';
import { BrowserRouter, Route, Routes } from 'react-router-dom';



function App() {
  return (
    <div className="app">
      <div id="chess-game">
        <BrowserRouter>
          <Routes>
            <Route path="/tema1" element={<Panel />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
export const backend = "https://chess-leader-school.onrender.com/api/tema1"

