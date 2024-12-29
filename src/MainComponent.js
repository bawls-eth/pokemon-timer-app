"use client";
import React, { useState, useEffect } from "react";

function MainComponent() {
  const [activePlayer, setActivePlayer] = useState(null);
  const [player1Time, setPlayer1Time] = useState(20 * 60);
  const [player2Time, setPlayer2Time] = useState(20 * 60);
  const [upkeepTime, setUpkeepTime] = useState(30);
  const [isUpkeepActive, setIsUpkeepActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [gameStarted, setGameStarted] = useState(false);
  const [upkeepDefault, setUpkeepDefault] = useState(30);
  const [showSettings, setShowSettings] = useState(false);
  const [gameTime, setGameTime] = useState(20);

  // Updated Sound Paths
  const plinkSound = new Audio(process.env.PUBLIC_URL + "/sounds/plink.mp3");
  const victorySound = new Audio(process.env.PUBLIC_URL + "/sounds/victory.mp3");
  const lowHealthAudio = new Audio(process.env.PUBLIC_URL + "/sounds/low-health.mp3");
  const battleSound = new Audio(process.env.PUBLIC_URL + "/sounds/battle.mp3");

  useEffect(() => {
    let interval;
    if (activePlayer && gameStarted && !isPaused) {
      interval = setInterval(() => {
        if (activePlayer === 1) {
          setPlayer1Time((prev) => {
            if (prev === 0) {
              playSound(victorySound);
              endGame();
              return 0;
            }
            return prev - 1;
          });
        } else if (activePlayer === 2) {
          setPlayer2Time((prev) => {
            if (prev === 0) {
              playSound(victorySound);
              endGame();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePlayer, gameStarted, isPaused]);

  useEffect(() => {
    let upkeepInterval;
    if (isUpkeepActive && !isPaused) {
      upkeepInterval = setInterval(() => {
        setUpkeepTime((prev) => {
          if (prev <= 10 && prev > 0) {
            playSound(lowHealthAudio);
          }
          if (prev <= 0) {
            playSound(victorySound);
            resetUpkeep();
            setIsUpkeepActive(false);
            return upkeepDefault;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(upkeepInterval);
      lowHealthAudio.pause();
      lowHealthAudio.currentTime = 0;
    };
  }, [isUpkeepActive, upkeepDefault, isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const playSound = (sound) => {
    if (audioEnabled && sound) {
      sound.currentTime = 0;
      sound.play().catch((e) => console.log("Sound failed to play:", e));
    }
  };

  const startGame = (player) => {
    setGameStarted(true);
    setActivePlayer(player);
    playSound(battleSound);
  };

  const endGame = () => {
    setGameStarted(false);
    battleSound.pause();
    setActivePlayer(null);
  };

  const passTurn = () => {
    playSound(plinkSound);
    setIsUpkeepActive(false);
    lowHealthAudio.pause();
    lowHealthAudio.currentTime = 0;
    setActivePlayer(activePlayer === 1 ? 2 : 1);
  };

  const startUpkeep = () => {
    playSound(plinkSound);
    setIsUpkeepActive(true);
  };

  const resetUpkeep = () => {
    playSound(plinkSound);
    setUpkeepTime(upkeepDefault);
    setIsUpkeepActive(false);
    lowHealthAudio.pause();
    lowHealthAudio.currentTime = 0;
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    battleSound.pause();
    lowHealthAudio.pause();
  };

  const resetAll = () => {
    battleSound.pause();
    lowHealthAudio.pause();
    playSound(plinkSound);
    setGameStarted(false);
    setActivePlayer(null);
    setPlayer1Time(gameTime * 60);
    setPlayer2Time(gameTime * 60);
    setUpkeepTime(upkeepDefault);
    setIsUpkeepActive(false);
    setIsPaused(false);
  };

  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 via-white to-black font-retro">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-4 border-red-500">
        <div className="p-4 bg-red-500 border-b-4 border-black text-white">
          <h1 className="text-3xl text-center font-bold">Pokémon TCG Timer</h1>
        </div>

        {!gameStarted ? (
          <div className="p-4 text-center space-x-4">
            <button
              onClick={() => startGame(1)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-8 rounded-full shadow-lg"
            >
              Start Player 1
            </button>
            <button
              onClick={() => startGame(2)}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-8 rounded-full shadow-lg"
            >
              Start Player 2
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-black">
              <div className="text-center mb-4">
                <div
                  className={`text-5xl font-bold text-red-700 ${
                    upkeepTime <= 10 && upkeepTime > 0
                      ? "animate-pulse text-red-500"
                      : ""
                  }`}
                >
                  {formatTime(player1Time)}
                </div>
                <p className="text-black">{player1Name}</p>
                <button
                  onClick={passTurn}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-8 rounded-full shadow-lg"
                >
                  Pass Turn
                </button>
              </div>
            </div>

            <div className="p-4 bg-black text-white">
              <div className="text-center mb-4">
                <div
                  className={`text-4xl font-bold ${
                    upkeepTime <= 10 && isUpkeepActive ? "animate-pulse" : ""
                  }`}
                >
                  {formatTime(upkeepTime)}
                </div>
                <p>Upkeep Timer</p>
                <button
                  onClick={startUpkeep}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-8 rounded-full shadow-lg"
                >
                  Start Upkeep
                </button>
                <button
                  onClick={resetUpkeep}
                  className="bg-white hover:bg-gray-200 text-black px-8 py-8 rounded-full shadow-lg ml-2"
                >
                  Reset Upkeep
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-black">
              <div className="text-center">
                <div className="text-5xl font-bold text-black">
                  {formatTime(player2Time)}
                </div>
                <p className="text-black">{player2Name}</p>
                <button
                  onClick={passTurn}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-8 rounded-full shadow-lg"
                >
                  Pass Turn
                </button>
              </div>
            </div>
          </>
        )}

        <div className="p-4 bg-red-500 text-white border-t-4 border-black">
          <div className="flex justify-around">
            <button
              onClick={toggleAudio}
              className="px-8 py-8 bg-black text-white rounded-full shadow-lg"
            >
              {audioEnabled ? "🔇" : "🔊"}
            </button>
            <button
              onClick={toggleSettings}
              className="px-8 py-8 bg-black text-white rounded-full shadow-lg"
            >
              ⚙️
            </button>
            <button
              onClick={resetAll}
              className="px-8 py-8 bg-white text-black rounded-full shadow-lg"
            >
              🔄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
