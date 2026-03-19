import { useState, useRef, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageBubble } from './MessageBubble'
import { LoadingDots, RobotAvatar } from './LoadingDots'
import { BlockRenderer } from './blocks/BlockRenderer'
import {
  getOrCreateSession,
  sendMessageBlocks,
  resetSession,
  getProfile,
} from './profileHelperApi'
import type { Block, ChatMessage } from './types'
import { PROFILE_HELPER_MODELS } from '../../api/client'
import { refreshCurrentUserProfile, tokenManager, User } from '../../api/auth'
import { toast } from '../../utils/toast'

const SESSION_KEYS = ['tashan_session_id', 'tashan_profile_session_id'] as const

function getStoredSessionId(): string | null {
  for (const key of SESSION_KEYS) {
    const value = localStorage.getItem(key)
    if (value) return value
  }
  return null
}

function setStoredSessionId(id: string) {
  for (const key of SESSION_KEYS) {
    localStorage.setItem(key, id)
  }
}

/** 鍒ゆ柇娑堟伅鏄惁鍚湁浜や簰鍨?Block锛坈hoice/text_input/rating锛?*/
function hasInteractiveBlock(blocks: Block[]): boolean {
  return blocks.some((b) => b.type === 'choice' || b.type === 'text_input' || b.type === 'rating')
}

/**
 * 杈撳叆妗嗛攣瀹氱姸鎬侊細
 * - 'initial'锛氱┖浼氳瘽锛屾樉绀哄浐瀹氭枃鏈?寤虹珛鎴戠殑鍒嗚韩"锛屽彧璇伙紝鍙兘鍙戦€? * - 'locked'锛氭渶鍚庝竴鏉″姪鎵嬫秷鎭惈 choice/rating锛岃緭鍏ユ鍙樻祬绂佺敤
 * - 'active'锛氭甯稿彲杈撳叆锛堢函鏂囨湰鍥炲銆乼ext_input 鍧椼€乧opyable 绛夛級
 */
type InputLockState = 'initial' | 'locked' | 'active'

function getInputLockState(messages: ChatMessage[]): InputLockState {
  if (messages.length === 0) return 'initial'

  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role === 'assistant') {
      const blocks = m.blocks ?? []
      if (blocks.length === 0) return 'active'
      const hasChoice = blocks.some((b) => b.type === 'choice')
      const hasRating = blocks.some((b) => b.type === 'rating')
      // choice/rating 瀛樺湪 鈫?閿佸畾锛堝嵆浣垮悓鏃舵湁 text_input 涔熼攣瀹氾級
      if (hasChoice || hasRating) return 'locked'
      // 鍙湁 text_input / text / copyable / actions 鈫?鍙緭鍏?      return 'active'
    }
  }
  return 'active'
}

const INIT_MESSAGE = '寤虹珛鎴戠殑鍒嗚韩'

