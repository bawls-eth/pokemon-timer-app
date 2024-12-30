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
  const [lowHealthTriggered, setLowHealthTriggered] = useState({
    player1: false,
    player2: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  // Preload and manage sounds
  const sounds = useRef({
    startGameSound: new Audio(`${process.env.PUBLIC_URL}/sounds/battle.mp3`),
    lowHealthSound: new Audio(`${process.env.PUBLIC_URL}/sounds/low-health.mp3`),
    victorySound: new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`),
    plinkSound: new Audio(`${process.env.PUBLIC_URL}/sounds/plink.mp3`),
  });

  useEffect(() => {
    Object.values(sounds.current).forEach((sound) => {
      sound.preload = "auto";
    });
  }, []);

  const playSound = (sound) => {
    if (audioEnabled) {
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch((error) => console.error("Audio playback error:", error));
    }
  };

  const stopAllSounds = () => {
    Object.values(sounds.current).forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  useEffect(() => {
    let interval;
    if (gameStarted && activePlayer) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prev) => {
            if (prev <= 1) {
              playSound(sounds.current.victorySound);
              setGameStarted(false);
              return 0;
            }
            if (prev <= 60 && !lowHealthTriggered.player1) {
              playSound(sounds.current.lowHealthSound);
              setLowHealthTriggered((prev) => ({ ...prev, player1: true }));
            }
            return prev - 1;
          });
        } else {
          setPlayer2Time((prev) => {
            if (prev <= 1) {
              playSound(sounds.current.victorySound);
              setGameStarted(false);
              return 0;
            }
            if (prev <= 60 && !lowHealthTriggered.player2) {
              playSound(sounds.current.lowHealthSound);
              setLowHealthTriggered((prev) => ({ ...prev, player2: true }));
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, activePlayer, lowHealthTriggered]);

  useEffect(() => {
    let interval;
    if (isUpkeepActive) {
      interval = setInterval(() => {
        setUpkeepTime((prev) => {
          if (prev <= 10 && prev > 0) {
            playSound(sounds.current.lowHealthSound);
          }
          if (prev <= 1) {
            setIsUpkeepActive(false);
            stopAllSounds();
            return 30;
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
    playSound(sounds.current.startGameSound);
    setLowHealthTriggered({ player1: false, player2: false });
  };

  const passTurn = () => {
    playSound(sounds.current.plinkSound);
    setIsUpkeepActive(false);
    setUpkeepTime(30);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const toggleUpkeep = () => {
    if (isUpkeepActive) {
      playSound(sounds.current.plinkSound);
      setIsUpkeepActive(false);
      setUpkeepTime(30);
      stopAllSounds();
    } else {
      playSound(sounds.current.plinkSound);
      setIsUpkeepActive(true);
    }
  };

  const resetGame = () => {
    playSound(sounds.current.plinkSound);
    stopAllSounds();
    setGameStarted(false);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    setUpkeepTime(30);
    setIsUpkeepActive(false);
    setLowHealthTriggered({ player1: false, player2: false });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    stopAllSounds();
  };

  const saveSettings = () => {
    setShowSettings(false);
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
            <h2>{player1Name}</h2>
            <p>{formatTime(player1Time)}</p>
          </div>
          <div className="circle-button" onClick={passTurn}>
            <p className={`upkeep-timer ${upkeepTime <= 10 ? "critical" : ""}`}>
              {isUpkeepActive ? formatTime(upkeepTime) : "Pass Turn"}
            </p>
          </div>
          <div className="player-timer player2">
            <h2>{player2Name}</h2>
            <p>{formatTime(player2Time)}</p>
          </div>
          <button className="square-button" onClick={toggleUpkeep}>
            {isUpkeepActive ? "Reset Upkeep" : "Start Upkeep"}
          </button>
          <div className="control-buttons">
            <button onClick={resetGame}>Reset Game</button>
            <button onClick={toggleAudio}>
              {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
            <button onClick={() => setShowSettings(true)}>⚙️ Settings</button>
          </div>
        </div>
      )}
      {showSettings && (
        <div className="settings-modal">
          <h2>Settings</h2>
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
            Game Timer (minutes):
            <input
              type="number"
              value={Math.floor(player1Time / 60)}
              onChange={(e) => {
                setPlayer1Time(e.target.value * 60);
                setPlayer2Time(e.target.value * 60);
              }}
            />
          </label>
          <label>
            Upkeep Timer (seconds):
            <input
              type="number"
              value={upkeepTime}
              onChange={(e) => setUpkeepTime(e.target.value)}
            />
          </label>
          <button onClick={saveSettings}>Save</button>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
