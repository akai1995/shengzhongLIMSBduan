import { Card, Table, Progress, Button, Input, Select, Space, Modal, Tag, message, Popconfirm, Timeline, Form, Row, Col, DatePicker, Avatar } from 'antd'
import { EyeOutlined, ExclamationCircleOutlined, ReloadOutlined, DownOutlined, UpOutlined, ExportOutlined, PlayCircleOutlined, PauseCircleOutlined, BellOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'

const { RangePicker } = DatePicker

const generateInitialData = () => {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '刘十二']
  const departments = ['研发部', '测试部', '生产部', '质量部', '采购部', '财务部', '人事部', '行政部']
  const materials = [
    '实验室安全操作规程', 'LIMS系统使用手册', '仪器设备操作指南', '试剂管理规范',
    '危险化学品处理', '生物安全培训', '辐射防护知识', '消防安全管理',
    '急救知识培训', '危化品安全手册', '实验室准入培训', '设备维护指南',
    '样本处理流程', '数据安全规范', '废物处理条例'
  ]
  const categories = ['安全培训', '操作规程', '管理制度', '技术规范', '应急处理']
  
  return Array.from({ length: 30 }, (_, i) => {
    const rand = Math.random()
    let progress = 0
    let completeStatus = '未开始'
    
    if (rand < 0.3) {
      progress = 0
      completeStatus = '未开始'
    } else if (rand < 0.6) {
      progress = Math.floor(Math.random() * 95) + 5
      completeStatus = '学习中'
    } else {
      progress = 100
      completeStatus = '已完成'
    }
    
    return {
      key: String(i + 1),
      id: i + 1,
      name: names[i % names.length],
      department: departments[i % departments.length],
      materialTitle: materials[i % materials.length],
      category: categories[i % categories.length],
      progress: progress,
      learnDuration: progress === 0 ? '0分钟' : progress === 100 ? '2小时30分' : `${Math.floor(progress * 1.5)}分钟`,
      firstLearnTime: progress === 0 ? '-' : `2024-05-${String((i % 20) + 1).padStart(2, '0')} 08:00:00`,
      lastLearnTime: progress === 0 ? '-' : `2024-05-${String((i % 20) + 1).padStart(2, '0')} ${String(14 + (i % 8)).padStart(2, '0')}:00:00`,
      completeStatus: completeStatus,
      learningHistory: progress === 0 ? [] : [
        { startTime: `2024-05-${String((i % 20) + 1).padStart(2, '0')} 08:30:00`, endTime: `2024-05-${String((i % 20) + 1).padStart(2, '0')} 10:00:00`, duration: '1小时30分' },
        { startTime: `2024-05-${String((i % 20) + 2).padStart(2, '0')} 14:00:00`, endTime: `2024-05-${String((i % 20) + 2).padStart(2, '0')} 15:30:00`, duration: '1小时30分' },
      ],
      learningTrajectory: progress === 0 ? [] : progress === 100 ? [
        { color: 'green', children: `完成第一章：基础知识学习 (2024-05-${(i % 20) + 1} 10:00)` },
        { color: 'green', children: `完成第二章：操作规范学习 (2024-05-${(i % 20) + 3} 15:30)` },
        { color: 'green', children: `完成全部学习 (2024-05-${(i % 20) + 5} 16:00)` },
      ] : [
        { color: 'green', children: `完成第一章：基础知识学习 (2024-05-${(i % 20) + 1} 10:00)` },
        { color: 'blue', children: `正在学习第二章：操作规范 (2024-05-${(i % 20) + 3} 15:30)` },
      ],
    }
  })
}

