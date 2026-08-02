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
  const isProcessingRef = useRef(false)
  const lastRequestTimeRef = useRef(0)

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

    const now = performance.now()

    if (count > 0) {
      for (const landmarks of results.multiHandLandmarks) {
        // Draw connections in 2026 Azure & Crisp White
        if (window.drawConnectors && window.HAND_CONNECTIONS) {
          ctx.save()
          ctx.translate(W, 0)
          ctx.scale(-1, 1)
          window.drawConnectors(ctx, landmarks, window.HAND_CONNECTIONS, {
            color: 'rgba(56, 189, 248, 0.85)',
            lineWidth: 2.5,
          })
          window.drawLandmarks(ctx, landmarks, {
            color: '#13151F',
            fillColor: '#FFFFFF',
            lineWidth: 1.5,
            radius: 4,
          })
          ctx.restore()
        }
      }

      // Send first hand to backend with throttling (max 1 request per 150ms)
      if (!isProcessingRef.current && (now - lastRequestTimeRef.current >= 150)) {
        isProcessingRef.current = true
        lastRequestTimeRef.current = now

        const lms = results.multiHandLandmarks[0].map(l => [l.x, l.y, l.z])
        axios.post(API_URL, { landmarks: lms })
          .then(res => {
            if (res.data?.gesture) onPrediction(res.data)
          })
          .catch(() => {})
          .finally(() => {
            isProcessingRef.current = false
          })
      }
    }

    // FPS
    framesRef.current++
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
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#13151F] border border-white/10 shadow-2xl">
      {/* Scan line overlay */}
      {isRunning && <div className="scan-line" />}

      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-0" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />

      {/* Idle state */}
      {!isRunning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#13151F]">
          <div className="text-6xl mb-4 text-sky-400 animate-pulse">🤟</div>
          <p className="text-white font-medium">Click <span className="text-sky-400 font-bold underline">Start Detection</span> to launch neural vision</p>
          <p className="text-slate-400 text-sm mt-2">MediaPipe landmark tracking will activate</p>
        </div>
      )}

      {/* Overlay HUD */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <div className={`flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs font-mono border ${isRunning ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' : 'border-white/10 text-slate-400 bg-white/5'}`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          {isRunning ? `LIVE • ${fps} FPS` : 'OFFLINE'}
        </div>
        {handsDetected > 0 && (
          <div className="glass px-3.5 py-1.5 rounded-full text-xs font-mono text-sky-300 border border-sky-500/30 bg-sky-500/10">
            {handsDetected} hand{handsDetected > 1 ? 's' : ''} tracked
          </div>
        )}
      </div>

      {/* Corner reticles */}
      {isRunning && (
        <>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-sky-400/70 rounded-tr-sm" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-sky-400/70 rounded-bl-sm" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-sky-400/70 rounded-br-sm" />
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-sky-400/70 rounded-tl-sm" />
        </>
      )}
    </div>
  )
}


