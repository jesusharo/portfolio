const BASE = '/api';

function getToken() {
  return localStorage.getItem('editor_token') || '';
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

// Auth
export async function login(passcode: string) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  localStorage.setItem('editor_token', data.token);
  return data;
}

export async function verifyToken() {
  const res = await fetch(`${BASE}/auth/verify`, { headers: authHeaders() });
  return res.ok;
}

export function logout() {
  localStorage.removeItem('editor_token');
}

// Projects (public)
export async function getProjects(type?: string) {
  const url = type ? `${BASE}/projects?type=${type}` : `${BASE}/projects`;
  const res = await fetch(url);
  return res.json();
}

export async function getProject(id: string) {
  const res = await fetch(`${BASE}/projects/${id}`);
  if (!res.ok) return null;
  return res.json();
}

// Projects (editor)
export async function getEditorProjects(type?: string): Promise<unknown[]> {
  const url = type ? `${BASE}/projects/editor/all?type=${type}` : `${BASE}/projects/editor/all`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Editor fetch failed: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function createProject(type: string, name: string) {
  const res = await fetch(`${BASE}/projects/editor`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ type, name }),
  });
  if (!res.ok) throw new Error('Create failed');
  return res.json();
}

export async function updateProject(id: string, fields: Record<string, unknown>) {
  const res = await fetch(`${BASE}/projects/editor/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(fields),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

export async function deleteProject(id: string) {
  await fetch(`${BASE}/projects/editor/${id}`, { method: 'DELETE', headers: authHeaders() });
}

export async function reorderProjects(ids: string[]) {
  await fetch(`${BASE}/projects/editor/reorder`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ids }),
  });
}

// About
export async function getAbout() {
  const res = await fetch(`${BASE}/about`);
  return res.json();
}

export async function updateAbout(content_html: string) {
  const res = await fetch(`${BASE}/about`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ content_html }),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

// Resume
export async function updateResume(resume_content: string) {
  const res = await fetch(`${BASE}/about/resume`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ resume_content }),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

// Images (editor)
export async function uploadImage(file: File): Promise<{ id: string; url: string }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/images/editor/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}
