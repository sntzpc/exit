import { $, $$ } from './utils.js';
import { getDataById, saveData } from './storage.js';
import { syncToSheet } from './gas.js';

function readChecks(ids){
  return ids.filter(id => $(id)?.checked).map(id => $(id).value);
}

export function bindForm(){
  $('#resetForm')?.addEventListener('click', ()=>{
    $('#exitInterviewForm').reset();
    $('#editId').value = '';
  });

  $('#exitInterviewForm')?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const isEdit = Boolean($('#editId').value);

    const formData = {
      id: $('#editId').value || Date.now().toString(),
      timestamp: isEdit ? (getDataById($('#editId').value)?.timestamp) : new Date().toISOString(),
      participantName: $('#participantName').value,
      participantCampus: $('#participantCampus').value,
      participantDepartment: $('#participantDepartment').value,
      participantSupervisor: $('#participantSupervisor').value,
      internshipStart: $('#internshipStart').value,
      internshipEnd: $('#internshipEnd').value,
      overallExperience: $$('input[name="overallExperience"]').find(r=>r.checked)?.value || '',
      bestThing: $('#bestThing').value,
      biggestChallenge: $('#biggestChallenge').value,
      classQuality: $('#classQuality').value,
      supervisorQuality: $('#supervisorQuality').value,
      facilityQuality: $('#facilityQuality').value,
      workEnvironment: $('#workEnvironment').value,
      reasonDetail: $('#reasonDetail').value,
      otherCompany: $('#otherCompany').value,
      otherPosition: $('#otherPosition').value,
      suggestions: $('#suggestions').value,
      conclusion: $('#conclusion').value,
      reasons: readChecks(['#reasonSalary','#reasonCareer','#reasonEnvironment','#reasonLocation','#reasonOtherOffer','#reasonOther']),
      attractiveOffers: readChecks(['#offerSalary','#offerLocation','#offerJobType','#offerOther'])
    };

    // simpan lokal
    saveData(formData, isEdit);
    // sync GAS
    await syncToSheet(formData, isEdit ? 'update' : 'save');

    // reset form
    $('#exitInterviewForm').reset();
    $('#editId').value = '';

    alert('Data berhasil disimpan & disinkronkan!');
    bootstrap.Tab.getOrCreateInstance($('#report-tab')).show();
    document.dispatchEvent(new CustomEvent('refresh-table'));
    document.dispatchEvent(new CustomEvent('update-storage-info'));
  });
}

// dipanggil dari report.js saat klik edit
export function fillFormForEdit(item){
  $('#editId').value = item.id;
  $('#participantName').value = item.participantName || '';
  $('#participantCampus').value = item.participantCampus || '';
  $('#participantDepartment').value = item.participantDepartment || '';
  $('#participantSupervisor').value = item.participantSupervisor || '';
  $('#internshipStart').value = item.internshipStart || '';
  $('#internshipEnd').value = item.internshipEnd || '';
  $$('input[name="overallExperience"]').forEach(r => { r.checked = (r.value === (item.overallExperience||'')); });
  $('#bestThing').value = item.bestThing || '';
  $('#biggestChallenge').value = item.biggestChallenge || '';
  $('#classQuality').value = item.classQuality || '';
  $('#supervisorQuality').value = item.supervisorQuality || '';
  $('#facilityQuality').value = item.facilityQuality || '';
  $('#workEnvironment').value = item.workEnvironment || '';
  $('#reasonDetail').value = item.reasonDetail || '';
  $('#otherCompany').value = item.otherCompany || '';
  $('#otherPosition').value = item.otherPosition || '';
  $('#suggestions').value = item.suggestions || '';
  $('#conclusion').value = item.conclusion || '';

  // reset semua checkbox
  $$('input[type="checkbox"]').forEach(c => c.checked = false);
  (item.reasons || []).forEach(v => $$(`input[type="checkbox"][value="${v}"]`).forEach(c => c.checked = true));
  (item.attractiveOffers || []).forEach(v => $$(`input[type="checkbox"][value="${v}"]`).forEach(c => c.checked = true));

  bootstrap.Tab.getOrCreateInstance($('#form-tab')).show();
  window.scrollTo({ top:0, behavior:'smooth' });
}
