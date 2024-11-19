import React, { useState, useEffect } from 'react';
import './RandomNumber.css';

const RandomNumber = () => {
  const [number, setNumber] = useState(null);
  const [maxNumber, setMaxNumber] = useState('');
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [customSequence, setCustomSequence] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [pressedKeys, setPressedKeys] = useState([]);
  const [history, setHistory] = useState([]); // Cronologia dei numeri generati

  // Controllo sequenza tasti
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'a') {
        setPressedKeys((prev) => [...prev, 'a'].slice(-5)); // Mantieni ultimi 5 tasti
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (pressedKeys.join('') === 'aaaaa') {
      setMenuVisible(true); // Mostra il menu segreto
    }
  }, [pressedKeys]);

  const initializeNumbers = () => {
    if (!maxNumber || maxNumber <= 0) {
      alert('Inserisci un numero massimo valido!');
      return;
    }
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    setAvailableNumbers(numbers);
    setNumber(null);
    setCustomSequence([]);
    setHistory([]); // Resetta la cronologia
  };

  const generateRandomNumber = () => {
    if (customSequence.length > 0) {
      const nextCustom = customSequence[0];
      setCustomSequence((prev) => prev.slice(1));
      setAvailableNumbers((prev) => prev.filter((num) => num !== nextCustom));
      setNumber(nextCustom);
      setHistory((prev) => [...prev, nextCustom]);
    } else if (availableNumbers.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomNum = availableNumbers[randomIndex];
      setAvailableNumbers((prev) => prev.filter((_, index) => index !== randomIndex));
      setNumber(randomNum);
      setHistory((prev) => [...prev, randomNum]);
    } else {
      alert('Tutti i numeri sono stati generati!');
    }
  };

  const addCustomNumber = () => {
    if (customSequence.length >= maxNumber) {
      alert('Hai raggiunto il limite di numeri controllati!');
      return;
    }
    setCustomSequence([...customSequence, null]);
  };

  const updateCustomNumber = (index, value) => {
    if (value <= 0 || value > maxNumber) {
      alert('Numero fuori dal limite massimo!');
      return;
    }
    setCustomSequence((prev) => {
      const updated = [...prev];
      updated[index] = parseInt(value, 10);
      return updated;
    });
  };

  const moveCustomNumber = (index, direction) => {
    setCustomSequence((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + direction];
      updated[index + direction] = temp;
      return updated;
    });
  };

  return (
    <div className="random-number-container">
      <div className="main-content">
        <h1>Generatore di Numeri Casuali</h1>
        <label>
          Inserisci il numero massimo:
          <input
            type="number"
            value={maxNumber}
            onChange={(e) => setMaxNumber(e.target.value)}
            placeholder="Es. 15"
          />
        </label>
        <button onClick={initializeNumbers}>Inizia</button>
        <button onClick={generateRandomNumber} disabled={availableNumbers.length === 0 && customSequence.length === 0}>
          Genera Numero
        </button>
        {number !== null && <p>Numero generato: {number}</p>}
        {availableNumbers.length === 0 && maxNumber > 0 && (
          <p>Tutti i numeri sono stati generati!</p>
        )}

        {/* Menu segreto */}
        {menuVisible && (
          <div className="secret-menu">
            <h2>Menu Segreto</h2>
            <p>Configura la sequenza dei numeri:</p>
            {customSequence.map((num, index) => (
              <div key={index} className="custom-sequence-item">
                <input
                  type="number"
                  value={num || ''}
                  onChange={(e) => updateCustomNumber(index, e.target.value)}
                  placeholder={`Numero ${index + 1}`}
                />
                <button onClick={() => moveCustomNumber(index, -1)} disabled={index === 0}>
                  ↑
                </button>
                <button onClick={() => moveCustomNumber(index, 1)} disabled={index === customSequence.length - 1}>
                  ↓
                </button>
              </div>
            ))}
            <button onClick={addCustomNumber}>Aggiungi Numero</button>
            <button onClick={() => setMenuVisible(false)}>Chiudi Menu</button>
          </div>
        )}
      </div>

      {/* Cronologia a destra */}
      <div className="history">
        <h2>Cronologia</h2>
        <ul>
          {history.map((num, index) => (
            <li key={index}>{num}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RandomNumber;
