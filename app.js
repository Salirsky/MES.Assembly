
/* =========================================
   MES PRODUCTION — APPLICATION
   Screens 1, 2 and 3
========================================= */

(() => {
  "use strict";

  /* =======================================
     DOM HELPERS
  ======================================= */

  const get = (id) => document.getElementById(id);

  const loginScreen = get("loginScreen");
  const appContent = get("appContent");

  const readinessScreen = get("readinessScreen");
  const tasksScreen = get("tasksScreen");
  const taskScreen = get("taskScreen");

  let currentScreen = "readiness";
  let currentTaskId = "ЗД-24081";
  let toastTimer = null;

  function showToast(message) {
    const toast = get("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }


  /* =======================================
     DEMO AUTHENTICATION
  ======================================= */

  const loginForm = get("loginForm");
  const loginPassword = get("loginPassword");
  const loginError = get("loginError");
  const togglePassword = get("togglePassword");

  const DEMO_LOGIN = "s.ivanov";
  const DEMO_PASSWORD = "MES2026!";

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = get("loginUsername").value.trim();
    const password = loginPassword.value;

    if (username === DEMO_LOGIN && password === DEMO_PASSWORD) {
      loginError.textContent = "";
      loginScreen.hidden = true;
      appContent.hidden = false;

      showScreen("readiness");

      const heading = readinessScreen?.querySelector("h1");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus();

      return;
    }

    loginError.textContent = "Неверный логин или пароль.";
    loginPassword.focus();
  });

  togglePassword?.addEventListener("click", () => {
    const isPassword = loginPassword.type === "password";

    loginPassword.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Скрыть" : "Показать";
    togglePassword.setAttribute(
      "aria-label",
      isPassword ? "Скрыть пароль" : "Показать пароль"
    );
  });


  /* =======================================
     SCREEN NAVIGATION
  ======================================= */

  const screenTitles = {
    readiness: "Проверка готовности к работе | MES",
    tasks: "Список заданий | MES",
    task: "Страница задания | MES"
  };

  function showScreen(screenName) {
    currentScreen = screenName;

    if (readinessScreen) {
      readinessScreen.hidden = screenName !== "readiness";
    }

    if (tasksScreen) {
      tasksScreen.hidden = screenName !== "tasks";
    }

    if (taskScreen) {
      taskScreen.hidden = screenName !== "task";
    }

    document.title = screenTitles[screenName] || "MES Production";

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }


  /* =======================================
     SCREEN 1 — READINESS CHECK
  ======================================= */

  const groupNames = ["tools", "equipment", "materials", "esd"];

  const checkboxes = [
    ...document.querySelectorAll(
      'input[type="checkbox"][data-group]'
    )
  ];

  const continueButton = get("continueButton");

  function updateReadinessUI() {
    let completedGroups = 0;

    groupNames.forEach((group) => {
      const items = checkboxes.filter(
        (input) => input.dataset.group === group
      );

      const completed =
        items.length > 0 && items.every((input) => input.checked);

      const partlyCompleted = items.some(
        (input) => input.checked
      );

      const status = document.querySelector(
        `[data-status="${group}"]`
      );

      if (!status) return;

      if (completed) {
        completedGroups++;
        status.textContent = "Готово";
        status.className = "status-pill done";
      } else {
        status.textContent = partlyCompleted
          ? "В процессе"
          : "Не проверено";

        status.className = "status-pill pending";
      }
    });

    const total = groupNames.length;
    const percent = Math.round((completedGroups / total) * 100);
    const ready = completedGroups === total;

    if (get("progressCount")) {
      get("progressCount").textContent =
        `${completedGroups} из ${total}`;
    }

    if (get("progressFill")) {
      get("progressFill").style.width = `${percent}%`;
    }

    if (get("progressBar")) {
      get("progressBar").setAttribute(
        "aria-valuenow",
        String(completedGroups)
      );
    }

    if (get("summaryDone")) {
      get("summaryDone").textContent =
        `${completedGroups} / ${total}`;
    }

    if (get("summaryLeft")) {
      get("summaryLeft").textContent =
        String(total - completedGroups);
    }

    if (continueButton) {
      continueButton.disabled = !ready;
    }

    if (ready) {
      get("overallStatus").textContent = "Рабочее место готово";
      get("overallDot").className = "status-dot status-ready";

      get("summaryTitle").textContent = "Можно приступать";
      get("summaryText").textContent =
        "Все обязательные проверки выполнены. Вы можете перейти к доступным заданиям.";

      get("buttonHint").textContent = "Проверки завершены";
    } else {
      get("overallStatus").textContent = "Проверка не завершена";
      get("overallDot").className = "status-dot status-pending";

      get("summaryTitle").textContent = "Требуется проверка";
      get("summaryText").textContent =
        "Выполните все обязательные проверки, чтобы перейти к доступным заданиям.";

      get("buttonHint").textContent =
        "Сначала завершите все проверки";
    }
  }

  checkboxes.forEach((input) => {
    input.addEventListener("change", updateReadinessUI);
  });

  continueButton?.addEventListener("click", () => {
    if (continueButton.disabled) return;

    showScreen("tasks");
    updateTaskList();
  });


  /* =======================================
     SHARED PROBLEM REPORT
  ======================================= */

  const problemModal = get("problemModal");
  const successModal = get("successModal");
  const problemForm = get("problemForm");
  const problemCategory = get("problemCategory");

  function updateProblemContext() {
    const context = get("problemContextStage");
    if (!context) return;

    const labels = {
      readiness: "Проверка готовности · Рабочее место № 04",
      tasks: "Список заданий · Рабочее место № 04",
      task: `Страница задания · ${currentTaskId}`
    };

    context.textContent = labels[currentScreen] || labels.readiness;
  }


   
function openProblem(defaultCategory = "", componentName = "") {
  problemForm?.reset();

  if (problemCategory && defaultCategory) {
    problemCategory.value = defaultCategory;
  }

  const problemItem = get("problemItem");

  if (problemItem) {
    problemItem.value = componentName;
  }

  updateProblemContext();

  problemModal?.showModal();

  // Фокус на первом поле формы после открытия
  const firstField = problemCategory;
  firstField?.focus();
}


   
  // function openProblem(defaultCategory = "") {
  //   problemForm?.reset();

  //   if (problemCategory && defaultCategory) {
  //     problemCategory.value = defaultCategory;
  //   }

  //   updateProblemContext();
  //   problemModal?.showModal();
  // }

  get("reportTop")?.addEventListener("click", () => {
    openProblem();
  });

  get("reportSide")?.addEventListener("click", () => {
    openProblem();
  });

  document.querySelectorAll(".report-inline").forEach((button) => {
    button.addEventListener("click", () => {
      openProblem(button.dataset.category || "");
    });
  });

  get("reportTaskProblem")?.addEventListener("click", () => {
    openProblem("Комплектующий / изделие");
  });

  get("cancelModal")?.addEventListener("click", () => {
    problemModal?.close();
  });

  get("closeProblemModal")?.addEventListener("click", () => {
    problemModal?.close();
  });

  problemForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const description = get("problemDescription").value.trim();

    if (!problemCategory.value || !description) {
      showToast("Заполните обязательные поля.");
      return;
    }

    problemModal.close();
    successModal?.showModal();

    problemForm.reset();
  });

  get("closeSuccess")?.addEventListener("click", () => {
    successModal?.close();
  });


  /* =======================================
     SCREEN 2 — TASK LIST
  ======================================= */

  const taskItems = [
    ...document.querySelectorAll("#tasksList .task-item")
  ];

  const recommendedCard = document.querySelector(
    ".recommended-card"
  );

  const allTasksTab = get("allTasksTab");
  const pausedTasksTab = get("pausedTasksTab");

  const taskSearch = get("taskSearch");
  const priorityFilter = get("priorityFilter");

  let activeTaskTab = "all";

  function getVisibleTaskCards() {
    const recommendedVisible =
      recommendedCard && !recommendedCard.hidden ? 1 : 0;

    const regularVisible = taskItems.filter(
      (card) => !card.hidden
    ).length;

    return recommendedVisible + regularVisible;
  }

  function updateTaskList() {
    const searchValue = (taskSearch?.value || "")
      .trim()
      .toLowerCase();

    const selectedPriority =
      priorityFilter?.value || "all";

    const matches = (card) => {
      const id = (card.dataset.taskId || "").toLowerCase();
      const model = (card.dataset.model || "").toLowerCase();
      const priority = card.dataset.priority || "normal";
      const status = card.dataset.status || "available";

      const matchesSearch =
        !searchValue ||
        id.includes(searchValue) ||
        model.includes(searchValue);

      const matchesPriority =
        selectedPriority === "all" ||
        priority === selectedPriority;

      const matchesTab =
        activeTaskTab === "all" ||
        status === "paused";

      return matchesSearch && matchesPriority && matchesTab;
    };

    if (recommendedCard) {
      recommendedCard.hidden = !matches(recommendedCard);
    }

    taskItems.forEach((card) => {
      card.hidden = !matches(card);
    });

    const visibleCount = getVisibleTaskCards();

    if (get("resultsCount")) {
      get("resultsCount").textContent =
        `Показано ${visibleCount} ${getTaskWord(visibleCount)}`;
    }

    if (get("tasksEmpty")) {
      get("tasksEmpty").hidden = visibleCount !== 0;
    }

    const totalCount = taskItems.length + (recommendedCard ? 1 : 0);
    const pausedCount = [...taskItems, recommendedCard]
      .filter(Boolean)
      .filter((card) => card.dataset.status === "paused")
      .length;

    if (get("allTasksCount")) {
      get("allTasksCount").textContent = String(totalCount);
    }

    if (get("pausedTasksCount")) {
      get("pausedTasksCount").textContent = String(pausedCount);
    }
  }

  function getTaskWord(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;

    if (mod100 >= 11 && mod100 <= 14) return "заданий";
    if (mod10 === 1) return "задание";
    if (mod10 >= 2 && mod10 <= 4) return "задания";

    return "заданий";
  }

  function setTaskTab(tab) {
    activeTaskTab = tab;

    const allActive = tab === "all";

    allTasksTab?.classList.toggle("active", allActive);
    pausedTasksTab?.classList.toggle("active", !allActive);

    allTasksTab?.setAttribute(
      "aria-selected",
      String(allActive)
    );

    pausedTasksTab?.setAttribute(
      "aria-selected",
      String(!allActive)
    );

    updateTaskList();
  }

  allTasksTab?.addEventListener("click", () => {
    setTaskTab("all");
  });

  pausedTasksTab?.addEventListener("click", () => {
    setTaskTab("paused");
  });

  taskSearch?.addEventListener("input", updateTaskList);

  priorityFilter?.addEventListener("change", updateTaskList);

  get("resetTaskFilters")?.addEventListener("click", () => {
    if (taskSearch) taskSearch.value = "";
    if (priorityFilter) priorityFilter.value = "all";

    setTaskTab("all");
  });

  get("refreshTasks")?.addEventListener("click", () => {
    const button = get("refreshTasks");

    if (button) {
      button.disabled = true;
      button.textContent = "↻ Обновление...";
    }

    setTimeout(() => {
      updateTaskList();

      if (get("tasksUpdatedText")) {
        get("tasksUpdatedText").textContent =
          "Список обновлён только что";
      }

      if (button) {
        button.disabled = false;
        button.textContent = "↻ Обновить список";
      }

      showToast("Список заданий обновлён.");
    }, 650);
  });

  updateTaskList();


  /* =======================================
     SCREEN 3 — TASK PAGE
  ======================================= */





