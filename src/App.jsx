import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('up');
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [minutes, setMinutes] = useState('10');
  const [seconds, setSeconds] = useState('00');
  const [initialTime, setInitialTime] = useState(600);

  const [isAlarm, setIsAlarm] = useState(false);
  const audioContextRef = useRef(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // 알람 소리 재생
  const playAlarm = () => {
    const audioContext = audioContextRef.current;

    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = 880;

    gainNode.gain.value = 0.2;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // 타이머 실행
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      if (mode === 'up') {
        // 목표 시간에 도달하면 알람 실행
        if (time < initialTime && time + 1 >= initialTime) {
          setIsAlarm(true);
        }

        // 목표 시간 이후에도 계속 증가
        setTime((prevTime) => prevTime + 1);
      } else {
        // 카운트다운
        if (time <= 1) {
          setTime(0);
          setIsRunning(false);
          setIsAlarm(true);
        } else {
          setTime((prevTime) => prevTime - 1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, mode, time, initialTime]);

  // 알람 반복 실행
  useEffect(() => {
    if (!isAlarm) return;

    playAlarm();

    const alarm = setInterval(() => {
      playAlarm();
    }, 1000);

    return () => clearInterval(alarm);
  }, [isAlarm]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 시간 표시
  const displayMinutes = String(Math.floor(time / 60)).padStart(2, '0');
  const displaySeconds = String(time % 60).padStart(2, '0');

  // 모드 변경
  const handleModeChange = (selectedMode) => {
    setIsRunning(false);
    setIsAlarm(false);
    setMode(selectedMode);

    if (selectedMode === 'up') {
      setTime(0);
    } else {
      setTime(initialTime);
    }
  };

  // 분 입력
  const handleMinutesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);

    setMinutes(value);

    const total = Number(value || 0) * 60 + Number(seconds || 0);

    setInitialTime(total);

    if (mode === 'down') {
      setTime(total);
    }
  };

  // 초 입력
  const handleSecondsChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);

    if (Number(value) > 59) return;

    setSeconds(value);

    const total = Number(minutes || 0) * 60 + Number(value || 0);

    setInitialTime(total);

    if (mode === 'down') {
      setTime(total);
    }
  };

  // 시작
  const handleStart = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    setIsAlarm(false);

    if (mode === 'down' && time === 0) {
      const total = Number(minutes || 0) * 60 + Number(seconds || 0);

      if (total === 0) return;

      setInitialTime(total);
      setTime(total);
    }

    setIsRunning(true);
  };

  const handleStopAlarm = () => {
    setIsAlarm(false);
  };

  // 일시정지
  const handlePause = () => {
    setIsRunning(false);
    setIsAlarm(false);
  };

  // 초기화
  const handleReset = () => {
    setIsRunning(false);
    setIsAlarm(false);
    setTime(mode === 'up' ? 0 : initialTime);
  };

  // 전체 화면 전환
  const handleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="container">
      <h1>MY TIMER</h1>
      <p className="subtitle">SIMPLE TIME MANAGEMENT</p>

      <div className="mode">
        <button
          className={mode === 'up' ? 'active' : ''}
          onClick={() => handleModeChange('up')}
        >
          카운트업
        </button>

        <button
          className={mode === 'down' ? 'active' : ''}
          onClick={() => handleModeChange('down')}
        >
          카운트다운
        </button>
      </div>

      <div className="time-input">
        <span>{mode === 'up' ? '목표 시간' : '설정 시간'}</span>

        <input
          type="number"
          min="0"
          max="999"
          value={minutes}
          onChange={handleMinutesChange}
          disabled={isRunning}
        />
        <span>분</span>

        <input
          type="number"
          min="0"
          max="59"
          value={seconds}
          onChange={handleSecondsChange}
          disabled={isRunning}
        />
        <span>초</span>
      </div>

      <div className={`timer ${isFullscreen ? 'fullscreen-timer' : ''}`}>
        {displayMinutes}:{displaySeconds}
      </div>

      <div className="controls">
        <button onClick={handleStart}>시작</button>
        <button onClick={handlePause}>일시정지</button>
        <button onClick={handleReset}>초기화</button>
      </div>

      <button className="fullscreen-button" onClick={handleFullscreen}>
        {isFullscreen ? '전체 화면 종료' : '전체 화면'}
      </button>

      {isAlarm && (
        <div className="alarm-message">
          <p>⏰ 시간이 종료되었습니다!</p>
          <button onClick={handleStopAlarm}>알람 끄기</button>
        </div>
      )}
    </div>
  );
}

export default App;
