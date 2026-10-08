import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizePreviewUrl, sanitizeContentBlocks } from './sanitize.mjs';

test('website previews retain a canonical HTTPS URL with its path and query', () => {
  assert.equal(
    sanitizePreviewUrl(' https://Example.com/work?view=mobile#details '),
    'https://example.com/work?view=mobile#details',
  );
});

test('website previews reject executable URLs, credentials, and local targets', () => {
  const rejected = [
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'blob:https://example.com/id',
    'file:///etc/passwd',
    'http://example.com',
    '//example.com',
    'https://user:password@example.com',
    'https://localhost',
    'https://localhost.',
    'https://intranet',
    'https://demo.local',
    'https://127.0.0.1',
    'https://127.0.0.1.',
    'https://0x7f000001',
    'https://2130706433',
    'https://10.0.0.1',
    'https://192.168.1.1',
    'https://172.16.0.1',
    'https://169.254.169.254',
    'https://100.64.0.1',
    'https://[::1]',
    '<iframe src="https://example.com"></iframe>',
    'https://example.com/' + 'a'.repeat(2048),
    null,
    {},
  ];
  for (const value of rejected) {
    assert.equal(sanitizePreviewUrl(value), '', `Rejected URL: ${String(value)}`);
  }
});

test('stored website blocks cannot supply iframe attributes or HTML', () => {
  const [block] = sanitizeContentBlocks([{
    id: 'website-1',
    type: 'sitepreview',
    url: 'https://example.com',
    srcdoc: '<script>parent.document.body.remove()</script>',
    sandbox: 'allow-same-origin allow-scripts',
    allow: 'camera *',
    onload: 'alert(1)',
    html: '<iframe></iframe>',
  }]);
  assert.deepEqual(block, {
    id: 'website-1',
    type: 'sitepreview',
    url: 'https://example.com/',
  });
});

test('empty website blocks remain safe and do not affect existing content', () => {
  const blocks = [
    { id: 'text', type: 'richtext', html: '<p>English</p>', html_es: '<p>Español</p>' },
    { id: 'website', type: 'sitepreview', url: '' },
  ];
  assert.deepEqual(sanitizeContentBlocks(blocks), blocks);
});
