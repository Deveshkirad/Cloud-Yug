import { Buffer } from 'buffer';
globalThis.Buffer = Buffer;
if (typeof window === 'undefined') {
    globalThis.window = self as any;
}

import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let detector: faceLandmarksDetection.FaceLandmarksDetector | null = null;

// Eye Aspect Ratio thresholds and counters
const EAR_THRESHOLD = 0.22;
let consecutiveLowEARFrames = 0;
let stressLevel = 0;

// EAR Utility
// p1...p6 match standard eye contour logic from MediaPipe: 
// 1 = left/right corner, 2/3 = top, 4 = right/left corner, 5/6 = bottom
function calculateEAR(eye: faceLandmarksDetection.Keypoint[]) {
    if (eye.length < 6) return 0;
    // Vertical distances
    const num1 = Math.sqrt(Math.pow(eye[1].x - eye[5].x, 2) + Math.pow(eye[1].y - eye[5].y, 2));
    const num2 = Math.sqrt(Math.pow(eye[2].x - eye[4].x, 2) + Math.pow(eye[2].y - eye[4].y, 2));
    // Horizontal distance
    const den = Math.sqrt(Math.pow(eye[0].x - eye[3].x, 2) + Math.pow(eye[0].y - eye[3].y, 2));
    return (num1 + num2) / (2.0 * den);
}

// MediaPipe Left Eye contour landmarks roughly correspond to these indices in 468 mesh
const LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380];

self.onmessage = async (e) => {
    const { type, payload } = e.data;

    if (type === 'INIT') {
        try {
            const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
            const detectorConfig = {
                runtime: 'tfjs',
                refineLandmarks: true,
            } as faceLandmarksDetection.MediaPipeFaceMeshTfjsModelConfig;

            detector = await faceLandmarksDetection.createDetector(model, detectorConfig);
            postMessage({ type: 'INIT_SUCCESS' });
        } catch (error) {
            postMessage({ type: 'INIT_ERROR', error: String(error) });
        }
    }

    if (type === 'PROCESS_FRAME') {
        if (!detector) {
            if (payload?.imageBitmap?.close) payload.imageBitmap.close();
            return;
        }

        try {
            const faces = await detector.estimateFaces(payload.imageBitmap);

            let eyeFatigue = false;

            if (faces.length > 0) {
                const face = faces[0];
                if (face.keypoints) {
                    const leftEye = LEFT_EYE_INDICES.map(idx => face.keypoints[idx]);
                    const rightEye = RIGHT_EYE_INDICES.map(idx => face.keypoints[idx]);

                    const leftEAR = calculateEAR(leftEye);
                    const rightEAR = calculateEAR(rightEye);

                    const avgEAR = (leftEAR + rightEAR) / 2.0;

                    if (avgEAR < EAR_THRESHOLD) {
                        consecutiveLowEARFrames++;
                        eyeFatigue = true;
                    } else {
                        // Relaxed
                        if (consecutiveLowEARFrames > 2) {
                            // Counted as a significant blink or squinting period
                            stressLevel += Math.min(consecutiveLowEARFrames * 0.5, 5);
                        }
                        consecutiveLowEARFrames = 0;

                        // Slowly decay stress when eyes are open normally
                        if (stressLevel > 0) stressLevel = Math.max(0, stressLevel - 0.1);
                    }
                }
            }

            postMessage({
                type: 'RESULTS',
                payload: {
                    eyeFatigue,
                    stressLevel: Math.floor(stressLevel)
                }
            });

        } catch (error) {
            console.error('Error processing frame:', error);
        } finally {
            if (payload?.imageBitmap?.close) {
                payload.imageBitmap.close();
            }
        }
    }
};
