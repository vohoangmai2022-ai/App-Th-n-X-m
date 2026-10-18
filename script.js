// Quản lý trạng thái và dữ liệu theo tên khu vực (Cô lập dữ liệu riêng cho từng Thôn Xóm)
let currentAreaKey = localStorage.getItem('thonxom_current_area') || 'Bình An - Vĩnh Long';

function getAreaData(key) {
    let data = localStorage.getItem('thonxom_data_' + key);
    if (!data) {
        let defaultData = {
            khuVuc: "Khu Vực NO TOM",
            phuongTinh: "Phường Khánh Hòa, TP Cần Thơ",
            coverImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600",
            avatar: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=100",
            supportPhone: "0900.1080",
            supportEmail: "hotro@thonxom.vn",
            accounts: [
                { id: 1, hoten: "Nguyễn Văn Chủ", chucvu: "Chủ hệ thống", sdt: "0909000000", username: "Chủ hệ thống", password: "password123", type: "chu", area: "Bình An - Vĩnh Long" },
                { id: 2, hoten: "Nguyễn Văn Minh", chucvu: "Bí thư", sdt: "0901234567", username: "Bí thư", password: "password123", type: "me", area: "Bình An - Vĩnh Long" },
                { id: 3, hoten: "Trần Văn Hùng", chucvu: "Công an viên", sdt: "0912345678", username: "Công an viên", password: "password123", type: "con", area: "Bình An - Vĩnh Long" }
            ],
            contacts: [
                { id: 1, name: "Bí Thư Chi Bộ", person: "Nguyễn Văn Minh", phone: "0901234567", isEmergency: true, color: "emerald" },
                { id: 2, name: "Trưởng Ban An Ninh", person: "Thiếu tá Trần Văn Hùng", phone: "0912345678", isEmergency: true, color: "blue" },
                { id: 3, name: "Y Tế Trạm Xá", person: "Y sĩ Lê Thị Mai", phone: "0988888888", isEmergency: true, color: "red" }
            ],
            news: [],
            phanAnh: [],
            thuTucDocs: [],
            hopChiBo: [],
            bieuQuyet: [],
            chatMessages: [],
            bannedUsers: []
        };
        localStorage.setItem('thonxom_data_' + key, JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

let db = getAreaData(currentAreaKey);
let currentUser = JSON.parse(localStorage.getItem('thonxom_logged_user')) || null;

function saveDB() {
    localStorage.setItem('thonxom_data_' + currentAreaKey, JSON.stringify(db));
}

// Khởi chạy hệ thống
document.addEventListener('DOMContentLoaded', () => {
    initAppConfig();
    renderSidebarContacts();
    renderNews();
    renderPhanAnh();
    renderThuTucDocs();
    renderHopChiBo();
    renderBieuQuyet();
    renderChatMessages();
    renderAccountsTable();
    checkRolePermissions();
});

function initAppConfig() {
    document.getElementById('display-khu-vuc').innerText = db.khuVuc;
    document.getElementById('display-phuong-tỉnh').innerText = db.phuongTinh;
    document.getElementById('cover-image-display').src = db.coverImg;
    document.getElementById('header-avatar').src = db.avatar;
    document.getElementById('footer-support-phone').innerText = "Hỗ trợ kỹ thuật: " + db.supportPhone;
    document.getElementById('footer-support-email').innerText = "Email: " + db.supportEmail;
    
    document.getElementById('cfg-khu-vuc').value = db.khuVuc;
    document.getElementById('cfg-phuong-tỉnh').value = db.phuongTinh;
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-3.5 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 whitespace-nowrap";
    });
    const activeBtn = document.getElementById('btn-' + tabId) || document.getElementById('tab-btn-quanly');
    if(activeBtn) {
        activeBtn.className = "tab-btn px-3.5 py-2 rounded-lg text-primary bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition flex items-center gap-2 whitespace-nowrap";
    }
}

// Render danh bạ & nút khẩn cấp trên Header
function renderSidebarContacts() {
    const container = document.getElementById('sidebar-contacts-list');
    const headerEmergency = document.getElementById('header-emergency-buttons');
    if(!container || !headerEmergency) return;
    
    container.innerHTML = '';
    headerEmergency.innerHTML = '';

    db.contacts.forEach(c => {
        container.innerHTML += `
            <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 shadow-sm">
                <div><p class="font-bold text-xs">${c.name}</p><p class="text-gray-500 text-[11px]">${c.person} -${c.phone}</p></div>
                <a href="tel:${c.phone}" class="bg-${c.color \vert{}\vert{} 'emerald'}-100 text-${c.color || 'emerald'}-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"><i class="fa-solid fa-phone"></i> Gọi</a>
            </div>
        `;
        if(c.isEmergency) {
            headerEmergency.innerHTML += `
                <a href="tel:${c.phone}" class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-2 rounded-lg shadow flex items-center gap-1 transition animate-pulse" title="${c.name}:${c.person}">
                    <i class="fa-solid fa-phone-volume"></i> ${c.name.split(' ')[0]}
                </a>
            `;
        }
    });

    const contactBtnContainer = document.getElementById('manage-contacts-btn-container');
    if(currentUser && (currentUser.type === 'chu' || currentUser.type === 'me')) {
        contactBtnContainer.innerHTML = `<button onclick="openContactModal()" class="text-xs bg-primary text-white px-2.5 py-1 rounded shadow-sm">Thêm/Sửa</button>`;
    } else {
        contactBtnContainer.innerHTML = '';
    }
}

// Phân quyền giao diện
function checkRolePermissions() {
    const addNewsContainer = document.getElementById('action-add-news-container');
    const addHopContainer = document.getElementById('action-add-hop-container');
    const addBqContainer = document.getElementById('action-add-bq-container');
    const tabQuanLyBtn = document.getElementById('tab-btn-quanly');
    const officerUploadTt = document.getElementById('officer-upload-thutuc-card');
    const authBtnText = document.getElementById('auth-btn-text');
    const currentUserBadge = document.getElementById('current-user-badge');

    if(addNewsContainer) addNewsContainer.innerHTML = '';
    if(addHopContainer) addHopContainer.innerHTML = '';
    if(addBqContainer) addBqContainer.innerHTML = '';
    if(tabQuanLyBtn) tabQuanLyBtn.classList.add('hidden');
    if(officerUploadTt) officerUploadTt.classList.add('hidden');

    if(currentUser) {
        authBtnText.innerText = currentUser.chucvu + " (" + currentUser.hoten + ")";
        if(currentUserBadge) currentUserBadge.innerHTML = `Đang đăng nhập: <b>${currentUser.chucvu}</b> -${currentUser.hoten}`;

        if(currentUser.type === 'chu' || currentUser.type === 'me') {
            if(tabQuanLyBtn) tabQuanLyBtn.classList.remove('hidden');
            if(officerUploadTt) officerUploadTt.classList.remove('hidden');
            if(addNewsContainer) addNewsContainer.innerHTML = `<button onclick="openNewsModal()" class="bg-primary text-white text-xs px-3 py-2 rounded-lg font-semibold shadow"><i class="fa-solid fa-plus mr-1"></i> Đăng Bài</button>`;
            if(addHopContainer) addHopContainer.innerHTML = `<button onclick="openHopModal()" class="bg-primary text-white text-xs px-3 py-2 rounded-lg font-semibold shadow"><i class="fa-solid fa-plus mr-1"></i> Tạo Lịch Họp</button>`;
            if(addBqContainer) addBqContainer.innerHTML = `<button onclick="openBqModal()" class="bg-secondary text-white text-xs px-3 py-2 rounded-lg font-semibold shadow"><i class="fa-solid fa-plus mr-1"></i> Tạo Biểu Quyết</button>`;
        }
    } else {
        authBtnText.innerText = "Cán Bộ Đăng Nhập";
        if(currentUserBadge) currentUserBadge.innerHTML = "Chưa đăng nhập";
    }
}

// Đăng nhập
function openLoginModal() { document.getElementById('login-modal').classList.remove('hidden'); }
function closeLoginModal() { document.getElementById('login-modal').classList.add('hidden'); }

function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();

    const found = db.accounts.find(acc => acc.username.toLowerCase() === u.toLowerCase() && acc.password === p);
    if(found) {
        currentUser = found;
        localStorage.setItem('thonxom_logged_user', JSON.stringify(currentUser));
        closeLoginModal();
        showToast("Đăng nhập thành công: " + found.chucvu);
        checkRolePermissions();
        renderAccountsTable();
        renderSidebarContacts();
    } else {
        showToast("Sai tên đăng nhập hoặc mật khẩu (Mật khẩu ít nhất 8 ký tự)!");
    }
}

