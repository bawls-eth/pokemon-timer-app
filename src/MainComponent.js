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
  const [gameTime, setGameTime] = useState(20);

  // Sound files (using refs to avoid overlapping sounds)
  const startGameSound = useRef(new Audio("./sounds/pokemon-battle.mp3"));
  const plinkSound = useRef(new Audio("./sounds/plink.mp3"));
  const lowHealthSound = useRef(new Audio("./sounds/low-health-critical-health-pokemon.mp3"));
  const victorySound = useRef(new Audio("./sounds/pokemon-red-blue-music-wild-pokemon-victory-theme-1.mp3"));

  // Helper function to play sounds without overlap
  const playSound = (sound) => {
    if (audioEnabled) {
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Sound failed to play:", e));
    }
  };

  // Timer for active player
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

  // Upkeep timer
  useEffect(() => {
    let upkeepInterval;
    if (isUpkeepActive) {
      upkeepInterval = setInterval(() => {
        setUpkeepTime((prev) => {
          if (prev <= 10 && prev > 0) {
            playSound(lowHealthSound.current);
          }
          if (prev <= 0) {
            setIsUpkeepActive(false);
            return upkeepDefault;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(upkeepInterval);
      lowHealthSound.current.pause();
      lowHealthSound.current.currentTime = 0;
    };
  }, [isUpkeepActive, upkeepDefault]);

  // Handle game over
  const handleGameOver = () => {
    setGameStarted(false);
    setActivePlayer(null);
    playSound(victorySound.current);
  };

  // Button functions
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

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    lowHealthSound.current.pause();
    startGameSound.current.pause();
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Pokémon TCG Timer</h1>
      </div>
      {!gameStarted ? (
        <div className="start-buttons">
          <button className="start-button" onClick={() => startGame(1)}>
            Start Player 1
          </button>
          <button className="start-button" onClick={() => startGame(2)}>
            Start Player 2
          </button>
        </div>
      ) : (
        <>
          <div className="player-timers">
            <div className="player">
              <h2>{player1Time > 0 ? "Player 1" : "Time's Up!"}</h2>
              <div className="timer">{formatTime(player1Time)}</div>
              <button className="pass-turn-button" onClick={passTurn}>
                Pass Turn
              </button>
            </div>
            <div className="player">
              <h2>{player2Time > 0 ? "Player 2" : "Time's Up!"}</h2>
              <div className="timer">{formatTime(player2Time)}</div>
              <button className="pass-turn-button" onClick={passTurn}>
                Pass Turn
              </button>
            </div>
          </div>
          <div className="upkeep-section">
            <div className={`upkeep-timer ${upkeepTime <= 10 ? "flash-red" : ""}`}>
              {formatTime(upkeepTime)}
            </div>
            <button className="upkeep-button" onClick={startUpkeep}>
              Start Upkeep
            </button>
            <button className="upkeep-button" onClick={resetUpkeep}>
              Reset Upkeep
            </button>
          </div>
        </>
      )}
      <div className="controls">
        <button className="control-button" onClick={resetAll}>
          Reset All
        </button>
        <button className="control-button" onClick={toggleAudio}>
          {audioEnabled ? "Mute" : "Unmute"}
        </button>
      </div>
    </div>
  );
}

// Helper function to format time
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default MainComponent;
