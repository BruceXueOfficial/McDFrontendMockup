import { useState, forwardRef, type ComponentType } from 'react'
import { DownOutlined } from '@aurum/icons2'

interface AiLine { bold: string; text: string }
interface Icons { robot: ComponentType<any>; pie: ComponentType<any>; smile: ComponentType<any>; heart: ComponentType<any>; dashboard: ComponentType<any> }

const OverviewCard = forwardRef<HTMLDivElement, { aiLines: AiLine[]; icons: Icons }>(({ aiLines, icons }, ref) => {
  const [ovOpen, setOvOpen] = useState(true)
  const [aiOpen, setAiOpen] = useState(true)
  const [dataOpen, setDataOpen] = useState(false)
  const { robot: Robot, pie: Pie, smile: Smile, heart: Heart, dashboard: Dashboard } = icons

  return (
    <div className="card" style={{ padding: 0 }} ref={ref}>
      <div className="ov-hdr">
        <div className="ov-left"><span className="ov-title">值班总览</span></div>
        <button className={`ov-tog${ovOpen ? '' : ' flip'}`} onClick={() => setOvOpen(!ovOpen)}>
          <DownOutlined style={{ fontSize: 18, color: 'var(--g5)' }} />
        </button>
      </div>
      <div className={`ov-body${ovOpen ? '' : ' hide'}`}>
        {/* AI 总结 */}
        <div className="ai">
          <div className="ai-hdr" onClick={() => setAiOpen(!aiOpen)}>
            <div className="ib" style={{ background: '#fff' }}><Robot style={{ fontSize: 18, color: '#FFBC0D' }} /></div>
            <span className="ai-lbl">AI 总结</span>
            <span className="ai-tg">{aiOpen ? '收起' : '展开'}</span>
            <DownOutlined className="ai-chv" style={{ fontSize: 14, color: 'var(--g5)', transform: aiOpen ? undefined : 'rotate(180deg)' }} />
          </div>
          {aiOpen && (
            <div className="ai-txt">
              <ul>{aiLines.map((l, i) => <li key={i} style={i > 0 ? { marginTop: 4 } : undefined}><b>{l.bold}</b><span>{l.text}</span></li>)}</ul>
            </div>
          )}
        </div>
        {/* 数据展示 */}
        <div className="dh">
          <span>数据展示</span>
          <button className="dt" onClick={() => setDataOpen(!dataOpen)}>
            <span>{dataOpen ? '收起' : '展开'}</span>
            <DownOutlined style={{ fontSize: 14, transition: 'transform .3s', transform: dataOpen ? undefined : 'rotate(180deg)' }} />
          </button>
        </div>
        {dataOpen && <DataBody icons={{ pie: Pie, smile: Smile, heart: Heart, dashboard: Dashboard }} />}
      </div>
    </div>
  )
})

OverviewCard.displayName = 'OverviewCard'
export default OverviewCard

