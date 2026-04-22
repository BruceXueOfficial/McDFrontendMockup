import { forwardRef } from 'react'
import {
  Button,
  Card,
  Collapse,
  Divider,
  Progress,
  Space,
  Statistic,
  Tag,
} from '@aurum/pfe-ui'
import {
  AiMessageOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BarChartOutlined,
  BulbOutlined,
  TeamOutlined,
  TrophyTwoTone,
} from '@aurum/icons2'
import {
  AI_SUMMARY,
  CCC_BREAKDOWN,
  PEAK_SLOTS,
  PERFORMANCE_CARDS,
  SALES_BREAKDOWN,
} from '../data'

type OverviewCardProps = {
  showAi: boolean
  showData: boolean
  onToggleAi: (isOpen: boolean) => void
  onToggleData: () => void
}

const OverviewCard = forwardRef<HTMLDivElement, OverviewCardProps>(
  function OverviewCard({ showAi, showData, onToggleAi, onToggleData }, ref) {
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

    return (
      <div ref={ref}>
        <Card className="coach-overview-card" variant="borderless">
          <div className="coach-overview-header">
            <div className="coach-overview-title">值班总览</div>
            <Tag color={showData ? 'success' : 'default'}>
              {showData ? '数据已展开' : '数据已折叠'}
            </Tag>
          </div>

          <Collapse
            activeKey={showAi ? ['summary'] : []}
            onChange={(keys) => onToggleAi(Array.isArray(keys) && keys.length > 0)}
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
              onClick={onToggleData}
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
    )
  },
)

export default OverviewCard
