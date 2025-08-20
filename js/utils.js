// Utilitas ringan
export const $ = (sel, root=document) => root.querySelector(sel);
export const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

export function formatDate(d){
  if(!d) return '';
  const dt = new Date(d);
  return dt.toLocaleDateString('id-ID');
}
export function formatDateTime(d){
  if(!d) return '';
  const dt = new Date(d);
  return dt.toLocaleString('id-ID');
}

export function showAlert(msg){ window.alert(msg); }
