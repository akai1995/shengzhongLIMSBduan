import { Card, Row, Col, Tag, Button } from 'antd';
import { 
  RocketOutlined, BookOutlined, ExperimentOutlined, CalendarOutlined, 
  DropboxOutlined, AlertOutlined, FileTextOutlined, DatabaseOutlined, 
  ToolOutlined, TrophyOutlined, AimOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { isDark } = useThemeStore();
  const navigate = useNavigate();
  const [achievementPeriod, setAchievementPeriod] = useState<'month' | 'lastMonth'>('month');

  const stats = [
    { 
      title: '在研项目', value: '128', trend: '+15%', trendIcon: '↑',
      icon: <RocketOutlined />, color: '#177DDC',
      desc: '同比增长15%'
    },
    { 
      title: '紫外线消毒统计', 
      onlineCount: 12, duration: '8.5',
      icon: (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      ), 
      color: '#49AA19',
      desc: `在线${12}台 | 今日消毒${8.5}h`
    },
    { 
      title: '待学习', value: '5', unit: '门课程',
      icon: <BookOutlined />, color: '#D89614',
      desc: '3门必修 | 2门选修'
    },
    { 
      title: '实验记录', value: '86', unit: '条',
      icon: <ExperimentOutlined />, color: '#8B5CF6',
      desc: '本周新增12条'
    },
  ];

  const quickEntries = [
    { label: '项目管理', icon: <RocketOutlined />, color: '#177DDC', path: '/research/project-initiation' },
    { label: '设备管理', icon: <ToolOutlined />, color: '#49AA19', path: '/lab/equipment/archive' },
    { label: '试剂管理', icon: <DropboxOutlined />, color: '#F97316', path: '/lab/reagent/stock' },
    { label: '实验记录', icon: <FileTextOutlined />, color: '#177DDC', path: '/lab/eln/record' },
    { label: '紫外线灯管理', icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    ), color: '#F53F3F', path: '/lab/uv-lamp' },
    { label: '在线学习', icon: <BookOutlined />, color: '#8B5CF6', path: '/learning/online' },
    { label: '科技大屏', icon: (
      <svg width="1em" height="1em" viewBox="0 0 1077 1024" fill="currentColor">
        <path d="M680.96 923.755789c13.473684 0 20.210526 6.736842 20.210526 20.210527v40.798316c0 13.473684-6.736842 20.210526-20.210526 20.210526H385.994105c-13.473684 0-20.210526-6.736842-20.210526-20.210526v-40.798316c0-13.473684 6.736842-20.210526 20.210526-20.210527h294.965895zM970.536421 16.168421a91.459368 91.459368 0 0 1 90.758737 91.459368V762.071579a91.513263 91.513263 0 0 1-91.082105 90.812632H106.927158A91.513263 91.513263 0 0 1 16.168421 761.748211V107.897263A91.082105 91.082105 0 0 1 107.250526 16.168421z m-0.323368 75.452632H107.250526a15.629474 15.629474 0 0 0-15.629473 16.006736V761.532632a15.952842 15.952842 0 0 0 15.629473 15.898947h862.693053a15.952842 15.952842 0 0 0 15.898947-15.629474V107.627789a15.952842 15.952842 0 0 0-15.629473-16.006736z m-510.922106 231.585684a21.557895 21.557895 0 0 1 30.450527 1.616842L604.16 451.098947a10.778947 10.778947 0 0 0 14.336 1.509053l120.832-87.471158a38.265263 38.265263 0 0 1 44.840421 61.817263L614.4 550.265263a21.557895 21.557895 0 0 1-28.833684-3.125895L476.429474 424.043789a10.778947 10.778947 0 0 0-14.874948-1.239578L318.733474 538.516211a38.211368 38.211368 0 1 1-48.074106-59.338106l151.713685-122.664421z"/>
      </svg>
    ), color: '#177DDC', path: '/data/dashboard' },
    { label: '设备预约', icon: <CalendarOutlined />, color: '#49AA19', path: '/lab/equipment/reservation' },
    { label: '来访申请', icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ), color: '#D89614', path: '/visit/application' },
  ];

  const riskAlerts = [
    { id: 1, type: 'equipment', title: '设备维护预警', description: '3台设备即将到期维护，请及时处理', icon: <ToolOutlined />, color: '#F97316' },
    { id: 2, type: 'reagent', title: '试剂库存不足', description: '5种常用试剂库存低于警戒线', icon: <DropboxOutlined />, color: '#F53F3F' },
    { id: 3, type: 'safety', title: '安全检查提醒', description: '实验室安全检查即将到期，请提前准备', icon: <AlertOutlined />, color: '#D89614' },
    { id: 4, type: 'budget', title: '经费超支预警', description: '2个项目经费执行率超过90%', icon: <AimOutlined />, color: '#F53F3F' },
  ];

  const reservations = [
    { id: 1, device: '高效液相色谱仪', time: '2025-01-02 09:00-12:00', status: '待使用' },
    { id: 2, device: '质谱仪', time: '2025-01-02 14:00-17:00', status: '待使用' },
    { id: 3, device: 'PCR仪', time: '2025-01-03 09:00-11:00', status: '已预约' },
    { id: 4, device: '流式细胞仪', time: '2025-01-03 14:00-16:00', status: '已预约' },
  ];

  const achievementRanking = [
    { id: 1, lab: '分子生物学实验室', papers: 15, patents: 8, score: 95 },
    { id: 2, lab: '化学分析实验室', papers: 12, patents: 5, score: 78 },
    { id: 3, lab: '基因测序实验室', papers: 18, patents: 6, score: 92 },
    { id: 4, lab: '细胞培养实验室', papers: 8, patents: 4, score: 65 },
    { id: 5, lab: '药物研发实验室', papers: 10, patents: 7, score: 72 },
  ];

  const renderDescription = (text: string, color: string) => {
    const parts = text.split(/(\d+\.?\d*%?)/g);
    return parts.map((part, i) => {
      if (/^\d+\.?\d*%?$/.test(part)) {
        return <span key={i} style={{ fontWeight: 600, color }}>{part}</span>;
      }
      return part;
    });
  };

  return (
    <div style={{ padding: 0, width: '100%', minHeight: '100%' }}>

      {/* 统计卡片 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <div 
              style={{ 
                backgroundColor: isDark ? '#141414' : '#FFFFFF',
                borderRadius: 10, 
                padding: 20, 
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                transition: 'all 0.3s ease', 
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#177DDC';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(23, 125, 220, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#2C2C2C' : '#E5E5E5';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 400, color: isDark ? '#ADADAD' : '#595959' }}>{stat.title}</div>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 10, 
                  backgroundColor: `${stat.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, marginLeft: 12
                }}>
                  <span style={{ fontSize: 20, color: stat.color }}>{stat.icon}</span>
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 600, color: stat.color, marginBottom: 8 }}>
                {stat.value}
                {stat.unit && <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4, color: isDark ? '#ADADAD' : '#595959' }}>{stat.unit}</span>}
                {stat.trend && (
                  <span style={{ fontSize: 14, fontWeight: 500, color: stat.trendColor || '#49AA19', marginLeft: 8 }}>
                    {stat.trendIcon} {stat.trend}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 13, color: isDark ? '#7E7E7E' : '#8C8C8C', lineHeight: 1.6 }}>
                {renderDescription(stat.desc, stat.color)}
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* 第一行：快捷入口 + 风险预警 */}
      <Row gutter={[20, 20]} style={{ marginBottom: 20, alignItems: 'stretch' }}>
        {/* 快捷入口 */}
        <Col xs={24} lg={12}>
          <div style={{
            position: 'relative',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #1a6fb5 0%, #2196F3 30%, #42A5F5 60%, #64B5F6 100%)',
            padding: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            {/* 背景装饰元素 */}
            <div style={{ position: 'absolute', right: -20, top: -30, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 60, top: 40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 40, top: 50, width: 160, height: 100, borderRadius: 8, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', transform: 'rotate(-6deg)', pointerEvents: 'none' }}>
              <div style={{ padding: '12px 16px' }}>
                <div style={{ width: '60%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.2)', marginBottom: 8 }} />
                <div style={{ width: '40%', height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
                  <div style={{ width: 24, height: 24, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', right: 180, top: 80, width: 12, height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.15)', transform: 'rotate(15deg)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 140, top: 120, width: 8, height: 8, borderRadius: 2, background: 'rgba(255,255,255,0.1)', transform: 'rotate(-10deg)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, marginBottom: 16 }}>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>快捷入口</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>常用功能一键直达，高效便捷，助力科研管理</div>
            </div>

            {/* 快捷功能卡片 - 一行三个，撑满剩余高度 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1, flex: 1, alignContent: 'stretch' }}>
                {quickEntries.map((entry, index) => (
                  <div
                    key={index}
                    onClick={() => navigate(entry.path)}
                    style={{
                      width: 'calc((100% - 2 * 16px) / 3)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px 8px', borderRadius: 10,
                      backgroundColor: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      backgroundColor: entry.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <span style={{ fontSize: 22, color: '#FFFFFF' }}>{entry.icon}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#FFFFFF' }}>{entry.label}</span>
                  </div>
                ))}
              </div>
          </div>
        </Col>

        {/* 风险预警 */}
        <Col xs={24} lg={12}>
          <Card 
            style={{ 
              borderRadius: 10, 
              border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`, 
              backgroundColor: isDark ? '#141414' : '#FFFFFF',
              height: '100%'
            }} 
            styles={{ body: { padding: 20 } }} 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AlertOutlined style={{ color: '#F97316', fontSize: 18 }} />
                <span style={{ fontWeight: 600, fontSize: 16, color: isDark ? '#DCDCDC' : '#262626' }}>风险预警</span>
                <span style={{ fontSize: 12, color: '#F97316', backgroundColor: isDark ? 'rgba(249, 115, 22, 0.15)' : '#FFF7ED', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
                  {riskAlerts.length}条
                </span>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {riskAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  style={{ 
                    padding: 14, borderRadius: 10, 
                    backgroundColor: isDark ? '#1F1F1F' : '#FAFAFA', 
                    border: `1px solid ${isDark ? '#2C2C2C' : '#E8E8E8'}`,
                    transition: 'all 0.3s ease', cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.backgroundColor = isDark ? '#262626' : '#F0F0F0'; 
                    e.currentTarget.style.borderColor = alert.color;
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = isDark ? '#1F1F1F' : '#FAFAFA'; 
                    e.currentTarget.style.borderColor = isDark ? '#2C2C2C' : '#E8E8E8';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${alert.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 16, color: alert.color }}>{alert.icon}</span>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#DCDCDC' : '#262626' }}>{alert.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: isDark ? '#ADADAD' : '#8C8C8C', margin: 0, lineHeight: 1.5, paddingLeft: 42 }}>{alert.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* 第二行：我的预约 + 成果产出排行榜 */}
      <Row gutter={[20, 20]} style={{ alignItems: 'stretch' }}>
        {/* 我的预约 */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: 10,
              border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
              backgroundColor: isDark ? '#141414' : '#FFFFFF',
              height: '100%'
            }} 
            styles={{ body: { padding: 20 } }} 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CalendarOutlined style={{ color: '#177DDC', fontSize: 18 }} />
                  <span style={{ fontWeight: 600, fontSize: 16, color: isDark ? '#DCDCDC' : '#262626' }}>我的预约</span>
                </div>
                <Button 
                  type="text" 
                  onClick={() => navigate('/lab/equipment/reservation')}
                  style={{ padding: 0, color: '#177DDC', fontWeight: 500 }}
                >
                  查看全部 →
                </Button>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {reservations.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: '16px 0', 
                    borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#F0F0F0'}`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'background-color 0.2s' 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = isDark ? '#26262640' : '#F7F7F7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? '#DCDCDC' : '#262626' }}>{item.device}</div>
                    <div style={{ fontSize: 13, color: isDark ? '#ADADAD' : '#8C8C8C', marginTop: 4 }}>{item.time}</div>
                  </div>
                  <Tag color={item.status === '待使用' ? 'blue' : 'green'}>{item.status}</Tag>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 成果产出排行榜 */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              borderRadius: 10,
              border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
              backgroundColor: isDark ? '#141414' : '#FFFFFF',
              height: '100%'
            }} 
            styles={{ body: { padding: 20 } }} 
            title={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <TrophyOutlined style={{ color: '#D89614', fontSize: 18 }} />
                  <span style={{ fontWeight: 600, fontSize: 16, color: isDark ? '#DCDCDC' : '#262626' }}>成果产出排行榜</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Button 
                    type={achievementPeriod === 'month' ? 'primary' : 'text'} 
                    size="small" 
                    onClick={() => setAchievementPeriod('month')}
                    style={{ borderRadius: 20, padding: '4px 16px', fontWeight: 400, backgroundColor: achievementPeriod === 'month' ? '#177DDC' : 'transparent' }}
                  >
                    本月
                  </Button>
                  <Button 
                    type={achievementPeriod === 'lastMonth' ? 'primary' : 'text'} 
                    size="small" 
                    onClick={() => setAchievementPeriod('lastMonth')}
                    style={{ borderRadius: 20, padding: '4px 16px', fontWeight: 400, backgroundColor: achievementPeriod === 'lastMonth' ? '#177DDC' : 'transparent' }}
                  >
                    上月
                  </Button>
                </div>
              </div>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {achievementRanking.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ 
                    width: 30, height: 30, borderRadius: 8, 
                    backgroundColor: index < 3 ? '#177DDC' : isDark ? '#2C2C2C' : '#E5E5E5', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 600, fontSize: 13,
                    color: index < 3 ? '#FFFFFF' : isDark ? '#ADADAD' : '#8C8C8C'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? '#DCDCDC' : '#262626', marginBottom: 4 }}>{item.lab}</div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: isDark ? '#ADADAD' : '#8C8C8C' }}>
                      <span>论文 {item.papers}</span>
                      <span>专利 {item.patents}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <style>{`
        .ant-table-thead > tr > th {
          background-color: ${isDark ? '#141414' : '#F5F5F5'} !important;
          color: ${isDark ? '#DCDCDC' : '#595959'} !important;
          font-weight: 600 !important;
          border-bottom: 1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'} !important;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'} !important;
        }
      `}</style>
    </div>
  );
}