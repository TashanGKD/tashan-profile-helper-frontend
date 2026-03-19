import { useEffect, useState } from 'react'
import { getFamousMatches, getFieldRecommendations } from '../profileHelperApi'
import type { FamousMatchResult, FieldRecommendation } from '../types'
import { ScientistCard } from './ScientistCard'
import { ScientistScatter } from './ScientistScatter'

interface ScientistMatchSectionProps {
  sessionId: string
}

export function ScientistMatchSection({ sessionId }: ScientistMatchSectionProps) {
  const [famous, setFamous] = useState<FamousMatchResult | null>(null)
  const [famousLoading, setFamousLoading] = useState(true)
  const [fieldRecs, setFieldRecs] = useState<FieldRecommendation[] | null>(null)
  const [fieldLoading, setFieldLoading] = useState(true)

  useEffect(() => {
    getFamousMatches(sessionId)
      .then(setFamous)
      .catch(() => {})
      .finally(() => setFamousLoading(false))

    getFieldRecommendations(sessionId)
      .then(setFieldRecs)
      .catch(() => setFieldRecs([]))
      .finally(() => setFieldLoading(false))
  }, [sessionId])

  return (
    <section className="pv-section sci-section">
      <h3 className="pv-section-title">浣犵殑绉戠爺鐏甸瓊浼翠荆</h3>

      {famousLoading ? (
        <div className="sci-loading">
          <div className="sci-loading-animation">
            <div className="sci-loading-dot" />
            <div className="sci-loading-dot" />
            <div className="sci-loading-dot" />
          </div>
          <p>姝ｅ湪浠?30 浣嶇煡鍚嶇瀛﹀涓鎵句綘鐨勭伒榄備即渚?..</p>
        </div>
      ) : famous ? (
        <>
          <div className="sci-top3">
            {famous.top3.map((s, i) => (
              <ScientistCard key={s.name} scientist={s} rank={i + 1} />
            ))}
          </div>

          <h4 className="sci-sub-title">浣犲湪绉戝瀹跺浘璋变腑鐨勪綅缃?/h4>
          <ScientistScatter
            scatterData={famous.scatter_data}
            userPoint={famous.user_point}
            top3Names={famous.top3.map((s) => s.name)}
          />
        </>
      ) : null}

      <h4 className="sci-sub-title">鍊煎緱鍏虫敞鐨勫悓棰嗗煙瀛﹁€?/h4>
      {fieldLoading ? (
        <div className="sci-field-loading">
          <span className="sci-field-spinner" />
          <span>姝ｅ湪鏍规嵁浣犵殑鐮旂┒鏂瑰悜瀵绘壘鐩稿叧瀛﹁€?..</span>
        </div>
      ) : fieldRecs && fieldRecs.length > 0 ? (
        <>
          <p className="sci-field-hint">鍩轰簬浣犵殑鐮旂┒鏂瑰悜鎺ㄨ崘锛屽彲浠ュ叧娉ㄤ粬浠殑鏈€鏂板伐浣?/p>
          <div className="sci-field-list">
            {fieldRecs.map((r, i) => (
              <div key={i} className="sci-field-item">
                <div className="sci-field-name">
                  <strong>{r.name}</strong>
                  {r.name_en && <span className="sci-field-name-en">{r.name_en}</span>}
                </div>
                <p className="sci-field-info">{r.institution} 路 {r.field}</p>
                <p className="sci-field-reason">{r.reason}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="pv-empty">鏆傛棤棰嗗煙鎺ㄨ崘锛堥渶瑕佸畬鍠勭爺绌堕鍩熶俊鎭級</p>
      )}
    </section>
  )
}
