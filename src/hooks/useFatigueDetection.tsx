import { useEffect, useRef, useState, useCallback } from 'react';

import CVWorker from '../workers/cv-worker?worker';

export function useFatigueDetection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const [eyeFatigue, setEyeFatigue] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    workerRef.current = new CVWorker();
    workerRef.current.onmessage = (e) => {
      const { type, payload, error } = e.data;
      if (type === 'INIT_SUCCESS') {
        setIsLoaded(true);
      } else if (type === 'INIT_ERROR') {
        console.error('Worker init error:', error);
      } else if (type === 'RESULTS') {
        setStressLevel(payload.stressLevel || 0);
        setEyeFatigue(payload.eyeFatigue);
      }
    };

    workerRef.current.postMessage({ type: 'INIT' });

    return () => {
      workerRef.current?.terminate();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (videoRef.current) {
        document.body.removeChild(videoRef.current);
        videoRef.current = null;
      }
    };
  }, []);

  const processFrame = useCallback(async () => {
    if (!videoRef.current || !workerRef.current || !isLoaded) return;
    const video = videoRef.current;

    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

    try {
      const imageBitmap = await createImageBitmap(video);
      workerRef.current.postMessage({
        type: 'PROCESS_FRAME',
        payload: { imageBitmap }
      }, [imageBitmap]);
    } catch (err) {
      console.error('Failed to grab frame', err);
    }
  }, [isLoaded]);

  const startTracking = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, frameRate: { ideal: 30 } }
      });

      if (!videoRef.current) {
        const video = document.createElement('video');
        video.style.display = 'none';
        video.autoplay = true;
        videoRef.current = video;
        document.body.appendChild(video);
      }

      videoRef.current.srcObject = stream;

      await new Promise<void>((resolve) => {
        if (videoRef.current) {
          videoRef.current.oncanplay = () => resolve();
        }
      });

      setIsTracking(true);

      intervalRef.current = window.setInterval(processFrame, 2000);

    } catch (err: any) {
      console.error('Error accessing webcam:', err);
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setCameraError('Camera access denied. Please allow camera permissions in your browser settings.');
      } else if (err instanceof DOMException && err.name === 'NotFoundError') {
        setCameraError('No camera directly accessible. Ensure it is not in use by another app.');
      } else if (err.message && err.message.includes('secure context')) {
        setCameraError('Camera access requires a secure context (HTTPS) or localhost.');
      } else {
        setCameraError(err.message || 'Failed to access camera.');
      }
    }
  };

  const stopTracking = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsTracking(false);
    setStressLevel(0);
    setEyeFatigue(false);
  };

  return {
    isLoaded,
    isTracking,
    stressLevel,
    eyeFatigue,
    cameraError,
    startTracking,
    stopTracking
  };
}
