import React, { useState, useEffect, useRef } from "react";
import "./MainComponent.css";

const MainComponent = () => {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [skin, setSkin] = useState("pikachu-theme");

  const startGameSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/battle.mp3`));
  const lowHealthSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/low-health.mp3`));
  const victorySound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/victory.mp3`));
  const plinkSound = useRef(new Audio(`${process.env.PUBLIC_URL}/sounds/plink.mp3`));

  useEffect(() => {
    const savedSkin = localStorage.getItem("selectedSkin");
    if (savedSkin) setSkin(savedSkin);
  }, []);

  const handleSkinChange = (newSkin) => {
    setSkin(newSkin);
    localStorage.setItem("selectedSkin", newSkin);
  };

  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
  };

  const passTurn = () => {
    setIsUpkeepActive(false);
    setUpkeepTime(30);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div className={`main-container ${skin}`}>
      <h1 className="header">Pokémon TCG Timer</h1>
      {!gameStarted ? (
        <button className="start-button" onClick={() => startGame(1)}>
          Start Game
        </button>
      ) : (
        <div>
          <div className="player-timers">
            <p>{player1Name}: {Math.floor(player1Time / 60)}:{(player1Time % 60).toString().padStart(2, "0")}</p>
            <p>{player2Name}: {Math.floor(player2Time / 60)}:{(player2Time % 60).toString().padStart(2, "0")}</p>
          </div>
          <button className="action-button" onClick={passTurn}>
            Pass Turn
          </button>
        </div>
      )}
      <div className="settings">
        <h2>Settings</h2>
        <div className="settings-item">
          <label htmlFor="skin-select">Select Skin:</label>
          <select
            id="skin-select"
            value={skin}
            onChange={(e) => handleSkinChange(e.target.value)}
          >
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
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
