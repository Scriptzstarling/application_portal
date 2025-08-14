import React from 'react'

export default function Footer() {
  return (
    <footer style={{ padding: 12, borderTop: '1px solid #eee', textAlign:'center', marginTop: 40, background:'#f8fafc' }}>
      <small>&copy; {new Date().getFullYear()} OTP App Portal</small>
    </footer>
  )
}


