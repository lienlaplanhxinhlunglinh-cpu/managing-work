const fileInput = document.querySelector("#cvFile");
const dropZone = document.querySelector("#dropZone");
const fileName = document.querySelector("#fileName");
const fileHint = document.querySelector("#fileHint");
const formMessage = document.querySelector("#formMessage");
const analyzeButton = document.querySelector("#btnAnalyze");
const resultArea = document.querySelector("#resultArea");
const majorSelect = document.querySelector("#selectMajor");

const maxFileSize = 10 * 1024 * 1024;

function showMessage(message, isSuccess = false) {
    formMessage.textContent = message;
    formMessage.classList.toggle("success", isSuccess);
}

function setSelectedFile(file) {
    if (!file) {
        fileName.innerHTML = 'Kéo thả CV vào đây hoặc <span>chọn tệp</span>';
        fileHint.textContent = "Định dạng PDF · Tối đa 10 MB";
        return false;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
        fileInput.value = "";
        setSelectedFile(null);
        showMessage("Vui lòng chọn tệp CV định dạng PDF.");
        return false;
    }
    if (file.size > maxFileSize) {
        fileInput.value = "";
        setSelectedFile(null);
        showMessage("Tệp quá lớn. Vui lòng chọn tệp có dung lượng tối đa 10 MB.");
        return false;
    }

    fileName.textContent = file.name;
    fileHint.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB · PDF`;
    showMessage("Đã chọn CV. Bạn có thể bắt đầu phân tích.", true);
    resultArea.hidden = true;
    return true;
}

fileInput.addEventListener("change", () => {
    setSelectedFile(fileInput.files[0]);
});

for (const eventName of ["dragenter", "dragover"]) {
    dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.add("is-dragging");
    });
}

for (const eventName of ["dragleave", "drop"]) {
    dropZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropZone.classList.remove("is-dragging");
    });
}

dropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer.files[0];
    if (!file) return;

    const transfer = new DataTransfer();
    transfer.items.add(file);
    fileInput.files = transfer.files;
    setSelectedFile(file);
});

analyzeButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!majorSelect.value) {
        showMessage("Vui lòng chọn ngành học hoặc lĩnh vực bạn quan tâm.");
        majorSelect.focus();
        return;
    }
    if (!file) {
        showMessage("Vui lòng tải CV định dạng PDF lên trước khi phân tích.");
        fileInput.focus();
        return;
    }
    if (!setSelectedFile(file)) return;

    resultArea.hidden = false;
    showMessage("Đã tạo bản xem trước minh họa. Chức năng phân tích AI cần được kết nối với máy chủ.", true);
    resultArea.scrollIntoView({ behavior: "smooth", block: "center" });
});