function DataBody({ icons }: { icons: { pie: ComponentType<any>; smile: ComponentType<any>; heart: ComponentType<any>; dashboard: ComponentType<any> } }) {
  const { pie: Pie, smile: Smile, heart: Heart, dashboard: Dashboard } = icons
  return (
    <div>
      <div className="dim">
        <div className="dim-hdr"><div className="ib"><Pie style={{ fontSize: 18, color: '#FFBC0D' }} /></div><span className="dim-t">业务达成</span></div>
        <div className="mr" style={{ border: 'none' }}><div><div className="ml-b">班次 Sales</div></div><div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span className="mv">12940</span><span className="md md-d">↓682</span></div></div>
        <div className="g2" style={{ margin: '6px 0' }}>
          <div className="g2i"><div className="g2n">FC Sales · vs.5500</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">5284</span><span className="g2f" style={{ color: 'var(--r)' }}>↓216</span></div></div>
          <div className="g2i"><div className="g2n">MDS Sales · vs.6200</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">6503</span><span className="g2f" style={{ color: 'var(--gn)' }}>↑303</span></div></div>
          <div className="g2i"><div className="g2n">Kiosk Sales · vs.50</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">46</span><span className="g2f" style={{ color: 'var(--r)' }}>↓4</span></div></div>
          <div className="g2i"><div className="g2n">McCafe Sales · vs.1150</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">1107</span><span className="g2f" style={{ color: 'var(--r)' }}>↓43</span></div></div>
        </div>
        <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px solid var(--g2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}><div><div className="ml-b">挑战尖峰 GC <span className="ms" style={{ marginLeft: 6 }}>vs. 目标 358</span></div></div><div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span className="mv">346</span><span className="md md-d">↓12</span></div></div>
          <div className="g2" style={{ marginTop: 6 }}>
            <div className="g2i"><div className="g2t"><span className="g2d" style={{ background: 'var(--gn)' }} />08:00-09:00</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">105</span><span className="g2f" style={{ color: 'var(--r)' }}>↓18</span><span className="g2n" style={{ marginLeft: 4 }}>vs.123</span></div></div>
            <div className="g2i"><div className="g2t"><span className="g2d" style={{ background: 'var(--y)' }} />11:00-12:00</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">108</span><span className="g2f" style={{ color: 'var(--gn)' }}>↑31</span><span className="g2n" style={{ marginLeft: 4 }}>vs.77</span></div></div>
            <div className="g2i"><div className="g2t"><span className="g2d" style={{ background: 'var(--or)' }} />12:00-13:00</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">100</span><span className="g2f" style={{ color: 'var(--r)' }}>↓19</span><span className="g2n" style={{ marginLeft: 4 }}>vs.119</span></div></div>
            <div className="g2i"><div className="g2t"><span className="g2d" style={{ background: 'var(--r)' }} />13:00-14:00</div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span className="g2v">33</span><span className="g2f" style={{ color: 'var(--r)' }}>↓6</span><span className="g2n" style={{ marginLeft: 4 }}>vs.39</span></div></div>
          </div>
        </div>
        <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px solid var(--g2)' }}>
          <div className="mr" style={{ border: 'none' }}><div><div className="ml-b">R2P</div></div><div><span className="mv">28<span style={{ fontSize: 13, color: 'var(--g5)' }}>s</span></span></div></div>
        </div>
      </div>
      <div className="dim">
        <div className="dim-hdr"><div className="ib"><Smile style={{ fontSize: 18, color: '#DA291C' }} /></div><span className="dim-t">客户满意</span></div>
        <div className="mr"><div><div className="ml-b">OSAT <span className="ms" style={{ marginLeft: 6 }}>vs. 目标 100</span></div></div><div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}><span className="mv" style={{ color: 'var(--gn)' }}>100</span></div></div>
        <div className="mr" style={{ border: 'none' }}><div><div className="ml-b">CCC 客诉</div></div><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span style={{ fontSize: 14, fontWeight: 700, color: 'var(--gn)' }}>已解决 1</span><span style={{ fontSize: 14, color: 'var(--g4)' }}>/</span><span style={{ fontSize: 14, fontWeight: 700, color: 'var(--r)' }}>2</span></div></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, marginTop: 4 }}>
          <div style={{ padding: '6px 10px 6px 0' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ background: 'var(--gn)', color: '#fff', padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>L3</span><span style={{ fontSize: 10 }}><span style={{ color: 'var(--gn)' }}>已解决 1</span> <span style={{ color: 'var(--g4)' }}>/</span> <span style={{ color: 'var(--r)' }}>总数 1</span></span></div></div>
          <div style={{ padding: '6px 0 6px 10px' }}><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ background: 'var(--r)', color: '#fff', padding: '1px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>L4</span><span style={{ fontSize: 10 }}><span style={{ color: 'var(--gn)' }}>已解决 0</span> <span style={{ color: 'var(--g4)' }}>/</span> <span style={{ color: 'var(--r)' }}>总数 1</span></span></div></div>
        </div>
      </div>
      <div className="dim">
        <div className="dim-hdr"><div className="ib"><Heart style={{ fontSize: 18, color: '#DA291C' }} /></div><span className="dim-t">员工满意</span></div>
        <div className="sr">
          <div className="sc"><div className="sp">25%</div><div className="sw">3认知 / 12出勤</div><div className="sl">认知员工占比</div></div>
          <div className="sc"><div className="sp">108%</div><div className="sw">实際75.7h / 排班70h</div><div className="sl">工时达成率</div></div>
        </div>
      </div>
      <div className="dim">
        <div className="dim-hdr"><div className="ib"><Dashboard style={{ fontSize: 18, color: '#FFBC0D' }} /></div><span className="dim-t">值班表现</span></div>
        <div className="sr">
          <div className="sc"><div className="sp">80%</div><div className="sw">8完成 / 10总待办</div><div className="sl">待办完成率</div></div>
          <div className="sc"><div className="sp">30%</div><div className="sw">3@他人 / 10总待办</div><div className="sl">@他人待办占比</div></div>
        </div>
      </div>
    </div>
  )
}
