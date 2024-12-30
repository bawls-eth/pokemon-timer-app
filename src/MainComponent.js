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

  // Audio Refs
  const startGameSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/battle.mp3`));
  const lowHealthSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/low-health.mp3`));
  const victorySound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`));
  const plinkSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/plink.mp3`));

  // Function to play a sound
  const playSound = (soundRef) => {
    if (audioEnabled) {
      soundRef.pause();
      soundRef.currentTime = 0;
      soundRef.play().catch((error) => console.error("Audio playback error:", error));
    }
  };

  // Stop all sounds
  const stopAllSounds = () => {
    [startGameSound.current, lowHealthSound.current, victorySound.current, plinkSound.current].forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  // Timer Logic
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
    if (isUpkeepActive && upkeepTime <= 10) {
      playSound(lowHealthSound.current);
    }
    if (isUpkeepActive && upkeepTime === 0) {
      setIsUpkeepActive(false);
      setUpkeepTime(30);
    }
  }, [isUpkeepActive, upkeepTime]);

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
    playSound(plinkSound.current);
    setIsUpkeepActive(false);
    setUpkeepTime(30);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const resetUpkeep = () => {
    setIsUpkeepActive(false);
    setUpkeepTime(30);
    playSound(plinkSound.current);
    stopAllSounds();
  };

  const resetGame = () => {
    stopAllSounds();
    playSound(plinkSound.current);
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
            <p>{formatTime(player1Time)}</p>
          </div>
          <div className="circle-button" onClick={passTurn}>
            <p className="upkeep-timer">
              {isUpkeepActive ? formatTime(upkeepTime) : "Pass Turn"}
            </p>
          </div>
          <div className="player-timer player2">
            <h2>Player 2</h2>
            <p>{formatTime(player2Time)}</p>
          </div>
          <div className="control-buttons">
            <button onClick={() => { setIsUpkeepActive(true); playSound(plinkSound.current); }}>Start Upkeep</button>
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
