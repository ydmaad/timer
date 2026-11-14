import { useState } from 'react';

function useTimeInput({ mode, setTime, setInitialTime, resetOneMinuteBell }) {
  const [minutes, setMinutes] = useState('10');
  const [seconds, setSeconds] = useState('00');

  // 시간 변경 공통 처리
  const updateInitialTime = (newMinutes, newSeconds) => {
    const total = Number(newMinutes || 0) * 60 + Number(newSeconds || 0);

    resetOneMinuteBell();
    setInitialTime(total);

    if (mode === 'down') {
      setTime(total);
    }
  };

  // 분 입력
  const handleMinutesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);

    setMinutes(value);
    updateInitialTime(value, seconds);
  };

  // 초 입력
  const handleSecondsChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);

    if (Number(value) > 59) return;

    setSeconds(value);
    updateInitialTime(minutes, value);
  };

  return {
    minutes,
    seconds,
    handleMinutesChange,
    handleSecondsChange,
  };
}

export default useTimeInput;
