import { Card, Table, Tag } from 'antd'
import { useState } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import DeviceRecordsSearchForm from '../../../components/SearchForm/DeviceRecordsSearchForm'

export default function DeviceRecords() {
  const [searchParams, setSearchParams] = useState({
    category: '',
    department: '',
    status: '',
    keyword: '',
  })

  const generateData = () => {
    const data = []
    const deviceCategories = ['授权U盘', '部门专盘', '临时使用', '加密U盘']
    const deviceDepartments = ['检验科', '分子诊断室', '质控组', '试剂科']
    const deviceStatuses = ['在线', '离线', '已禁用']
    
    for (let i = 1; i <= 50; i++) {
      const category = deviceCategories[Math.floor(Math.random() * deviceCategories.length)]
      const department = deviceDepartments[Math.floor(Math.random() * deviceDepartments.length)]
      const status = deviceStatuses[Math.floor(Math.random() * deviceStatuses.length)]
      const capacity = Math.floor(Math.random() * 64) + 8
      const usedCapacity = Math.floor(Math.random() * capacity)
      
      data.push({
        key: String(i),
        deviceId: `USB-${String(i).padStart(4, '0')}`,
        volumeLabel: `存储设备${String(i).padStart(3, '0')}`,
        department,
        category,
        capacity: `${capacity}GB`,
        usedCapacity: `${usedCapacity}GB`,
        copyCount: Math.floor(Math.random() * 100),
        pasteCount: Math.floor(Math.random() * 100),
        totalUsageTime: `${Math.floor(Math.random() * 1000)}小时`,
        status,
      })
    }
    return data
  }

  const data = generateData()

  const filteredData = data.filter(item => {
    if (searchParams.category && searchParams.category !== '全部分类' && item.category !== searchParams.category) return false
    if (searchParams.department && searchParams.department !== '全部部门' && item.department !== searchParams.department) return false
    if (searchParams.status && searchParams.status !== '全部状态' && item.status !== searchParams.status) return false
    if (searchParams.keyword && !item.deviceId.includes(searchParams.keyword) && !item.volumeLabel.includes(searchParams.keyword)) return false
    return true
  })

  const columns = [
    { title: '设备标识', dataIndex: 'deviceId', key: 'deviceId', width: 120 },
    { title: '卷标', dataIndex: 'volumeLabel', key: 'volumeLabel', width: 120 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '设备分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '容量', dataIndex: 'capacity', key: 'capacity', width: 80 },
    { title: '已用容量', dataIndex: 'usedCapacity', key: 'usedCapacity', width: 100 },
    { title: '复制次数', dataIndex: 'copyCount', key: 'copyCount', width: 80 },
    { title: '粘贴次数', dataIndex: 'pasteCount', key: 'pasteCount', width: 80 },
    { title: '累计使用时长', dataIndex: 'totalUsageTime', key: 'totalUsageTime', width: 120 },
    { 
      title: '当前状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (s: string) => {
        const colors: Record<string, string> = {
          '在线': 'success',
          '离线': 'default',
          '已禁用': 'error'
        }
        return <Tag color={colors[s] || 'default'}>{s}</Tag>
      }
    },
  ]

  const handleSearch = () => {}
  const handleReset = () => {
    setSearchParams({ category: '', department: '', status: '', keyword: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <PageTitle>存储设备记录</PageTitle>

      <Card style={{ borderRadius: 10, marginBottom: 20, marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <DeviceRecordsSearchForm 
          searchParams={searchParams}
          onSearchParamsChange={setSearchParams}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 'max-content' }}
          pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (t) => `共 ${t} 条`, pageSize: 10 }}
        />
      </Card>
    </div>
  )
}