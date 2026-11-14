export const playAlarm = (audioContext) => {
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

export const playOneMinuteBell = (audioContext) => {
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const frequencies = [1046.5, 2093, 3139.5];
  const volumes = [2, 1, 0.4];

  frequencies.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(volumes[index], now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 1.05);
  });
};
