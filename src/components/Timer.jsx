function Timer({ time, isFullscreen }) {
  const displayMinutes = String(Math.floor(time / 60)).padStart(2, '0');

  const displaySeconds = String(time % 60).padStart(2, '0');

  return (
    <div className={`timer ${isFullscreen ? 'fullscreen-timer' : ''}`}>
      {displayMinutes}:{displaySeconds}
    </div>
  );
}

export default Timer;
