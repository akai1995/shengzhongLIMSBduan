import { Card, Table, Tag } from 'antd'
import { useState } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import FileRecordsSearchForm from '../../../components/SearchForm/FileRecordsSearchForm'

export default function FileRecords() {
  const [searchParams, setSearchParams] = useState({
    operationType: '',
    status: '',
    keyword: '',
  })

  const generateData = () => {
    const data = []
    const ops = ['拷贝入U盘', '从U盘拷出', '删除文件', '重命名', '格式化']
    const status = ['成功', '已拦截', '失败']
    
    for (let i = 1; i <= 50; i++) {
      const op = ops[Math.floor(Math.random() * ops.length)]
      const st = status[Math.floor(Math.random() * status.length)]
      
      data.push({
        key: String(i),
        recordId: `REC-${String(i).padStart(6, '0')}`,
        deviceId: `USB-${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`,
        operationType: op,
        fileName: `file${String(i).padStart(3, '0')}.${['txt', 'doc', 'pdf', 'xlsx', 'zip'][Math.floor(Math.random() * 5)]}`,
        sourcePath: `/home/user/docs/${['report', 'data', 'backup', 'temp'][Math.floor(Math.random() * 4)]}`,
        targetPath: `/mnt/usb${Math.floor(Math.random() * 10) + 1}/`,
        fileSize: `${(Math.random() * 100).toFixed(2)}MB`,
        operator: ['张三', '李四', '王五', '赵六', '钱七'][Math.floor(Math.random() * 5)],
        operationTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status: st,
      })
    }
    return data
  }

  const data = generateData()

  const filteredData = data.filter(item => {
    if (searchParams.operationType && searchParams.operationType !== '全部类型' && item.operationType !== searchParams.operationType) return false
    if (searchParams.status && searchParams.status !== '全部状态' && item.status !== searchParams.status) return false
    if (searchParams.keyword && !item.sourcePath.includes(searchParams.keyword) && !item.fileName.includes(searchParams.keyword)) return false
    return true
  })

  const columns = [
    { title: '记录ID', dataIndex: 'recordId', key: 'recordId', width: 120 },
    { title: '设备标识', dataIndex: 'deviceId', key: 'deviceId', width: 120 },
    { title: '操作类型', dataIndex: 'operationType', key: 'operationType', width: 120 },
    { title: '文件名', dataIndex: 'fileName', key: 'fileName', width: 150 },
    { title: '源路径', dataIndex: 'sourcePath', key: 'sourcePath', width: 200 },
    { title: '目标路径', dataIndex: 'targetPath', key: 'targetPath', width: 200 },
    { title: '文件大小', dataIndex: 'fileSize', key: 'fileSize', width: 100 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 80 },
    { title: '操作时间', dataIndex: 'operationTime', key: 'operationTime', width: 180 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (s: string) => {
        const colors: Record<string, string> = {
          '成功': 'green',
          '已拦截': 'red',
          '失败': 'orange'
        }
        return <Tag color={colors[s] || 'default'}>{s}</Tag>
      }
    },
  ]

  const handleSearch = () => {}
  const handleReset = () => {
    setSearchParams({ operationType: '', status: '', keyword: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <PageTitle>文件操作记录</PageTitle>

      <Card style={{ borderRadius: 10, marginBottom: 20, marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <FileRecordsSearchForm 
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