function TimeInput({
  mode,
  minutes,
  seconds,
  isRunning,
  onMinutesChange,
  onSecondsChange,
}) {
  return (
    <div className="time-input">
      <span>{mode === 'up' ? '목표 시간' : '설정 시간'}</span>

      <input
        type="number"
        min="0"
        max="999"
        value={minutes}
        onChange={onMinutesChange}
        disabled={isRunning}
      />
      <span>분</span>

      <input
        type="number"
        min="0"
        max="59"
        value={seconds}
        onChange={onSecondsChange}
        disabled={isRunning}
      />
      <span>초</span>
    </div>
  );
}

export default TimeInput;
