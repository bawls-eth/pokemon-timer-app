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
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [showSettings, setShowSettings] = useState(false);

  const startGameSound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/battle.mp3"));
  const plinkSound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/plink.mp3"));
  const lowHealthSound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/low-health.mp3"));
  const victorySound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/victory.mp3"));

  const playSound = (sound) => {
    try {
      if (audioEnabled) {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
      }
    } catch (error) {
      console.error("Sound playback failed:", error);
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

  const handleGameOver = () => {
    setGameStarted(false);
    setActivePlayer(null);
    playSound(victorySound.current);
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

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    lowHealthSound.current.pause();
    startGameSound.current.pause();
  };

  const toggleSettings = () => setShowSettings((prev) => !prev);

  return (
    <div className="main-container pokemon-theme">
      <div className="header">
        <h1>Pokémon TCG Timer</h1>
      </div>
      {showSettings && (
        <div className="settings-panel">
          <label>
            Player 1 Name:
            <input
              type="text"
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
            />
          </label>
          <label>
            Player 2 Name:
            <input
              type="text"
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
            />
          </label>
          <label>
            Game Time (minutes):
            <input
              type="number"
              value={gameTime}
              onChange={(e) => setGameTime(Number(e.target.value))}
            />
          </label>
          <label>
            Upkeep Time (seconds):
            <input
              type="number"
              value={upkeepDefault}
              onChange={(e) => setUpkeepDefault(Number(e.target.value))}
            />
          </label>
          <button className="settings-close" onClick={toggleSettings}>
            Close Settings
          </button>
        </div>
      )}
      {!gameStarted ? (
        <div className="start-buttons">
          <button className="pokeball-button" onClick={() => startGame(1)}>
            Start Player 1
          </button>
          <button className="pokeball-button" onClick={() => startGame(2)}>
            Start Player 2
          </button>
        </div>
      ) : (
        <>
          <div className="player-timers">
            <div className="player">
              <h2>{player1Name}</h2>
              <div className="timer">{formatTime(player1Time)}</div>
              <button className="pokeball-button" onClick={passTurn}>
                Pass Turn
              </button>
            </div>
            <div className="player">
              <h2>{player2Name}</h2>
              <div className="timer">{formatTime(player2Time)}</div>
              <button className="pokeball-button" onClick={passTurn}>
                Pass Turn
              </button>
            </div>
          </div>
          <div className="upkeep-section">
            <div className={`upkeep-timer ${upkeepTime <= 10 ? "flash-red" : ""}`}>
              {formatTime(upkeepTime)}
            </div>
            <button className="pokeball-button" onClick={startUpkeep}>
              Start Upkeep
            </button>
            <button className="pokeball-button" onClick={resetUpkeep}>
              Reset Upkeep
            </button>
          </div>
        </>
      )}
      <div className="controls">
        <button className="pokeball-button" onClick={resetAll}>
          Reset All
        </button>
        <button className="pokeball-button" onClick={toggleAudio}>
          {audioEnabled ? "Mute" : "Unmute"}
        </button>
        <button className="pokeball-button" onClick={toggleSettings}>
          Settings
        </button>
      </div>
    </div>
  );
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default MainComponent;
