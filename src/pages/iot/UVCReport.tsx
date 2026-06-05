import { Card, Table, Tag, message, Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'
import ReportSearchForm from '../../components/SearchForm/ReportSearchForm'
import { Form } from 'antd'

export default function UVCReport() {
  const [form] = Form.useForm()
  const [searchParams, setSearchParams] = useState({
    dateRange: null,
    area: '',
    devices: [],
    result: '',
  })
  const [loading, setLoading] = useState(false)

  const generateReportData = () => {
    const data = []
    const areas = ['实验室A101', '实验室A102', '实验室B101', '实验室B102', '洁净区C01', '走廊D01']
    const devices = [
      { name: '消毒灯A01', area: '实验室A101' },
      { name: '消毒灯A02', area: '实验室A101' },
      { name: '消毒灯B01', area: '实验室B101' },
      { name: '消毒灯B02', area: '实验室B102' },
      { name: '消毒灯C01', area: '洁净区C01' },
      { name: '消毒灯D01', area: '走廊D01' },
    ]
    const triggers = ['定时任务', '远程开启', '手动', '自动']
    const operators = ['系统', '张三', '李四', '王五', '赵六']
    const statuses = ['正常完成', '异常中断', '未完成']

    for (let i = 1; i <= 50; i++) {
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      const dateStr = date.toLocaleDateString('zh-CN').replace(/\//g, '-')
      
      const device = devices[Math.floor(Math.random() * devices.length)]
      const startHour = String(Math.floor(Math.random() * 24)).padStart(2, '0')
      const startMinute = String(Math.floor(Math.random() * 60)).padStart(2, '0')
      const startTime = `${startHour}:${startMinute}:00`
      
      const duration = Math.floor(Math.random() * 60) + 15
      const endDate = new Date(date.getTime() + duration * 60 * 1000)
      const endHour = String(endDate.getHours()).padStart(2, '0')
      const endMinute = String(endDate.getMinutes()).padStart(2, '0')
      const endTime = `${endHour}:${endMinute}:00`
      
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      data.push({
        key: String(i),
        index: i,
        date: dateStr,
        area: device.area,
        device: device.name,
        startTime,
        endTime,
        duration: `${duration}分钟`,
        status,
        trigger: triggers[Math.floor(Math.random() * triggers.length)],
        operator: operators[Math.floor(Math.random() * operators.length)],
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 30) + 50,
        remark: status === '异常中断' ? ['设备故障', '网络断开', '人为干预', '定时到期'][Math.floor(Math.random() * 4)] : '-',
      })
    }
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const allData = useMemo(() => generateReportData(), [])

  const filteredData = useMemo(() => {
    return allData.filter(item => {
      if (searchParams.area && searchParams.area !== 'all' && item.area !== searchParams.area) {
        return false
      }
      if (searchParams.devices.length > 0 && !searchParams.devices.includes(item.device)) {
        return false
      }
      if (searchParams.result) {
        if (searchParams.result === 'normal' && item.status !== '正常完成') return false
        if (searchParams.result === 'interrupt' && item.status !== '异常中断') return false
        if (searchParams.result === 'unfinished' && item.status !== '未完成') return false
      }
      if (searchParams.dateRange && searchParams.dateRange.length === 2) {
        const itemDate = new Date(item.date)
        if (itemDate < searchParams.dateRange[0] || itemDate > searchParams.dateRange[1]) {
          return false
        }
      }
      return true
    })
  }, [allData, searchParams])

  const stats = useMemo(() => {
    const totalHours = Math.floor(filteredData.reduce((sum, item) => sum + parseInt(item.duration), 0) / 60)
    const totalCount = filteredData.length
    const thisMonthCount = filteredData.filter(item => {
      const itemDate = new Date(item.date)
      const now = new Date()
      return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
    }).length
    const avgDuration = totalCount > 0 ? Math.floor(filteredData.reduce((sum, item) => sum + parseInt(item.duration), 0) / totalCount) : 0

    return [
      { label: '累计运行时长', value: `${totalHours}小时`, icon: 'clock' },
      { label: '累计开启次数', value: `${totalCount}次`, icon: 'power' },
      { label: '本月消毒次数', value: `${thisMonthCount}次`, icon: 'calendar' },
      { label: '平均每次时长', value: `${avgDuration}分钟`, icon: 'timer' },
    ]
  }, [filteredData])

  const columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
    { title: '消毒日期', dataIndex: 'date', key: 'date', width: 120 },
    { title: '消毒区域', dataIndex: 'area', key: 'area', width: 120 },
    { title: '设备名称', dataIndex: 'device', key: 'device', width: 120 },
    { title: '开启时间', dataIndex: 'startTime', key: 'startTime', width: 100 },
    { title: '关闭时间', dataIndex: 'endTime', key: 'endTime', width: 100 },
    { title: '消毒时长', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: '运行状态', dataIndex: 'status', key: 'status', width: 100, render: (s: string) => (
      <Tag color={s === '正常完成' ? 'success' : s === '异常中断' ? 'error' : 'warning'}>{s}</Tag>
    )},
    { title: '触发方式', dataIndex: 'trigger', key: 'trigger', width: 100 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '温度(°C)', dataIndex: 'temperature', key: 'temperature', width: 100 },
    { title: '湿度(%)', dataIndex: 'humidity', key: 'humidity', width: 100 },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 150 },
  ]

  const handleSearch = () => {
    form.validateFields().then(values => {
      setLoading(true)
      setTimeout(() => {
        setSearchParams({
          dateRange: values.dateRange || null,
          area: values.area || '',
          devices: values.devices || [],
          result: values.result || '',
        })
        setLoading(false)
        message.success('查询成功')
      }, 500)
    })
  }

  const handleReset = () => {
    form.resetFields()
    setSearchParams({
      dateRange: null,
      area: '',
      devices: [],
      result: '',
    })
    message.info('已重置查询条件')
  }

  const handleExport = () => {
    setLoading(true)
    setTimeout(() => {
      const csvContent = [
        ['序号', '消毒日期', '消毒区域', '设备名称', '开启时间', '关闭时间', '消毒时长', '运行状态', '触发方式', '操作人', '温度(°C)', '湿度(%)', '备注']
          .join(','),
        ...filteredData.map(item => [
          item.index,
          item.date,
          item.area,
          item.device,
          item.startTime,
          item.endTime,
          item.duration,
          item.status,
          item.trigger,
          item.operator,
          item.temperature,
          item.humidity,
          `"${item.remark}"`
        ].join(','))
      ].join('\n')
      
      const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `感控台账报表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setLoading(false)
      message.success('导出成功')
    }, 1000)
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      handleReset()
      message.success('数据已刷新')
    }, 500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 0 }}>
      <PageTitle>感控台账报表</PageTitle>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {stats.map((stat, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, backgroundColor: '#E7F2FB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24 }}>📊</span>
              </div>
              <div>
                <div style={{ color: '#8C8C8C', fontSize: 14 }}>{stat.label}</div>
                <div style={{ fontWeight: 600, fontSize: 18 }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <ReportSearchForm
          form={form}
          loading={loading}
          onSearch={handleSearch}
          onReset={handleReset}
          onRefresh={handleRefresh}
        />
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} loading={loading}>导出报表</Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 'max-content' }}
          loading={loading}
          pagination={{ 
            showSizeChanger: true, 
            showQuickJumper: true, 
            showTotal: (total) => `共 ${total} 条记录`,
            pageSize: 10 
          }}
        />
      </Card>
    </div>
  )
}