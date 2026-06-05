import { Card, Input, Button, Avatar, Space, Spin, Typography } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined, LoadingOutlined, BookOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '../../store/themeStore'
import PageTitle from '../../components/PageTitle/PageTitle'

const { TextArea } = Input
const { Text } = Typography

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: { title: string; snippet: string }[]
}

const knowledgeBase = [
  {
    keyword: '实验室安全',
    content: '实验室安全规范：1. 进入实验室必须穿戴实验服、护目镜和手套。2. 严禁在实验室内饮食。3. 易燃易爆物品应存放在专用柜中。4. 实验结束后应关闭水、电、气源。5. 发生事故立即报告并采取应急措施。',
  },
  {
    keyword: '仪器操作',
    content: '高效液相色谱仪(HPLC)操作规程：1. 开机前检查流动相是否充足。2. 打开工作站软件，初始化系统。3. 设置分析方法参数。4. 等待基线稳定后进样。5. 分析完成后冲洗系统，关机。',
  },
  {
    keyword: '数据管理',
    content: '实验数据管理规范：1. 原始数据应及时备份，至少保留两份。2. 数据文件命名规范：项目名_实验日期_实验者。3. 每周进行数据整理和归档。4. 重要数据加密存储。5. 数据共享需经项目负责人批准。',
  },
  {
    keyword: '试剂管理',
    content: '危化品试剂管理：1. 危化品需存放在专用试剂柜，双人双锁管理。2. 领用需登记，使用后及时归还。3. 废液分类收集，交由专业公司处理。4. MSDS表格随试剂存放。5. 定期盘点，确保账物相符。',
  },
  {
    keyword: 'PCR',
    content: 'PCR实验操作指南：1. 配制反应体系时在冰上操作。2. 引物浓度通常为0.1-1μM。3. 模板DNA用量根据浓度调整。4. 设置阳性对照和阴性对照。5. 反应结束后产物及时电泳检测或冷冻保存。',
  },
  {
    keyword: '细胞培养',
    content: '细胞培养注意事项：1. 超净台使用前紫外照射30分钟。2. 细胞传代时控制消化时间。3. 培养箱定期消毒。4. 支原体定期检测。5. 记录细胞生长状态和传代次数。',
  },
]

const findRelevantKnowledge = (query: string): { title: string; snippet: string }[] => {
  const keywords = query.toLowerCase()
  const results: { title: string; snippet: string }[] = []
  
  knowledgeBase.forEach(item => {
    if (keywords.includes(item.keyword.toLowerCase()) || 
        item.keyword.toLowerCase().includes(keywords) ||
        item.content.toLowerCase().includes(keywords)) {
      results.push({
        title: item.keyword,
        snippet: item.content.substring(0, 150) + '...',
      })
    }
  })
  
  if (results.length === 0 && keywords.length > 2) {
    knowledgeBase.forEach(item => {
      const words = keywords.split(/\s+/)
      if (words.some(word => item.content.toLowerCase().includes(word))) {
        if (!results.find(r => r.title === item.keyword)) {
          results.push({
            title: item.keyword,
            snippet: item.content.substring(0, 150) + '...',
          })
        }
      }
    })
  }
  
  return results.slice(0, 3)
}

const generateAnswer = (question: string, sources: { title: string; snippet: string }[]): string => {
  if (sources.length === 0) {
    return `您好！我是科研小智。关于"${question}"这个问题，我目前知识库中没有找到完全匹配的内容。\n\n建议您：\n1. 尝试使用更具体的关键词\n2. 联系实验室管理员获取帮助\n3. 查阅相关标准操作规程(SOP)文档\n\n如果您有其他问题，欢迎继续提问！`
  }
  
  const sourceNames = sources.map(s => s.title).join('、')
  return `您好！我是科研小智。根据您的提问，我从知识库中找到了相关信息。\n\n**参考来源**：${sourceNames}\n\n`
}

export default function AIExperiment() {
  const { isDark } = useThemeStore()
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是科研小智，您的智能科研助手。\n\n我可以帮您解答以下问题：\n• 实验室安全规范\n• 仪器设备操作\n• 实验数据管理\n• 试剂耗材管理\n• 实验操作技巧\n• 科研流程咨询\n\n请输入您的问题，我会从知识库中为您查找答案。',
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    setTimeout(() => {
      const sources = findRelevantKnowledge(inputValue)
      const answer = generateAnswer(inputValue, sources)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer,
        timestamp: new Date(),
        sources,
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    '实验室安全规范有哪些？',
    'PCR实验操作流程',
    '如何管理危化品试剂？',
    '细胞培养注意事项',
    '仪器设备维护保养',
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <PageTitle>智能问答</PageTitle>

      <Card 
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginTop: 20, borderRadius: 10 }}
        bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, height: '100%' }}
      >
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {messages.map(msg => (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                marginBottom: 20,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              <Avatar 
                icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                style={{ 
                  backgroundColor: msg.role === 'user' ? '#177DDC' : '#52C41A',
                  marginLeft: msg.role === 'user' ? 12 : 0,
                  marginRight: msg.role === 'user' ? 0 : 12,
                  flexShrink: 0,
                }}
              />
              <div 
                style={{ 
                  maxWidth: '70%',
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: msg.role === 'user' 
                    ? (isDark ? '#177DDC' : '#177DDC')
                    : (isDark ? '#2A2A2A' : '#F5F5F5'),
                  color: msg.role === 'user' ? '#FFFFFF' : (isDark ? '#E0E0E0' : '#262626'),
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                }}
              >
                {msg.content}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${isDark ? '#404040' : '#E5E5E5'}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, fontSize: 12, opacity: 0.8 }}>
                      <BookOutlined style={{ marginRight: 4 }} />
                      知识库来源
                    </div>
                    {msg.sources.map((source, idx) => (
                      <div 
                        key={idx}
                        style={{ 
                          fontSize: 12, 
                          marginBottom: 6,
                          padding: 8,
                          backgroundColor: isDark ? '#1D1D1D' : '#FFFFFF',
                          borderRadius: 4,
                        }}
                      >
                        <Text strong style={{ fontSize: 12 }}>{source.title}</Text>
                        <div style={{ marginTop: 4, opacity: 0.7 }}>{source.snippet}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', marginBottom: 20, alignItems: 'center' }}>
              <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52C41A', marginRight: 12 }} />
              <div style={{ 
                padding: 12, 
                borderRadius: 12, 
                backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5',
              }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} spin />} />
                <span style={{ marginLeft: 8, color: isDark ? '#E0E0E0' : '#666' }}>
                  科研小智正在思考中...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ 
          padding: 16, 
          borderTop: `1px solid ${isDark ? '#373737' : '#E5E5E5'}`,
          backgroundColor: isDark ? '#1D1D1D' : '#FAFAFA',
        }}>
          <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <Text type="secondary" style={{ marginRight: 8 }}>快捷问题：</Text>
              {quickQuestions.map((q, idx) => (
                <Button 
                  key={idx} 
                  size="small" 
                  onClick={() => {
                    setInputValue(q)
                  }}
                >
                  {q}
                </Button>
              ))}
            </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <TextArea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入您的问题，科研小智将为您解答..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ flex: 1 }}
            />
            <Button 
              type="primary" 
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              loading={isLoading}
            >
              发送
            </Button>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C', textAlign: 'center' }}>
            <Space>
              <RobotOutlined />
              <span>科研小智 · 基于知识库的智能问答助手</span>
            </Space>
          </div>
        </div>
      </Card>
    </div>
  )
}