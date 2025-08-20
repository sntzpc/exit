import { applyReportVisibility, bindSettingsUI } from './ui.js';
import { bindForm } from './form.js';
import { bindReport } from './report.js';
import { updateStorageInfo } from './storage.js';
import { initSheet } from './gas.js';
import { $, $$ } from './utils.js';

window.addEventListener('DOMContentLoaded', async ()=>{
  // State awal
  applyReportVisibility();
  updateStorageInfo();
  document.addEventListener('update-storage-info', updateStorageInfo);

  // GAS: pastikan sheet + header siap
  await initSheet();

  // Bind UI
  bindSettingsUI();
  bindForm();
  bindReport();

  // Tab nav link (navbar kanan)
  $('#form-tab-link')?.addEventListener('click', (e)=>{ e.preventDefault(); bootstrap.Tab.getOrCreateInstance($('#form-tab')).show(); });
  $('#report-tab-link')?.addEventListener('click', (e)=>{ e.preventDefault(); bootstrap.Tab.getOrCreateInstance($('#report-tab')).show(); });

  // Saat buka tab Report, refresh tabel
  $('#report-tab')?.addEventListener('shown.bs.tab', ()=> document.dispatchEvent(new CustomEvent('refresh-table')));
});
