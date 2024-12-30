import React, { useState, useEffect, useRef } from "react";
import "./MainComponent.css";

function MainComponent() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const startGameSound = useRef(new Audio("/sounds/battle.mp3"));
  const lowHealthSound = useRef(new Audio("/sounds/low-health.mp3"));
  const victorySound = useRef(new Audio("/sounds/victory.mp3"));

  const playSound = (sound) => {
    if (audioEnabled) {
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch((e) => console.error("Sound failed:", e));
    }
  };

  const stopAllSounds = () => {
    [startGameSound, lowHealthSound, victorySound].forEach((soundRef) => {
      soundRef.pause();
      soundRef.currentTime = 0;
    });
  };

  useEffect(() => {
    let interval;
    if (gameStarted && activePlayer) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prev) => (prev > 0 ? prev - 1 : 0));
        } else {
          setPlayer2Time((prev) => (prev > 0 ? prev - 1 : 0));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, activePlayer]);

  useEffect(() => {
    if (isUpkeepActive) {
      const interval = setInterval(() => {
        setUpkeepTime((prev) => {
          if (prev <= 1) {
            playSound(victorySound.current);
            setIsUpkeepActive(false);
            return 30;
          }
          if (prev <= 10) {
            playSound(lowHealthSound.current);
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUpkeepActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    playSound(startGameSound.current);
  };

  const passTurn = () => {
    stopAllSounds();
    setIsUpkeepActive(false);
    setUpkeepTime(30);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const resetUpkeep = () => {
    setIsUpkeepActive(false);
    setUpkeepTime(30);
    stopAllSounds();
  };

  const resetGame = () => {
    stopAllSounds();
    setGameStarted(false);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    setUpkeepTime(30);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    stopAllSounds();
  };

  return (
    <div className="main-container">
      <h1 className="header">Pokémon TCG Timer</h1>
      {!gameStarted ? (
        <div className="start-buttons">
          <button onClick={() => startGame(1)}>Start Game</button>
        </div>
      ) : (
        <div>
          <div className="player-timer player1">
            <h2>Player 1</h2>
            <p className={player1Time <= 10 ? "critical" : ""}>
              {formatTime(player1Time)}
            </p>
          </div>
          <div className="circle-button" onClick={passTurn}>
            <p className={isUpkeepActive ? "upkeep-active" : ""}>
              {isUpkeepActive ? formatTime(upkeepTime) : "Pass Turn"}
            </p>
          </div>
          <div className="player-timer player2">
            <h2>Player 2</h2>
            <p className={player2Time <= 10 ? "critical" : ""}>
              {formatTime(player2Time)}
            </p>
          </div>
          <div className="control-buttons">
            <button onClick={() => setIsUpkeepActive(true)}>Start Upkeep</button>
            <button onClick={resetUpkeep}>Reset Upkeep</button>
            <button onClick={resetGame}>Reset Game</button>
            <button onClick={toggleAudio}>
              {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
