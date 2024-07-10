import React from 'react';
import "./winPopUp.css"
import { useNavigate } from 'react-router-dom';

interface PopupProps {
  onClose: (check: boolean) => any;
  activeIndex: number;
  setActiveIndex: (num: number) => any;
  lengthOfArray: number;
}


const WinPopup: React.FC<PopupProps> = ({ onClose, activeIndex, setActiveIndex, lengthOfArray}) => {

    const navigate = useNavigate();

    const handleClick = () => {
        setActiveIndex(activeIndex + 1);
        onClose(false);
    }

    const backClick = () => {
      onClose(false);
    }

  return (
    <div className="winPopup">
        <div className="winPopup-close" onClick={backClick}></div>
            <div className="winPopup-block">
                <div className="winPopup-ramka">
                    <img src="assets/images/astana.png" alt="" />
                    <div className="winPopup-ramka-title">Поздравляем</div>
                    {activeIndex < lengthOfArray - 1 ?
                     <button onClick={handleClick}>Следующая задача</button>
                     :
                     <button onClick={() => navigate('/')}>На главную</button>
                    }
                </div>
            </div>
    </div>
  );
};

export default WinPopup;