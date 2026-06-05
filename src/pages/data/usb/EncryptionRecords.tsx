import { Card, Table, Tag } from 'antd'
import { useState } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import EncryptionRecordsSearchForm from '../../../components/SearchForm/EncryptionRecordsSearchForm'

export default function EncryptionRecords() {
  const [searchParams, setSearchParams] = useState({
    encryptionStatus: '',
    keyStatus: '',
    department: '',
    keyword: '',
  })

  const generateData = () => {
    const data = []
    const encStatus = ['已加密', '未加密', '加密中', '解密中']
    const keyStatus = ['正常', '即将过期', '已过期']
    const depts = ['检验科', '分子诊断室', '质控组', '试剂科']
    const operators = ['张三', '李四', '王五', '赵六']
    const methods = ['AES-256', 'AES-128', 'RSA-2048']
    
    for (let i = 1; i <= 50; i++) {
      const status = encStatus[Math.floor(Math.random() * encStatus.length)]
      const kStatus = status === '已加密' ? keyStatus[Math.floor(Math.random() * keyStatus.length)] : '-'
      const dept = depts[Math.floor(Math.random() * depts.length)]
      const method = status !== '未加密' ? methods[Math.floor(Math.random() * methods.length)] : '-'
      
      data.push({
        key: String(i),
        deviceId: `USB-${String(i).padStart(4, '0')}`,
        volumeLabel: `加密设备${String(i).padStart(3, '0')}`,
        department: dept,
        encryptionMethod: method,
        encryptionArea: status !== '未加密' ? `${Math.floor(Math.random() * 50) + 10}GB` : '-',
        operator: status !== '未加密' ? operators[Math.floor(Math.random() * operators.length)] : '-',
        startTime: status !== '未加密' ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '-',
        endTime: status === '已加密' ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '-',
        keyStatus: kStatus,
        keyExpireDate: kStatus !== '-' ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : '-',
        status,
      })
    }
    return data
  }

  const data = generateData()

  const filteredData = data.filter(item => {
    if (searchParams.encryptionStatus && searchParams.encryptionStatus !== '全部状态' && item.status !== searchParams.encryptionStatus) return false
    if (searchParams.keyStatus && searchParams.keyStatus !== '全部状态' && item.keyStatus !== searchParams.keyStatus) return false
    if (searchParams.department && searchParams.department !== '全部部门' && item.department !== searchParams.department) return false
    if (searchParams.keyword && !item.deviceId.includes(searchParams.keyword) && !item.volumeLabel.includes(searchParams.keyword)) return false
    return true
  })

  const columns = [
    { title: '设备标识', dataIndex: 'deviceId', key: 'deviceId', width: 120 },
    { title: '卷标', dataIndex: 'volumeLabel', key: 'volumeLabel', width: 120 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '加密方式', dataIndex: 'encryptionMethod', key: 'encryptionMethod', width: 120 },
    { title: '加密区域', dataIndex: 'encryptionArea', key: 'encryptionArea', width: 100 },
    { title: '加密操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '加密开始时间', dataIndex: 'startTime', key: 'startTime', width: 180 },
    { title: '加密完成时间', dataIndex: 'endTime', key: 'endTime', width: 180 },
    { 
      title: '密钥状态', 
      dataIndex: 'keyStatus', 
      key: 'keyStatus', 
      width: 100,
      render: (s: string) => {
        if (s === '-') return s
        const colors: Record<string, string> = {
          '正常': 'success',
          '即将过期': 'warning',
          '已过期': 'error'
        }
        return <Tag color={colors[s] || 'default'}>{s}</Tag>
      }
    },
    { title: '密钥有效期', dataIndex: 'keyExpireDate', key: 'keyExpireDate', width: 120 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (s: string) => {
        const colors: Record<string, string> = {
          '已加密': 'success',
          '未加密': 'default',
          '加密中': 'processing',
          '解密中': 'warning'
        }
        return <Tag color={colors[s] || 'default'}>{s}</Tag>
      }
    },
  ]

  const handleSearch = () => {}
  const handleReset = () => {
    setSearchParams({ encryptionStatus: '', keyStatus: '', department: '', keyword: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <PageTitle>USB加密记录</PageTitle>

      <Card style={{ borderRadius: 10, marginBottom: 20, marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <EncryptionRecordsSearchForm 
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