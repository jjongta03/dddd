const cards = [
  {
    id: 1,
    title: "2026학년도 1학기 장학금 신청 안내",
    category: "학교",
    due: "2026.05.15",
    status: "진행중",
    progress: 60,
    summary: "신청 기간과 제출 서류가 포함된 학교 공지 캡처입니다.",
    tags: ["장학금", "신청", "서류"],
    reminder: "마감 3일 전 오전 9시에 리마인드 예정",
    visual: "linear-gradient(160deg, #2d8b72, #24394d 78%)",
  },
  {
    id: 2,
    title: "AI 아이디어톤 참가 신청 링크",
    category: "대외활동",
    due: "2026.05.17",
    status: "D-5",
    progress: 35,
    summary: "팀명, 신청서, 기획안 PDF를 준비해야 하는 참가 신청 링크입니다.",
    tags: ["공모전", "팀빌딩", "기획안"],
    reminder: "마감 하루 전 오후 6시에 리마인드 예정",
    visual: "linear-gradient(160deg, #386fd0, #4b355f 78%)",
  },
  {
    id: 3,
    title: "동아리 회의 및 회비 입금 메모",
    category: "개인 일정",
    due: "2026.05.20",
    status: "확인 필요",
    progress: 20,
    summary: "회의 시간, 회비 금액, 입금 계좌를 함께 저장한 메모입니다.",
    tags: ["회의", "회비", "입금"],
    reminder: "일정 당일 오전 8시에 리마인드 예정",
    visual: "linear-gradient(160deg, #d9942f, #465f44 78%)",
  },
  {
    id: 4,
    title: "성수 근처 저장한 맛집 캡처",
    category: "기타",
    due: "2026.05.28",
    status: "보관중",
    progress: 10,
    summary: "성수 방문 일정이 있을 때 다시 꺼내보기 좋은 장소 캡처입니다.",
    tags: ["장소", "약속", "후보"],
    reminder: "성수 일정 등록 시 당일 오전에 리마인드 예정",
    visual: "linear-gradient(160deg, #cb5b72, #33576f 78%)",
  },
];

const screenMap = {
  home: document.querySelector("#homeScreen"),
  detail: document.querySelector("#detailScreen"),
  original: document.querySelector("#originalScreen"),
  reminder: document.querySelector("#reminderScreen"),
  deadline: document.querySelector("#deadlineScreen"),
  repeat: document.querySelector("#repeatScreen"),
  custom: document.querySelector("#customScreen"),
};

const cardList = document.querySelector("#cardList");
const tabButtons = document.querySelectorAll(".tab-button");
const checklistSheet = document.querySelector("#checklistSheet");
const addSheet = document.querySelector("#addSheet");
const openAddSheet = document.querySelector("#openAddSheet");

let selectedCard = cards[0];
let selectedFilter = "all";

function showScreen(name) {
  Object.values(screenMap).forEach((screen) => screen.classList.remove("active"));
  screenMap[name].classList.add("active");
  screenMap[name].scrollTop = 0;
}

function renderCards() {
  const filteredCards =
    selectedFilter === "all"
      ? cards
      : cards.filter((card) => card.category === selectedFilter);

  cardList.innerHTML = filteredCards
    .map(
      (card) => `
        <article class="info-card" data-card-id="${card.id}">
          <div class="card-top">
            <div class="card-main">
              <span class="pill">${card.category}</span>
              <button class="card-open" type="button">
                <span class="card-title">${card.title}</span>
                <span class="card-meta">마감일 ${card.due}</span>
              </button>
            </div>
            <button class="more-button" data-more-id="${card.id}" type="button" aria-label="더보기">⋯</button>
          </div>
          <div class="card-footer">
            <div class="mini-progress" aria-label="진행률 ${card.progress}%">
              <span style="width: ${card.progress}%"></span>
            </div>
            <span class="status-pill">${card.status}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function updateDetail(card) {
  selectedCard = card;
  document.querySelector("#detailCategory").textContent = card.category;
  document.querySelector("#detailTitle").textContent = card.title;
  document.querySelector("#detailSummary").textContent = card.summary;
  document.querySelector("#detailDue").textContent = card.due;
  document.querySelector("#detailProgressLabel").textContent = `${card.progress}%`;
  document.querySelector("#detailProgressBar").style.width = `${card.progress}%`;
  document.querySelector("#detailReminder").textContent = card.reminder;
  document.querySelector("#detailTags").innerHTML = card.tags
    .map((tag) => `<span class="tag">#${tag}</span>`)
    .join("");

  document.querySelector("#sourceCategory").textContent = card.category;
  document.querySelector("#sourceTitle").textContent = card.title;
  document.querySelector("#sourceSummary").textContent = card.summary;
  document.querySelector("#sourceDue").textContent = `마감일 ${card.due}`;
  document.querySelector("#sourceImage").style.background = `
    linear-gradient(145deg, rgba(255, 255, 255, 0.28), transparent 34%),
    ${card.visual}
  `;
  document.querySelector("#deadlineBase").textContent = card.due;
}

function openSheet(sheet) {
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
}

function closeSheet(sheet) {
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
}

cardList.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-card-id]");
  const moreButton = event.target.closest("[data-more-id]");

  if (moreButton) {
    event.stopPropagation();
    selectedCard = cards.find((card) => card.id === Number(moreButton.dataset.moreId));
    openSheet(checklistSheet);
    return;
  }

  if (cardButton) {
    const card = cards.find((item) => item.id === Number(cardButton.dataset.cardId));
    updateDetail(card);
    showScreen("detail");
  }
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedFilter = button.dataset.filter;
    tabButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCards();
  });
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.go));
});

document.querySelector("#openReminder").addEventListener("click", () => showScreen("reminder"));
document.querySelector("#openOriginal").addEventListener("click", () => showScreen("original"));

openAddSheet.addEventListener("click", () => openSheet(addSheet));

document.querySelectorAll(".sheet-backdrop").forEach((sheet) => {
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet || event.target.closest(".close-sheet")) {
      closeSheet(sheet);
    }
  });
});

renderCards();
updateDetail(selectedCard);
