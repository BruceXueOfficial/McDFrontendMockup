import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  BellOutlined,
  EllipsisOutlined,
  UserOutlined,
} from '@aurum/icons2'
import {
  App as AurumApp,
  Affix,
  Avatar,
  Button,
  Card,
  ConfigProvider,
  FloatButton,
  Space,
  Tag,
} from '@aurum/pfe-ui'
import FeedbackCard from './components/FeedbackCard'
import OverviewCard from './components/OverviewCard'
import {
  TAB_ORDER,
  countValidChars,
  createDefaultFeedback,
  createTouchedState,
  type GuideTag,
  type TabKey,
} from './data'

function CoachFeedbackPage() {
  const { message } = AurumApp.useApp()
  const [showAi, setShowAi] = useState(true)
  const [showData, setShowData] = useState(true)
  const [showTips, setShowTips] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('dowell')
  const [feedback, setFeedback] = useState(createDefaultFeedback)
  const [touched, setTouched] = useState(createTouchedState)
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
          acc[key] = block.tags.length > 0 && countValidChars(block.text.trim()) >= 20
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
      if (!overview || !feedbackBox) {
        return
      }

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

  const updateTags = (key: TabKey, tag: GuideTag, checked: boolean) => {
    setFeedback((current) => {
      const tags = checked
        ? Array.from(new Set([...current[key].tags, tag]))
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

  const markTouched = (key: TabKey) => {
    setTouched((current) => ({
      ...current,
      [key]: true,
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
      markTouched(activeTab)
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

        <OverviewCard
          ref={overviewRef}
          showAi={showAi}
          showData={showData}
          onToggleAi={setShowAi}
          onToggleData={() => setShowData((current) => !current)}
        />

        <FeedbackCard
          ref={feedbackRef}
          activeTab={activeTab}
          completion={completion}
          feedback={feedback}
          showTips={showTips}
          touched={touched}
          onTabChange={setActiveTab}
          onTagChange={updateTags}
          onTextChange={updateText}
          onTouchedChange={markTouched}
          onToggleTips={() => setShowTips((current) => !current)}
        />
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
