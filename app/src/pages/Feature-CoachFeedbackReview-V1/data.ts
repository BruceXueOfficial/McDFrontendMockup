export const GUIDE_TAGS = ['顾客体验', '员工体验', '业务达成'] as const

export type GuideTag = (typeof GUIDE_TAGS)[number]
export type TabKey = 'dowell' | 'dobetter' | 'donext'

export type FeedbackBlock = {
  tags: GuideTag[]
  text: string
}

export const TAB_ORDER: TabKey[] = ['dowell', 'dobetter', 'donext']

export const TAB_META: Record<
  TabKey,
  {
    label: string
    title: string
    subtitle: string
    colorClass: string
    suffix: string
  }
> = {
  dowell: {
    label: 'Do Well',
    title: 'Do Well!',
    subtitle: '做得好的，继续保持。',
    colorClass: 'coach-green',
    suffix: '等方面夸夸！',
  },
  dobetter: {
    label: 'Do Better',
    title: 'Do Better!',
    subtitle: '可以做得更好的方面。',
    colorClass: 'coach-orange',
    suffix: '等方面聊聊！',
  },
  donext: {
    label: 'Do Next',
    title: 'Do Next!',
    subtitle: '下一步行动计划。',
    colorClass: 'coach-blue',
    suffix: '等方面制定计划！',
  },
}

export const GUIDE_MAP: Record<GuideTag, string[]> = {
  顾客体验: ['顾客满意度', '服务效率', '问题解决', '顾客互动'],
  员工体验: ['工作积极性', '团队协作', '员工关怀', '训练成长'],
  业务达成: ['营业额达成', '食品安全', '运营效率', '成本管控'],
}

export const AI_SUMMARY = [
  {
    title: '业务达成',
    text: 'Sales 低于目标 682 元，MDS 超额亮眼；尖峰 GC 11-12 点大幅超标，夸夸调度能力。',
  },
  {
    title: '顾客满意',
    text: 'OSAT 达标，但有 2 条客诉，其中 1 条 L4 仍待闭环，需要明确复盘动作。',
  },
  {
    title: '员工满意',
    text: '认知员工仅 25%，说明员工关注和认可动作仍偏弱，建议更主动做班次互动。',
  },
  {
    title: '值班表现',
    text: '待办完成率 80%，有 30% 待办转交他人，后续要更关注待办闭环和自主执行。',
  },
  {
    title: '建议',
    text: '先展开下面的数据模块，再结合教练反馈三栏逐项补充。',
  },
]

export const PERFORMANCE_CARDS = [
  { title: '班次 Sales', value: 12940, delta: -682, suffix: 'vs. 目标' },
  { title: '挑战尖峰 GC', value: 346, delta: -12, suffix: 'vs. 目标 358' },
  { title: 'OSAT', value: 100, delta: 0, suffix: 'vs. 目标 100' },
  { title: '认知员工占比', value: 25, delta: 0, suffix: '3 认知 / 12 出勤' },
]

export const SALES_BREAKDOWN = [
  { label: 'FC Sales', value: 5284, target: 5500, delta: -216 },
  { label: 'MDS Sales', value: 6503, target: 6200, delta: 303 },
  { label: 'Kiosk Sales', value: 46, target: 50, delta: -4 },
  { label: 'McCafe Sales', value: 1107, target: 1150, delta: -43 },
]

export const PEAK_SLOTS = [
  { label: '08:00-09:00', actual: 105, target: 123 },
  { label: '11:00-12:00', actual: 108, target: 77 },
  { label: '12:00-13:00', actual: 100, target: 119 },
  { label: '13:00-14:00', actual: 33, target: 39 },
]

export const CCC_BREAKDOWN = [
  { level: 'L3', solved: 1, total: 1, tone: 'green' as const },
  { level: 'L4', solved: 0, total: 1, tone: 'red' as const },
]

export const createDefaultFeedback = (): Record<TabKey, FeedbackBlock> => ({
  dowell: { tags: [], text: '' },
  dobetter: { tags: [], text: '' },
  donext: { tags: [], text: '' },
})

export const createTouchedState = (): Record<TabKey, boolean> => ({
  dowell: false,
  dobetter: false,
  donext: false,
})

export const countValidChars = (value: string) =>
  (value.match(/[\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9]/g) ?? []).length
