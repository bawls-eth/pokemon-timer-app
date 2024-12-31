import React, { useState, useEffect, useRef } from "react";
import "./MainComponent.css";

function MainComponent() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [savedPlayerTime, setSavedPlayerTime] = useState(20 * 60);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [savedUpkeepTime, setSavedUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [skin, setSkin] = useState("pikachu-theme");
  const [isPaused, setIsPaused] = useState(false);

  const startGameSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/battle.mp3`));
  const lowHealthSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/low-health.mp3`));
  const victorySound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`));
  const plinkSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/plink.mp3`));

  const playSound = (soundRef) => {
    if (!audioEnabled) return; // Prevent sound from playing if muted
    try {
      soundRef.pause();
      soundRef.currentTime = 0;
      soundRef.play().catch((error) => console.error("Audio playback error:", error));
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const stopAllSounds = () => {
    [startGameSound.current, lowHealthSound.current, victorySound.current, plinkSound.current].forEach((sound) => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  const toggleAudio = () => {
    if (audioEnabled) {
      stopAllSounds();
    }
    setAudioEnabled(!audioEnabled);
  };

  useEffect(() => {
    const savedSkin = localStorage.getItem("selectedSkin");
    if (savedSkin) setSkin(savedSkin);

    const savedUpkeep = localStorage.getItem("savedUpkeepTime");
    if (savedUpkeep) setSavedUpkeepTime(Number(savedUpkeep));

    const savedGameTimer = localStorage.getItem("savedPlayerTime");
    if (savedGameTimer) {
      setSavedPlayerTime(Number(savedGameTimer));
      setPlayer1Time(Number(savedGameTimer));
      setPlayer2Time(Number(savedGameTimer));
    }
  }, []);

  const handleSkinChange = (newSkin) => {
    setSkin(newSkin);
    localStorage.setItem("selectedSkin", newSkin);
  };

  useEffect(() => {
    let interval;
    if (gameStarted && activePlayer && !isPaused) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prev) => {
            if (prev <= 60 && prev > 0) {
              if (lowHealthSound.current.paused) playSound(lowHealthSound.current);
            }
            if (prev === 0) {
              playSound(victorySound.current);
              clearInterval(interval);
            }
            return prev > 0 ? prev - 1 : 0;
          });
        } else {
          setPlayer2Time((prev) => {
            if (prev <= 60 && prev > 0) {
              if (lowHealthSound.current.paused) playSound(lowHealthSound.current);
            }
            if (prev === 0) {
              playSound(victorySound.current);
              clearInterval(interval);
            }
            return prev > 0 ? prev - 1 : 0;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, activePlayer, isPaused, playSound]);

  useEffect(() => {
    let interval;
    if (isUpkeepActive && !isPaused) {
      interval = setInterval(() => {
        setUpkeepTime((prev) => {
          if (prev === 10) {
            playSound(lowHealthSound.current);
          }
          if (prev <= 1) {
            setIsUpkeepActive(false);
            return savedUpkeepTime;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUpkeepActive, savedUpkeepTime, isPaused, playSound]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    setPlayer1Time(savedPlayerTime);
    setPlayer2Time(savedPlayerTime);
    playSound(startGameSound.current);
  };

  const passTurn = () => {
    playSound(plinkSound.current);
    setIsUpkeepActive(false);
    lowHealthSound.current.pause();
    lowHealthSound.current.currentTime = 0;
    setUpkeepTime(savedUpkeepTime);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const toggleUpkeep = () => {
    playSound(plinkSound.current);
    if (isUpkeepActive) {
      lowHealthSound.current.pause();
      lowHealthSound.current.currentTime = 0;
      setIsUpkeepActive(false);
      setUpkeepTime(savedUpkeepTime);
    } else {
      setIsUpkeepActive(true);
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const resetGame = () => {
    playSound(plinkSound.current);
    stopAllSounds();
    setGameStarted(false);
    setPlayer1Time(savedPlayerTime);
    setPlayer2Time(savedPlayerTime);
    setUpkeepTime(savedUpkeepTime);
    setIsUpkeepActive(false);
  };

  const saveSettings = () => {
    playSound(plinkSound.current);
    setShowSettings(false);
    setSavedUpkeepTime(upkeepTime);
    setSavedPlayerTime(player1Time);
    localStorage.setItem("savedUpkeepTime", upkeepTime);
    localStorage.setItem("savedPlayerTime", player1Time);
  };

  return (
    <div className={`main-container ${skin}`}>
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
            <button onClick={togglePause}>{isPaused ? "Resume" : "Pause"}</button>
            <button onClick={resetGame}>Reset Game</button>
            <button onClick={toggleAudio}>
              {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
            <button
              onClick={() => {
                setShowSettings(true);
                playSound(plinkSound.current);
              }}
            >
              ⚙️ Settings
            </button>
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
              value={Math.floor(savedPlayerTime / 60)}
              onChange={(e) => {
                const newTime = e.target.value * 60;
                setPlayer1Time(newTime);
                setPlayer2Time(newTime);
                setSavedPlayerTime(newTime);
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
          <label>
            Choose a Skin:
            <select value={skin} onChange={(e) => handleSkinChange(e.target.value)}>
              <option value="pikachu-theme">Pikachu</option>
              <option value="charizard-theme">Charizard</option>
              <option value="bulbasaur-theme">Bulbasaur</option>
              <option value="squirtle-theme">Squirtle</option>
              <option value="jigglypuff-theme">Jigglypuff</option>
              <option value="meowth-theme">Meowth</option>
              <option value="gengar-theme">Gengar</option>
              <option value="eevee-theme">Eevee</option>
              <option value="snorlax-theme">Snorlax</option>
              <option value="dragonite-theme">Dragonite</option>
              <option value="lapras-theme">Lapras</option>
              <option value="umbreon-theme">Umbreon</option>
              <option value="espeon-theme">Espeon</option>
              <option value="lucario-theme">Lucario</option>
              <option value="togepi-theme">Togepi</option>
              <option value="machamp-theme">Machamp</option>
              <option value="mewtwo-theme">Mewtwo</option>
              <option value="mew-theme">Mew</option>
              <option value="psyduck-theme">Psyduck</option>
              <option value="arcanine-theme">Arcanine</option>
              <option value="articuno-theme">Articuno</option>
              <option value="zapdos-theme">Zapdos</option>
              <option value="moltres-theme">Moltres</option>
              <option value="raichu-theme">Raichu</option>
              <option value="lugia-theme">Lugia</option>
            </select>
          </label>
          <button onClick={saveSettings}>Save</button>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
