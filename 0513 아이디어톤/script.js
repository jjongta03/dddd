const weekDays = [
  {
    day: "수",
    date: "13",
    today: true,
    bars: [{ label: "설명회", tone: "dark" }, { label: "공지", tone: "mid" }],
  },
  {
    day: "목",
    date: "14",
    bars: [{ label: "서류", tone: "mid" }],
  },
  {
    day: "금",
    date: "15",
    bars: [{ label: "장학", tone: "dark" }, { label: "상담", tone: "light" }],
  },
  {
    day: "토",
    date: "16",
    bars: [],
  },
  {
    day: "일",
    date: "17",
    bars: [{ label: "아이디어톤", tone: "mid" }],
  },
  {
    day: "월",
    date: "18",
    bars: [{ label: "인턴", tone: "light" }],
  },
  {
    day: "화",
    date: "19",
    bars: [{ label: "연구실", tone: "dark" }],
  },
];

const checklistItems = [
  {
    text: "지원 조건과 제출 서류 확인",
    done: false,
  },
  {
    text: "마감 일정 캘린더에 표시",
    done: true,
  },
  {
    text: "온라인 링크와 참석 방법 저장",
    done: false,
  },
];

const deadlines = [
  {
    title: "학부연구생 지원서 제출",
    meta: "AI·임베디드 연구실",
    badge: "D-1",
    desc: "자기소개서와 시간표 첨부가 필요합니다.",
  },
  {
    title: "교내 SW 아이디어톤 신청",
    meta: "팀 정보 및 기획서 업로드",
    badge: "D-3",
    desc: "팀원 정보와 1페이지 기획안을 준비하세요.",
  },
  {
    title: "국가근로 장학생 희망근로지 신청",
    meta: "한국장학재단 연계",
    badge: "D-5",
    desc: "희망근로지 선택 후 신청 상태를 확인하세요.",
  },
];

const recommendations = [
  {
    tag: "AI 추천",
    title: "생성형 AI 프로젝트 조교 모집",
    desc: "관심 분야 AI와 인턴 키워드가 함께 포함된 공지예요.",
  },
  {
    tag: "학부연구생",
    title: "임베디드 시스템 연구실 RA 선발",
    desc: "컴퓨터공학과 3학년 지원 가능 조건과 일치합니다.",
  },
  {
    tag: "취업",
    title: "반도체·SW 직무 멘토링",
    desc: "이번 주 신청 마감이며 비교과 포인트가 인정돼요.",
  },
];

const popularNotices = [
  {
    rank: "1",
    title: "하계 인턴십 추천 채용 공고",
    meta: "조회 급상승 · SW 개발, 데이터 분석",
  },
  {
    rank: "2",
    title: "2026학년도 1학기 교내 장학금 추가 신청",
    meta: "마감 임박 · 서류 제출 필요",
  },
  {
    rank: "3",
    title: "AI 포트폴리오 작성 특강 모집",
    meta: "선착순 40명 · 비교과 포인트 인정",
  },
];

function renderWeekCalendar() {
  const calendar = document.querySelector("#weekCalendar");

  calendar.innerHTML = weekDays
    .map(
      (item) => `
        <div class="day-chip ${item.today ? "is-today" : ""}">
          <div class="day-label">
            <small>${item.day}</small>
            <strong>${item.date}</strong>
          </div>
          <div class="schedule-bars">
            ${
              item.bars.length > 0
                ? item.bars
                    .map(
                      (bar) => `
                        <span class="schedule-bar is-${bar.tone}">
                          ${bar.label}
                        </span>
                      `,
                    )
                    .join("")
                : '<span class="schedule-empty">-</span>'
            }
          </div>
        </div>
      `,
    )
    .join("");
}

function renderChecklist() {
  const target = document.querySelector("#checklist");

  target.innerHTML = checklistItems
    .map(
      (item, index) => `
        <label class="check-row">
          <input type="checkbox" data-index="${index}" ${item.done ? "checked" : ""} />
          <span aria-hidden="true"></span>
          <input type="text" data-index="${index}" value="${item.text}" aria-label="체크리스트 항목" />
          <button class="delete-check-button" type="button" data-index="${index}" aria-label="체크리스트 항목 삭제"></button>
        </label>
      `,
    )
    .join("");
}

function renderRows(targetId, items, className) {
  const target = document.querySelector(targetId);

  target.innerHTML = items
    .map(
      (item) => `
        <article class="${className}">
          <span class="badge">${item.badge}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.meta}</p>
          </div>
          <em>${item.desc}</em>
        </article>
      `,
    )
    .join("");
}

function renderRecommendations() {
  const target = document.querySelector("#recommendList");

  target.innerHTML = recommendations
    .map(
      (item) => `
        <article class="recommend-card">
          <span class="tag">${item.tag}</span>
          <strong>${item.title}</strong>
          <p>${item.desc}</p>
        </article>
      `,
    )
    .join("");
}

function renderPopularNotices() {
  const target = document.querySelector("#popularList");

  target.innerHTML = popularNotices
    .map(
      (item) => `
        <article class="popular-card">
          <span class="rank">${item.rank}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.meta}</p>
          </div>
        </article>
      `,
    )
    .join("");
}

function bindChecklist() {
  const checklist = document.querySelector("#checklist");
  const addButton = document.querySelector("#addCheckButton");

  checklist.addEventListener("change", (event) => {
    if (event.target.type !== "checkbox") return;
    checklistItems[event.target.dataset.index].done = event.target.checked;
  });

  checklist.addEventListener("input", (event) => {
    if (event.target.type !== "text") return;
    checklistItems[event.target.dataset.index].text = event.target.value;
  });

  checklist.addEventListener("click", (event) => {
    if (!event.target.classList.contains("delete-check-button")) return;
    checklistItems.splice(event.target.dataset.index, 1);
    renderChecklist();
  });

  addButton.addEventListener("click", () => {
    checklistItems.push({ text: "새 체크리스트", done: false });
    renderChecklist();
    checklist.querySelector(".check-row:last-child input[type='text']").select();
  });
}

function bindSearch() {
  document.querySelector(".bottom-search").addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function bindMenu() {
  const menuButton = document.querySelector(".menu-button");
  const menuPanel = document.querySelector("#mainMenu");

  const setMenuOpen = (isOpen) => {
    menuButton.classList.toggle("is-open", isOpen);
    menuPanel.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    menuPanel.setAttribute("aria-hidden", String(!isOpen));
  };

  menuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    setMenuOpen(!menuPanel.classList.contains("is-open"));
  });

  menuPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
}

renderWeekCalendar();
renderChecklist();
renderRows("#deadlineList", deadlines, "deadline-row");
renderRecommendations();
renderPopularNotices();
bindChecklist();
bindMenu();
bindSearch();
