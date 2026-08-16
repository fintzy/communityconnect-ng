/**
 * CommunityConnect NG
 * Temporary local storage store.
 *
 * This file is designed for the current frontend/demo stage.
 * It will be replaced by the backend/API integration later.
 */

// ============================================================
// TYPES
// ============================================================

export type UserRole =
  | "resident"
  | "admin"
  | "super-admin";

export type ReportCategory =
  | "roads"
  | "water"
  | "power"
  | "sanitation"
  | "health"
  | "education"
  | "security"
  | "other";

export type ReportStatus =
  | "pending"
  | "under-review"
  | "resolved"
  | "dismissed";

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

  // Resident who created the report
  userId: string;
  userName: string;

  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;

  // Location belonging to the report
  ward: string;
  lga: string;
  state?: string;

  // ==========================================================
  // INCIDENT EVIDENCE
  // ==========================================================

  /**
   * Base64/data URL representation of the captured image.
   * This is suitable for the current localStorage demo.
   *
   * Later, this should be replaced by an uploaded image URL
   * from the backend/cloud storage.
   */
  photo?: string;

  /**
   * Original/generated filename of the captured image.
   */
  photoName?: string;

  // ==========================================================
  // GPS LOCATION
  // ==========================================================

  latitude?: number;
  longitude?: number;

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

// ============================================================
// MOCK JWT
// ============================================================

const JWT_SECRET =
  "ccng-simulated-jwt-secret-2024";

function base64Encode(
  data: string
): string {
  return btoa(
    unescape(
      encodeURIComponent(data)
    )
  );
}

function base64Decode(
  data: string
): string {
  return decodeURIComponent(
    escape(atob(data))
  );
}

function createToken(
  payload: Record<string, unknown>
): string {
  const header = base64Encode(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  );

  const body = base64Encode(
    JSON.stringify({
      ...payload,
      iat: Date.now(),
      exp: Date.now() + 86400000,
    })
  );

  const signature = base64Encode(
    JWT_SECRET +
      JSON.stringify(payload)
  );

  return `${header}.${body}.${signature}`;
}

function verifyToken(
  token: string
): Record<string, unknown> | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const body = JSON.parse(
      base64Decode(parts[1])
    ) as Record<string, unknown>;

    if (
      typeof body.exp === "number" &&
      body.exp < Date.now()
    ) {
      return null;
    }

    return body;
  } catch {
    return null;
  }
}

// ============================================================
// ID GENERATOR
// ============================================================

function generateId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c) => {
      const r =
        (Math.random() * 16) | 0;

      const v =
        c === "x"
          ? r
          : (r & 0x3) | 0x8;

      return v.toString(16);
    }
  );
}

// ============================================================
// STORE DATA TYPE
// ============================================================