/* =======================================
   SCREEN 3 — TASK PAGE
======================================= */

const taskData = {
  "ЗД-24081": {
    title: "Маршрутизатор МР-800",
    priority: "high",
    priorityLabel: "Высокий приоритет",
    order: "ЗК-10582",
    quantity: "12 шт.",
    deadline: "09.11.2026, 18:00",
    workplace: "Сборочный пост № 04",
    nextOperation: "Установка блока питания"
  },

  "ЗД-24082": {
    title: "Коммутатор КС-48",
    priority: "medium",
    priorityLabel: "Средний приоритет",
    order: "ЗК-10583",
    quantity: "8 шт.",
    deadline: "10.11.2026, 18:00",
    workplace: "Сборочный пост № 04",
    nextOperation: "Установка платы управления"
  },

  "ЗД-24079": {
    title: "Оптический модуль DWDM",
    priority: "normal",
    priorityLabel: "Обычный приоритет",
    order: "ЗК-10576",
    quantity: "20 шт.",
    deadline: "09.11.2026, 20:00",
    workplace: "Сборочный пост № 04",
    nextOperation: "Установка оптического модуля"
  }
};

let currentTaskId = "ЗД-24081";
let taskStarted = false;


/* ---------------------------------------
   Открытие страницы задания
--------------------------------------- */

