// Konfigurasi global aplikasi
export const ADMIN_PASSWORD = 'useradmin123';
export const LS_KEY_SHOW_REPORT = 'showReportTab'; // '1' tampil, '0' sembunyi
export const SS_KEY_ADMIN_OK   = 'isAdminUnlocked'; // sessionStorage

export const STORAGE_KEY = 'exitInterviewData';
export const MAX_STORAGE = 5 * 1024 * 1024; // 5MB

// === GANTI dengan Web App URL GAS Anda ===
export const GAS_URL = 'https://script.google.com/macros/s/AKfycbxZ0cxDa3qzdMNMvAWSVRf3DtGRhLvxA5QD1dNe2_pThu8YpA13z114ypPy2tCP9HyOhA/exec';
export const SHEET_NAME = 'ExitInterview';

// Header untuk sheet (init + mapping)
export const HEADERS = [
  'ID','Timestamp',
  'Nama Peserta','Asal Kampus','Lokasi Pelatihan','Pembimbing',
  'Periode Mulai','Periode Selesai',
  'Pengalaman Keseluruhan','Hal Terbaik','Hal Paling Menantang',
  'Kualitas Kelas','Kualitas Pembimbing','Kualitas Fasilitas',
  'Lingkungan Kerja',
  'Alasan Keluar (Checklist)','Detail Alasan',
  'Perusahaan Lain','Posisi Lain',
  'Penawaran Menarik (Checklist)',
  'Saran','Kesimpulan'
];
