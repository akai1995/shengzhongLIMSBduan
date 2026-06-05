import { Card, Table, Tag } from 'antd'
import { useState } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import StorageAuditSearchForm from '../../../components/SearchForm/StorageAuditSearchForm'

interface AuditRecord {
  key: string
  deviceId: string
  volumeLabel: string
  category: string
  capacity: string
  department: string
  firstOnlineTime: string
  auditTime: string
  mountPoint: string
  status: string
}

export default function StorageAudit() {
  const [searchParams, setSearchParams] = useState({
    category: '',
    status: '',
    department: '',
    keyword: '',
  })

  const generateData = () => {
    const data: AuditRecord[] = []
    const cats = ['授权U盘', '部门专盘', '临时使用', '外来设备', '加密U盘']
    const stats = ['在线', '离线', '已拦截', '已禁用']
    const depts = ['检验科', '分子诊断室', '微生物室', '质控组', '试剂科', '设备科']
    
    for (let i = 1; i <= 100; i++) {
      const catIndex = i % cats.length
      data.push({
        key: String(i),
        deviceId: `USB${String(i).padStart(4, '0')}`,
        volumeLabel: `存储设备${i}`,
        category: cats[catIndex],
        capacity: `${Math.floor(Math.random() * 128) + 8}GB`,
        department: depts[i % depts.length],
        firstOnlineTime: `2026-0${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        auditTime: `2026-05-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')} 1${Math.floor(Math.random() * 2) + 0}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        mountPoint: `/mnt/usb${i}`,
        status: stats[i % stats.length],
      })
    }
    return data
  }

  const tableData = generateData()

  const filteredData = tableData.filter(item => {
    const matchCategory = !searchParams.category || searchParams.category === '全部分类' || item.category === searchParams.category
    const matchStatus = !searchParams.status || searchParams.status === '全部状态' || item.status === searchParams.status
    const matchDepartment = !searchParams.department || searchParams.department === '全部部门' || item.department === searchParams.department
    const matchKeyword = !searchParams.keyword || 
      item.deviceId.toLowerCase().includes(searchParams.keyword.toLowerCase()) ||
      item.volumeLabel.toLowerCase().includes(searchParams.keyword.toLowerCase())
    return matchCategory && matchStatus && matchDepartment && matchKeyword
  })

  const handleSearch = () => {
  }

  const handleReset = () => {
    setSearchParams({ category: '', status: '', department: '', keyword: '' })
  }

  const columns = [
    { title: '设备标识', dataIndex: 'deviceId', key: 'deviceId', width: 140 },
    { title: '卷标', dataIndex: 'volumeLabel', key: 'volumeLabel', width: 140 },
    { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
    { title: '容量', dataIndex: 'capacity', key: 'capacity', width: 100 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 140 },
    { title: '首次入网时间', dataIndex: 'firstOnlineTime', key: 'firstOnlineTime', width: 160 },
    { title: '审计时间', dataIndex: 'auditTime', key: 'auditTime', width: 180 },
    { title: '挂载点', dataIndex: 'mountPoint', key: 'mountPoint', width: 140 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 120,
      render: (status: string) => {
        const color = {
          '在线': 'success',
          '离线': 'default',
          '已拦截': 'error',
          '已禁用': 'warning',
        }[status] || 'default'
        return <Tag color={color}>{status}</Tag>
      }
    },
  ]

  return (
    <div>
      <PageTitle>移动存储审计</PageTitle>

      <Card style={{ borderRadius: 10, marginBottom: 16, marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <StorageAuditSearchForm 
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
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条记录` }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  )
}