function openTask(taskId) {
  const card = [
    ...document.querySelectorAll("[data-task-id]")
  ].find((item) => item.dataset.taskId === taskId);

  if (!card) {
    showToast("Задание не найдено.");
    return;
  }

  currentTaskId = taskId;
  taskStarted = false;

  const data = taskData[taskId] || {
    title: card.dataset.model || "Производственное изделие",
    priority: card.dataset.priority || "normal",
    priorityLabel: "Обычный приоритет",
    order: "—",
    quantity: "—",
    deadline: "—",
    workplace: "Сборочный пост № 04",
    nextOperation: "Не указана"
  };

  // Номер и название задания
  get("taskPageNumber").textContent = taskId;
  get("taskBreadcrumbNumber").textContent = taskId;
  get("taskPageTitle").textContent = data.title;
  get("taskProductName").textContent = data.title;

  // Приоритет
  const priorityElement = get("taskPagePriority");

  priorityElement.textContent = data.priorityLabel;
  priorityElement.className =
    `priority-badge priority-${data.priority}`;

  // Статус
  get("taskPageStatus").textContent =
    card.dataset.status === "paused"
      ? "Приостановлено"
      : "Доступно к выполнению";

  // Информация о задании
  get("detailTaskOrder").textContent = data.order;
  get("detailTaskQuantity").textContent = data.quantity;
  get("detailTaskDeadline").textContent = data.deadline;
  get("detailTaskWorkplace").textContent = data.workplace;
  get("detailTaskOperation").textContent = data.nextOperation;

  // Сброс визуальной проверки для нового открытия
  resetVisualCheck();

  // Переход на экран 3
  showScreen("task");

  const heading = get("taskPageTitle");
  heading?.setAttribute("tabindex", "-1");
  heading?.focus();

  updateProblemContext();
}


