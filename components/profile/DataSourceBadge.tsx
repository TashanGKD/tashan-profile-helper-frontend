interface DataSourceBadgeProps {
  source: string
}

export function DataSourceBadge({ source }: DataSourceBadgeProps) {
  if (!source) return null
  const isInferred = source.includes('鎺ㄦ柇')
  const isScale = source.includes('瀹炴祴')
  return (
    <span className={`data-badge ${isInferred ? 'badge-inferred' : isScale ? 'badge-scale' : 'badge-mixed'}`}>
      {source}
    </span>
  )
}
