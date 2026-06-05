import React, { useState, useMemo, Children } from 'react'
import { Card, Form, Button, Row, Col, ConfigProvider } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'

interface SearchFormProps {
  children: React.ReactNode
  onSearch?: () => void
  onReset?: () => void
  expandedFields?: React.ReactNode
  defaultExpanded?: boolean
  form?: any
  showExpandButton?: boolean
}

export default function SearchForm({ 
  children, 
  onSearch, 
  onReset, 
  expandedFields,
  defaultExpanded = false,
  form,
  showExpandButton = true
}: SearchFormProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const { isDark } = useThemeStore()
  
  const hasExpandedFields = useMemo(() => {
    return expandedFields !== undefined && expandedFields !== null
  }, [expandedFields])

  const childArray = useMemo(() => {
    return Children.toArray(children).filter(child => React.isValidElement(child))
  }, [children])

  const hasMoreThanThreeFields = childArray.length > 3

  // 根据主题模式设置颜色
  const colors = {
    backgroundColor: isDark ? '#141414' : '#FFFFFF',      // 模块/卡片色
    borderColor: isDark ? '#373737' : '#D9D9D9',          // 元素边框、区块边框
    labelColor: isDark ? '#DCDCDC' : '#262626',           // 文本颜色-主要色
    inputBg: isDark ? '#141414' : '#FFFFFF',             // 模块/卡片色
    inputBorder: isDark ? '#373737' : '#D9D9D9'          // 输入框描边色
  }

  const renderButtons = () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
      <Button type="primary" onClick={onSearch}>查 询</Button>
      <Button onClick={onReset}>重 置</Button>
      {showExpandButton && hasMoreThanThreeFields && (
        <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
          {expanded ? '收起' : '展开'}
          {expanded ? <UpOutlined /> : <DownOutlined />}
        </Button>
      )}
    </div>
  )

  const displayChildren = useMemo(() => {
    if (expanded) {
      return childArray
    }
    if (hasMoreThanThreeFields) {
      return childArray.slice(0, 3)
    }
    return childArray
  }, [expanded, childArray, hasMoreThanThreeFields])

  return (
    <Card 
      style={{ 
        marginBottom: 0, 
        borderRadius: 10, 
        backgroundColor: colors.backgroundColor, 
        border: `1px solid ${colors.borderColor}` 
      }} 
      bodyStyle={{ padding: 20, overflow: 'visible' }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: colors.inputBg,
            colorBorder: colors.inputBorder,
            colorBorderSecondary: colors.inputBorder,
            colorText: colors.labelColor,
            colorTextPlaceholder: isDark ? '#7E7E7E' : '#8C8C8C'
          }
        }}
        locale={{
          locale: 'zh_CN',
          DatePicker: {
            lang: {
              locale: 'zh_CN',
              placeholder: '请选择日期',
              rangePlaceholder: ['开始日期', '结束日期'],
              today: '今天',
              now: '现在',
              week: '周',
              time: '时间',
              confirm: '确定',
              cancel: '取消'
            },
            dateFormat: 'YYYY-MM-DD',
            dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
            monthFormat: 'YYYY-MM',
            previousMonth: '上个月',
            nextMonth: '下个月',
            previousYear: '上一年',
            nextYear: '下一年'
          }
        }}
      >
        <Form 
          form={form}
          layout="horizontal" 
          labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none', color: colors.labelColor } }} 
          wrapperCol={{ style: { flex: 1 } }}
        >
          <Row gutter={16} style={{ height: 32, display: 'flex', alignItems: 'center' }}>
            {displayChildren}
            {!expanded && (
              <Col span={6}>
                <Form.Item style={{ marginBottom: 0 }}>
                  {renderButtons()}
                </Form.Item>
              </Col>
            )}
          </Row>
          
          {expanded && hasMoreThanThreeFields && (
            <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
              <Col span={24}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Form.Item style={{ marginBottom: 0 }}>
                    {renderButtons()}
                  </Form.Item>
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </ConfigProvider>
    </Card>
  )
}