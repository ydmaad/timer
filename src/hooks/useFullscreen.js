import { useState, useEffect } from 'react';

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 전체 화면 상태 감지
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 전체 화면 전환
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  return {
    isFullscreen,
    toggleFullscreen,
  };
}

export default useFullscreen;
