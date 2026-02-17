const API_BASE = 'https://raisora.onrender.com/api/users';

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to load profile');
  return data;
}

export async function updateProfile(token, payload) {
  const res = await fetch(`${API_BASE}/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
}
