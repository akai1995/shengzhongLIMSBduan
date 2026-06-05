import { Card, Statistic, Row, Col } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined, WarningOutlined } from '@ant-design/icons'

export default function SmartAnalysis() {
  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>智能分析</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card bodyStyle={{ padding: 20 }} title="设备利用率" style={{ borderRadius: 10 }}>
            <Statistic value={85} suffix="%" />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', color: '#52C41A' }}>
              <ArrowUpOutlined />
              <span style={{ marginLeft: 8 }}>较上月增长 5%</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: 20 }} title="能耗分析" style={{ borderRadius: 10 }}>
            <Statistic value={2450} prefix="¥" />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', color: '#FA8C16' }}>
              <ArrowDownOutlined />
              <span style={{ marginLeft: 8 }}>较上月降低 3%</span>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bodyStyle={{ padding: 20 }} title="异常预警" style={{ borderRadius: 10 }}>
            <Statistic value={2} />
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', color: '#ff4d4f' }}>
              <WarningOutlined />
              <span style={{ marginLeft: 8 }}>需要处理</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
