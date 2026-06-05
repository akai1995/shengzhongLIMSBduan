import { Card, Form, Input, Button, Select, Table, Modal, Tag, Switch, Upload, message, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select

export default function SafetyNotice() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type: string) => {
      const colorMap: Record<string, string> = {
        '安全须知': 'blue',
        '风险提示': 'orange',
        '规章制度': 'green'
      }
      return <Tag color={colorMap[type] || 'gray'}>{type}</Tag>
    }},
    { title: '发布人', dataIndex: 'publisher', key: 'publisher' },
    { title: '发布时间', dataIndex: 'publishTime', key: 'publishTime' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: boolean) => (
      <Tag color={status ? 'green' : 'gray'}>{status ? '启用' : '禁用'}</Tag>
    )},
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 180, render: (_: any, record: any) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="text" icon={<EditOutlined />} onClick={() => {
          setCurrentRecord(record)
          setIsEditMode(true)
          setDetailModalVisible(true)
        }}>编辑</Button>
        <Button type="text" icon={<DeleteOutlined />} style={{ color: '#FF4D4F' }} onClick={() => {
          setCurrentRecord(record)
          setDeleteModalVisible(true)
        }}>删除</Button>
        <Button type="text" icon={<EyeOutlined />} onClick={() => {
          setCurrentRecord(record)
          setIsEditMode(false)
          setDetailModalVisible(true)
        }}>预览</Button>
      </div>
    )},
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const types = ['规章制度', '风险提示', '安全须知', '操作规程', '应急处理']
    const publishers = ['管理员', '安全主管', '张医生', '李医生', '王医生']
    const titles = ['实验室化学品安全管理规定', '高温实验操作风险提示', '进入实验室安全须知', '仪器设备使用规范', '废弃物处理条例', '消防安全管理', '辐射防护规定', '生物安全准则']
    return {
      key: String(i + 1),
      id: `SN2024${String(i + 1).padStart(4, '0')}`,
      title: titles[i % titles.length] + (i > 7 ? `${Math.floor(i / 8) + 1}.${(i % 8) + 1}版` : ''),
      type: types[i % types.length],
      publisher: publishers[i % publishers.length],
      publishTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:00`,
      status: i % 5 !== 4,
    }
  })

  const handleSubmit = () => {
    setDetailModalVisible(false)
    message.success(isEditMode ? '修改成功' : '新增成功')
  }

  const handleDelete = () => {
    setDeleteModalVisible(false)
    message.success('删除成功')
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>安全须知</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16}>
            <Col span={6} style={{ height: 32 }}>
              <Form.Item label="标题" name="title"><Input placeholder="请输入标题" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="类型" name="type">
                <Select placeholder="请选择类型">
                  <Option value="all">全部</Option>
                  <Option value="safety">安全须知</Option>
                  <Option value="risk">风险提示</Option>
                  <Option value="rule">规章制度</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择状态">
                  <Option value="all">全部状态</Option>
                  <Option value="enabled">启用</Option>
                  <Option value="disabled">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary">查询</Button>
                    <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
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
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6} offset={18}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary">查询</Button>
                    <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
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
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setCurrentRecord(null)
            setIsEditMode(false)
            setDetailModalVisible(true)
          }}>新增须知</Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          scroll={{ x: 'max-content' }}
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title={isEditMode ? '编辑须知' : (currentRecord ? '预览须知' : '新增须知')}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={isEditMode || !currentRecord ? [
          <Button key="back" onClick={() => setDetailModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>保存</Button>,
        ] : null}
        width={700}
      >
        {isEditMode || !currentRecord ? (
          <Form layout="vertical" form={form} initialValues={currentRecord}>
            <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
              <Input placeholder="请输入标题" />
            </Form.Item>
            <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
              <Select placeholder="请选择类型">
                <Option value="安全须知">安全须知</Option>
                <Option value="风险提示">风险提示</Option>
                <Option value="规章制度">规章制度</Option>
              </Select>
            </Form.Item>
            <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入内容' }]}>
              <textarea
                placeholder="请输入内容（支持富文本）"
                style={{ width: '100%', height: 200, borderRadius: 4, padding: 8, border: '1px solid #E5E5E5' }}
              />
            </Form.Item>
            <Form.Item label="是否启用" name="status" valuePropName="checked">
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item label="附件上传">
              <Upload.Dragger accept=".pdf,.doc,.docx" multiple>
                <p className="ant-upload-drag-icon">
                  <FileTextOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                <p className="ant-upload-hint">支持PDF、Word格式，可上传多个文件</p>
              </Upload.Dragger>
            </Form.Item>
          </Form>
        ) : (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#000000', marginBottom: 16 }}>{currentRecord.title}</h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <span><Tag color={currentRecord.type === '安全须知' ? 'blue' : currentRecord.type === '风险提示' ? 'orange' : 'green'}>{currentRecord.type}</Tag></span>
              <span style={{ color: '#8C8C8C' }}>发布人：{currentRecord.publisher}</span>
              <span style={{ color: '#8C8C8C' }}>发布时间：{currentRecord.publishTime}</span>
            </div>
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16, minHeight: 200 }}>
              <p style={{ color: '#262626', lineHeight: 1.8 }}>
                这是安全须知的详细内容预览。实际内容将根据富文本编辑器的格式进行展示，支持图片、附件等多种格式。
                安全须知是实验室管理的重要组成部分，所有进入实验室的人员都必须遵守相关规定。
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDeleteModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" danger onClick={handleDelete}>确认删除</Button>,
        ]}
      >
        <p>确定要删除 "{currentRecord?.title}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  )
}