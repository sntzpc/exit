// ====== CONFIG ======
const ADMIN_PASSWORD = 'useradmin123';
const LS_KEY_SHOW_REPORT = 'showReportTab';         // '1' = tampil, '0' = sembunyi
const SS_KEY_ADMIN_OK   = 'isAdminUnlocked';        // sessionStorage flag

// ====== UTIL ======
function isAdminUnlocked(){
  return sessionStorage.getItem(SS_KEY_ADMIN_OK) === '1';
}
function setAdminUnlocked(v){
  if(v) sessionStorage.setItem(SS_KEY_ADMIN_OK, '1');
  else sessionStorage.removeItem(SS_KEY_ADMIN_OK);
}

function getShowReportPref(){
  // default: tampil kecuali diset '0'
  return localStorage.getItem(LS_KEY_SHOW_REPORT) !== '0';
}
function setShowReportPref(show){
  localStorage.setItem(LS_KEY_SHOW_REPORT, show ? '1' : '0');
}

function applyReportVisibility(){
  const show = getShowReportPref();

  // Navbar link (kanan atas)
  const $navItem = $('#report-tab-link').closest('li');
  // Tombol tab (yang row tab)
  const $tabItem = $('#report-tab').closest('li');
  // Konten tab
  const $tabPane = $('#report');

  if(show){
    $navItem.show();
    $tabItem.show();
  } else {
    // jika sedang aktif di report, pindah ke form
    const reportActive = $tabPane.hasClass('active') || $('#report-tab').hasClass('active') || $('#report-tab-link').hasClass('active');
    if(reportActive){
      const formTabEl = document.querySelector('#form-tab');
      if (formTabEl) bootstrap.Tab.getOrCreateInstance(formTabEl).show();
    }
    $navItem.hide();
    $tabItem.hide();
    $tabPane.removeClass('show active');
  }
}

// ====== UI HANDLERS ======
$(function(){
  // Terapkan visibilitas tab saat load
  applyReportVisibility();

  // FAB click -> buka modal
  $('#btnFabSettings').on('click', function(){
    // reset UI modal
    $('#adminPwdError').addClass('d-none');
    $('#adminPassword').val('');
    $('#togglePwd i').removeClass('bi-eye-slash').addClass('bi-eye');

    if(isAdminUnlocked()){
      // langsung ke settings
      $('#adminLoginSection').addClass('d-none');
      $('#settingsSection').removeClass('d-none');
      $('#btnAdminUnlock').addClass('d-none');
      $('#btnSettingsSave').removeClass('d-none');
      // set switch sesuai preferensi
      $('#switchShowReport').prop('checked', getShowReportPref());
    } else {
      // tampilkan login terlebih dahulu
      $('#adminLoginSection').removeClass('d-none');
      $('#settingsSection').addClass('d-none');
      $('#btnAdminUnlock').removeClass('d-none');
      $('#btnSettingsSave').addClass('d-none');
    }

    const modal = new bootstrap.Modal(document.getElementById('adminSettingsModal'));
    modal.show();
  });

  // Toggle show/hide password
  $('#togglePwd').on('click', function(){
    const $inp = $('#adminPassword');
    const isPwd = $inp.attr('type') === 'password';
    $inp.attr('type', isPwd ? 'text' : 'password');
    $(this).find('i').toggleClass('bi-eye bi-eye-slash');
  });

  // Tombol "Masuk"
  $('#btnAdminUnlock').on('click', function(){
    const pwd = $('#adminPassword').val().trim();
    if(pwd === ADMIN_PASSWORD){
      setAdminUnlocked(true);
      $('#adminPwdError').addClass('d-none');

      // switch ke settings
      $('#adminLoginSection').addClass('d-none');
      $('#settingsSection').removeClass('d-none');
      $('#btnAdminUnlock').addClass('d-none');
      $('#btnSettingsSave').removeClass('d-none');

      // muat preferensi
      $('#switchShowReport').prop('checked', getShowReportPref());
    } else {
      $('#adminPwdError').removeClass('d-none');
    }
  });

  // Tombol "Simpan"
  $('#btnSettingsSave').on('click', function(){
    const show = $('#switchShowReport').is(':checked');
    setShowReportPref(show);
    applyReportVisibility();
    // opsional: feedback cepat
    const m = bootstrap.Modal.getInstance(document.getElementById('adminSettingsModal'));
    if(m) m.hide();
    setTimeout(()=>alert('Pengaturan disimpan.'), 50);
  });
});