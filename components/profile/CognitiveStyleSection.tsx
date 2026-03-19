import type { StructuredProfile } from '../../types'
import { DataSourceBadge } from './DataSourceBadge'

interface CognitiveStyleSectionProps {
  data: StructuredProfile['cognitive_style']
}

export function CognitiveStyleSection({ data }: CognitiveStyleSectionProps) {
  const csi = data.csi ?? null
  const integration = data.integration ?? null
  const depth = data.depth ?? null
  const typeName = data.type || ''

  if (csi === null) {
    return (
      <section className="pv-section">
        <h3 className="pv-section-title">璁ょ煡椋庢牸 (RCSS)</h3>
        <p className="pv-empty">灏氭湭璇勪及銆?/p>
      </section>
    )
  }

  // -24~+24 鏄犲皠鍒?0~100%
  const pct = ((csi - (-24)) / 48) * 100

  return (
    <section className="pv-section">
      <div className="pv-section-header">
        <h3 className="pv-section-title">璁ょ煡椋庢牸 (RCSS)</h3>
        <DataSourceBadge source={data.source || ''} />
      </div>
      <div className="pv-csi-spectrum">
        <div className="pv-csi-labels">
          <span>寮烘繁搴﹀瀷</span>
          <span>骞宠　鍨?/span>
          <span>寮烘暣鍚堝瀷</span>
        </div>
        <div className="pv-csi-track">
          <div className="pv-csi-marker" style={{ left: `${pct}%` }}>
            <div className="pv-csi-dot" />
            <div className="pv-csi-value">CSI = {csi > 0 ? '+' : ''}{csi}</div>
          </div>
        </div>
        <div className="pv-csi-labels pv-csi-numbers">
          <span>-24</span>
          <span>0</span>
          <span>+24</span>
        </div>
      </div>
      <div className="pv-csi-summary">
        <div className="pv-csi-scores">
          {integration !== null && <span>妯悜鏁村悎 (I) = <strong>{integration}</strong></span>}
          {depth !== null && <span>鍨傜洿娣卞害 (D) = <strong>{depth}</strong></span>}
        </div>
        {typeName && <p className="pv-csi-type">{typeName}</p>}
      </div>
    </section>
  )
}
