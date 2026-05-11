const cards = [
  {
    id: 1,
    type: "school",
    icon: "학",
    title: "2026학년도 1학기 장학금 신청 안내",
    category: "학교",
    tags: ["장학금", "신청", "서류"],
    due: "5월 15일",
    dueLabel: "D-4",
    place: "학생지원팀",
    reminder: "마감 3일 전",
    summary: "신청 기간과 제출 서류가 포함된 학교 공지 캡처입니다.",
    tasks: ["신청서 작성", "성적증명서 준비", "5월 15일까지 제출"],
    privacy: "학번 후보가 감지되어 목록에서는 일부 마스킹돼요.",
    visual: "linear-gradient(160deg, #2f8f72, #203d55 75%)",
  },
  {
    id: 2,
    type: "support",
    icon: "공",
    title: "AI 아이디어톤 참가 신청 링크",
    category: "지원",
    tags: ["공모전", "대외활동", "마감"],
    due: "5월 17일",
    dueLabel: "이번 주",
    place: "온라인 접수",
    reminder: "마감 하루 전",
    summary: "팀명, 신청서, 기획안 PDF를 준비해야 하는 참가 신청 링크입니다.",
    tasks: ["팀원 정보 확인", "기획안 PDF 첨부", "온라인 신청서 제출"],
    privacy: "전화번호 후보가 감지되어 알림에는 표시하지 않아요.",
    visual: "linear-gradient(160deg, #2f6fd6, #4c315f 78%)",
  },
  {
    id: 3,
    type: "money",
    icon: "정",
    title: "동아리 회비 입금 계좌 메모",
    category: "정산",
    tags: ["계좌", "회비", "입금"],
    due: "5월 20일",
    dueLabel: "D-9",
    place: "카카오뱅크",
    reminder: "마감 2일 전",
    summary: "회비 금액과 입금 계좌가 적힌 메모입니다.",
    tasks: ["회비 30,000원 입금", "입금자명 확인", "완료 후 단톡방에 공유"],
    privacy: "계좌번호가 감지되어 기본 화면에는 3333-**-****로 표시돼요.",
    visual: "linear-gradient(160deg, #d58b27, #51633d 78%)",
  },
  {
    id: 4,
    type: "place",
    icon: "맛",
    title: "성수 근처 저장한 맛집 캡처",
    category: "장소",
    tags: ["맛집", "성수", "약속"],
    due: "일정 근처",
    dueLabel: "상황 알림",
    place: "서울 성동구 성수동",
    reminder: "성수 일정 당일 오전",
    summary: "성수 방문 일정이 있을 때 다시 꺼내보기 좋은 맛집 캡처입니다.",
    tasks: ["예약 가능 여부 확인", "약속 장소와 거리 확인", "후보로 공유"],
    privacy: "감지된 민감 정보 없음",
    visual: "linear-gradient(160deg, #c65367, #33576f 78%)",
  },
];

const cardList = document.querySelector("#cardList");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-chip");
const uploader = document.querySelector("#uploader");
const openUploader = document.querySelector("#openUploader");
const closeUploader = document.querySelector("#closeUploader");

let selectedId = cards[0].id;
let selectedFilter = "all";

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredCards = cards.filter((card) => {
    const text = [card.title, card.category, card.tags.join(" "), card.summary, card.place]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesFilter = selectedFilter === "all" || card.category === selectedFilter;
    return matchesQuery && matchesFilter;
  });

  cardList.innerHTML = "";

  if (filteredCards.length === 0) {
    cardList.innerHTML = '<p class="empty-state">검색 결과가 없어요. 다른 표현으로 찾아보세요.</p>';
    return;
  }

  filteredCards.forEach((card) => {
    const button = document.createElement("button");
    button.className = `info-card ${card.id === selectedId ? "active" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <div class="thumb ${card.type}">${card.icon}</div>
      <div class="card-body">
        <span class="card-title">${card.title}</span>
        <div class="card-meta">
          <span>${card.category}</span>
          <span>${card.due}</span>
          <span>${card.place}</span>
        </div>
        <div class="tag-row">
          ${card.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="due-badge">${card.dueLabel}</div>
    `;
    button.addEventListener("click", () => selectCard(card.id));
    cardList.appendChild(button);
  });
}

function selectCard(id) {
  selectedId = id;
  const card = cards.find((item) => item.id === id);

  document.querySelector("#detailCategory").textContent = card.category;
  document.querySelector("#detailTitle").textContent = card.title;
  document.querySelector("#detailSummary").textContent = card.summary;
  document.querySelector("#detailDue").textContent = card.due;
  document.querySelector("#detailPlace").textContent = card.place;
  document.querySelector("#detailReminder").textContent = card.reminder;
  document.querySelector("#detailPrivacy").textContent = card.privacy;
  document.querySelector("#detailVisual").style.background = `
    linear-gradient(145deg, rgba(255, 255, 255, 0.26), transparent 36%),
    ${card.visual}
  `;
  document.querySelector("#detailTasks").innerHTML = card.tasks
    .map((task) => `<li>${task}</li>`)
    .join("");

  renderCards();
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCards();
  });
});

searchInput.addEventListener("input", renderCards);

openUploader.addEventListener("click", () => {
  uploader.classList.add("open");
  uploader.setAttribute("aria-hidden", "false");
});

closeUploader.addEventListener("click", () => {
  uploader.classList.remove("open");
  uploader.setAttribute("aria-hidden", "true");
});

uploader.addEventListener("click", (event) => {
  if (event.target === uploader) {
    uploader.classList.remove("open");
    uploader.setAttribute("aria-hidden", "true");
  }
});

selectCard(selectedId);
