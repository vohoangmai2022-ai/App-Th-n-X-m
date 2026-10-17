let currentUser = JSON.parse(localStorage.getItem('app_current_user')) || null;
let appConfig = JSON.parse(localStorage.getItem('app_config')) || {
    khuVuc: "Thôn Xóm Bình An",
    phuongTinh: "Phường Phước Long, Tỉnh Vĩnh Long",
    coverImg: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600"
};

let accounts = JSON.parse(localStorage.getItem('app_accounts')) || [
    { id: 1, name: "Quản Trị Chủ", chucvu: "Chủ Hệ Thống (Master)", sdt: "0900000000", username: "useradmin", password: "useradmin1234", role: "chu" },
    { id: 2, name: "Nguyễn Văn Mẹ", chucvu: "Bí thư Chi bộ", sdt: "0911111111", username: "canbome", password: "123456", role: "me" },
    { id: 3, name: "Lê Văn Con", chucvu: "Đảng viên", sdt: "0922222222", username: "dangviencon", password: "123456", role: "con" }
];

let newsList = JSON.parse(localStorage.getItem('app_news')) || [
    { id: 1, title: "Thông báo hội nghị tiếp xúc cử tri quý IV/2026", content: "Thực hiện kế hoạch của UBND phường, trân trọng kính mời toàn thể nhân dân tham gia hội nghị tiếp xúc cử tri.", author: "Nguyễn Văn Mẹ", date: "17/10/2026", images: ["https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800"] }
];

let phanAnhList = JSON.parse(localStorage.getItem('app_phananh')) || [
    { id: 1, hoten: "Trần Thị Lan", sdt: "0933444555", diachi: "Tổ 3, Thôn Bình An", noidung: "Đèn chiếu sáng ngõ số 4 bị hỏng, đề nghị kiểm tra.", images: ["https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=400"], status: "Đang xử lý", date: "16/10/2026" }
];

let thuTucDocs = JSON.parse(localStorage.getItem('app_thutuc_docs')) || [
    { id: 1, title: "Biểu mẫu Đăng ký thường trú (CT01)", date: "10/10/2026" },
    { id: 2, title: "Hướng dẫn thủ tục Cấp CCCD gắn chip", date: "12/10/2026" }
];

let hopChiBoList = JSON.parse(localStorage.getItem('app_hopchibo')) || [
    { id: 1, title: "Sinh hoạt chi bộ định kỳ tháng 10/2026", time: "19h30 18/10", content: "Đánh giá công tác xây dựng nông thôn mới.", author: "Nguyễn Văn Mẹ" }
];

let bieuQuyetList = JSON.parse(localStorage.getItem('app_bieuquyet')) || [
    { id: 1, title: "Bình chọn tuyến đường hoa kiểu mẫu năm 2026", options: [{ text: "Tuyến số 1", votes: 42 }, { text: "Tuyến số 2", votes: 28 }], totalVotes: 70 }
];

let chatMessages = JSON.parse(localStorage.getItem('app_chat')) || [
    { id: 1, sender: "Nguyễn Văn Mẹ (Cán bộ)", msg: "Chào bà con, mọi thắc mắc có thể nhắn trực tiếp tại đây để được giải đáp.", time: "10:00" }
];

let tempPaImages = [];
let tempNewsImages = [];

window.onload = function() {
    renderConfig();
    renderNews();
    renderPhanAnh();
    renderThuTucDocs();
    renderHopChiBo();
    renderBieuQuyet();
    renderChatMessages();
    updateUIRole();
}

function showToast(msg) {
    const toast = document.getElementById('toast-notification');
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3500);
}

function toggleDarkMode() {
    const root = document.getElementById('html-root');
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    document.getElementById('dark-mode-icon').className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    showToast(isDark ? "Đã chuyển sang chế độ Tối (Dark Mode)" : "Đã chuyển sang chế độ Sáng");
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('text-primary', 'bg-emerald-50', 'dark:bg-emerald-900/30', 'border', 'border-emerald-200');
        btn.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
    });
    const activeBtn = document.getElementById('btn-' + tabId);
    if(activeBtn) {
        activeBtn.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        activeBtn.classList.add('text-primary', 'bg-emerald-50', 'dark:bg-emerald-900/30', 'border', 'border-emerald-200', 'dark:border-emerald-800');
    }
}

