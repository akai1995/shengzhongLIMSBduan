import { Card, Form, Button, Table, Modal, Tag, Space, Upload, message, Row, Col, Input, Result } from 'antd'
import { UploadOutlined, SyncOutlined, FileTextOutlined, SaveOutlined, DownloadOutlined, CheckCircleOutlined, ExclamationCircleOutlined, EditOutlined, CameraOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'

const { TextArea } = Input

interface RecognitionRecord {
  key: string
  fileName: string
  recognitionTime: string
  status: 'success' | 'failed'
}

interface FieldData {
  fieldName: string
  fieldValue: string
  confidence: number
  needsReview: boolean
}

interface RecognitionResult {
  recognitionStatus: '识别成功' | '识别中' | '识别失败'
  fileName: string
  fieldData: FieldData[]
}

interface OCRRecognitionProps {
  compact?: boolean
  onInsertToDocument?: (text: string) => void
}

export default function OCRRecognition({ compact = false, onInsertToDocument }: OCRRecognitionProps) {
  const [form] = Form.useForm()
  const [recognizing, setRecognizing] = useState(false)
  const [recordList, setRecordList] = useState<RecognitionRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<RecognitionResult | null>(null)
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [modalRecord, setModalRecord] = useState<RecognitionResult | null>(null)
  const [editingRecord, setEditingRecord] = useState<RecognitionResult | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [cameraVisible, setCameraVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const fileNames = [
    '检验报告_LAB20260501001.pdf',
    '申请单_APP20260515002.jpg',
    '检验报告_LAB20260501003.png',
    '申请单_APP20260515004.pdf',
    '检验报告_LAB20260501005.jpeg',
    '申请单_APP20260515006.jpg',
    '检验报告_LAB20260501007.pdf',
    '申请单_APP20260515008.doc',
    '检验报告_LAB20260501009.pdf',
    '申请单_APP20260515010.jpg',
  ]

  const initialRecords: RecognitionRecord[] = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    fileName: fileNames[i],
    recognitionTime: `2026-05-${String(20 - (i % 7)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String(i * 7).padStart(2, '0')}:00`,
    status: i % 5 === 0 ? 'failed' : 'success',
  }))

  useEffect(() => {
    setRecordList(initialRecords)
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleRecognize = () => {
    const values = form.getFieldsValue()
    
    if (!values.files || values.files.length === 0) {
      message.warning('请先上传文件')
      return
    }

    setRecognizing(true)
    setTimeout(() => {
      const now = new Date()
      const fileName = `识别文档_${now.getTime()}.pdf`
      
      const newRecord: RecognitionRecord = {
        key: String(Date.now()),
        fileName,
        recognitionTime: now.toLocaleString('zh-CN').replace(/\//g, '-').replace(/:\d{2}$/, ':00'),
        status: Math.random() > 0.1 ? 'success' : 'failed',
      }

      setRecordList(prev => [newRecord, ...prev])

      const mockResult: RecognitionResult = {
        recognitionStatus: '识别成功',
        fileName,
        fieldData: generateMockFieldData(),
      }

      setSelectedRecord(mockResult)
      setRecognizing(false)
      form.resetFields()
      message.success('识别完成')
    }, 3000)
  }

  const generateMockFieldData = (): FieldData[] => {
    return [
      { fieldName: '报告编号', fieldValue: 'LAB20260501001', confidence: 98, needsReview: false },
      { fieldName: '报告日期', fieldValue: '2026-05-15', confidence: 95, needsReview: false },
      { fieldName: '送检机构', fieldValue: '浙江省肿瘤医院检验科', confidence: 92, needsReview: false },
      { fieldName: '报告医生', fieldValue: '李明华', confidence: 97, needsReview: false },
      { fieldName: '样本类型', fieldValue: '血液', confidence: 99, needsReview: false },
      { fieldName: '样本编号', fieldValue: 'S20260515001', confidence: 96, needsReview: false },
      { fieldName: '采集时间', fieldValue: '2026-05-15 08:30', confidence: 94, needsReview: false },
      { fieldName: '接收时间', fieldValue: '2026-05-15 09:15', confidence: 93, needsReview: true },
      { fieldName: '白细胞计数', fieldValue: '6.5×10⁹/L', confidence: 98, needsReview: false },
      { fieldName: '红细胞计数', fieldValue: '4.8×10¹²/L', confidence: 97, needsReview: false },
      { fieldName: '血红蛋白', fieldValue: '142 g/L', confidence: 96, needsReview: false },
      { fieldName: '血小板计数', fieldValue: '215×10⁹/L', confidence: 95, needsReview: false },
      { fieldName: '审核医生', fieldValue: '王建国', confidence: 99, needsReview: false },
      { fieldName: '审核时间', fieldValue: '2026-05-15 14:30', confidence: 94, needsReview: false },
    ]
  }

  const handleView = (record: RecognitionRecord) => {
    const mockResult: RecognitionResult = {
      recognitionStatus: record.status === 'success' ? '识别成功' : '识别失败',
      fileName: record.fileName,
      fieldData: generateMockFieldData(),
    }
    setModalRecord(mockResult)
    setEditingRecord(mockResult)
    setViewModalVisible(true)
    setIsEditing(false)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setModalRecord(editingRecord)
    setIsEditing(false)
    message.success('保存成功')
  }

  const handleCancelEdit = () => {
    setEditingRecord(modalRecord)
    setIsEditing(false)
  }

  const handleFieldChange = (index: number, value: string) => {
    if (editingRecord) {
      const newFieldData = [...editingRecord.fieldData]
      newFieldData[index] = { ...newFieldData[index], fieldValue: value }
      setEditingRecord({ ...editingRecord, fieldData: newFieldData })
    }
  }

  const handleExport = () => {
    message.success('已导出识别结果')
  }

  const handleDownload = (record: RecognitionRecord) => {
    message.success(`已下载: ${record.fileName}`)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraVisible(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch {
      message.error('无法访问摄像头，请检查权限设置')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setCameraVisible(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `拍照_${Date.now()}.jpg`, { type: 'image/jpeg' })
          form.setFieldsValue({ files: [{ uid: `-${Date.now()}`, name: file.name, status: 'done', originFileObj: file }] })
          stopCamera()
          message.success('拍照成功')
        }
      }, 'image/jpeg', 0.9)
    }
  }

  const recordColumns = [
    { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 280, ellipsis: true },
    { title: '识别时间', dataIndex: 'recognitionTime', key: 'recognitionTime', width: 180 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'success' ? 'green' : 'red'}>
          {status === 'success' ? '识别成功' : '识别失败'}
        </Tag>
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 160,
      render: (_: any, record: RecognitionRecord) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleView(record)} size="small">
            编辑
          </Button>
          <Button type="text" icon={<DownloadOutlined />} onClick={() => handleDownload(record)} size="small">
            下载
          </Button>
        </Space>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      {!compact && <PageTitle>OCR识别</PageTitle>}

      {compact ? (
        <>
          {selectedRecord ? (
            <div style={{ padding: '12px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>识别完成</span>
                <span style={{ color: '#8c8c8c', fontSize: 12, marginLeft: 'auto' }}>{selectedRecord.fileName}</span>
              </div>
              <div style={{ background: '#f5f5f5', borderRadius: 8, padding: 12, maxHeight: 300, overflow: 'auto', marginBottom: 12 }}>
                {selectedRecord.fieldData.map((field, idx) => (
                  <div key={idx} style={{ display: 'flex', padding: '6px 0', borderBottom: idx < selectedRecord.fieldData.length - 1 ? '1px solid #e8e8e8' : 'none' }}>
                    <span style={{ color: '#8c8c8c', minWidth: 80, fontSize: 13 }}>{field.fieldName}</span>
                    <span style={{ color: '#262626', fontSize: 13 }}>{field.fieldValue}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <Button onClick={() => setSelectedRecord(null)}>继续上传</Button>
                {onInsertToDocument && (
                  <Button type="primary" onClick={() => {
                    const text = selectedRecord.fieldData.map(f => `${f.fieldName}: ${f.fieldValue}`).join('\n')
                    onInsertToDocument(text)
                  }}>
                    插入文档
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Card 
              bordered={false}
              style={{ borderRadius: 10, boxShadow: 'none' }} 
              styles={{ body: { padding: 20 } }}
            >
              <Form form={form} layout="vertical">
                <Form.Item name="files" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                  <Upload.Dragger
                    beforeUpload={() => false}
                    accept=".jpg,.png,.jpeg,.pdf"
                    multiple
                    maxCount={10}
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined style={{ fontSize: 48, color: '#177DDC' }} />
                    </p>
                    <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                    <p className="ant-upload-hint">支持 jpg、png、jpeg、pdf 格式，单文件不超过20MB</p>
                  </Upload.Dragger>
                </Form.Item>

                <Form.Item>
                  <div
                    onClick={() => document.getElementById('ocr-photo-upload')?.click()}
                    style={{
                      border: '1px dashed #d9d9d9',
                      borderRadius: 8,
                      padding: '20px 0',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s',
                      background: '#fafafa',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#177DDC')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d9d9d9')}
                  >
                    <p style={{ marginBottom: 8 }}>
                      <CameraOutlined style={{ fontSize: 48, color: '#177DDC' }} />
                    </p>
                    <p style={{ fontSize: 14, color: '#262626', margin: 0 }}>点击拍照上传</p>
                    <p style={{ fontSize: 12, color: '#8C8C8C', margin: '4px 0 0' }}>选择本地图片识别文字内容</p>
                    <input
                      id="ocr-photo-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const newFileList: any[] = [{
                          uid: String(Date.now()),
                          name: file.name,
                          status: 'done' as const,
                          originFileObj: file,
                        }]
                        form.setFieldsValue({ files: newFileList })
                        e.target.value = ''
                      }}
                    />
                  </div>
                </Form.Item>

                <Form.Item style={{ textAlign: 'center' }}>
                  <Button
                    type="primary"
                    onClick={handleRecognize}
                    loading={recognizing}
                    icon={<SyncOutlined spin={recognizing} />}
                  >
                    {recognizing ? '识别中...' : '开始智能识别'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </>
      ) : (
        <>
        <Row gutter={24}>
        <Col span={8}>
          <Card 
            title="文件上传" 
            style={{ height: '100%', borderRadius: 10 }} 
            styles={{ body: { padding: 20 } }}
          >
            <Form form={form} layout="vertical">
              <Form.Item label="文件上传" name="files" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                <Upload.Dragger
                  beforeUpload={() => false}
                  accept=".jpg,.png,.jpeg,.pdf"
                  multiple
                  maxCount={10}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: 48, color: '#177DDC' }} />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                  <p className="ant-upload-hint">支持 jpg、png、jpeg、pdf 格式，单文件不超过20MB</p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item style={{ textAlign: 'center' }}>
                <Space>
                  <Button
                    icon={<CameraOutlined />}
                    onClick={() => document.getElementById('ocr-photo-upload-full')?.click()}
                  >
                    拍照上传
                  </Button>
                  <input
                    id="ocr-photo-upload-full"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const newFileList: any[] = [{
                        uid: String(Date.now()),
                        name: file.name,
                        status: 'done' as const,
                        originFileObj: file,
                      }]
                      form.setFieldsValue({ files: newFileList })
                      e.target.value = ''
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={handleRecognize}
                    loading={recognizing}
                    icon={<SyncOutlined spin={recognizing} />}
                  >
                    {recognizing ? '识别中...' : '本地上传'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={16}>
          <Card 
            title="识别结果" 
            style={{ height: '100%', borderRadius: 10 }} 
            styles={{ body: { padding: 20 } }}
          >
            {selectedRecord ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: 16 }}>
                  <Space size={24}>
                    <Tag color={selectedRecord.recognitionStatus === '识别成功' ? 'green' : 'red'} icon={
                      selectedRecord.recognitionStatus === '识别成功' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
                    }>
                      {selectedRecord.recognitionStatus}
                    </Tag>
                    <span style={{ color: '#595959' }}>文件名称：{selectedRecord.fileName}</span>
                  </Space>
                </div>

                <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#FAFAFA', borderRadius: 8, padding: 16 }}>
                  {selectedRecord.fieldData.length > 0 ? (
                    <div>
                      {selectedRecord.fieldData.map((field, index) => (
                        <div 
                          key={index} 
                          style={{ 
                            display: 'flex', 
                            padding: '12px 0', 
                            borderBottom: index < selectedRecord.fieldData.length - 1 ? '1px solid #E8E8E8' : 'none'
                          }}
                        >
                          <div style={{ width: 160, fontWeight: 500, color: '#262626', flexShrink: 0 }}>
                            {field.fieldName}
                          </div>
                          <div style={{ flex: 1, color: '#262626' }}>
                            {field.fieldValue}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#8C8C8C' }}>
                      <FileTextOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                      <p>暂无识别数据</p>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <Button icon={<DownloadOutlined />} onClick={handleExport}>
                    导出
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#8C8C8C' }}>
                <FileTextOutlined style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }} />
                <p>请上传文件并开始识别，或从下方记录列表中选择查看</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="识别记录" style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
        <Table
          columns={recordColumns}
          dataSource={recordList}
          pagination={{ pageSize: 5, showSizeChanger: false, showTotal: (total) => `共 ${total} 条记录` }}
          style={{ padding: 16 }}
        />
      </Card>

      <Modal
        title="识别结果详情"
        open={viewModalVisible}
        onCancel={() => { 
          setViewModalVisible(false)
          setIsEditing(false)
        }}
        footer={
          <Space>
            {isEditing ? (
              <>
                <Button onClick={handleCancelEdit}>取消</Button>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
              </>
            ) : (
              <>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
                <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>编辑</Button>
              </>
            )}
          </Space>
        }
        width={800}
      >
        {editingRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '500px' }}>
            <div style={{ marginBottom: 16 }}>
              <Space size={24}>
                <Tag color={editingRecord.recognitionStatus === '识别成功' ? 'green' : 'red'} icon={
                  editingRecord.recognitionStatus === '识别成功' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
                }>
                  {editingRecord.recognitionStatus}
                </Tag>
                <span style={{ color: '#595959' }}>文件名称：{editingRecord.fileName}</span>
              </Space>
            </div>

            <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#FAFAFA', borderRadius: 8, padding: 16 }}>
              {editingRecord.fieldData.length > 0 ? (
                <div>
                  {editingRecord.fieldData.map((field, index) => (
                    <div 
                      key={index} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: '8px 0', 
                        borderBottom: index < editingRecord.fieldData.length - 1 ? '1px solid #E8E8E8' : 'none'
                      }}
                    >
                      <div style={{ width: 120, fontWeight: 500, color: '#262626', flexShrink: 0 }}>
                        {field.fieldName}
                      </div>
                      <div style={{ flex: 1 }}>
                        {isEditing ? (
                          <Input 
                            value={field.fieldValue} 
                            onChange={(e) => handleFieldChange(index, e.target.value)}
                          />
                        ) : (
                          <span style={{ color: '#262626' }}>{field.fieldValue}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#8C8C8C' }}>
                  <FileTextOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                  <p>暂无识别数据</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
        </>
      )}
      <Modal
        title="拍照上传"
        open={cameraVisible}
        onCancel={stopCamera}
        footer={null}
        width={640}
        destroyOnClose
      >
        <div style={{ textAlign: 'center' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: '100%', borderRadius: 8, backgroundColor: '#000' }}
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ marginTop: 16 }}>
            <Space>
              <Button onClick={stopCamera}>取消</Button>
              <Button type="primary" icon={<CameraOutlined />} onClick={capturePhoto}>
                拍照
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
    </div>
  )
}