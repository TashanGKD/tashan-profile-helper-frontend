import type { ScatterPoint } from '../types'

interface ScientistScatterProps {
  scatterData: ScatterPoint[]
  userPoint: { csi: number; rai: number }
  top3Names: string[]
}

export function ScientistScatter({ scatterData, userPoint, top3Names }: ScientistScatterProps) {
  const W = 500
  const H = 400
  const PAD = 50

  const csiMin = -24, csiMax = 24
  const raiMin = -10, raiMax = 62

  const toX = (csi: number) => PAD + ((csi - csiMin) / (csiMax - csiMin)) * (W - 2 * PAD)
  const toY = (rai: number) => H - PAD - ((rai - raiMin) / (raiMax - raiMin)) * (H - 2 * PAD)

  const cx = toX(0)
  const cy = toY(raiMin + (raiMax - raiMin) / 2)

  const ux = toX(userPoint.csi)
  const uy = toY(userPoint.rai)

  return (
    <div className="sci-scatter-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="sci-scatter-svg">
        {/* 鑳屾櫙 */}
        <rect x={PAD} y={PAD} width={W - 2 * PAD} height={H - 2 * PAD} fill="#fafafa" stroke="#e5e7eb" />

        {/* 鍗佸瓧杞?*/}
        <line x1={cx} y1={PAD} x2={cx} y2={H - PAD} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,3" />
        <line x1={PAD} y1={cy} x2={W - PAD} y2={cy} stroke="#d1d5db" strokeWidth="1" strokeDasharray="4,3" />

        {/* 璞￠檺鏍囩 */}
        <text x={PAD + 8} y={PAD + 16} fontSize="9" fill="#9ca3af">鑷富涓撶簿鍨?/text>
        <text x={W - PAD - 8} y={PAD + 16} fontSize="9" fill="#9ca3af" textAnchor="end">鑷富鏁村悎鍨?/text>
        <text x={PAD + 8} y={H - PAD - 8} fontSize="9" fill="#9ca3af">绛栫暐涓撶簿鍨?/text>
        <text x={W - PAD - 8} y={H - PAD - 8} fontSize="9" fill="#9ca3af" textAnchor="end">绛栫暐鏁村悎鍨?/text>

        {/* 杞存爣娉?*/}
        <text x={W / 2} y={H - 8} fontSize="10" fill="#6b7280" textAnchor="middle">璁ょ煡椋庢牸 (CSI: 娣卞害鈫?鈫掓暣鍚?</text>
        <text x={12} y={H / 2} fontSize="10" fill="#6b7280" textAnchor="middle" transform={`rotate(-90, 12, ${H / 2})`}>鍔ㄦ満鑷富鎬?(RAI)</text>

        {/* Top3 杩炵嚎 */}
        {scatterData.filter((p) => top3Names.includes(p.name)).map((p, i) => (
          <line key={`line-${i}`} x1={ux} y1={uy} x2={toX(p.csi)} y2={toY(p.rai)} stroke="#000" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
        ))}

        {/* 绉戝瀹剁偣 */}
        {scatterData.map((p, i) => {
          const px = toX(p.csi)
          const py = toY(p.rai)
          const isTop3 = p.is_top3
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={isTop3 ? 5 : 3.5} fill={isTop3 ? '#000' : 'none'} stroke="#000" strokeWidth={isTop3 ? 0 : 1.5} />
              <text x={px} y={py - 8} fontSize="8" fill="#374151" textAnchor="middle">
                {p.name.length > 4 ? p.name.slice(0, 4) + '..' : p.name}
              </text>
            </g>
          )
        })}

        {/* 鐢ㄦ埛鐐?*/}
        <circle cx={ux} cy={uy} r="8" fill="#000" stroke="#fff" strokeWidth="2" />
        <text x={ux} y={uy - 14} fontSize="12" fill="#000" textAnchor="middle" fontWeight="700">鎴?/text>
      </svg>
    </div>
  )
}
