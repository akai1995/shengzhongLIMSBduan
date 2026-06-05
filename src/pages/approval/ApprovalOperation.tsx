import { Card, Form, Input, Button, DatePicker, Row, Col, Select } from 'antd'
import { PlusOutlined, SendOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'

export default function ApprovalOperation() {
  const { isDark } = useThemeStore()

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 20 }}>审批操作</h1>
      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form layout="vertical" size="middle">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="审批事项" name="title">
                <Select placeholder="请选择审批事项" options={[
                  { value: 'project', label: '项目立项申请' },
                  { value: 'reagent', label: '试剂采购申请' },
                  { value: 'equipment', label: '设备预约申请' },
                  { value: 'fund', label: '经费使用申请' },
                  { value: 'leave', label: '外出学习申请' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申请日期" name="date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item label="申请理由" name="reason">
                <Input.TextArea placeholder="请输入申请理由" rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={24}>
              <Form.Item label="附件上传" name="attachment">
                <Input type="file" style={{ display: 'none' }} />
                <Button icon={<PlusOutlined />}>上传附件</Button>
              </Form.Item>
            </Col>
          </Row>
          <Row justify="flex-end" gutter={10}>
            <Col><Button>取消</Button></Col>
            <Col><Button type="primary" icon={<SendOutlined />}>提交申请</Button></Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}