/* =========================================
   MES PRODUCTION — APPLICATION
   Screens 1, 2 and 3
========================================= */

(() => {
  "use strict";


  /* =======================================
     DOM HELPERS AND SHARED STATE
  ======================================= */

  const get = (id) => document.getElementById(id);

  const loginScreen = get("loginScreen");
  const appContent = get("appContent");

  const readinessScreen = get("readinessScreen");
  const tasksScreen = get("tasksScreen");
  const taskScreen = get("taskScreen");
  const operationScreen = get("operationScreen");

  let currentScreen = "readiness";
  let currentTaskId = "ЗД-24081";
  let taskStarted = false;
  let toastTimer = null;


  /* =======================================
     TOAST NOTIFICATION
  ======================================= */

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
  const loginUsername = get("loginUsername");
  const loginPassword = get("loginPassword");
  const loginError = get("loginError");
  const togglePassword = get("togglePassword");

  const DEMO_LOGIN = "s.ivanov";
  const DEMO_PASSWORD = "MES2026!";

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = loginUsername?.value.trim() || "";
    const password = loginPassword?.value || "";

    if (username === DEMO_LOGIN && password === DEMO_PASSWORD) {
      if (loginError) {
        loginError.textContent = "";
      }

      if (loginScreen) {
        loginScreen.hidden = true;
      }

      if (appContent) {
        appContent.hidden = false;
      }

      showScreen("readiness");

      const heading = readinessScreen?.querySelector("h1");

      heading?.setAttribute("tabindex", "-1");
      heading?.focus();

      return;
    }

    if (loginError) {
      loginError.textContent = "Неверный логин или пароль.";
    }

    loginPassword?.focus();
  });


  /* ---------------------------------------
     Показать / скрыть пароль
  --------------------------------------- */

  togglePassword?.addEventListener("click", () => {
    if (!loginPassword) return;

    const isPassword = loginPassword.type === "password";

    loginPassword.type = isPassword ? "text" : "password";

    togglePassword.textContent = isPassword
      ? "Скрыть"
      : "Показать";

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
    task: "Страница задания | MES",
    operation: "Проверка компонента | MES"
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

    if (operationScreen) {
      operationScreen.hidden = screenName !== "operation";
    }

    document.title =
      screenTitles[screenName] || "MES Production";

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });
  }


  /* =======================================
     SCREEN 1 — READINESS CHECK
  ======================================= */

  const groupNames = [
    "tools",
    "equipment",
    "materials",
    "esd"
  ];

  const checkboxes = [
    ...document.querySelectorAll(
      'input[type="checkbox"][data-group]'
    )
  ];

  const continueButton = get("continueButton");


  /* ---------------------------------------
     Обновление состояния проверок
  --------------------------------------- */

  function updateReadinessUI() {
    let completedGroups = 0;

    groupNames.forEach((group) => {
      const items = checkboxes.filter(
        (input) => input.dataset.group === group
      );

      const completed =
        items.length > 0 &&
        items.every((input) => input.checked);

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

    const percent = Math.round(
      (completedGroups / total) * 100
    );

    const ready = completedGroups === total;


    // Прогресс

    if (get("progressCount")) {
      get("progressCount").textContent =
        `${completedGroups} из ${total}`;
    }

    if (get("progressFill")) {
      get("progressFill").style.width =
        `${percent}%`;
    }

    if (get("progressBar")) {
      get("progressBar").setAttribute(
        "aria-valuenow",
        String(completedGroups)
      );
    }


    // Итоговые показатели

    if (get("summaryDone")) {
      get("summaryDone").textContent =
        `${completedGroups} / ${total}`;
    }

    if (get("summaryLeft")) {
      get("summaryLeft").textContent =
        String(total - completedGroups);
    }


    // Доступность перехода

    if (continueButton) {
      continueButton.disabled = !ready;
    }


    // Состояние рабочего места

    if (ready) {
      if (get("overallStatus")) {
        get("overallStatus").textContent =
          "Рабочее место готово";
      }

      if (get("overallDot")) {
        get("overallDot").className =
          "status-dot status-ready";
      }

      if (get("summaryTitle")) {
        get("summaryTitle").textContent =
          "Можно приступать";
      }

      if (get("summaryText")) {
        get("summaryText").textContent =
          "Все обязательные проверки выполнены. Вы можете перейти к доступным заданиям.";
      }

      if (get("buttonHint")) {
        get("buttonHint").textContent =
          "Проверки завершены";
      }

    } else {
      if (get("overallStatus")) {
        get("overallStatus").textContent =
          "Проверка не завершена";
      }

      if (get("overallDot")) {
        get("overallDot").className =
          "status-dot status-pending";
      }

      if (get("summaryTitle")) {
        get("summaryTitle").textContent =
          "Требуется проверка";
      }

      if (get("summaryText")) {
        get("summaryText").textContent =
          "Выполните все обязательные проверки, чтобы перейти к доступным заданиям.";
      }

      if (get("buttonHint")) {
        get("buttonHint").textContent =
          "Сначала завершите все проверки";
      }
    }
  }


  // Обработчики чекбоксов готовности

  checkboxes.forEach((input) => {
    input.addEventListener(
      "change",
      updateReadinessUI
    );
  });


  // Переход к списку заданий

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


  /* ---------------------------------------
     Контекст регистрации проблемы
  --------------------------------------- */

  function updateProblemContext() {
    const context = get("problemContextStage");

    if (!context) return;

    const labels = {
      readiness:
        "Проверка готовности · Рабочее место № 04",

      tasks:
        "Список заданий · Рабочее место № 04",

      task:
        `Страница задания · ${currentTaskId}`,
       
      operation: 
         `Операция · Установка блока питания · ${currentTaskId}`
    };

    context.textContent =
      labels[currentScreen] || labels.readiness;
  }


  /* ---------------------------------------
     Открытие формы проблемы
  --------------------------------------- */

  function openProblem(
    defaultCategory = "",
    componentName = ""
  ) {
    problemForm?.reset();

    if (problemCategory && defaultCategory) {
      problemCategory.value = defaultCategory;
    }

    const problemItem = get("problemItem");

    if (problemItem) {
      problemItem.value = componentName;
    }

    updateProblemContext();

    if (problemModal && !problemModal.open) {
      problemModal.showModal();
    }

    problemCategory?.focus();
  }


  // Проблема из верхней панели

  get("reportTop")?.addEventListener("click", () => {
    openProblem();
  });


  // Проблема из бокового блока экрана 1

  get("reportSide")?.addEventListener("click", () => {
    openProblem();
  });


  // Проблема из карточек экрана 1

  document.querySelectorAll(".report-inline").forEach((button) => {
    button.addEventListener("click", () => {
      openProblem(button.dataset.category || "");
    });
  });


  // Проблема со страницы задания

  get("reportTaskProblem")?.addEventListener("click", () => {
    openProblem("Комплектующий / изделие");
  });


  // Закрытие формы

  function closeProblemModal() {
    problemModal?.close();
  }

  get("cancelModal")?.addEventListener(
    "click",
    closeProblemModal
  );

  get("closeProblemModal")?.addEventListener(
    "click",
    closeProblemModal
  );


  /* ---------------------------------------
     Отправка сообщения
  --------------------------------------- */

  problemForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const description =
      get("problemDescription")?.value.trim() || "";

    if (
      !problemCategory?.value ||
      !description
    ) {
      showToast("Заполните обязательные поля.");
      return;
    }

    problemModal?.close();

    successModal?.showModal();

    problemForm.reset();
  });


  // Закрытие подтверждения

  get("closeSuccess")?.addEventListener("click", () => {
    successModal?.close();
  });


  /* =======================================
     SCREEN 2 — TASK LIST
  ======================================= */

  const taskItems = [
    ...document.querySelectorAll(
      "#tasksList .task-item"
    )
  ];

  const recommendedCard = document.querySelector(
    ".recommended-card"
  );

  const allTasksTab = get("allTasksTab");
  const pausedTasksTab = get("pausedTasksTab");

  const taskSearch = get("taskSearch");
  const priorityFilter = get("priorityFilter");

  let activeTaskTab = "all";


  /* ---------------------------------------
     Количество отображаемых заданий
  --------------------------------------- */

  function getVisibleTaskCards() {
    const recommendedVisible =
      recommendedCard && !recommendedCard.hidden
        ? 1
        : 0;

    const regularVisible = taskItems.filter(
      (card) => !card.hidden
    ).length;

    return recommendedVisible + regularVisible;
  }


  /* ---------------------------------------
     Обновление списка и фильтров
  --------------------------------------- */

  function updateTaskList() {
    const searchValue = (
      taskSearch?.value || ""
    )
      .trim()
      .toLowerCase();

    const selectedPriority =
      priorityFilter?.value || "all";


    const matches = (card) => {
      const id = (
        card.dataset.taskId || ""
      ).toLowerCase();

      const model = (
        card.dataset.model || ""
      ).toLowerCase();

      const priority =
        card.dataset.priority || "normal";

      const status =
        card.dataset.status || "available";


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

      return (
        matchesSearch &&
        matchesPriority &&
        matchesTab
      );
    };


    // Рекомендуемое задание

    if (recommendedCard) {
      recommendedCard.hidden =
        !matches(recommendedCard);
    }


    // Остальные задания

    taskItems.forEach((card) => {
      card.hidden = !matches(card);
    });


    // Количество результатов

    const visibleCount = getVisibleTaskCards();

    if (get("resultsCount")) {
      get("resultsCount").textContent =
        `Показано ${visibleCount} ${getTaskWord(visibleCount)}`;
    }


    // Пустое состояние

    if (get("tasksEmpty")) {
      get("tasksEmpty").hidden =
        visibleCount !== 0;
    }


    // Счётчики вкладок

    const totalCount =
      taskItems.length + (recommendedCard ? 1 : 0);

    const pausedCount = [
      ...taskItems,
      recommendedCard
    ]
      .filter(Boolean)
      .filter(
        (card) => card.dataset.status === "paused"
      )
      .length;

    if (get("allTasksCount")) {
      get("allTasksCount").textContent =
        String(totalCount);
    }

    if (get("pausedTasksCount")) {
      get("pausedTasksCount").textContent =
        String(pausedCount);
    }
  }


  /* ---------------------------------------
     Склонение слова «задание»
  --------------------------------------- */

  function getTaskWord(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;

    if (mod100 >= 11 && mod100 <= 14) {
      return "заданий";
    }

    if (mod10 === 1) {
      return "задание";
    }

    if (mod10 >= 2 && mod10 <= 4) {
      return "задания";
    }

    return "заданий";
  }


  /* ---------------------------------------
     Переключение вкладок
  --------------------------------------- */

  function setTaskTab(tab) {
    activeTaskTab = tab;

    const allActive = tab === "all";

    allTasksTab?.classList.toggle(
      "active",
      allActive
    );

    pausedTasksTab?.classList.toggle(
      "active",
      !allActive
    );

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


  /* ---------------------------------------
     Поиск и фильтрация
  --------------------------------------- */

  taskSearch?.addEventListener(
    "input",
    updateTaskList
  );

  priorityFilter?.addEventListener(
    "change",
    updateTaskList
  );


  /* ---------------------------------------
     Сброс фильтров
  --------------------------------------- */

  get("resetTaskFilters")?.addEventListener("click", () => {
    if (taskSearch) {
      taskSearch.value = "";
    }

    if (priorityFilter) {
      priorityFilter.value = "all";
    }

    setTaskTab("all");
  });


  /* ---------------------------------------
     Обновление списка
  --------------------------------------- */

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


  /* ---------------------------------------
     Открытие страницы задания
  --------------------------------------- */

  function openTask(taskId) {
    const card = [
      ...document.querySelectorAll("[data-task-id]")
    ].find(
      (item) => item.dataset.taskId === taskId
    );

    if (!card) {
      showToast("Задание не найдено.");
      return;
    }

    currentTaskId = taskId;
    taskStarted = false;


    // Данные выбранного задания

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


    // Номер и название

    if (get("taskPageNumber")) {
      get("taskPageNumber").textContent = taskId;
    }

    if (get("taskBreadcrumbNumber")) {
      get("taskBreadcrumbNumber").textContent = taskId;
    }

    if (get("taskPageTitle")) {
      get("taskPageTitle").textContent = data.title;
    }

    if (get("taskProductName")) {
      get("taskProductName").textContent = data.title;
    }


    // Приоритет

    const priorityElement = get("taskPagePriority");

    if (priorityElement) {
      priorityElement.textContent =
        data.priorityLabel;

      priorityElement.className =
        `priority-badge priority-${data.priority}`;
    }


    // Статус

    const statusElement = get("taskPageStatus");

    if (statusElement) {
      statusElement.textContent =
        card.dataset.status === "paused"
          ? "Приостановлено"
          : "Доступно к выполнению";

      statusElement.className = "task-status-badge";
    }


    // Информация о задании

    const taskFields = {
      detailTaskOrder: data.order,
      detailTaskQuantity: data.quantity,
      detailTaskDeadline: data.deadline,
      detailTaskWorkplace: data.workplace,
      detailTaskOperation: data.nextOperation
    };

    Object.entries(taskFields).forEach(([id, value]) => {
      const element = get(id);

      if (element) {
        element.textContent = value;
      }
    });


    // Сбрасываем визуальную проверку

    resetVisualCheck();


    // Переход на экран 3

    showScreen("task");

    const heading = get("taskPageTitle");

    heading?.setAttribute("tabindex", "-1");
    heading?.focus();

    updateProblemContext();
  }


  /* ---------------------------------------
     Открытие задания по кнопке
  --------------------------------------- */

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-task]");

    if (!button) return;

    const taskId = button.dataset.openTask;

    if (taskId) {
      openTask(taskId);
    }
  });


  /* ---------------------------------------
     Возврат к списку заданий
  --------------------------------------- */

  get("backToTasks")?.addEventListener("click", () => {
    showScreen("tasks");

    const heading = tasksScreen?.querySelector("h1");

    heading?.setAttribute("tabindex", "-1");
    heading?.focus();
  });


  /* =======================================
     SCREEN 3 — BOM COMPONENT DETAILS
  ======================================= */

  document.querySelectorAll(
    ".component-expand-button"
  ).forEach((button) => {
    button.addEventListener("click", () => {
      const detailsId =
        button.getAttribute("aria-controls");

      const details = get(detailsId);

      if (!details) return;

      const isExpanded =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute(
        "aria-expanded",
        String(!isExpanded)
      );

      details.hidden = isExpanded;

      const label = button.querySelector(
        ".expand-button-text"
      );

      if (label) {
        label.textContent = isExpanded
          ? "Подробнее"
          : "Свернуть";
      }
    });
  });


  /* =======================================
     SCREEN 3 — VISUAL COMPONENT CHECK
  ======================================= */

  const componentChecks = [
    ...document.querySelectorAll(
      ".component-visual-check"
    )
  ];

  const bomCheckedCount = get("bomCheckedCount");

  const taskCheckSummary = get("taskCheckSummary");

  const taskCheckSummaryTitle =
    get("taskCheckSummaryTitle");

  const taskCheckSummaryDescription =
    get("taskCheckSummaryDescription");

  const taskCheckSummaryCount =
    get("taskCheckSummaryCount");

  const startTaskButton =
    get("startTaskButton");

  const taskStartHint =
    get("taskStartHint");


  /* ---------------------------------------
     Обновление визуальной проверки
  --------------------------------------- */

  function updateVisualCheck() {
    const total = componentChecks.length;

    const checked = componentChecks.filter(
      (checkbox) => checkbox.checked
    ).length;

    const allChecked =
      total > 0 && checked === total;


    // Счётчик рядом с заголовком BOM

    if (bomCheckedCount) {
      bomCheckedCount.textContent =
        `${checked} из ${total}`;
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


    // Текст состояния проверки

    if (allChecked) {
      if (taskCheckSummaryTitle) {
        taskCheckSummaryTitle.textContent =
          "Все компоненты проверены";
      }

      if (taskCheckSummaryDescription) {
        taskCheckSummaryDescription.textContent =
          "Все комплектующие найдены и визуально соответствуют спецификации.";
      }

      if (taskStartHint) {
        taskStartHint.textContent =
          "Проверка завершена. Можно приступать к заданию.";
      }

    } else {
      if (taskCheckSummaryTitle) {
        taskCheckSummaryTitle.textContent =
          "Проверьте комплектующие";
      }

      if (taskCheckSummaryDescription) {
        taskCheckSummaryDescription.textContent =
          "Отметьте все компоненты, которые вы нашли и проверили визуально.";
      }

      if (taskStartHint) {
        taskStartHint.textContent =
          `Осталось проверить компонентов: ${total - checked}.`;
      }
    }


    // Кнопка доступна только после полной проверки

    if (startTaskButton) {
      startTaskButton.disabled =
        !allChecked || taskStarted;
    }
  }


  /* ---------------------------------------
     Сброс визуальной проверки
  --------------------------------------- */

  function resetVisualCheck() {
    componentChecks.forEach((checkbox) => {
      checkbox.checked = false;
    });


    // Закрываем раскрытые карточки

    document.querySelectorAll(
      ".component-expand-button"
    ).forEach((button) => {
      button.setAttribute(
        "aria-expanded",
        "false"
      );

      const label = button.querySelector(
        ".expand-button-text"
      );

      if (label) {
        label.textContent = "Подробнее";
      }
    });


    // Скрываем блоки с подробной информацией

    document.querySelectorAll(
      ".component-details"
    ).forEach((details) => {
      details.hidden = true;
    });


    // Сбрасываем состояние начала задания

    taskStarted = false;

    if (startTaskButton) {
      startTaskButton.disabled = true;

      startTaskButton.innerHTML =
        'Приступить к заданию <span aria-hidden="true">→</span>';
    }

    updateVisualCheck();
  }


  // Обработчики чекбоксов BOM

  componentChecks.forEach((checkbox) => {
    checkbox.addEventListener(
      "change",
      updateVisualCheck
    );
  });


  /* =======================================
     SCREEN 3 — REPORT COMPONENT DISCREPANCY
  ======================================= */

  document.querySelectorAll(
    "[data-report-component]"
  ).forEach((button) => {
    button.addEventListener("click", () => {
      const componentName =
        button.dataset.reportComponent || "";

      openProblem(
        "Комплектующий / изделие",
        componentName
      );
    });
  });


  /* =======================================
     SCREEN 3 — START TASK
  ======================================= */

startTaskButton?.addEventListener("click", () => {

  // Если задание уже начато, возвращаемся к текущей операции.
  if (taskStarted) {
    showScreen("operation");
    return;
  }

  const allChecked =
    componentChecks.length > 0 &&
    componentChecks.every((checkbox) => checkbox.checked);

  if (!allChecked) {
    return;
  }

  taskStarted = true;

  get("taskPageStatus").textContent = "Задание начато";

  startTaskButton.disabled = false;
  startTaskButton.textContent = "Перейти к текущей операции";

  taskStartHint.textContent =
    "Задание начато. Продолжите работу с первой производственной операцией.";

  showScreen("operation");

});


   /* =========================================
   SCREEN 4 — COMPONENT CHECK
========================================= */


/* -----------------------------------------
   Состояние текущей операции
----------------------------------------- */

let operationState = {
  taskId: null,
  visualConfirmed: false,
  paused: false,
  scanned: false,
  verifiedCode: ""
};


/* -----------------------------------------
   DOM-элементы
----------------------------------------- */

const operationVisualConfirmed =
  get("operationVisualConfirmed");

const operationScanInput =
  get("operationScanInput");

const operationScanButton =
  get("operationScanButton");

const operationScanFeedback =
  get("operationScanFeedback");

const operationPauseButton =
  get("operationPauseButton");

const operationResumeButton =
  get("operationResumeButton");

const operationEndShift =
  get("operationEndShift");

const operationBackButton =
  get("backToTaskPage");

const operationConfirmation =
  get("operationConfirmation");


/*
  Демонстрационный код Data Matrix.

  В настоящей MES система должна проверять:
  - принадлежность компонента заданию;
  - соответствие позиции спецификации;
  - уникальность серийного номера;
  - статус компонента и возможность его использования.

  В прототипе проверяем точное совпадение строки.
*/

const EXPECTED_OPERATION_CODE =
  "PSU-MR800-24081-01";


/* -----------------------------------------
   Обновление интерфейса
----------------------------------------- */

function updateOperationUI() {

  const state = operationState;

  const visualBlock = get("operationVisualCheckBlock");
  const safeNotice = get("operationSafeNotice");
  const lockedNotice = get("operationLockedNotice");
  const pausedState = get("operationPausedState");
  const lockedControls = get("operationLockedControls");
  const pauseDescription = get("operationPauseDescription");
  const operationStatus = get("operationStatus");

  const isLocked = state.scanned;
  const isPaused = state.paused;

  // Статус операции

  if (isLocked) {

    operationStatus.textContent = "Компонент подтверждён";
    operationStatus.className =
      "operation-status is-verified";

  } else if (isPaused) {

    operationStatus.textContent = "Приостановлено";
    operationStatus.className =
      "operation-status is-paused";

  } else if (state.visualConfirmed) {

    operationStatus.textContent = "Готов к сканированию";
    operationStatus.className =
      "operation-status";

  } else {

    operationStatus.textContent = "Ожидает проверки";
    operationStatus.className =
      "operation-status";
  }


  // Информационные состояния

  safeNotice.hidden = isLocked;
  lockedNotice.hidden = !isLocked;

  // Визуальная проверка

  if (operationVisualConfirmed) {
    operationVisualConfirmed.disabled =
      isLocked || isPaused;
  }

  if (visualBlock) {
    visualBlock.classList.toggle("is-disabled", isLocked);
  }

  // Сканирование доступно только после визуальной проверки
  // и только если задание не приостановлено.

  if (operationScanInput) {
    operationScanInput.disabled =
      !state.visualConfirmed ||
      isPaused ||
      isLocked;
  }

  if (operationScanButton) {
    operationScanButton.disabled =
      !state.visualConfirmed ||
      isPaused ||
      isLocked;
  }


  // Пауза и возобновление

  operationPauseButton.hidden =
    isLocked || isPaused;

  pausedState.hidden = !isPaused;

  lockedControls.hidden = !isLocked;

  if (pauseDescription) {
    pauseDescription.hidden = isLocked;
  }


  // Завершение смены

  operationEndShift.disabled = isLocked;

  // Возврат к странице задания

  operationBackButton.disabled = isLocked;

  // Сканирование завершено

  operationConfirmation.hidden = !isLocked;
}


/* -----------------------------------------
   Обновление состояния визуальной проверки
----------------------------------------- */

operationVisualConfirmed?.addEventListener(
  "change",
  () => {

    if (
      operationState.scanned ||
      operationState.paused
    ) {
      return;
    }

    operationState.visualConfirmed =
      operationVisualConfirmed.checked;

    if (operationState.visualConfirmed) {

      operationScanFeedback.textContent =
        "Визуальная проверка подтверждена. Теперь можно сканировать маркировку.";

      operationScanFeedback.className =
        "operation-scan-feedback";

    } else {

      operationScanFeedback.textContent =
        "Сначала выполните визуальную проверку компонента.";

      operationScanFeedback.className =
        "operation-scan-feedback";
    }

    updateOperationUI();
  }
);


/* -----------------------------------------
   Проверка Data Matrix
----------------------------------------- */

function setOperationScanFeedback(message, type = "") {

  if (!operationScanFeedback) return;

  operationScanFeedback.textContent = message;

  operationScanFeedback.className =
    "operation-scan-feedback";

  if (type === "error") {
    operationScanFeedback.classList.add("is-error");
  }

  if (type === "success") {
    operationScanFeedback.classList.add("is-success");
  }
}


function verifyOperationComponent() {

  // Защита от повторного сканирования
  // и выполнения действия в небезопасном состоянии.

  if (
    operationState.scanned ||
    operationState.paused ||
    !operationState.visualConfirmed
  ) {
    return;
  }

  const scannedCode =
    operationScanInput.value.trim();

  if (!scannedCode) {

    setOperationScanFeedback(
      "Не удалось прочитать код. Отсканируйте маркировку или введите её вручную.",
      "error"
    );

    operationScanInput.focus();
    return;
  }


  // Демонстрационная проверка соответствия

  if (scannedCode !== EXPECTED_OPERATION_CODE) {

    setOperationScanFeedback(
      "Компонент не соответствует заданию. Проверьте маркировку и спецификацию.",
      "error"
    );

    operationScanInput.focus();
    return;
  }


  // Компонент подтверждён системой.
  // С этого момента задание переходит
  // в небезопасное для паузы состояние.

  operationState.scanned = true;
  operationState.verifiedCode = scannedCode;

  get("operationVerifiedCode").textContent =
    scannedCode;

  get("operationBomPowerStatus").textContent =
    "Подтверждён системой";

  setOperationScanFeedback(
    "Код успешно проверен. Компонент соответствует производственному заданию.",
    "success"
  );

  updateOperationUI();

  showToast(
    "Компонент подтверждён. Выполните его установку."
  );
}


operationScanButton?.addEventListener(
  "click",
  verifyOperationComponent
);


// Считыватель штрихкодов обычно передаёт
// значение в активное поле и завершает ввод Enter.

operationScanInput?.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      event.preventDefault();

      verifyOperationComponent();
    }
  }
);


