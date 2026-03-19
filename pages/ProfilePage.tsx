import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProfile, getStructuredProfile, publishTwin } from '../profileHelperApi'
import type { StructuredProfile } from '../types'
import { ProfileHeader } from '../components/profile/ProfileHeader'
import { CapabilitySection } from '../components/profile/CapabilitySection'
import { NeedsSection } from '../components/profile/NeedsSection'
import { CognitiveStyleSection } from '../components/profile/CognitiveStyleSection'
import { MotivationSection } from '../components/profile/MotivationSection'
import { PersonalitySection } from '../components/profile/PersonalitySection'
import { InterpretationSection } from '../components/profile/InterpretationSection'
import { ScientistMatchSection } from '../components/ScientistMatchSection'
import { authApi, DigitalTwinDetail, DigitalTwinRecord, tokenManager } from '../../../api/auth'
import ReactMarkdown from 'react-markdown'

// 鈹€鈹€ 宸ュ叿鍑芥暟 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const SESSION_KEYS = ['tashan_session_id', 'tashan_profile_session_id'] as const
const PLACEHOLDER_NAMES = /^(unnamed(-\d{4}-\d{2}-\d{2})?|鏈懡鍚峾forum_profile|璁哄潧鐢诲儚|identity)$/i

function isPlaceholderDisplayName(name: string | null | undefined): boolean {
  if (!name?.trim()) return true
  return PLACEHOLDER_NAMES.test(name.trim())
}

function getStoredSessionId(): string | null {
  for (const key of SESSION_KEYS) {
    const value = localStorage.getItem(key)
    if (!value) continue
    const normalized = value.trim().toLowerCase()
    if (!normalized || normalized === 'undefined' || normalized === 'null' || normalized === 'none') continue
    return value
  }
  return null
}

