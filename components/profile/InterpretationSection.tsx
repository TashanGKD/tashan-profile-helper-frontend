import ReactMarkdown from 'react-markdown'
import type { StructuredProfile } from '../../types'

interface InterpretationSectionProps {
  data: StructuredProfile['interpretation']
}

export function InterpretationSection({ data }: InterpretationSectionProps) {
  const { core_driver, risks, path } = data
  const isEmpty = !core_driver && !risks && !path

  if (isEmpty) {
    return (
      <section className="pv-section">
        <h3 className="pv-section-title">缁煎悎瑙ｈ</h3>
        <p className="pv-empty">灏氭湭鐢熸垚銆傚畬鎴愮敾鍍忛噰闆嗗悗灏嗚嚜鍔ㄧ敓鎴愩€?/p>
      </section>
    )
  }

  return (
    <section className="pv-section">
      <h3 className="pv-section-title">缁煎悎瑙ｈ</h3>
      {core_driver && (
        <div className="pv-interp-card">
          <h4>鏍稿績椹卞姩妯″紡</h4>
          <div className="pv-interp-body"><ReactMarkdown>{core_driver}</ReactMarkdown></div>
        </div>
      )}
      {risks && (
        <div className="pv-interp-card">
          <h4>娼滃湪椋庨櫓涓庡彂灞曞缓璁?/h4>
          <div className="pv-interp-body"><ReactMarkdown>{risks}</ReactMarkdown></div>
        </div>
      )}
      {path && (
        <div className="pv-interp-card pv-interp-highlight">
          <h4>閫傚悎鐨勫彂灞曡矾寰?/h4>
          <div className="pv-interp-body"><ReactMarkdown>{path}</ReactMarkdown></div>
        </div>
      )}
    </section>
  )
}
