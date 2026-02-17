const API_BASE = 'https://raisora.onrender.com/api/events';

export async function listEvents() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch events');
  return res.json();
}

export async function getEvent(id) {
  const res = await fetch(`${API_BASE}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch event');
  return data;
}

export async function registerEvent(id, token) {
  const res = await fetch(`${API_BASE}/${id}/register`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to register');
  return data;
}

export async function unregisterEvent(id, token) {
  const res = await fetch(`${API_BASE}/${id}/unregister`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to unregister');
  return data;
}

export async function createEvent(payload, token) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create failed');
  return data;
}

export async function updateEvent(id, payload, token) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
}

export async function deleteEvent(id, token) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete failed');
  return data;
}