function renderConfig() {
    document.getElementById('display-khu-vuc').innerText = appConfig.khuVuc;
    document.getElementById('display-phuong-tỉnh').innerText = appConfig.phuongTinh;
    document.getElementById('cover-image-display').src = appConfig.coverImg;
    document.getElementById('header-avatar').src = appConfig.coverImg;
}

function updateUIRole() {
    const btnQuanLy = document.getElementById('tab-btn-quanly');
    const authBtnText = document.getElementById('auth-btn-text');
    const actionAddNews = document.getElementById('action-add-news-container');
    const actionAddHop = document.getElementById('action-add-hop-container');
    const actionAddBq = document.getElementById('action-add-bq-container');
    const officerUploadTt = document.getElementById('officer-upload-thutuc-card');
    const configKhuVucSec = document.getElementById('config-khuvuc-section');
    const currentUserBadge = document.getElementById('current-user-badge');
    const createAccTitle = document.getElementById('create-acc-title');
    const accTypeSelectWrap = document.getElementById('acc-type-select-wrap');

    if(!currentUser) {
        authBtnText.innerText = "Cán Bộ Đăng Nhập";
        btnQuanLy.classList.add('hidden');
        actionAddNews.innerHTML = ''; actionAddHop.innerHTML = ''; actionAddBq.innerHTML = '';
        officerUploadTt.classList.add('hidden');
    } else {
        authBtnText.innerText = currentUser.name + " (" + (currentUser.role.toUpperCase()) + ")";
        btnQuanLy.classList.remove('hidden');
        currentUserBadge.innerHTML = `<i class="fa-solid fa-user-check mr-1"></i> Đang đăng nhập: <b>${currentUser.name}</b> (${currentUser.chucvu})`;

        if(currentUser.role === 'chu') {
            configKhuVucSec.classList.remove('hidden');
            createAccTitle.innerText = "Cấp Phát Tài Khoản Mẹ (Cán Bộ)";
            accTypeSelectWrap.style.display = 'block';
            document.getElementById('acc-type').innerHTML = '<option value="me">Tài khoản Mẹ (Cán bộ)</option>';
        } else if(currentUser.role === 'me') {
            configKhuVucSec.classList.add('hidden');
            createAccTitle.innerText = "Cấp Phát Tài Khoản Con (Đảng viên)";
            accTypeSelectWrap.style.display = 'block';
            document.getElementById('acc-type').innerHTML = '<option value="con">Tài khoản Con (Đảng viên)</option>';
        } else {
            configKhuVucSec.classList.add('hidden');
            accTypeSelectWrap.style.display = 'none';
        }

        if(currentUser.role === 'chu' || currentUser.role === 'me') {
            actionAddNews.innerHTML = `<button onclick="openNewsModal()" class="bg-primary hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Đăng Bài</button>`;
            actionAddHop.innerHTML = `<button onclick="openHopModal()" class="bg-primary hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Tạo Lịch Họp</button>`;
            actionAddBq.innerHTML = `<button onclick="openBqModal()" class="bg-secondary hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition shadow flex items-center gap-1.5"><i class="fa-solid fa-plus"></i> Tạo Biểu Quyết</button>`;
            officerUploadTt.classList.remove('hidden');
        } else {
            actionAddNews.innerHTML = ''; actionAddHop.innerHTML = ''; actionAddBq.innerHTML = '';
            officerUploadTt.classList.add('hidden');
        }
    }
    renderAccountsTable();
}

function openLoginModal() { document.getElementById('login-modal').classList.remove('hidden'); }
function closeLoginModal() { document.getElementById('login-modal').classList.add('hidden'); }

