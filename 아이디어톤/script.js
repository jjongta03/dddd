const STORAGE_KEY = "recallit.cards.v1";

const defaultCards = [
  {
    id: 1,
    title: "2026학년도 1학기 장학금 신청 안내",
    category: "학교",
    due: "2026-05-15",
    status: "진행중",
    progress: 0,
    summary: "신청 기간과 제출 서류가 포함된 학교 공지 캡처입니다.",
    tags: ["장학금", "신청", "서류"],
    reminder: {
      enabled: true,
      type: "deadline",
      baseDate: "due",
      daysBefore: 3,
      repeat: null,
      customDate: "",
      customTime: "09:00",
      label: "마감 3일 전 오전 9시에 리마인드 예정",
    },
    checklist: [
      { id: "scholarship-1", text: "신청서 작성", checked: true },
      { id: "scholarship-2", text: "성적 증명서 준비", checked: true },
      { id: "scholarship-3", text: "오늘 작성", checked: false },
      { id: "scholarship-4", text: "제출하기", checked: false },
    ],
    source: {
      type: "image",
      value: "",
    },
    visual: "linear-gradient(160deg, #2d8b72, #24394d 78%)",
  },
  {
    id: 2,
    title: "AI 아이디어톤 참가 신청 링크",
    category: "대외활동",
    due: "2026-05-17",
    status: "진행중",
    progress: 0,
    summary: "팀명, 신청서, 기획안 PDF를 준비해야 하는 참가 신청 링크입니다.",
    tags: ["공모전", "팀빌딩", "기획안"],
    reminder: {
      enabled: true,
      type: "deadline",
      baseDate: "due",
      daysBefore: 1,
      repeat: null,
      customDate: "",
      customTime: "18:00",
      label: "마감 하루 전 오후 6시에 리마인드 예정",
    },
    checklist: [
      { id: "ideathon-1", text: "팀명 정하기", checked: true },
      { id: "ideathon-2", text: "신청서 작성", checked: false },
      { id: "ideathon-3", text: "기획안 PDF 준비", checked: false },
    ],
    source: {
      type: "link",
      value: "",
    },
    visual: "linear-gradient(160deg, #386fd0, #4b355f 78%)",
  },
  {
    id: 3,
    title: "동아리 회의 및 회비 입금 메모",
    category: "개인 일정",
    due: "2026-05-20",
    status: "진행중",
    progress: 0,
    summary: "회의 시간, 회비 금액, 입금 계좌를 함께 저장한 메모입니다.",
    tags: ["회의", "회비", "입금"],
    reminder: {
      enabled: true,
      type: "deadline",
      baseDate: "due",
      daysBefore: 0,
      repeat: null,
      customDate: "",
      customTime: "08:00",
      label: "일정 당일 오전 8시에 리마인드 예정",
    },
    checklist: [
      { id: "club-1", text: "회의 시간 확인", checked: false },
      { id: "club-2", text: "회비 입금", checked: false },
      { id: "club-3", text: "안건 메모", checked: false },
    ],
    source: {
      type: "memo",
      value: "",
    },
    visual: "linear-gradient(160deg, #d9942f, #465f44 78%)",
  },
  {
    id: 4,
    title: "성수 근처 저장한 맛집 캡처",
    category: "기타",
    due: "2026-05-28",
    status: "진행중",
    progress: 0,
    summary: "성수 방문 일정이 있을 때 다시 꺼내보기 좋은 장소 캡처입니다.",
    tags: ["장소", "약속", "후보"],
    reminder: {
      enabled: false,
      type: "custom",
      baseDate: "due",
      daysBefore: 0,
      repeat: null,
      customDate: "",
      customTime: "",
      label: "알림이 꺼져 있습니다",
    },
    checklist: [
      { id: "seongsu-1", text: "장소 후보 확인", checked: false },
      { id: "seongsu-2", text: "동행자에게 공유", checked: false },
    ],
    source: {
      type: "image",
      value: "",
    },
    visual: "linear-gradient(160deg, #cb5b72, #33576f 78%)",
  },
];

