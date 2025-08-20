import { ADMIN_PASSWORD, LS_KEY_SHOW_REPORT, SS_KEY_ADMIN_OK } from './config.js';
import { $, $$ } from './utils.js';

export function isAdminUnlocked(){ return sessionStorage.getItem(SS_KEY_ADMIN_OK) === '1'; }
export function setAdminUnlocked(v){ v ? sessionStorage.setItem(SS_KEY_ADMIN_OK,'1') : sessionStorage.removeItem(SS_KEY_ADMIN_OK); }

export function getShowReportPref(){ return localStorage.getItem(LS_KEY_SHOW_REPORT) === '1'; } // default: sembunyi
export function setShowReportPref(show){ localStorage.setItem(LS_KEY_SHOW_REPORT, show ? '1' : '0'); }

export function applyReportVisibility(){
  const show = getShowReportPref();
  const navItem = $('#report-tab-link')?.closest('li');
  const tabItem = $('#report-tab')?.closest('li');
  const tabPane = $('#report');

  if(!navItem || !tabItem || !tabPane) return;

  if(show){
    navItem.classList.remove('d-none'); navItem.style.display='';
    tabItem.classList.remove('d-none'); tabItem.style.display='';
  } else {
    const reportActive = tabPane.classList.contains('active') || $('#report-tab')?.classList.contains('active') || $('#report-tab-link')?.classList.contains('active');
    if(reportActive){
      const formTabEl = $('#form-tab');
      if(formTabEl) bootstrap.Tab.getOrCreateInstance(formTabEl).show();
    }
    navItem.classList.add('d-none'); navItem.style.display='none';
    tabItem.classList.add('d-none'); tabItem.style.display='none';
    tabPane.classList.remove('show','active');
  }
}

export function bindSettingsUI(){
  // FAB open modal
  $('#btnFabSettings')?.addEventListener('click', ()=>{
    $('#adminPwdError').classList.add('d-none');
    $('#adminPassword').value = '';
    const icon = $('#togglePwd i'); if(icon){ icon.classList.remove('bi-eye-slash'); icon.classList.add('bi-eye'); }

    if(isAdminUnlocked()){
      $('#adminLoginSection').classList.add('d-none');
      $('#settingsSection').classList.remove('d-none');
      $('#btnAdminUnlock').classList.add('d-none');
      $('#btnSettingsSave').classList.remove('d-none');
      $('#switchShowReport').checked = getShowReportPref();
    } else {
      $('#adminLoginSection').classList.remove('d-none');
      $('#settingsSection').classList.add('d-none');
      $('#btnAdminUnlock').classList.remove('d-none');
      $('#btnSettingsSave').classList.add('d-none');
    }
    bootstrap.Modal.getOrCreateInstance($('#adminSettingsModal')).show();
  });

  // Toggle password
  $('#togglePwd')?.addEventListener('click', ()=>{
    const inp = $('#adminPassword');
    const isPwd = inp.type === 'password';
    inp.type = isPwd ? 'text' : 'password';
    $('#togglePwd i')?.classList.toggle('bi-eye');
    $('#togglePwd i')?.classList.toggle('bi-eye-slash');
  });

  // Masuk (admin)
  $('#btnAdminUnlock')?.addEventListener('click', ()=>{
    const pwd = $('#adminPassword').value.trim();
    if(pwd === ADMIN_PASSWORD){
      setAdminUnlocked(true);
      $('#adminPwdError').classList.add('d-none');
      $('#adminLoginSection').classList.add('d-none');
      $('#settingsSection').classList.remove('d-none');
      $('#btnAdminUnlock').classList.add('d-none');
      $('#btnSettingsSave').classList.remove('d-none');
      $('#switchShowReport').checked = getShowReportPref();
    } else {
      $('#adminPwdError').classList.remove('d-none');
    }
  });

  // Simpan Pengaturan
  $('#btnSettingsSave')?.addEventListener('click', ()=>{
    const show = $('#switchShowReport').checked;
    setShowReportPref(show);
    applyReportVisibility();
    bootstrap.Modal.getInstance($('#adminSettingsModal'))?.hide();
    setTimeout(()=>alert('Pengaturan disimpan.'), 50);
  });

  // Navbar click -> tab show
  $('#form-tab-link')?.addEventListener('click', (e)=>{ e.preventDefault(); bootstrap.Tab.getOrCreateInstance($('#form-tab')).show(); });
  $('#report-tab-link')?.addEventListener('click', (e)=>{ e.preventDefault(); bootstrap.Tab.getOrCreateInstance($('#report-tab')).show(); });
}
