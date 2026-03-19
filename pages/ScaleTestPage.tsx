import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getScaleById } from '../data/scales'
import { calculateAMS_RAI, calculateRCSS, calculateScores } from '../utils/scoring'
import { submitScale } from '../profileHelperApi'

const SESSION_KEYS = ['tashan_session_id', 'tashan_profile_session_id'] as const

function getStoredSessionId(): string | null {
  for (const key of SESSION_KEYS) {
    const value = localStorage.getItem(key)
    if (value) return value
  }
  return null
}

/** 娓叉煋 Mini-IPIP 娴嬭瘯缁撴灉 */
function IPIPResult({ scores }: { scores: Record<string, number> }) {
  const dims = [
    { id: 'E', label: '澶栧悜鎬? },
    { id: 'A', label: '瀹滀汉鎬? },
    { id: 'C', label: '灏借矗鎬? },
    { id: 'N', label: '绁炵粡璐? },
    { id: 'I', label: '寮€鏀炬€?鏅哄姏' },
  ]
  const levelLabel = (v: number) => {
    if (v >= 4.2) return '楂?
    if (v >= 2.8) return '涓?
    return '浣?
  }
  return (
    <div className="score-table">
      {dims.map((d) => (
        <div key={d.id} className="score-row">
          <span className="score-dim">{d.label}</span>
          <span className="score-val">
            {(scores[d.id] || 0).toFixed(2)}
            <span style={{ color: '#9ca3af', marginLeft: 4, fontSize: '0.8em' }}>
              锛坽levelLabel(scores[d.id] || 0)}锛?            </span>
          </span>
        </div>
      ))}
    </div>
  )
}

/** 娓叉煋 AMS 瀹屾暣 7 缁寸粨鏋?*/
function AMSResult({ scores }: { scores: Record<string, number> }) {
  const { intrinsicTotal, extrinsicTotal, RAI } = calculateAMS_RAI(scores)
  const dims = [
    { id: 'know',           label: '姹傜煡鍐呭湪鍔ㄦ満',     group: 'intrinsic' },
    { id: 'accomplishment', label: '鎴愬氨鍐呭湪鍔ㄦ満',     group: 'intrinsic' },
    { id: 'stimulation',    label: '浣撻獙鍒烘縺鍐呭湪鍔ㄦ満', group: 'intrinsic' },
    { id: 'identified',     label: '璁ゅ悓璋冭妭',         group: 'autonomous' },
    { id: 'introjected',    label: '鍐呮憚璋冭妭',         group: 'controlled' },
    { id: 'external',       label: '澶栭儴璋冭妭',         group: 'controlled' },
    { id: 'amotivation',    label: '鏃犲姩鏈?,           group: 'amotivation' },
  ]
  return (
    <>
      <div className="score-table">
        {dims.map((d) => (
          <div key={d.id} className="score-row">
            <span className="score-dim">{d.label}</span>
            <span className="score-val">{(scores[d.id] || 0).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="score-summary">
        <p>鍐呭湪鍔ㄦ満鎬诲垎锛歿intrinsicTotal}</p>
        <p>澶栧湪鍔ㄦ満鎬诲垎锛歿extrinsicTotal}</p>
        <p>
          鑷富鍔ㄦ満鎸囨暟 (RAI)锛?strong>{RAI}</strong>
        </p>
        <p style={{ fontSize: '0.8em', color: '#9ca3af' }}>
          RAI = 3脳姹傜煡 + 3脳鎴愬氨 + 3脳浣撻獙鍒烘縺 + 2脳璁ゅ悓 鈭?鍐呮憚 鈭?2脳澶栭儴 鈭?3脳鏃犲姩鏈?        </p>
      </div>
    </>
  )
}

export function ScaleTestPage() {
  const { scaleId } = useParams<{ scaleId: string }>()
  const navigate = useNavigate()
  const scale = scaleId ? getScaleById(scaleId) : undefined

  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [completed, setCompleted] = useState(false)
  const [saving, setSaving] = useState(false)

  const question = scale?.questions[currentIdx]
  const values = useMemo(() => {
    if (!scale) return []
    return Array.from({ length: scale.max_val - scale.min_val + 1 }, (_, i) => scale.min_val + i)
  }, [scale])

  if (!scale) {
    return (
      <div className="page-empty">
        <h2>閲忚〃涓嶅瓨鍦?/h2>
        <button type="button" className="btn-primary" onClick={() => navigate('/profile-helper/scales')}>
          杩斿洖閲忚〃鍒楄〃
        </button>
      </div>
    )
  }

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (currentIdx < scale.questions.length - 1) {
      setTimeout(() => {
        setCurrentIdx((idx) => Math.min(idx + 1, scale.questions.length - 1))
      }, 180)
      return
    }
    setTimeout(() => setCompleted(true), 180)
  }

  const goNext = () => {
    if (currentIdx < scale.questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      return
    }
    setCompleted(true)
  }

  const handleSave = async () => {
    const sessionId = getStoredSessionId()
    if (!sessionId) {
      alert('璇峰厛鍦ㄣ€屽璇濋噰闆嗐€嶉〉闈㈠缓绔嬩細璇?)
      return
    }

    const scores = calculateScores(scale, answers)
    const localKey = `profile_helper_scale_${scale.id}`
    const payload = {
      scaleId: scale.id,
      scaleName: scale.name,
      answers,
      scores,
      savedAt: new Date().toISOString(),
    }

    setSaving(true)
    try {
      await submitScale(sessionId, scale.id, answers, scores, payload)
      localStorage.setItem(localKey, JSON.stringify(payload))
      alert('閲忚〃缁撴灉宸蹭繚瀛?)
    } catch {
      localStorage.setItem(localKey, JSON.stringify(payload))
      alert('褰撳墠鍚庣鏈紑鍚噺琛ㄦ彁浜ゆ帴鍙ｏ紝缁撴灉宸叉湰鍦颁繚瀛?)
    } finally {
      setSaving(false)
    }
  }

  if (completed) {
    const scores = calculateScores(scale, answers)
    const rcss = scale.id === 'rcss' ? calculateRCSS(scores) : null
    const amsRai = scale.id === 'ams' ? calculateAMS_RAI(scores) : null

    return (
      <div className="scale-test-page">
        <div className="scale-result">
          <h2>{scale.name} 鈥?娴嬭瘯瀹屾垚</h2>

          {scale.id === 'rcss' && (
            <>
              <div className="score-table">
                {scale.dimensions.map((dim) => (
                  <div key={dim.id} className="score-row">
                    <span className="score-dim">{dim.name}</span>
                    <span className="score-val">{(scores[dim.id] || 0).toFixed(0)}</span>
                  </div>
                ))}
              </div>
              {rcss && (
                <div className="score-summary">
                  <p>妯悜鏁村悎鍒?(I)锛歿rcss.I}</p>
                  <p>鍨傜洿娣卞害鍒?(D)锛歿rcss.D}</p>
                  <p>
                    璁ょ煡椋庢牸鎸囨暟 (CSI)锛?strong>{rcss.CSI}</strong>
                  </p>
                  <p>
                    绫诲瀷锛?strong>{rcss.type}</strong>
                  </p>
                </div>
              )}
            </>
          )}

          {scale.id === 'mini-ipip' && <IPIPResult scores={scores} />}

          {scale.id === 'ams' && amsRai && <AMSResult scores={scores} />}

          <div className="scale-result-actions">
            <button type="button" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? '淇濆瓨涓?..' : '淇濆瓨缁撴灉'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/profile-helper/scales')}
            >
              杩斿洖閲忚〃鍒楄〃
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setCurrentIdx(0)
                setAnswers({})
                setCompleted(false)
              }}
            >
              閲嶆柊娴嬭瘯
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!question) return null

  const progress = (currentIdx / scale.questions.length) * 100

  return (
    <div className="scale-test-page">
      <div className="scale-test-container">
        <header className="scale-test-header">
          <h2>{scale.name}</h2>
          <p className="scale-instructions">{scale.instructions}</p>
        </header>

        <div className="scale-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            {currentIdx + 1} / {scale.questions.length}
          </span>
        </div>

        <div className="scale-question-card">
          <p className="scale-question-text">{question.text}</p>
          <div className="scale-rating-row">
            <span className="rating-end-label">{scale.min_label}</span>
            <div className="scale-rating-buttons">
              {values.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={`scale-rating-btn ${answers[question.id] === v ? 'selected' : ''}`}
                  onClick={() => handleAnswer(question.id, v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <span className="rating-end-label">{scale.max_label}</span>
          </div>
        </div>

        <div className="scale-nav">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
          >
            鈫?涓婁竴棰?          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={goNext}
            disabled={answers[question.id] == null}
          >
            {currentIdx === scale.questions.length - 1 ? '瀹屾垚' : '涓嬩竴棰?鈫?}
          </button>
        </div>
      </div>
    </div>
  )
}
