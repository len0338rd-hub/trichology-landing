export const cookieConsentContent = {
  title: "Ваш выбор cookies",
  description:
    "Мы используем необходимый cookie, чтобы запомнить ваш выбор. Аналитические и маркетинговые cookies включаются только с вашего согласия.",
  settingsTitle: "Настройки cookies",
  settingsDescription:
    "Вы можете изменить этот выбор в любое время через ссылку внизу сайта.",
  policyLabel: "Подробнее в политике cookies",
  acceptAllLabel: "Принять все",
  rejectOptionalLabel: "Отклонить необязательные",
  customizeLabel: "Настроить",
  saveLabel: "Сохранить выбор",
  categories: {
    necessary: {
      title: "Необходимые",
      description:
        "Нужны для сохранения выбора cookies и безопасной работы сайта. Отключить их нельзя.",
    },
    analytics: {
      title: "Аналитические",
      description:
        "Помогают понять, как используется сайт. Сейчас аналитические инструменты не подключены.",
    },
    marketing: {
      title: "Маркетинговые",
      description:
        "Могут использоваться для оценки рекламы. Сейчас рекламные пиксели не подключены.",
    },
  },
} as const;