/* ---------------------------------------
   Переходы между списком и заданием
--------------------------------------- */

// Открытие задания из рекомендуемой карточки
// или из общей карточки списка.
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-task]");
  if (!button) return;

  const taskId = button.dataset.openTask;

  if (taskId) {
    openTask(taskId);
  }
});

// Возврат к списку заданий
get("backToTasks")?.addEventListener("click", () => {
  showScreen("tasks");

  const heading = tasksScreen?.querySelector("h1");
  heading?.setAttribute("tabindex", "-1");
  heading?.focus();
});


/* =======================================
   BOM — COMPONENT DETAILS
======================================= */

/*
  Раскрытие подробной информации о компоненте.
  Используем aria-expanded, чтобы состояние было
  доступно не только визуально, но и скринридерам.
*/

document.querySelectorAll(".component-expand-button").forEach((button) => {
  button.addEventListener("click", () => {
    const detailsId = button.getAttribute("aria-controls");
    const details = get(detailsId);

    if (!details) return;

    const isExpanded =
      button.getAttribute("aria-expanded") === "true";

    button.setAttribute(
      "aria-expanded",
      String(!isExpanded)
    );

    details.hidden = isExpanded;

    const label = button.querySelector(".expand-button-text");

    if (label) {
      label.textContent = isExpanded
        ? "Подробнее"
        : "Свернуть";
    }
  });
});


/* =======================================
   BOM — VISUAL COMPONENT CHECK
======================================= */

const componentChecks = [
  ...document.querySelectorAll(".component-visual-check")
];

const bomCheckedCount = get("bomCheckedCount");
const taskCheckSummary = get("taskCheckSummary");
const taskCheckSummaryTitle = get("taskCheckSummaryTitle");
const taskCheckSummaryDescription =
  get("taskCheckSummaryDescription");
const taskCheckSummaryCount = get("taskCheckSummaryCount");

const startTaskButton = get("startTaskButton");
const taskStartHint = get("taskStartHint");


/*
  Обновляем состояние визуальной проверки.
  Сборщик отмечает компонент только после того,
  как убедился в его наличии и соответствии.
*/

