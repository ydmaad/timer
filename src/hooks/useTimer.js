import { useState, useEffect, useRef } from 'react';

function useTimer({ mode, initialTime, setIsAlarm, playOneMinuteBell }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const hasOneMinuteBellRef = useRef(false);

  // 타이머 실행
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      if (mode === 'up') {
        // 카운트업: 목표 시간 1분 전 종소리
        const warningTime = initialTime - 60;

        if (
          warningTime > 0 &&
          time < warningTime &&
          time + 1 >= warningTime &&
          !hasOneMinuteBellRef.current
        ) {
          hasOneMinuteBellRef.current = true;
          playOneMinuteBell();
        }

        // 목표 시간 도달 시 알람
        if (time + 1 === initialTime) {
          setIsAlarm(true);
        }

        // 목표 시간에 도달하지 않았다면 계속 증가
        setTime((prevTime) => prevTime + 1);
      } else {
        // 카운트다운: 1분 남았을 때 종소리
        if (
          (time === 60 || (time > 60 && time - 1 <= 60)) &&
          !hasOneMinuteBellRef.current
        ) {
          hasOneMinuteBellRef.current = true;
          playOneMinuteBell();
        }

        // 카운트다운 종료
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
  }, [isRunning, mode, time, initialTime, playOneMinuteBell, setIsAlarm]);

  // 1분 전 알림 초기화
  const resetOneMinuteBell = () => {
    hasOneMinuteBellRef.current = false;
  };

  return {
    time,
    setTime,
    isRunning,
    setIsRunning,
    resetOneMinuteBell,
  };
}

export default useTimer;
