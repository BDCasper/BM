// BotSetting.tsx
import React, { useState } from 'react';
import { difficultySettings } from '../botDifficulty';
import "./botSetting.css";

interface PopupProps {
  onClose: (set: boolean) => any;
  Level: (level: number) => any;
  Side: (side: string) => any;
}

const BotSetting: React.FC<PopupProps> = ({ onClose, Level, Side }) => {
  const [level, setLevel] = useState<number>(0);
  const [side, setSide] = useState<string>('White');


  const handleSave = () => {
    Level(difficultySettings[level].depth);
    Side(side);
    onClose(false);
  };

  return (
    <div className="popupBot-overlay">
      <div className="popupBot-close" onClick={() => onClose(false)}></div>
      <div className='popupBot-block'>
        <div className="popupBot-content">
          <div className='popupBot-content-title'>Играть с ботом</div>
          <div className='bot-preview' key={level}>
            <div className='bot-preview-avatar'>
              <img src={difficultySettings[level].icon} alt='' />
              <div>{difficultySettings[level].story}</div>
            </div>
            <div className='bot-preview-name'>{difficultySettings[level].name}<span>{difficultySettings[level].elo}</span></div>
          </div>
          <div className="bot-level-container">
            <div className="bot-level-list">
              {difficultySettings.map((difficulty, index) => (
                <div
                  key={difficulty.name}
                  className={`bot-level-item`}
                  onClick={() => setLevel(index)}
                >
                  <img src={difficulty.icon} alt='' className={`${level === index ? 'selected' : ''}`} />
                </div>
              ))}
            </div>
          </div>
          <div className='chooseSide-title'>Я буду играть за:</div>
          <div className="chooseSide-container">
            <div className={`chooseSide-item ${side === 'White' ? 'selected' : ''}`} onClick={() => setSide('White')}>
              <img src="/assets/images/whiteKingChoose.png" alt="" />
            </div>
            <div className={`chooseSide-item ${side === 'Black' ? 'selected' : ''}`} onClick={() => setSide('Black')}>
              <img src="/assets/images/blackKingChoose.png" alt=""/>
            </div>
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
