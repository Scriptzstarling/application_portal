export function getToken() {
  return localStorage.getItem('token') || '';
}

export function setToken(token) {
  if (token) localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export function api(path, options = {}) {
  return fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include',
    ...options,
  }).then(async r => {
    const data = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(data.error || 'Request failed')
    return data
  })
}


