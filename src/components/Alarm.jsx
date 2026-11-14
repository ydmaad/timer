function Alarm({ isAlarm, onStopAlarm }) {
  if (!isAlarm) return null;

  return (
    <div className="alarm-message">
      <p>⏰ 시간이 종료되었습니다!</p>
      <button onClick={onStopAlarm}>알람 끄기</button>
    </div>
  );
}

export default Alarm;
