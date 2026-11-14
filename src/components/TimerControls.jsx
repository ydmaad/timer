function TimerControls({ onStart, onPause, onReset }) {
  return (
    <div className="controls">
      <button onClick={onStart}>시작</button>
      <button onClick={onPause}>일시정지</button>
      <button onClick={onReset}>초기화</button>
    </div>
  );
}

export default TimerControls;
