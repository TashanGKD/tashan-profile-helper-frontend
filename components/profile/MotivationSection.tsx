import type { StructuredProfile } from '../../types'
import { DataSourceBadge } from './DataSourceBadge'

const DIM_ORDER = [
  { key: 'know',           label: '姹傜煡',     group: 'intrinsic'   },
  { key: 'accomplishment', label: '鎴愬氨',     group: 'intrinsic'   },
  { key: 'stimulation',    label: '浣撻獙鍒烘縺', group: 'intrinsic'   },
  { key: 'identified',     label: '璁ゅ悓璋冭妭', group: 'autonomous'  },
  { key: 'introjected',    label: '鍐呮憚璋冭妭', group: 'controlled'  },
  { key: 'external',       label: '澶栭儴璋冭妭', group: 'controlled'  },
  { key: 'amotivation',    label: '鏃犲姩鏈?,   group: 'amotivation' },
]

interface MotivationSectionProps {
  data: StructuredProfile['motivation']
}

export function MotivationSection({ data }: MotivationSectionProps) {
  const { dimensions, intrinsic_total, extrinsic_total, rai } = data
  const hasDims = Object.keys(dimensions).length > 0

  if (!hasDims) {
    return (
      <section className="pv-section">
        <h3 className="pv-section-title">瀛︽湳鍔ㄦ満 (AMS)</h3>
        <p className="pv-empty">灏氭湭璇勪及銆?/p>
      </section>
    )
  }

  return (
    <section className="pv-section">
      <div className="pv-section-header">
        <h3 className="pv-section-title">瀛︽湳鍔ㄦ満 (AMS)</h3>
        <DataSourceBadge source={data.source} />
      </div>
      <div className="pv-motivation-chart">
        {DIM_ORDER.map(({ key, label, group }) => {
          const val = dimensions[key] ?? 0
          return (
            <div key={key} className="pv-mot-row">
              <span className="pv-mot-label">{label}</span>
              <div className={`pv-mot-track group-${group}`}>
                <div className="pv-mot-fill" style={{ width: `${(val / 7) * 100}%` }} />
              </div>
              <span className="pv-mot-val">{val.toFixed(1)}</span>
            </div>
          )
        })}
      </div>
      <div className="pv-mot-summary">
        {intrinsic_total != null && <span>鍐呭湪鍔ㄦ満鎬诲垎 <strong>{intrinsic_total.toFixed(1)}</strong></span>}
        {extrinsic_total != null && <span>澶栧湪鍔ㄦ満鎬诲垎 <strong>{extrinsic_total.toFixed(1)}</strong></span>}
        {rai != null && <span>RAI <strong>{rai > 0 ? '+' : ''}{rai.toFixed(1)}</strong></span>}
      </div>
    </section>
  )
}