interface StoreData {
  users: User[];
  reports: Report[];
  comments: Comment[];
  announcements: Announcement[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

// ============================================================
// STORE
// ============================================================

class Store {
  private readonly STORAGE_KEY =
    "ccng_db";

  private readonly AUTH_KEY =
    "ccng_token";

  private data: StoreData;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor() {
    const saved =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    if (saved) {
      try {
        const parsed = JSON.parse(
          saved
        ) as Partial<StoreData>;

        /*
         * Merge the saved database with
         * safe defaults. This protects the
         * application when the structure of
         * the store changes during development.
         */
        this.data = {
          users: Array.isArray(
            parsed.users
          )
            ? parsed.users
            : [],
          reports: Array.isArray(
            parsed.reports
          )
            ? parsed.reports
            : [],
          comments: Array.isArray(
            parsed.comments
          )
            ? parsed.comments
            : [],
          announcements:
            Array.isArray(
              parsed.announcements
            )
              ? parsed.announcements
              : [],
          notifications:
            Array.isArray(
              parsed.notifications
            )
              ? parsed.notifications
              : [],
          auditLogs: Array.isArray(
            parsed.auditLogs
          )
            ? parsed.auditLogs
            : [],
        };
      } catch {
        this.data =
          this.getSeedData();

        this.persist();
      }
    } else {
      this.data =
        this.getSeedData();

      this.persist();
    }
  }

  // ==========================================================
  // SEED DATA
  // ==========================================================

  private getSeedData(): StoreData {
    const now =
      new Date().toISOString();

    const yesterday =
      new Date(
        Date.now() - 86400000
      ).toISOString();

    const twoDaysAgo =
      new Date(
        Date.now() - 172800000
      ).toISOString();

    // --------------------------------------------------------
    // SUPER ADMIN
    // --------------------------------------------------------

    const superAdmin: User = {
      id: "super-admin-001",
      email:
        "okutu@communityconnect.ng",
      password: "password",
      name: "Okutu Anthony",
      role: "super-admin",
      ward: "Ward 9",
      lga: "Oshimili North",
      state: "Delta",
      createdAt: now,
    };

    // --------------------------------------------------------
    // ADMIN
    // --------------------------------------------------------

    const adminUser: User = {
      id: "admin-001",
      email:
        "admin@communityconnect.ng",
      password: "password",
      name: "Adebayo Ogunlana",
      role: "admin",
      ward: "Ikeja Central",
      lga: "Ikeja",
      state: "Lagos",
      createdAt: twoDaysAgo,
    };

    // --------------------------------------------------------
    // RESIDENT
    // --------------------------------------------------------

    const residentUser: User = {
      id: "resident-001",
      email:
        "chioma@example.com",
      password: "password",
      name: "Chioma Nwosu",
      role: "resident",
      ward: "Garki Unit 1",
      lga: "Abuja Municipal",
      state: "FCT",
      createdAt: yesterday,
    };

    // --------------------------------------------------------
    // SECOND RESIDENT
    // --------------------------------------------------------

    const resident2: User = {
      id: "resident-002",
      email:
        "emeka@example.com",
      password: "password",
      name: "Emeka Okafor",
      role: "resident",
      ward: "Asaba North",
      lga: "Oshimili",
      state: "Delta",
      createdAt: twoDaysAgo,
    };

    // ========================================================
    // REPORTS
    // ========================================================

    const reports: Report[] = [
      {
        id: "rpt-001",

        userId: "resident-001",

        userName: "Chioma Nwosu",

        title:
          "Burst water pipe on Ahmadu Bello Way",

        description:
          "A major water pipe burst three days ago. Water is flooding the road and causing traffic disruptions. No response from authorities yet.",

        category: "water",

        status: "under-review",

        ward: "Garki Unit 1",

        lga: "Abuja Municipal",

        state: "FCT",

        upvotes: 12,

        createdAt: yesterday,

        updatedAt: now,
      },

      {
        id: "rpt-002",

        userId: "resident-002",

        userName: "Emeka Okafor",

        title:
          "Pothole on Okpanam Road causing accidents",

        description:
          "Deep pothole on the main road near the market. Two motorcycles have had accidents this week. Needs urgent repair.",

        category: "roads",

        status: "pending",

        ward: "Asaba North",

        lga: "Oshimili",

        state: "Delta",

        upvotes: 8,

        createdAt: twoDaysAgo,

        updatedAt: twoDaysAgo,
      },

      {
        id: "rpt-003",

        userId: "resident-001",

        userName: "Chioma Nwosu",

        title:
          "Irregular power supply in Garki area",

        description:
          "We've had only 4 hours of electricity daily for the past two weeks. This is affecting small businesses severely.",

        category: "power",

        status: "resolved",

        ward: "Garki Unit 1",

        lga: "Abuja Municipal",

        state: "FCT",

        upvotes: 24,

        createdAt: twoDaysAgo,

        updatedAt: now,

        resolution:
          "Dispatched maintenance team to the Garki substation. Faulty transformer has been replaced. Power supply is now stable.",
      },
    ];

    // ========================================================
    // COMMENTS
    // ========================================================

    const comments: Comment[] = [
      {
        id: "cmt-001",

        reportId: "rpt-001",

        userId: "resident-002",

        userName: "Emeka Okafor",

        userRole: "resident",

        content:
          "I saw this yesterday. The water is now reaching the main road. This needs urgent attention.",

        createdAt: yesterday,
      },

      {
        id: "cmt-002",

        reportId: "rpt-001",

        userId: "admin-001",

        userName: "Adebayo Ogunlana",

        userRole: "admin",

        content:
          "Thank you for the report. We have dispatched a team from the Abuja Water Board. They should arrive within 24 hours.",

        createdAt: now,
      },

      {
        id: "cmt-003",

        reportId: "rpt-003",

        userId: "resident-002",

        userName: "Emeka Okafor",

        userRole: "resident",

        content:
          "Great to hear this is resolved. The lights have been stable for the past 3 days. Thank you.",

        createdAt: now,
      },
    ];

    // ========================================================
    // ANNOUNCEMENTS
    // ========================================================

    const announcements: Announcement[] = [
      {
        id: "ann-001",

        title:
          "Community Town Hall Meeting - Q2 2025",

        content:
          "The FCT Administration invites all residents to the quarterly town hall meeting on April 15th at the Unity Hall, Abuja. Agenda includes infrastructure updates, budget allocation, and community feedback session.",

        authorName:
          "Adebayo Ogunlana",

        createdAt: yesterday,
      },

      {
        id: "ann-002",

        title:
          "New Waste Collection Schedule",

        content:
          "The Abuja Environmental Protection Board has revised the waste collection schedule for Garki and Wuse districts. Collection will now be on Mondays, Wednesdays, and Fridays. Please ensure bins are out by 7 AM.",

        authorName:
          "Adebayo Ogunlana",

        createdAt: twoDaysAgo,
      },
    ];

    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    const notifications: Notification[] = [
      {
        id: "notif-001",

        userId: "resident-001",

        title: "Report Under Review",

        message:
          "Your report 'Burst water pipe on Ahmadu Bello Way' is now under review by the authorities.",

        read: false,

        createdAt: now,
      },

      {
        id: "notif-002",

        userId: "resident-001",

        title: "Report Resolved",

        message:
          "Your report 'Irregular power supply in Garki area' has been marked as resolved.",

        read: true,

        createdAt: now,
      },

      {
        id: "notif-003",

        userId: "resident-002",

        title: "New Announcement",

        message:
          "New announcement: Community Town Hall Meeting - Q2 2025",

        read: false,

        createdAt: yesterday,
      },
    ];

    // ========================================================
    // AUDIT LOGS
    // ========================================================

    const auditLogs: AuditLog[] = [
      {
        id: "log-001",

        userId: "admin-001",

        userName:
          "Adebayo Ogunlana",

        action:
          "REPORT_STATUS_CHANGE",

        details:
          "Changed status of rpt-001 from 'pending' to 'under-review'",

        createdAt: now,
      },

      {
        id: "log-002",

        userId: "admin-001",

        userName:
          "Adebayo Ogunlana",

        action:
          "REPORT_RESOLVED",

        details:
          "Marked report rpt-003 as resolved with resolution notes",

        createdAt: now,
      },

      {
        id: "log-003",

        userId: "admin-001",

        userName:
          "Adebayo Ogunlana",

        action:
          "ANNOUNCEMENT_CREATED",

        details:
          "Posted announcement 'Community Town Hall Meeting - Q2 2025'",

        createdAt: yesterday,
      },
    ];

    return {
      users: [
        superAdmin,
        adminUser,
        residentUser,
        resident2,
      ],

      reports,

      comments,

      announcements,

      notifications,

      auditLogs,
    };
  }

  // ==========================================================
  // PERSIST
  // ==========================================================

  private persist(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.data)
    );
  }

  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  login(
    email: string,
    password: string
  ): {
    user: User;
    token: string;
  } | null {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      this.data.users.find(
        (u) =>
          u.email.toLowerCase() ===
          normalizedEmail
      );

    if (!user) {
      return null;
    }

    if (user.password !== password) {
      return null;
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    localStorage.setItem(
      this.AUTH_KEY,
      token
    );

    localStorage.setItem(
      "ccng_current_user",
      JSON.stringify(user)
    );

    window.dispatchEvent(
      new Event("authChanged")
    );

    return {
      user,
      token,
    };
  }

  // ==========================================================
  // REGISTER
  // ==========================================================

  register(data: {
    email: string;
    name: string;
    password: string;
    role: UserRole;
    ward: string;
    lga: string;
    state: string;
  }): {
    user: User;
    token: string;
  } {
    const normalizedEmail =
      data.email.trim().toLowerCase();

    const existingUser =
      this.data.users.find(
        (u) =>
          u.email.toLowerCase() ===
          normalizedEmail
      );

    if (existingUser) {
      throw new Error(
        "A user with this email already exists."
      );
    }

    /*
     * Public registration can only
     * create resident accounts.
     *
     * Admin and super-admin accounts
     * must be provisioned by authorized
     * administrators.
     */
    const role: UserRole =
      "resident";

    const user: User = {
      id: generateId(),

      email: normalizedEmail,

      password: data.password,

      name: data.name.trim(),

      role,

      ward: data.ward,

      lga: data.lga,

      state: data.state,

      createdAt:
        new Date().toISOString(),
    };

    this.data.users.push(user);

    this.persist();

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    localStorage.setItem(
      this.AUTH_KEY,
      token
    );

    localStorage.setItem(
      "ccng_current_user",
      JSON.stringify(user)
    );

    window.dispatchEvent(
      new Event("authChanged")
    );

    return {
      user,
      token,
    };
  }

  // ==========================================================
  // CURRENT USER
  // ==========================================================

  getCurrentUser(): User | null {
    const token =
      localStorage.getItem(
        this.AUTH_KEY
      );

    if (!token) {
      return null;
    }

    const payload =
      verifyToken(token);

    if (!payload) {
      return null;
    }

    const user =
      this.data.users.find(
        (u) =>
          u.id ===
          String(payload.id)
      );

    return user ?? null;
  }

  // ==========================================================
  // ROLE HELPERS
  // ==========================================================

  isAdmin(): boolean {
    const user =
      this.getCurrentUser();

    return (
      user?.role === "admin" ||
      user?.role === "super-admin"
    );
  }

  isSuperAdmin(): boolean {
    return (
      this.getCurrentUser()
        ?.role === "super-admin"
    );
  }

  isResident(): boolean {
    return (
      this.getCurrentUser()
        ?.role === "resident"
    );
  }

  // ==========================================================
  // CLEARANCE HELPERS
  // ==========================================================

  /**
   * Determines whether the current user
   * can manage reports.
   *
   * Admin and Super Admin can manage
   * reports.
   */
  canManageReports(): boolean {
    return this.isAdmin();
  }

  /**
   * Determines whether the current user
   * has the highest system clearance.
   */
  canManageSystem(): boolean {
    return this.isSuperAdmin();
  }

  // ==========================================================
  // TOKEN
  // ==========================================================

  getToken(): string | null {
    return localStorage.getItem(
      this.AUTH_KEY
    );
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================

  logout(): void {
    localStorage.removeItem(
      this.AUTH_KEY
    );

    localStorage.removeItem(
      "ccng_current_user"
    );

    window.dispatchEvent(
      new Event("authChanged")
    );
  }

  // ==========================================================
  // AUTH STATUS
  // ==========================================================

  isAuthenticated(): boolean {
    const token =
      localStorage.getItem(
        this.AUTH_KEY
      );

    if (!token) {
      return false;
    }

    return (
      verifyToken(token) !== null
    );
  }

  // ==========================================================
  // PASSWORD RESET
  // ==========================================================

  generateResetToken(
    email: string
  ): string | null {
    const normalizedEmail =
      email.trim().toLowerCase();

    const user =
      this.data.users.find(
        (u) =>
          u.email.toLowerCase() ===
          normalizedEmail
      );

    if (!user) {
      return null;
    }

    const resetToken =
      `${generateId()}-${generateId()}`;

    localStorage.setItem(
      `ccng_reset_${normalizedEmail}`,
      resetToken
    );

    return resetToken;
  }

  verifyResetToken(
    email: string,
    token: string
  ): boolean {
    const normalizedEmail =
      email.trim().toLowerCase();

    const stored =
      localStorage.getItem(
        `ccng_reset_${normalizedEmail}`
      );

    return (
      stored !== null &&
      stored === token
    );
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): boolean {
    const normalizedEmail =
      email.trim().toLowerCase();

    /*
     * The token is deliberately verified
     * before changing the password.
     *
     * This also fixes the TypeScript issue
     * caused by having an unused _token
     * parameter.
     */
    if (
      !this.verifyResetToken(
        normalizedEmail,
        token
      )
    ) {
      return false;
    }

    if (!newPassword.trim()) {
      return false;
    }

    const user =
      this.data.users.find(
        (u) =>
          u.email.toLowerCase() ===
          normalizedEmail
      );

    if (!user) {
      return false;
    }

    user.password =
      newPassword;

    localStorage.setItem(
      `ccng_password_${normalizedEmail}`,
      btoa(newPassword)
    );

    localStorage.removeItem(
      `ccng_reset_${normalizedEmail}`
    );

    this.persist();

    return true;
  }

  // ==========================================================
  // REPORTS
  // ==========================================================

  getReports(): Report[] {
    return [
      ...this.data.reports,
    ].sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );
  }

  getReportsByUser(
    userId: string
  ): Report[] {
    return this.data.reports
      .filter(
        (report) =>
          report.userId === userId
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );
  }

  getReport(
    id: string
  ): Report | undefined {
    return this.data.reports.find(
      (report) =>
        report.id === id
    );
  }

  // ==========================================================
  // CREATE REPORT
  // ==========================================================

  createReport(
    report: Omit<
      Report,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "status"
      | "upvotes"
    >
  ): Report {
    const now =
      new Date().toISOString();

    const newReport: Report = {
      ...report,

      id:
        "rpt-" +
        generateId(),

      status: "pending",

      upvotes: 0,

      createdAt: now,

      updatedAt: now,
    };

    this.data.reports.push(
      newReport
    );

    this.addAuditLog(
      report.userId,
      report.userName,
      "REPORT_CREATED",
      `Created report: ${report.title}`
    );

    this.persist();

    return newReport;
  }

  // ==========================================================
  // UPDATE REPORT STATUS
  // ==========================================================

  updateReportStatus(
    id: string,
    status: ReportStatus,
    resolution?: string,
    adminId?: string,
    adminName?: string
  ): Report | undefined {
    const report =
      this.data.reports.find(
        (item) =>
          item.id === id
      );

    if (!report) {
      return undefined;
    }

    /*
     * If an administrator identity is
     * supplied, verify that the account
     * actually has administrative clearance.
     */
    if (
      adminId &&
      adminName
    ) {
      const admin =
        this.data.users.find(
          (user) =>
            user.id === adminId
        );

      if (
        !admin ||
        (admin.role !== "admin" &&
          admin.role !==
            "super-admin")
      ) {
        throw new Error(
          "You do not have permission to update reports."
        );
      }
    }

    report.status = status;

    report.updatedAt =
      new Date().toISOString();

    if (
      resolution !== undefined
    ) {
      report.resolution =
        resolution;
    }

    if (
      adminId &&
      adminName
    ) {
      const action =
        status === "resolved"
          ? "REPORT_RESOLVED"
          : "REPORT_STATUS_CHANGE";

      this.addAuditLog(
        adminId,
        adminName,
        action,
        `Changed status of ${id} to '${status}'`
      );

      /*
       * Notify the resident who created
       * the report.
       */
      this.data.notifications.push(
        {
          id:
            `notif-${generateId()}`,

          userId:
            report.userId,

          title:
            status === "resolved"
              ? "Report Resolved"
              : "Report Status Updated",

          message:
            status === "resolved"
              ? `Your report "${report.title}" has been resolved.`
              : `Your report "${report.title}" is now ${status}.`,

          read: false,

          createdAt:
            new Date().toISOString(),
        }
      );
    }

    this.persist();

    return report;
  }

  // ==========================================================
  // UPVOTE
  // ==========================================================

  upvoteReport(
    id: string
  ): Report | undefined {
    const report =
      this.data.reports.find(
        (item) =>
          item.id === id
      );

    if (!report) {
      return undefined;
    }

    report.upvotes += 1;

    report.updatedAt =
      new Date().toISOString();

    this.persist();

    return report;
  }

  // ==========================================================
  // COMMENTS
  // ==========================================================

  getComments(
    reportId: string
  ): Comment[] {
    return this.data.comments
      .filter(
        (comment) =>
          comment.reportId ===
          reportId
      )
      .sort(
        (a, b) =>
          new Date(
            a.createdAt
          ).getTime() -
          new Date(
            b.createdAt
          ).getTime()
      );
  }

  addComment(
    comment: Omit<
      Comment,
      "id" | "createdAt"
    >
  ): Comment {
    const newComment: Comment = {
      ...comment,

      id:
        `cmt-${generateId()}`,

      createdAt:
        new Date().toISOString(),
    };

    this.data.comments.push(
      newComment
    );

    this.persist();

    return newComment;
  }

  deleteComment(
    id: string
  ): boolean {
    const index =
      this.data.comments.findIndex(
        (comment) =>
          comment.id === id
      );

    if (index === -1) {
      return false;
    }

    this.data.comments.splice(
      index,
      1
    );

    this.persist();

    return true;
  }

  // ==========================================================
  // ANNOUNCEMENTS
  // ==========================================================

  getAnnouncements(): Announcement[] {
    return [
      ...this.data.announcements,
    ].sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );
  }

