import React, { useState, useEffect, useRef, useCallback } from "react";  
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
  const [skin, setSkin] = useState("pokeball-theme");
  const [skins, setSkins] = useState(["pokeball-theme"]);
  const [isPaused, setIsPaused] = useState(false);

  const startGameSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/battle.mp3`));
  const lowHealthSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/low-health.mp3`));
  const victorySound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`));
  const plinkSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/plink.mp3`));

  const playSound = useCallback(
    (soundRef) => {
      if (!audioEnabled) return;
      soundRef.currentTime = 0;
      soundRef.play().catch((error) => console.error("Audio playback error:", error));
    },
    [audioEnabled]
  );

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

  useEffect(() => {
    let interval;
    if (gameStarted && !isPaused && activePlayer) {
      interval = setInterval(() => {
        setPlayer1Time((prevTime) => {
          if (activePlayer === 1 && prevTime > 0) {
            if (prevTime === 60) playSound(lowHealthSound.current);
            return prevTime - 1;
          }
          return prevTime;
        });

        setPlayer2Time((prevTime) => {
          if (activePlayer === 2 && prevTime > 0) {
            if (prevTime === 60) playSound(lowHealthSound.current);
            return prevTime - 1;
          }
          return prevTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameStarted, isPaused, activePlayer, playSound]);

  useEffect(() => {
    let interval;
    if (isUpkeepActive && !isPaused) {
      interval = setInterval(() => {
        setUpkeepTime((prevTime) => {
          if (prevTime > 0) {
            if (prevTime === 10) playSound(lowHealthSound.current);
            return prevTime - 1;
          }
          setIsUpkeepActive(false);
          return savedUpkeepTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isUpkeepActive, isPaused, savedUpkeepTime, playSound]);

  const handleSkinChange = (newSkin) => {
    playSound(plinkSound.current);
    setSkin(newSkin);
    localStorage.setItem("selectedSkin", newSkin);
  };

  const handleEasterEgg = () => {
    const easterEggSkins = {
      pikachu: "pikachu-theme",
      charizard: "charizard-theme",
      bulbasaur: "bulbasaur-theme",
      squirtle: "squirtle-theme",
      jigglypuff: "jigglypuff-theme",
      meowth: "meowth-theme",
      gengar: "gengar-theme",
      eevee: "eevee-theme",
      snorlax: "snorlax-theme",
      dragonite: "dragonite-theme",
      lapras: "lapras-theme",
      umbreon: "umbreon-theme",
      espeon: "espeon-theme",
      lucario: "lucario-theme",
      togepi: "togepi-theme",
      machamp: "machamp-theme",
      mewtwo: "mewtwo-theme",
      mew: "mew-theme",
      psyduck: "psyduck-theme",
      arcanine: "arcanine-theme",
      articuno: "articuno-theme",
      zapdos: "zapdos-theme",
      moltres: "moltres-theme",
      raichu: "raichu-theme",
      lugia: "lugia-theme",
    };

    const player1Key = player1Name.toLowerCase();
    const player2Key = player2Name.toLowerCase();

    if (player1Key === "god mode" || player2Key === "god mode") {
      const allSkins = Object.values(easterEggSkins);
      setSkins((prevSkins) => {
        const newSkins = allSkins.filter((skin) => !prevSkins.includes(skin));
        return [...prevSkins, ...newSkins];
      });
      setSkin(allSkins[0]);
      localStorage.setItem("selectedSkin", allSkins[0]);
      return;
    }

    if (easterEggSkins[player1Key] || player1Name.toLowerCase() === "god mode") {
      setPlayer1Name("Player 1");
    }
    if (easterEggSkins[player2Key] || player2Name.toLowerCase() === "god mode") {
      setPlayer2Name("Player 2");
    }

    if (easterEggSkins[player1Key] || easterEggSkins[player2Key]) {
      const newSkin = easterEggSkins[player1Key] || easterEggSkins[player2Key];
      if (!skins.includes(newSkin)) {
        setSkins((prevSkins) => [...prevSkins, newSkin]);
      }
      setSkin(newSkin);
      localStorage.setItem("selectedSkin", newSkin);
    }
  };

  const saveSettings = () => {
    playSound(plinkSound.current);
    setShowSettings(false);
    setIsPaused(false);
    setSavedUpkeepTime(upkeepTime);
    setSavedPlayerTime(player1Time); // Do not reset time on save
    handleEasterEgg();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startGame = (player) => {
    playSound(plinkSound.current);
    setGameStarted(true);
    setActivePlayer(player);
    playSound(startGameSound.current);
  };

  const passTurn = () => {
    playSound(plinkSound.current);
    setIsUpkeepActive(false);
    setUpkeepTime(savedUpkeepTime);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  const toggleUpkeep = () => {
    playSound(plinkSound.current);
    if (isUpkeepActive) {
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
            <button onClick={() => {
              playSound(plinkSound.current);
              setIsPaused((prev) => !prev);
            }}>
              {isPaused ? "Resume" : "Pause"}
            </button>
            <button onClick={() => {
              playSound(plinkSound.current);
              resetGame();
            }}>Reset Game</button>
            <button onClick={() => {
              playSound(plinkSound.current);
              toggleAudio();
            }}>
              {audioEnabled ? "🔊 Sound On" : "🔇 Sound Off"}
            </button>
            <button onClick={() => {
              playSound(plinkSound.current);
              openSettings();
            }}>⚙️ Settings</button>
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
              onChange={(e) => {
                playSound(plinkSound.current);
                setPlayer1Name(e.target.value);
              }}
            />
          </label>
          <label>
            Player 2 Name:
            <input
              type="text"
              value={player2Name}
              onChange={(e) => {
                playSound(plinkSound.current);
                setPlayer2Name(e.target.value);
              }}
            />
          </label>
          <label>
            Game Timer (minutes):
            <input
              type="number"
              placeholder=""
              value={playerTimeInput === 0 ? "" : playerTimeInput}
              onChange={(e) => {
                playSound(plinkSound.current);
                setPlayerTimeInput(Number(e.target.value) || 0);
              }}
            />
          </label>
          <label>
            Upkeep Timer (seconds):
            <input
              type="number"
              placeholder=""
              value={upkeepTime === 0 ? "" : upkeepTime}
              onChange={(e) => {
                playSound(plinkSound.current);
                setUpkeepTime(Number(e.target.value) || 0);
              }}
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
