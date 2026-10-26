export const BOOK_STATUSES = [
  { id: "to-read", label: "To Read", icon: "📖" },
  { id: "reading", label: "Reading", icon: "⏳" },
  { id: "completed", label: "Completed", icon: "✅" },
];

export const STATUS_ICONS = Object.fromEntries(
  BOOK_STATUSES.map(({ id, icon }) => [id, icon]),
);
