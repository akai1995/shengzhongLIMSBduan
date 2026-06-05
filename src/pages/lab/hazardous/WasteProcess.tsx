import { Card, Form, Input, Button, Select, Table, Modal, Tag, DatePicker, message, Row, Col, Upload } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

export default function WasteProcess() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const columns = [
    { title: '记录ID', dataIndex: 'id', key: 'id' },
    { title: '关联申请单号', dataIndex: 'relatedId', key: 'relatedId' },
    { title: '废弃物类型', dataIndex: 'type', key: 'type', render: (type: string) => {
      const colorMap: Record<string, string> = {
        '有机废液': 'blue',
        '无机废液': 'green',
        '固体废物': 'orange',
        '锐器': 'red',
        '生物废物': 'purple',
      }
      return <Tag color={colorMap[type] || 'gray'}>{type}</Tag>
    }},
    { title: '处理数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '处理单位', dataIndex: 'processor', key: 'processor' },
    { title: '处理方式', dataIndex: 'method', key: 'method' },
    { title: '处理日期', dataIndex: 'date', key: 'date' },
    { title: '处理凭证', dataIndex: 'certificate', key: 'certificate', render: (certificate: string) => (
      <Button type="link" icon={<FileTextOutlined />} onClick={() => setPreviewImage(certificate)}>查看凭证</Button>
    )},
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 120, render: (_: any, record: any) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="text" icon={<EditOutlined />} onClick={() => {
          setCurrentRecord(record)
          setIsEditMode(true)
          form.resetFields()
          form.setFieldsValue({
            relatedId: record.relatedId,
            quantity: record.quantity,
            processor: record.processor,
            method: record.method,
            date: record.date,
          })
          setDetailModalVisible(true)
        }}>编辑</Button>
        <Button type="text" icon={<DeleteOutlined />} style={{ color: '#FF4D4F' }} onClick={() => {
          setCurrentRecord(record)
          setDeleteModalVisible(true)
        }}>删除</Button>
      </div>
    )},
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const types = ['有机废液', '无机废液', '固体废物', '锐器', '生物废物']
    const processors = ['环保处理公司A', '废弃物处理中心B', '专业处理机构C', '环保处理公司D']
    const methods = ['焚烧', '填埋', '化学处理', '回收利用', '高压灭菌', '委托处理']
    return {
      key: String(i + 1),
      id: `WP2024${String(i + 1).padStart(4, '0')}`,
      relatedId: `WR2024${String(Math.floor(i / 2) + 1).padStart(4, '0')}`,
      type: types[i % types.length],
      quantity: `${5 + Math.floor(Math.random() * 20)}kg`,
      processor: processors[i % processors.length],
      method: methods[i % methods.length],
      date: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      certificate: `/api/certificate/${i + 1}`,
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
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>处理记录</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="废弃物类型" name="type">
                    <Select placeholder="请选择废弃物类型" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="有机废液">有机废液</Option>
                      <Option value="无机废液">无机废液</Option>
                      <Option value="固体废物">固体废物</Option>
                      <Option value="锐器">锐器</Option>
                      <Option value="生物废物">生物废物</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="处理单位" name="processor"><Input placeholder="请输入处理单位" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="处理方式" name="method">
                    <Select placeholder="请选择处理方式" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="焚烧">焚烧</Option>
                      <Option value="填埋">填埋</Option>
                      <Option value="化学处理">化学处理</Option>
                      <Option value="回收利用">回收利用</Option>
                      <Option value="高压灭菌">高压灭菌</Option>
                      <Option value="委托处理">委托处理</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="处理日期" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={18}></Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="废弃物类型" name="type">
                  <Select placeholder="请选择废弃物类型" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="有机废液">有机废液</Option>
                    <Option value="无机废液">无机废液</Option>
                    <Option value="固体废物">固体废物</Option>
                    <Option value="锐器">锐器</Option>
                    <Option value="生物废物">生物废物</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="处理单位" name="processor"><Input placeholder="请输入处理单位" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="处理方式" name="method">
                  <Select placeholder="请选择处理方式" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="焚烧">焚烧</Option>
                    <Option value="填埋">填埋</Option>
                    <Option value="化学处理">化学处理</Option>
                    <Option value="回收利用">回收利用</Option>
                    <Option value="高压灭菌">高压灭菌</Option>
                    <Option value="委托处理">委托处理</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary">查询</Button>
                <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setCurrentRecord(null)
            setIsEditMode(false)
            form.resetFields()
            setDetailModalVisible(true)
          }}>新增处理</Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title={isEditMode ? '编辑处理记录' : '新增处理记录'}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>保存</Button>,
        ]}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="关联申请单" name="relatedId" rules={[{ required: true, message: '请选择关联申请单' }]}>
            <Select placeholder="请选择">
              <Option value="WR20240001">WR20240001 - 有机废液 - 10kg</Option>
              <Option value="WR20240002">WR20240002 - 无机废液 - 15kg</Option>
              <Option value="WR20240003">WR20240003 - 固体废物 - 20kg</Option>
            </Select>
          </Form.Item>
          <Form.Item label="实际处理数量" name="quantity" rules={[{ required: true, message: '请输入实际处理数量' }]}>
            <Input placeholder="如：10kg" />
          </Form.Item>
          <Form.Item label="处理单位" name="processor" rules={[{ required: true, message: '请输入处理单位' }]}>
            <Input placeholder="请输入处理单位" />
          </Form.Item>
          <Form.Item label="处理方式" name="method" rules={[{ required: true, message: '请选择处理方式' }]}>
            <Select placeholder="请选择">
              <Option value="焚烧">焚烧</Option>
              <Option value="填埋">填埋</Option>
              <Option value="化学处理">化学处理</Option>
              <Option value="回收利用">回收利用</Option>
              <Option value="高压灭菌">高压灭菌</Option>
              <Option value="委托处理">委托处理</Option>
            </Select>
          </Form.Item>
          <Form.Item label="处理日期" name="date" rules={[{ required: true, message: '请选择处理日期' }]}>
            <DatePicker style={{ width: '100%' }} valueFormat="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="处理凭证">
            <Upload.Dragger accept=".pdf,.jpg,.png" multiple>
              <p className="ant-upload-drag-icon">
                <FileTextOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">支持PDF、图片等格式</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
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
        <p>确定要删除该处理记录吗？此操作不可恢复。</p>
      </Modal>

      <Modal
        title="处理凭证预览"
        open={!!previewImage}
        onCancel={() => setPreviewImage(null)}
        footer={null}
        width={800}
      >
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <img 
            src={previewImage} 
            alt="处理凭证" 
            style={{ maxWidth: '100%', maxHeight: 500 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://via.placeholder.com/600x400?text=凭证图片预览'
            }}
          />
        </div>
      </Modal>
    </div>
  )
}
