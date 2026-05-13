const weekDays = [
  { day: "수", date: "13", today: true },
  { day: "목", date: "14" },
  { day: "금", date: "15" },
  { day: "토", date: "16" },
  { day: "일", date: "17" },
  { day: "월", date: "18" },
  { day: "화", date: "19" },
];

const todayTasks = [
  {
    title: "AI 연구실 학부연구생 모집 공지 확인",
    meta: "추천도 높음 · 컴퓨터공학과",
    badge: "필독",
  },
  {
    title: "2026-1 성적우수 장학금 제출 서류",
    meta: "마감 2일 전 · 장학",
    badge: "서류",
  },
  {
    title: "하계 현장실습 사전 설명회",
    meta: "오늘 17:00 · 취업지원",
    badge: "오늘",
  },
];

const deadlines = [
  {
    title: "학부연구생 지원서 제출",
    meta: "AI·임베디드 연구실",
    badge: "D-1",
  },
  {
    title: "교내 SW 아이디어톤 신청",
    meta: "팀 정보 및 기획서 업로드",
    badge: "D-3",
  },
  {
    title: "국가근로 장학생 희망근로지 신청",
    meta: "한국장학재단 연계",
    badge: "D-5",
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

const notices = [
  {
    mark: "학과",
    title: "컴퓨터공학과 졸업작품 중간 점검 안내",
    meta: "대상: 3, 4학년 · 학과사무실",
    date: "5.13",
  },
  {
    mark: "장학",
    title: "2026학년도 1학기 교내 장학금 추가 신청",
    meta: "성적증명서, 신청서 제출 필요",
    date: "5.12",
  },
  {
    mark: "비교과",
    title: "AI 포트폴리오 작성 특강 모집",
    meta: "온라인 특강 · 선착순 40명",
    date: "5.11",
  },
  {
    mark: "취업",
    title: "하계 인턴십 추천 채용 공고",
    meta: "SW 개발, 데이터 분석 직무",
    date: "5.10",
  },
];

function renderWeekCalendar() {
  const calendar = document.querySelector("#weekCalendar");

  calendar.innerHTML = weekDays
    .map(
      (item) => `
        <div class="day-chip ${item.today ? "is-today" : ""}">
          <small>${item.day}</small>
          <strong>${item.date}</strong>
        </div>
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
          <div>
            <strong>${item.title}</strong>
            <p>${item.meta}</p>
          </div>
          <span class="badge">${item.badge}</span>
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

function renderNotices() {
  const target = document.querySelector("#noticeList");

  target.innerHTML = notices
    .map(
      (item) => `
        <article class="notice-row">
          <span class="notice-mark">${item.mark}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.meta}</p>
          </div>
          <span class="notice-date">${item.date}</span>
        </article>
      `,
    )
    .join("");
}

renderWeekCalendar();
renderRows("#todayList", todayTasks, "task-row");
renderRows("#deadlineList", deadlines, "deadline-row");
renderRecommendations();
renderNotices();
