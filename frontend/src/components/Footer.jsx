import React from 'react';

export default function Footer() {
  return (
    <footer style={{ padding: '16px 12px', borderTop: '1px solid #e2e8f0', textAlign: 'center', marginTop: 40, background: '#f8fafc', fontSize: '14px', color: '#475569' }}>
      <div style={{ fontWeight: '500', marginBottom: 4 }}>
        Mukhyamantri Shram Shakti Yojna (मुख्यमंत्री श्रम शक्ति योजना)
      </div>
      <div style={{ marginBottom: 4 }}>
        Training Application Portal – Government of Bihar
      </div>
      <small>
        &copy; {new Date().getFullYear()} Department of Labour Resources, Bihar. All Rights Reserved.
      </small>
    </footer>
  );
}
