import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function ChangePasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const username = (location.state as { username?: string })?.username || ''
  const setFirstLoginDone = useAuthStore((s) => s.setFirstLoginDone)

  const [oldPwd, setOldPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  const lengthValid = newPwd.length >= 8 && newPwd.length <= 20
  const matchValid = newPwd !== '' && newPwd === confirmPwd
  const canSubmit = oldPwd && lengthValid && matchValid

  const handleSubmit = () => {
    if (!canSubmit) return
    setFirstLoginDone()
    navigate('/')
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
          <div style={{ fontSize: 20, fontWeight: 600, color: '#262626' }}>首次登录 · 修改密码</div>
        </div>

        {/* 用户名 */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="用户名"
            value={username}
            readOnly
            style={{
              width: '100%', height: 40, padding: '0 12px', fontSize: 14,
              border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none',
              backgroundColor: '#F5F5F5', color: '#8C8C8C', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 原密码 */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="请输入原密码"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
            style={{
              width: '100%', height: 40, padding: '0 12px', fontSize: 14,
              border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 新密码 */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="请输入新密码（8-20位）"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
            style={{
              width: '100%', height: 40, padding: '0 12px', fontSize: 14,
              border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 确认密码 */}
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="请再次输入新密码"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            style={{
              width: '100%', height: 40, padding: '0 12px', fontSize: 14,
              border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* 密码规则 */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, fontSize: 13 }}>
          <div style={{ color: lengthValid ? '#49AA19' : '#8C8C8C' }}>
            {lengthValid ? '✓' : '○'} 密码长度8-20位
          </div>
          <div style={{ color: matchValid ? '#49AA19' : '#8C8C8C' }}>
            {matchValid ? '✓' : '○'} 两次输入一致
          </div>
        </div>

        {/* 确认修改 */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%', height: 40, fontSize: 15, fontWeight: 500,
            borderRadius: 6, border: 'none',
            backgroundColor: canSubmit ? '#177DDC' : '#D9D9D9',
            color: canSubmit ? '#FFFFFF' : '#B2B2B2',
            cursor: canSubmit ? 'pointer' : 'not-allowed',
          }}
        >
          确认修改
        </button>
      </div>
    </div>
  )
}