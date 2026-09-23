import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [autoLogin, setAutoLogin] = useState(true)

  const handleLogin = () => {
    if (!username || !password || !captcha) return
    // 模拟登录 - 检查是否首次登录
    const isFirst = username === 'newuser'
    login(username, isFirst)
    if (isFirst) {
      navigate('/change-password', { state: { username } })
    } else {
      navigate('/')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #dce8fc 100%)',
    }}>
      <div style={{
        width: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        padding: '36px 40px',
      }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 4 }}>云南省肿瘤医院</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#262626' }}>实验室信息管理系统</div>
        </div>

        {/* 登录方式 */}
        <div style={{
          fontSize: 14,
          fontWeight: 500,
          color: '#177DDC',
          marginBottom: 20,
          paddingBottom: 8,
          borderBottom: '2px solid #177DDC',
          display: 'inline-block',
        }}>
          账号密码登录
        </div>

        {/* 用户名 */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              padding: '0 12px',
              fontSize: 14,
              border: '1px solid #D9D9D9',
              borderRadius: 6,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 密码 */}
        <div style={{ marginBottom: 16, position: 'relative' }}>
          <input
            type={showPwd ? 'text' : 'password'}
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              height: 40,
              padding: '0 36px 0 12px',
              fontSize: 14,
              border: '1px solid #D9D9D9',
              borderRadius: 6,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <span
            onClick={() => setShowPwd(!showPwd)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: 16,
              userSelect: 'none',
            }}
          >
            {showPwd ? '🙈' : '👁'}
          </span>
        </div>

        {/* 验证码 */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 10 }}>
          <input
            type="text"
            placeholder="请输入验证码"
            value={captcha}
            onChange={(e) => setCaptcha(e.target.value)}
            style={{
              flex: 1,
              height: 40,
              padding: '0 12px',
              fontSize: 14,
              border: '1px solid #D9D9D9',
              borderRadius: 6,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <div style={{
            width: 90,
            height: 40,
            backgroundColor: '#F0F5FF',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            fontWeight: 600,
            color: '#177DDC',
            letterSpacing: 4,
            cursor: 'pointer',
            userSelect: 'none',
          }}>
            n5pD
          </div>
        </div>

        {/* 自动登录 */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#595959' }}>
            <input
              type="checkbox"
              checked={autoLogin}
              onChange={(e) => setAutoLogin(e.target.checked)}
              style={{ accentColor: '#177DDC' }}
            />
            自动登录
          </label>
        </div>

        {/* 确定按钮 */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            height: 40,
            fontSize: 15,
            fontWeight: 500,
            color: '#FFFFFF',
            backgroundColor: '#177DDC',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          确 定
        </button>

        {/* 底部链接 */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span
            onClick={() => navigate('/register')}
            style={{ fontSize: 13, color: '#177DDC', cursor: 'pointer' }}
          >
            没有账号？前往注册
          </span>
        </div>
      </div>
    </div>
  )
}