const screenMap = {
  home: document.querySelector("#homeScreen"),
  detail: document.querySelector("#detailScreen"),
  original: document.querySelector("#originalScreen"),
  archive: document.querySelector("#archiveScreen"),
  reminder: document.querySelector("#reminderScreen"),
  deadline: document.querySelector("#deadlineScreen"),
  repeat: document.querySelector("#repeatScreen"),
  custom: document.querySelector("#customScreen"),
};

const cardList = document.querySelector("#cardList");
const tabButtons = document.querySelectorAll("#homeScreen .tab-button");
const archiveList = document.querySelector("#archiveList");
const archiveTabButtons = document.querySelectorAll(".archive-tab");
const checklistSheet = document.querySelector("#checklistSheet");
const sheetChecklist = document.querySelector("#sheetChecklist");
const addSheet = document.querySelector("#addSheet");
const openAddSheet = document.querySelector("#openAddSheet");
const cardForm = document.querySelector("#cardForm");
const addTitle = document.querySelector("#addTitle");
const permanentDeleteDialog = document.querySelector("#permanentDeleteDialog");
const cancelPermanentDelete = document.querySelector("#cancelPermanentDelete");
const confirmPermanentDelete = document.querySelector("#confirmPermanentDelete");

let cards = loadCards();
let selectedCard = cards[0];
let selectedFilter = "all";
let selectedArchiveFilter = "all";
let editingCardId = null;
let pendingPermanentDeleteId = null;

function loadCards() {
  try {
    const savedCards = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (Array.isArray(savedCards) && savedCards.length > 0) {
      return savedCards.map(normalizeCard);
    }
  } catch (error) {
    console.warn("저장된 카드 데이터를 불러오지 못했습니다.", error);
  }

  return defaultCards.map(normalizeCard);
}

function saveCards() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

function normalizeCard(card) {
  const checklist = Array.isArray(card.checklist)
    ? card.checklist.map((item, index) => ({
        id: item.id || `${card.id}-todo-${index + 1}`,
        text: item.text || String(item),
        checked: Boolean(item.checked),
      }))
    : [];

  const normalized = {
    id: card.id,
    title: card.title || "제목 없는 정보",
    category: card.category || "기타",
    due: toInputDate(card.due) || "",
    status: card.status || "진행중",
    progress: Number(card.progress) || 0,
    summary: card.summary || "",
    tags: Array.isArray(card.tags) ? card.tags : [],
    reminder:
      typeof card.reminder === "object"
        ? card.reminder
        : {
            enabled: true,
            type: "deadline",
            baseDate: "due",
            daysBefore: 1,
            repeat: null,
            customDate: "",
            customTime: "09:00",
            label: card.reminder || "마감 전에 리마인드 예정",
          },
    checklist,
    source: card.source || {
      type: "memo",
      value: "",
    },
    visual: card.visual || "linear-gradient(160deg, #2d8b72, #24394d 78%)",
    archiveType: card.archiveType || "",
    archivedAt: card.archivedAt || "",
    previousStatus: card.previousStatus || "",
    restoredAt: card.restoredAt || "",
  };

  return syncCardProgress(normalized);
}

function syncCardProgress(card) {
  const total = card.checklist.length;
  const checked = card.checklist.filter((item) => item.checked).length;

  card.progress = total === 0 ? 0 : Math.round((checked / total) * 100);
  card.status = total > 0 && checked === total && !card.restoredAt ? "완료" : "진행중";

  return card;
}

function getTodayInput() {
  return new Date().toISOString().slice(0, 10);
}

function getArchiveType(card) {
  if (card.archiveType) return card.archiveType;
  if (card.restoredAt) return "";
  if (card.status === "완료") return "completed";
  if (card.due && card.due < getTodayInput()) return "overdue";
  return "";
}

function getArchiveLabel(type) {
  return {
    deleted: "삭제됨",
    overdue: "마감 지남",
    completed: "완료됨",
  }[type] || "보관됨";
}

function getArchivedCards() {
  return cards
    .filter((card) => getArchiveType(card))
    .map((card) => ({
      ...card,
      archiveType: getArchiveType(card),
      archivedAt: card.archivedAt || card.due || getTodayInput(),
    }));
}

function getActiveCards() {
  return cards.filter((card) => !getArchiveType(card));
}

function toInputDate(value) {
  if (!value) return "";
  return String(value).replaceAll(".", "-").slice(0, 10);
}