export function ChatWindow() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [, setProfile] = useState('')
  const [, setForumProfile] = useState('')
  const [input, setInput] = useState(INIT_MESSAGE)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>(PROFILE_HELPER_MODELS[0]?.value ?? '')
  const [isComposing, setIsComposing] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()

  /**
   * requireCurrentUser锛?   * - 鏈夌櫥褰曠敤鎴?鈫?濮嬬粓閫氳繃
   * - 鏃犵櫥褰曠敤鎴蜂絾 sessionId 瀛樺湪 鈫?鍖垮悕妯″紡閫氳繃锛圓UTH_MODE=none 鍦烘櫙锛?   * - 鏃犵櫥褰?+ 鏃?session 鈫?鎻愮ず鐧诲綍
   */
  const requireCurrentUser = useCallback(() => {
    if (currentUser) return true
    if (sessionId) return true      // 鍖垮悕 session 宸插缓绔嬶紝鍏佽浜や簰
    toast.error('璇峰厛鐧诲綍鍚庡啀涓庢暟瀛楀垎韬姪鎵嬪璇?)
    return false
  }, [currentUser, sessionId])

  const fetchProfile = useCallback(async (sid: string) => {
    try {
      const data = await getProfile(sid)
      setProfile(data.profile)
      setForumProfile(data.forum_profile)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    async function init() {
      // 鈹€鈹€ 1. 灏濊瘯璁よ瘉锛堝彲閫夛紝澶辫触闄嶇骇涓哄尶鍚嶏級鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
      let user: import('../../api/auth').User | null = null
      const token = tokenManager.get()
      if (token) {
        try {
          user = await refreshCurrentUserProfile()
        } catch {
          // auth 鏈嶅姟涓嶅彲鐢紙濡?topiclab-backend 鏈惎鍔級锛岄檷绾т负鍖垮悕妯″紡
        }
      }
      setCurrentUser(user)

      // 鈹€鈹€ 2. 濮嬬粓鍒涘缓 session锛堟棤璁烘槸鍚﹀凡鐧诲綍锛夆攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€
      // AUTH_MODE=none 鏃跺悗绔帴鍙楀尶鍚嶈姹傦紝鍓嶇鏃犻渶鐧诲綍鍗冲彲浣跨敤 profile helper
      try {
        const stored = getStoredSessionId()
        const id = await getOrCreateSession(stored ?? undefined)
        setSessionId(id)
        setStoredSessionId(id)
        await fetchProfile(id)
      } catch {
        // 鍚庣涓嶅彲杈撅紝session 鍒涘缓澶辫触锛堜繚鎸?sessionId = null锛?      } finally {
        setInitialized(true)
      }
    }
    init()
  }, [fetchProfile])

  /** 浠?localStorage 鎭㈠鍘嗗彶娑堟伅锛屾湁鍘嗗彶鍒欐竻绌哄垵濮嬭緭鍏ユ枃瀛?*/
  useEffect(() => {
    if (!sessionId) return
    try {
      const raw = localStorage.getItem(`profile_helper_chat_${sessionId}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          setInput('')   // 鏈夊巻鍙叉秷鎭椂娓呯┖鍒濆鍥哄畾鏂囧瓧
        }
      }
    } catch {
      // ignore
    }
  }, [sessionId])

  /** 鍚屾娑堟伅鍒?localStorage */
  useEffect(() => {
    if (!sessionId) return
    try {
      localStorage.setItem(`profile_helper_chat_${sessionId}`, JSON.stringify(messages))
    } catch {
      // ignore
    }
  }, [sessionId, messages])

  /**
   * 婊氬姩绛栫暐锛?   * - 鏈夌敤鎴锋秷鎭?鈫?璁╂渶鍚庝竴鏉＄敤鎴锋秷鎭创杩戝鍣ㄩ《閮紙AI 鍥炲鍦ㄤ笅鏂瑰彲瑙侊級
   * - 鏃犵敤鎴锋秷鎭?鈫?婊氬埌搴曢儴
   *
   * MessageBubble 宸叉湁 data-role="user"锛岀洿鎺ユ煡璇紝鏃犻渶棰濆鍖呰９ div銆?   * 鐢?requestAnimationFrame 纭繚 DOM 瀹屾垚娓叉煋鍚庡啀璁＄畻浣嶇疆銆?   */
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    requestAnimationFrame(() => {
      // MessageBubble 鑷甫 data-role 灞炴€э紙see MessageBubble.tsx锛?      const userMsgs = container.querySelectorAll('[data-role="user"]')
      const lastUserEl = userMsgs[userMsgs.length - 1] as HTMLElement | undefined

      if (lastUserEl) {
        // 閬嶅巻 offsetParent 閾捐绠楃浉瀵瑰鍣ㄧ殑缁濆鍋忕Щ锛屾瘮 getBoundingClientRect 鏇寸ǔ
        let offsetTop = 0
        let cur: HTMLElement | null = lastUserEl
        while (cur && cur !== container) {
          offsetTop += cur.offsetTop
          cur = cur.offsetParent as HTMLElement | null
        }
        container.scrollTop = Math.max(0, offsetTop - 16)
      } else {
        container.scrollTop = container.scrollHeight
      }
    })
  }, [messages])

  const handleSubmit = async () => {
    if (!requireCurrentUser()) return
    const text = input.trim()
    if (!text || !sessionId || loading) return

    setInput('')
    const userMsg: ChatMessage = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    // 鍏堝姞涓€涓┖鐨?assistant 鍗犱綅
    const placeholderMsg: ChatMessage = { role: 'assistant', blocks: [] }
    setMessages((prev) => [...prev, placeholderMsg])

    const collectedBlocks: Block[] = []

    try {
      await sendMessageBlocks(sessionId, text, (block) => {
        collectedBlocks.push(block)
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            next[next.length - 1] = { ...last, blocks: [...collectedBlocks] }
          }
          return next
        })
      }, selectedModel || undefined)
      await fetchProfile(sessionId)
    } catch (e) {
      const errText = `璇锋眰澶辫触: ${e instanceof Error ? e.message : String(e)}`
      setMessages((prev) => {
        const next = [...prev]
        const last = next[next.length - 1]
        if (last?.role === 'assistant') {
          next[next.length - 1] = {
            role: 'assistant',
            blocks: [{ type: 'text', content: errText }],
          }
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  /** 褰撶敤鎴风偣鍑?Block 涓殑浜や簰缁勪欢鏃讹紝鑷姩浣滀负鏂版秷鎭彂閫?*/
  const handleBlockRespond = useCallback(
    async (msgIndex: number, responseText: string, blockId?: string) => {
      // Block 绾ф爣璁帮細鍙鐢ㄦ湰娆＄偣鍑荤殑 block锛屽叾浣?block 淇濇寔鍙敤
      setMessages((prev) => {
        const next = [...prev]
        const msg = next[msgIndex]
        if (msg?.role === 'assistant') {
          const respondedBlocks = [...(msg._responded_blocks ?? [])]
          if (blockId && !respondedBlocks.includes(blockId)) {
            respondedBlocks.push(blockId)
          }
          // 妫€鏌ヨ娑堟伅鍐呮墍鏈変氦浜掑瀷 block 鏄惁閮藉凡鍝嶅簲锛堝悜鍚庡吋瀹?_responded锛?          const interactiveIds = (msg.blocks ?? [])
            .filter((b) => b.type === 'choice' || b.type === 'rating' || b.type === 'text_input')
            .map((b) => ('id' in b ? (b as { id: string }).id : ''))
            .filter(Boolean)
          const allResponded = interactiveIds.length > 0 && interactiveIds.every((id) => respondedBlocks.includes(id))
          next[msgIndex] = { ...msg, _responded_blocks: respondedBlocks, _responded: allResponded }
        }
        return next
      })
      setInput(responseText)
      // 鑷姩鍙戦€?      if (!requireCurrentUser() || !sessionId || loading) return
      setLoading(true)

      const userMsg: ChatMessage = { role: 'user', content: responseText }
      setMessages((prev) => [...prev, userMsg])
      const placeholderMsg: ChatMessage = { role: 'assistant', blocks: [] }
      setMessages((prev) => [...prev, placeholderMsg])
      setInput('')

      const collectedBlocks: Block[] = []
      try {
        await sendMessageBlocks(sessionId, responseText, (block) => {
          collectedBlocks.push(block)
          setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === 'assistant') {
              next[next.length - 1] = { ...last, blocks: [...collectedBlocks] }
            }
            return next
          })
        }, selectedModel || undefined)
        await fetchProfile(sessionId)
      } catch (e) {
        const errText = `璇锋眰澶辫触: ${e instanceof Error ? e.message : String(e)}`
        setMessages((prev) => {
          const next = [...prev]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') {
            next[next.length - 1] = {
              role: 'assistant',
              blocks: [{ type: 'text', content: errText }],
            }
          }
          return next
        })
      } finally {
        setLoading(false)
      }
    },
    [sessionId, loading, selectedModel, requireCurrentUser, fetchProfile]
  )

  const handleReset = async () => {
    if (!requireCurrentUser() || !sessionId) return
    try {
      await resetSession(sessionId)
      setMessages([])
      setInput(INIT_MESSAGE)   // 閲嶇疆鍚庢仮澶嶅浐瀹氬垵濮嬫枃鏈?      await fetchProfile(sessionId)
      inputRef.current?.focus()
    } catch (e) {
      alert(`閲嶇疆澶辫触: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const showLoadingDots =
    loading &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === 'assistant' &&
    (messages[messages.length - 1]?.blocks?.length ?? 0) === 0

  const lockState: InputLockState = loading ? 'locked' : getInputLockState(messages)
  const isInitial = lockState === 'initial'
  const isLocked = lockState === 'locked'
  // initial 鐘舵€佺殑鏄剧ず鍊煎浐瀹氫负 INIT_MESSAGE锛沴ocked/active 浣跨敤 input state
  const textareaValue = isInitial ? INIT_MESSAGE : input
  const textareaPlaceholder = isLocked ? '璇蜂粠涓婃柟閫夐」涓綔绛? : '杈撳叆娑堟伅...'

  if (!initialized) {
    return <div className="chat-loading">鍔犺浇涓?..</div>
  }

  return (
    <div className="chat-layout">
      <div className="chat-window">
        <div ref={messagesContainerRef} className="messages">
          {messages.length === 0 && (
            <div className="welcome">
              <p>浣犲ソ锛屾垜鏄鐮旀暟瀛楀垎韬噰闆嗗姪鎵嬨€?/p>
              <p>鍙互璇淬€屽府鎴戝缓绔嬪垎韬€嶅紑濮嬨€?/p>
            </div>
          )}
          {messages
            .filter((m, i) => {
              // 杩囨护鎺夋渶鍚庝竴鏉＄┖鍗犱綅 assistant 娑堟伅锛堟鍦ㄥ姞杞芥椂锛?              if (
                showLoadingDots &&
                i === messages.length - 1 &&
                m.role === 'assistant' &&
                (m.blocks?.length ?? 0) === 0
              ) return false
              return true
            })
            .map((m, i) => {
              if (m.role === 'user') {
                // MessageBubble 鑷甫 data-role="user"锛屼緵婊氬姩閫昏緫鏌ヨ
                return <MessageBubble key={i} role="user" content={m.content ?? ''} />
              }
              // assistant: blocks 妯″紡
              if (m.blocks && m.blocks.length > 0) {
                const isLatest = i === messages.length - 1
                const isInteractive = hasInteractiveBlock(m.blocks)
                const respondedBlocks = m._responded_blocks ?? []
                return (
                  <div key={i} className="message-row assistant-row">
                    <RobotAvatar />
                    <div className="assistant-blocks">
                      {m.blocks.map((block, bi) => {
                        // Block 绾у搷搴旂姸鎬侊細姣忎釜 block 鐙珛鍒ゆ柇鏄惁宸茶鍥炵瓟
                        const blockId = 'id' in block ? (block as { id: string }).id : undefined
                        const isBlockResponded = blockId
                          ? respondedBlocks.includes(blockId)
                          : !!m._responded
                        return (
                          <BlockRenderer
                            key={bi}
                            block={block}
                            onRespond={(text) => handleBlockRespond(i, text, blockId)}
                            disabled={loading || (isInteractive && (!isLatest || isBlockResponded))}
                            responded={isBlockResponded}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              }
              // 鏃у紡绾枃鏈紙backward compat锛?              return <MessageBubble key={i} role="assistant" content={m.content ?? ''} />
            })}
          {showLoadingDots && (
            <div className="loading-message-row">
              <RobotAvatar />
              <div className="message-bubble assistant loading-bubble">
                <LoadingDots />
              </div>
            </div>
          )}
        </div>

        <form
          className="chat-input-container"
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="chat-input-inner">
            {!currentUser && !sessionId ? (
              // 鏃㈡湭鐧诲綍銆佸張鏃犲尶鍚?session锛堝悗绔笉鍙揪锛夆啋 鎵嶆彁绀虹櫥褰?              <div className="chat-login-prompt">
                <p>璇峰厛鐧诲綍鍚庡啀涓庢暟瀛楀垎韬姪鎵嬪璇?/p>
                <Link to="/login" state={{ from: '/profile-helper' }} className="chat-login-link">
                  鍘荤櫥褰?                </Link>
              </div>
            ) : (
              <>
                <div className="chat-input-row">
                  <div className="chat-input-wrapper">
                    <textarea
                      ref={inputRef}
                      value={textareaValue}
                      readOnly={isInitial || isLocked}
                      onChange={(e) => {
                        if (isInitial || isLocked) return
                        setInput(e.target.value)
                      }}
                      onKeyDown={(e) => {
                        if (isInitial || isLocked) { e.preventDefault(); return }
                        if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
                          e.preventDefault()
                          handleSubmit()
                        }
                      }}
                      onCompositionStart={() => setIsComposing(true)}
                      onCompositionEnd={() => setIsComposing(false)}
                      placeholder={textareaPlaceholder}
                      rows={3}
                      className={`chat-textarea${isLocked ? ' chat-textarea--locked' : ''}${isInitial ? ' chat-textarea--initial' : ''}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="chat-send-btn"
                    disabled={isLocked || (!isInitial && !input.trim())}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="chat-hint-row">
                  <span className="input-hint">
                    {isLocked ? '璇风偣鍑讳笂鏂归€夐」浣滅瓟' : isInitial ? '鐐瑰嚮鍙戦€佸紑濮嬪缓绔嬪垎韬? : 'Enter 鍙戦€?路 Shift+Enter 鎹㈣'}
                  </span>
                  <div className="chat-hint-actions">
                    <select
                      className="model-select-single"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      title="閫夋嫨妯″瀷"
                    >
                      {PROFILE_HELPER_MODELS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="chat-action-btn"
                      onClick={() => navigate('/profile-helper/profile')}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      鎴戠殑鍒嗚韩
                    </button>
                    <button
                      type="button"
                      className="chat-action-btn"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      閲嶇疆浼氳瘽
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
