import { useNavigate } from 'react-router-dom'

interface Props {
  visible: boolean
}

export default function ConsentModal({ visible }: Props) {
  const navigate = useNavigate()

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        width: 480,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
        {/* 头部 */}
        <div style={{
          padding: '24px 28px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
            系统使用知情同意书
          </div>
        </div>

        {/* 内容 */}
        <div style={{ padding: '16px 28px' }}>
          <div style={{
            fontSize: 13,
            color: '#595959',
            lineHeight: 1.8,
            padding: '14px 16px',
            backgroundColor: '#F7F8FA',
            borderRadius: 8,
            border: '1px solid #EBEDF0',
          }}>
            <p style={{ margin: 0, marginBottom: 8 }}>
              欢迎使用云南省肿瘤医院实验室信息管理系统。本系统涉及患者隐私数据与科研信息，使用前请确认您已签署知情同意书。
            </p>
            <p style={{ margin: 0 }}>
              本系统仅限授权人员使用，所有操作将被记录并审计。请妥善保管您的账号密码，不得转借他人。
            </p>
          </div>
        </div>

        {/* 底部按钮 */}
        <div style={{
          padding: '16px 28px 24px',
          display: 'flex',
          gap: 12,
          justifyContent: 'flex-end',
          borderTop: '1px solid #F0F0F0',
        }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '8px 24px',
              fontSize: 14,
              borderRadius: 6,
              border: '1px solid #D9D9D9',
              backgroundColor: '#FFFFFF',
              color: '#595959',
              cursor: 'pointer',
            }}
          >
            未签，前往注册
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 24px',
              fontSize: 14,
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#177DDC',
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            已签，前往登录
          </button>
        </div>
      </div>
    </div>
  )
}