import React, { useState } from 'react';
import "./initialTime.css"

interface PopupProps {
  onClose: () => void;
  onSave: (time: string) => any;
}

const InitialTime: React.FC<PopupProps> = ({ onClose, onSave }) => {
  const [time, setTime] = useState<string>('');

  const handleSave = () => {
    onSave(time);
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