(() => {

  /* =========================================
     DEMO AUTHORIZATION
  ========================================= */

  const DEMO_USERNAME = "s.ivanov";
  const DEMO_PASSWORD = "MES2026!";

  const loginScreen = document.getElementById("loginScreen");
  const appContent = document.getElementById("appContent");
  const loginForm = document.getElementById("loginForm");
  const loginError = document.getElementById("loginError");
  const passwordInput = document.getElementById("loginPassword");

  // Проверка учётных данных
  loginForm.addEventListener("submit", event => {
    event.preventDefault();

    const username = document
      .getElementById("loginUsername")
      .value.trim();

    const password = passwordInput.value;

    if (
      username !== DEMO_USERNAME ||
      password !== DEMO_PASSWORD
    ) {
      loginError.textContent =
        "Неверный логин или пароль. Используйте демонстрационные данные.";

      return;
    }

    loginError.textContent = "";

    // Скрываем авторизацию
    loginScreen.hidden = true;

    // Открываем экран 1
    appContent.hidden = false;

    // Передаём фокус основному заголовку
    const pageTitle = document.querySelector(".main-content h1");

    if (pageTitle) {
      pageTitle.setAttribute("tabindex", "-1");
      pageTitle.focus();
    }
  });


  // Показать / скрыть пароль
  document
    .getElementById("togglePassword")
    .addEventListener("click", () => {

      const reveal = passwordInput.type === "password";

      passwordInput.type = reveal ? "text" : "password";

      const toggleButton =
        document.getElementById("togglePassword");

      toggleButton.textContent = reveal ? "Скрыть" : "Показать";

      toggleButton.setAttribute(
        "aria-label",
        reveal ? "Скрыть пароль" : "Показать пароль"
      );
    });


  /* =========================================
     READINESS CHECKS
  ========================================= */

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

  const progressCount =
    document.getElementById("progressCount");

  const progressFill =
    document.getElementById("progressFill");

  const progressBar =
    document.getElementById("progressBar");

  const continueButton =
    document.getElementById("continueButton");

  const overallStatus =
    document.getElementById("overallStatus");

  const overallDot =
    document.getElementById("overallDot");

  const summaryTitle =
    document.getElementById("summaryTitle");

  const summaryText =
    document.getElementById("summaryText");

  const summaryDone =
    document.getElementById("summaryDone");

  const summaryLeft =
    document.getElementById("summaryLeft");

  const buttonHint =
    document.getElementById("buttonHint");


  // Обновление статусов и прогресса
  function updateUI() {

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

      if (done) {

        complete++;

        pill.textContent = "Готово";
        pill.className = "status-pill done";

      } else {

        pill.textContent = items.some(
          input => input.checked
        )
          ? "В процессе"
          : "Не проверено";

        pill.className = "status-pill pending";
      }

    });


    const total = groupNames.length;

    const percent = Math.round(
      (complete / total) * 100
    );

    // Общий прогресс
    progressCount.textContent =
      `${complete} из ${total}`;

    progressFill.style.width =
      `${percent}%`;

    progressBar.setAttribute(
      "aria-valuenow",
      String(complete)
    );

    // Статистика
    summaryDone.textContent =
      `${complete} / ${total}`;

    summaryLeft.textContent =
      String(total - complete);


    // Проверка общей готовности
    const ready = complete === total;

    continueButton.disabled = !ready;


    if (ready) {

      overallStatus.textContent =
        "Рабочее место готово";

      overallDot.className = "status-dot";

      overallDot.style.background =
        "var(--green-700)";

      summaryTitle.textContent =
        "Можно приступать";

      summaryText.textContent =
        "Все обязательные проверки выполнены. Вы можете перейти к доступным заданиям.";

      buttonHint.textContent =
        "Проверки завершены";

    } else {

      overallStatus.textContent =
        "Проверка не завершена";

      overallDot.className =
        "status-dot status-pending";

      overallDot.style.background = "";

      summaryTitle.textContent =
        "Требуется проверка";

      summaryText.textContent =
        "Выполните все обязательные проверки, чтобы перейти к доступным заданиям.";

      buttonHint.textContent =
        "Сначала завершите все проверки";
    }

  }


  // Слушатели чекбоксов
  checkboxes.forEach(input => {

    input.addEventListener(
      "change",
      updateUI
    );

  });


  /* =========================================
     TOAST NOTIFICATIONS
  ========================================= */

  const toast = document.getElementById("toast");

  let toastTimer;

  function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

      toast.classList.remove("show");

    }, 2600);

  }


  /* =========================================
     PROBLEM REPORT
  ========================================= */

  const problemModal =
    document.getElementById("problemModal");

  const successModal =
    document.getElementById("successModal");

  const nextModal =
    document.getElementById("nextModal");

  const category =
    document.getElementById("problemCategory");


  // Открытие формы сообщения о проблеме
  function openProblem(defaultCategory = "") {

    document
      .getElementById("problemForm")
      .reset();

    if (defaultCategory) {
      category.value = defaultCategory;
    }

    problemModal.showModal();

  }


  // Кнопка в верхней панели
  document
    .getElementById("reportTop")
    .addEventListener("click", () => {

      openProblem();

    });


  // Кнопка в боковой панели
  document
    .getElementById("reportSide")
    .addEventListener("click", () => {

      openProblem();

    });


  // Кнопки внутри карточек проверок
  document
    .querySelectorAll(".report-inline")
    .forEach(button => {

      button.addEventListener("click", () => {

        openProblem(button.dataset.category);

      });

    });


  // Закрытие формы
  document
    .getElementById("cancelModal")
    .addEventListener("click", () => {

      problemModal.close();

    });


  // Отправка сообщения
  document
    .getElementById("problemForm")
    .addEventListener("submit", event => {

      event.preventDefault();

      const description = document
        .getElementById("problemDescription")
        .value.trim();

      if (!category.value || !description) {

        showToast("Заполните обязательные поля.");

        return;
      }

      problemModal.close();

      successModal.showModal();

    });


  // Закрытие подтверждения
  document
    .getElementById("closeSuccess")
    .addEventListener("click", () => {

      successModal.close();

    });


  /* =========================================
     CONTINUE TO TASKS
  ========================================= */

// Переход с проверки готовности на список заданий
const readinessScreen = document.getElementById("readinessScreen");
const tasksScreen = document.getElementById("tasksScreen");

function showScreen(screenName) {
  const isTasksScreen = screenName === "tasks";

  readinessScreen.hidden = isTasksScreen;
  tasksScreen.hidden = !isTasksScreen;

  if (isTasksScreen) {
    tasksScreen.querySelector("h1")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    readinessScreen.querySelector("h1")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

continueButton.addEventListener("click", () => {
  if (!continueButton.disabled) {
    showScreen("tasks");
  }
});


  /* =========================================
     MODAL BACKDROP
  ========================================= */

  [
    problemModal,
    successModal,
    nextModal
  ].forEach(dialog => {

    dialog.addEventListener("click", event => {

      if (event.target === dialog) {

        dialog.close();

      }

    });

  });


  /* =========================================
     INITIALIZATION
  ========================================= */

  updateUI();

})();