/* -----------------------------------------
   Пауза задания
----------------------------------------- */

operationPauseButton?.addEventListener(
  "click",
  () => {

    // Пауза разрешена только до сканирования.

    if (operationState.scanned) {
      return;
    }

    operationState.paused = true;

    setOperationScanFeedback(
      "Задание приостановлено. Состояние визуальной проверки сохранено."
    );

    updateOperationUI();

    showToast(
      "Задание приостановлено. Прогресс сохранён."
    );
  }
);


/* -----------------------------------------
   Возобновление задания
----------------------------------------- */

operationResumeButton?.addEventListener(
  "click",
  () => {

    if (operationState.scanned) {
      return;
    }

    operationState.paused = false;

    updateOperationUI();

    if (operationState.visualConfirmed) {

      setOperationScanFeedback(
        "Визуальная проверка сохранена. Можно продолжить сканирование."
      );

    } else {

      setOperationScanFeedback(
        "Продолжите визуальную проверку компонента."
      );
    }

    showToast("Работа продолжена.");
  }
);


/* -----------------------------------------
   Возврат к странице задания
----------------------------------------- */

operationBackButton?.addEventListener(
  "click",
  () => {

    if (operationState.scanned) {
      return;
    }

    showScreen("task");
  }
);


/* -----------------------------------------
   Сообщение о проблеме
----------------------------------------- */

