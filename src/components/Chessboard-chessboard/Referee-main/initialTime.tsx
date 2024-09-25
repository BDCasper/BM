import React, { useState } from 'react';
import "./initialTime.css"

interface PopupProps {
  onClose: () => void;
  onSave: (time: string, incr: string) => any;
}

const InitialTime: React.FC<PopupProps> = ({ onClose, onSave }) => {
  const [time, setTime] = useState<string>('');
  const [increment, setIncrement] = useState<string>(''); // State for increment time

  const handleSave = () => {
    onSave(time, increment);
    onClose();
  };

  return (
    <div className="popup-overlay">
        <div className="popup-close" onClick={onClose}></div>
        <div className='popup-block'>
            <div className="popup-content">
                <h2>Установите таймер</h2>
                <input
                type="number"
                value={time}
                onChange={(e) => { 
                    if(!e.target.value.includes('-')){
                        setTime(e.target.value)
                    }
                }}
                />
                <h4>Установите добавочное время</h4>
                <input
                type="number"
                value={increment}
                onChange={(e) => { 
                    if(!e.target.value.includes('-')){
                        setIncrement(e.target.value)
                    }
                }}
                />
                <div className="popup-buttons">
                <button onClick={onClose}>Без времени</button>
                <button onClick={handleSave}>Установить</button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InitialTime;