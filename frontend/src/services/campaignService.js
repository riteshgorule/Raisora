const API_BASE = 'http://localhost:7001/api/campaigns';

export async function listCampaigns() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch campaigns');
  return res.json();
}

export async function joinCampaign(id, token) {
  const res = await fetch(`${API_BASE}/${id}/join`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to join');
  return data;
}

export async function createCampaign(payload, token) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Create failed');
  return data;
}

export async function updateCampaign(id, payload, token) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
}

export async function deleteCampaign(id, token) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Delete failed');
  return data;
}

export async function leaveCampaign(id, token) {
  const res = await fetch(`${API_BASE}/${id}/leave`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Leave failed');
  return data;
}
