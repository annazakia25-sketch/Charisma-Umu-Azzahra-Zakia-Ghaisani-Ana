const form = document.getElementById("registrationForm");

const nama = document.getElementById("nama");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const ekskul = document.getElementById("ekskul");

function setError(input, message, errorId) {
    input.classList.remove("valid");
    input.classList.add("invalid");
    document.getElementById(errorId).textContent = message;
}

function setSuccess(input, errorId) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    document.getElementById(errorId).textContent = "";
}

// Validasi nama
function validateNama() {
    if (nama.value.trim() === "") {
        setError(nama, "Nama tidak boleh kosong.", "namaError");
        return false;
    }

    if (nama.value.trim().length < 3) {
        setError(nama, "Nama minimal 3 karakter.", "namaError");
        return false;
    }

    setSuccess(nama, "namaError");
    return true;
}

// Validasi email
function validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.value.trim() === "") {
        setError(email, "Email tidak boleh kosong.", "emailError");
        return false;
    }

    if (!emailPattern.test(email.value.trim())) {
        setError(email, "Format email tidak valid.", "emailError");
        return false;
    }

    setSuccess(email, "emailError");
    return true;
}

// Validasi password
function validatePassword() {
    if (password.value.length < 8) {
        setError(
            password,
            "Password minimal 8 karakter.",
            "passwordError"
        );
        return false;
    }

    setSuccess(password, "passwordError");
    return true;
}

// Validasi konfirmasi password
function validateConfirmPassword() {
    if (confirmPassword.value !== password.value) {
        setError(
            confirmPassword,
            "Konfirmasi password harus sama.",
            "confirmPasswordError"
        );
        return false;
    }

    if (confirmPassword.value === "") {
        setError(
            confirmPassword,
            "Konfirmasi password tidak boleh kosong.",
            "confirmPasswordError"
        );
        return false;
    }

    setSuccess(confirmPassword, "confirmPasswordError");
    return true;
}

// Validasi pilihan ekstrakurikuler
function validateEkskul() {
    if (ekskul.value === "") {
        setError(
            ekskul,
            "Silakan pilih ekstrakurikuler.",
            "ekskulError"
        );
        return false;
    }

    setSuccess(ekskul, "ekskulError");
    return true;
}

// Validasi saat diketik/diisi
nama.addEventListener("input", validateNama);
email.addEventListener("input", validateEmail);
password.addEventListener("input", () => {
    validatePassword();
    if (confirmPassword.value !== "") {
        validateConfirmPassword();
    }
});
confirmPassword.addEventListener("input", validateConfirmPassword);
ekskul.addEventListener("change", validateEkskul);

// Saat tombol submit ditekan
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const validNama = validateNama();
    const validEmail = validateEmail();
    const validPassword = validatePassword();
    const validConfirmPassword = validateConfirmPassword();
    const validEkskul = validateEkskul();

    if (
        validNama &&
        validEmail &&
        validPassword &&
        validConfirmPassword &&
        validEkskul
    ) {
        document.getElementById("successMessage").textContent =
            "Pendaftaran Berhasil!";

        form.reset();

        document.querySelectorAll("input, select").forEach(function(input) {
            input.classList.remove("valid");
        });
    } else {
        document.getElementById("successMessage").textContent = "";
    }
});
/* =====================================================
   CHATBOT SEDERHANA (rule-based, tanpa server)
   ===================================================== */

const chatToggle = document.getElementById("chatToggle");
const chatToggleIcon = document.getElementById("chatToggleIcon");
const chatbot = document.getElementById("chatbot");
const chatClose = document.getElementById("chatClose");
const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatQuickReplies = document.getElementById("chatQuickReplies");

// Daftar ekskul diambil langsung dari <select> agar selalu sinkron
const daftarEkskul = Array.from(ekskul.options)
    .filter(function(opt) { return opt.value !== ""; })
    .map(function(opt) { return opt.value; });

