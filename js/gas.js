import { GAS_URL, SHEET_NAME, HEADERS } from './config.js';

async function gasCall(op, payload = {}) {
  try {
    const res = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ op, sheetName: SHEET_NAME, headers: HEADERS, ...payload })
    });
    const txt = await res.text();
    try { return JSON.parse(txt); } catch { return { ok:true, raw:txt }; }
  } catch (err) {
    console.error('[gasCall] error:', err);
    return { ok:false, error:String(err) };
  }
}

export async function initSheet(){
  const r = await gasCall('init');
  if(!r.ok) console.warn('[initSheet] gagal:', r.error || r);
  else console.log('[initSheet] OK');
}

export async function syncToSheet(data, mode){
  const op = mode === 'update' ? 'update' : 'save';
  const r = await gasCall(op, { data });
  if(!r.ok) console.warn('[syncToSheet] gagal:', r.error || r);
  return r.ok;
}

export async function deleteInSheet(id){
  const r = await gasCall('delete', { id });
  if(!r.ok) console.warn('[deleteInSheet] gagal:', r.error || r);
  return r.ok;
}
