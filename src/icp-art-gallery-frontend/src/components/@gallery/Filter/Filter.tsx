import '../../../index.scss';
import './style.scss';
import { useState } from 'react';

export const Filter = () => {
  //TODO: please make a proper hook in corresponding dir
  const [selectedOption, setSelectedOption] = useState('none');
  const [isOpen, setIsOpen] = useState(false);

  const options = ['none', 'option1', 'option2', 'option3'];

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button className="head-text cursor-pointer" onClick={() => setIsOpen(!isOpen)} type="button">
        .filter: {selectedOption}
      </button>
      {isOpen ? (
        <div className="glass modal-glass absolute mt-2 w-48 rounded z-99">
          {options.map((option) => (
            <button
              className="option block w-full text-left px-4 py-2"
              key={option}
              onClick={() => handleOptionClick(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Filter;
