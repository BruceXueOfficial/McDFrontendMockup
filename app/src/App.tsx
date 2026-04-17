import { useEffect, useMemo, useRef, useState } from 'react'
import {
  App as AurumApp,
  Affix,
  Avatar,
  Button,
  Card,
  Collapse,
  ConfigProvider,
  Divider,
  FloatButton,
  Input,
  Progress,
  Space,
  Statistic,
  Tabs,
  Tag,
} from '@aurum/pfe-ui'
import {
  AiMessageOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  BellOutlined,
  BulbOutlined,
  CheckCircleTwoTone,
  EllipsisOutlined,
  TeamOutlined,
  TrophyTwoTone,
  UserOutlined,
} from '@aurum/icons2'
import './App.css'

type TabKey = 'dowell' | 'dobetter' | 'donext'

type FeedbackBlock = {
  tags: string[]
  text: string
}

const TAB_ORDER: TabKey[] = ['dowell', 'dobetter', 'donext']

const TAB_META: Record<
  TabKey,
  {
    label: string
    title: string
    subtitle: string
    colorClass: string
    tone: string
    suffix: string
  }
> = {
  dowell: {
    label: 'Do Well',
    title: 'Do Well!',
    subtitle: '做得好的，继续保持。',
    colorClass: 'coach-green',
    tone: 'green',
    suffix: '等方面夸夸！',
  },
  dobetter: {
    label: 'Do Better',
    title: 'Do Better!',
    subtitle: '可以做得更好的方面。',
    colorClass: 'coach-orange',
    tone: 'orange',
    suffix: '等方面聊聊！',
  },
  donext: {
    label: 'Do Next',
    title: 'Do Next!',
    subtitle: '下一步行动计划。',
    colorClass: 'coach-blue',
    tone: 'blue',
    suffix: '等方面制定计划！',
  },
}

const GUIDE_MAP: Record<string, string[]> = {
  顾客体验: ['顾客满意度', '服务效率', '问题解决', '顾客互动'],
  员工体验: ['工作积极性', '团队协作', '员工关怀', '训练成长'],
  业务达成: ['营业额达成', '食品安全', '运营效率', '成本管控'],
}

