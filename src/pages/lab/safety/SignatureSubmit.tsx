import { Card, Form, Button, Input } from 'antd'
import { UserOutlined, SignatureOutlined } from '@ant-design/icons'

export default function SignatureSubmit() {
  const [form] = Form.useForm()

  const handleSubmit = () => {
    form.validateFields().then(() => {
      console.log('表单提交成功')
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>安全承诺书签署</h1>
      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 24, padding: 20, border: '1px solid #e8e8e8', borderRadius: 8 }}>
          <h3 style={{ marginBottom: 16 }}>实验室安全承诺书</h3>
          <p style={{ marginBottom: 12, lineHeight: '1.8' }}>
            本人承诺严格遵守实验室各项安全规章制度，正确使用实验设备和化学品，
            自觉维护实验室安全环境，如有违反，愿意承担相应责任。
          </p>
          <p style={{ lineHeight: '1.8' }}>
            承诺人：_______________
          </p>
        </div>
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="name" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input prefix={<UserOutlined />} placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="部门" name="department">
            <Input placeholder="请输入部门" />
          </Form.Item>
          <Form.Item label="签名" name="signature">
            <Input prefix={<SignatureOutlined />} placeholder="请输入签名" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>提交签署</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
