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
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    });
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="main-container">
      <h1 className="header">Pokémon TCG Timer</h1>
      {!gameStarted ? (
        <div className="start-buttons">
          <button onClick={() => startGame(1)}>Start Player 1</button>
          <button onClick={() => startGame(2)}>Start Player 2</button>
        </div>
      ) : (
        <div>
          <div className="player-timers">
            <div>
              <h2>Player 1</h2>
              <p>{formatTime(player1Time)}</p>
            </div>
            <div>
              <h2>Player 2</h2>
              <p>{formatTime(player2Time)}</p>
            </div>
          </div>
          <div className="controls">
            <button onClick={passTurn}>Pass Turn</button>
            <button onClick={() => setIsUpkeepActive(true)}>Start Upkeep</button>
            <button onClick={resetUpkeep}>Reset Upkeep</button>
            <button onClick={resetGame}>Reset Game</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
