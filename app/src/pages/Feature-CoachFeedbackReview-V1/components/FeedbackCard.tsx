import { forwardRef } from 'react'
import { ArrowDownOutlined, ArrowUpOutlined, CheckCircleTwoTone } from '@aurum/icons2'
import { Button, Card, Input, Tabs, Tag } from '@aurum/pfe-ui'
import {
  GUIDE_MAP,
  GUIDE_TAGS,
  TAB_META,
  TAB_ORDER,
  countValidChars,
  type FeedbackBlock,
  type GuideTag,
  type TabKey,
} from '../data'

type FeedbackCardProps = {
  activeTab: TabKey
  completion: Record<TabKey, boolean>
  feedback: Record<TabKey, FeedbackBlock>
  showTips: boolean
  touched: Record<TabKey, boolean>
  onTabChange: (key: TabKey) => void
  onTagChange: (key: TabKey, tag: GuideTag, checked: boolean) => void
  onTextChange: (key: TabKey, text: string) => void
  onTouchedChange: (key: TabKey) => void
  onToggleTips: () => void
}

const FeedbackCard = forwardRef<HTMLElement, FeedbackCardProps>(function FeedbackCard(
  {
    activeTab,
    completion,
    feedback,
    showTips,
    touched,
    onTabChange,
    onTagChange,
    onTextChange,
    onTouchedChange,
    onToggleTips,
  },
  ref,
) {
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
            {GUIDE_TAGS.map((tag) => (
              <Tag.CheckableTag
                key={tag}
                checked={block.tags.includes(tag)}
                onChange={(checked) => onTagChange(key, tag, checked)}
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
            onChange={(event) => onTextChange(key, event.target.value)}
            onBlur={() => onTouchedChange(key)}
            autoSize={{ minRows: 7, maxRows: 12 }}
            disabled={block.tags.length === 0}
            placeholder={
              block.tags.length === 0 ? '请先选择标签后再填写反馈' : '请在这里输入反馈内容'
            }
            status={shouldShowError ? 'error' : undefined}
            className="coach-textarea"
          />

          <div className="coach-input-footer">
            <span className={shouldShowError ? 'is-error' : ''}>有效字符 {validChars}</span>
            {shouldShowError && <span>中文、字母、数字总数不满 20 个无法提交</span>}
          </div>
        </div>
      ),
    }
  })

  return (
    <section ref={ref} className="coach-feedback-section">
      <Card className="coach-feedback-card" variant="borderless">
        <div className="coach-overview-header">
          <div className="coach-overview-title">教练反馈</div>
          <Button
            type="text"
            className="coach-ghost-button"
            icon={showTips ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            onClick={onToggleTips}
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
          onChange={(key) => onTabChange(key as TabKey)}
          items={feedbackTabs}
          className="coach-tabs"
        />
      </Card>
    </section>
  )
})

export default FeedbackCard
