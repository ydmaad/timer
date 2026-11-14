import { useEffect, useRef, useCallback } from 'react';

function useAlarm(isAlarm) {
  const audioContextRef = useRef(null);

  // 일반 종료 알람
  const playAlarm = useCallback(() => {
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
  }, []);

  // 1분 전 은색 종소리
  const playOneMinuteBell = useCallback(() => {
    const audioContext = audioContextRef.current;

    if (!audioContext) return;

    const now = audioContext.currentTime;
    const frequencies = [1046.5, 2093, 3139.5];

    frequencies.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;

      const volume = [2, 1, 0.4][index];

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start(now);
      oscillator.stop(now + 1.05);
    });
  });

  // 알람 반복 실행
  useEffect(() => {
    if (!isAlarm) return;

    playAlarm();

    const alarm = setInterval(() => {
      playAlarm();
    }, 1000);

    return () => clearInterval(alarm);
  }, [isAlarm, playAlarm]);

  // AudioContext 준비
  const initAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  return {
    initAudio,
    playOneMinuteBell,
  };
}

export default useAlarm;
