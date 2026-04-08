// ─── Mobile Menu ────────────────────────────────────────────────
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.add('open');
});
document.getElementById('closeMenu').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.remove('open');
});
function closeMobile() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── Set min date to today ───────────────────────────────────────
const dateInput = document.getElementById('f-date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;
dateInput.value = today;

// ─── Time Slots ──────────────────────────────────────────────────
const times = [
  '06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'
];
const unavailable = ['09:00', '14:00', '18:00'];
let selectedTime = '';

function renderSlots() {
  const container = document.getElementById('time-slots');
  container.innerHTML = '';
  times.forEach(t => {
    const div = document.createElement('div');
    div.className = 'time-slot'
      + (unavailable.includes(t) ? ' unavailable' : '')
      + (selectedTime === t ? ' selected' : '');
    div.textContent = t;
    if (!unavailable.includes(t)) {
      div.addEventListener('click', () => {
        selectedTime = t;
        renderSlots();
        updateSummary();
      });
    }
    container.appendChild(div);
  });
}
renderSlots();

// ─── Select Sport from Card ──────────────────────────────────────
function selectSport(sport) {
  const sel = document.getElementById('f-sport');
  sel.value = sport;
  updateSummary();
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}

// ─── Prices & Labels ─────────────────────────────────────────────
const prices = {
  minisoccer: 300000,
  padel:      200000,
  badminton:  100000
};
const sportNames = {
  minisoccer: '⚽ Mini Soccer',
  padel:      '🎾 Padel',
  badminton:  '🏸 Badminton'
};

// ─── Update Booking Summary ──────────────────────────────────────
function updateSummary() {
  const sport = document.getElementById('f-sport').value;
  const date  = document.getElementById('f-date').value;
  const court = document.getElementById('f-court').value;
  const dur   = parseInt(document.getElementById('f-duration').value) || 1;

  document.getElementById('s-sport').textContent = sport ? sportNames[sport] : '—';
  document.getElementById('s-court').textContent = court ? 'Lapangan ' + court : '—';
  document.getElementById('s-time').textContent  = selectedTime || '—';
  document.getElementById('s-dur').textContent   = dur + ' Jam';

  if (date) {
    const d      = new Date(date);
    const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
    document.getElementById('s-date').textContent =
      days[d.getDay()] + ', ' + d.getDate() + ' ' + months[d.getMonth()];
  }

  if (sport && prices[sport]) {
    const p     = prices[sport];
    const total = p * dur;
    document.getElementById('s-price').textContent = 'Rp ' + p.toLocaleString('id-ID');
    document.getElementById('s-total').textContent = 'Rp ' + total.toLocaleString('id-ID');
  } else {
    document.getElementById('s-price').textContent = '—';
    document.getElementById('s-total').textContent = '—';
  }
}
updateSummary();

// ─── Submit Booking ──────────────────────────────────────────────
function submitBooking() {
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const sport = document.getElementById('f-sport').value;
  const date  = document.getElementById('f-date').value;
  const court = document.getElementById('f-court').value;
  const dur   = document.getElementById('f-duration').value;

  if (!name || !phone || !sport || !date || !court || !selectedTime) {
    alert('Mohon lengkapi semua data pemesanan terlebih dahulu.');
    return;
  }

  const total = prices[sport] * parseInt(dur);
  document.getElementById('modal-text').textContent =
    `Hei ${name}! Booking ${sportNames[sport]} — Lapangan ${court} pada jam ${selectedTime} ` +
    `sudah dikonfirmasi. Total pembayaran: Rp ${total.toLocaleString('id-ID')}. ` +
    `Sampai ketemu di lapangan! 🏆`;
  document.getElementById('modal').classList.add('open');
}

// ─── Close Modal ─────────────────────────────────────────────────
function closeModal() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('f-name').value     = '';
  document.getElementById('f-phone').value    = '';
  document.getElementById('f-sport').value    = '';
  document.getElementById('f-court').value    = '';
  document.getElementById('f-duration').value = '1';
  selectedTime = '';
  renderSlots();
  updateSummary();
}

// ─── Scroll Reveal ───────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => obs.observe(el));

const slidePos = {
  minisoccer: 0,
  padel: 0,
  badminton: 0
};

function geserSlide(lapangan, arah) {
  const track = document.getElementById('track-' + lapangan);
  const totalSlides = track.children.length;
  
  slidePos[lapangan] += arah;
  
  // Jika slide sudah di ujung, kembali ke awal/akhir
  if (slidePos[lapangan] >= totalSlides) {
    slidePos[lapangan] = 0;
  }
  if (slidePos[lapangan] < 0) {
    slidePos[lapangan] = totalSlides - 1;
  }
  
  // Hitung persentase geser (100% per gambar)
  const nilaiGeser = -(slidePos[lapangan] * 100);
  track.style.transform = `translateX(${nilaiGeser}%)`;
}