function reportOperationProblem() {

  openProblem(
    "Комплектующий / изделие",
    "Блок питания PSU-01"
  );
}


get("operationReportProblem")?.addEventListener(
  "click",
  reportOperationProblem
);

get("operationReportProblemSide")?.addEventListener(
  "click",
  reportOperationProblem
);


/* -----------------------------------------
   Завершение смены
----------------------------------------- */

operationEndShift?.addEventListener(
  "click",
  () => {

    // После подтверждения компонента
    // завершение смены запрещено до установки.

    if (operationState.scanned) {
      return;
    }

    get("endShiftModal")?.showModal();
  }
);


/* -----------------------------------------
   Открытие экрана операции
----------------------------------------- */

function openOperationScreen() {

  // При переходе к другому заданию
  // создаём новое состояние операции.

  if (operationState.taskId !== currentTaskId) {

    operationState = {
      taskId: currentTaskId,
      visualConfirmed: false,
      paused: false,
      scanned: false,
      verifiedCode: ""
    };

    if (operationVisualConfirmed) {
      operationVisualConfirmed.checked = false;
    }

    if (operationScanInput) {
      operationScanInput.value = "";
    }

    setOperationScanFeedback(
      "Сначала выполните визуальную проверку компонента."
    );
  }

  get("operationTaskNumber").textContent =
    currentTaskId;

  get("operationProductName").textContent =
    get("taskPageTitle").textContent;

  updateOperationUI();

  showScreen("operation");

  const heading = get("operationTitle");

  heading?.setAttribute("tabindex", "-1");
  heading?.focus();
}
   

  /* =======================================
     END SHIFT
  ======================================= */

  const endShiftModal = get("endShiftModal");

  function openEndShiftModal() {
    if (endShiftModal && !endShiftModal.open) {
      endShiftModal.showModal();
    }
  }

  function closeEndShiftModal() {
    endShiftModal?.close();
  }


  // Кнопка на экране 2

  get("endShiftButton")?.addEventListener(
    "click",
    openEndShiftModal
  );


  // Кнопка на экране 3

  get("taskEndShiftButton")?.addEventListener(
    "click",
    openEndShiftModal
  );


  // Закрытие модального окна

  get("closeEndShift")?.addEventListener(
    "click",
    closeEndShiftModal
  );

  get("cancelEndShift")?.addEventListener(
    "click",
    closeEndShiftModal
  );


  // Подтверждение завершения смены

  get("confirmEndShift")?.addEventListener("click", () => {
    closeEndShiftModal();

    showToast(
      "Демонстрационная смена завершена."
    );
  });


  /* =======================================
     MODAL BACKDROP CLOSING
  ======================================= */

  [
    problemModal,
    successModal,
    endShiftModal
  ]
    .filter(Boolean)
    .forEach((dialog) => {
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
  updateOperationUI();

})();