// Basis pengetahuan: kata kunci -> jawaban
const pengetahuan = [
    {
        kunci: ["halo", "hai", "hallo", "assalamualaikum", "pagi", "siang", "sore", "malam"],
        jawab: "Halo! Saya asisten pendaftaran ekstrakurikuler. Ada yang bisa saya bantu?"
    },
    {
        kunci: ["daftar ekskul", "pilihan ekskul", "ekskul apa", "list ekskul", "ada ekskul apa", "jenis ekskul"],
        jawab: function() {
            return "Ekstrakurikuler yang tersedia ada " + daftarEkskul.length + ":\n• " +
                daftarEkskul.join("\n• ");
        }
    },
    {
        kunci: ["cara daftar", "bagaimana daftar", "gimana daftar", "langkah"],
        jawab: "Cara mendaftar:\n1. Isi nama lengkap (minimal 3 karakter)\n2. Isi email yang aktif\n3. Buat password minimal 8 karakter\n4. Ulangi password yang sama\n5. Pilih satu ekstrakurikuler\n6. Klik tombol Daftar Sekarang"
    },
    {
        kunci: ["password", "kata sandi", "sandi"],
        jawab: "Password harus minimal 8 karakter, dan kolom Konfirmasi Password harus diisi persis sama dengan password."
    },
    {
        kunci: ["email", "surel"],
        jawab: "Gunakan format email yang benar, contohnya nama@email.com. Kalau formatnya salah, kotak isian akan berubah merah."
    },
    {
        kunci: ["nama"],
        jawab: "Isi nama lengkap sesuai data sekolah, minimal 3 karakter dan tidak boleh kosong."
    },
    {
        kunci: ["merah", "error", "salah", "tidak bisa submit", "gagal daftar", "kenapa gagal"],
        jawab: "Kotak berwarna merah artinya ada isian yang belum sesuai. Baca tulisan merah kecil di bawah kotak tersebut, perbaiki isinya sampai berubah hijau, lalu klik Daftar Sekarang lagi."
    },
    {
        kunci: ["berapa ekskul", "boleh berapa", "dua ekskul", "lebih dari satu"],
        jawab: "Untuk saat ini setiap siswa hanya bisa memilih satu ekstrakurikuler pada formulir ini."
    },
    {
        kunci: ["biaya", "bayar", "gratis", "uang"],
        jawab: "Pendaftaran lewat formulir ini gratis. Kalau ada iuran kegiatan, akan diinformasikan oleh pembina masing-masing ekskul."
    },
    {
        kunci: ["jadwal", "latihan", "kapan", "hari"],
        jawab: "Jadwal latihan ditentukan pembina tiap ekskul, umumnya sepulang sekolah. Detailnya akan diumumkan setelah pendaftaran ditutup."
    },
    {
        kunci: ["ganti", "pindah", "ubah pilihan", "batal"],
        jawab: "Sebelum menekan Daftar Sekarang, pilihan masih bisa diganti lewat dropdown. Kalau sudah terkirim, hubungi panitia ekskul untuk mengubahnya."
    },
    {
        kunci: ["terima kasih", "makasih", "thanks", "thank you"],
        jawab: "Sama-sama! Semoga lancar pendaftarannya."
    },
    {
        kunci: ["siapa kamu", "kamu siapa", "bot"],
        jawab: "Saya chatbot bantuan untuk formulir pendaftaran ekstrakurikuler ini. Saya menjawab dengan kata kunci sederhana, jadi coba tanya singkat ya."
    }
];

// Pertanyaan cepat (tombol chip)
const quickReplies = [
    "Ada ekskul apa saja?",
    "Cara daftar",
    "Syarat password",
    "Kenapa kotaknya merah?"
];

function tampilkanPesan(teks, pengirim) {
    const bubble = document.createElement("div");
    bubble.className = "chat-msg " + pengirim;
    bubble.textContent = teks;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function cariJawaban(pesan) {
    const teks = pesan.toLowerCase();

    // Cek apakah user menyebut nama ekskul tertentu
    const disebut = daftarEkskul.find(function(item) {
        return teks.includes(item.toLowerCase());
    });

    if (disebut && !teks.includes("apa saja")) {
        return "Ekskul " + disebut + " tersedia di formulir ini. Pilih \"" + disebut +
            "\" pada dropdown Pilihan Ekstrakurikuler, lalu lengkapi data diri dan klik Daftar Sekarang.";
    }

    for (let i = 0; i < pengetahuan.length; i++) {
        const item = pengetahuan[i];
        const cocok = item.kunci.some(function(k) { return teks.includes(k); });

        if (cocok) {
            return typeof item.jawab === "function" ? item.jawab() : item.jawab;
        }
    }

    return "Maaf, saya belum paham pertanyaannya. Coba tanya soal: daftar ekskul, cara daftar, syarat password, atau format email.";
}

function balasBot(pesanUser) {
    // Jeda singkat supaya terasa seperti mengetik
    setTimeout(function() {
        tampilkanPesan(cariJawaban(pesanUser), "bot");
    }, 400);
}

function buatQuickReplies() {
    quickReplies.forEach(function(teks) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chat-chip";
        chip.textContent = teks;
        chip.addEventListener("click", function() {
            tampilkanPesan(teks, "user");
            balasBot(teks);
        });
        chatQuickReplies.appendChild(chip);
    });
}

function bukaChat() {
    chatbot.classList.remove("chat-hidden");
    chatToggle.setAttribute("aria-expanded", "true");
    chatToggleIcon.textContent = "✕";

    if (chatBody.children.length === 0) {
        tampilkanPesan(
            "Halo! Saya asisten pendaftaran ekstrakurikuler. Tanya saja soal pilihan ekskul atau cara mengisi formulir.",
            "bot"
        );
        buatQuickReplies();
    }

    chatInput.focus();
}

function tutupChat() {
    chatbot.classList.add("chat-hidden");
    chatToggle.setAttribute("aria-expanded", "false");
    chatToggleIcon.textContent = "💬";
}

chatToggle.addEventListener("click", function() {
    if (chatbot.classList.contains("chat-hidden")) {
        bukaChat();
    } else {
        tutupChat();
    }
});

chatClose.addEventListener("click", tutupChat);

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const pesan = chatInput.value.trim();
    if (pesan === "") return;

    tampilkanPesan(pesan, "user");
    chatInput.value = "";
    balasBot(pesan);
});

// Tutup chat dengan tombol Escape
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && !chatbot.classList.contains("chat-hidden")) {
        tutupChat();
    }
});