export default function OnlineLearning() {
  const [tableData, setTableData] = useState(generateInitialData)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isLearningVisible, setIsLearningVisible] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [learningData, setLearningData] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)
  const [searchForm] = Form.useForm()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(1800)
  const [learnedDuration, setLearnedDuration] = useState(0)

  useEffect(() => {
    setFilteredData(tableData)
  }, [tableData])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...tableData]
    
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.title) {
      result = result.filter(item => item.materialTitle.includes(values.title))
    }
    if (values.category) {
      result = result.filter(item => item.category === values.category)
    }
    if (values.status) {
      const statusMap: any = { notStarted: '未开始', learning: '学习中', completed: '已完成' }
      result = result.filter(item => item.completeStatus === statusMap[values.status])
    }
    if (values.department) {
      result = result.filter(item => item.department === values.department)
    }
    if (values.learnTime && values.learnTime.length === 2) {
      const [start, end] = values.learnTime
      result = result.filter(item => {
        if (item.firstLearnTime === '-') return false
        const date = new Date(item.firstLearnTime)
        return date >= start && date <= end
      })
    }
    
    setFilteredData(result)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredData(tableData)
  }

  const handleViewDetail = (record: any) => {
    setDetailData(record)
    setIsDetailVisible(true)
  }

  const handleForceComplete = (record: any) => {
    const newData = tableData.map(item => {
      if (item.id === record.id) {
        return {
          ...item,
          progress: 100,
          completeStatus: '已完成',
          learnDuration: '2小时30分',
        }
      }
      return item
    })
    setTableData(newData)
    setFilteredData(newData.filter(item => filteredData.some(f => f.id === item.id)))
    message.success(`已将学员"${record.name}"的学习状态标记为已完成`)
  }

  const handleResetProgress = (record: any) => {
    const newData = tableData.map(item => {
      if (item.id === record.id) {
        return {
          ...item,
          progress: 0,
          completeStatus: '未开始',
          learnDuration: '0分钟',
          firstLearnTime: '-',
          lastLearnTime: '-',
          learningHistory: [],
          learningTrajectory: [],
        }
      }
      return item
    })
    setTableData(newData)
    setFilteredData(newData.filter(item => filteredData.some(f => f.id === item.id)))
    message.warning(`已将学员"${record.name}"的学习进度重置为0`)
  }

  const handleStartLearning = (record: any) => {
    setLearningData({ ...record })
    setIsLearningVisible(true)
    setIsPlaying(true)
    setCurrentTime(record.progress === 0 ? 0 : Math.floor(record.progress / 100 * duration))
    setLearnedDuration(record.progress === 0 ? 0 : Math.floor(record.progress / 100 * duration / 60))
  }

  const handlePausePlay = () => {
    setIsPlaying(!isPlaying)
  }

  

  useEffect(() => {
    if (isPlaying && learningData) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return prev
          }
          setLearnedDuration(Math.floor(prev / 60))
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isPlaying, duration, learningData])

  const handleSaveProgress = () => {
    const progressPercent = Math.floor(currentTime / duration * 100)
    const newData = tableData.map(item => {
      if (item.id === learningData.id) {
        return {
          ...item,
          progress: progressPercent,
          completeStatus: progressPercent === 100 ? '已完成' : '学习中',
          learnDuration: `${learnedDuration}分钟`,
          firstLearnTime: item.firstLearnTime === '-' ? new Date().toLocaleString() : item.firstLearnTime,
          lastLearnTime: new Date().toLocaleString(),
        }
      }
      return item
    })
    setTableData(newData)
    setFilteredData(newData.filter(item => filteredData.some(f => f.id === item.id)))
    message.info('已保存学习进度')
    setIsLearningVisible(false)
    setIsPlaying(false)
  }

  const handleCompleteLearning = () => {
    const newData = tableData.map(item => {
      if (item.id === learningData.id) {
        return {
          ...item,
          progress: 100,
          completeStatus: '已完成',
          learnDuration: '2小时30分',
          lastLearnTime: new Date().toLocaleString(),
        }
      }
      return item
    })
    setTableData(newData)
    setFilteredData(newData.filter(item => filteredData.some(f => f.id === item.id)))
    message.success('已完成学习')
    setIsLearningVisible(false)
    setIsPlaying(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '学员姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '资料标题', dataIndex: 'materialTitle', key: 'materialTitle', ellipsis: true },
    { title: '资料分类', dataIndex: 'category', key: 'category', width: 100 },
    {
      title: '学习进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (percent: number) => <Progress percent={percent} size="small" />
    },
    { title: '学习时长', dataIndex: 'learnDuration', key: 'learnDuration', width: 120 },
    { title: '首次学习时间', dataIndex: 'firstLearnTime', key: 'firstLearnTime', width: 160 },
    { title: '最近学习时间', dataIndex: 'lastLearnTime', key: 'lastLearnTime', width: 160 },
    {
      title: '完成状态',
      dataIndex: 'completeStatus',
      key: 'completeStatus',
      width: 100,
      render: (status: string) => <Tag color={status === '已完成' ? 'green' : status === '学习中' ? 'orange' : 'default'}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            查看详情
          </Button>
          <Button type="link" size="small" icon={<PlayCircleOutlined />} onClick={() => handleStartLearning(record)}>
            {record.completeStatus === '已完成' ? '重新学习' : record.completeStatus === '学习中' ? '继续学习' : '开始学习'}
          </Button>
          <Popconfirm
            title="确定强制完成？"
            description="这将把学习状态标记为已完成"
            onConfirm={() => handleForceComplete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small">
              强制完成
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确定重置进度？"
            description={<span style={{ color: '#ff4d4f' }}>警告：这将把学习进度重置为0！</span>}
            onConfirm={() => handleResetProgress(record)}
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
          >
            <Button type="link" size="small" danger icon={<ReloadOutlined />}>
              重置进度
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: 0, width: '100%', minHeight: '100%' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>在线学习</h1>

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="学员姓名" name="name">
                    <Input placeholder="请输入学员姓名" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="资料标题" name="title">
                    <Input placeholder="请输入资料标题" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="资料分类" name="category">
                    <Select placeholder="请选择资料分类" options={[
                      { value: '安全培训', label: '安全培训' },
                      { value: '操作规程', label: '操作规程' },
                      { value: '管理制度', label: '管理制度' },
                      { value: '技术规范', label: '技术规范' },
                      { value: '应急处理', label: '应急处理' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="完成状态" name="status">
                    <Select placeholder="请选择完成状态" options={[
                      { value: 'notStarted', label: '未开始' },
                      { value: 'completed', label: '已完成' },
                      { value: 'learning', label: '学习中' },
                    ]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="所属部门" name="department">
                    <Select placeholder="请选择部门" options={[
                      { value: '研发部', label: '研发部' },
                      { value: '测试部', label: '测试部' },
                      { value: '生产部', label: '生产部' },
                      { value: '质量部', label: '质量部' },
                      { value: '采购部', label: '采购部' },
                      { value: '财务部', label: '财务部' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="学习时间" name="learnTime">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary" onClick={handleSearch}>查询</Button>
                  <Button className="reset-btn" onClick={handleReset}>重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={20} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="学员姓名" name="name">
                  <Input placeholder="请输入学员姓名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="资料标题" name="title">
                  <Input placeholder="请输入资料标题" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="资料分类" name="category">
                  <Select placeholder="请选择资料分类" options={[
                    { value: '安全培训', label: '安全培训' },
                    { value: '操作规程', label: '操作规程' },
                    { value: '管理制度', label: '管理制度' },
                    { value: '技术规范', label: '技术规范' },
                    { value: '应急处理', label: '应急处理' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary" onClick={handleSearch}>查询</Button>
                <Button className="reset-btn" onClick={handleReset}>重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10, width: '100%', marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<ExportOutlined />} disabled={selectedRows.length === 0} className="export-btn">导出</Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>

      <Modal
        title="学习详情"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={900}
      >
        {detailData && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>学员信息</h3>
              <div style={{ display: 'flex', gap: 16 }}>
                <Avatar size={64} icon={<EyeOutlined />} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, width: '100%' }}>
                  <div><strong>姓名：</strong>{detailData.name}</div>
                  <div><strong>工号：</strong>{`EMP${String(detailData.id).padStart(4, '0')}`}</div>
                  <div><strong>部门：</strong>{detailData.department}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>资料信息</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <div><strong>资料标题：</strong>{detailData.materialTitle}</div>
                <div><strong>资料分类：</strong>{detailData.category}</div>
                <div><strong>资料类型：</strong>视频教程</div>
                <div><strong>总时长：</strong>30分钟</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>学习进度详情</h3>
              {detailData.learningHistory.length > 0 ? (
                <Table
                  columns={[
                    { title: '学习开始时间', dataIndex: 'startTime', key: 'startTime' },
                    { title: '学习结束时间', dataIndex: 'endTime', key: 'endTime' },
                    { title: '单次学习时长', dataIndex: 'duration', key: 'duration' },
                  ]}
                  dataSource={detailData.learningHistory}
                  pagination={false}
                  size="small"
                />
              ) : (
                <div style={{ color: '#8C8C8C', padding: 16 }}>暂无学习记录</div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>学习轨迹</h3>
              {detailData.learningTrajectory.length > 0 ? (
                <Timeline items={detailData.learningTrajectory} />
              ) : (
                <div style={{ color: '#8C8C8C', padding: 16 }}>暂无学习轨迹</div>
              )}
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3>学习状态</h3>
              <Space>
                <Progress percent={detailData.progress} size="small" />
                <Tag color={detailData.completeStatus === '已完成' ? 'green' : detailData.completeStatus === '学习中' ? 'orange' : 'default'}>{detailData.completeStatus}</Tag>
              </Space>
            </div>

            <div>
              <h3>备注</h3>
              <p style={{ color: '#666' }}>{detailData.completeStatus === '未开始' ? '学员尚未开始学习' : detailData.completeStatus === '已完成' ? '学习进度正常，学员已完成全部学习内容' : '学习进度正常，学员积极性高'}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={learningData?.materialTitle || '学习'}
        open={isLearningVisible}
        onCancel={() => {
          Modal.confirm({
            title: '确认退出',
            content: '确定要退出学习吗？未保存的进度将丢失。',
            okText: '确定退出',
            cancelText: '取消',
            onOk: () => {
              setIsLearningVisible(false)
              setIsPlaying(false)
            }
          })
        }}
        footer={null}
        width={1000}
        bodyStyle={{ padding: 0 }}
      >
        {learningData && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '750px' }}>
            <div style={{ padding: 16, backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
              <h3 style={{ marginBottom: 8, fontSize: 15, fontWeight: 600 }}>学习信息面板</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar size={48} icon={<EyeOutlined />} />
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  <div>
                    <span style={{ color: '#888', fontSize: 11 }}>学员姓名</span>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{learningData.name}</div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: 11 }}>所属部门</span>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{learningData.department}</div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: 11 }}>资料标题</span>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{learningData.materialTitle}</div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: 11 }}>资料分类</span>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{learningData.category}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex' }}>
              <div style={{ flex: 2, backgroundColor: '#000', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#fff' }}>
                  <div style={{ textAlign: 'center' }}>
                    {isPlaying ? (
                      <PauseCircleOutlined style={{ fontSize: 80, marginBottom: 16, cursor: 'pointer' }} onClick={handlePausePlay} />
                    ) : (
                      <PlayCircleOutlined style={{ fontSize: 80, marginBottom: 16, cursor: 'pointer' }} onClick={handlePausePlay} />
                    )}
                    <p>视频播放区域</p>
                    <p style={{ color: '#999', fontSize: 14 }}>HTML5 Video Player</p>
                    <p style={{ color: '#666', fontSize: 12, marginTop: 8 }}>当前进度：{Math.floor(currentTime / duration * 100)}%</p>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: 'rgba(0,0,0,0.7)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Button type="text" icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />} onClick={handlePausePlay} style={{ color: '#fff' }} />
                    <span style={{ color: '#fff', fontSize: 12 }}>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                      style={{ flex: 1, height: 4 }}
                    />
                    <Button type="text" icon={<BellOutlined />} style={{ color: '#fff' }} />
                    <Button type="text" icon={<SearchOutlined />} style={{ color: '#fff' }} />
                  </div>
                  <select style={{ backgroundColor: '#333', color: '#fff', border: 'none', padding: 4 }}>
                    <option value="0.75">0.75x</option>
                    <option value="1" selected>1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                  </select>
                </div>
              </div>

              <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#333' }}>学习时长累计</h3>
                  <div style={{ backgroundColor: '#fff', padding: 10, borderRadius: 6 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, color: '#177DDC' }}>
                      <ClockCircleOutlined style={{ marginRight: 5 }} />
                      {formatTime(learnedDuration * 60)}
                    </div>
                    <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>本次学习累计时长</div>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#333' }}>学习进度</h3>
                  <div style={{ backgroundColor: '#fff', padding: 10, borderRadius: 6 }}>
                    <Progress percent={Math.floor(currentTime / duration * 100)} strokeColor="#177DDC" strokeWidth={7} />
                    <div style={{ textAlign: 'right', marginTop: 5, fontSize: 12 }}>
                      已完成 <span style={{ fontWeight: 600, color: '#177DDC' }}>{Math.floor(currentTime / duration * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#333' }}>上次学习到</h3>
                  <div style={{ backgroundColor: '#fff', padding: 10, borderRadius: 6 }}>
                    <div style={{ color: '#999', fontSize: 11 }}>视频时间点</div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{formatTime(currentTime)}</div>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#333' }}>完成状态</h3>
                  <div style={{ backgroundColor: '#fff', padding: 10, borderRadius: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {Math.floor(currentTime / duration * 100) === 100 ? (
                        <Tag color="green" style={{ fontSize: 13, padding: '3px 10px' }}>已完成</Tag>
                      ) : Math.floor(currentTime / duration * 100) === 0 ? (
                        <Tag color="default" style={{ fontSize: 13, padding: '3px 10px' }}>未开始</Tag>
                      ) : (
                        <Tag color="orange" style={{ fontSize: 13, padding: '3px 10px' }}>学习中</Tag>
                      )}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 11, color: '#666' }}>
                      {Math.floor(currentTime / duration * 100) === 100 ? (
                        <span>恭喜！您已完成全部学习内容</span>
                      ) : Math.floor(currentTime / duration * 100) === 0 ? (
                        <span>请点击播放按钮开始学习</span>
                      ) : (
                        <span>继续加油，还剩 <strong style={{ color: '#177DDC' }}>{Math.floor((1 - currentTime / duration) * 100)}%</strong> 完成</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ backgroundColor: '#fff', padding: 10, borderRadius: 6 }}>
                    <p style={{ fontSize: 11, color: '#ff4d4f', textAlign: 'center', lineHeight: 1.4 }}>
                      <ExclamationCircleOutlined style={{ marginRight: 3 }} />
                      请不要关闭窗口或切换到其他应用，否则可能不计入学习时长。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 20, backgroundColor: '#fff', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button type="primary" onClick={handleSaveProgress}>暂存并退出</Button>
              <Button type="primary" disabled={Math.floor(currentTime / duration * 100) < 100} onClick={handleCompleteLearning}>完成学习</Button>
              <Button onClick={() => {
                Modal.confirm({
                  title: '确认退出',
                  content: '确定要退出学习吗？未保存的进度将丢失。',
                  okText: '确定退出',
                  cancelText: '取消',
                  onOk: () => {
                    setIsLearningVisible(false)
                    setIsPlaying(false)
                  }
                })
              }}>取消</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}