function updateVisualCheck() {
  const total = componentChecks.length;

  const checked = componentChecks.filter(
    (checkbox) => checkbox.checked
  ).length;

  const allChecked = total > 0 && checked === total;

  // Счётчик рядом с заголовком BOM
  if (bomCheckedCount) {
    bomCheckedCount.textContent = `${checked} из ${total}`;
  }

  // Итоговая карточка проверки
  if (taskCheckSummaryCount) {
    taskCheckSummaryCount.textContent =
      `${checked} / ${total}`;
  }

  if (taskCheckSummary) {
    taskCheckSummary.classList.toggle(
      "is-complete",
      allChecked
    );
  }

  if (allChecked) {
    taskCheckSummaryTitle.textContent =
      "Все компоненты проверены";

    taskCheckSummaryDescription.textContent =
      "Все комплектующие найдены и визуально соответствуют спецификации.";

    taskStartHint.textContent =
      "Проверка завершена. Можно приступать к заданию.";

  } else {
    taskCheckSummaryTitle.textContent =
      "Проверьте комплектующие";

    taskCheckSummaryDescription.textContent =
      "Отметьте все компоненты, которые вы нашли и проверили визуально.";

    taskStartHint.textContent =
      `Осталось проверить компонентов: ${total - checked}.`;
  }

  // Кнопка доступна только после полной проверки
  if (startTaskButton) {
    startTaskButton.disabled = !allChecked || taskStarted;
  }
}


/*
  Сброс проверки при открытии другого задания.
*/

function resetVisualCheck() {
  componentChecks.forEach((checkbox) => {
    checkbox.checked = false;
  });

  // Скрываем раскрытые карточки
  document.querySelectorAll(".component-expand-button").forEach((button) => {
    button.setAttribute("aria-expanded", "false");

    const label = button.querySelector(".expand-button-text");

    if (label) {
      label.textContent = "Подробнее";
    }
  });

  document.querySelectorAll(".component-details").forEach((details) => {
    details.hidden = true;
  });

  taskStarted = false;

  if (startTaskButton) {
    startTaskButton.disabled = true;
    startTaskButton.innerHTML =
      'Приступить к заданию <span aria-hidden="true">→</span>';
  }

  updateVisualCheck();
}


// Обработчики отметок
componentChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", updateVisualCheck);
});


/* =======================================
   REPORT COMPONENT DISCREPANCY
======================================= */

// Сообщение о проблеме из конкретной карточки BOM
document.querySelectorAll("[data-report-component]").forEach((button) => {
  button.addEventListener("click", () => {
    const componentName = button.dataset.reportComponent;

    openProblem(
      "Комплектующий / изделие",
      componentName
    );
  });
});


/* =======================================
   START TASK
======================================= */

