import React, { useState, useEffect, useMemo } from "react";
import "./MainComponent.css";

function MainComponent() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  // Sounds
  const winSound = useMemo(() => new Audio("./sounds/victory.mp3"), []);
  const battleSound = useMemo(() => new Audio("./sounds/battle.mp3"), []);
  const lowHealthSound = useMemo(() => new Audio("./sounds/low-health.mp3"), []);
  const plinkSound = useMemo(() => new Audio("./sounds/plink.mp3"), []);

  // Play sound helper
  const playSound = (sound) => {
    if (audioEnabled) {
      sound.pause();
      sound.currentTime = 0;
      sound.play().catch((err) => console.error("Sound playback failed:", err));
    }
  };

  // Timers
  useEffect(() => {
    let interval;
    if (gameStarted && activePlayer) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prev) => {
            if (prev <= 0) {
              endGame();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setPlayer2Time((prev) => {
            if (prev <= 0) {
              endGame();
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
          if (prev <= 10) {
            playSound(lowHealthSound);
          }
          if (prev <= 0) {
            setIsUpkeepActive(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(upkeepInterval);
  }, [isUpkeepActive]);

  // Game actions
  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    playSound(battleSound);
  };

  const passTurn = () => {
    playSound(plinkSound);
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    setIsUpkeepActive(false);
  };

  const resetAll = () => {
    playSound(plinkSound);
    setGameStarted(false);
    setActivePlayer(null);
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    setUpkeepTime(30);
    setIsUpkeepActive(false);
  };

  const endGame = () => {
    setGameStarted(false);
    playSound(winSound);
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  return (
    <div className="main-container">
      <header className="header">
        <h1>Pokémon TCG Timer</h1>
      </header>
      <div className="game-container">
        {!gameStarted ? (
          <div className="start-buttons">
            <button className="poke-button" onClick={() => startGame(1)}>
              Start Player 1
            </button>
            <button className="poke-button" onClick={() => startGame(2)}>
              Start Player 2
            </button>
          </div>
        ) : (
          <div>
            <div className="player-timers">
              <div className="player">
                <h2>{player1Name}</h2>
                <div className="timer">{Math.floor(player1Time / 60)}:{player1Time % 60}</div>
              </div>
              <div className="player">
                <h2>{player2Name}</h2>
                <div className="timer">{Math.floor(player2Time / 60)}:{player2Time % 60}</div>
              </div>
            </div>
            <button className="poke-button" onClick={passTurn}>
              Pass Turn
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;
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
<<<<<<< HEAD

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
=======
  const [upkeepDefault, setUpkeepDefault] = useState(30);
  const [gameTime, setGameTime] = useState(20);

  // Sound files
  const startGameSound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/battle.mp3"));
  const plinkSound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/plink.mp3"));
  const lowHealthSound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/low-health.mp3"));
  const victorySound = useRef(new Audio(process.env.PUBLIC_URL + "/sounds/victory.mp3"));
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2

  // Helper function to play sounds
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
<<<<<<< HEAD
          if (prev <= 10 && prev > 0) playSound(lowHealthSound.current);
=======
          if (prev <= 10 && prev > 0) {
            playSound(lowHealthSound.current);
          }
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
          if (prev <= 0) {
            setIsUpkeepActive(false);
            return 30; // Default upkeep time
          }
          return prev - 1;
        });
      }, 1000);
    }
<<<<<<< HEAD
    return () => clearInterval(upkeepInterval);
  }, [isUpkeepActive]);

=======
    return () => {
      clearInterval(upkeepInterval);
      lowHealthSound.current.pause();
      lowHealthSound.current.currentTime = 0;
    };
  }, [isUpkeepActive, upkeepDefault]);

  // Handle game over
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
  const handleGameOver = () => {
    setGameStarted(false);
    setActivePlayer(null);
    playSound(victorySound.current);
  };

  // Button functions
  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
<<<<<<< HEAD
    setPlayer1Time(20 * 60);
    setPlayer2Time(20 * 60);
    playSound(battleSound.current);
=======
    setPlayer1Time(gameTime * 60);
    setPlayer2Time(gameTime * 60);
    playSound(startGameSound.current);
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
  };

  const passTurn = () => {
    playSound(plinkSound.current);
    setActivePlayer((prev) => (prev === 1 ? 2 : 1));
<<<<<<< HEAD
=======
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
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
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
<<<<<<< HEAD
=======
    lowHealthSound.current.pause();
    startGameSound.current.pause();
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
  };

  return (
    <div className="main-container">
      <div className="header">
        <h1>Pokémon TCG Timer</h1>
      </div>
      {!gameStarted ? (
        <div className="start-buttons">
<<<<<<< HEAD
          <button onClick={() => startGame(1)}>Start Player 1</button>
          <button onClick={() => startGame(2)}>Start Player 2</button>
=======
          <button className="start-button" onClick={() => startGame(1)}>
            Start Player 1
          </button>
          <button className="start-button" onClick={() => startGame(2)}>
            Start Player 2
          </button>
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
        </div>
      ) : (
        <>
          <div className="player-timers">
            <div className="player">
<<<<<<< HEAD
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
=======
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
>>>>>>> 7f23d9b9fdbad14125b51104b8b83b99e200b2e2
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
