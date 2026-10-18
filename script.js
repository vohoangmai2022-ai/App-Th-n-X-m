let currentAreaKey = localStorage.getItem('thonxom_current_area') || 'Bình An - Vĩnh Long';

function getAreaData(key) {
    let data = localStorage.getItem('thonxom_data_' + key);
    if (!data) {
        let defaultData = {
            khuVuc: "Thôn Xóm Bình An",
            phuongTinh: "Phường Phước Long, Tỉnh Vĩnh Long",
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

function renderSidebarContacts() {
    const container = document.getElementById('sidebar-contacts-list');
    const headerEmergency = document.getElementById('header-emergency-buttons');
    if(!container || !headerEmergency) return;
    
    container.innerHTML = '';
    headerEmergency.innerHTML = '';

    db.contacts.forEach(c => {
        container.innerHTML += `
            <div class="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 shadow-sm">
                <div><p class="font-bold text-xs">${c.name}</p><p class="text-gray-500 text-[11px]">${c.person} - ${c.phone}</p></div>
                <a href="tel:${c.phone}" class="bg-${c.color || 'emerald'}-100 text-${c.color || 'emerald'}-700 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"><i class="fa-solid fa-phone"></i> Gọi</a>
            </div>
        `;
        if(c.isEmergency) {
            headerEmergency.innerHTML += `
                <a href="tel:${c.phone}" class="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2.5 py-2 rounded-lg shadow flex items-center gap-1 transition animate-pulse" title="${c.name}: ${c.person}">
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
        if(currentUserBadge) currentUserBadge.innerHTML = `Đang đăng nhập: <b>${currentUser.chucvu}</b> - ${currentUser.hoten}`;

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
        showToast("Sai tên đăng nhập hoặc mật khẩu (Ít nhất 8 ký tự)!");
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
        box.innerHTML = `<p class="text-emerald-600 font-bold">Tìm thấy tài khoản!</p><p>Chức vụ: <b>${found.chucvu}</b></p><p>Mật khẩu: <b>${found.password}</b></p>`;
    } else {
        box.innerHTML = `<p class="text-red-500">Không tìm thấy tài khoản!</p>`;
    }
}

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

    db.accounts.push({ id: Date.now(), hoten, chucvu, sdt, username: chucvu, password, type, area: currentAreaKey });
    saveDB();
    renderAccountsTable();
    showToast("Đã cấp tài khoản thành công!");
    e.target.reset();
}

function renderAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    if(!tbody) return;
    tbody.innerHTML = '';
    db.accounts.forEach(acc => {
        let typeBadge = acc.type === 'chu' ? '<span class="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Chủ</span>' : (acc.type === 'me' ? '<span class="bg-emerald-100 text-primary px-2 py-0.5 rounded">Mẹ (Cán bộ)</span>' : '<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Con</span>');
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

function saveKhuVucConfig() {
    const kv = document.getElementById('cfg-khu-vuc').value.trim();
    const pt = document.getElementById('cfg-phuong-tỉnh').value.trim();
    if(!kv) { showToast("Vui lòng nhập tên khu vực!"); return; }
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
        showToast("Đã đăng lịch họp và tài liệu nội bộ!");
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
        list.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Chưa có lịch họp chi bộ hoặc tài liệu nào.</p>`;
        return;
    }
    db.hopChiBo.forEach(h => {
        let fileHtml = h.file ? `<a href="${h.file}" download="${h.fileName || 'tai-lieu.pdf'}" class="inline-flex items-center gap-1.5 text-xs bg-emerald-100 text-primary font-semibold px-3 py-1.5 rounded-lg mt-2"><i class="fa-solid fa-file-arrow-down"></i> Tải tài liệu (${h.fileName || 'File'})</a>` : '';
        list.innerHTML += `
            <div class="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl border dark:border-gray-700 space-y-2 text-xs shadow-sm">
                <div class="flex justify-between items-center text-gray-400">
                    <span><i class="fa-solid fa-user-shield text-primary"></i> ${h.author}</span>
                    <span><i class="fa-regular fa-clock"></i> ${h.time}</span>
                </div>
                <h4 class="font-bold text-base text-primary dark:text-emerald-400">${h.title}</h4>
                <p class="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">${h.content}</p>
                ${fileHtml}
                ${currentUser && (currentUser.type === 'chu' || currentUser.type === 'me') ? `<div class="pt-2"><button onclick="deleteHop(${h.id})" class="text-red-500 hover:underline"><i class="fa-solid fa-trash mr-1"></i> Xóa lịch họp</button></div>` : ''}
            </div>
        `;
    });
}
function deleteHop(id) {
    db.hopChiBo = db.hopChiBo.filter(h => h.id !== id);
    saveDB();
    renderHopChiBo();
    showToast("Đã xóa lịch họp!");
}

function openContactModal() { document.getElementById('contact-modal').classList.remove('hidden'); renderManageContactsList(); }
function closeContactModal() { document.getElementById('contact-modal').classList.add('hidden'); renderSidebarContacts(); }

function saveNewContact(e) {
    e.preventDefault();
    const name = document.getElementById('ct-name').value;
    const person = document.getElementById('ct-person').value.trim();
    const phone = document.getElementById('ct-phone').value.trim();
    const isEmergency = document.getElementById('ct-is-emergency').checked;

    let color = 'emerald';
    if(name.includes('An Ninh') || name.includes('Công An')) color = 'blue';
    if(name.includes('Y Tế')) color = 'red';

    db.contacts.push({ id: Date.now(), name, person, phone, isEmergency, color });
    saveDB();
    renderSidebarContacts();
    renderManageContactsList();
    showToast("Đã thêm danh bạ thành công!");
    e.target.reset();
}

function renderManageContactsList() {
    const list = document.getElementById('manage-contact-list');
    if(!list) return;
    list.innerHTML = '';
    db.contacts.forEach(c => {
        list.innerHTML += `
            <div class="flex justify-between items-center text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded border">
                <span><b>${c.name}</b> - ${c.person} (${c.phone}) ${c.isEmergency ? '<span class="text-red-500">[Khẩn cấp]</span>' : ''}</span>
                <button onclick="deleteContact(${c.id})" class="text-red-500"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
}
function deleteContact(id) {
    db.contacts = db.contacts.filter(c => c.id !== id);
    saveDB();
    renderSidebarContacts();
    renderManageContactsList();
    showToast("Đã xóa liên hệ!");
}

let tempNewsImages = [];
function openNewsModal() { document.getElementById('news-modal').classList.remove('hidden'); }
function closeNewsModal() { document.getElementById('news-modal').classList.add('hidden'); tempNewsImages = []; }
function updateNewsCharCount() { document.getElementById('news-char-count').innerText = document.getElementById('news-content').value.length + "/8000"; }
function handleNewsImages(e) {
    const files = e.target.files;
    tempNewsImages = [];
    const preview = document.getElementById('news-image-preview');
    preview.innerHTML = '';
    for(let i=0; i<Math.min(files.length, 10); i++) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            tempNewsImages.push(evt.target.result);
            preview.innerHTML += `<img src="${evt.target.result}" class="w-16 h-16 object-cover rounded-lg border">`;
        };
        reader.readAsDataURL(files[i]);
    }
}
function submitNewsArticle(e) {
    e.preventDefault();
    db.news.unshift({
        id: Date.now(),
        title: document.getElementById('news-title').value.trim(),
        content: document.getElementById('news-content').value.trim(),
        images: [...tempNewsImages],
        author: currentUser ? currentUser.chucvu + " - " + currentUser.hoten : "Ban Quản Trị",
        date: new Date().toLocaleDateString('vi-VN')
    });
    saveDB(); closeNewsModal(); renderNews(); showToast("Đã đăng bài!"); e.target.reset();
}
function renderNews(filter = "") {
    const list = document.getElementById('news-feed-list');
    if(!list) return;
    list.innerHTML = '';
    let filtered = db.news.filter(n => n.title.toLowerCase().includes(filter.toLowerCase()));
    if(filtered.length === 0) { list.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Chưa có tin tức.</p>`; return; }
    filtered.forEach(n => {
        list.innerHTML += `
            <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border dark:border-gray-700 space-y-3">
                <div class="flex justify-between items-center text-xs text-gray-400"><span>${n.author}</span><span>${n.date}</span></div>
                <h4 class="font-bold text-base text-primary">${n.title}</h4>
                <p class="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line">${n.content}</p>
                ${currentUser && (currentUser.type === 'chu' || currentUser.type === 'me') ? `<button onclick="deleteNews(${n.id})" class="text-xs text-red-500">Xóa</button>` : ''}
            </div>
        `;
    });
}
function filterNews() { renderNews(document.getElementById('search-news-input').value); }
function deleteNews(id) { db.news = db.news.filter(n => n.id !== id); saveDB(); renderNews(); showToast("Đã xóa!"); }

let tempPaImages = [];
function updateCharCount() { document.getElementById('pa-char-count').innerText = document.getElementById('pa-noidung').value.length + "/1000"; }
function handlePaImages(e) {
    const files = e.target.files;
    tempPaImages = [];
    const preview = document.getElementById('pa-image-preview');
    preview.innerHTML = '';
    for(let i=0; i<files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            tempPaImages.push(evt.target.result);
            preview.innerHTML += `<img src="${evt.target.result}" class="w-16 h-16 object-cover rounded-lg border">`;
        };
        reader.readAsDataURL(files[i]);
    }
}
function submitPhanAnh(e) {
    e.preventDefault();
    if(tempPaImages.length < 3) { showToast("Bắt buộc ít nhất 3 hình ảnh minh chứng!"); return; }
    db.phanAnh.unshift({
        id: Date.now(),
        hoten: document.getElementById('pa-hoten').value.trim(),
        sdt: document.getElementById('pa-sdt').value.trim(),
        diachi: document.getElementById('pa-diachi').value.trim(),
        noidung: document.getElementById('pa-noidung').value.trim(),
        images: [...tempPaImages],
        status: "Đang tiếp nhận",
        response: "",
        date: new Date().toLocaleDateString('vi-VN')
    });
    saveDB(); renderPhanAnh(); showToast("Đã gửi phản ánh!"); e.target.reset(); tempPaImages = []; document.getElementById('pa-image-preview').innerHTML = '';
}
function renderPhanAnh() {
    const container = document.getElementById('phan-anh-list-container');
    const badge = document.getElementById('pa-count-badge');
    if(!container) return;
    container.innerHTML = '';
    badge.innerText = db.phanAnh.length;
    db.phanAnh.forEach(p => {
        container.innerHTML += `
            <div class="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border space-y-2 text-xs shadow-sm">
                <div class="flex justify-between font-bold"><span>${p.hoten} (${p.sdt})</span><span class="text-blue-600">${p.status}</span></div>
                <p>${p.noidung}</p>
                ${currentUser && (currentUser.type === 'chu' || currentUser.type === 'me') ? `<button onclick="deletePa(${p.id})" class="text-red-500">Xóa</button>` : ''}
            </div>
        `;
    });
}
function deletePa(id) { db.phanAnh = db.phanAnh.filter(p => p.id !== id); saveDB(); renderPhanAnh(); showToast("Đã xóa!"); }

function searchThuTucAI() {
    const query = document.getElementById('tt-search-input').value.trim();
    const box = document.getElementById('ai-result-box');
    const content = document.getElementById('ai-answer-content');
    if(!query) { showToast("Nhập tên thủ tục!"); return; }
    box.classList.remove('hidden');
    content.innerHTML = `<p class="animate-pulse">Đang tìm kiếm quy trình thủ tục...</p>`;
    setTimeout(() => {
        content.innerHTML = `
            <p class="font-bold text-primary">Kết quả tra cứu: "${query}"</p>
            <p><b>Bước 1:</b> Chuẩn bị hồ sơ pháp lý liên quan.</p>
            <p><b>Bước 2:</b> Nộp trực tuyến hoặc tại bộ phận Một cửa địa phương.</p>
            <p><b>Bước 3:</b> Nhận kết quả theo giấy hẹn.</p>
        `;
    }, 800);
}
function officerUploadThuTuc(e) {
    e.preventDefault();
    db.thuTucDocs.unshift({ id: Date.now(), title: document.getElementById('off-tt-title').value.trim(), uploader: currentUser ? currentUser.chucvu : "Cán bộ", date: new Date().toLocaleDateString('vi-VN') });
    saveDB(); renderThuTucDocs(); showToast("Đã tải lên biểu mẫu!"); e.target.reset();
}
function renderThuTucDocs() {
    const list = document.getElementById('thutuc-doc-list');
    if(!list) return;
    list.innerHTML = '';
    db.thuTucDocs.forEach(d => {
        list.innerHTML += `<div class="p-3 bg-gray-50 rounded border text-xs flex justify-between"><span>${d.title}</span><span class="text-gray-400">${d.uploader}</span></div>`;
    });
}

function openBqModal() { document.getElementById('bq-modal').classList.remove('hidden'); }
function closeBqModal() { document.getElementById('bq-modal').classList.add('hidden'); }
function submitBieuQuyet(e) {
    e.preventDefault();
    db.bieuQuyet.unshift({ id: Date.now(), title: document.getElementById('bq-title').value.trim(), options: document.getElementById('bq-options').value.split(',').map(o => ({ text: o.trim(), votes: 0 })) });
    saveDB(); closeBqModal(); renderBieuQuyet(); showToast("Đã phát động!"); e.target.reset();
}
function renderBieuQuyet() {
    const list = document.getElementById('bieu-quyet-list');
    if(!list) return;
    list.innerHTML = '';
    db.bieuQuyet.forEach(b => {
        list.innerHTML += `<div class="p-4 bg-gray-50 rounded border text-xs shadow-sm"><h4 class="font-bold">${b.title}</h4></div>`;
    });
}

function sendChatMessage(e) {
    e.preventDefault();
    const name = document.getElementById('chat-input-name').value.trim();
    const msg = document.getElementById('chat-input-msg').value.trim();
    if(db.bannedUsers && db.bannedUsers.includes(name)) { showToast("Bạn đã bị cấm chat!"); return; }
    db.chatMessages.push({ id: Date.now(), name, msg, time: new Date().toLocaleTimeString('vi-VN', {hour:'2-digit', minute:'2-digit'}) });
    saveDB(); renderChatMessages(); document.getElementById('chat-input-msg').value = '';
}
function renderChatMessages() {
    const box = document.getElementById('chat-messages-box');
    if(!box) return;
    box.innerHTML = '';
    db.chatMessages.forEach(m => {
        box.innerHTML += `<div class="p-2.5 bg-gray-50 rounded border text-xs shadow-sm"><b>${m.name}:</b> ${m.msg}</div>`;
    });
}

function toggleDarkMode() { document.documentElement.classList.toggle('dark'); }
function showToast(msg) {
    const t = document.getElementById('toast-notification');
    document.getElementById('toast-msg').innerText = msg;
    t.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => t.classList.add('translate-y-20', 'opacity-0'), 3000);
}