  createAnnouncement(
    announcement: Omit<
      Announcement,
      "id" | "createdAt"
    >
  ): Announcement {
    const currentUser =
      this.getCurrentUser();

    if (
      !currentUser ||
      (currentUser.role !==
        "admin" &&
        currentUser.role !==
          "super-admin")
    ) {
      throw new Error(
        "You do not have permission to create announcements."
      );
    }

    const newAnnouncement: Announcement =
      {
        ...announcement,

        id:
          `ann-${generateId()}`,

        createdAt:
          new Date().toISOString(),
      };

    this.data.announcements.push(
      newAnnouncement
    );

    this.addAuditLog(
      currentUser.id,
      currentUser.name,
      "ANNOUNCEMENT_CREATED",
      `Posted announcement: ${announcement.title}`
    );

    this.persist();

    return newAnnouncement;
  }

  // ==========================================================
  // NOTIFICATIONS
  // ==========================================================

  getNotifications(
    userId: string
  ): Notification[] {
    return this.data.notifications
      .filter(
        (notification) =>
          notification.userId ===
          userId
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      );
  }

  getUnreadNotificationCount(
    userId: string
  ): number {
    return this.data.notifications.filter(
      (notification) =>
        notification.userId ===
          userId &&
        !notification.read
    ).length;
  }

