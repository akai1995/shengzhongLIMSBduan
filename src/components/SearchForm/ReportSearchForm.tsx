import { Form, Select, DatePicker, Button, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

interface ReportSearchFormProps {
  form: any
  loading: boolean
  onSearch: () => void
  onReset: () => void
  onRefresh: () => void
}

const areas = ['实验室A101', '实验室A102', '实验室B101', '实验室B102', '洁净区C01', '走廊D01']

const deviceOptions = [
  { value: '消毒灯A01', label: '消毒灯A01' },
  { value: '消毒灯A02', label: '消毒灯A02' },
  { value: '消毒灯B01', label: '消毒灯B01' },
  { value: '消毒灯B02', label: '消毒灯B02' },
  { value: '消毒灯C01', label: '消毒灯C01' },
  { value: '消毒灯D01', label: '消毒灯D01' },
]

export default function ReportSearchForm({
  form,
  loading,
  onSearch,
  onReset,
  onRefresh,
}: ReportSearchFormProps) {
  return (
    <Form form={form} layout="inline" style={{ gap: 16, alignItems: 'center' }}>
      <Form.Item name="dateRange" label="时间范围">
        <RangePicker style={{ width: 300 }} placeholder={['开始日期', '结束日期']} />
      </Form.Item>
      <Form.Item name="area" label="选择区域">
        <Select placeholder="请选择区域" style={{ width: 180 }}>
          <Select.Option value="all">全部区域</Select.Option>
          {areas.map(area => (
            <Select.Option key={area} value={area}>{area}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="devices" label="选择设备">
        <Select placeholder="请选择设备" style={{ width: 180 }} mode="multiple">
          {deviceOptions.map(device => (
            <Select.Option key={device.value} value={device.value}>{device.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="result" label="消毒结果">
        <Select placeholder="请选择消毒结果" style={{ width: 180 }}>
          <Select.Option value="all">全部结果</Select.Option>
          <Select.Option value="normal">正常消毒</Select.Option>
          <Select.Option value="interrupt">消毒中断</Select.Option>
          <Select.Option value="unfinished">未完成</Select.Option>
        </Select>
      </Form.Item>
      <Space>
        <Button type="primary" onClick={onSearch} loading={loading}>查询</Button>
        <Button onClick={onReset}>重置</Button>
        <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>刷新</Button>
      </Space>
    </Form>
  )
}