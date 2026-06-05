import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col, Checkbox, message } from 'antd'
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, DownOutlined, UpOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

export default function VisitRequest() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [signatureUploaded, setSignatureUploaded] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [filterData, setFilterData] = useState<any[]>([])

  const initData = useMemo(() => {
    const initialData = Array.from({ length: 100 }, (_, i) => {
      const statuses = ['已通过', '待审核', '待审核', '已拒绝']
      const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '陈二']
      const areas = ['实验室A101', '实验室B202', '实验室C301', '实验室D402', '实验室E503']
      const reasons = ['设备参观', '技术交流', '项目合作', '学习交流', '学术研讨', '设备维护', '试剂采购', '其他']
      const escorts = ['李四', '赵六', '孙八', '周九', '吴十', '郑一', '陈二', '张三']
      const status = statuses[i % 4]
      return {
        key: String(i + 1),
        id: `VS2024${String(i + 1).padStart(4, '0')}`,
        name: names[i % names.length],
        phone: `138****${String(1000 + i).padStart(4, '0')}`,
        idType: '身份证',
        idNumber: `32010119900101${String(1000 + i).padStart(4, '0')}`,
        area: areas[i % areas.length],
        visitStartTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00`,
        visitEndTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(11 + (i % 8)).padStart(2, '0')}:00`,
        visitTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00-${String(11 + (i % 8)).padStart(2, '0')}:00`,
        reason: reasons[i % reasons.length],
        escort: escorts[i % escorts.length],
        signature: status === '已通过' ? '已签' : '未签',
        signatureUploaded: status === '已通过',
        status,
        createdAt: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}`,
        auditLogs: [
          { reviewer: '系统', time: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}`, opinion: '提交申请', status: '待审核' },
        ]
      }
    })
    return initialData
  }, [])

  useState(() => {
    setData(initData)
    setFilterData(initData)
  }, [])

  const columns = [
    { title: '申请ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: '申请人', dataIndex: 'name', key: 'name', width: 100 },
    { title: '手机号', dataIndex: 'phone', key: 'phone', width: 110 },
    { title: '进入区域', dataIndex: 'area', key: 'area', width: 120 },
    { title: '来访时间', dataIndex: 'visitTime', key: 'visitTime', width: 200 },
    { title: '事由', dataIndex: 'reason', key: 'reason', width: 100 },
    { title: '陪同人', dataIndex: 'escort', key: 'escort', width: 100 },
    { title: '签字状态', dataIndex: 'signature', key: 'signature', width: 100, render: (status: string) => (
      <Tag 
        color={status === '已签' ? 'green' : 'default'} 
        className={status === '未签' ? 'signature-pending' : ''}
      >{status}</Tag>
    )},
    { title: '审核状态', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => {
      const colorMap: Record<string, string> = {
        '待审核': 'orange',
        '已通过': 'green',
        '已拒绝': 'red'
      }
      return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>
    }},
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 280, render: (_: any, record: any) => (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          className="action-button"
          onClick={() => {
            setCurrentRecord(record)
            setDetailModalVisible(true)
          }}>查看</Button>
        {record.status === '待审核' && (
          <>
            <Button 
              type="text" 
              icon={<CheckOutlined />} 
              className="action-button"
              style={{ color: '#49AA19' }}
              onClick={() => handleApprove(record)}>通过</Button>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              className="action-button"
              style={{ color: '#F53F3F' }}
              onClick={() => {
                setCurrentRecord(record)
                setRejectModalVisible(true)
              }}>拒绝</Button>
          </>
        )}
        {record.status === '已通过' && record.signature === '未签' && (
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="action-button"
            style={{ color: '#177DDC' }}
            onClick={() => handleSign(record)}>签字</Button>
        )}
        {record.status === '待审核' && (
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="action-button"
            onClick={() => {
              setCurrentRecord(record)
              setEditModalVisible(true)
            }}>编辑</Button>
        )}
      </div>
    )},
  ]

  const handleSearch = () => {
    const values = form.getFieldsValue()
    let result = [...data]
    
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.area && values.area !== 'all') {
      result = result.filter(item => item.area.includes(values.area))
    }
    if (values.status && values.status !== 'all') {
      const statusMap: Record<string, string> = {
        'pending': '待审核',
        'approved': '已通过',
        'rejected': '已拒绝'
      }
      result = result.filter(item => item.status === statusMap[values.status])
    }
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].startOf('day')
      const endDate = values.dateRange[1].endOf('day')
      result = result.filter(item => {
        const createDate = new Date(item.createdAt)
        return createDate >= startDate.toDate() && createDate <= endDate.toDate()
      })
    }
    
    setFilterData(result)
    message.success('搜索完成')
  }

  const handleReset = () => {
    form.resetFields()
    setFilterData([...data])
  }

  const handleApprove = (record: any) => {
    const newData = data.map(item => {
      if (item.id === record.id) {
        const newLogs = [
          { reviewer: '管理员', time: new Date().toLocaleString('zh-CN'), opinion: '审核通过', status: '已通过' },
          ...item.auditLogs
        ]
        return { 
          ...item, 
          status: '已通过', 
          signature: '已签',
          signatureUploaded: true,
          auditLogs: newLogs 
        }
      }
      return item
    })
    setData(newData)
    setFilterData(newData)
    message.success('审核通过，自动完成签字')
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.warning('请输入驳回理由')
      return
    }
    
    const newData = data.map(item => {
      if (item.id === currentRecord.id) {
        const newLogs = [
          { reviewer: '管理员', time: new Date().toLocaleString('zh-CN'), opinion: `审核拒绝：${rejectReason}`, status: '已拒绝' },
          ...item.auditLogs
        ]
        return { ...item, status: '已拒绝', auditLogs: newLogs }
      }
      return item
    })
    setData(newData)
    setFilterData(newData)
    setRejectModalVisible(false)
    setRejectReason('')
    message.success('已拒绝申请')
  }

  const handleSign = (record: any) => {
    const newData = data.map(item => {
      if (item.id === record.id) {
        return { ...item, signature: '已签', signatureUploaded: true }
      }
      return item
    })
    setData(newData)
    setFilterData(newData)
    message.success('签字成功')
  }

  const handleAdd = () => {
    setAddModalVisible(false)
    setSignatureUploaded(false)
    
    const newId = `VS2024${String(data.length + 1).padStart(4, '0')}`
    const newRecord = {
      key: String(data.length + 1),
      id: newId,
      name: '新申请人',
      phone: '138****0000',
      idType: '身份证',
      idNumber: '',
      area: '实验室A101',
      visitStartTime: new Date().toLocaleString('zh-CN'),
      visitEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString('zh-CN'),
      visitTime: `${new Date().toLocaleDateString('zh-CN')} 09:00-11:00`,
      reason: '其他',
      escort: '系统用户',
      signature: '未签',
      signatureUploaded: false,
      status: '待审核',
      createdAt: new Date().toLocaleString('zh-CN'),
      auditLogs: [
        { reviewer: '系统', time: new Date().toLocaleString('zh-CN'), opinion: '提交申请', status: '待审核' },
      ]
    }
    
    const newData = [newRecord, ...data]
    setData(newData)
    setFilterData(newData)
    message.success('申请提交成功，请等待审核')
  }

  const handleEdit = () => {
    setEditModalVisible(false)
    message.success('修改成功')
  }

  const handleBatchApprove = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要操作的记录')
      return
    }
    
    const newData = data.map(item => {
      if (selectedRows.includes(item.id) && item.status === '待审核') {
        const newLogs = [
          { reviewer: '管理员', time: new Date().toLocaleString('zh-CN'), opinion: '批量审核通过', status: '已通过' },
          ...item.auditLogs
        ]
        return { 
          ...item, 
          status: '已通过', 
          signature: '已签',
          signatureUploaded: true,
          auditLogs: newLogs 
        }
      }
      return item
    })
    setData(newData)
    setFilterData(newData)
    setSelectedRows([])
    message.success(`已批量通过 ${selectedRows.length} 条申请`)
  }

  const handleBatchReject = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要操作的记录')
      return
    }
    
    Modal.confirm({
      title: '批量拒绝',
      content: `确定要拒绝选中的 ${selectedRows.length} 条申请吗？`,
      okText: '确认拒绝',
      cancelText: '取消',
      onOk: () => {
        const newData = data.map(item => {
          if (selectedRows.includes(item.id) && item.status === '待审核') {
            const newLogs = [
              { reviewer: '管理员', time: new Date().toLocaleString('zh-CN'), opinion: '批量审核拒绝', status: '已拒绝' },
              ...item.auditLogs
            ]
            return { ...item, status: '已拒绝', auditLogs: newLogs }
          }
          return item
        })
        setData(newData)
        setFilterData(newData)
        setSelectedRows([])
        message.success(`已批量拒绝 ${selectedRows.length} 条申请`)
      }
    })
  }

  const handleRefresh = () => {
    setFilterData([...data])
    form.resetFields()
    setSelectedRows([])
    message.success('数据已刷新')
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>来访申请</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="申请人" name="name"><Input placeholder="请输入申请人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="进入区域" name="area">
                <Select placeholder="请选择区域">
                  <Option value="all">全部</Option>
                  <Option value="A">实验室A区</Option>
                  <Option value="B">实验室B区</Option>
                  <Option value="C">实验室C区</Option>
                  <Option value="D">实验室D区</Option>
                  <Option value="E">实验室E区</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="申请状态" name="status">
                <Select placeholder="请选择状态">
                  <Option value="all">全部</Option>
                  <Option value="pending">待审核</Option>
                  <Option value="approved">已通过</Option>
                  <Option value="rejected">已拒绝</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="申请时间" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
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
            <Row gutter={16} style={{ marginTop: '20px', height: '32px' }}>
              <Col span={6} offset={18}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
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
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
              setSignatureUploaded(false)
              setAddModalVisible(true)
            }}>新增申请</Button>
          </div>
          {selectedRows.length > 0 && (
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ color: '#8C8C8C' }}>已选择 {selectedRows.length} 条记录</span>
              <Button type="primary" icon={<CheckOutlined />} onClick={handleBatchApprove} disabled={selectedRows.length === 0}>批量通过</Button>
              <Button danger icon={<CloseOutlined />} onClick={handleBatchReject} disabled={selectedRows.length === 0}>批量拒绝</Button>
            </div>
          )}
        </div>
        <Table 
          columns={columns} 
          dataSource={filterData} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRows,
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title="来访申请详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentRecord && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#000000', marginBottom: 16 }}>申请信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><span style={{ color: '#8C8C8C' }}>申请ID：</span><span style={{ color: '#262626' }}>{currentRecord.id}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>申请人：</span><span style={{ color: '#262626' }}>{currentRecord.name}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>手机号：</span><span style={{ color: '#262626' }}>{currentRecord.phone}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>证件类型：</span><span style={{ color: '#262626' }}>{currentRecord.idType}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>证件号码：</span><span style={{ color: '#262626' }}>{currentRecord.idNumber}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>进入区域：</span><span style={{ color: '#262626' }}>{currentRecord.area}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>来访时间：</span><span style={{ color: '#262626' }}>{currentRecord.visitTime}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>事由：</span><span style={{ color: '#262626' }}>{currentRecord.reason}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>陪同人：</span><span style={{ color: '#262626' }}>{currentRecord.escort}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>签字状态：</span><Tag color={currentRecord.signature === '已签' ? 'green' : 'default'} className={currentRecord.signature === '未签' ? 'signature-pending' : ''}>{currentRecord.signature}</Tag></div>
              <div><span style={{ color: '#8C8C8C' }}>审核状态：</span><Tag color={{'待审核': 'orange', '已通过': 'green', '已拒绝': 'red'}[currentRecord.status] || 'gray'}>{currentRecord.status}</Tag></div>
              <div><span style={{ color: '#8C8C8C' }}>提交时间：</span><span style={{ color: '#262626' }}>{currentRecord.createdAt}</span></div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                <p style={{ color: '#8C8C8C', marginBottom: 8 }}>电子签名图片</p>
                <div style={{ width: 200, height: 100, border: '1px dashed #E5E5E5', borderRadius: 4, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: currentRecord.signatureUploaded ? '#F6FFED' : '#F7F7F7' }}>
                  {currentRecord.signatureUploaded ? <span style={{ color: '#49AA19' }}>✓ 已签名</span> : <span style={{ color: '#B2B2B2' }}>未签名</span>}
                </div>
              </div>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#000000', marginBottom: 16 }}>审核记录</h3>
            <Table
              columns={[
                { title: '审核人', dataIndex: 'reviewer', key: 'reviewer' },
                { title: '审核时间', dataIndex: 'time', key: 'time' },
                { title: '审核意见', dataIndex: 'opinion', key: 'opinion' },
                { title: '状态变更', dataIndex: 'status', key: 'status', render: (status: string) => (
                  <Tag color={{'待审核': 'orange', '已通过': 'green', '已拒绝': 'red'}[status] || 'gray'}>{status}</Tag>
                )},
              ]}
              dataSource={currentRecord.auditLogs}
              rowKey="time"
              pagination={false}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="拒绝申请"
        open={rejectModalVisible}
        onCancel={() => {
          setRejectModalVisible(false)
          setRejectReason('')
        }}
        footer={[
          <Button key="back" onClick={() => {
            setRejectModalVisible(false)
            setRejectReason('')
          }}>取消</Button>,
          <Button key="submit" type="primary" danger onClick={handleReject} disabled={!rejectReason.trim()}>确认拒绝</Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="驳回理由" required>
            <TextArea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入驳回理由（将记录到审核日志）"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑来访申请"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setEditModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>保存修改</Button>,
        ]}
        width={700}
      >
        {currentRecord && (
          <Form layout="vertical" initialValues={{
            name: currentRecord.name,
            phone: currentRecord.phone,
            area: currentRecord.area.replace('实验室', ''),
            reason: currentRecord.reason,
            escort: currentRecord.escort,
          }}>
            <h4 style={{ marginBottom: 16, color: '#000000', fontWeight: 500 }}>基本信息</h4>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="申请人姓名" required>
                  <Input placeholder="请输入申请人姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="手机号" required>
                  <Input placeholder="请输入手机号" />
                </Form.Item>
              </Col>
            </Row>

            <h4 style={{ marginBottom: 16, color: '#000000', fontWeight: 500 }}>来访信息</h4>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="进入区域" required>
                  <Select placeholder="请选择进入区域">
                    <Option value="A101">实验室A101</Option>
                    <Option value="A102">实验室A102</Option>
                    <Option value="B201">实验室B201</Option>
                    <Option value="B202">实验室B202</Option>
                    <Option value="C301">实验室C301</Option>
                    <Option value="C302">实验室C302</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="陪同人" required>
                  <Input placeholder="请输入陪同人姓名" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="事由" required>
                  <TextArea placeholder="请输入来访事由" rows={3} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      <Modal
        title="新增来访申请"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false)
          setSignatureUploaded(false)
        }}
        footer={[
          <Button key="back" onClick={() => {
            setAddModalVisible(false)
            setSignatureUploaded(false)
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleAdd} disabled={!signatureUploaded}>提交申请</Button>,
        ]}
        width={700}
      >
        <Form layout="vertical">
          <h4 style={{ marginBottom: 16, color: '#000000', fontWeight: 500 }}>基本信息</h4>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="申请人姓名" required>
                <Input placeholder="请输入申请人姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号" required>
                <Input placeholder="请输入手机号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="证件类型">
                <Select placeholder="请选择证件类型">
                  <Option value="idcard">身份证</Option>
                  <Option value="passport">护照</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="证件号码">
                <Input placeholder="请输入证件号码" />
              </Form.Item>
            </Col>
          </Row>

          <h4 style={{ marginBottom: 16, color: '#000000', fontWeight: 500 }}>来访信息</h4>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="进入区域" required>
                <Select placeholder="请选择进入区域">
                  <Option value="A101">实验室A101</Option>
                  <Option value="A102">实验室A102</Option>
                  <Option value="B201">实验室B201</Option>
                  <Option value="B202">实验室B202</Option>
                  <Option value="C301">实验室C301</Option>
                  <Option value="C302">实验室C302</Option>
                  <Option value="D402">实验室D402</Option>
                  <Option value="E503">实验室E503</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="来访开始时间" required>
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="来访结束时间" required>
                <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="陪同人" required>
                <Input placeholder="请输入陪同人姓名" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="事由" required>
                <TextArea placeholder="请输入来访事由" rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <h4 style={{ marginBottom: 16, color: '#000000', fontWeight: 500 }}>安全须知确认</h4>
          <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <p style={{ color: '#595959', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>《实验室安全须知》摘要：</strong>进入实验室人员必须遵守实验室安全规章制度，服从现场工作人员管理，正确佩戴个人防护用品。严禁携带易燃易爆物品进入实验室，未经许可不得随意操作实验设备。
            </p>
            <p style={{ color: '#595959', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
              <strong>《风险提示》摘要：</strong>实验室存在化学试剂、高压设备、高温装置等潜在风险，请严格按照操作规程进行活动，如遇紧急情况请立即联系现场工作人员。
            </p>
            <p style={{ color: '#595959', fontSize: 14, lineHeight: 1.6 }}>
              <strong>《规章制度》摘要：</strong>访客需全程由陪同人员带领，不得擅自进入未开放区域，遵守实验室作息时间，保持环境整洁。
            </p>
            <p style={{ marginTop: 12 }}>
              <a href="#" style={{ color: '#177DDC' }}>查看《实验室安全须知》全文</a>
              <span style={{ margin: '0 12px' }}>|</span>
              <a href="#" style={{ color: '#177DDC' }}>查看《风险提示》全文</a>
              <span style={{ margin: '0 12px' }}>|</span>
              <a href="#" style={{ color: '#177DDC' }}>查看《规章制度》全文</a>
            </p>
          </div>
          <Form.Item required>
            <Checkbox>本人已阅读并同意遵守实验室安全须知及相关规章制度</Checkbox>
          </Form.Item>

          <h4 style={{ marginBottom: 16, color: '#000000', fontWeight: 500 }}>电子签名</h4>
          <div style={{ border: '1px dashed #E5E5E5', borderRadius: 8, padding: 24, textAlign: 'center' }}>
            {signatureUploaded ? (
              <div>
                <div style={{ width: 200, height: 80, border: '1px solid #49AA19', borderRadius: 4, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6FFED' }}>
                  <span style={{ color: '#49AA19' }}>✓ 已签名</span>
                </div>
                <Button onClick={() => setSignatureUploaded(false)}>重新上传签名</Button>
              </div>
            ) : (
              <div>
                <p style={{ color: '#8C8C8C', marginBottom: 12 }}>请上传签名图片（支持jpg/png格式）</p>
                <Button type="primary" onClick={() => setSignatureUploaded(true)}>上传签名</Button>
              </div>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  )
}