  markNotificationRead(
    id: string
  ): void {
    const notification =
      this.data.notifications.find(
        (item) =>
          item.id === id
      );

    if (notification) {
      notification.read = true;

      this.persist();
    }
  }

  markAllNotificationsRead(
    userId: string
  ): void {
    this.data.notifications.forEach(
      (notification) => {
        if (
          notification.userId ===
          userId
        ) {
          notification.read = true;
        }
      }
    );

    this.persist();
  }

  // ==========================================================
  // AUDIT LOGS
  // ==========================================================

  getAuditLogs(): AuditLog[] {
    return [
      ...this.data.auditLogs,
    ].sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );
  }

  private addAuditLog(
    userId: string,
    userName: string,
    action: string,
    details: string
  ): void {
    this.data.auditLogs.push({
      id:
        `log-${generateId()}`,

      userId,

      userName,

      action,

      details,

      createdAt:
        new Date().toISOString(),
    });
  }

  // ==========================================================
  // STATS
  // ==========================================================

  getStats() {
    const totalReports =
      this.data.reports.length;

    const resolved =
      this.data.reports.filter(
        (report) =>
          report.status ===
          "resolved"
      ).length;

    const pending =
      this.data.reports.filter(
        (report) =>
          report.status ===
          "pending"
      ).length;

    const underReview =
      this.data.reports.filter(
        (report) =>
          report.status ===
          "under-review"
      ).length;

    const totalUsers =
      this.data.users.length;

    const totalComments =
      this.data.comments.length;

    const totalAnnouncements =
      this.data.announcements.length;

    const totalNotifications =
      this.data.notifications.length;

    const activeUsers =
      this.data.users.length;

    const admins =
      this.data.users.filter(
        (user) =>
          user.role === "admin"
      ).length;

    const superAdmins =
      this.data.users.filter(
        (user) =>
          user.role ===
          "super-admin"
      ).length;

    const residents =
      this.data.users.filter(
        (user) =>
          user.role === "resident"
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

      activeUsers,

      admins,

      superAdmins,

      residents,

      resolutionRate:
        totalReports > 0
          ? Math.round(
              (resolved /
                totalReports) *
                100
            )
          : 0,
    };
  }

  // ==========================================================
  // SUPER ADMIN HELPERS
  // ==========================================================

  getAllUsers(): User[] {
    return [...this.data.users];
  }

  getAllReports(): Report[] {
    return [...this.data.reports];
  }

  getAllComments(): Comment[] {
    return [...this.data.comments];
  }

  getAllAnnouncements(): Announcement[] {
    return [
      ...this.data.announcements,
    ];
  }

  getAllNotifications(): Notification[] {
    return [
      ...this.data.notifications,
    ];
  }

  getRecentUsers(
    limit = 5
  ): User[] {
    return [
      ...this.data.users,
    ]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
      )
      .slice(0, limit);
  }

  getRecentReports(
    limit = 5
  ): Report[] {
    return [
      ...this.data.reports,
    ]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ).getTime() -
          new Date(
            a.createdAt
          ).getTime()
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

  // ==========================================================
  // USERS
  // ==========================================================

  getUser(
    id: string
  ): User | undefined {
    return this.data.users.find(
      (user) =>
        user.id === id
    );
  }

  // ==========================================================
  // ANALYTICS
  // ==========================================================

  getAnalytics() {
    // --------------------------------------------------------
    // Reports by Month
    // --------------------------------------------------------

    const monthlyMap: Record<
      string,
      number
    > = {};

    this.data.reports.forEach(
      (report) => {
        const month =
          new Date(
            report.createdAt
          ).toLocaleString(
            "en-NG",
            {
              month: "short",
            }
          );

        monthlyMap[month] =
          (monthlyMap[month] ||
            0) + 1;
      }
    );

    const monthlyReports =
      Object.entries(
        monthlyMap
      ).map(
        ([month, reports]) => ({
          month,
          reports,
        })
      );

    // --------------------------------------------------------
    // Reports by Category
    // --------------------------------------------------------

    const categoryMap: Record<
      string,
      number
    > = {};

    this.data.reports.forEach(
      (report) => {
        categoryMap[
          report.category
        ] =
          (categoryMap[
            report.category
          ] || 0) + 1;
      }
    );

    const categoryReports =
      Object.entries(
        categoryMap
      ).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

    // --------------------------------------------------------
    // Reports by LGA
    // --------------------------------------------------------

    const lgaMap: Record<
      string,
      number
    > = {};

    this.data.reports.forEach(
      (report) => {
        lgaMap[report.lga] =
          (lgaMap[report.lga] ||
            0) + 1;
      }
    );

    const lgaReports =
      Object.entries(
        lgaMap
      ).map(
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

// ============================================================
// EXPORT STORE
// ============================================================

export const store =
  new Store();