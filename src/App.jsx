import { useState } from 'react';
import './App.css';
import ModeSelector from './components/ModeSelector';
import Timer from './components/Timer';
import TimeInput from './components/TimeInput';
import TimerControls from './components/TimerControls';
import Alarm from './components/Alarm';
import useAlarm from './hooks/useAlarm';
import useTimer from './hooks/useTimer';
import useFullscreen from './hooks/useFullscreen';
import useTimeInput from './hooks/useTimerInput';

function App() {
  const [mode, setMode] = useState('up');
  const [initialTime, setInitialTime] = useState(600);
  const [isAlarm, setIsAlarm] = useState(false);
  const { initAudio, playOneMinuteBell } = useAlarm(isAlarm);
  const { time, setTime, isRunning, setIsRunning, resetOneMinuteBell } =
    useTimer({
      mode,
      initialTime,
      setIsAlarm,
      playOneMinuteBell,
    });
  const { minutes, seconds, handleMinutesChange, handleSecondsChange } =
    useTimeInput({
      mode,
      setTime,
      setInitialTime,
      resetOneMinuteBell,
    });
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // 타이머 정지 공통 처리
  const stopTimer = () => {
    setIsRunning(false);
    setIsAlarm(false);
  };

  // 모드 변경
  const handleModeChange = (selectedMode) => {
    stopTimer();
    resetOneMinuteBell();
    setMode(selectedMode);

    if (selectedMode === 'up') {
      setTime(0);
    } else {
      setTime(initialTime);
    }
  };

  // 시작
  const handleStart = async () => {
    await initAudio();

    setIsAlarm(false);

    if (mode === 'down' && time === 0) {
      resetOneMinuteBell();
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
    resetOneMinuteBell();
    setTime(mode === 'up' ? 0 : initialTime);
  };

  return (
    <div className="container">
      <h1>MY TIMER</h1>
      <p className="subtitle">SIMPLE TIME MANAGEMENT</p>

      <ModeSelector mode={mode} onModeChange={handleModeChange} />

      <TimeInput
        mode={mode}
        minutes={minutes}
        seconds={seconds}
        isRunning={isRunning}
        onMinutesChange={handleMinutesChange}
        onSecondsChange={handleSecondsChange}
      />

      <Timer time={time} isFullscreen={isFullscreen} />

      <TimerControls
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />

      <button className="fullscreen-button" onClick={toggleFullscreen}>
        {isFullscreen ? '전체 화면 종료' : '전체 화면'}
      </button>

      <Alarm isAlarm={isAlarm} onStopAlarm={handleStopAlarm} />
    </div>
  );
}

export default App;
