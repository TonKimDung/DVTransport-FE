export function formatDate(
  date?: string
) {
  if (!date)
    return "-";

  return new Date(
    date
  ).toLocaleDateString(
    "vi-VN"
  );
}