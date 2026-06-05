import { Card, Table, Tag } from 'antd'
import { useState } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import ApplyRecordsSearchForm from '../../../components/SearchForm/ApplyRecordsSearchForm'

export default function ApplyRecords() {
  const [searchParams, setSearchParams] = useState({
    status: '',
    applyType: '',
    department: '',
    keyword: '',
  })

  const generateData = () => {
    const data = []
    const status = ['待处理', '处理中', '已通过', '已驳回', '已归还']
    const types = ['新设备申请', '外来设备临时使用', '跨部门借用', '设备分类变更']
    const depts = ['检验科', '分子诊断室', '设备科', '质控组']
    const applicants = ['张三', '李四', '王五', '赵六', '钱七']
    const approvers = ['管理员A', '管理员B', '管理员C']
    
    for (let i = 1; i <= 50; i++) {
      const st = status[Math.floor(Math.random() * status.length)]
      const tp = types[Math.floor(Math.random() * types.length)]
      const dept = depts[Math.floor(Math.random() * depts.length)]
      const applicant = applicants[Math.floor(Math.random() * applicants.length)]
      const approver = st !== '待处理' ? approvers[Math.floor(Math.random() * approvers.length)] : '-'
      
      data.push({
        key: String(i),
        applyNo: `APPLY-${String(i).padStart(6, '0')}`,
        applicant,
        department: dept,
        applyType: tp,
        applyContent: `${tp}申请内容描述${i}`,
        applyTime: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        status: st,
        processTime: st !== '待处理' ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '-',
        approver,
        returnTime: st === '已归还' ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : '-',
      })
    }
    return data
  }

  const data = generateData()

  const filteredData = data.filter(item => {
    if (searchParams.status && searchParams.status !== '全部状态' && item.status !== searchParams.status) return false
    if (searchParams.applyType && searchParams.applyType !== '全部类型' && item.applyType !== searchParams.applyType) return false
    if (searchParams.department && searchParams.department !== '全部部门' && item.department !== searchParams.department) return false
    if (searchParams.keyword && !item.applyNo.includes(searchParams.keyword) && !item.applicant.includes(searchParams.keyword)) return false
    return true
  })

  const columns = [
    { title: '申请单号', dataIndex: 'applyNo', key: 'applyNo', width: 150 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '申请类型', dataIndex: 'applyType', key: 'applyType', width: 150 },
    { title: '申请内容', dataIndex: 'applyContent', key: 'applyContent', width: 200 },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
    { 
      title: '处理状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (s: string) => {
        const colors: Record<string, string> = {
          '待处理': 'warning',
          '处理中': 'processing',
          '已通过': 'success',
          '已驳回': 'error',
          '已归还': 'default'
        }
        return <Tag color={colors[s] || 'default'}>{s}</Tag>
      }
    },
    { title: '处理时间', dataIndex: 'processTime', key: 'processTime', width: 160 },
    { title: '审批人', dataIndex: 'approver', key: 'approver', width: 100 },
    { title: '归还时间', dataIndex: 'returnTime', key: 'returnTime', width: 160 },
  ]

  const handleSearch = () => {}
  const handleReset = () => {
    setSearchParams({ status: '', applyType: '', department: '', keyword: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 0 }}>
      <PageTitle>USB申请使用记录</PageTitle>

      <Card style={{ borderRadius: 10, marginBottom: 20, marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <ApplyRecordsSearchForm 
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