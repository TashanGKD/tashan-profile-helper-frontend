/** Block 鍗忚绫诲瀷瀹氫箟锛屼笌 digital-twin-bootstrap 淇濇寔涓€鑷?*/

export interface ChoiceOption {
  id: string
  label: string
  description?: string
  /** 鑻ヨ缃紝鐐瑰嚮璇ラ€夐」鍚庡湪鍙充晶灞曠ず鍐呰仈鏂囨湰杈撳叆妗嗭紝鐢ㄦ埛濉啓鍚庡啀鍙戦€併€傚€间负 placeholder 鏂囧瓧 */
  text_prompt?: string
}

export interface ActionButton {
  id: string
  label: string
  href?: string
  style?: 'primary' | 'secondary'
}

export type Block =
  | { type: 'text'; content: string }
  | { type: 'choice'; id: string; question: string; options: ChoiceOption[] }
  | { type: 'text_input'; id: string; question: string; placeholder?: string; multiline?: boolean }
  | { type: 'rating'; id: string; question: string; min_val: number; max_val: number; min_label?: string; max_label?: string }
  | { type: 'chart'; chart_type: 'radar' | 'bar'; title: string; dimensions: string[]; values: number[]; max_value?: number }
  | { type: 'actions'; message?: string; buttons: ActionButton[] }
  | { type: 'copyable'; title?: string; content: string }

export interface ChatMessage {
  role: 'user' | 'assistant'
  /** 鏃у紡绾枃鏈秷鎭紙backward compat锛?*/
  content?: string
  /** Block 鍗忚娑堟伅 */
  blocks?: Block[]
  /** Block 绾у凡鍝嶅簲闆嗗悎锛堝瓨鍌ㄥ凡鍥炵瓟鐨?block id锛夛紝鏇夸唬娑堟伅绾?_responded */
  _responded_blocks?: string[]
  /** @deprecated 娑堟伅绾у凡鍝嶅簲鏍囪锛屼粎鍚戝悗鍏煎鐢紝鏂伴€昏緫浠?_responded_blocks 涓哄噯 */
  _responded?: boolean
}

// 鈹€鈹€ 绉戝瀹跺尮閰嶇被鍨?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export interface FamousMatch {
  name: string
  name_en: string
  field: string
  era: string
  similarity: number
  reason: string
  signature: string
  csi: number
  rai: number
}

export interface ScatterPoint {
  name: string
  name_en: string
  csi: number
  rai: number
  is_top3: boolean
}

export interface FieldRecommendation {
  name: string
  name_en?: string
  institution: string
  field: string
  reason: string
}

export interface FamousMatchResult {
  top3: FamousMatch[]
  scatter_data: ScatterPoint[]
  user_point: { csi: number; rai: number }
}

// 鈹€鈹€ StructuredProfile锛堢敾鍍忕粨鏋勫寲鏁版嵁锛岀敤浜庣淮搴﹀彲瑙嗗寲锛夆攢鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

export interface ProcessScore {
  score: number | null
  description: string
}

export interface TechItem {
  category: string
  tech: string
  level: string
}

export interface NeedItem {
  item?: string
  desc?: string
  feeling?: string
  issue?: string
  detail?: string
  help_type?: string
}

export interface PersonalityDim {
  score: number
  level: string
}

export interface StructuredProfile {
  name: string
  meta: { created_at: string; updated_at: string; stage: string; source: string }
  identity: {
    research_stage: string
    primary_field: string
    secondary_field: string
    cross_field: string
    method: string
    institution: string
    network: string
  }
  capability: {
    tech_stack: TechItem[]
    process: Record<string, ProcessScore>
    outputs: string
  }
  needs: {
    time_occupation: NeedItem[]
    pain_points: NeedItem[]
    want_to_change: string
  }
  cognitive_style: {
    integration?: number
    depth?: number
    csi?: number
    type?: string
    source?: string
  }
  motivation: {
    dimensions: Record<string, number>
    intrinsic_total: number | null
    extrinsic_total: number | null
    rai: number | null
    source: string
  }
  personality: Record<string, PersonalityDim | string>
  interpretation: {
    core_driver: string
    risks: string
    path: string
  }
  completion: Record<string, boolean>
}
