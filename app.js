
(() => {
  "use strict";

  // =====================================================
  // 1. DEMO AUTHENTICATION
  // =====================================================

  const loginForm = document.getElementById("loginForm");
  const loginScreen = document.getElementById("loginScreen");
  const appContent = document.getElementById("appContent");
  const loginError = document.getElementById("loginError");
  const loginPassword = document.getElementById("loginPassword");
  const togglePassword = document.getElementById("togglePassword");

  if (loginForm && loginScreen && appContent) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = document
        .getElementById("loginUsername")
        .value.trim();

      const password = loginPassword.value;

      if (username === "s.ivanov" && password === "MES2026!") {
        loginError.textContent = "";
        loginScreen.hidden = true;
        appContent.hidden = false;

        document.title = "MES — Проверка готовности к работе";

        document.querySelector("#readinessScreen h1")?.focus();
      } else {
        loginError.textContent = "Неверный логин или пароль.";
        loginPassword.focus();
      }
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
  }


  // =====================================================
  // 2. SHARED ELEMENTS AND NOTIFICATIONS
  // =====================================================

  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }


  // =====================================================
  // 3. SCREEN NAVIGATION
  // =====================================================

  const readinessScreen = document.getElementById("readinessScreen");
  const tasksScreen = document.getElementById("tasksScreen");

  function showScreen(screenName) {
    if (!readinessScreen || !tasksScreen) return;

    const isTasksScreen = screenName === "tasks";

    readinessScreen.hidden = isTasksScreen;
    tasksScreen.hidden = !isTasksScreen;

    document.title = isTasksScreen
      ? "MES — Доступные задания"
      : "MES — Проверка готовности к работе";

    const activeScreen = isTasksScreen
      ? tasksScreen
      : readinessScreen;

    activeScreen.querySelector("h1")?.focus();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  // =====================================================
  // 4. SCREEN 1 — WORKPLACE READINESS
  // =====================================================

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

  const progressCount = document.getElementById("progressCount");
  const progressFill = document.getElementById("progressFill");
  const progressBar = document.getElementById("progressBar");

  const continueButton = document.getElementById("continueButton");

  const overallStatus = document.getElementById("overallStatus");
  const overallDot = document.getElementById("overallDot");

  const summaryTitle = document.getElementById("summaryTitle");
  const summaryText = document.getElementById("summaryText");
  const summaryDone = document.getElementById("summaryDone");
  const summaryLeft = document.getElementById("summaryLeft");
  const buttonHint = document.getElementById("buttonHint");


  function updateReadinessUI() {
    let complete = 0;

    groupNames.forEach(group => {
      const items = checkboxes.filter(
        input => input.dataset.group === group
      );

      const done =
        items.length > 0 &&
        items.every(input => input.checked);

      const pill = document.querySelector(
        `[data-status="${group}"]`
      );

      if (!pill) return;

      if (done) {
        complete++;

        pill.textContent = "Готово";
        pill.className = "status-pill done";
      } else {
        const hasCheckedItems = items.some(
          input => input.checked
        );

        pill.textContent = hasCheckedItems
          ? "В процессе"
          : "Не проверено";

        pill.className = "status-pill pending";
      }
    });

    const total = groupNames.length;

    const percent = Math.round(
      (complete / total) * 100
    );

    if (progressCount) {
      progressCount.textContent = `${complete} из ${total}`;
    }

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    if (progressBar) {
      progressBar.setAttribute(
        "aria-valuenow",
        String(complete)
      );
    }

    if (summaryDone) {
      summaryDone.textContent = `${complete} / ${total}`;
    }

    if (summaryLeft) {
      summaryLeft.textContent = String(total - complete);
    }

    const ready = complete === total;

    if (continueButton) {
      continueButton.disabled = !ready;
    }

    if (ready) {
      if (overallStatus) {
        overallStatus.textContent = "Рабочее место готово";
      }

      if (overallDot) {
        overallDot.className = "status-dot";
        overallDot.style.background = "var(--green-700)";
      }

      if (summaryTitle) {
        summaryTitle.textContent = "Можно приступать";
      }

      if (summaryText) {
        summaryText.textContent =
          "Все обязательные проверки выполнены. Вы можете перейти к доступным заданиям.";
      }

      if (buttonHint) {
        buttonHint.textContent = "Проверки завершены";
      }

    } else {
      if (overallStatus) {
        overallStatus.textContent = "Проверка не завершена";
      }

      if (overallDot) {
        overallDot.className = "status-dot status-pending";
        overallDot.style.background = "";
      }

      if (summaryTitle) {
        summaryTitle.textContent = "Требуется проверка";
      }

      if (summaryText) {
        summaryText.textContent =
          "Выполните все обязательные проверки, чтобы перейти к доступным заданиям.";
      }

      if (buttonHint) {
        buttonHint.textContent =
          "Сначала завершите все проверки";
      }
    }
  }

  checkboxes.forEach(input => {
    input.addEventListener("change", updateReadinessUI);
  });


  // Переход на экран 2

  continueButton?.addEventListener("click", () => {
    if (!continueButton.disabled) {
      showScreen("tasks");
    }
  });


  // =====================================================
  // 5. PROBLEM REPORTING
  // =====================================================

  const problemModal = document.getElementById("problemModal");
  const successModal = document.getElementById("successModal");

  const problemForm = document.getElementById("problemForm");
  const category = document.getElementById("problemCategory");

  const problemDescription = document.getElementById(
    "problemDescription"
  );

  const problemContextStage = document.getElementById(
    "problemContextStage"
  );


  function updateProblemContext() {
    if (!problemContextStage) return;

    const currentStage = tasksScreen && !tasksScreen.hidden
      ? "Список заданий"
      : "Проверка готовности";

    problemContextStage.textContent =
      `Смена · Рабочее место № 04 · Этап «${currentStage}»`;
  }


  function openProblem(defaultCategory = "") {
    if (!problemModal || !problemForm) return;

    problemForm.reset();

    if (defaultCategory && category) {
      category.value = defaultCategory;
    }

    updateProblemContext();

    problemModal.showModal();
  }


  // Верхняя кнопка

  document.getElementById("reportTop")?.addEventListener(
    "click",
    () => openProblem()
  );


  // Кнопка в боковой панели

  document.getElementById("reportSide")?.addEventListener(
    "click",
    () => openProblem()
  );


  // Кнопки внутри карточек проверок

  document.querySelectorAll(".report-inline").forEach(button => {
    button.addEventListener("click", () => {
      openProblem(button.dataset.category);
    });
  });


  // Отмена отправки

  document.getElementById("cancelModal")?.addEventListener(
    "click",
    () => problemModal?.close()
  );


  // Отправка сообщения

  problemForm?.addEventListener("submit", event => {
    event.preventDefault();

    if (
      !category?.value ||
      !problemDescription?.value.trim()
    ) {
      showToast("Заполните обязательные поля.");
      return;
    }

    updateProblemContext();

    problemModal.close();
    successModal?.showModal();
  });


  document.getElementById("closeSuccess")?.addEventListener(
    "click",
    () => successModal?.close()
  );


  // =====================================================
  // 6. SCREEN 2 — TASK LIST
  // =====================================================

  const taskItems = [
    ...document.querySelectorAll(".task-item")
  ];

  const recommendedCard = document.querySelector(
    ".recommended-card"
  );

  const allTasksTab = document.getElementById("allTasksTab");
  const pausedTasksTab = document.getElementById("pausedTasksTab");

  const taskSearch = document.getElementById("taskSearch");
  const priorityFilter = document.getElementById("priorityFilter");

  const tasksEmpty = document.getElementById("tasksEmpty");
  const resultsCount = document.getElementById("resultsCount");

  const allTasksCount = document.getElementById("allTasksCount");
  const pausedTasksCount = document.getElementById("pausedTasksCount");

  const recommendedSection = document.querySelector(
    ".recommended-section"
  );

  let currentTaskTab = "all";


  // Склонение слова «задание»

  function getTaskWord(count) {
    const mod10 = count % 10;
    const mod100 = count % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return "задание";
    }

    if (
      [2, 3, 4].includes(mod10) &&
      ![12, 13, 14].includes(mod100)
    ) {
      return "задания";
    }

    return "заданий";
  }


  // Поиск, фильтрация и отображение заданий

  function updateTaskList() {
    const searchValue = taskSearch?.value
      .trim()
      .toLowerCase() || "";

    const priorityValue = priorityFilter?.value || "all";

    let visibleRegularTasks = 0;

    taskItems.forEach(card => {
      const taskId = (
        card.dataset.taskId || ""
      ).toLowerCase();

      const model = (
        card.dataset.model || ""
      ).toLowerCase();

      const priority = card.dataset.priority;
      const status = card.dataset.status;

      const matchesSearch =
        !searchValue ||
        taskId.includes(searchValue) ||
        model.includes(searchValue);

      const matchesPriority =
        priorityValue === "all" ||
        priority === priorityValue;

      const matchesTab =
        currentTaskTab === "all" ||
        (
          currentTaskTab === "paused" &&
          status === "paused"
        );

      const isVisible =
        matchesSearch &&
        matchesPriority &&
        matchesTab;

      card.hidden = !isVisible;

      if (isVisible && card !== recommendedCard) {
        visibleRegularTasks++;
      }
    });


    // Рекомендованное задание

    let recommendedVisible = false;

    if (recommendedCard) {
      const taskId = (
        recommendedCard.dataset.taskId || ""
      ).toLowerCase();

      const model = (
        recommendedCard.dataset.model || ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue ||
        taskId.includes(searchValue) ||
        model.includes(searchValue);

      const matchesPriority =
        priorityValue === "all" ||
        recommendedCard.dataset.priority === priorityValue;

      recommendedVisible =
        currentTaskTab === "all" &&
        matchesSearch &&
        matchesPriority;

      recommendedCard.hidden = !recommendedVisible;

      if (recommendedSection) {
        recommendedSection.hidden = !recommendedVisible;
      }
    }


    // Счётчики

    const totalVisible =
      visibleRegularTasks +
      (recommendedVisible ? 1 : 0);

    if (resultsCount) {
      resultsCount.textContent =
        `${totalVisible} ${getTaskWord(totalVisible)}`;
    }

    if (tasksEmpty) {
      tasksEmpty.hidden = totalVisible > 0;
    }

    if (allTasksCount) {
      allTasksCount.textContent = String(taskItems.length);
    }

    if (pausedTasksCount) {
      const pausedCount = taskItems.filter(
        card => card.dataset.status === "paused"
      ).length;

      pausedTasksCount.textContent = String(pausedCount);
    }


    // Состояние вкладок

    allTasksTab?.classList.toggle(
      "active",
      currentTaskTab === "all"
    );

    pausedTasksTab?.classList.toggle(
      "active",
      currentTaskTab === "paused"
    );

    allTasksTab?.setAttribute(
      "aria-selected",
      String(currentTaskTab === "all")
    );

    pausedTasksTab?.setAttribute(
      "aria-selected",
      String(currentTaskTab === "paused")
    );
  }


  // Переключение вкладок

  allTasksTab?.addEventListener("click", () => {
    currentTaskTab = "all";
    updateTaskList();
  });

  pausedTasksTab?.addEventListener("click", () => {
    currentTaskTab = "paused";
    updateTaskList();
  });


  // Клавиатурная навигация между вкладками

  [allTasksTab, pausedTasksTab].forEach(tab => {
    if (!tab) return;

    tab.addEventListener("keydown", event => {
      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();

        const nextTab =
          tab === allTasksTab
            ? pausedTasksTab
            : allTasksTab;

        nextTab?.focus();
        nextTab?.click();
      }
    });
  });


  // Поиск

  taskSearch?.addEventListener("input", updateTaskList);


  // Фильтр приоритета

  priorityFilter?.addEventListener(
    "change",
    updateTaskList
  );


  // Сброс фильтров

  document.getElementById("resetTaskFilters")?.addEventListener(
    "click",
    () => {
      if (taskSearch) taskSearch.value = "";

      if (priorityFilter) {
        priorityFilter.value = "all";
      }

      currentTaskTab = "all";

      updateTaskList();
      taskSearch?.focus();
    }
  );


  // Обновление списка заданий

  const refreshButton = document.getElementById("refreshTasks");

  const updatedText = document.getElementById(
    "tasksUpdatedText"
  );

  refreshButton?.addEventListener("click", () => {
    refreshButton.classList.add("refreshing");
    refreshButton.disabled = true;

    if (updatedText) {
      updatedText.textContent = "Обновление списка...";
    }

    // Имитация обращения к MES
    setTimeout(() => {
      refreshButton.classList.remove("refreshing");
      refreshButton.disabled = false;

      if (updatedText) {
        const now = new Date();

        updatedText.textContent =
          "Обновлено в " +
          now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit"
          });
      }

      updateTaskList();

      showToast("Список заданий обновлён.");
    }, 650);
  });


  // =====================================================
  // 7. TASK DETAILS MODAL
  // =====================================================

  const taskModal = document.getElementById("taskModal");


  function openTask(taskId) {
    const card = taskItems.find(
      item => item.dataset.taskId === taskId
    );

    if (!card || !taskModal) return;

    const title =
      card.querySelector("h3")?.textContent.trim() ||
      "Задание";

    const number =
      card.querySelector(".task-number")?.textContent
        .replace("ЗАДАНИЕ №", "")
        .trim() || taskId;

    const priority =
      card.querySelector(".priority-label")?.textContent.trim() ||
      "—";

    const completeness =
      card.querySelector(
        ".task-metrics .task-metric:first-child strong, " +
        ".task-details > div:first-child strong"
      )?.textContent.trim() || "—";

    const operation =
      card.querySelector(
        ".next-operation strong, " +
        ".task-next-operation strong"
      )?.textContent.trim() || "—";

    const description =
      card.querySelector(".task-description")?.textContent.trim() ||
      "Информация о производственном задании.";

    document.getElementById(
      "taskModalTitle"
    ).textContent = title;

    document.getElementById(
      "taskModalDescription"
    ).textContent = description;

    document.getElementById(
      "modalTaskNumber"
    ).textContent = number;

    document.getElementById(
      "modalTaskPriority"
    ).textContent = priority;

    document.getElementById(
      "modalTaskCompleteness"
    ).textContent = completeness;

    document.getElementById(
      "modalTaskOperation"
    ).textContent = operation;

    taskModal.showModal();
  }


  // Кнопки открытия задания

  document.querySelectorAll("[data-open-task]").forEach(button => {
    button.addEventListener("click", () => {
      openTask(button.dataset.openTask);
    });
  });


  // Закрытие карточки задания

  function closeTaskModal() {
    taskModal?.close();
  }

  document.getElementById("closeTaskModal")?.addEventListener(
    "click",
    closeTaskModal
  );

  document.getElementById("closeTaskModalBottom")?.addEventListener(
    "click",
    closeTaskModal
  );


  // =====================================================
  // 8. EMPLOYEE PROFILE
  // =====================================================

  const profileModal = document.getElementById("profileModal");

  document.getElementById("profileButton")?.addEventListener(
    "click",
    () => profileModal?.showModal()
  );

  document.getElementById("closeProfile")?.addEventListener(
    "click",
    () => profileModal?.close()
  );

  document.getElementById("closeProfileBottom")?.addEventListener(
    "click",
    () => profileModal?.close()
  );


  // =====================================================
  // 9. END OF SHIFT
  // =====================================================

  const endShiftModal = document.getElementById(
    "endShiftModal"
  );

  document.getElementById("endShiftButton")?.addEventListener(
    "click",
    () => endShiftModal?.showModal()
  );


  function closeEndShiftModal() {
    endShiftModal?.close();
  }

  document.getElementById("closeEndShift")?.addEventListener(
    "click",
    closeEndShiftModal
  );

  document.getElementById("cancelEndShift")?.addEventListener(
    "click",
    closeEndShiftModal
  );


  document.getElementById("confirmEndShift")?.addEventListener(
    "click",
    () => {
      endShiftModal?.close();

      showToast(
        "Состояние заданий сохранено. Демонстрационная смена завершена."
      );
    }
  );


  // =====================================================
  // 10. DIALOGS — CLOSE ON BACKDROP CLICK
  // =====================================================

  const dialogs = [
    problemModal,
    successModal,
    taskModal,
    endShiftModal,
    profileModal
  ].filter(Boolean);

  dialogs.forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });


  // =====================================================
  // 11. INITIALIZATION
  // =====================================================

  updateReadinessUI();
  updateTaskList();

})();
