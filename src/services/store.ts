/**
 * @deprecated
 *
 * This file is temporary.
 *
 * It will be removed after backend integration.
 */

// --- Types ---
export type UserRole = "resident" | "admin" | "super-admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  ward: string;
  lga: string;
  state: string;
  avatar?: string;
  password?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: "roads" | "water" | "power" | "sanitation" | "health" | "education" | "security" | "other";
  status: "pending" | "under-review" | "resolved" | "dismissed";
  ward: string;
  lga: string;
  upvotes: number;
  createdAt: string;
  updatedAt: string;
  resolution?: string;
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  createdAt: string;
}

// --- Mock JWT ---
const JWT_SECRET = "ccng-simulated-jwt-secret-2024";

function base64Encode(data: string): string {
  return btoa(unescape(encodeURIComponent(data)));
}

function base64Decode(data: string): string {
  return decodeURIComponent(escape(atob(data)));
}

function createToken(payload: Record<string, unknown>): string {
  const header = base64Encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Encode(JSON.stringify({ ...payload, iat: Date.now(), exp: Date.now() + 86400000 }));
  const signature = base64Encode(JWT_SECRET + JSON.stringify(payload));
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const body = JSON.parse(base64Decode(parts[1]));
    if (body.exp && body.exp < Date.now()) return null;
    return body;
  } catch {
    return null;
  }
}

// --- UUID Generator (fallback if uuid not installed) ---
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// --- Store Class ---
class Store {
  private readonly STORAGE_KEY = "ccng_db";
  private readonly AUTH_KEY = "ccng_token";

