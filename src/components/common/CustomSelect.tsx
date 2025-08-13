import React, { useState, useRef } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { useOutsideClick } from '../../hooks/useOutsideClick';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useOutsideClick(selectRef, () => setIsOpen(false));

  return (
    <div className="relative w-32" ref={selectRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-full w-full cursor-pointer items-center justify-between rounded-lg bg-dark-fill-3 px-3 py-1.5 text-left text-xs text-white focus:outline-none"
      >
        <span>{selectedOption?.label}</span>
        <BsChevronDown />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full rounded-lg bg-dark-layer-1 p-2 text-xs text-white shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="cursor-pointer rounded-lg px-2 py-1.5 hover:bg-dark-fill-3"
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;