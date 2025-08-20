import { STORAGE_KEY, MAX_STORAGE } from './config.js';
import { $, formatDate, formatDateTime } from './utils.js';

export function getStoredData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
export function getDataById(id){
  return getStoredData().find(x => x.id === id);
}
export function saveData(formData, isEdit){
  const data = getStoredData();
  if(isEdit){
    const i = data.findIndex(x => x.id === formData.id);
    if(i !== -1) data[i] = formData; else data.push(formData);
  } else {
    data.push(formData);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
export function deleteDataLocal(id){
  const data = getStoredData().filter(x => x.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function updateStorageInfo(){
  const used = JSON.stringify(localStorage).length;
  const usedKB = (used/1024).toFixed(2);
  const pct = (used / MAX_STORAGE) * 100;

  $('#storageUsage').textContent = `${usedKB} KB`;
  const bar = $('#storageBar');
  bar.style.width = `${pct}%`;
  bar.style.backgroundColor = pct>80 ? '#dc3545' : pct>60 ? '#ffc107' : '#28a745';
}

export function exportToExcel(){
  const data = getStoredData();
  if(data.length === 0) { alert('Tidak ada data untuk diexport.'); return; }

  const excelData = data.map(item => ({
    'Nama Peserta': item.participantName,
    'Asal Kampus': item.participantCampus,
    'Departemen': item.participantDepartment,
    'Pembimbing': item.participantSupervisor,
    'Periode Magang': `${formatDate(item.internshipStart)} - ${formatDate(item.internshipEnd)}`,
    'Pengalaman Keseluruhan': item.overallExperience,
    'Hal Terbaik': item.bestThing,
    'Hal Paling Menantang': item.biggestChallenge,
    'Kualitas Kelas': item.classQuality,
    'Kualitas Pembimbing': item.supervisorQuality,
    'Kualitas Fasilitas': item.facilityQuality,
    'Lingkungan Kerja': item.workEnvironment,
    'Alasan Keluar': (item.reasons||[]).join(', '),
    'Detail Alasan': item.reasonDetail,
    'Perusahaan Lain': item.otherCompany,
    'Posisi Lain': item.otherPosition,
    'Penawaran Menarik': (item.attractiveOffers||[]).join(', '),
    'Saran': item.suggestions,
    'Kesimpulan': item.conclusion,
    'Tanggal Input': formatDateTime(item.timestamp)
  }));

  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Exit Interview');
  XLSX.writeFile(wb, 'exit_interview_data.xlsx');
}
