import { useState } from 'react'

interface CopyableBlockProps {
  title?: string
  content: string
}

export function CopyableBlock({ title, content }: CopyableBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="block-copyable">
      <div className="copyable-header">
        {title && <span className="copyable-title">{title}</span>}
        <button type="button" className="copyable-btn" onClick={handleCopy}>
          {copied ? '鉁?宸插鍒? : '涓€閿鍒?}
        </button>
      </div>
      <pre className="copyable-content">{content}</pre>
    </div>
  )
}
