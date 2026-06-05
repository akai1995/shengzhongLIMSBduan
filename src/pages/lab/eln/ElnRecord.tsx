import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Space, message, Upload, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, LockOutlined, UploadOutlined, DownOutlined, UpOutlined, SearchOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

interface VersionInfo {
  version: string
  modifier: string
  modifyTime: string
  isCurrent: boolean
  purpose: string
  steps: string
  data: string
  analysis: string
}

interface ExperimentRecord {
  key: string
  id: string
  name: string
  creator: string
  template: string
  version: string
  createTime: string
  lastModify: string
  isLocked: boolean
  signatureImage: string
  signatureName: string
  signatureTime: string
  purpose: string
  steps: string
  data: string
  analysis: string
  attachments: string[]
  versions: VersionInfo[]
}

export default function ElnRecord() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [signatureModalVisible, setSignatureModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ExperimentRecord | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<ExperimentRecord | null>(null)
  const [_selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [tableData, setTableData] = useState<ExperimentRecord[]>([])
  const [filteredData, setFilteredData] = useState<ExperimentRecord[]>([])
  const [versionModalVisible, setVersionModalVisible] = useState(false)
  const [versionDetailModalVisible, setVersionDetailModalVisible] = useState(false)
  const [currentVersion, setCurrentVersion] = useState<VersionInfo | null>(null)
  const idCounterRef = useRef(101)

  useEffect(() => {
    const initialData: ExperimentRecord[] = Array.from({ length: 100 }, (_, i) => {
      const locked = [false, false, true, false, false]
      const names = ['细胞培养实验记录', 'PCR扩增实验记录', 'Western Blot实验', '免疫组化实验', '动物实验记录', '临床样本处理', '数据统计分析', '试剂配制记录']
      const templates = ['细胞培养模板', 'PCR实验模板', 'Western Blot模板', '免疫组化模板', '动物实验模板', '临床样本处理模板', '数据统计分析模板', '试剂配制模板']
      const creators = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生']
      const modifiers = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生']
      const signers = ['张医生', '李医生', '王医生', '赵医生', '钱医生']
      const versionCount = Math.floor(Math.random() * 3) + 1
      const versions: VersionInfo[] = []
      const baseName = names[i % names.length]
      const basePurpose = `研究${baseName}的相关特性`
      const baseSteps = `1. 准备实验材料\n2. 进行${baseName}\n3. 数据采集\n4. 结果分析`
      const baseData = `实验数据记录：样本数=${100 + i * 10}，对照组=${50 + i * 5}，实验组=${50 + i * 5}`
      const baseAnalysis = `${baseName}完成，结果符合预期，建议进一步验证`
      const isLocked = locked[i % locked.length]
      const signatureNames = ['张三签名', '李四签名', '王五签名', '赵六签名', '钱七签名']
      
      for (let v = 1; v <= versionCount; v++) {
        versions.push({
          version: `v${v}.0`,
          modifier: modifiers[(i + v) % modifiers.length],
          modifyTime: v === versionCount 
            ? `2026-05-${String(1 + (i % 28)).padStart(2, '0')}` 
            : `2026-05-${String(Math.max(1, 1 + (i % 28) - (versionCount - v))).padStart(2, '0')}`,
          isCurrent: v === versionCount,
          purpose: v === 1 ? basePurpose : `${basePurpose}（版本${v}）`,
          steps: v === 1 ? baseSteps : `${baseSteps}（版本${v}修订）`,
          data: v === 1 ? baseData : `${baseData}（版本${v}更新）`,
          analysis: v === 1 ? baseAnalysis : `${baseAnalysis}（版本${v}修正）`
        })
      }
      
      return {
        key: String(i + 1),
        id: `ELN2026${String(i + 1).padStart(4, '0')}`,
        name: baseName + (i >= names.length ? `-${Math.floor(i / names.length) + 1}` : ''),
        creator: creators[i % creators.length],
        template: templates[i % templates.length],
        version: `v${versionCount}.0`,
        createTime: `2026-05-${String(Math.max(1, 1 + (i % 28) - versionCount + 1)).padStart(2, '0')}`,
        lastModify: `2026-05-${String(1 + (i % 28)).padStart(2, '0')}`,
        isLocked,
        signatureImage: isLocked ? `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTAiIGZpbGw9IiNmOGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyI+${signatureNames[i % signatureNames.length]}PC90ZXh0Pjwvc3ZnPg==` : '',
        signatureName: isLocked ? signers[i % signers.length] : '',
        signatureTime: isLocked ? `2026-05-${String(1 + (i % 28)).padStart(2, '0')} 10:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00` : '',
        purpose: basePurpose,
        steps: baseSteps,
        data: baseData,
        analysis: baseAnalysis,
        attachments: i % 3 === 0 ? ['实验图片1.jpg', '实验数据.xlsx', '分析报告.pdf'] : i % 3 === 1 ? ['原始数据.csv'] : [],
        versions
      }
    })
    setTableData(initialData)
    setFilteredData(initialData)
    idCounterRef.current = 101
  }, [])

  const columns = [
    { title: '记录ID', dataIndex: 'id', key: 'id', width: 140 },
    { title: '实验名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
    { title: '模板名称', dataIndex: 'template', key: 'template', width: 180 },
    { title: '当前版本号', dataIndex: 'version', key: 'version', width: 120 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 140 },
    { title: '最后修改时间', dataIndex: 'lastModify', key: 'lastModify', width: 140 },
    { 
      title: '签名锁定', 
      dataIndex: 'isLocked', 
      key: 'isLocked', 
      width: 220,
      render: (isLocked: boolean, record: ExperimentRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color={isLocked ? 'green' : 'orange'}>
            {isLocked ? '已锁定' : '未锁定'}
          </Tag>
          <div 
            style={{ 
              width: 60, 
              height: 30, 
              objectFit: 'contain', 
              border: isLocked ? `1px solid ${isDark ? '#434343' : '#D9D9D9'}` : `1px dashed ${isDark ? '#434343' : '#D9D9D9'}`, 
              borderRadius: 4,
              backgroundColor: isLocked ? (isDark ? '#262626' : '#FAFAFA') : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLocked && record.signatureImage ? (
              <img 
                src={record.signatureImage} 
                alt="签名" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                title={`${record.signatureName} - ${record.signatureTime}`}
              />
            ) : (
              <span style={{ fontSize: 10, color: isDark ? '#8C8C8C' : '#999' }}>未签名</span>
            )}
          </div>
        </div>
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 350, 
      fixed: 'right' as const,
      render: (_: any, record: ExperimentRecord) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {!record.isLocked && (
            <>
              <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
              <Button type="text" icon={<LockOutlined />} onClick={() => handleSignature(record)}>签名锁定</Button>
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
            </>
          )}
          <Button type="text" onClick={() => handleVersion(record)}>历史版本</Button>
        </Space>
      )
    },
  ]

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...tableData]
    
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.creator) {
      result = result.filter(item => item.creator.includes(values.creator))
    }
    if (values.template && values.template !== 'all') {
      result = result.filter(item => item.template === values.template)
    }
    if (values.status && values.status !== 'all') {
      const isLocked = values.status === 'locked'
      result = result.filter(item => item.isLocked === isLocked)
    }
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD')
      const endDate = values.dateRange[1].format('YYYY-MM-DD')
      result = result.filter(item => item.createTime >= startDate && item.createTime <= endDate)
    }
    
    setFilteredData(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredData([...tableData])
  }

  const handleViewDetail = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
  }

  const handleCreate = () => {
    form.resetFields()
    setCurrentRecord(null)
    setCreateModalVisible(true)
  }

  const handleEdit = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    form.setFieldsValue({
      name: record.name,
      template: record.template,
      purpose: record.purpose,
      steps: record.steps,
      data: record.data,
      analysis: record.analysis
    })
    setEditModalVisible(true)
  }

  const handleSignature = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    setSignatureModalVisible(true)
  }

  const handleDelete = (record: ExperimentRecord) => {
    setDeleteRecord(record)
    setDeleteModalVisible(true)
  }

  const handleVersion = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    setVersionModalVisible(true)
  }

  const handleViewVersion = (version: VersionInfo) => {
    setCurrentVersion(version)
    setVersionDetailModalVisible(true)
  }

  const handleEditVersion = (version: VersionInfo) => {
    if (!currentRecord) return
    
    const newVersionNum = parseInt(currentRecord.version.replace('v', '').replace('.0', '')) + 1
    const newVersion: VersionInfo = {
      ...version,
      version: `v${newVersionNum}.0`,
      modifyTime: new Date().toISOString().split('T')[0],
      isCurrent: true,
      modifier: '当前用户'
    }

    setTableData(prev => prev.map(item => {
      if (item.id === currentRecord.id) {
        return {
          ...item,
          version: newVersion.version,
          lastModify: newVersion.modifyTime,
          purpose: newVersion.purpose,
          steps: newVersion.steps,
          data: newVersion.data,
          analysis: newVersion.analysis,
          versions: [
            ...item.versions.map(v => ({ ...v, isCurrent: false })),
            newVersion
          ]
        }
      }
      return item
    }))

    setFilteredData(prev => prev.map(item => {
      if (item.id === currentRecord.id) {
        return {
          ...item,
          version: newVersion.version,
          lastModify: newVersion.modifyTime,
          purpose: newVersion.purpose,
          steps: newVersion.steps,
          data: newVersion.data,
          analysis: newVersion.analysis,
          versions: [
            ...item.versions.map(v => ({ ...v, isCurrent: false })),
            newVersion
          ]
        }
      }
      return item
    }))

    message.success('已将历史版本内容复制为新的当前版本')
    setVersionModalVisible(false)
  }

  const handleCreateSubmit = (values: any) => {
    const now = new Date().toISOString().split('T')[0]
    const newRecord: ExperimentRecord = {
      key: String(idCounterRef.current++),
      id: `ELN2026${String(idCounterRef.current - 1).padStart(4, '0')}`,
      name: values.name,
      creator: '当前用户',
      template: values.template,
      version: 'v1.0',
      createTime: now,
      lastModify: now,
      isLocked: false,
      signatureImage: '',
      signatureName: '',
      signatureTime: '',
      purpose: values.purpose || '',
      steps: values.steps || '',
      data: values.data || '',
      analysis: values.analysis || '',
      attachments: [],
      versions: [{
        version: 'v1.0',
        modifier: '当前用户',
        modifyTime: now,
        isCurrent: true,
        purpose: values.purpose || '',
        steps: values.steps || '',
        data: values.data || '',
        analysis: values.analysis || ''
      }]
    }
    
    setTableData(prev => [newRecord, ...prev])
    setFilteredData(prev => [newRecord, ...prev])
    message.success('实验记录创建成功')
    setCreateModalVisible(false)
  }

  const handleEditSubmit = (values: any) => {
    if (!currentRecord) return
    
    const now = new Date().toISOString().split('T')[0]
    setTableData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { 
            ...item, 
            name: values.name, 
            template: values.template, 
            lastModify: now,
            purpose: values.purpose || '',
            steps: values.steps || '',
            data: values.data || '',
            analysis: values.analysis || ''
          }
        : item
    ))
    setFilteredData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { 
            ...item, 
            name: values.name, 
            template: values.template, 
            lastModify: now,
            purpose: values.purpose || '',
            steps: values.steps || '',
            data: values.data || '',
            analysis: values.analysis || ''
          }
        : item
    ))
    message.success('实验记录更新成功')
    setEditModalVisible(false)
  }

  const handleSignatureSubmit = () => {
    if (!currentRecord) return
    
    setTableData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { ...item, isLocked: true, lastModify: new Date().toISOString().split('T')[0] }
        : item
    ))
    setFilteredData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { ...item, isLocked: true, lastModify: new Date().toISOString().split('T')[0] }
        : item
    ))
    message.success('签名锁定成功，记录已不可编辑')
    setSignatureModalVisible(false)
  }

  const confirmDelete = () => {
    if (!deleteRecord) return
    
    setTableData(prev => prev.filter(item => item.key !== deleteRecord.key))
    setFilteredData(prev => prev.filter(item => item.key !== deleteRecord.key))
    message.success('删除成功')
    setDeleteModalVisible(false)
    setDeleteRecord(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>实验记录</PageTitle>

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="实验名称" name="name"><Input placeholder="请输入实验名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人" name="creator"><Input placeholder="请输入创建人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="模板名称" name="template">
                <Select placeholder="请选择模板">
                  <Option value="all">全部</Option>
                  <Option value="细胞培养模板">细胞培养模板</Option>
                  <Option value="PCR实验模板">PCR实验模板</Option>
                  <Option value="Western Blot模板">Western Blot模板</Option>
                  <Option value="免疫组化模板">免疫组化模板</Option>
                  <Option value="动物实验模板">动物实验模板</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <>
                <Col span={6}>
                  <Form.Item label="创建时间" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
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
            <Row gutter={16} style={{ marginLeft: '0px', marginRight: '0px', height: '32px', marginTop: '20px' }}>
              <Col span={6}>
                <Form.Item label="签名状态" name="status">
                  <Select placeholder="全部">
                    <Option value="all">全部</Option>
                    <Option value="locked">已锁定</Option>
                    <Option value="unlocked">未锁定</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} offset={12}>
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

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Button type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />} onClick={handleCreate}>
          新建实验记录
        </Button>
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
        title="查看实验记录"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>基本信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><strong>记录ID：</strong>{currentRecord.id}</div>
              <div><strong>实验名称：</strong>{currentRecord.name}</div>
              <div><strong>创建人：</strong>{currentRecord.creator}</div>
              <div><strong>模板名称：</strong>{currentRecord.template}</div>
              <div><strong>创建时间：</strong>{currentRecord.createTime}</div>
              <div><strong>最后修改时间：</strong>{currentRecord.lastModify}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <strong>签名锁定：</strong>
                  <Tag color={currentRecord.isLocked ? 'green' : 'orange'}>
                    {currentRecord.isLocked ? '已锁定' : '未锁定'}
                  </Tag>
                </div>
                <div 
                  style={{ 
                    width: 200, 
                    height: 80, 
                    border: currentRecord.isLocked ? `1px solid ${isDark ? '#434343' : '#D9D9D9'}` : `1px dashed ${isDark ? '#434343' : '#D9D9D9'}`, 
                    borderRadius: 4,
                    backgroundColor: currentRecord.isLocked ? (isDark ? '#262626' : '#FAFAFA') : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}
                >
                  {currentRecord.isLocked && currentRecord.signatureImage ? (
                    <img 
                      src={currentRecord.signatureImage} 
                      alt="签名" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: 14, color: isDark ? '#8C8C8C' : '#999' }}>未签名</span>
                  )}
                </div>
                {currentRecord.isLocked && (
                  <div style={{ fontSize: 12, color: isDark ? '#8C8C8C' : '#8C8C8C' }}>
                    <div>签名人：{currentRecord.signatureName}</div>
                    <div>签名时间：{currentRecord.signatureTime}</div>
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>实验目的</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              {currentRecord.purpose || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>实验步骤</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.steps || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>实验数据</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.data || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>结果分析</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              {currentRecord.analysis || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>附件</h3>
            <div style={{ marginBottom: 24 }}>
              {currentRecord.attachments && currentRecord.attachments.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {currentRecord.attachments.map((file, index) => (
                    <div 
                      key={index}
                      style={{ 
                        padding: 8, 
                        border: `1px solid ${isDark ? '#434343' : '#D9D9D9'}`, 
                        borderRadius: 4,
                        backgroundColor: isDark ? '#262626' : '#FAFAFA',
                        cursor: 'pointer'
                      }}
                      onClick={() => message.info(`查看附件: ${file}`)}
                    >
                      <span style={{ fontSize: 12 }}>{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, color: '#999' }}>
                  暂无附件
                </div>
              )}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, borderTop: `1px solid ${isDark ? '#434343' : '#E8E8E8'}` }}>
          <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
          <Button type="primary" onClick={() => { setDetailModalVisible(false); handleVersion(currentRecord!) }}>历史版本</Button>
        </div>
      </Modal>

      <Modal
        title="新建实验记录"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="实验名称" name="name" rules={[{ required: true, message: '请输入实验名称' }]}>
                <Input placeholder="请输入实验名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="实验模板" name="template" rules={[{ required: true, message: '请选择实验模板' }]}>
                <Select placeholder="请选择实验模板">
                  <Option value="细胞培养模板">细胞培养模板</Option>
                  <Option value="PCR实验模板">PCR实验模板</Option>
                  <Option value="Western Blot模板">Western Blot模板</Option>
                  <Option value="免疫组化模板">免疫组化模板</Option>
                  <Option value="动物实验模板">动物实验模板</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="实验目的" name="purpose">
            <TextArea rows={3} placeholder="请输入实验目的" />
          </Form.Item>
          
          <Form.Item label="实验步骤" name="steps">
            <TextArea rows={6} placeholder="请输入实验步骤，每行一步" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="实验数据" name="data">
                <TextArea rows={4} placeholder="请输入实验数据" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="结果分析" name="analysis">
                <TextArea rows={4} placeholder="请输入结果分析" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="附件上传" name="attachments">
            <Upload.Dragger multiple>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持多文件）</p>
            </Upload.Dragger>
          </Form.Item>
          
          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button onClick={() => setCreateModalVisible(false)}>取消</Button>
            <Button type="primary" style={{ marginLeft: 10 }} htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑实验记录"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="实验名称" name="name" rules={[{ required: true, message: '请输入实验名称' }]}>
                <Input placeholder="请输入实验名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="实验模板" name="template" rules={[{ required: true, message: '请选择实验模板' }]}>
                <Select placeholder="请选择实验模板">
                  <Option value="细胞培养模板">细胞培养模板</Option>
                  <Option value="PCR实验模板">PCR实验模板</Option>
                  <Option value="Western Blot模板">Western Blot模板</Option>
                  <Option value="免疫组化模板">免疫组化模板</Option>
                  <Option value="动物实验模板">动物实验模板</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="实验目的" name="purpose">
            <TextArea rows={3} placeholder="请输入实验目的" />
          </Form.Item>
          
          <Form.Item label="实验步骤" name="steps">
            <TextArea rows={6} placeholder="请输入实验步骤，每行一步" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="实验数据" name="data">
                <TextArea rows={4} placeholder="请输入实验数据" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="结果分析" name="analysis">
                <TextArea rows={4} placeholder="请输入结果分析" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item label="附件上传" name="attachments">
            <Upload.Dragger multiple>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持多文件）</p>
            </Upload.Dragger>
          </Form.Item>
          
          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button onClick={() => setEditModalVisible(false)}>取消</Button>
            <Button type="primary" style={{ marginLeft: 10 }} htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="电子签名"
        open={signatureModalVisible}
        onCancel={() => setSignatureModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 20 }}>请在此处进行电子签名确认</p>
          <div style={{ width: '100%', height: 200, border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ color: '#bfbfbf' }}>签名画板区域</span>
          </div>
          <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#FFF7E6', borderRadius: 8 }}>
            <p style={{ color: '#FA8C16', margin: 0, fontSize: 14 }}>提示：签名后记录将被锁定，无法再进行编辑</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Button onClick={() => setSignatureModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSignatureSubmit}>确认签名并锁定</Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setDeleteRecord(null)
        }}
        footer={null}
      >
        <p>确定删除实验记录 <strong>{deleteRecord?.name}</strong> 吗？</p>
        <p style={{ color: '#FF4D4F', marginTop: 12 }}>删除后将无法恢复，此操作不可逆。</p>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={() => {
            setDeleteModalVisible(false)
            setDeleteRecord(null)
          }}>取消</Button>
          <Button type="primary" danger onClick={confirmDelete} style={{ marginLeft: 10 }}>
            确定删除
          </Button>
        </div>
      </Modal>

      <Modal
        title="历史版本"
        open={versionModalVisible}
        onCancel={() => setVersionModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1000px' }}
      >
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>实验记录：{currentRecord?.name}</h3>
          <p style={{ color: '#8C8C8C', margin: 0 }}>记录ID：{currentRecord?.id}</p>
        </div>
        
        <Table
          dataSource={currentRecord?.versions || []}
          rowKey="version"
          pagination={false}
          bordered
          columns={[
            { 
              title: '版本号', 
              dataIndex: 'version', 
              key: 'version',
              render: (version: string, record: VersionInfo) => (
                <span>
                  {version}
                  {record.isCurrent && <Tag color="green" style={{ marginLeft: 8 }}>当前版本</Tag>}
                </span>
              )
            },
            { title: '修改人', dataIndex: 'modifier', key: 'modifier' },
            { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
            { 
              title: '是否当前版本', 
              dataIndex: 'isCurrent', 
              key: 'isCurrent',
              render: (isCurrent: boolean) => (
                <Tag color={isCurrent ? 'green' : 'gray'}>
                  {isCurrent ? '是' : '否'}
                </Tag>
              )
            },
            { 
              title: '操作', 
              key: 'action',
              render: (_: any, record: VersionInfo) => (
                <Space size="middle">
                  <Button type="text" onClick={() => handleViewVersion(record)}>查看</Button>
                  {!record.isCurrent && (
                    <Button type="text" onClick={() => handleEditVersion(record)}>编辑</Button>
                  )}
                </Space>
              )
            }
          ]}
        />
      </Modal>

      <Modal
        title={`版本详情 - ${currentVersion?.version}`}
        open={versionDetailModalVisible}
        onCancel={() => {
          setVersionDetailModalVisible(false)
          setCurrentVersion(null)
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '1000px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                <p style={{ margin: 0, color: '#8C8C8C', fontSize: 12 }}>修改人</p>
                <p style={{ margin: 4, fontWeight: 500 }}>{currentVersion?.modifier}</p>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                <p style={{ margin: 0, color: '#8C8C8C', fontSize: 12 }}>修改时间</p>
                <p style={{ margin: 4, fontWeight: 500 }}>{currentVersion?.modifyTime}</p>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>实验目的</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{currentVersion?.purpose}</p>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>实验步骤</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{currentVersion?.steps}</pre>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>实验数据</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{currentVersion?.data}</p>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>结果分析</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{currentVersion?.analysis}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => {
            setVersionDetailModalVisible(false)
            setCurrentVersion(null)
          }}>关闭</Button>
        </div>
      </Modal>
    </div>
  )
}