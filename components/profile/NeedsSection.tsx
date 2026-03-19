import type { StructuredProfile } from '../../types'

interface NeedsSectionProps {
  needs: StructuredProfile['needs']
}

export function NeedsSection({ needs }: NeedsSectionProps) {
  const { time_occupation, pain_points, want_to_change } = needs
  const isEmpty = time_occupation.length === 0 && pain_points.length === 0 && !want_to_change

  if (isEmpty) {
    return (
      <section className="pv-section">
        <h3 className="pv-section-title">褰撳墠闇€姹?/h3>
        <p className="pv-empty">灏氭湭濉啓銆傚缓璁ˉ鍏呬互鑾峰緱鏇存湁閽堝鎬х殑鍙戝睍寤鸿銆?/p>
      </section>
    )
  }

  return (
    <section className="pv-section">
      <h3 className="pv-section-title">褰撳墠闇€姹?/h3>
      <div className="pv-needs-grid">
        <div className="pv-need-card">
          <h4>涓昏鏃堕棿鍗犵敤</h4>
          {time_occupation.length > 0 ? (
            <ul>{time_occupation.map((t, i) => <li key={i}>{t.item || t.desc}{t.feeling ? ` 鈥?${t.feeling}` : ''}</li>)}</ul>
          ) : <p className="pv-empty">鏈～鍐?/p>}
        </div>
        <div className="pv-need-card">
          <h4>鏍稿績闅剧偣</h4>
          {pain_points.length > 0 ? (
            <ul>{pain_points.map((p, i) => <li key={i}>{p.issue || p.detail}</li>)}</ul>
          ) : <p className="pv-empty">鏈～鍐?/p>}
        </div>
        <div className="pv-need-card">
          <h4>鏈€鎯虫敼鍙樼殑涓€浠朵簨</h4>
          {want_to_change ? <p>{want_to_change}</p> : <p className="pv-empty">鏈～鍐?/p>}
        </div>
      </div>
    </section>
  )
}