  private data: {
    users: User[];
    reports: Report[];
    comments: Comment[];
    announcements: Announcement[];
    notifications: Notification[];
    auditLogs: AuditLog[];
  };

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      this.data = JSON.parse(saved);
    } else {
      this.data = this.getSeedData();
      this.persist();
    }
  }

  private getSeedData() {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();

    const superAdmin: User = {
     id: "super-admin-001",
     email: "okutu@communityconnect.ng",
     password:"password",
     name: "Okutu Anthony",
     role: "super-admin",
     ward: "ward 9",
     lga: "Oshimili North",
     state: "Delta",
     createdAt: new Date().toISOString(),
   };

    const adminUser: User = {
      id: "admin-001",
      email: "admin@communityconnect.ng",
      password:"password",
      name: "Adebayo Ogunlana",
      role: "admin",
      ward: "Ikeja Central",
      lga: "Ikeja",
      state: "Lagos",
      createdAt: twoDaysAgo,
    };

    const residentUser: User = {
      id: "resident-001",
      email: "chioma@example.com",
      password:"password",
      name: "Chioma Nwosu",
      role: "resident",
      ward: "Garki Unit 1",
      lga: "Abuja Municipal",
      state: "FCT",
      createdAt: yesterday,
    };

    const resident2: User = {
      id: "resident-002",
      email: "emeka@example.com",
      password:"password",
      name: "Emeka Okafor",
      role: "resident",
      ward: "Asaba North",
      lga: "Oshimili",
      state: "Delta",
      createdAt: twoDaysAgo,
    };

    const reports: Report[] = [
      {
        id: "rpt-001",
        userId: "resident-001",
        userName: "Chioma Nwosu",
        title: "Burst water pipe on Ahmadu Bello Way",
        description: "A major water pipe burst three days ago. Water is flooding the road and causing traffic disruptions. No response from authorities yet.",
        category: "water",
        status: "under-review",
        ward: "Garki Unit 1",
        lga: "Abuja Municipal",
        upvotes: 12,
        createdAt: yesterday,
        updatedAt: now,
      },
      {
        id: "rpt-002",
        userId: "resident-002",
        userName: "Emeka Okafor",
        title: "Pothole on Okpanam Road causing accidents",
        description: "Deep pothole on the main road near the market. Two motorcycles have had accidents this week. Needs urgent repair.",
        category: "roads",
        status: "pending",
        ward: "Asaba North",
        lga: "Oshimili",
        upvotes: 8,
        createdAt: twoDaysAgo,
        updatedAt: twoDaysAgo,
      },
      {
        id: "rpt-003",
        userId: "resident-001",
        userName: "Chioma Nwosu",
        title: "Irregular power supply in Garki area",
        description: "We've had only 4 hours of electricity daily for the past two weeks. This is affecting small businesses severely.",
        category: "power",
        status: "resolved",
        ward: "Garki Unit 1",
        lga: "Abuja Municipal",
        upvotes: 24,
        createdAt: twoDaysAgo,
        updatedAt: now,
        resolution: "Dispatched maintenance team to the Garki substation. Faulty transformer has been replaced. Power supply is now stable.",
      },
    ];

    const comments: Comment[] = [
      {
        id: "cmt-001",
        reportId: "rpt-001",
        userId: "resident-002",
        userName: "Emeka Okafor",
        userRole: "resident",
        content: "I saw this yesterday. The water is now reaching the main road. This needs urgent attention.",
        createdAt: yesterday,
      },
      {
        id: "cmt-002",
        reportId: "rpt-001",
        userId: "admin-001",
        userName: "Adebayo Ogunlesi",
        userRole: "admin",
        content: "Thank you for the report. We have dispatched a team from the Abuja Water Board. They should arrive within 24 hours.",
        createdAt: now,
      },
      {
        id: "cmt-003",
        reportId: "rpt-003",
        userId: "resident-002",
        userName: "Emeka Okafor",
        userRole: "resident",
        content: "Great to hear this is resolved. The lights have been stable for the past 3 days. Thank you.",
        createdAt: now,
      },
    ];

    const announcements: Announcement[] = [
      {
        id: "ann-001",
        title: "Community Town Hall Meeting - Q2 2025",
        content: "The FCT Administration invites all residents to the quarterly town hall meeting on April 15th at the Unity Hall, Abuja. Agenda includes infrastructure updates, budget allocation, and community feedback session.",
        authorName: "Adebayo Ogunlesi",
        createdAt: yesterday,
      },
      {
        id: "ann-002",
        title: "New Waste Collection Schedule",
        content: "The Abuja Environmental Protection Board has revised the waste collection schedule for Garki and Wuse districts. Collection will now be on Mondays, Wednesdays, and Fridays. Please ensure bins are out by 7 AM.",
        authorName: "Adebayo Ogunlesi",
        createdAt: twoDaysAgo,
      },
    ];

    const notifications: Notification[] = [
      {
        id: "notif-001",
        userId: "resident-001",
        title: "Report Under Review",
        message: "Your report 'Burst water pipe on Ahmadu Bello Way' is now under review by the authorities.",
        read: false,
        createdAt: now,
      },
      {
        id: "notif-002",
        userId: "resident-001",
        title: "Report Resolved",
        message: "Your report 'Irregular power supply in Garki area' has been marked as resolved.",
        read: true,
        createdAt: now,
      },
      {
        id: "notif-003",
        userId: "resident-002",
        title: "New Announcement",
        message: "New announcement: Community Town Hall Meeting - Q2 2025",
        read: false,
        createdAt: yesterday,
      },
    ];

    const auditLogs: AuditLog[] = [
      {
        id: "log-001",
        userId: "admin-001",
        userName: "Adebayo Ogunlesi",
        action: "REPORT_STATUS_CHANGE",
        details: "Changed status of rpt-001 from 'pending' to 'under-review'",
        createdAt: now,
      },
      {
        id: "log-002",
        userId: "admin-001",
        userName: "Adebayo Ogunlesi",
        action: "REPORT_RESOLVED",
        details: "Marked report rpt-003 as resolved with resolution notes",
        createdAt: now,
      },
      {
        id: "log-003",
        userId: "admin-001",
        userName: "Adebayo Ogunlesi",
        action: "ANNOUNCEMENT_CREATED",
        details: "Posted announcement 'Community Town Hall Meeting - Q2 2025'",
        createdAt: yesterday,
      },
    ];

    return {
      users: [superAdmin, adminUser, residentUser, resident2],
      reports,
      comments,
      announcements,
      notifications,
      auditLogs,
    };
  }

  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
  }

  // --- Auth ---
 login(email: string, password: string): { user: User; token: string } | null {

  console.log("========== LOGIN ==========");
  console.log("Email entered:", email);
  console.log("Password entered:", password);

  console.log("All users:", this.data.users);

  const user = this.data.users.find(
    (u) => u.email === email.toLowerCase()
  );

  console.log("Matched user:", user);

  if (!user) {
    console.log("❌ User not found");
    return null;
  }

  console.log("Stored password:", user.password);

  if (user.password !== password) {
    console.log("❌ Password mismatch");
    return null;
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  localStorage.setItem(this.AUTH_KEY, token);
  localStorage.setItem("ccng_current_user", JSON.stringify(user));

  console.log("✅ Login successful");

  return { user, token };
}
  register(data: { email: string; name: string; password: string; role: UserRole; ward: string; lga: string; state: string }): { user: User; token: string } {
    const existingUser = this.data.users.find((u) => u.email === data.email.toLowerCase());
    if (existingUser) throw new Error("A user with this email already exists.");

   const user: User = {
    id: generateId(),
    email: data.email.toLowerCase(),
    password: data.password,
    name: data.name,
    role: data.role,
    ward: data.ward,
    lga: data.lga,
    state: data.state,
    createdAt: new Date().toISOString(),
};
    this.data.users.push(user);
    this.persist();

    const token = createToken({ id: user.id, email: user.email, role: user.role });
    localStorage.setItem("ccng_current_user", JSON.stringify(user));
    return { user, token };
    }

    getCurrentUser(): User | null {
    const token = localStorage.getItem(this.AUTH_KEY);
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;
    return this.data.users.find(
  (u) => u.id === String(payload.id)
  ) || null;
  }

  isAdmin() {
    return this.getCurrentUser()?.role === "admin";
  }

  isSuperAdmin() {
    return this.getCurrentUser()?.role === "super-admin";
  }

  isResident() {
    return this.getCurrentUser()?.role === "resident";
  }

  getToken(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    localStorage.removeItem("ccng_current_user");
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.AUTH_KEY);
    if (!token) return false;
    return verifyToken(token) !== null;
  }

  // --- Password Reset Simulation ---
  generateResetToken(email: string): string | null {
    const user = this.data.users.find((u) => u.email === email.toLowerCase());
    if (!user) return null;
    const resetToken = generateId() + "-" + generateId();
    localStorage.setItem("ccng_reset_" + email.toLowerCase(), resetToken);
    return resetToken;
  }

  verifyResetToken(email: string, token: string): boolean {
    const stored = localStorage.getItem("ccng_reset_" + email.toLowerCase());
    return stored === token;
  }

  resetPassword(email: string, _token: string, newPassword: string): boolean {
    const user = this.data.users.find((u) => u.email === email.toLowerCase());
    if (!user) return false;
    // Simulate storing a password hash for the user on reset.
    localStorage.setItem("ccng_password_" + email.toLowerCase(), btoa(newPassword));
    localStorage.removeItem("ccng_reset_" + email.toLowerCase());
    return true;
  }

  // --- Reports ---
  getReports(): Report[] {
    return [...this.data.reports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getReportsByUser(userId: string): Report[] {
    return this.data.reports.filter((r) => r.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getReport(id: string): Report | undefined {
    return this.data.reports.find((r) => r.id === id);
  }

  createReport(report: Omit<Report, "id" | "createdAt" | "updatedAt" | "status" | "upvotes">): Report {
    const newReport: Report = {
      ...report,
      id: "rpt-" + generateId(),
      status: "pending",
      upvotes: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.reports.push(newReport);
    this.addAuditLog(report.userId, report.userName, "REPORT_CREATED", `Created report: ${report.title}`);
    this.persist();
    return newReport;
  }

  updateReportStatus(id: string, status: Report["status"], resolution?: string, adminId?: string, adminName?: string): Report | undefined {
    const report = this.data.reports.find((r) => r.id === id);
    if (!report) return undefined;
    report.status = status;
    report.updatedAt = new Date().toISOString();
    if (resolution) report.resolution = resolution;
    if (adminId && adminName) {
      this.addAuditLog(adminId, adminName, `REPORT_${status === "resolved" ? "RESOLVED" : status === "under-review" ? "STATUS_CHANGE" : "STATUS_CHANGE"}`, `Changed status of ${id} to '${status}'`);
    }
    this.persist();
    return report;
  }

  upvoteReport(id: string): Report | undefined {
    const report = this.data.reports.find((r) => r.id === id);
    if (!report) return undefined;
    report.upvotes += 1;
    this.persist();
    return report;
  }

  // --- Comments ---
  getComments(reportId: string): Comment[] {
    return this.data.comments.filter((c) => c.reportId === reportId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  addComment(comment: Omit<Comment, "id" | "createdAt">): Comment {
    const newComment: Comment = {
      ...comment,
      id: "cmt-" + generateId(),
      createdAt: new Date().toISOString(),
    };
    this.data.comments.push(newComment);
    this.persist();
    return newComment;
  }

  deleteComment(id: string): boolean {
    const idx = this.data.comments.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.comments.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- Announcements ---
  getAnnouncements(): Announcement[] {
    return [...this.data.announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createAnnouncement(announcement: Omit<Announcement, "id" | "createdAt">): Announcement {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: "ann-" + generateId(),
      createdAt: new Date().toISOString(),
    };
    this.data.announcements.push(newAnnouncement);
    this.addAuditLog(announcement.authorName, announcement.authorName, "ANNOUNCEMENT_CREATED", `Posted announcement: ${announcement.title}`);
    this.persist();
    return newAnnouncement;
  }

  // --- Notifications ---
  getNotifications(userId: string): Notification[] {
    return this.data.notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUnreadNotificationCount(userId: string): number {
    return this.data.notifications.filter((n) => n.userId === userId && !n.read).length;
  }

  markNotificationRead(id: string): void {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  markAllNotificationsRead(userId: string): void {
    this.data.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.persist();
  }

  // --- Audit Logs ---
  getAuditLogs(): AuditLog[] {
    return [...this.data.auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  private addAuditLog(userId: string, userName: string, action: string, details: string): void {
    this.data.auditLogs.push({
      id: "log-" + generateId(),
      userId,
      userName,
      action,
      details,
      createdAt: new Date().toISOString(),
    });
  }

  // --- Stats ---
  getStats() {
  const totalReports = this.data.reports.length;
  const resolved = this.data.reports.filter((r) => r.status === "resolved").length;
  const pending = this.data.reports.filter((r) => r.status === "pending").length;
  const underReview = this.data.reports.filter((r) => r.status === "under-review").length;
  const totalUsers = this.data.users.length;
  const totalComments = this.data.comments.length;
  const totalAnnouncements = this.data.announcements.length;
  const totalNotifications = this.data.notifications.length;

  // NEW
  const activeUsers = this.data.users.length;

  const admins = this.data.users.filter(
    (u) => u.role === "admin"
  ).length;

  const superAdmins = this.data.users.filter(
    (u) => u.role === "super-admin"
  ).length;

  const residents = this.data.users.filter(
    (u) => u.role === "resident"
  ).length;

  return {
    totalReports,
    resolved,
    pending,
    underReview,
    totalUsers,
    totalComments,
    totalAnnouncements,
    totalNotifications,

    // NEW
    activeUsers,
    admins,
    superAdmins,
    residents,
    resolutionRate:
      totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0,
  };
  }

  // ----------------------
  // Super Admin Helpers
  // ----------------------

  getAllUsers() {
   return this.data.users;
  }

  getAllReports() {
    return this.data.reports;
  }

  getAllComments() {
    return this.data.comments;
  }

  getAllAnnouncements() {
    return this.data.announcements;
  }

  getAllNotifications() {
    return this.data.notifications;
  }

  getRecentUsers(limit = 5) {
    return [...this.data.users]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }

  getRecentReports(limit = 5) {
    return [...this.data.reports]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      )
      .slice(0, limit);
  }

  getSystemHealth() {
    return {
      uptime: "99.98%",
      database: "Healthy",
      api: "Operational",
      storage: "72%",
      memory: "54%",
      cpu: "18%",
    };
  }

  // --- Users ---
  getUser(id: string) {
    return this.data.users.find(
      u => u.id === id
    );
  }

// -----------------------------
// Analytics
// -----------------------------
getAnalytics() {
  // Reports by Month
  const monthlyMap: Record<string, number> = {};

  this.data.reports.forEach((report) => {
    const month = new Date(report.createdAt).toLocaleString("en-NG", {
      month: "short",
    });

    monthlyMap[month] = (monthlyMap[month] || 0) + 1;
  });

  const monthlyReports = Object.entries(monthlyMap).map(
    ([month, reports]) => ({
      month,
      reports,
    })
  );

  // Reports by Category
  const categoryMap: Record<string, number> = {};

  this.data.reports.forEach((report) => {
    categoryMap[report.category] =
      (categoryMap[report.category] || 0) + 1;
  });

  const categoryReports = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Reports by LGA
  const lgaMap: Record<string, number> = {};

  this.data.reports.forEach((report) => {
    lgaMap[report.lga] =
      (lgaMap[report.lga] || 0) + 1;
  });

  const lgaReports = Object.entries(lgaMap).map(
    ([name, reports]) => ({
      name,
      reports,
    })
  );

  return {
    monthlyReports,
    categoryReports,
    lgaReports,
  };
}
}
export const store = new Store();