startTaskButton?.addEventListener("click", () => {
  const allChecked =
    componentChecks.length > 0 &&
    componentChecks.every((checkbox) => checkbox.checked);

  if (!allChecked || taskStarted) {
    return;
  }

  taskStarted = true;

  // Меняем статус задания
  get("taskPageStatus").textContent = "Задание начато";

  // Блокируем повторное нажатие
  startTaskButton.disabled = true;
  startTaskButton.textContent = "Задание начато";

  taskStartHint.textContent =
    "Визуальная проверка завершена. Следующий этап — выполнение первой операции.";

  showToast(
    "Задание начато. Далее — переход к конкретной операции."
  );
});





   
  // const taskData = {
  //   "ЗД-24081": {
  //     title: "Маршрутизатор МР-800",
  //     priority: "high",
  //     priorityLabel: "Высокий приоритет",
  //     completeness: "100%",
  //     progress: "0 из 6 операций",
  //     status: "Доступно к выполнению"
  //   },
  //   "ЗД-24082": {
  //     title: "Коммутатор КС-48",
  //     priority: "medium",
  //     priorityLabel: "Средний приоритет",
  //     completeness: "85%",
  //     progress: "0 из 8 операций",
  //     status: "Доступно к выполнению"
  //   },
  //   "ЗД-24079": {
  //     title: "Оптический модуль DWDM",
  //     priority: "normal",
  //     priorityLabel: "Обычный приоритет",
  //     completeness: "100%",
  //     progress: "2 из 5 операций",
  //     status: "Приостановлено"
  //   }
  // };

  // function openTask(taskId) {
  //   const card = document.querySelector(
  //     `[data-task-id="${CSS.escape(taskId)}"]`
  //   );

  //   if (!card) {
  //     showToast("Задание не найдено.");
  //     return;
  //   }

  //   currentTaskId = taskId;

  //   const data = taskData[taskId] || {
  //     title: card.dataset.model || "Производственное изделие",
  //     priority: card.dataset.priority || "normal",
  //     priorityLabel: "Обычный приоритет",
  //     completeness: "—",
  //     progress: "0 операций",
  //     status: "Доступно к выполнению"
  //   };

  //   get("taskPageNumber").textContent = taskId;
  //   get("taskBreadcrumbNumber").textContent = taskId;
  //   get("taskPageTitle").textContent = data.title;
  //   get("taskProductName").textContent = data.title;

  //   get("taskPagePriority").textContent = data.priorityLabel;
  //   get("taskPagePriority").className =
  //     `priority-badge priority-${data.priority}`;

  //   get("taskPageStatus").textContent = data.status;
  //   get("taskCompleteness").textContent = data.completeness;
  //   get("taskProgress").textContent = data.progress;

  //   get("detailTaskNumber").textContent = taskId;
  //   get("detailTaskModel").textContent = data.title;
  //   get("detailTaskPriority").textContent =
  //     data.priorityLabel.replace(" приоритет", "");

  //   // Сценарий сборки полностью проработан для рекомендуемого задания.
  //   // Для остальных заданий пока используется демонстрационный шаблон.
  //   const isRecommended = taskId === "ЗД-24081";

  //   if (!isRecommended) {
  //     showToast(
  //       "Открыт демонстрационный шаблон. Подробный сценарий доступен для ЗД-24081."
  //     );
  //   }

  //   resetOperationDemo();

  //   get("operationCompletedBanner").hidden = true;

  //   showScreen("task");

  //   const heading = get("taskPageTitle");
  //   heading?.setAttribute("tabindex", "-1");
  //   heading?.focus();

  //   updateProblemContext();
  // }

  // // Один делегированный обработчик для рекомендуемой карточки
  // // и карточек общего списка.
  // document.addEventListener("click", (event) => {
  //   const button = event.target.closest("[data-open-task]");
  //   if (!button) return;

  //   const taskId = button.dataset.openTask;

  //   if (taskId) {
  //     openTask(taskId);
  //   }
  // });

  // get("backToTasks")?.addEventListener("click", () => {
  //   showScreen("tasks");

  //   const heading = tasksScreen?.querySelector("h1");
  //   heading?.setAttribute("tabindex", "-1");
  //   heading?.focus();
  // });

  // get("returnToTasksAfterCompletion")?.addEventListener("click", () => {
  //   showScreen("tasks");
  // });

  // get("taskDetailsButton")?.addEventListener("click", () => {
  //   get("taskDetailsModal")?.showModal();
  // });

  // function closeTaskDetails() {
  //   get("taskDetailsModal")?.close();
  // }

  // get("closeTaskDetails")?.addEventListener("click", closeTaskDetails);
  // get("closeTaskDetailsBottom")?.addEventListener("click", closeTaskDetails);


  // /* =======================================
  //    SCREEN 3 — OPERATION EXECUTION
  // ======================================= */

  // const visualCheck = get("visualCheck");
  // const componentCode = get("componentCode");
  // const verifyButton = get("verifyComponent");
  // const scanFeedback = get("scanFeedback");

  // const startButton = get("startOperationButton");
  // const pauseButton = get("pauseOperationButton");
  // const completeButton = get("completeOperationButton");

  // const timerElement = get("operationTimer");
  // const operationStatus = get("operationStatus");
  // const executionDescription = get("executionDescription");
  // const executionHint = get("executionHint");

  // const bomPowerStatus = get("bomPowerStatus");
  // const progressText = get("taskProgress");
  // const progressBar = get("taskProgressBar");
  // const progressFill = get("taskProgressFill");
  // const completionBanner = get("operationCompletedBanner");

  // // Демонстрационный код Data Matrix.
  // // В реальной MES значение поступает от считывателя,
  // // а проверка выполняется сервером.
  // const expectedComponentCode = "PSU-MR800-24081-01";

  // let componentVerified = false;
  // let operationStarted = false;
  // let operationPaused = false;
  // let operationCompleted = false;

  // let elapsedSeconds = 0;
  // let timerInterval = null;

  // function formatTime(totalSeconds) {
  //   const hours = Math.floor(totalSeconds / 3600);
  //   const minutes = Math.floor((totalSeconds % 3600) / 60);
  //   const seconds = totalSeconds % 60;

  //   return [hours, minutes, seconds]
  //     .map((value) => String(value).padStart(2, "0"))
  //     .join(":");
  // }

  // function updateTimer() {
  //   if (timerElement) {
  //     timerElement.textContent = formatTime(elapsedSeconds);
  //   }
  // }

  // function setScanFeedback(message, type = "") {
  //   if (!scanFeedback) return;

  //   scanFeedback.textContent = message;
  //   scanFeedback.className = "scan-feedback";

  //   if (type === "success") {
  //     scanFeedback.classList.add("feedback-success");
  //   }

  //   if (type === "error") {
  //     scanFeedback.classList.add("feedback-error");
  //   }
  // }

  // function updateStartButton() {
  //   if (!startButton) return;

  //   startButton.disabled =
  //     !visualCheck?.checked ||
  //     !componentVerified ||
  //     operationStarted ||
  //     operationCompleted;
  // }

  // function resetOperationDemo() {
  //   clearInterval(timerInterval);
  //   timerInterval = null;

  //   componentVerified = false;
  //   operationStarted = false;
  //   operationPaused = false;
  //   operationCompleted = false;
  //   elapsedSeconds = 0;

  //   if (visualCheck) visualCheck.checked = false;
  //   if (componentCode) componentCode.value = "";

  //   setScanFeedback("Ожидается проверка компонента.");
  //   updateTimer();

  //   if (operationStatus) {
  //     operationStatus.textContent = "Ожидает начала";
  //     operationStatus.className = "operation-status";
  //   }

  //   if (bomPowerStatus) {
  //     bomPowerStatus.textContent = "Ожидает проверки";
  //   }

  //   if (executionDescription) {
  //     executionDescription.textContent =
  //       "Выполните визуальную проверку и подтвердите компонент, чтобы начать сборку.";
  //   }

  //   if (executionHint) {
  //     executionHint.textContent =
  //       "Таймер начнёт отсчёт после подтверждения компонента и начала сборки.";
  //   }

  //   if (startButton) {
  //     startButton.hidden = false;
  //     startButton.disabled = true;
  //     startButton.textContent = "Начать сборку";
  //   }

  //   if (pauseButton) {
  //     pauseButton.hidden = true;
  //     pauseButton.textContent = "Приостановить";
  //   }

  //   if (completeButton) {
  //     completeButton.hidden = true;
  //     completeButton.disabled = true;
  //   }

  //   if (completionBanner) {
  //     completionBanner.hidden = true;
  //   }

  //   if (progressText) {
  //     progressText.textContent = "0 из 6 операций";
  //   }

  //   if (progressFill) {
  //     progressFill.style.width = "0%";
  //   }

  //   if (progressBar) {
  //     progressBar.setAttribute("aria-valuenow", "0");
  //   }

  //   updateStartButton();
  // }

  // // Визуальная проверка.
  // visualCheck?.addEventListener("change", () => {
  //   updateStartButton();
  // });

  // // Проверка кода Data Matrix.
  // verifyButton?.addEventListener("click", () => {
  //   if (operationStarted || operationCompleted) return;

  //   const scannedCode = componentCode?.value.trim();

  //   if (!scannedCode) {
  //     setScanFeedback(
  //       "Введите или отсканируйте код компонента.",
  //       "error"
  //     );

  //     componentCode?.focus();
  //     return;
  //   }

  //   if (scannedCode !== expectedComponentCode) {
  //     componentVerified = false;

  //     setScanFeedback(
  //       "Компонент не соответствует спецификации. Проверьте маркировку.",
  //       "error"
  //     );

  //     if (bomPowerStatus) {
  //       bomPowerStatus.textContent = "Несоответствие";
  //     }

  //     updateStartButton();
  //     return;
  //   }

  //   componentVerified = true;

  //   setScanFeedback(
  //     "Компонент подтверждён. Код соответствует спецификации.",
  //     "success"
  //   );

  //   if (bomPowerStatus) {
  //     bomPowerStatus.textContent = "Проверен";
  //   }

  //   updateStartButton();
  // });

  // // Считыватель штрихкодов обычно передаёт значение
  // // в активное поле и завершает ввод клавишей Enter.
  // componentCode?.addEventListener("keydown", (event) => {
  //   if (event.key === "Enter") {
  //     event.preventDefault();
  //     verifyButton?.click();
  //   }
  // });

  // // Начало сборки и запуск таймера.
  // startButton?.addEventListener("click", () => {
  //   if (
  //     !visualCheck?.checked ||
  //     !componentVerified ||
  //     operationCompleted
  //   ) {
  //     return;
  //   }

  //   operationStarted = true;
  //   operationPaused = false;

  //   operationStatus.textContent = "Выполняется";
  //   operationStatus.className =
  //     "operation-status status-in-progress";

  //   executionDescription.textContent =
  //     "Выполните установку и закрепление блока питания согласно инструкции.";

  //   executionHint.textContent =
  //     "Время выполнения операции учитывается автоматически.";

  //   startButton.hidden = true;
  //   pauseButton.hidden = false;
  //   completeButton.hidden = false;
  //   completeButton.disabled = false;

  //   timerInterval = setInterval(() => {
  //     elapsedSeconds++;
  //     updateTimer();
  //   }, 1000);
  // });

  // // Пауза и возобновление.
  // pauseButton?.addEventListener("click", () => {
  //   if (!operationStarted || operationCompleted) return;

  //   if (!operationPaused) {
  //     clearInterval(timerInterval);
  //     timerInterval = null;

  //     operationPaused = true;
  //     pauseButton.textContent = "Продолжить";

  //     operationStatus.textContent = "Приостановлено";

  //     executionDescription.textContent =
  //       "Операция приостановлена. После возобновления можно продолжить выполнение.";

  //     executionHint.textContent =
  //       "Время приостановки не включается в активное время выполнения.";

  //   } else {
  //     operationPaused = false;
  //     pauseButton.textContent = "Приостановить";

  //     operationStatus.textContent = "Выполняется";

  //     executionDescription.textContent =
  //       "Продолжайте установку и закрепление блока питания.";

  //     timerInterval = setInterval(() => {
  //       elapsedSeconds++;
  //       updateTimer();
  //     }, 1000);
  //   }
  // });

  // // Завершение операции.
  // completeButton?.addEventListener("click", () => {
  //   if (
  //     !operationStarted ||
  //     operationCompleted ||
  //     operationPaused
  //   ) {
  //     return;
  //   }

  //   clearInterval(timerInterval);
  //   timerInterval = null;

  //   operationCompleted = true;

  //   operationStatus.textContent = "Завершена";
  //   operationStatus.className = "operation-status";

  //   executionDescription.textContent =
  //     "Операция установки блока питания завершена.";

  //   executionHint.textContent =
  //     `Зафиксированное активное время: ${formatTime(elapsedSeconds)}.`;

  //   pauseButton.hidden = true;
  //   completeButton.hidden = true;
  //   startButton.hidden = true;

  //   progressText.textContent = "1 из 6 операций";
  //   progressFill.style.width = "16.67%";
  //   progressBar.setAttribute("aria-valuenow", "17");

  //   completionBanner.hidden = false;

  //   completionBanner.scrollIntoView({
  //     behavior: "smooth",
  //     block: "nearest"
  //   });
  // });


  /* =======================================
     END SHIFT
  ======================================= */

  const endShiftModal = get("endShiftModal");

  get("endShiftButton")?.addEventListener("click", () => {
    endShiftModal?.showModal();
  });

  function closeEndShiftModal() {
    endShiftModal?.close();
  }

  get("closeEndShift")?.addEventListener("click", closeEndShiftModal);
  get("cancelEndShift")?.addEventListener("click", closeEndShiftModal);

  get("confirmEndShift")?.addEventListener("click", () => {
    closeEndShiftModal();
    showToast("Демонстрационная смена завершена.");
  });


  /* =======================================
     MODAL BACKDROP CLOSING
  ======================================= */

  [
    problemModal,
    successModal,
    get("taskDetailsModal"),
    endShiftModal
  ].filter(Boolean).forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });


  /* =======================================
     INITIALIZATION
  ======================================= */

updateReadinessUI();
updateTaskList();
updateVisualCheck();

})();
