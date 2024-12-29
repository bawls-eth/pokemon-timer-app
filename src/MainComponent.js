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

  const battleSound = useRef(new Audio("./sounds/battle.mp3"));
  const plinkSound = useRef(new Audio("./sounds/plink.mp3"));
  const lowHealthSound = useRef(new Audio("./sounds/low-health.mp3"));
  const victorySound = useRef(new Audio("./sounds/victory.mp3"));

  const playSound = (sound) => {
    if (audioEnabled) {
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch((err) => console.error("Error playing sound:", err));
    }
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
          if (prev <= 10 && prev > 0) playSound(lowHealthSound.current);
          if (prev <= 0) {
            setIsUpkeepActive(false);
            return 30; // Default upkeep time
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(upkeepInterval);
  }, [isUpkeepActive]);

  const handleGameOver = () => {
    setGameStarted(false);
    setActivePlayer(null);
    playSound(victorySound.current);
  };

  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    playSound(battleSound.current);
  };

  const passTurn = () => {
    playSound(plinkSound.current);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const resetAll = () => {
    playSound(plinkSound.current);
    setGameStarted(false);
    setActivePlayer(null);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    setUpkeepTime(30);
    setIsUpkeepActive(false);
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Pokémon TCG Timer</h1>
      </div>
      {!gameStarted ? (
        <div className="start-buttons">
          <button onClick={() => startGame(1)}>Start Player 1</button>
          <button onClick={() => startGame(2)}>Start Player 2</button>
        </div>
      ) : (
        <>
          <div className="player-timers">
            <div className="player">
              <h2>Player 1</h2>
              <div className="timer">{player1Time}</div>
              <button onClick={passTurn}>Pass Turn</button>
            </div>
            <div className="player">
              <h2>Player 2</h2>
              <div className="timer">{player2Time}</div>
              <button onClick={passTurn}>Pass Turn</button>
            </div>
          </div>
          <div className="upkeep-section">
            <div className="upkeep-timer">{upkeepTime}</div>
            <button onClick={() => setIsUpkeepActive(true)}>Start Upkeep</button>
          </div>
        </>
      )}
      <div className="controls">
        <button onClick={resetAll}>Reset All</button>
        <button onClick={toggleAudio}>{audioEnabled ? "Mute" : "Unmute"}</button>
      </div>
    </div>
  );
}

export default MainComponent;