// 鈹€鈹€ 涓荤粍浠?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export function ProfilePage() {
  const [structured, setStructured] = useState<StructuredProfile | null>(null)
  const [forumProfile, setForumProfile] = useState('')
  // TopicLab 鐙湁锛氬彂甯?鍘嗗彶璁板綍
  const [digitalTwins, setDigitalTwins] = useState<DigitalTwinRecord[]>([])
  const [publishName, setPublishName] = useState('')
  const [publishVisibility, setPublishVisibility] = useState<'private' | 'public'>('private')
  const [publishExposure, setPublishExposure] = useState<'brief' | 'full'>('brief')
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<string | null>(null)
  const [selectedTwinAgent, setSelectedTwinAgent] = useState<string | null>(null)
  const [selectedTwinDetail, setSelectedTwinDetail] = useState<DigitalTwinDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sessionId = getStoredSessionId()

  const handleSelectTwin = useCallback(async (agentName: string) => {
    const token = tokenManager.get()
    if (!token) return
    setSelectedTwinAgent(agentName)
    setDetailLoading(true)
    setDetailError(null)
    try {
      const detail = await authApi.getDigitalTwinDetail(token, agentName)
      setSelectedTwinDetail(detail.digital_twin)
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : String(e))
      setSelectedTwinDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }

    Promise.all([
      getStructuredProfile(sessionId),
      getProfile(sessionId),
      // TopicLab 鐙湁锛歞igital twins锛堝け璐ユ椂闈欓粯闄嶇骇涓虹┖鍒楄〃锛?      (() => {
        const token = tokenManager.get()
        if (!token) return Promise.resolve<{ digital_twins: DigitalTwinRecord[] }>({ digital_twins: [] })
        return authApi.getDigitalTwins(token).catch(() => ({ digital_twins: [] as DigitalTwinRecord[] }))
      })(),
    ])
      .then(([sp, raw, twinsData]) => {
        setStructured(sp)
        setForumProfile(raw.forum_profile)
        const twins = twinsData.digital_twins || []
        setDigitalTwins(twins)
        const firstName = twins[0]?.display_name
        if (firstName && !isPlaceholderDisplayName(firstName)) {
          setPublishName(firstName)
        } else {
          setPublishName('鎴戠殑鏁板瓧鍒嗚韩')
        }
        if (twins[0]?.agent_name) void handleSelectTwin(twins[0].agent_name)
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false))
  }, [handleSelectTwin, sessionId])

  // 鈹€鈹€ 瀹堝崼鏉′欢 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

  if (loading) return <div className="page-loading">鍔犺浇涓?..</div>

  if (!sessionId) {
    return (
      <div className="page-empty">
        <h2>灏氭湭寤虹珛鍒嗚韩</h2>
        <p>璇峰厛鍦ㄣ€屽璇濋噰闆嗐€嶉〉闈㈠畬鎴愬熀纭€淇℃伅閲囬泦銆?/p>
        <Link to="/profile-helper" className="btn-primary">寮€濮嬪垱寤?/Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-empty">
        <h2>鍔犺浇鐢诲儚澶辫触</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</p>
        <p>璇峰皾璇曞埛鏂伴〉闈紝鎴栭噸鏂拌繘鍏ュ璇濋〉闈€?/p>
        <Link to="/profile-helper" className="btn-primary">杩斿洖瀵硅瘽</Link>
      </div>
    )
  }

  if (!structured) return <div className="page-loading">瑙ｆ瀽涓?..</div>

  // 鈹€鈹€ TopicLab 鐙湁锛氬彂甯?鍘嗗彶 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

  const refreshTwinRecords = async () => {
    const token = tokenManager.get()
    if (!token) return
    const data = await authApi.getDigitalTwins(token)
    const twins = data.digital_twins || []
    setDigitalTwins(twins)
    if (!twins.length) {
      setSelectedTwinAgent(null)
      setSelectedTwinDetail(null)
      return
    }
    const targetAgent =
      selectedTwinAgent && twins.some((item) => item.agent_name === selectedTwinAgent)
        ? selectedTwinAgent
        : twins[0].agent_name
    await handleSelectTwin(targetAgent)
  }

  const handlePublish = async () => {
    if (!sessionId) return
    const displayName = publishName.trim() || '鎴戠殑鏁板瓧鍒嗚韩'
    setPublishing(true)
    setPublishResult(null)
    try {
      const result = await publishTwin({
        session_id: sessionId,
        display_name: displayName,
        visibility: publishVisibility,
        exposure: publishExposure,
      })
      await refreshTwinRecords()
      setPublishResult(`鍙戝竷鎴愬姛锛?{result.display_name}锛?{result.visibility} / ${result.exposure}锛塦)
    } catch (e) {
      setPublishResult(`鍙戝竷澶辫触锛?{e instanceof Error ? e.message : String(e)}`)
    } finally {
      setPublishing(false)
    }
  }

  // 鈹€鈹€ 娓叉煋 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

  return (
    <div className="pv-page">

      {/* 鈹€鈹€ 1. 缁撴瀯鍖栫敾鍍忕淮搴︼紙瀵归綈 digital-twin-bootstrap锛夆攢鈹€ */}
      <ProfileHeader profile={structured} />
      <CapabilitySection capability={structured.capability} />
      <NeedsSection needs={structured.needs} />
      <CognitiveStyleSection data={structured.cognitive_style} />
      <MotivationSection data={structured.motivation} />
      <PersonalitySection data={structured.personality} />
      <InterpretationSection data={structured.interpretation} />
      <ScientistMatchSection sessionId={sessionId} />

      {/* 鈹€鈹€ 2. 浠栧北璁哄潧鍒嗚韩锛堝師濮?Markdown锛夆攢鈹€ */}
      {forumProfile && (
        <section className="pv-section">
          <h3 className="pv-section-title">浠栧北璁哄潧鍒嗚韩</h3>
          <div className="pv-forum-body">
            <ReactMarkdown>{forumProfile}</ReactMarkdown>
          </div>
        </section>
      )}

      {/* 鈹€鈹€ 3. 搴曢儴鎿嶄綔鏍?鈹€鈹€ */}
      <div className="pv-bottom-bar no-print">
        <button type="button" className="btn-secondary" onClick={() => window.print()}>
          瀵煎嚭 PDF锛堟墦鍗帮級
        </button>
        <a
          href={`${import.meta.env.BASE_URL}api/profile-helper/download/${sessionId}`}
          download="profile.md"
          className="btn-secondary"
        >
          涓嬭浇绉戠爺鍒嗚韩
        </a>
        {forumProfile && (
          <a
            href={`${import.meta.env.BASE_URL}api/profile-helper/download/${sessionId}/forum`}
            download="forum-profile.md"
            className="btn-secondary"
          >
            涓嬭浇璁哄潧鍒嗚韩
          </a>
        )}
        <Link to="/profile-helper/scales" className="btn-secondary">
          閲忚〃鏍″
        </Link>
      </div>

      {/* 鈹€鈹€ 4. TopicLab 鐙湁锛氳处鍙风郴缁熺姸鎬佹í骞?鈹€鈹€ */}
      {digitalTwins.length > 0 ? (
        <div className="twin-record-banner">
          宸茶褰曞埌璐﹀彿绯荤粺锛歿digitalTwins[0].display_name || digitalTwins[0].agent_name}
          {digitalTwins[0].updated_at
            ? `锛堟渶杩戞洿鏂帮細${new Date(digitalTwins[0].updated_at).toLocaleString()}锛塦
            : ''}
        </div>
      ) : (
        <div className="twin-record-banner twin-record-banner-pending">
          灏氭湭璁板綍鍒拌处鍙风郴缁熸暟鎹簱锛屽畬鎴愬彂甯冨悗浼氳嚜鍔ㄥ啓鍏ャ€?        </div>
      )}

      {/* 鈹€鈹€ 5. TopicLab 鐙湁锛氬彂甯冨叆搴?鈹€鈹€ */}
      <section className="twin-publish-card">
        <h3>鍙戝竷涓庡叆搴?/h3>
        <div className="twin-publish-grid">
          <label className="twin-publish-field">
            <span>鍒嗚韩鍚嶇О</span>
            <input
              value={publishName}
              onChange={(e) => setPublishName(e.target.value)}
              placeholder="璇疯緭鍏ュ垎韬悕绉?
            />
          </label>
          <label className="twin-publish-field">
            <span>鍙鎬?/span>
            <select
              value={publishVisibility}
              onChange={(e) => setPublishVisibility(e.target.value as 'private' | 'public')}
            >
              <option value="private">绉佹湁</option>
              <option value="public">鍏紑锛堝彲鍏变韩锛?/option>
            </select>
          </label>
          <label className="twin-publish-field">
            <span>鍙戝竷鍐呭</span>
            <select
              value={publishExposure}
              onChange={(e) => setPublishExposure(e.target.value as 'brief' | 'full')}
            >
              <option value="brief">绠€浠嬬増</option>
              <option value="full">瀹屾暣鐗?/option>
            </select>
          </label>
        </div>
        <div className="twin-publish-actions">
          <button type="button" className="btn-primary" onClick={handlePublish} disabled={publishing}>
            {publishing ? '鍙戝竷涓?..' : '鏀瑰悕骞跺彂甯冨埌缃戠珯'}
          </button>
          {publishResult && <p className="twin-publish-result">{publishResult}</p>}
        </div>
      </section>

      {/* 鈹€鈹€ 6. TopicLab 鐙湁锛氬巻鍙插垎韬褰?鈹€鈹€ */}
      <section className="twin-history-card">
        <div className="twin-history-header">
          <h3>鍘嗗彶鍒嗚韩璁板綍</h3>
          <span>{digitalTwins.length} 鏉?/span>
        </div>
        {digitalTwins.length === 0 ? (
          <div className="twin-history-empty">鏆傛棤鍘嗗彶鍒嗚韩璁板綍锛屽彂甯冨悗灏嗚嚜鍔ㄥ啓鍏ユ暟鎹簱銆?/div>
        ) : (
          <div className="twin-history-layout">
            <div className="twin-history-list">
              {digitalTwins.map((item) => {
                const isActive = item.agent_name === selectedTwinAgent
                const isShared = item.visibility === 'public'
                return (
                  <button
                    key={item.agent_name}
                    type="button"
                    className={`twin-history-item ${isActive ? 'active' : ''}`}
                    onClick={() => void handleSelectTwin(item.agent_name)}
                  >
                    <div className="twin-history-item-title">{item.display_name || item.agent_name}</div>
                    <div className="twin-history-item-meta">
                      <span className={`twin-status-badge ${isShared ? 'shared' : 'private'}`}>
                        {isShared ? '鍏变韩' : '绉佹湁'}
                      </span>
                      <span>
                        {item.updated_at ? new Date(item.updated_at).toLocaleString() : '鏃犳洿鏂版椂闂?}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <div className="twin-history-detail">
              {!selectedTwinAgent ? (
                <div className="twin-history-empty">璇烽€夋嫨宸︿晶鍒嗚韩鏌ョ湅璇︽儏銆?/div>
              ) : detailLoading ? (
                <div className="twin-history-empty">璇︽儏鍔犺浇涓?..</div>
              ) : detailError ? (
                <div className="twin-history-empty">鍔犺浇璇︽儏澶辫触锛歿detailError}</div>
              ) : selectedTwinDetail ? (
                <>
                  <h4>{selectedTwinDetail.display_name || selectedTwinDetail.agent_name}</h4>
                  <div className="twin-history-detail-meta">
                    鐘舵€侊細{selectedTwinDetail.visibility === 'public' ? '鍏变韩' : '绉佹湁'} / 鍐呭锛?                    {selectedTwinDetail.exposure === 'full' ? '瀹屾暣鐗? : '绠€浠嬬増'}
                  </div>
                  <div className="twin-history-detail-meta">
                    鏈€鍚庢洿鏂版椂闂达細
                    {selectedTwinDetail.updated_at
                      ? new Date(selectedTwinDetail.updated_at).toLocaleString()
                      : '鏆傛棤'}
                  </div>
                  <pre className="twin-history-detail-content">
                    {selectedTwinDetail.role_content?.trim() || '璇ヨ褰曟殏鏃犺鎯呭唴瀹广€?}
                  </pre>
                </>
              ) : (
                <div className="twin-history-empty">鏆傛棤鍙睍绀鸿鎯呫€?/div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
