import type { ScaleDefinition } from '../data/scales'

/**
 * 璁＄畻閲忚〃鍚勭淮搴﹀緱鍒嗐€? * 澶勭悊鍙嶅悜璁″垎锛歳everse 棰?score = (max_val + 1) - raw
 */
export function calculateScores(
  scale: ScaleDefinition,
  answers: Record<string, number>,
): Record<string, number> {
  const scores: Record<string, number> = {}

  for (const dim of scale.dimensions) {
    const qIds = dim.question_ids
    const vals: number[] = []

    for (const qId of qIds) {
      const raw = answers[qId]
      if (raw == null) continue
      const q = scale.questions.find((qq) => qq.id === qId)
      const val = q?.reverse ? (scale.max_val + 1 - raw) : raw
      vals.push(val)
    }

    if (vals.length === 0) {
      scores[dim.id] = 0
      continue
    }

    if (scale.scoring === 'average') {
      scores[dim.id] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2))
    } else {
      scores[dim.id] = vals.reduce((a, b) => a + b, 0)
    }
  }

  return scores
}

/**
 * RCSS 涓撶敤锛氳绠?CSI = I - D锛堟眰鍜屽悗鐩稿噺锛? * 鑼冨洿 -24 ~ +24
 */
export function calculateRCSS(scores: Record<string, number>) {
  const I = scores['integration'] || 0
  const D = scores['depth'] || 0
  const CSI = I - D

  let type = '骞宠　鍨?
  if (CSI >= 17)       type = '寮烘暣鍚堝瀷'
  else if (CSI >= 8)   type = '鍊惧悜鏁村悎鍨?
  else if (CSI <= -17) type = '寮烘繁搴﹀瀷'
  else if (CSI <= -8)  type = '鍊惧悜娣卞害鍨?

  return { I, D, CSI, type }
}

/**
 * AMS-GSR 28 涓撶敤锛氳绠?RAI锛堢浉瀵硅嚜涓绘€ф寚鏁帮級
 * RAI = 3脳姹傜煡 + 3脳鎴愬氨 + 3脳浣撻獙鍒烘縺 + 2脳璁ゅ悓 鈭?1脳鍐呮憚 鈭?2脳澶栭儴 鈭?3脳鏃犲姩鏈? */
export function calculateAMS_RAI(scores: Record<string, number>) {
  const know          = scores['know']           || 0
  const accomplishment= scores['accomplishment'] || 0
  const stimulation   = scores['stimulation']    || 0
  const identified    = scores['identified']     || 0
  const introjected   = scores['introjected']    || 0
  const external      = scores['external']       || 0
  const amotivation   = scores['amotivation']    || 0

  const RAI =
    3 * know + 3 * accomplishment + 3 * stimulation + 2 * identified
    - 1 * introjected - 2 * external - 3 * amotivation

  return {
    intrinsicTotal: parseFloat((know + accomplishment + stimulation).toFixed(2)),
    extrinsicTotal: parseFloat((identified + introjected + external).toFixed(2)),
    RAI: parseFloat(RAI.toFixed(2)),
  }
}

/** 鍚戝悗鍏煎鏃у悕绉?*/
export const calculateAMSRAI = calculateAMS_RAI
