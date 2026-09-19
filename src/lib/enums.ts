/**
 * SQLite has no native enum type, so these are stored as plain `String`
 * columns in the database (see prisma/schema.prisma) and validated at the
 * application boundary instead (Zod schemas on API routes, and these TS
 * union types everywhere else).
 */
export const ROLES = ["USER", "ADMIN", "OWNER"] as const;
export type Role = (typeof ROLES)[number];

export const NOTIFICATION_TYPES = ["password_changed"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const HEALTH_STATUSES = ["healthy", "warning", "error"] as const;
export type HealthStatus = (typeof HEALTH_STATUSES)[number];