function handleLogin(e) {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value.trim();
    const found = accounts.find(acc => acc.username === u && acc.password === p);
    if(found) {
        currentUser = found;
        localStorage.setItem('app_current_user', JSON.stringify(currentUser));
        closeLoginModal();
        updateUIRole();
        showToast("Đăng nhập thành công: " + found.name);
        switchTab('tab-tintuc');
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

function openForgotModal() { closeLoginModal(); document.getElementById('forgot-modal').classList.remove('hidden'); document.getElementById('forgot-result-box').classList.add('hidden'); }
function closeForgotModal() { document.getElementById('forgot-modal').classList.add('hidden'); }

function handleForgotAccount(e) {
    e.preventDefault();
    const sdt = document.getElementById('forgot-sdt').value.trim();
    const matched = accounts.filter(acc => acc.sdt === sdt);
    const box = document.getElementById('forgot-result-box');
    box.classList.remove('hidden');
    if(matched.length > 0) {
        let html = `<p class="font-bold text-emerald-600 mb-1">Tìm thấy ${matched.length} tài khoản:</p>`;
        matched.forEach(acc => {
            html += `<div class="bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-700 mb-1">
                <p><b>Họ tên:</b> ${acc.name}</p>
                <p><b>Username:</b> <span class="text-primary font-mono">${acc.username}</span></p>
                <p><b>Password:</b> <span class="text-secondary font-mono">${acc.password}</span></p>
            </div>`;
        });
        box.innerHTML = html;
    } else {
        box.innerHTML = `<p class="text-red-500">Không tìm thấy tài khoản với SĐT ${sdt}.</p>`;
    }
}

function openNewsModal() { document.getElementById('news-modal').classList.remove('hidden'); }
function closeNewsModal() { document.getElementById('news-modal').classList.add('hidden'); }
function updateNewsCharCount() { document.getElementById('news-char-count').innerText = document.getElementById('news-content').value.length + "/8000"; }
function handleNewsImages(e) {
    const files = e.target.files; tempNewsImages = [];
    const prev = document.getElementById('news-image-preview'); prev.innerHTML = '';
    for(let i=0; i<Math.min(files.length, 10); i++) {
        const url = URL.createObjectURL(files[i]); tempNewsImages.push(url);
        prev.innerHTML += `<img src="${url}" class="w-16 h-16 object-cover rounded-lg border">`;
    }
}

function submitNewsArticle(e) {
    e.preventDefault();
    newsList.unshift({
        id: Date.now(),
        title: document.getElementById('news-title').value,
        content: document.getElementById('news-content').value,
        author: currentUser.name + " (" + currentUser.chucvu + ")",
        date: new Date().toLocaleDateString('vi-VN'),
        images: tempNewsImages.length > 0 ? tempNewsImages : ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"]
    });
    localStorage.setItem('app_news', JSON.stringify(newsList));
    closeNewsModal(); renderNews(); showToast("Đã đăng bài tin tức và đồng bộ Terabox!");
    e.target.reset(); tempNewsImages = []; document.getElementById('news-image-preview').innerHTML = '';
}

function filterNews() {
    const keyword = document.getElementById('search-news-input').value.toLowerCase();
    const filtered = newsList.filter(n => n.title.toLowerCase().includes(keyword) || n.content.toLowerCase().includes(keyword));
    renderNews(filtered);
}

function renderNews(list = newsList) {
    const container = document.getElementById('news-feed-list');
    if(list.length === 0) { container.innerHTML = `<p class="text-xs text-gray-400 text-center py-6">Không có bản tin nào.</p>`; return; }
    let html = '';
    list.forEach(item => {
        html += `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 space-y-3">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[11px] bg-emerald-50 dark:bg-emerald-900/30 text-primary px-2 py-0.5 rounded">Thông báo</span>
                        <h4 class="font-bold text-base mt-1">${item.title}</h4>
                    </div>
                    <span class="text-xs text-gray-400">${item.date}</span>
                </div>
                <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">${item.content}</p>
                ${item.images ? `<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">${item.images.map(img => `<img src="${img}" class="w-full h-32 object-cover rounded-lg border dark:border-gray-700">`).join('')}</div>` : ''}
                <div class="flex justify-between items-center pt-2 border-t dark:border-gray-700 text-xs text-gray-500">
                    <span>Đăng bởi: <b>${item.author}</b></span>
                    <span class="text-blue-500"><i class="fa-solid fa-cloud"></i> Terabox Cloud</span>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function updateCharCount() { document.getElementById('pa-char-count').innerText = document.getElementById('pa-noidung').value.length + "/1000"; }
function handlePaImages(e) {
    const files = e.target.files; tempPaImages = [];
    const prev = document.getElementById('pa-image-preview'); prev.innerHTML = '';
    for(let i=0; i<Math.min(files.length, 10); i++) {
        const url = URL.createObjectURL(files[i]); tempPaImages.push(url);
        prev.innerHTML += `<img src="${url}" class="w-16 h-16 object-cover rounded-lg border">`;
    }
}

function submitPhanAnh(e) {
    e.preventDefault();
    const hoten = document.getElementById('pa-hoten').value.trim();
    const sdt = document.getElementById('pa-sdt').value.trim();
    const diachi = document.getElementById('pa-diachi').value.trim();
    if(!hoten || !sdt || !diachi) { alert("Bắt buộc điền đầy đủ Tên, SĐT, Địa chỉ!"); return; }
    if(tempPaImages.length < 3) { alert("Bắt buộc tải lên tối thiểu 3 hình ảnh phản ánh!"); return; }

    phanAnhList.unshift({
        id: Date.now(), hoten, sdt, diachi,
        noidung: document.getElementById('pa-noidung').value.trim(),
        images: tempPaImages, status: "Đang tiếp nhận", date: new Date().toLocaleDateString('vi-VN')
    });
    localStorage.setItem('app_phananh', JSON.stringify(phanAnhList));
    renderPhanAnh(); showToast("Đã gửi phản ánh thành công!");
    e.target.reset(); tempPaImages = []; document.getElementById('pa-image-preview').innerHTML = '';
}

function updatePhanAnhStatus(id, newStatus) {
    const item = phanAnhList.find(p => p.id === id);
    if(item) { item.status = newStatus; localStorage.setItem('app_phananh', JSON.stringify(phanAnhList)); renderPhanAnh(); showToast("Đã cập nhật trạng thái phản ánh!"); }
}

function renderPhanAnh() {
    const container = document.getElementById('phan-anh-list-container');
    const filter = document.getElementById('pa-filter-status').value;
    const filtered = filter === 'all' ? phanAnhList : phanAnhList.filter(p => p.status === filter);
    document.getElementById('pa-count-badge').innerText = filtered.length;

    if(filtered.length === 0) { container.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Không có phản ánh nào.</p>`; return; }
    let html = '';
    filtered.forEach(item => {
        let statusBadge = item.status === 'Đang tiếp nhận' ? `<span class="bg-amber-100 text-amber-800 text-[11px] px-2.5 py-1 rounded-full font-semibold">Đang tiếp nhận</span>` :
                          item.status === 'Đang xử lý' ? `<span class="bg-blue-100 text-blue-800 text-[11px] px-2.5 py-1 rounded-full font-semibold">Đang xử lý</span>` :
                          `<span class="bg-emerald-100 text-emerald-800 text-[11px] px-2.5 py-1 rounded-full font-semibold">Đã xử lý xong</span>`;

        let officerActions = (currentUser && (currentUser.role === 'chu' || currentUser.role === 'me')) ? `
            <div class="mt-3 pt-2 border-t dark:border-gray-700 flex items-center gap-2 text-xs">
                <span class="font-semibold">Đổi trạng thái:</span>
                <button onclick="updatePhanAnhStatus(${item.id}, 'Đang tiếp nhận')" class="px-2 py-1 bg-amber-50 text-amber-700 rounded border">Tiếp nhận</button>
                <button onclick="updatePhanAnhStatus(${item.id}, 'Đang xử lý')" class="px-2 py-1 bg-blue-50 text-blue-700 rounded border">Xử lý</button>
                <button onclick="updatePhanAnhStatus(${item.id}, 'Đã xử lý')" class="px-2 py-1 bg-emerald-50 text-emerald-700 rounded border">Hoàn tất</button>
            </div>
        ` : '';

        html += `
            <div class="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 p-4 rounded-xl space-y-2">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-bold text-sm">${item.hoten} <span class="text-xs text-gray-500 font-normal">(${item.sdt})</span></p>
                        <p class="text-[11px] text-gray-500"><i class="fa-solid fa-location-dot"></i> ${item.diachi} • ${item.date}</p>
                    </div>
                    <div>${statusBadge}</div>
                </div>
                <p class="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">${item.noidung}</p>
                ${item.images ? `<div class="flex gap-2 mt-2 flex-wrap">${item.images.map(img => `<img src="${img}" class="w-16 h-16 object-cover rounded-lg border">`).join('')}</div>` : ''}
                ${officerActions}
            </div>
        `;
    });
    container.innerHTML = html;
}

function searchThuTucAI() {
    const query = document.getElementById('tt-search-input').value.trim();
    const box = document.getElementById('ai-result-box');
    const content = document.getElementById('ai-answer-content');
    if(!query) { alert("Vui lòng nhập tên thủ tục!"); return; }
    box.classList.remove('hidden');
    content.innerHTML = `<div class="flex items-center gap-2 text-gray-500"><i class="fa-solid fa-spinner fa-spin"></i> AI Gemini đang tra cứu...</div>`;
    setTimeout(() => {
        content.innerHTML = `
            <p><b>Kết quả tra cứu AI cho:</b> "${query}"</p>
            <p><b>Hồ sơ chuẩn bị:</b> Giấy tờ tùy thân (CCCD), Đơn đề nghị, các giấy tờ liên quan.</p>
            <p><b>Quy trình:</b> Nộp hồ sơ trực tuyến hoặc tại bộ phận một cửa UBND xã/phường, nhận biên nhận và kết quả hẹn trả.</p>
            <p class="text-blue-500 mt-2">Tra cứu văn bản gốc tại <a href="https://thuvienphapluat.vn" target="_blank" class="underline font-bold">Thư Viện Pháp Luật</a>.</p>
        `;
    }, 700);
}

function officerUploadThuTuc(e) {
    e.preventDefault();
    thuTucDocs.unshift({ id: Date.now(), title: document.getElementById('off-tt-title').value, date: new Date().toLocaleDateString('vi-VN') });
    localStorage.setItem('app_thutuc_docs', JSON.stringify(thuTucDocs));
    renderThuTucDocs(); showToast("Đã đẩy tài liệu thủ tục lên Terabox!"); e.target.reset();
}

function renderThuTucDocs() {
    const container = document.getElementById('thutuc-doc-list');
    if(thuTucDocs.length === 0) { container.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Chưa có tài liệu.</p>`; return; }
    let html = '';
    thuTucDocs.forEach(item => {
        html += `
            <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border dark:border-gray-700 text-xs">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-file-pdf text-red-500 text-base"></i>
                    <div><p class="font-bold">${item.title}</p><p class="text-[11px] text-gray-400">${item.date} • Terabox Sync</p></div>
                </div>
                <a href="#" onclick="showToast('Đang tải file từ Terabox...')" class="bg-primary text-white px-3 py-1.5 rounded font-semibold">Tải Xuống</a>
            </div>
        `;
    });
    container.innerHTML = html;
}

function openHopModal() { document.getElementById('hop-modal').classList.remove('hidden'); }
function closeHopModal() { document.getElementById('hop-modal').classList.add('hidden'); }
function submitHopChiBo(e) {
    e.preventDefault();
    hopChiBoList.unshift({ id: Date.now(), title: document.getElementById('hop-title').value, time: document.getElementById('hop-time').value, content: document.getElementById('hop-content').value, author: currentUser.name });
    localStorage.setItem('app_hopchibo', JSON.stringify(hopChiBoList));
    closeHopModal(); renderHopChiBo(); showToast("Đã tạo lịch họp chi bộ!"); e.target.reset();
}

function renderHopChiBo() {
    const container = document.getElementById('hop-chibo-list');
    if(hopChiBoList.length === 0) { container.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Chưa có lịch họp.</p>`; return; }
    let html = '';
    hopChiBoList.forEach(item => {
        html += `
            <div class="bg-emerald-50/40 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl space-y-2 text-xs">
                <div class="flex justify-between items-start">
                    <h4 class="font-bold text-sm text-primary">${item.title}</h4>
                    <span class="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded">${item.time}</span>
                </div>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${item.content}</p>
                <div class="flex justify-between items-center pt-2 border-t dark:border-gray-700 text-gray-500">
                    <span>Chủ trì: <b>${item.author}</b></span>
                    <button onclick="window.print()" class="text-primary font-semibold hover:underline"><i class="fa-solid fa-print"></i> In / Xuất Biên Bản</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function openBqModal() { document.getElementById('bq-modal').classList.remove('hidden'); }
function closeBqModal() { document.getElementById('bq-modal').classList.add('hidden'); }
function submitBieuQuyet(e) {
    e.preventDefault();
    const options = document.getElementById('bq-options').value.split(',').map(o => ({ text: o.trim(), votes: 0 }));
    bieuQuyetList.unshift({ id: Date.now(), title: document.getElementById('bq-title').value, options, totalVotes: 0 });
    localStorage.setItem('app_bieuquyet', JSON.stringify(bieuQuyetList));
    closeBqModal(); renderBieuQuyet(); showToast("Đã tạo cuộc biểu quyết mới!"); e.target.reset();
}

function voteOption(bqId, optIdx) {
    const bq = bieuQuyetList.find(b => b.id === bqId);
    if(bq) { bq.options[optIdx].votes += 1; bq.totalVotes += 1; localStorage.setItem('app_bieuquyet', JSON.stringify(bieuQuyetList)); renderBieuQuyet(); showToast("Đã ghi nhận phiếu bình chọn!"); }
}

function renderBieuQuyet() {
    const container = document.getElementById('bieu-quyet-list');
    if(bieuQuyetList.length === 0) { container.innerHTML = `<p class="text-xs text-gray-400 text-center py-4">Chưa có biểu quyết.</p>`; return; }
    let html = '';
    bieuQuyetList.forEach(bq => {
        let optsHtml = '';
        bq.options.forEach((opt, idx) => {
            const percent = bq.totalVotes > 0 ? Math.round((opt.votes / bq.totalVotes) * 100) : 0;
            optsHtml += `
                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-medium"><span>${opt.text}</span><span>${opt.votes} phiếu (${percent}%)</span></div>
                    <div class="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden flex">
                        <div class="bg-primary h-full transition-all duration-500" style="width: ${percent}%"></div>
                    </div>
                    <button onclick="voteOption(${bq.id}, ${idx})" class="mt-1 bg-emerald-50 dark:bg-emerald-900/30 text-primary hover:bg-emerald-100 px-3 py-1 rounded text-xs font-semibold transition border border-emerald-200 dark:border-emerald-800">
                        <i class="fa-solid fa-check mr-1"></i> Bình Chọn
                    </button>
                </div>
            `;
        });
        html += `
            <div class="bg-white dark:bg-gray-800 border dark:border-gray-700 p-5 rounded-xl space-y-3 shadow-sm">
                <div class="flex justify-between items-start"><h4 class="font-bold text-base">${bq.title}</h4><span class="text-xs bg-amber-50 dark:bg-amber-900/30 text-secondary px-2.5 py-1 rounded-full font-semibold">Tổng: ${bq.totalVotes} phiếu</span></div>
                <div class="space-y-3 pt-2">${optsHtml}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function sendChatMessage(e) {
    e.preventDefault();
    const sender = document.getElementById('chat-input-name').value.trim();
    const msg = document.getElementById('chat-input-msg').value.trim();
    if(!sender || !msg) return;

    chatMessages.push({ id: Date.now(), sender, msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) });
    localStorage.setItem('app_chat', JSON.stringify(chatMessages));
    renderChatMessages();
    document.getElementById('chat-input-msg').value = '';
}

function renderChatMessages() {
    const box = document.getElementById('chat-messages-box');
    let html = '';
    chatMessages.forEach(c => {
        html += `
            <div class="bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 p-3 rounded-xl space-y-1">
                <div class="flex justify-between items-center text-[11px] text-gray-500">
                    <span class="font-bold text-primary">${c.sender}</span>
                    <span>${c.time}</span>
                </div>
                <p class="text-gray-800 dark:text-gray-200">${c.msg}</p>
            </div>
        `;
    });
    box.innerHTML = html;
    box.scrollTop = box.scrollHeight;
}

function createNewAccount(e) {
    e.preventDefault();
    if(!currentUser || (currentUser.role !== 'chu' && currentUser.role !== 'me')) return;

    const name = document.getElementById('acc-hoten').value.trim();
    const chucvu = document.getElementById('acc-chucvu').value.trim();
    const sdt = document.getElementById('acc-sdt').value.trim();
    const username = document.getElementById('acc-username').value.trim();
    const password = document.getElementById('acc-password').value.trim();
    let role = currentUser.role === 'chu' ? 'me' : 'con';

    if(accounts.some(a => a.username === username)) { alert("Username đã tồn tại!"); return; }

    accounts.push({ id: Date.now(), name, chucvu, sdt, username, password, role });
    localStorage.setItem('app_accounts', JSON.stringify(accounts));
    renderAccountsTable(); showToast(`Đã cấp thành công tài khoản ${role.toUpperCase()}!`); e.target.reset();
}

function deleteAccount(id) {
    const target = accounts.find(a => a.id === id);
    if(!target) return;
    if((currentUser.role === 'chu' && target.role === 'me') || (currentUser.role === 'me' && target.role === 'con')) {
        if(confirm(`Xóa tài khoản ${target.name}?`)) {
            accounts = accounts.filter(a => a.id !== id);
            localStorage.setItem('app_accounts', JSON.stringify(accounts));
            renderAccountsTable(); showToast("Đã xóa tài khoản!");
        }
    } else { alert("Bạn không có quyền xóa tài khoản này!"); }
}

function renderAccountsTable() {
    const tbody = document.getElementById('accounts-table-body');
    if(!currentUser || (currentUser.role !== 'chu' && currentUser.role !== 'me')) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-400">Đăng nhập tài khoản Chủ hoặc Mẹ để quản lý.</td></tr>`;
        return;
    }
    const filtered = currentUser.role === 'chu' ? accounts.filter(a => a.role === 'me') : accounts.filter(a => a.role === 'con');
    if(filtered.length === 0) { tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-400">Chưa có tài khoản.</td></tr>`; return; }
    let html = '';
    filtered.forEach(acc => {
        html += `
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-900">
                <td class="p-2.5 font-bold">${acc.name}</td>
                <td class="p-2.5 text-gray-500">${acc.chucvu}</td>
                <td class="p-2.5 text-gray-500">${acc.sdt}</td>
                <td class="p-2.5 font-mono text-primary">${acc.username}</td>
                <td class="p-2.5"><span class="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-semibold">${acc.role.toUpperCase()}</span></td>
                <td class="p-2.5 text-center"><button onclick="deleteAccount(${acc.id})" class="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-semibold border border-red-200">Xóa</button></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function saveKhuVucConfig() {
    if(!currentUser || currentUser.role !== 'chu') return;
    const kv = document.getElementById('cfg-khu-vuc').value.trim();
    const pt = document.getElementById('cfg-phuong-tỉnh').value.trim();
    const fileInput = document.getElementById('cfg-cover-img');
    if(kv) appConfig.khuVuc = kv;
    if(pt) appConfig.phuongTinh = pt;
    if(fileInput.files && fileInput.files[0]) appConfig.coverImg = URL.createObjectURL(fileInput.files[0]);

    localStorage.setItem('app_config', JSON.stringify(appConfig));
    renderConfig(); showToast("Đã lưu cấu hình phân vùng thành công!");
}
