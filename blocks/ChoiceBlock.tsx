import { useRef, useState } from 'react'
import type { ChoiceOption } from '../types'

interface ChoiceBlockProps {
  question: string
  options: ChoiceOption[]
  onSelect?: (option: ChoiceOption, extraText?: string) => void
  disabled?: boolean
}

export function ChoiceBlock({ question, options, onSelect, disabled }: ChoiceBlockProps) {
  const [selected, setSelected] = useState<string | null>(null)
  // 褰撴煇閫夐」鏈?text_prompt 涓旇鐐瑰嚮鏃讹紝灞曠ず鍐呰仈杈撳叆妗?  const [inlineOption, setInlineOption] = useState<ChoiceOption | null>(null)
  const [inlineText, setInlineText] = useState('')
  const inlineRef = useRef<HTMLInputElement>(null)

  const handleClick = (opt: ChoiceOption) => {
    if (disabled || selected) return

    if (opt.text_prompt) {
      // 鏈?text_prompt 鈫?灞曠ず鍐呰仈杈撳叆妗嗭紝涓嶇珛鍗冲彂閫?      setInlineOption(opt)
      setTimeout(() => inlineRef.current?.focus(), 50)
      return
    }

    // 鏅€氶€夐」 鈫?绔嬪嵆鍙戦€?    setSelected(opt.id)
    onSelect?.(opt)
  }

  const handleInlineSubmit = () => {
    if (!inlineOption || !inlineText.trim()) return
    setSelected(inlineOption.id)
    // 鎶婇€夐」鏍囩 + 鐢ㄦ埛濉啓鍐呭鍚堝苟鎴愭秷鎭?    onSelect?.(inlineOption, inlineText.trim())
  }

  const isLocked = !!(disabled || selected)

  return (
    <div className="block-choice">
      <p className="block-question">{question}</p>
      <div className="choice-options">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          const isInlineActive = inlineOption?.id === opt.id && !selected

          return (
            <div key={opt.id} className="choice-btn-group">
              <button
                type="button"
                className={`choice-btn ${isSelected ? 'selected' : ''} ${isLocked ? 'disabled' : ''}`}
                onClick={() => handleClick(opt)}
                disabled={isLocked}
              >
                <span className="choice-label">{opt.label}</span>
                {opt.description && <span className="choice-desc">{opt.description}</span>}
              </button>

              {/* 鍐呰仈杈撳叆妗嗭細浠呭湪璇ラ€夐」鏈?text_prompt 涓旇婵€娲绘椂鏄剧ず */}
              {isInlineActive && (
                <div className="choice-inline-input">
                  <input
                    ref={inlineRef}
                    type="text"
                    className="choice-inline-field"
                    value={inlineText}
                    onChange={(e) => setInlineText(e.target.value)}
                    placeholder={opt.text_prompt}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleInlineSubmit()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="choice-inline-submit"
                    onClick={handleInlineSubmit}
                    disabled={!inlineText.trim()}
                  >
                    纭
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