function openForgotModal() { closeLoginModal(); document.getElementById('forgot-modal').classList.remove('hidden'); }
function closeForgotModal() { document.getElementById('forgot-modal').classList.add('hidden'); }

function handleForgotAccount(e) {
    e.preventDefault();
    const sdt = document.getElementById('forgot-sdt').value.trim();
    const found = db.accounts.find(acc => acc.sdt === sdt);
    const box = document.getElementById('forgot-result-box');
    box.classList.remove('hidden');
    if(found) {
        box.innerHTML = `<p class="text-emerald-600 font-bold">Tìm thấy tài khoản!</p>
                         <p>Họ tên: ${found.hoten}</p>
                         <p>Chức vụ (Username): <b>${found.chucvu}</b></p>
                         <p>Mật khẩu: <b>${found.password}</b></p>`;
    } else {
        box.innerHTML = `<p class="text-red-500">Không tìm thấy tài khoản với số điện thoại này!</p>`;
    }
}

// Cấp tài khoản phân vùng
function createNewAccount(e) {
    e.preventDefault();
    if(!currentUser || (currentUser.type !== 'chu' && currentUser.type !== 'me')) {
        showToast("Bạn không có quyền cấp phát tài khoản!");
        return;
    }
    const hoten = document.getElementById('acc-hoten').value.trim();
    const chucvu = document.getElementById('acc-chucvu').value.trim();
    const sdt = document.getElementById('acc-sdt').value.trim();
    const password = document.getElementById('acc-password').value.trim();
    const type = document.getElementById('acc-type').value;

    if(password.length < 8) {
        showToast("Mật khẩu phải có ít nhất 8 ký tự!");
        return;
    }

    db.accounts.push({
        id: Date.now(),
        hoten,
        chucvu,
        sdt,
        username: chucvu,
        password,
        type,
        area: currentAreaKey
    });
    saveDB();
    renderAccountsTable();
    showToast("Đã cấp phát tài khoản thành công!");
    e.target.reset();
}

function renderAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    db.accounts.forEach(acc => {
        let typeBadge = acc.type === 'chu' ? '<span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Chủ</span>' : (acc.type === 'me' ? '<span class="bg-emerald-100 text-primary px-2 py-0.5 rounded">Mẹ (Cán bộ)</span>' : '<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Con (Đảng viên)</span>');
        tbody.innerHTML += `
            <tr class="border-b dark:border-gray-700">
                <td class="p-2.5 font-semibold">${acc.hoten}</td>
                <td class="p-2.5">${acc.chucvu}</td>
                <td class="p-2.5">${acc.sdt}</td>
                <td class="p-2.5">${typeBadge}</td>
                <td class="p-2.5 text-center">
                    ${currentUser && currentUser.type === 'chu' && acc.type !== 'chu' ? `<button onclick="deleteAccount(${acc.id})" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>` : ''}
                </td>
            </tr>
        `;
    });
}

function deleteAccount(id) {
    db.accounts = db.accounts.filter(a => a.id !== id);
    saveDB();
    renderAccountsTable();
    showToast("Đã xóa tài khoản!");
}

// Cấu hình khu vực hoạt động
function saveKhuVucConfig() {
    const kv = document.getElementById('cfg-khu-vuc').value.trim();
    const pt = document.getElementById('cfg-phuong-tỉnh').value.trim();
    if(!kv) {
        showToast("Vui lòng nhập tên khu vực!");
        return;
    }
    const newAreaKey = kv + " - " + pt;
    localStorage.setItem('thonxom_current_area', newAreaKey);

    let currentData = getAreaData(newAreaKey);
    currentData.khuVuc = kv;
    currentData.phuongTinh = pt;

    const fileInput = document.getElementById('cfg-cover-img');
    if(fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentData.coverImg = e.target.result;
            localStorage.setItem('thonxom_data_' + newAreaKey, JSON.stringify(currentData));
            location.reload();
        }
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        localStorage.setItem('thonxom_data_' + newAreaKey, JSON.stringify(currentData));
        location.reload();
    }
}

// Họp Chi Bộ & Tài Liệu Nội Bộ
let tempHopFile = "";
function openHopModal() { document.getElementById('hop-modal').classList.remove('hidden'); }
function closeHopModal() { document.getElementById('hop-modal').classList.add('hidden'); tempHopFile = ""; }

function submitHopChiBo(e) {
    e.preventDefault();
    const title = document.getElementById('hop-title').value.trim();
    const time = document.getElementById('hop-time').value.trim();
    const content = document.getElementById('hop-content').value.trim();
    const fileInput = document.getElementById('hop-file');

    let saveRecord = () => {
        db.hopChiBo.unshift({
            id: Date.now(),
            title,
            time,
            content,
            file: tempHopFile,
            fileName: fileInput.files[0] ? fileInput.files[0].name : "",
            author: currentUser ? currentUser.chucvu + " - " + currentUser.hoten : "Bí thư Chi bộ"
        });
        saveDB();
        closeHopModal();
        renderHopChiBo();
        showToast("Đã đăng lịch họp và tài liệu nội bộ thành công!");
        e.target.reset();
    };

    if(fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            tempHopFile = evt.target.result;
            saveRecord();
        };
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        saveRecord();
    }
}

function renderHopChiBo() {
    const list = document.getElementById('hop-chibo-list');
    if(!list) return;
    list.innerHTML = '';
    if(db.hopChiBo.length === 0) {
        list.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Chưa có lịch họp chi bộ hoặc tài liệu nội bộ nào.</p>`;
        return;
    }
    db.hopChiBo.forEach(h => {
        let fileHtml = h.file ? `<a href="${h.file}" download="${h.fileName || 'tai-lieu-hop.pdf'}" class="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-primary font-semibold px-3 py-1.5 rounded-lg mt-2"><i class="fa-solid
