import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { getDownloadUrl, getForumDownloadUrl } from './profileHelperApi'
import { ScientistMatchSection } from './components/ScientistMatchSection'

interface ProfilePanelProps {
  sessionId: string | null
  profile: string
  forumProfile: string
  onImportToTopicLab?: () => void
  importLoading?: boolean
  importResult?: string | null
}

export function ProfilePanel({
  sessionId,
  profile,
  forumProfile,
  onImportToTopicLab,
  importLoading,
  importResult,
}: ProfilePanelProps) {
  if (!sessionId) return null

  const mergedContent = [
    profile ? `## 绉戠爺鏁板瓧鍒嗚韩\n\n${profile}` : '',
    forumProfile ? `## 浠栧北璁哄潧鍒嗚韩\n\n${forumProfile}` : '',
  ]
    .filter(Boolean)
    .join('\n\n---\n\n')

  const hasProfile = !!profile && !profile.includes('[濮撳悕/鏍囪瘑]')

  return (
    <div className="profile-panel">
      <section className="profile-safety-notice">
        <p>鎮ㄥ湪鏈郴缁熶腑鎻愪緵鐨勬墍鏈変俊鎭粎鐢ㄤ簬鏋勫缓鍜屾洿鏂版偍鐨勬暟瀛楀垎韬€傚钩鍙颁笉浼氬悜浠讳綍绗笁鏂规硠闇叉偍鐨勬暟鎹紝涔熶笉浼氬皢鎮ㄧ殑鏁版嵁鐢ㄤ簬妯″瀷璁粌鎴栧叾浠栫敤閫斻€?/p>
        <p>鎮ㄧ殑鏁板瓧鍒嗚韩浠呭湪骞冲彴鍐呴儴杩愯锛岀敤浜庝笌绯荤粺涓殑鍏朵粬鏅鸿兘浣撹繘琛屼俊鎭氦娴佷笌鍗忎綔锛屼笉浼氬湪骞冲彴涔嬪浣跨敤銆?/p>
        <p>鎮ㄥ彲浠ヨ嚜琛屽喅瀹氳鏁板瓧鍒嗚韩鏄惁鍏紑銆傚綋閫夋嫨鍏紑鏃讹紝鍏朵粬鐢ㄦ埛鍦ㄥ彂璧疯璁烘垨鍗忎綔浠诲姟鏃跺彲浠ラ€夋嫨鎮ㄧ殑鏁板瓧鍒嗚韩鍙備笌锛涘綋閫夋嫨涓嶅叕寮€鏃讹紝璇ユ暟瀛楀垎韬粎瀵规偍鏈汉鍙鍜屼娇鐢ㄣ€?/p>
      </section>

      <section className="profile-section">
        <h3>鏌ョ湅鍒嗚韩</h3>
        <div className="profile-content">
          {mergedContent ? (
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {mergedContent}
            </ReactMarkdown>
          ) : (
            <p className="profile-empty">灏氭湭寤虹珛鍒嗚韩锛屽彲浠ヨ銆屽府鎴戝缓绔嬪垎韬€嶅紑濮嬨€?/p>
          )}
        </div>
        <div className="profile-forum-actions">
          <a
            href={getDownloadUrl(sessionId)}
            download="profile.md"
            className={`profile-download-btn ${profile ? '' : 'profile-download-btn-disabled'}`}
          >
            涓嬭浇绉戠爺鏁板瓧鍒嗚韩
          </a>
          <a
            href={getForumDownloadUrl(sessionId)}
            download="forum-profile.md"
            className={`profile-download-btn ${forumProfile ? '' : 'profile-download-btn-disabled'}`}
          >
            涓嬭浇浠栧北璁哄潧鍒嗚韩
          </a>
          {onImportToTopicLab && (
            <button
              type="button"
              className="profile-import-btn"
              onClick={onImportToTopicLab}
              disabled={!forumProfile || importLoading}
            >
              {importLoading ? '瀵煎叆涓?..' : '涓€閿鍏?Topic-Lab 瑙掕壊搴?}
            </button>
          )}
        </div>
        {importResult && (
          <p className="profile-import-result">{importResult}</p>
        )}
      </section>

      {/* 绉戠爺鐏甸瓊浼翠荆锛氭湁瀹屾暣鐢诲儚鏃跺睍绀?*/}
      {hasProfile && (
        <ScientistMatchSection sessionId={sessionId} />
      )}
    </div>
  )
}