const AI_SUMMARY = [
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

const PERFORMANCE_CARDS = [
  { title: '班次 Sales', value: 12940, delta: -682, suffix: 'vs. 目标' },
  { title: '挑战尖峰 GC', value: 346, delta: -12, suffix: 'vs. 目标 358' },
  { title: 'OSAT', value: 100, delta: 0, suffix: 'vs. 目标 100' },
  { title: '认知员工占比', value: 25, delta: 0, suffix: '3 认知 / 12 出勤' },
]

const SALES_BREAKDOWN = [
  { label: 'FC Sales', value: 5284, target: 5500, delta: -216 },
  { label: 'MDS Sales', value: 6503, target: 6200, delta: 303 },
  { label: 'Kiosk Sales', value: 46, target: 50, delta: -4 },
  { label: 'McCafe Sales', value: 1107, target: 1150, delta: -43 },
]

const PEAK_SLOTS = [
  { label: '08:00-09:00', actual: 105, target: 123, accent: 'green' },
  { label: '11:00-12:00', actual: 108, target: 77, accent: 'gold' },
  { label: '12:00-13:00', actual: 100, target: 119, accent: 'orange' },
  { label: '13:00-14:00', actual: 33, target: 39, accent: 'red' },
]

const CCC_BREAKDOWN = [
  { level: 'L3', solved: 1, total: 1, tone: 'green' },
  { level: 'L4', solved: 0, total: 1, tone: 'red' },
]

const DEFAULT_FEEDBACK: Record<TabKey, FeedbackBlock> = {
  dowell: { tags: [], text: '' },
  dobetter: { tags: [], text: '' },
  donext: { tags: [], text: '' },
}

const countValidChars = (value: string) =>
  (value.match(/[\u4e00-\u9fff\u3400-\u4dbfa-zA-Z0-9]/g) ?? []).length

function CoachFeedbackPage() {
  const { message } = AurumApp.useApp()
  const [showAi, setShowAi] = useState(true)
  const [showData, setShowData] = useState(true)
  const [showTips, setShowTips] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('dowell')
  const [feedback, setFeedback] =
    useState<Record<TabKey, FeedbackBlock>>(DEFAULT_FEEDBACK)
  const [touched, setTouched] = useState<Record<TabKey, boolean>>({
    dowell: false,
    dobetter: false,
    donext: false,
  })
  const [floatTarget, setFloatTarget] = useState<'overview' | 'feedback' | null>(
    'feedback',
  )
  const overviewRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLElement>(null)

  const completion = useMemo(
    () =>
      TAB_ORDER.reduce(
        (acc, key) => {
          const block = feedback[key]
          acc[key] =
            block.tags.length > 0 && countValidChars(block.text.trim()) >= 20
          return acc
        },
        {} as Record<TabKey, boolean>,
      ),
    [feedback],
  )

  const completedCount = TAB_ORDER.filter((key) => completion[key]).length
  const allCompleted = completedCount === TAB_ORDER.length

  useEffect(() => {
    const onScroll = () => {
      const overview = overviewRef.current?.getBoundingClientRect()
      const feedbackBox = feedbackRef.current?.getBoundingClientRect()
      if (!overview || !feedbackBox) return

      const middle = window.innerHeight / 2
      if (overview.top < middle && overview.bottom > middle) {
        setFloatTarget('feedback')
      } else if (feedbackBox.top < middle && feedbackBox.bottom > middle) {
        setFloatTarget('overview')
      } else {
        setFloatTarget(null)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const updateTags = (key: TabKey, tag: string, checked: boolean) => {
    setFeedback((current) => {
      const tags = checked
        ? [...current[key].tags, tag]
        : current[key].tags.filter((item) => item !== tag)

      return {
        ...current,
        [key]: {
          ...current[key],
          tags,
        },
      }
    })
  }

  const updateText = (key: TabKey, text: string) => {
    setFeedback((current) => ({
      ...current,
      [key]: {
        ...current[key],
        text,
      },
    }))
  }

  const jumpToNext = () => {
    const currentBlock = feedback[activeTab]
    const currentValidLength = countValidChars(currentBlock.text.trim())

    if (
      currentBlock.text.trim().length > 0 &&
      currentBlock.tags.length > 0 &&
      currentValidLength < 20
    ) {
      setTouched((current) => ({ ...current, [activeTab]: true }))
      message.warning('当前内容不足 20 个有效字符')
      return
    }

    if (allCompleted) {
      message.success('反馈提交成功')
      return
    }

    const currentIndex = TAB_ORDER.indexOf(activeTab)
    for (let step = 1; step <= TAB_ORDER.length; step += 1) {
      const nextKey = TAB_ORDER[(currentIndex + step) % TAB_ORDER.length]
      if (!completion[nextKey]) {
        setActiveTab(nextKey)
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  }

  const aiItems = [
    {
      key: 'summary',
      label: (
        <div className="ai-summary-label">
          <Space size={10}>
            <span className="coach-icon-shell coach-ai-shell">
              <AiMessageOutlined />
            </span>
            <span className="coach-section-heading">AI 总结</span>
          </Space>
          <span className="coach-caret-copy">{showAi ? '收起' : '展开'}</span>
        </div>
      ),
      children: (
        <div className="coach-ai-copy">
          {AI_SUMMARY.map((item) => (
            <div key={item.title} className="coach-ai-line">
              <strong>{item.title}：</strong>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      ),
    },
  ]

  const feedbackTabs = TAB_ORDER.map((key) => {
    const meta = TAB_META[key]
    const block = feedback[key]
    const validChars = countValidChars(block.text.trim())
    const shouldShowError =
      touched[key] &&
      block.text.trim().length > 0 &&
      block.tags.length > 0 &&
      validChars < 20

    return {
      key,
      label: (
        <span className={`coach-tab-label ${completion[key] ? 'is-complete' : ''}`}>
          <span className={`coach-tab-dot ${meta.colorClass}`} />
          <span>{meta.label}</span>
          {completion[key] && (
            <CheckCircleTwoTone twoToneColor="#34a853" className="coach-tab-check" />
          )}
        </span>
      ),
      children: (
        <div className="coach-tab-panel">
          <div className="coach-block-title">
            <span className={`coach-block-bar ${meta.colorClass}`} />
            <div>
              <div className="coach-block-heading">{meta.title}</div>
              <div className="coach-block-subtitle">{meta.subtitle}</div>
            </div>
          </div>

          <div className="coach-tag-row">
            {Object.keys(GUIDE_MAP).map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={block.tags.includes(tag)}
                onChange={(checked) => updateTags(key, tag, checked)}
                className="coach-check-tag"
              >
                {tag}
              </Tag.CheckableTag>
            ))}
          </div>

          {block.tags.length > 0 && (
            <div className="coach-guide-box">
              {block.tags.map((tag) => (
                <div key={tag} className="coach-guide-line">
                  <span className="coach-guide-bullet">•</span>
                  <span>
                    <strong>{tag}</strong>：从
                    {GUIDE_MAP[tag].join('、')}
                    {meta.suffix}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Input.TextArea
            value={block.text}
            onChange={(event) => updateText(key, event.target.value)}
            onBlur={() =>
              setTouched((current) => ({
                ...current,
                [key]: true,
              }))
            }
            autoSize={{ minRows: 7, maxRows: 12 }}
            disabled={block.tags.length === 0}
            placeholder={
              block.tags.length === 0 ? '请先选择标签后再填写反馈' : '请在这里输入反馈内容'
            }
            status={shouldShowError ? 'error' : undefined}
            className="coach-textarea"
          />

          <div className="coach-input-footer">
            <span className={shouldShowError ? 'is-error' : ''}>
              有效字符 {validChars}
            </span>
            {shouldShowError && <span>中文、字母、数字总数不满 20 个无法提交</span>}
          </div>
        </div>
      ),
    }
  })

  return (
    <div className="coach-page-shell">
      <Affix offsetTop={0}>
        <header className="coach-topbar">
          <button type="button" className="coach-nav-link">
            <ArrowLeftOutlined />
            <span>值班教练反馈</span>
          </button>
          <Space size={10}>
            <Button shape="circle" type="text" icon={<BellOutlined />} />
            <Button shape="circle" type="text" icon={<EllipsisOutlined />} />
          </Space>
        </header>
      </Affix>

      <main className="coach-content">
        <section className="coach-hero">
          <div>
            <div className="coach-kicker">Golden Shift Coach Feedback</div>
            <h1>黄金十班次 Option 4 React 重构版</h1>
            <p>
              基于现有 GitHub 页面重构为 React + Vite，保留移动端反馈路径，并切到
              Aurum 组件体系。
            </p>
          </div>
          <Space wrap size={[8, 8]}>
            <Tag color="gold">Aurum UI</Tag>
            <Tag color="processing">React + Vite</Tag>
            <Tag color="default">GitHub Pages</Tag>
          </Space>
        </section>

        <Card className="coach-person-card" variant="borderless">
          <div className="coach-person-header">
            <Space size={14}>
              <Avatar size={52} icon={<UserOutlined />} className="coach-avatar" />
              <div>
                <div className="coach-person-name">刘翠翠 (Patrick Chen)</div>
                <div className="coach-person-meta">
                  <span>工号：10065998</span>
                  <span>日期：2024.09.08</span>
                  <Tag color="gold">早班</Tag>
                </div>
              </div>
            </Space>
          </div>
        </Card>

        <div ref={overviewRef}>
          <Card className="coach-overview-card" variant="borderless">
            <div className="coach-overview-header">
              <div className="coach-overview-title">值班总览</div>
              <Tag color={showData ? 'success' : 'default'}>
                {showData ? '数据已展开' : '数据已折叠'}
              </Tag>
            </div>

            <Collapse
              activeKey={showAi ? ['summary'] : []}
              onChange={(keys) => setShowAi(Array.isArray(keys) && keys.length > 0)}
              items={aiItems}
              bordered={false}
              className="coach-collapse"
            />

            <Divider />

            <div className="coach-section-title-row">
              <Space size={10}>
                <span className="coach-icon-shell coach-data-shell">
                  <BarChartOutlined />
                </span>
                <span className="coach-section-heading">数据展示</span>
              </Space>
              <Button
                type="text"
                className="coach-ghost-button"
                icon={showData ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                onClick={() => setShowData((current) => !current)}
              >
                {showData ? '收起' : '展开'}
              </Button>
            </div>

            {showData && (
              <div className="coach-section-stack">
                <div className="coach-kpi-grid">
                  {PERFORMANCE_CARDS.map((card) => (
                    <Card key={card.title} className="coach-kpi-card" size="small">
                      <Statistic
                        title={
                          <span className="coach-kpi-title">
                            {card.title}
                            <span>{card.suffix}</span>
                          </span>
                        }
                        value={card.value}
                        valueStyle={{
                          fontSize: 26,
                          fontWeight: 700,
                          color: '#292929',
                        }}
                      />
                      {card.delta !== 0 && (
                        <div
                          className={`coach-delta ${
                            card.delta > 0 ? 'is-positive' : 'is-negative'
                          }`}
                        >
                          {card.delta > 0 ? '↑' : '↓'}
                          {Math.abs(card.delta)}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                <Card className="coach-data-card" size="small">
                  <div className="coach-data-heading">
                    <TrophyTwoTone twoToneColor={['#ffbc0d', '#da291c']} />
                    <span>业务达成</span>
                  </div>
                  <div className="coach-metrics-grid">
                    {SALES_BREAKDOWN.map((item) => (
                      <div key={item.label} className="coach-metric-cell">
                        <div className="coach-metric-label">
                          {item.label} · vs.{item.target}
                        </div>
                        <div className="coach-metric-value">
                          <strong>{item.value}</strong>
                          <span className={item.delta > 0 ? 'is-positive' : 'is-negative'}>
                            {item.delta > 0 ? '↑' : '↓'}
                            {Math.abs(item.delta)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Divider />

                  <div className="coach-subsection-title">挑战尖峰 GC</div>
                  <div className="coach-slot-grid">
                    {PEAK_SLOTS.map((slot) => {
                      const percent = Math.min(
                        Math.round((slot.actual / slot.target) * 100),
                        100,
                      )
                      return (
                        <div key={slot.label} className="coach-slot-card">
                          <div className="coach-slot-label">{slot.label}</div>
                          <div className="coach-slot-value">
                            <strong>{slot.actual}</strong>
                            <span>vs. {slot.target}</span>
                          </div>
                          <Progress percent={percent} size="small" showInfo={false} />
                        </div>
                      )
                    })}
                  </div>

                  <Divider />

                  <div className="coach-inline-stat">
                    <span>R2P</span>
                    <strong>28s</strong>
                  </div>
                </Card>

                <Card className="coach-data-card" size="small">
                  <div className="coach-data-heading">
                    <BulbOutlined />
                    <span>顾客满意</span>
                  </div>
                  <div className="coach-dual-stat">
                    <div>
                      <div className="coach-mini-label">OSAT · vs. 目标 100</div>
                      <div className="coach-big-value is-positive">100</div>
                    </div>
                    <div>
                      <div className="coach-mini-label">CCC 客诉</div>
                      <div className="coach-big-value">
                        <span className="is-positive">已解决 1</span>
                        <span className="coach-muted-inline"> / 2</span>
                      </div>
                    </div>
                  </div>
                  <div className="coach-badge-row">
                    {CCC_BREAKDOWN.map((item) => (
                      <Tag
                        key={item.level}
                        color={item.tone === 'green' ? 'success' : 'error'}
                        className="coach-pill"
                      >
                        {item.level}：已解决 {item.solved} / 总数 {item.total}
                      </Tag>
                    ))}
                  </div>
                </Card>

                <Card className="coach-data-card" size="small">
                  <div className="coach-data-heading">
                    <TeamOutlined />
                    <span>员工满意</span>
                  </div>
                  <div className="coach-kpi-grid coach-kpi-grid--two">
                    <Card className="coach-mini-card" size="small">
                      <div className="coach-big-value">25%</div>
                      <div className="coach-mini-support">3 认知 / 12 出勤</div>
                      <div className="coach-mini-label">认知员工占比</div>
                    </Card>
                    <Card className="coach-mini-card" size="small">
                      <div className="coach-big-value">108%</div>
                      <div className="coach-mini-support">75.7h / 70h</div>
                      <div className="coach-mini-label">工时达成率</div>
                    </Card>
                  </div>
                </Card>

                <Card className="coach-data-card" size="small">
                  <div className="coach-data-heading">
                    <BarChartOutlined />
                    <span>值班表现</span>
                  </div>
                  <div className="coach-kpi-grid coach-kpi-grid--two">
                    <Card className="coach-mini-card" size="small">
                      <div className="coach-big-value">80%</div>
                      <div className="coach-mini-support">8 完成 / 10 总待办</div>
                      <div className="coach-mini-label">待办完成率</div>
                    </Card>
                    <Card className="coach-mini-card" size="small">
                      <div className="coach-big-value">30%</div>
                      <div className="coach-mini-support">3 @他人 / 10 总待办</div>
                      <div className="coach-mini-label">@他人待办占比</div>
                    </Card>
                  </div>
                </Card>
              </div>
            )}
          </Card>
        </div>

        <section ref={feedbackRef} className="coach-feedback-section">
          <Card className="coach-feedback-card" variant="borderless">
            <div className="coach-overview-header">
              <div className="coach-overview-title">教练反馈</div>
              <Button
                type="text"
                className="coach-ghost-button"
                icon={showTips ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                onClick={() => setShowTips((current) => !current)}
              >
                {showTips ? '收起 Tips' : '展开 Tips'}
              </Button>
            </div>

            {showTips && (
              <Card className="coach-tips-card" size="small">
                <div className="coach-tips-head">SBIA 法则</div>
                <div className="coach-sbia-grid">
                  {[
                    ['Situation', '情景'],
                    ['Behavior', '行为'],
                    ['Impact', '影响'],
                    ['Action', '行动'],
                  ].map(([en, cn]) => (
                    <div key={en} className="coach-sbia-step">
                      <span>{cn}</span>
                      <small>{en}</small>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as TabKey)}
              items={feedbackTabs}
              className="coach-tabs"
            />
          </Card>
        </section>
      </main>

      <Affix offsetBottom={0}>
        <div className="coach-submit-shell">
          <div className="coach-submit-copy">
            <div className="coach-submit-label">填写进度</div>
            <div className="coach-submit-value">
              {completedCount} / {TAB_ORDER.length}
            </div>
          </div>
          <Button type="primary" size="large" onClick={jumpToNext}>
            {allCompleted ? '去提交' : '下一个'}
          </Button>
        </div>
      </Affix>

      {floatTarget && (
        <FloatButton
          icon={floatTarget === 'feedback' ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
          onClick={() =>
            (floatTarget === 'feedback' ? feedbackRef : overviewRef).current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ffbc0d',
          colorSuccess: '#34a853',
          colorError: '#da291c',
          colorBgBase: '#f6f1e7',
          colorTextBase: '#292929',
          borderRadius: 22,
          borderRadiusLG: 30,
          fontFamily:
            '"PingFang SC",-apple-system,BlinkMacSystemFont,"Helvetica Neue","Microsoft YaHei",sans-serif',
        },
      }}
    >
      <AurumApp>
        <CoachFeedbackPage />
      </AurumApp>
    </ConfigProvider>
  )
}
