// 모바일 ☰ 메뉴 열기/닫기 (이 사이트의 유일한 JavaScript)
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

// ☰ 버튼을 누르면 메뉴를 열거나 닫는다
toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  toggle.textContent = isOpen ? '✕' : '☰';
});

// 메뉴 닫기
function closeMenu() {
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '메뉴 열기');
  toggle.textContent = '☰';
}

// 메뉴 항목을 누르면 해당 섹션으로 이동하면서 메뉴를 닫는다
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// 키보드 Esc 키로도 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// 화면을 태블릿 이상으로 넓히면(예: 폰을 가로로 돌림) 열려 있던 모바일 메뉴 상태 초기화
window.matchMedia('(min-width: 768px)').addEventListener('change', closeMenu);
