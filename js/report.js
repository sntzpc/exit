import { $, $$, formatDate, formatDateTime } from './utils.js';
import { getStoredData, getDataById, deleteDataLocal, exportToExcel } from './storage.js';
import { deleteInSheet } from './gas.js';
import { fillFormForEdit } from './form.js';

function renderTable(){
  const data = getStoredData();
  const body = $('#tableBody');
  if(!body) return;
  body.innerHTML = '';

  const noData = $('#noDataAlert');
  if(data.length === 0){ noData?.classList.remove('d-none'); return; }
  noData?.classList.add('d-none');

  data.forEach((item, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${item.participantName||''}</td>
      <td>${item.participantCampus||''}</td>
      <td>${item.participantDepartment||''}</td>
      <td>${item.participantSupervisor||''}</td>
      <td>${formatDate(item.internshipStart)} - ${formatDate(item.internshipEnd)}</td>
      <td>${item.overallExperience||''}</td>
      <td>${(item.reasons||[]).join(', ')}</td>
      <td>${formatDateTime(item.timestamp)}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-edit" data-id="${item.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-danger btn-del" data-id="${item.id}"><i class="bi bi-trash"></i></button>
      </td>`;
    body.appendChild(tr);
  });

  // bind actions
  $$('.btn-edit', body).forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const id = btn.getAttribute('data-id');
      const item = getDataById(id);
      if(item) fillFormForEdit(item);
    });
  });

  $$('.btn-del', body).forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const id = btn.getAttribute('data-id');
      if(!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
      const item = getDataById(id);
      deleteDataLocal(id);
      renderTable();
      document.dispatchEvent(new CustomEvent('update-storage-info'));
      if(item){
        const ok = await deleteInSheet(item.id);
        if(!ok) alert('Data lokal terhapus. Hapus di Sheet gagal, coba lagi nanti.');
      }
      alert('Data berhasil dihapus.');
    });
  });
}

export function bindReport(){
  $('#exportExcel')?.addEventListener('click', exportToExcel);
  $('#resetAllData')?.addEventListener('click', ()=>{
    if(!confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) return;
    localStorage.removeItem('exitInterviewData');
    renderTable();
    document.dispatchEvent(new CustomEvent('update-storage-info'));
    alert('Semua data telah dihapus.');
  });

  //  custom events
  document.addEventListener('refresh-table', renderTable);
  renderTable();
}
