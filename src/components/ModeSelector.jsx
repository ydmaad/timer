function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="mode">
      <button
        className={mode === 'up' ? 'active' : ''}
        onClick={() => onModeChange('up')}
      >
        카운트업
      </button>

      <button
        className={mode === 'down' ? 'active' : ''}
        onClick={() => onModeChange('down')}
      >
        카운트다운
      </button>
    </div>
  );
}

export default ModeSelector;
