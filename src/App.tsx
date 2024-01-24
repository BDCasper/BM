import React from 'react';
import Panel from './components/Chessboard-panel/Panel';
import './App.css'

function App() {
  return (
    <div id="app">
      <div id="chess-game">
       <Panel/>
      </div>
    </div>
  );
}

export default App;
