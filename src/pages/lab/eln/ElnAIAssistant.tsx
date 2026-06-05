import { Card, Form, Input, Button, Select, Table, Tag, Modal, message, Row, Col } from 'antd'
import { PlusOutlined, EyeOutlined, ImportOutlined, ReloadOutlined, HistoryOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'
import { useNavigate } from 'react-router-dom'

const { TextArea } = Input
const { Option } = Select

interface AIGeneratedRecord {
  key: string
  id: string
  experimentName: string
  template: string
  purpose: string
  keyPoints: string[]
  generatedContent: {
    steps: string
    data: string
    analysis: string
  }
  status: 'generating' | 'success' | 'failed'
  generateTime: string
}

const templates = [
  '细胞培养模板',
  'PCR实验模板',
  'Western Blot模板',
  '免疫组化模板',
  '动物实验模板',
  '临床样本处理模板',
  '数据统计分析模板',
  '试剂配制模板',
]

export default function ElnAIAssistant() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [generating, setGenerating] = useState(false)
  const [generatedResult, setGeneratedResult] = useState<AIGeneratedRecord | null>(null)
  const [historyData, setHistoryData] = useState<AIGeneratedRecord[]>([])
  const [viewModalVisible, setViewModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<AIGeneratedRecord | null>(null)

  // 生成100条模拟数据
  const generateMockData = (): AIGeneratedRecord[] => {
    const experimentNames = [
      '细胞培养实验', 'PCR扩增实验', 'Western Blot实验', '免疫组化实验', '动物实验',
      '临床样本处理', '数据统计分析', '试剂配制实验', '蛋白质纯化实验', '基因测序实验',
      '流式细胞术实验', '荧光定量PCR实验', 'ELISA检测实验', '细胞转染实验', '病毒包装实验',
      'CRISPR基因编辑实验', '单细胞测序实验', '代谢组学分析', '蛋白质组学分析', '生物信息学分析'
    ]
    
    const templateList = [
      '细胞培养模板', 'PCR实验模板', 'Western Blot模板', '免疫组化模板', '动物实验模板',
      '临床样本处理模板', '数据统计分析模板', '试剂配制模板'
    ]
    
    const purposes = [
      '研究不同条件下细胞生长情况', '扩增目标DNA片段', '检测蛋白表达水平', '观察组织形态变化',
      '评估药物毒性作用', '分析临床样本特征', '统计实验数据规律', '配制标准试剂溶液',
      '纯化目标蛋白质', '测定基因序列', '分析细胞表面标志物', '定量检测基因表达',
      '检测抗原抗体反应', '建立细胞模型', '制备病毒载体', '编辑目标基因',
      '分析单细胞特征', '检测代谢产物', '分析蛋白质组成', '进行生物信息学挖掘'
    ]
    
    const keyPointsList = [
      ['温度控制', 'CO2浓度', '培养基更换'],
      ['引物设计', '退火温度', '循环次数'],
      ['蛋白提取', '电泳分离', '转膜', '抗体孵育'],
      ['组织固定', '切片厚度', '染色时间'],
      ['给药剂量', '观察周期', '指标检测'],
      ['样本采集', '保存条件', '处理方法'],
      ['数据清洗', '统计方法', '图表绘制'],
      ['试剂纯度', '配制浓度', '保存条件'],
      ['裂解条件', '纯化柱选择', '洗脱缓冲液'],
      ['DNA质量', '测序深度', '数据分析'],
      ['抗体选择', '染色条件', '流式参数'],
      ['RNA提取', '反转录效率', '内参基因'],
      ['包被条件', '孵育时间', '显色方法'],
      ['转染试剂', '细胞密度', '转染时间'],
      ['病毒滴度', '感染条件', '筛选方法'],
      ['gRNA设计', '转染效率', '编辑效率'],
      ['细胞分选', '测序平台', '数据分析'],
      ['样本制备', '色谱条件', '质谱参数'],
      ['蛋白提取', '酶解条件', '质谱分析'],
      ['数据下载', '质量控制', '差异分析']
    ]
    
    const statuses: ('generating' | 'success' | 'failed')[] = ['success', 'success', 'success', 'success', 'failed']
    
    return Array.from({ length: 100 }, (_, i) => {
      const expIndex = i % experimentNames.length
      const templateIndex = i % templateList.length
      const purposeIndex = i % purposes.length
      const keyPointsIndex = i % keyPointsList.length
      const statusIndex = i % statuses.length
      
      const date = new Date('2026-05-01')
      date.setDate(date.getDate() + Math.floor(i / 5))
      date.setHours(8 + (i % 10), (i * 5) % 60, 0)
      
      return {
        key: String(i + 1),
        id: `AI${date.toISOString().slice(0, 10).replace(/-/g, '')}${String(i + 1).padStart(3, '0')}`,
        experimentName: experimentNames[expIndex] + (i >= experimentNames.length ? `-${Math.floor(i / experimentNames.length) + 1}` : ''),
        template: templateList[templateIndex],
        purpose: purposes[purposeIndex],
        keyPoints: keyPointsList[keyPointsIndex],
        generatedContent: {
          steps: `1. 准备实验材料和设备\n2. 根据实验目的设置实验条件\n3. 按照要点${keyPointsList[keyPointsIndex].join('、')}进行操作\n4. 记录实验数据\n5. 分析实验结果`,
          data: `实验数据记录表：\n- 样本编号：${String(i * 10 + 1).padStart(3, '0')}-${String(i * 10 + 10).padStart(3, '0')}\n- 测量指标：${keyPointsList[keyPointsIndex].join('、')}\n- 记录时间：${date.toLocaleString()}`,
          analysis: `基于实验目的和关键要点${keyPointsList[keyPointsIndex].join('、')}，实验结果${statuses[statusIndex] === 'success' ? '符合预期，数据可靠' : '出现异常，需要重新实验'}。`,
        },
        status: statuses[statusIndex],
        generateTime: date.toLocaleString(),
      }
    })
  }

  useEffect(() => {
    // 初始化历史数据
    const initialHistory = generateMockData()
    setHistoryData(initialHistory)
  }, [])

  const handleGenerate = async (values: any) => {
    setGenerating(true)
    
    // 模拟AI生成过程
    setTimeout(() => {
      const keyPoints = values.keyPoints.split('，').map((p: string) => p.trim()).filter((p: string) => p)
      
      const newRecord: AIGeneratedRecord = {
        key: String(Date.now()),
        id: `AI${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(historyData.length + 1).padStart(3, '0')}`,
        experimentName: values.experimentName,
        template: values.template,
        purpose: values.purpose,
        keyPoints: keyPoints,
        generatedContent: {
          steps: `1. 准备实验材料和设备\n2. 根据实验目的"${values.purpose}"设置实验条件\n3. 按照要点${keyPoints.join('、')}进行操作\n4. 记录实验数据\n5. 分析实验结果`,
          data: `实验数据记录表：\n- 样本编号：001-010\n- 测量指标：${keyPoints.join('、')}\n- 记录时间：${new Date().toLocaleString()}`,
          analysis: `基于实验目的"${values.purpose}"和关键要点${keyPoints.join('、')}，预期实验结果将显示明显的规律性变化，建议进行重复实验验证。`,
        },
        status: 'success',
        generateTime: new Date().toLocaleString(),
      }
      
      setGeneratedResult(newRecord)
      setHistoryData([newRecord, ...historyData])
      setGenerating(false)
      message.success('AI生成实验记录成功！')
    }, 2000)
  }

  const handleRegenerate = () => {
    const values = form.getFieldsValue()
    handleGenerate(values)
  }

  const handleImport = (record: AIGeneratedRecord) => {
    message.success('已导入至实验记录，正在跳转...')
    // 存储到localStorage，然后跳转到实验记录页面
    localStorage.setItem('aiGeneratedRecord', JSON.stringify(record))
    setTimeout(() => {
      navigate('/lab/eln/record')
    }, 1000)
  }

  const handleView = (record: AIGeneratedRecord) => {
    setCurrentRecord(record)
    setViewModalVisible(true)
  }

  const columns = [
    { title: '生成时间', dataIndex: 'generateTime', key: 'generateTime', width: 180 },
    { title: '实验名称', dataIndex: 'experimentName', key: 'experimentName', width: 200 },
    { title: '使用的模板', dataIndex: 'template', key: 'template', width: 180 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 120,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          generating: { color: 'processing', text: '生成中' },
          success: { color: 'success', text: '生成成功' },
          failed: { color: 'error', text: '生成失败' },
        }
        const { color, text } = statusMap[status] || { color: 'default', text: status }
        return <Tag color={color}>{text}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_: any, record: AIGeneratedRecord) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleView(record)}>
            查看
          </Button>
          <Button type="text" icon={<ImportOutlined />} onClick={() => handleImport(record)}>
            导入至实验记录
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ padding: 0 }}>
      <PageTitle title="AI助手" />

      <Row gutter={24} style={{ marginBottom: 24 }}>
        {/* 表单区域 - 左侧 */}
        <Col span={12}>
          <Card title="AI辅助书写实验记录" style={{ height: '100%', borderRadius: 10 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerate}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="实验名称"
                name="experimentName"
                rules={[{ required: true, message: '请输入实验名称' }]}
              >
                <Input placeholder="请输入实验名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="选择模板"
                name="template"
                rules={[{ required: true, message: '请选择模板' }]}
              >
                <Select placeholder="请选择模板">
                  {templates.map(template => (
                    <Option key={template} value={template}>{template}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="实验目的"
            name="purpose"
            rules={[{ required: true, message: '请输入实验目的' }]}
          >
            <TextArea 
              rows={3} 
              placeholder="例如：探究不同温度下酶活性的变化"
            />
          </Form.Item>

          <Form.Item
            label="实验要点"
            name="keyPoints"
            rules={[{ required: true, message: '请输入实验要点' }]}
          >
            <TextArea 
              rows={2} 
              placeholder="用逗号分隔多个要点，例如：温度梯度，pH缓冲液，酶浓度，反应时间"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={generating}
              icon={<PlusOutlined />}
            >
              生成实验记录
            </Button>
          </Form.Item>
        </Form>
          </Card>
        </Col>

        {/* 生成结果预览区 - 右侧 */}
        <Col span={12}>
          <Card 
            title="生成结果预览" 
            style={{ height: '100%', borderRadius: 10 }}
            extra={
              generatedResult && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button icon={<ReloadOutlined />} onClick={handleRegenerate}>
                    重新生成
                  </Button>
                  <Button type="primary" icon={<ImportOutlined />} onClick={() => handleImport(generatedResult)}>
                    导入至实验记录
                  </Button>
                </div>
              )
            }
          >
            {generatedResult ? (
              <>
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ marginBottom: 8 }}>实验步骤</h4>
                  <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                    {generatedResult.generatedContent.steps}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ marginBottom: 8 }}>实验数据</h4>
                  <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                    {generatedResult.generatedContent.data}
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: 8 }}>结果分析</h4>
                  <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
                    {generatedResult.generatedContent.analysis}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#999' }}>
                <p>请在左侧填写实验信息</p>
                <p>点击"生成实验记录"按钮</p>
                <p>AI将自动生成实验记录草稿</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 历史生成记录表格 */}
      <Card title="AI生成历史" extra={<HistoryOutlined />} style={{ borderRadius: 10 }}>
        <Table
          columns={columns}
          dataSource={historyData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 查看弹窗 */}
      <Modal
        title={`AI生成的实验记录 (${currentRecord?.generateTime})`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            关闭
          </Button>,
          <Button 
            key="import" 
            type="primary" 
            icon={<ImportOutlined />}
            onClick={() => currentRecord && handleImport(currentRecord)}
          >
            导入至实验记录
          </Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>实验名称：</strong>{currentRecord.experimentName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>使用的模板：</strong>{currentRecord.template}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>实验目的：</strong>{currentRecord.purpose}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>实验要点：</strong>
              <ul style={{ marginTop: 8, marginLeft: 20 }}>
                {currentRecord.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            <h4 style={{ marginBottom: 8 }}>AI生成的实验步骤</h4>
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.generatedContent.steps}
            </div>

            <h4 style={{ marginBottom: 8 }}>AI生成的实验数据</h4>
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.generatedContent.data}
            </div>

            <h4 style={{ marginBottom: 8 }}>AI生成的结果分析</h4>
            <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.generatedContent.analysis}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