function formatDate(value) {
  return value ? value.replaceAll("-", ".") : "마감일 미정";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showScreen(name) {
  Object.values(screenMap).forEach((screen) => screen.classList.remove("active"));
  screenMap[name].classList.add("active");
  screenMap[name].scrollTop = 0;
  openAddSheet.classList.toggle("is-hidden", name !== "home");

  if (name === "archive") {
    renderArchiveCards();
  }
}

function renderCards() {
  const activeCards = getActiveCards();
  const filteredCards =
    selectedFilter === "all"
      ? activeCards
      : activeCards.filter((card) => card.category === selectedFilter);

  cardList.innerHTML = filteredCards.length
    ? filteredCards
        .map(
          (card) => `
            <article class="info-card" data-card-id="${card.id}">
              <div class="card-top">
                <div class="card-main">
                  <span class="pill">${escapeHtml(card.category)}</span>
                  <button class="card-open" type="button">
                    <span class="card-title">${escapeHtml(card.title)}</span>
                    <span class="card-meta">마감일 ${formatDate(card.due)}</span>
                  </button>
                </div>
                <button class="more-button" data-more-id="${card.id}" type="button" aria-label="체크리스트 열기">✓</button>
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
        .join("")
    : `<p class="empty-text">이 카테고리에 저장된 카드가 없습니다.</p>`;
}

function renderArchiveCards() {
  const archivedCards = getArchivedCards();
  const filteredCards =
    selectedArchiveFilter === "all"
      ? archivedCards
      : archivedCards.filter((card) => card.archiveType === selectedArchiveFilter);

  archiveList.innerHTML = filteredCards.length
    ? filteredCards
        .map((card) => {
          const archiveLabel = getArchiveLabel(card.archiveType);

          return `
            <article class="info-card archive-card" data-archive-card-id="${card.id}">
              <div class="card-main">
                <span class="status-pill ${card.archiveType}">${archiveLabel}</span>
                <span class="card-title">${escapeHtml(card.title)}</span>
              </div>
              <div class="archive-detail-grid">
                <div class="archive-detail-row">
                  <span>카테고리</span>
                  <strong>${escapeHtml(card.category)}</strong>
                </div>
                <div class="archive-detail-row">
                  <span>기존 마감일</span>
                  <strong>${formatDate(card.due)}</strong>
                </div>
              </div>
              <p class="archive-summary">${escapeHtml(card.summary)}</p>
              <div class="archive-detail-row">
                <span>처리 날짜</span>
                <strong>${formatDate(card.archivedAt)}</strong>
              </div>
              <div class="archive-actions">
                <button class="restore-button" data-restore-id="${card.id}" type="button">복구</button>
                <button class="permanent-delete-button" data-permanent-delete-id="${card.id}" type="button">영구 삭제</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `
      <div class="archive-empty">
        <strong>보관된 항목이 없어요.</strong>
        <span>삭제되거나 완료된 일정이 생기면 이곳에 표시됩니다.</span>
      </div>
    `;
}

function updateDetail(card) {
  selectedCard = card;
  document.querySelector("#detailCategory").textContent = card.category;
  document.querySelector("#detailTitle").textContent = card.title;
  document.querySelector("#detailSummary").textContent = card.summary;
  document.querySelector("#detailDue").textContent = formatDate(card.due);
  document.querySelector("#detailProgressLabel").textContent = `${card.progress}%`;
  document.querySelector("#detailProgressBar").style.width = `${card.progress}%`;
  document.querySelector("#detailReminder").textContent =
    card.reminder?.label || "마감 전에 리마인드 예정";
  document.querySelector("#detailTags").innerHTML = card.tags
    .map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`)
    .join("");

  renderChecklist(document.querySelector("#detailChecklist"), card, "detail");
  updateChecklistCount(card);

  document.querySelector("#sourceCategory").textContent = card.category;
  document.querySelector("#sourceTitle").textContent = card.title;
  document.querySelector("#sourceSummary").textContent = card.summary;
  document.querySelector("#sourceDue").textContent = `마감일 ${formatDate(card.due)}`;
  document.querySelector("#sourceImage").style.background = `
    linear-gradient(145deg, rgba(255, 255, 255, 0.28), transparent 34%),
    ${card.visual}
  `;
  document.querySelector("#deadlineBase").textContent = formatDate(card.due);
}

function updateChecklistCount(card) {
  const total = card.checklist.length;
  const checked = card.checklist.filter((item) => item.checked).length;
  document.querySelector("#detailChecklistCount").textContent = `${checked}/${total}`;
}

function renderChecklist(target, card, origin) {
  target.innerHTML = card.checklist.length
    ? card.checklist
        .map(
          (item) => `
            <li>
              <label class="check-item">
                <input
                  type="checkbox"
                  data-check-card="${card.id}"
                  data-check-id="${item.id}"
                  data-check-origin="${origin}"
                  ${item.checked ? "checked" : ""}
                />
                <span>${escapeHtml(item.text)}</span>
              </label>
            </li>
          `,
        )
        .join("")
    : `<li class="empty-checklist">아직 체크리스트가 없습니다.</li>`;
}

function openChecklist(card) {
  selectedCard = card;
  renderChecklist(sheetChecklist, card, "sheet");
  openSheet(checklistSheet);
}

function toggleChecklistItem(cardId, itemId, checked) {
  const card = cards.find((item) => item.id === Number(cardId));
  const checklistItem = card?.checklist.find((item) => item.id === itemId);

  if (!card || !checklistItem) return;

  checklistItem.checked = checked;
  syncCardProgress(card);
  selectedCard = card;
  saveCards();
  renderCards();
  renderArchiveCards();
  updateDetail(card);

  if (checklistSheet.classList.contains("open")) {
    renderChecklist(sheetChecklist, card, "sheet");
  }
}

function openSheet(sheet) {
  sheet.classList.add("open");
  sheet.setAttribute("aria-hidden", "false");
}

function closeSheet(sheet) {
  sheet.classList.remove("open");
  sheet.setAttribute("aria-hidden", "true");
}

function openPermanentDeleteDialog(cardId) {
  pendingPermanentDeleteId = cardId;
  permanentDeleteDialog.classList.add("open");
  permanentDeleteDialog.setAttribute("aria-hidden", "false");
}

function closePermanentDeleteDialog() {
  pendingPermanentDeleteId = null;
  permanentDeleteDialog.classList.remove("open");
  permanentDeleteDialog.setAttribute("aria-hidden", "true");
}

function resetCardForm() {
  editingCardId = null;
  addTitle.textContent = "새 정보 추가";
  cardForm.reset();
  document.querySelector("#formDue").value = new Date().toISOString().slice(0, 10);
}

function fillCardForm(card) {
  editingCardId = card.id;
  addTitle.textContent = "내용 수정";
  document.querySelector("#formTitle").value = card.title;
  document.querySelector("#formCategory").value = card.category;
  document.querySelector("#formDue").value = card.due;
  document.querySelector("#formSummary").value = card.summary;
  document.querySelector("#formTags").value = card.tags.join(", ");
  document.querySelector("#formChecklist").value = card.checklist.map((item) => item.text).join("\n");
  openSheet(addSheet);
}

function getFormChecklist(existingCard) {
  const previousByText = new Map(
    (existingCard?.checklist || []).map((item) => [item.text.trim(), item]),
  );

  return document
    .querySelector("#formChecklist")
    .value.split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((text, index) => {
      const previous = previousByText.get(text);

      return {
        id: previous?.id || `${Date.now()}-${index}`,
        text,
        checked: previous?.checked || false,
      };
    });
}

cardList.addEventListener("click", (event) => {
  const cardButton = event.target.closest("[data-card-id]");
  const moreButton = event.target.closest("[data-more-id]");

  if (moreButton) {
    event.stopPropagation();
    const card = cards.find((item) => item.id === Number(moreButton.dataset.moreId));
    openChecklist(card);
    return;
  }

  if (cardButton) {
    const card = cards.find((item) => item.id === Number(cardButton.dataset.cardId));
    updateDetail(card);
    showScreen("detail");
  }
});

document.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-check-id]");

  if (checkbox) {
    toggleChecklistItem(
      checkbox.dataset.checkCard,
      checkbox.dataset.checkId,
      checkbox.checked,
    );
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
document.querySelector("#openEditSheet").addEventListener("click", () => fillCardForm(selectedCard));

document.querySelector("#deleteCard").addEventListener("click", () => {
  if (!selectedCard || !confirm("이 카드를 보관함으로 이동할까요?")) return;

  cards = cards.map((card) =>
    card.id === selectedCard.id
      ? {
          ...card,
          archiveType: "deleted",
          archivedAt: getTodayInput(),
          previousStatus: card.status,
        }
      : card,
  );
  selectedCard = getActiveCards()[0] || null;
  saveCards();
  renderCards();
  renderArchiveCards();

  if (selectedCard) {
    updateDetail(selectedCard);
  }

  showScreen("home");
});

openAddSheet.addEventListener("click", () => {
  resetCardForm();
  openSheet(addSheet);
});

cardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const existingCard = cards.find((card) => card.id === editingCardId);
  const cardData = {
    id: existingCard?.id || Date.now(),
    title: document.querySelector("#formTitle").value.trim(),
    category: document.querySelector("#formCategory").value,
    due: document.querySelector("#formDue").value,
    status: existingCard?.status || "진행중",
    progress: existingCard?.progress || 0,
    summary: document.querySelector("#formSummary").value.trim(),
    tags: document
      .querySelector("#formTags")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    reminder: existingCard?.reminder || {
      enabled: false,
      type: "deadline",
      baseDate: "due",
      daysBefore: 1,
      repeat: null,
      customDate: "",
      customTime: "09:00",
      label: "알림이 꺼져 있습니다",
    },
    checklist: getFormChecklist(existingCard),
    source: existingCard?.source || {
      type: "memo",
      value: "",
    },
    visual:
      existingCard?.visual ||
      "linear-gradient(160deg, #2d8b72, #24394d 78%)",
    archiveType: existingCard?.archiveType || "",
    archivedAt: existingCard?.archivedAt || "",
    previousStatus: existingCard?.previousStatus || "",
    restoredAt: existingCard?.restoredAt || "",
  };

  const nextCard = syncCardProgress(cardData);

  if (existingCard) {
    cards = cards.map((card) => (card.id === editingCardId ? nextCard : card));
  } else {
    cards = [nextCard, ...cards];
  }

  selectedCard = nextCard;
  saveCards();
  renderCards();
  renderArchiveCards();
  updateDetail(nextCard);
  closeSheet(addSheet);
  showScreen("detail");
});

archiveTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedArchiveFilter = button.dataset.archiveFilter;
    archiveTabButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderArchiveCards();
  });
});

archiveList.addEventListener("click", (event) => {
  const restoreButton = event.target.closest("[data-restore-id]");
  const permanentDeleteButton = event.target.closest("[data-permanent-delete-id]");

  if (restoreButton) {
    const restoreId = Number(restoreButton.dataset.restoreId);

    cards = cards.map((card) =>
      card.id === restoreId
      ? {
          ...card,
          archiveType: "",
          archivedAt: "",
          status: card.previousStatus || "진행중",
          previousStatus: "",
          restoredAt: getTodayInput(),
        }
      : card,
  );
    saveCards();
    renderCards();
    renderArchiveCards();
    return;
  }

  if (permanentDeleteButton) {
    const deleteId = Number(permanentDeleteButton.dataset.permanentDeleteId);
    openPermanentDeleteDialog(deleteId);
  }
});

cancelPermanentDelete.addEventListener("click", closePermanentDeleteDialog);

confirmPermanentDelete.addEventListener("click", () => {
  if (!pendingPermanentDeleteId) return;

  cards = cards.filter((card) => card.id !== pendingPermanentDeleteId);
  selectedCard = getActiveCards()[0] || null;
  saveCards();
  renderCards();
  renderArchiveCards();
  closePermanentDeleteDialog();
});

permanentDeleteDialog.addEventListener("click", (event) => {
  if (event.target === permanentDeleteDialog) {
    closePermanentDeleteDialog();
  }
});

document.querySelectorAll(".sheet-backdrop").forEach((sheet) => {
  sheet.addEventListener("click", (event) => {
    if (event.target === sheet || event.target.closest(".close-sheet")) {
      closeSheet(sheet);
    }
  });
});

cards = cards.map(syncCardProgress);
selectedCard = getActiveCards()[0] || cards[0] || null;
saveCards();
renderCards();
renderArchiveCards();

if (selectedCard) {
  updateDetail(selectedCard);
}
