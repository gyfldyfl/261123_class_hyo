// ===== 예식 날짜 설정 =====
const WEDDING_DATE = new Date(2027, 3, 17, 12, 30); // 월은 0부터 시작 (3 = 4월)

// ===== 달력 그리기 =====
function renderCalendar() {
  const cal = document.getElementById('calendar');
  const year = WEDDING_DATE.getFullYear();
  const month = WEDDING_DATE.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const dows = ['일', '월', '화', '수', '목', '금', '토'];

  let html = dows
    .map((d, i) => `<div class="dow ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}">${d}</div>`)
    .join('');

  for (let i = 0; i < firstDay; i++) html += '<div></div>';

  for (let d = 1; d <= lastDate; d++) {
    const dow = (firstDay + d - 1) % 7;
    const cls = ['day'];
    if (dow === 0) cls.push('sun');
    if (dow === 6) cls.push('sat');
    if (d === WEDDING_DATE.getDate()) cls.push('wedding');
    html += `<div><span class="${cls.join(' ')}">${d}</span></div>`;
  }

  cal.innerHTML = html;
}

// ===== D-Day 계산 =====
function renderDday() {
  const el = document.getElementById('dday');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(WEDDING_DATE);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));

  if (diff > 0) el.innerHTML = `도윤 ♥ 서연의 결혼식이 <em>${diff}일</em> 남았습니다`;
  else if (diff === 0) el.innerHTML = `오늘은 도윤 ♥ 서연의 <em>결혼식 날</em>입니다`;
  else el.innerHTML = `도윤 ♥ 서연이 함께한 지 <em>${-diff}일</em> 되었습니다`;
}

// ===== 스크롤 등장 효과 =====
function initFadeIn() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade').forEach((el) => io.observe(el));
}

// ===== 갤러리 라이트박스 =====
function initGallery() {
  const items = [...document.querySelectorAll('.gallery__item')];
  const box = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  let current = 0;

  const show = (i) => {
    current = (i + items.length) % items.length;
    img.style.background = getComputedStyle(items[current]).backgroundImage;
    img.style.backgroundSize = 'cover';
    img.style.backgroundPosition = 'center';
  };
  const open = (i) => { show(i); box.hidden = false; document.body.style.overflow = 'hidden'; };
  const close = () => { box.hidden = true; document.body.style.overflow = ''; };

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
  box.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });

  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

// ===== 계좌 아코디언 =====
function initAccounts() {
  document.querySelectorAll('.account__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const open = btn.parentElement.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  });
}

// ===== 복사 / 공유 =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2000);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 파일로 직접 열었을 때 등 clipboard API를 못 쓰는 경우 대비
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function initCopy() {
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await copyText(btn.dataset.copy);
      showToast('복사되었습니다');
    });
  });

  document.getElementById('shareBtn').addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: location.href }); } catch {}
    } else {
      await copyText(location.href);
      showToast('링크가 복사되었습니다');
    }
  });
}

// ===== 실행 =====
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar();
  renderDday();
  initFadeIn();
  initGallery();
  initAccounts();
  initCopy();
});
