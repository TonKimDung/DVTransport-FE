export const APPLICATION_STATUS = {
  REVIEWING: "REVIEWING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ApplicationStatus =
  typeof APPLICATION_STATUS[
    keyof typeof APPLICATION_STATUS
  ];