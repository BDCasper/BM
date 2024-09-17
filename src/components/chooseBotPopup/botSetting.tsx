import React, { useState } from 'react';
import "./botSetting.css"

interface PopupProps {
  onClose: (set:boolean) => any;
  Level: (level: number) => any;
  Side: (side: string) => any;
}

const BotSetting: React.FC<PopupProps> = ({ onClose, Level, Side }) => {
  const [level, setLevel] = useState<number>(1);
  const [side, setSide] = useState<string>('White');

  const handleSave = () => {
    Level(level);
    Side(side);
    onClose(false);
  };

  return (
        <div className="popupBot-overlay">
            <div className="popupBot-close" onClick={() => onClose(false)}></div>
            <div className='popupBot-block'>
                <div className="popupBot-content">
                    <h2>Играть с ботом</h2>

                    <div className="slider-container">
                    <label htmlFor="levelSlider">Сложность: {level}</label>
                    <input
                        type="range"
                        id="levelSlider"
                        min="1"
                        max="20"
                        value={level}
                        onChange={(e) => setLevel(Number(e.target.value))}
                    />
                    </div>

                    <div className="radio-buttons">
                    <label>
                        <input
                        type="radio"
                        name="side"
                        value="White"
                        checked={side === 'White'}
                        onChange={(e) => setSide(e.target.value)}
                        />
                        Белые
                    </label>
                    <label>
                        <input
                        type="radio"
                        name="side"
                        value="Black"
                        checked={side === 'Black'}
                        onChange={(e) => setSide(e.target.value)}
                        disabled
                        />
                        Чёрные
                    </label>
                    </div>

                    <div className="popupBot-buttons">
                    <button onClick={() => onClose(false)}>Отмена</button>
                    <button onClick={handleSave}>Играть</button>
                    </div>
            </div>
        </div>
    </div>
  );
};

export default BotSetting;