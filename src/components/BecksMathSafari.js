import React, { useState, useEffect, useCallback } from 'react';

const operations = {
  addition: (a, b) => ({ problem: `${a} + ${b}`, answer: a + b }),
  subtraction: (a, b) => ({ problem: `${a} - ${b}`, answer: a - b }),
  multiplication: (a, b) => ({ problem: `${a} × ${b}`, answer: a * b }),
  division: (a, b) => ({ problem: `${a} ÷ ${b}`, answer: a / b }),
};

const BecksMathSafari = () => {
  const [gameState, setGameState] = useState('menu');
  const [operation, setOperation] = useState(null);
  const [problem, setProblem] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [triesLeft, setTriesLeft] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timerActive, setTimerActive] = useState(false);
  
  // Accessibility settings
  const [useDyslexicFont, setUseDyslexicFont] = useState(false);
  const [useVisualAids, setUseVisualAids] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);

  const formatText = (text) => {
    if (typeof text !== 'string') {
      return String(text);
    }
    return useDyslexicFont ? text.toUpperCase() : text;
  };

  const generateProblem = useCallback(() => {
    if (!operation) return;
    
    let a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    
    // Directly use the operation functions
    const opFunc = operations[operation];
    if (!opFunc) return;
    
    const result = opFunc(a, b);
    setProblem(result.problem);
    setCorrectAnswer(result.answer);

    let optionsSet = new Set([result.answer]);
    while (optionsSet.size < 4) {
      optionsSet.add(Math.floor(Math.random() * 20) + 1);
    }
    setOptions([...optionsSet].sort(() => Math.random() - 0.5));
    
    // Start timer after problem is generated
    setTimerActive(true);
  }, [operation]);

  // Generate problem whenever operation changes
  useEffect(() => {
    if (operation && gameState === 'playing') {
      generateProblem();
    }
  }, [operation, generateProblem, gameState]);

  const startGame = (selectedOperation) => {
    setTimerActive(false);
    setOperation(selectedOperation);
    setGameState('playing');
    setScore(0);
    setTriesLeft(3);
    setTimeLeft(30);
  };

  const handleAnswer = (selectedAnswer) => {
    setTimerActive(false);
    setSelectedAnswer(selectedAnswer);
    setIsCorrect(selectedAnswer === correctAnswer);

    setTimeout(() => {
      if (selectedAnswer === correctAnswer) {
        setScore(score + 10);
        generateProblem();
        setTimeLeft(30);
      } else {
        setTriesLeft(triesLeft - 1);
        if (triesLeft === 1) {
          setGameState('gameover');
        } else {
          generateProblem();
          setTimeLeft(30);
        }
      }
      setSelectedAnswer(null);
      setIsCorrect(null);
    }, 2000);
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && !selectedAnswer && showTimer && timerActive) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 1) {
            setTriesLeft((prevTries) => {
              if (prevTries === 1) {
                setGameState('gameover');
                return 0;
              }
              setTimerActive(false);
              setTimeout(() => {
                generateProblem();
              }, 10);
              return prevTries - 1;
            });
            return 30;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, generateProblem, selectedAnswer, showTimer, timerActive]);

  const speakText = (text) => {
    if (textToSpeechEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const VisualAid = ({ number }) => {
    const safeNumber = Math.min(Math.max(0, number), 20);
    return (
      <div className="flex flex-wrap justify-center items-center w-20 h-20 bg-gray-200 rounded">
        {[...Array(safeNumber)].map((_, i) => (
          <div key={i} className="w-3 h-3 m-1 bg-blue-500 rounded-full"></div>
        ))}
      </div>
    );
  };

  const renderGameContent = () => (
    <div className={`flex flex-col items-center justify-center h-screen ${focusMode ? 'bg-gray-100' : 'bg-gradient-to-r from-blue-300 to-purple-300'}`}>
      {!problem ? (
        <div className="text-4xl font-bold mb-8">Loading...</div>
      ) : (
        <>
          <div 
            className="text-4xl font-bold mb-8"
            onClick={() => speakText(problem)}
          >
            {formatText(problem)}
          </div>
          {useVisualAids && (
            <div className="flex justify-center mb-8">
              <VisualAid number={parseInt(problem.split(' ')[0]) || 0} />
              <div className="mx-4 text-4xl">{formatText(problem.split(' ')[1])}</div>
              <VisualAid number={parseInt(problem.split(' ')[2]) || 0} />
            </div>
          )}
          {showTimer && <div className="text-2xl mb-4">{formatText(`Time left: ${timeLeft}s`)}</div>}
          <div className="text-2xl mb-4">{formatText(`Tries left: ${triesLeft}`)}</div>
          <div className="text-2xl mb-8">{formatText(`Score: ${score}`)}</div>
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                className={`px-6 py-4 rounded text-2xl font-bold transition-all duration-300 ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {formatText(option)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderSettingsMenu = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={useDyslexicFont} onChange={() => setUseDyslexicFont(!useDyslexicFont)} />
        <span>{formatText("Use Dyslexia-Friendly Text")}</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={useVisualAids} onChange={() => setUseVisualAids(!useVisualAids)} />
        <span>{formatText("Show Visual Aids")}</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={focusMode} onChange={() => setFocusMode(!focusMode)} />
        <span>{formatText("Focus Mode")}</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={showTimer} onChange={() => setShowTimer(!showTimer)} />
        <span>{formatText("Show Timer")}</span>
      </label>
      <label className="flex items-center space-x-2">
        <input type="checkbox" checked={textToSpeechEnabled} onChange={() => setTextToSpeechEnabled(!textToSpeechEnabled)} />
        <span>{formatText("Enable Text-to-Speech")}</span>
      </label>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setGameState('menu')}>
        {formatText("Back to Menu")}
      </button>
    </div>
  );

  const renderMenu = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-purple-300">
      <h1 className="text-5xl font-bold mb-8 text-center w-full">{formatText("Beck's Math Safari")}</h1>
      <div className="space-y-4">
        {Object.keys(operations).map((op) => (
          <button
            key={op}
            className="bg-white text-blue-600 px-6 py-3 rounded w-48 text-xl font-bold shadow-lg"
            onClick={() => startGame(op)}
          >
            {formatText(op.charAt(0).toUpperCase() + op.slice(1))}
          </button>
        ))}
      </div>
      <button 
        className="mt-8 bg-green-500 text-white px-4 py-2 rounded" 
        onClick={() => setGameState('settings')}
      >
        {formatText("Settings")}
      </button>
    </div>
  );

  const renderGameOver = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-300 to-purple-300">
      <h1 className="text-5xl font-bold mb-8 text-center w-full">{formatText("Game Over")}</h1>
      <p className="text-3xl mb-8">{formatText(`Your score: ${score}`)}</p>
      <button
        className="bg-blue-500 text-white px-6 py-3 rounded text-xl font-bold"
        onClick={() => setGameState('menu')}
      >
        {formatText("Play Again")}
      </button>
    </div>
  );

  return (
    <>
      {gameState === 'menu' && renderMenu()}
      {gameState === 'settings' && renderSettingsMenu()}
      {gameState === 'playing' && renderGameContent()}
      {gameState === 'gameover' && renderGameOver()}
    </>
  );
};

export default BecksMathSafari; 