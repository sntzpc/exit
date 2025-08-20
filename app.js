$(document).ready(function () {
    // Initialize variables
    const STORAGE_KEY = 'exitInterviewData';
    const MAX_STORAGE = 5 * 1024 * 1024; // 5MB in bytes

    initSheet(); // memastikan sheet & header siap

    // Load data on page load
    loadTableData();
    updateStorageInfo();

    // Tab navigation
    $('#form-tab-link').click(function () {
        $('#form-tab').tab('show');
    });

    $('#report-tab-link').click(function () {
        $('#report-tab').tab('show');
        loadTableData();
    });

    // Form submission
    $('#exitInterviewForm').off('submit').on('submit', async function (e) {
        e.preventDefault();

        // Tangkap status edit SEBELUM form direset
        const isEdit = Boolean($('#editId').val());

        // Ambil nilai form
        const formData = {
            id: $('#editId').val() || Date.now().toString(),
            timestamp: $('#editId').val() ? getDataById($('#editId').val()).timestamp : new Date().toISOString(),
            participantName: $('#participantName').val(),
            participantCampus: $('#participantCampus').val(),
            participantDepartment: $('#participantDepartment').val(),
            participantSupervisor: $('#participantSupervisor').val(),
            internshipStart: $('#internshipStart').val(),
            internshipEnd: $('#internshipEnd').val(),
            overallExperience: $('input[name="overallExperience"]:checked').val(),
            bestThing: $('#bestThing').val(),
            biggestChallenge: $('#biggestChallenge').val(),
            classQuality: $('#classQuality').val(),
            supervisorQuality: $('#supervisorQuality').val(),
            facilityQuality: $('#facilityQuality').val(),
            workEnvironment: $('#workEnvironment').val(),
            reasonDetail: $('#reasonDetail').val(),
            otherCompany: $('#otherCompany').val(),
            otherPosition: $('#otherPosition').val(),
            suggestions: $('#suggestions').val(),
            conclusion: $('#conclusion').val()
        };

        // Checkbox
        formData.reasons = [];
        if ($('#reasonSalary').is(':checked')) formData.reasons.push($('#reasonSalary').val());
        if ($('#reasonCareer').is(':checked')) formData.reasons.push($('#reasonCareer').val());
        if ($('#reasonEnvironment').is(':checked')) formData.reasons.push($('#reasonEnvironment').val());
        if ($('#reasonLocation').is(':checked')) formData.reasons.push($('#reasonLocation').val());
        if ($('#reasonOtherOffer').is(':checked')) formData.reasons.push($('#reasonOtherOffer').val());
        if ($('#reasonOther').is(':checked')) formData.reasons.push($('#reasonOther').val());

        formData.attractiveOffers = [];
        if ($('#offerSalary').is(':checked')) formData.attractiveOffers.push($('#offerSalary').val());
        if ($('#offerLocation').is(':checked')) formData.attractiveOffers.push($('#offerLocation').val());
        if ($('#offerJobType').is(':checked')) formData.attractiveOffers.push($('#offerJobType').val());
        if ($('#offerOther').is(':checked')) formData.attractiveOffers.push($('#offerOther').val());

        // Simpan lokal
        saveData(formData);

        // Sync ke Google Sheet
        await syncToSheet(formData, isEdit ? 'update' : 'save');

        // Reset form
        $('#exitInterviewForm')[0].reset();
        $('#editId').val('');

        alert('Data berhasil disimpan & disinkronkan!');
        // Pindah ke tab report
        $('#report-tab').tab('show');
        loadTableData();
        updateStorageInfo();
    });

    // Reset form button
    $('#resetForm').click(function () {
        $('#exitInterviewForm')[0].reset();
        $('#editId').val('');
    });

    // Reset all data button
    $('#resetAllData').click(function () {
        if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
            localStorage.removeItem(STORAGE_KEY);
            loadTableData();
            updateStorageInfo();
            alert('Semua data telah dihapus.');
        }
    });

    // Export to Excel button
    $('#exportExcel').click(function () {
        exportToExcel();
    });

    // Load table data
    function loadTableData() {
        const data = getStoredData();
        const tableBody = $('#tableBody');
        tableBody.empty();

        if (data.length === 0) {
            $('#noDataAlert').show();
            return;
        }

        $('#noDataAlert').hide();

        data.forEach((item, index) => {
            const row = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.participantName}</td>
                            <td>${item.participantCampus}</td>
                            <td>${item.participantDepartment}</td>
                            <td>${item.participantSupervisor}</td>
                            <td>${formatDate(item.internshipStart)} - ${formatDate(item.internshipEnd)}</td>
                            <td>${item.overallExperience}</td>
                            <td>${item.reasons ? item.reasons.join(', ') : ''}</td>
                            <td>${formatDateTime(item.timestamp)}</td>
                            <td>
                                <button class="btn btn-sm btn-primary edit-btn" data-id="${item.id}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-sm btn-danger delete-btn" data-id="${item.id}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
            tableBody.append(row);
        });

        // Add event listeners to edit and delete buttons
        $('.edit-btn').click(function () {
            const id = $(this).data('id');
            editData(id);
        });

        $('.delete-btn').click(function () {
            const id = $(this).data('id');
            deleteData(id);
        });
    }

    // Edit data
    function editData(id) {
        const data = getDataById(id);
        if (data) {
            // Populate form fields
            $('#editId').val(data.id);
            $('#participantName').val(data.participantName);
            $('#participantCampus').val(data.participantCampus);
            $('#participantDepartment').val(data.participantDepartment);
            $('#participantSupervisor').val(data.participantSupervisor);
            $('#internshipStart').val(data.internshipStart);
            $('#internshipEnd').val(data.internshipEnd);
            $(`input[name="overallExperience"][value="${data.overallExperience}"]`).prop('checked', true);
            $('#bestThing').val(data.bestThing);
            $('#biggestChallenge').val(data.biggestChallenge);
            $('#classQuality').val(data.classQuality);
            $('#supervisorQuality').val(data.supervisorQuality);
            $('#facilityQuality').val(data.facilityQuality);
            $('#workEnvironment').val(data.workEnvironment);
            $('#reasonDetail').val(data.reasonDetail);
            $('#otherCompany').val(data.otherCompany);
            $('#otherPosition').val(data.otherPosition);
            $('#suggestions').val(data.suggestions);
            $('#conclusion').val(data.conclusion);

            // Reset checkboxes
            $('input[type="checkbox"]').prop('checked', false);

            // Set reason checkboxes
            if (data.reasons) {
                data.reasons.forEach(reason => {
                    $(`input[value="${reason}"]`).prop('checked', true);
                });
            }

            // Set offer checkboxes
            if (data.attractiveOffers) {
                data.attractiveOffers.forEach(offer => {
                    $(`input[value="${offer}"]`).prop('checked', true);
                });
            }

            // Switch to form tab
            $('#form-tab').tab('show');

            // Scroll to top
            window.scrollTo(0, 0);
        }
    }

    // Delete data
    function deleteData(id) {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            const data = getStoredData();
            const newData = data.filter(item => item.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
            loadTableData();
            updateStorageInfo();
            alert('Data berhasil dihapus.');
        }
    }

    // Get data by ID
    function getDataById(id) {
        const data = getStoredData();
        return data.find(item => item.id === id);
    }

    // Get stored data
    function getStoredData() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    // Save data
    function saveData(formData) {
        const data = getStoredData();

        if (formData.id && $('#editId').val()) {
            // Update existing data
            const index = data.findIndex(item => item.id === formData.id);
            if (index !== -1) {
                data[index] = formData;
            }
        } else {
            // Add new data
            data.push(formData);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Update storage info
    function updateStorageInfo() {
        const used = JSON.stringify(localStorage).length;
        const usedKB = (used / 1024).toFixed(2);
        const percentage = (used / MAX_STORAGE) * 100;

        $('#storageUsage').text(`${usedKB} KB`);
        $('#storageBar').css('width', `${percentage}%`);

        if (percentage > 80) {
            $('#storageBar').css('background-color', '#dc3545');
        } else if (percentage > 60) {
            $('#storageBar').css('background-color', '#ffc107');
        } else {
            $('#storageBar').css('background-color', '#28a745');
        }
    }

    // Export to Excel
    function exportToExcel() {
        const data = getStoredData();

        if (data.length === 0) {
            alert('Tidak ada data untuk diexport.');
            return;
        }

        // Prepare data for Excel
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
            'Alasan Keluar': item.reasons ? item.reasons.join(', ') : '',
            'Detail Alasan': item.reasonDetail,
            'Perusahaan Lain': item.otherCompany,
            'Posisi Lain': item.otherPosition,
            'Penawaran Menarik': item.attractiveOffers ? item.attractiveOffers.join(', ') : '',
            'Saran': item.suggestions,
            'Kesimpulan': item.conclusion,
            'Tanggal Input': formatDateTime(item.timestamp)
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Exit Interview');

        // Export to file
        XLSX.writeFile(wb, 'exit_interview_data.xlsx');
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID');
    }

    // Format date and time
    function formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID');
    }
});