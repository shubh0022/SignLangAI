import { useRef, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { API_BASE } from '../api'

const API_URL = `${API_BASE}/api/predict`

export default function WebcamCapture({ onPrediction, isRunning }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const handsRef = useRef(null)
  const cameraRef = useRef(null)
  const [fps, setFps] = useState(0)
  const [ready, setReady] = useState(false)
  const [handsDetected, setHandsDetected] = useState(0)
  const framesRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  const onResults = useCallback(async (results) => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!canvas || !video) return

    const W = video.videoWidth || 640
    const H = video.videoHeight || 480
    canvas.width = W
    canvas.height = H

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)
    ctx.save()
    ctx.translate(W, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(results.image, 0, 0, W, H)
    ctx.restore()

    const count = results.multiHandLandmarks?.length || 0
    setHandsDetected(count)

    if (count > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw connections
        if (window.drawConnectors && window.HAND_CONNECTIONS) {
          ctx.save()
          ctx.translate(W, 0)
          ctx.scale(-1, 1)
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
            color: 'rgba(34,211,238,0.7)',
            lineWidth: 3,
          })
          window.drawLandmarks(ctx, landmarks, {
            color: '#3b82f6',
            fillColor: 'rgba(34,211,238,0.9)',
            lineWidth: 1,
            radius: 5,
          })
          ctx.restore()
        }
      }

      // Send first hand to backend
      const lms = results.multiHandLandmarks[0].map(l => [l.x, l.y, l.z])
      try {
        const res = await axios.post(API_URL, { landmarks: lms })
        if (res.data?.gesture) onPrediction(res.data)
      } catch (_) {}
    }

    // FPS
    framesRef.current++
    const now = performance.now()
    if (now - lastTimeRef.current >= 1000) {
      setFps(framesRef.current)
      framesRef.current = 0
      lastTimeRef.current = now
    }
  }, [onPrediction])

  const initMediaPipe = useCallback(() => {
    if (!window.Hands) return
    const hands = new window.Hands({
      locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
    })
    hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.6, minTrackingConfidence: 0.5 })
    hands.onResults(onResults)
    handsRef.current = hands

    if (videoRef.current && window.Camera) {
      cameraRef.current = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current })
          }
        },
        width: 640,
        height: 480,
      })
    }
    setReady(true)
  }, [onResults])

  useEffect(() => {
    let tries = 0
    const poll = setInterval(() => {
      if (++tries > 40) clearInterval(poll)
      if (window.Hands && window.Camera) { clearInterval(poll); initMediaPipe() }
    }, 500)
    return () => clearInterval(poll)
  }, [initMediaPipe])

  useEffect(() => {
    if (!ready || !cameraRef.current) return
    if (isRunning) cameraRef.current.start()
    else { cameraRef.current.stop(); setHandsDetected(0); setFps(0) }
  }, [isRunning, ready])

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
      {/* Scan line overlay */}
      {isRunning && <div className="scan-line" />}

      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-0" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Idle state */}
      {!isRunning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712]/95">
          <div className="text-6xl mb-4 animate-bounce">🤟</div>
          <p className="text-gray-400 font-medium">Press <span className="text-cyan-400">Start Detection</span> to begin</p>
          <p className="text-gray-600 text-sm mt-2">Camera will activate automatically</p>
        </div>
      )}

      {/* Overlay HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className={`flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs font-mono border ${isRunning ? 'border-green-500/30 text-green-400' : 'border-gray-700 text-gray-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
          {isRunning ? `LIVE • ${fps} FPS` : 'OFFLINE'}
        </div>
        {handsDetected > 0 && (
          <div className="glass px-3 py-1.5 rounded-full text-xs font-mono text-cyan-400 border border-cyan-500/30">
            {handsDetected} hand{handsDetected > 1 ? 's' : ''} detected
          </div>
        )}
      </div>

      {/* Corner brackets (aesthetic) */}
      {isRunning && (
        <>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-sm" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-sm" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/60 rounded-br-sm" />
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-sm" />
        </>
      )}
    </div>
  )
}
