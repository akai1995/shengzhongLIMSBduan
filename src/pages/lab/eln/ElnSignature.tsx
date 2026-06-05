import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Space, message, Row, Col } from 'antd'
import { EyeOutlined, SearchOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'

const { Option } = Select
const { RangePicker } = DatePicker

export default function ElnSignature() {
  const [searchForm] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentSignature, setCurrentSignature] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [tableData, setTableData] = useState([
    {
      key: '1',
      id: 'SIG2026001',
      recordName: '细胞培养实验记录',
      recordId: 'ELN2026001',
      signer: '张医生',
      signTime: '2026-05-15 14:30:00',
      hash: '0x7f9a8b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a',
    },
    {
      key: '2',
      id: 'SIG2026002',
      recordName: 'PCR扩增实验记录',
      recordId: 'ELN2026002',
      signer: '李医生',
      signTime: '2026-05-14 10:15:00',
      hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    },
  ])

  useEffect(() => {
    if (tableData.length === 2) {
      const newData = Array.from({ length: 98 }, (_, i) => {
        const names = ['Western Blot实验记录', '免疫组化实验记录', '动物实验记录', '临床样本处理记录', '数据统计分析记录', '试剂配制记录']
        const signers = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生']
        return {
          key: String(i + 3),
          id: `SIG2026${String(i + 3).padStart(4, '0')}`,
          recordName: names[i % names.length] + (i > 5 ? `-${Math.floor(i / 6) + 1}` : ''),
          recordId: `ELN2026${String(i + 100).padStart(4, '0')}`,
          signer: signers[i % signers.length],
          signTime: `2026-05-${String(1 + (i % 28)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String(10 + (i % 30)).padStart(2, '0')}:00`,
          hash: `0x${Array.from({ length: 64 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')}`,
        }
      })
      const allData = [...tableData, ...newData]
      setTableData(allData)
      setFilteredData(allData)
    } else {
      setFilteredData(tableData)
    }
  }, [tableData])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...tableData]
    
    if (values.recordId) {
      result = result.filter(item => item.recordId.includes(values.recordId))
    }
    if (values.signer) {
      result = result.filter(item => item.signer.includes(values.signer))
    }
    if (values.signTimeRange && values.signTimeRange.length === 2) {
      const startDate = values.signTimeRange[0].format('YYYY-MM-DD HH:mm:ss')
      const endDate = values.signTimeRange[1].format('YYYY-MM-DD HH:mm:ss')
      result = result.filter(item => item.signTime >= startDate && item.signTime <= endDate)
    }
    
    setFilteredData(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredData([...tableData])
  }

  const columns = [
    { title: '签名ID', dataIndex: 'id', key: 'id', width: 140 },
    { title: '实验记录名称', dataIndex: 'recordName', key: 'recordName', width: 220 },
    { title: '实验记录ID', dataIndex: 'recordId', key: 'recordId', width: 140 },
    { title: '签名人', dataIndex: 'signer', key: 'signer', width: 120 },
    { title: '签名时间', dataIndex: 'signTime', key: 'signTime', width: 180 },
    { 
      title: '签名哈希值', 
      dataIndex: 'hash', 
      key: 'hash', 
      width: 280,
      render: (hash: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
          {hash.slice(0, 16)}...{hash.slice(-8)}
        </span>
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 140, 
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
      )
    },
  ]

  const handleViewDetail = (record: any) => {
    setCurrentSignature(record)
    setDetailModalVisible(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>电子签名记录</PageTitle>

      <Card style={{ marginBottom: 20, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="实验记录ID" name="recordId"><Input placeholder="请输入实验记录ID" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="签名人" name="signer"><Input placeholder="请输入签名人" /></Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="时间范围" name="signTimeRange">
                  <RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            )}
          </Row>
          
          {expanded && (
            <Row gutter={16} style={{ height: '32px', marginTop: '20px' }}>
              <Col span={6}>
                <Form.Item label="时间范围" name="signTimeRange">
                  <RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6} offset={12}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      <Modal
        title="签名详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentSignature && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>签名信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><strong>签名ID：</strong>{currentSignature.id}</div>
              <div><strong>实验记录名称：</strong>{currentSignature.recordName}</div>
              <div><strong>实验记录ID：</strong>{currentSignature.recordId}</div>
              <div><strong>签名人：</strong>{currentSignature.signer}</div>
              <div><strong>签名时间：</strong>{currentSignature.signTime}</div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>电子签名</h4>
              <div style={{ 
                border: '1px solid #e8e8e8', 
                borderRadius: 8, 
                padding: 24, 
                textAlign: 'center',
                background: '#fafafa'
              }}>
                <div style={{ 
                  width: 200, 
                  height: 100, 
                  border: '1px dashed #d9d9d9', 
                  borderRadius: 4, 
                  margin: '0 auto 12px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff'
                }}>
                  <span style={{ color: '#8c8c8c' }}>签名图片预览</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>签名哈希值</h4>
              <div style={{ 
                border: '1px solid #e8e8e8', 
                borderRadius: 8, 
                padding: 16, 
                fontFamily: 'monospace', 
                fontSize: '12px',
                wordBreak: 'break-all',
                background: '#f5f5f5'
              }}>
                {currentSignature.hash}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>签名时记录内容快照</h4>
              <div style={{ 
                border: '1px solid #e8e8e8', 
                borderRadius: 8, 
                padding: 16, 
                background: '#fafafa'
              }}>
                <p style={{ margin: '0 0 8px 0' }}><strong>实验名称：</strong>{currentSignature.recordName}</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>实验目的：</strong>研究细胞在不同培养条件下的生长情况</p>
                <p style={{ margin: '0 0 8px 0' }}><strong>实验步骤：</strong>1. 细胞复苏 2. 传代培养 3. 药物处理 4. 细胞计数</p>
                <p style={{ margin: 0 }}><strong>结论：</strong>药物对细胞生长有显著抑制作用</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
