import React, { useState, useEffect, useRef } from "react";
import "./MainComponent.css";

function MainComponent() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [savedPlayerTime, setSavedPlayerTime] = useState(20 * 60);
  const [playerTimeInput, setPlayerTimeInput] = useState(20);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [savedUpkeepTime, setSavedUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [skin, setSkin] = useState("pikachu-theme");
  const [skins, setSkins] = useState([
    "pikachu-theme",
    "charizard-theme",
    "bulbasaur-theme",
    "squirtle-theme",
    "jigglypuff-theme",
    "meowth-theme",
    "gengar-theme",
    "eevee-theme",
    "snorlax-theme",
    "dragonite-theme",
    "lapras-theme",
    "umbreon-theme",
    "espeon-theme",
    "lucario-theme",
    "togepi-theme",
    "machamp-theme",
    "mewtwo-theme",
    "mew-theme",
    "psyduck-theme",
    "arcanine-theme",
    "articuno-theme",
    "zapdos-theme",
    "moltres-theme",
    "raichu-theme",
    "lugia-theme"
  ]);
  const [isPaused, setIsPaused] = useState(false);

  const startGameSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/battle.mp3`));
  const lowHealthSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/low-health.mp3`));
  const victorySound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`));
  const plinkSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/plink.mp3`));

  const playSound = (soundRef) => {
    if (!audioEnabled) return;
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
      setPlayerTimeInput(Number(savedGameTimer) / 60);
    }
  }, []);

  const handleSkinChange = (newSkin) => {
    setSkin(newSkin);
    localStorage.setItem("selectedSkin", newSkin);
  };

  const handleEasterEgg = () => {
    if (
      player1Name.toLowerCase() === "god mode" ||
      player2Name.toLowerCase() === "god mode"
    ) {
      const newSkin = "pokeball-theme";
      if (!skins.includes(newSkin)) {
        setSkins((prevSkins) => [...prevSkins, newSkin]);
      }
      setSkin(newSkin);
      localStorage.setItem("selectedSkin", newSkin);
      setPlayer1Name("Player 1");
      setPlayer2Name("Player 2");
    }
  };

  const saveSettings = () => {
    playSound(plinkSound.current);
    setShowSettings(false);
    setIsPaused(false);
    const newSavedTime = playerTimeInput * 60;
    setSavedUpkeepTime(upkeepTime);
    setSavedPlayerTime(newSavedTime);
    setPlayer1Time(newSavedTime);
    setPlayer2Time(newSavedTime);
    localStorage.setItem("savedUpkeepTime", upkeepTime);
    localStorage.setItem("savedPlayerTime", newSavedTime);

    handleEasterEgg();
  };

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

  const resetGame = () => {
    playSound(plinkSound.current);
    stopAllSounds();
    setGameStarted(false);
    setPlayer1Time(savedPlayerTime);
    setPlayer2Time(savedPlayerTime);
    setUpkeepTime(savedUpkeepTime);
    setIsUpkeepActive(false);
  };

  const openSettings = () => {
    playSound(plinkSound.current);
    setIsPaused(true);
    setShowSettings(true);
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
            <button onClick={() => setIsPaused((prev) => !prev)}>{isPaused ? "Resume" : "Pause"}</button>
            <button onClick={resetGame}>Reset Game</button>
            <button onClick={toggleAudio}>
              {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
            <button onClick={openSettings}>⚙️ Settings</button>
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
              value={playerTimeInput}
              onChange={(e) => setPlayerTimeInput(Number(e.target.value))}
            />
          </label>
          <label>
            Upkeep Timer (seconds):
            <input
              type="number"
              value={upkeepTime}
              onChange={(e) => setUpkeepTime(Number(e.target.value))}
            />
          </label>
          <label>
            Choose a Skin:
            <select value={skin} onChange={(e) => handleSkinChange(e.target.value)}>
              {skins.map((skinOption) => (
                <option key={skinOption} value={skinOption}>{skinOption.replace("-theme", "")}</option>
              ))}
            </select>
          </label>
          <button onClick={saveSettings}>Save</button>
        </div>
      )}
    </div>
  );
}

export default MainComponent;
