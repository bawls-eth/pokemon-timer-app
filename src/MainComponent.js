import React, { useState, useEffect, useRef } from "react";
import "./MainComponent.css";

function MainComponent() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [upkeepDefault, setUpkeepDefault] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const [gameTime, setGameTime] = useState(20);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  const startGameSound = useRef(new Audio("./sounds/battle.mp3"));
  const plinkSound = useRef(new Audio("./sounds/plink.mp3"));
  const lowHealthSound = useRef(new Audio("./sounds/low-health.mp3"));
  const victorySound = useRef(new Audio("./sounds/victory.mp3"));

  const playSound = (sound) => {
    if (audioEnabled) {
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch((e) => console.error("Sound failed to play:", e));
    }
  };

  const handleGameOver = () => {
    setGameStarted(false);
    setActivePlayer(null);
    playSound(victorySound.current);
  };

  useEffect(() => {
    let interval;
    if (gameStarted && activePlayer) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prev) => {
            if (prev <= 0) {
              handleGameOver();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setPlayer2Time((prev) => {
            if (prev <= 0) {
              handleGameOver();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePlayer, gameStarted]);

  useEffect(() => {
    let upkeepInterval;
    if (isUpkeepActive) {
      upkeepInterval = setInterval(() => {
        setUpkeepTime((prev) => {
          if (prev === 10) playSound(lowHealthSound.current);
          if (prev <= 0) {
            setIsUpkeepActive(false);
            return upkeepDefault;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(upkeepInterval);
  }, [isUpkeepActive, upkeepDefault]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    setPlayer1Time(gameTime * 60);
    setPlayer2Time(gameTime * 60);
    playSound(startGameSound.current);
  };

  const passTurn = () => {
    playSound(plinkSound.current);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
    resetUpkeep();
  };

  const startUpkeep = () => {
    playSound(plinkSound.current);
    setIsUpkeepActive(true);
  };

  const resetUpkeep = () => {
    playSound(plinkSound.current);
    setUpkeepTime(upkeepDefault);
    setIsUpkeepActive(false);
  };

  const resetAll = () => {
    playSound(plinkSound.current);
    setGameStarted(false);
    setActivePlayer(null);
    setPlayer1Time(gameTime * 60);
    setPlayer2Time(gameTime * 60);
    setUpkeepTime(upkeepDefault);
    setIsUpkeepActive(false);
  };

  const toggleAudio = () => setAudioEnabled((prev) => !prev);

  const toggleSettings = () => setShowSettings((prev) => !prev);

  return (
    <div className="main-container">
      <h1 className="header">Pokémon TCG Timer</h1>

      {showSettings && (
        <div className="settings-panel">
          <label>Player 1 Name:</label>
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
          <label>Player 2 Name:</label>
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
          <label>Game Time (minutes):</label>
          <input
            type="number"
            value={gameTime}
            onChange={(e) => setGameTime(Number(e.target.value))}
          />
          <label>Upkeep Timer (seconds):</label>
          <input
            type="number"
            value={upkeepDefault}
            onChange={(e) => setUpkeepDefault(Number(e.target.value))}
          />
        </div>
      )}

      {!gameStarted ? (
        <div className="start-buttons">
          <button onClick={() => startGame(1)}>Start Player 1</button>
          <button onClick={() => startGame(2)}>Start Player 2</button>
        </div>
      ) : (
        <div className="player-timers">
          <div>
            <h2>{player1Name}</h2>
            <p>{formatTime(player1Time)}</p>
            <button onClick={passTurn}>Pass Turn</button>
          </div>
          <div>
            <h2>{player2Name}</h2>
            <p>{formatTime(player2Time)}</p>
            <button onClick={passTurn}>Pass Turn</button>
          </div>
        </div>
      )}

      {gameStarted && (
        <div className="controls">
          <button onClick={startUpkeep}>Start Upkeep</button>
          <button onClick={resetUpkeep}>Reset Upkeep</button>
          <button onClick={toggleAudio}>
            {audioEnabled ? "🔊 Mute" : "🔇 Unmute"}
          </button>
          <button onClick={toggleSettings}>
            {showSettings ? "Close Settings" : "⚙️ Settings"}
          </button>
          <button onClick={resetAll}>Reset All</button>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
