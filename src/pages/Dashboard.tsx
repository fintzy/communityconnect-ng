import { useEffect,  useMemo,  useState,} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AlertCircle,  BarChart3,  CheckCircle,  ChevronRight,  Clock,  FileText,  MapPin,  MessageCircle,  Plus,  Send,  Shield,  Trash2,  ThumbsUp,  User,  Users,  X,  XCircle,} from "lucide-react";
import {  store,  type Report,  type ReportStatus,  type User as StoreUser,} from "../services/store";

// ============================================================
// TYPES
// ============================================================

type CommentItem = {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  createdAt?: string;
};

// ============================================================
// CONSTANTS
// ============================================================

const CATEGORIES = [
  {
    value: "roads",
    label: "Roads",
    light:
      "bg-amber-100 text-amber-700",
    dark:
      "bg-amber-400/10 text-amber-300",
  },
  {
    value: "water",
    label: "Water",
    light:
      "bg-blue-100 text-blue-700",
    dark:
      "bg-blue-400/10 text-blue-300",
  },
  {
    value: "power",
    label: "Power",
    light:
      "bg-yellow-100 text-yellow-700",
    dark:
      "bg-yellow-400/10 text-yellow-300",
  },
  {
    value: "sanitation",
    label: "Sanitation",
    light:
      "bg-green-100 text-green-700",
    dark:
      "bg-green-400/10 text-green-300",
  },
  {
    value: "health",
    label: "Health",
    light:
      "bg-red-100 text-red-700",
    dark:
      "bg-red-400/10 text-red-300",
  },
  {
    value: "education",
    label: "Education",
    light:
      "bg-purple-100 text-purple-700",
    dark:
      "bg-purple-400/10 text-purple-300",
  },
  {
    value: "security",
    label: "Security",
    light:
      "bg-orange-100 text-orange-700",
    dark:
      "bg-orange-400/10 text-orange-300",
  },
  {
    value: "other",
    label: "Other",
    light:
      "bg-gray-100 text-gray-700",
    dark:
      "bg-white/10 text-white/70",
  },
] as const;

// ============================================================
// HELPERS
// ============================================================

function formatDate(date: string): string {
  return new Date(date).toLocaleString(
    "en-NG",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
}

function formatShortDate(
  date: string
): string {
  return new Date(date).toLocaleDateString(
    "en-NG",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function getStatusLabel(
  status: ReportStatus
): string {
  switch (status) {
    case "pending":
      return "Pending";

    case "under-review":
      return "Under Review";

    case "resolved":
      return "Resolved";

    case "dismissed":
      return "Dismissed";

    default:
      return status;
  }
}

function getCategoryLabel(
  category: Report["category"]
): string {
  return (
    category.charAt(0).toUpperCase() +
    category.slice(1)
  );
}

function getCategoryStyles(
  category: Report["category"]
) {
  const found = CATEGORIES.find(
    (item) => item.value === category
  );

  return {
    light:
      found?.light ??
      "bg-gray-100 text-gray-700",
    dark:
      found?.dark ??
      "bg-white/10 text-white/70",
    label:
      found?.label ??
      getCategoryLabel(category),
  };
}

// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}: {
  status: ReportStatus;
}) {
  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-400/10 dark:text-green-300">
        <CheckCircle className="h-3.5 w-3.5" />
        Resolved
      </span>
    );
  }

  if (status === "under-review") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
        <Clock className="h-3.5 w-3.5" />
        Under Review
      </span>
    );
  }

  if (status === "dismissed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-400/10 dark:text-red-300">
        <XCircle className="h-3.5 w-3.5" />
        Dismissed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300">
      <Clock className="h-3.5 w-3.5" />
      Pending
    </span>
  );
}

// ============================================================
// ROLE BADGE
// ============================================================

function RoleBadge({
  role,
}: {
  role: StoreUser["role"];
}) {
  if (role === "super-admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-400/10 dark:text-purple-300">
        <Shield className="h-3.5 w-3.5" />
        Super Admin
      </span>
    );
  }

  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-400/10 dark:text-blue-300">
        <Shield className="h-3.5 w-3.5" />
        Admin
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-white/10 dark:text-white/60">
      <User className="h-3.5 w-3.5" />
      Resident
    </span>
  );
}

// ============================================================
// STAT CARD
// ============================================================

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
  iconBg,
  valueClass = "text-gray-900 dark:text-white",
}: {
  label: string;
  value: string | number;
  icon: typeof FileText;
  iconClass: string;
  iconBg: string;
  valueClass?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-white/10 dark:bg-[#10241C] dark:shadow-black/20"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-white/50">
            {label}
          </p>

          <p
            className={`mt-1 text-3xl font-bold ${valueClass}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`shrink-0 rounded-xl p-3 ${iconBg}`}
        >
          <Icon
            className={`h-5 w-5 ${iconClass}`}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// REPORT CARD
// ============================================================

function ReportCard({
  report,
  canManage,
  onView,
  onStatusChange,
  onUpvote,
}: {
  report: Report;
  canManage: boolean;
  onView: (report: Report) => void;
  onStatusChange: (
    report: Report,
    status: ReportStatus
  ) => void;
  onUpvote: (reportId: string) => void;
}) {
  const category =
    getCategoryStyles(report.category);

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-[#0F4C3A]/20 hover:shadow-md dark:border-white/10 dark:bg-[#10241C] dark:hover:border-[#D4AF37]/20"
    >
      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <StatusBadge
                status={report.status}
              />

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${category.light} dark:${category.dark}`}
              >
                {category.label}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {report.title}
            </h3>

            <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-white/60">
              {report.description}
            </p>
          </div>

          {report.photo && (
            <img
              src={report.photo}
              alt="Incident evidence"
              className="h-28 w-full rounded-xl border border-gray-100 object-cover sm:h-24 sm:w-32 dark:border-white/10"
            />
          )}
        </div>

        {/* REPORT METADATA */}
        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-3 dark:border-white/10">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-white/30">
              Location
            </p>

            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-white/80">
              {report.ward}
            </p>

            <p className="text-xs text-gray-500 dark:text-white/40">
              {report.lga}
              {report.state
                ? `, ${report.state}`
                : ""}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-white/30">
              Submitted
            </p>

            <p className="mt-1 text-sm text-gray-700 dark:text-white/70">
              {formatDate(
                report.createdAt
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-white/30">
              Community Support
            </p>

            <button
              type="button"
              onClick={() =>
                onUpvote(report.id)
              }
              className="mt-1 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-[#0F4C3A] transition hover:bg-[#D4AF37]/10 dark:text-[#D4AF37]"
            >
              <ThumbsUp className="h-4 w-4" />
              {report.upvotes} upvotes
            </button>
          </div>
        </div>

        {/* GPS */}
        {(report.latitude !==
          undefined ||
          report.longitude !==
            undefined) && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-400/10 dark:text-green-300">
            <MapPin className="h-4 w-4 shrink-0" />

            <span>
              GPS captured
              {report.latitude !==
                undefined &&
              report.longitude !==
                undefined
                ? ` — ${report.latitude.toFixed(
                    6
                  )}, ${report.longitude.toFixed(
                    6
                  )}`
                : ""}
            </span>
          </div>
        )}

        {/* RESOLUTION */}
        {report.resolution && (
          <div className="mt-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-400/10">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
              Resolution
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-900 dark:text-blue-100/80">
              {report.resolution}
            </p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() =>
              onView(report)
            }
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
          >
            View Report
            <ChevronRight className="h-4 w-4" />
          </button>

          {canManage && (
            <select
              value={report.status}
              onChange={(event) =>
                onStatusChange(
                  report,
                  event.target
                    .value as ReportStatus
                )
              }
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#0B1712] dark:text-white/80 dark:focus:border-[#D4AF37] dark:focus:ring-[#D4AF37]/20"
            >
              <option value="pending">
                Pending
              </option>

              <option value="under-review">
                Under Review
              </option>

              <option value="resolved">
                Resolved
              </option>

              <option value="dismissed">
                Dismissed
              </option>
            </select>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================

export default function Dashboard() {
  const navigate = useNavigate();

  const [
    currentUser,
    setCurrentUser,
  ] = useState<StoreUser | null>(
    () => store.getCurrentUser()
  );

  const [reports, setReports] =
    useState<Report[]>([]);

  const [
    selectedReport,
    setSelectedReport,
  ] = useState<Report | null>(null);

  const [comments, setComments] =
    useState<CommentItem[]>([]);

  const [newComment, setNewComment] =
    useState("");

  const [filter, setFilter] =
    useState<
      "all" | ReportStatus
    >("all");

  const [search, setSearch] =
    useState("");

  const [statusMessage, setStatusMessage] =
    useState("");

  const [statusError, setStatusError] =
    useState("");

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  function loadDashboard() {
    const user =
      store.getCurrentUser();

    setCurrentUser(user);

    if (!user) {
      navigate("/auth");
      return;
    }

    if (user.role === "resident") {
      setReports(
        store.getReportsByUser(
          user.id
        )
      );
    } else {
      setReports(
        store.getReports()
      );
    }
  }

  useEffect(() => {
    loadDashboard();

    const handleAuthChange =
      () => {
        loadDashboard();
      };

    window.addEventListener(
      "authChanged",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChange
      );
    };
  }, [navigate]);

  // ==========================================================
  // FILTER REPORTS
  // ==========================================================

  const filteredReports =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return reports.filter(
        (report) => {
          const matchesFilter =
            filter === "all" ||
            report.status ===
              filter;

          if (!matchesFilter) {
            return false;
          }

          if (!normalizedSearch) {
            return true;
          }

          return (
            report.title
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            report.description
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            report.category
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            report.ward
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            report.lga
              .toLowerCase()
              .includes(
                normalizedSearch
              )
          );
        }
      );
    }, [
      reports,
      filter,
      search,
    ]);

  // ==========================================================
  // RESIDENT STATS
  // ==========================================================

  const residentStats =
    useMemo(() => {
      return {
        total: reports.length,

        pending: reports.filter(
          (report) =>
            report.status ===
            "pending"
        ).length,

        underReview:
          reports.filter(
            (report) =>
              report.status ===
              "under-review"
          ).length,

        resolved:
          reports.filter(
            (report) =>
              report.status ===
              "resolved"
          ).length,
      };
    }, [reports]);

  // ==========================================================
  // SYSTEM STATS
  // ==========================================================

  const systemStats =
    useMemo(() => {
      if (
        !currentUser ||
        currentUser.role ===
          "resident"
      ) {
        return null;
      }

      return store.getStats();
    }, [
      currentUser,
      reports,
    ]);

  // ==========================================================
  // PERMISSIONS
  // ==========================================================

  const canManageReports =
    currentUser?.role ===
      "admin" ||
    currentUser?.role ===
      "super-admin";

  const isSuperAdmin =
    currentUser?.role ===
    "super-admin";

  // ==========================================================
  // OPEN REPORT
  // ==========================================================

  function openReport(
    report: Report
  ) {
    setSelectedReport(report);

    setComments(
      store.getComments(
        report.id
      ) as CommentItem[]
    );

    setNewComment("");
  }

  // ==========================================================
  // CLOSE REPORT
  // ==========================================================

  function closeReport() {
    setSelectedReport(null);
    setComments([]);
    setNewComment("");
  }

  // ==========================================================
  // UPVOTE
  // ==========================================================

  function handleUpvote(
    reportId: string
  ) {
    try {
      store.upvoteReport(
        reportId
      );

      loadDashboard();

      if (
        selectedReport?.id ===
        reportId
      ) {
        setSelectedReport(
          store.getReport(
            reportId
          ) ?? null
        );
      }
    } catch (error: unknown) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Unable to upvote report."
      );

      window.setTimeout(
        () => {
          setStatusError("");
        },
        3000
      );
    }
  }

  // ==========================================================
  // STATUS UPDATE
  // ==========================================================

  function handleStatusChange(
    report: Report,
    status: ReportStatus
  ) {
    if (!currentUser) {
      return;
    }

    if (
      currentUser.role !==
        "admin" &&
      currentUser.role !==
        "super-admin"
    ) {
      return;
    }

    let resolution:
      | string
      | undefined;

    if (status === "resolved") {
      resolution =
        window.prompt(
          "Enter resolution notes:"
        ) ?? undefined;

      if (!resolution?.trim()) {
        return;
      }

      resolution =
        resolution.trim();
    }

    try {
      const updated =
        store.updateReportStatus(
          report.id,
          status,
          resolution,
          currentUser.id,
          currentUser.name
        );

      if (!updated) {
        setStatusError(
          "Unable to update the report status."
        );

        window.setTimeout(
          () => {
            setStatusError("");
          },
          3000
        );

        return;
      }

      setStatusMessage(
        `Report "${report.title}" updated to ${getStatusLabel(
          status
        )}.`
      );

      loadDashboard();

      if (
        selectedReport?.id ===
        report.id
      ) {
        setSelectedReport(
          store.getReport(
            report.id
          ) ?? null
        );
      }

      window.setTimeout(
        () => {
          setStatusMessage("");
        },
        3000
      );
    } catch (error: unknown) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Unable to update report."
      );

      window.setTimeout(
        () => {
          setStatusError("");
        },
        3000
      );
    }
  }

  // ==========================================================
  // ADD COMMENT
  // ==========================================================

  function handleAddComment() {
    if (
      !currentUser ||
      !selectedReport ||
      !newComment.trim()
    ) {
      return;
    }

    try {
      store.addComment({
        reportId:
          selectedReport.id,
        userId:
          currentUser.id,
        userName:
          currentUser.name,
        userRole:
          currentUser.role,
        content:
          newComment.trim(),
      });

      setComments(
        store.getComments(
          selectedReport.id
        ) as CommentItem[]
      );

      setNewComment("");
    } catch (error: unknown) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Unable to add comment."
      );

      window.setTimeout(
        () => {
          setStatusError("");
        },
        3000
      );
    }
  }

  // ==========================================================
  // DELETE COMMENT
  // ==========================================================

  function handleDeleteComment(
    commentId: string
  ) {
    if (!selectedReport) {
      return;
    }

    try {
      store.deleteComment(
        commentId
      );

      setComments(
        store.getComments(
          selectedReport.id
        ) as CommentItem[]
      );
    } catch (error: unknown) {
      setStatusError(
        error instanceof Error
          ? error.message
          : "Unable to delete comment."
      );

      window.setTimeout(
        () => {
          setStatusError("");
        },
        3000
      );
    }
  }

  // ==========================================================
  // NO USER
  // ==========================================================

  if (!currentUser) {
    return null;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="min-h-[calc(100vh-4rem)] bg-[#FDFBF7] text-gray-900 transition-colors duration-300 dark:bg-[#08130F] dark:text-white"
    >
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ====================================================
            ALERTS
        ==================================================== */}

        <AnimatePresence>
          {statusMessage && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 dark:border-green-400/20 dark:bg-green-400/10 dark:text-green-300"
            >
              <CheckCircle className="h-5 w-5 shrink-0" />

              <span>
                {statusMessage}
              </span>
            </motion.div>
          )}

          {statusError && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-300"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />

              <span>
                {statusError}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====================================================
            WELCOME
        ==================================================== */}

        <section className="mb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#0F4C3A] dark:text-white sm:text-3xl">
                  Welcome,{" "}
                  {currentUser.name.split(
                    " "
                  )[0]}
                </h1>

                <RoleBadge
                  role={
                    currentUser.role
                  }
                />
              </div>

              <p className="mt-2 text-sm text-gray-500 dark:text-white/50">
                {currentUser.role ===
                "admin"
                  ? "Community Administrator"
                  : currentUser.role ===
                    "super-admin"
                  ? "System-wide Administrator"
                  : `${currentUser.ward}, ${currentUser.lga}, ${currentUser.state}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {isSuperAdmin && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/super-admin"
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-400/20 dark:bg-purple-400/10 dark:text-purple-300 dark:hover:bg-purple-400/20"
                >
                  <Shield className="h-4 w-4" />
                  Super Admin
                </button>
              )}

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/report-incident"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C3A] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0a3a2c] dark:bg-[#D4AF37] dark:text-[#0F4C3A] dark:hover:bg-[#e0bc4c]"
              >
                <Plus className="h-5 w-5" />
                Report Incident
              </button>
            </div>
          </div>
        </section>

        {/* ====================================================
            ADMIN STATS
        ==================================================== */}

        {canManageReports &&
          systemStats && (
            <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Total Reports"
                value={
                  systemStats.totalReports
                }
                icon={FileText}
                iconClass="text-[#0F4C3A] dark:text-[#D4AF37]"
                iconBg="bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10"
              />

              <StatCard
                label="Pending"
                value={
                  systemStats.pending
                }
                icon={Clock}
                iconClass="text-yellow-600 dark:text-yellow-300"
                iconBg="bg-yellow-50 dark:bg-yellow-400/10"
                valueClass="text-yellow-600 dark:text-yellow-300"
              />

              <StatCard
                label="Resolved"
                value={
                  systemStats.resolved
                }
                icon={CheckCircle}
                iconClass="text-green-600 dark:text-green-300"
                iconBg="bg-green-50 dark:bg-green-400/10"
                valueClass="text-green-600 dark:text-green-300"
              />

              <StatCard
                label="Users"
                value={
                  systemStats.totalUsers
                }
                icon={Users}
                iconClass="text-[#0F4C3A] dark:text-[#D4AF37]"
                iconBg="bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10"
              />
            </section>
          )}

        {/* ====================================================
            SUPER ADMIN
        ==================================================== */}

        {isSuperAdmin && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-purple-200 bg-purple-50 dark:border-purple-400/20 dark:bg-purple-400/10">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-700 dark:text-purple-300" />

                  <h2 className="font-bold text-purple-900 dark:text-purple-100">
                    Super Admin Control
                  </h2>
                </div>

                <p className="mt-1 text-sm text-purple-700 dark:text-purple-200/70">
                  You have system-wide administrative clearance.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/admin"
                    )
                  }
                  className="rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
                >
                  Admin Console
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/analytics"
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-400/20 dark:bg-[#10241C] dark:text-purple-300 dark:hover:bg-purple-400/10"
                >
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ====================================================
            RESIDENT STATS
        ==================================================== */}

        {currentUser.role ===
          "resident" && (
          <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="My Reports"
              value={
                residentStats.total
              }
              icon={FileText}
              iconClass="text-[#0F4C3A] dark:text-[#D4AF37]"
              iconBg="bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10"
            />

            <StatCard
              label="Pending"
              value={
                residentStats.pending
              }
              icon={Clock}
              iconClass="text-yellow-600 dark:text-yellow-300"
              iconBg="bg-yellow-50 dark:bg-yellow-400/10"
              valueClass="text-yellow-600 dark:text-yellow-300"
            />

            <StatCard
              label="Under Review"
              value={
                residentStats.underReview
              }
              icon={Clock}
              iconClass="text-blue-600 dark:text-blue-300"
              iconBg="bg-blue-50 dark:bg-blue-400/10"
              valueClass="text-blue-600 dark:text-blue-300"
            />

            <StatCard
              label="Resolved"
              value={
                residentStats.resolved
              }
              icon={CheckCircle}
              iconClass="text-green-600 dark:text-green-300"
              iconBg="bg-green-50 dark:bg-green-400/10"
              valueClass="text-green-600 dark:text-green-300"
            />
          </section>
        )}

        {/* ====================================================
            REPORTS HEADER
        ==================================================== */}

        <section>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#0F4C3A] dark:text-[#D4AF37]">
                CommunityConnect NG
              </p>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                {currentUser.role ===
                "resident"
                  ? "My Incident Reports"
                  : "Community Incident Reports"}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-white/50">
                Review reports, evidence, locations and current status.
              </p>
            </div>

            {/* SEARCH / FILTER */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <input
                  type="search"
                  value={search}
                  onChange={(
                    event
                  ) =>
                    setSearch(
                      event.target
                        .value
                    )
                  }
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#10241C] dark:text-white dark:placeholder:text-white/30 dark:focus:border-[#D4AF37] dark:focus:ring-[#D4AF37]/20 sm:w-64"
                />
              </div>

              <select
                value={filter}
                onChange={(
                  event
                ) =>
                  setFilter(
                    event.target
                      .value as
                      | "all"
                      | ReportStatus
                  )
                }
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#10241C] dark:text-white/80 dark:focus:border-[#D4AF37] dark:focus:ring-[#D4AF37]/20"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="under-review">
                  Under Review
                </option>

                <option value="resolved">
                  Resolved
                </option>

                <option value="dismissed">
                  Dismissed
                </option>
              </select>
            </div>
          </div>

          {/* ==================================================
              REPORT LIST
          ================================================== */}

          {filteredReports.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-white/10 dark:bg-[#10241C]">
              <AlertCircle className="mx-auto h-10 w-10 text-gray-300 dark:text-white/20" />

              <h3 className="mt-4 font-semibold text-gray-800 dark:text-white">
                No reports found
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-white/40">
                {search
                  ? "Try a different search term."
                  : "There are currently no incident reports to display."}
              </p>

              {currentUser.role ===
                "resident" && (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/report-incident"
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a3a2c] dark:bg-[#D4AF37] dark:text-[#0F4C3A] dark:hover:bg-[#e0bc4c]"
                >
                  <Plus className="h-4 w-4" />
                  Create First Report
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence mode="popLayout">
                {filteredReports.map(
                  (report) => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      canManage={
                        canManageReports
                      }
                      onView={
                        openReport
                      }
                      onStatusChange={
                        handleStatusChange
                      }
                      onUpvote={
                        handleUpvote
                      }
                    />
                  )
                )}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* ======================================================
          REPORT DETAIL MODAL
      ====================================================== */}

      <AnimatePresence>
        {selectedReport && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={closeReport}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
                y: 15,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 15,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={(event) =>
                event.stopPropagation()
              }
              className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#10241C]"
            >
              {/* MODAL HEADER */}
              <div className="sticky top-0 z-10 flex items-start justify-between border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-white/10 dark:bg-[#10241C]/95">
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#0F4C3A] dark:text-[#D4AF37]">
                    Incident Report
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                    {
                      selectedReport.title
                    }
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    closeReport
                  }
                  className="shrink-0 rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-white"
                  aria-label="Close report"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6 p-5">
                {/* STATUS / CATEGORY */}
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={
                      selectedReport.status
                    }
                  />

                  {(() => {
                    const category =
                      getCategoryStyles(
                        selectedReport.category
                      );

                    return (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${category.light} dark:${category.dark}`}
                      >
                        {
                          category.label
                        }
                      </span>
                    );
                  })()}

                  <span className="text-xs text-gray-500 dark:text-white/40">
                    {formatDate(
                      selectedReport.createdAt
                    )}
                  </span>
                </div>

                {/* EVIDENCE */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <FileText className="h-5 w-5 text-[#0F4C3A] dark:text-[#D4AF37]" />
                    Incident Evidence
                  </h3>

                  {selectedReport.photo ? (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-black/20">
                      <img
                        src={
                          selectedReport.photo
                        }
                        alt="Incident evidence"
                        className="max-h-[500px] w-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500 dark:bg-white/5 dark:text-white/40">
                      No photo evidence was attached to this report.
                    </div>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">
                    Description
                  </h3>

                  <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600 dark:text-white/60">
                    {
                      selectedReport.description
                    }
                  </p>
                </div>

                {/* LOCATION */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <MapPin className="h-5 w-5 text-[#0F4C3A] dark:text-[#D4AF37]" />
                    Incident Location
                  </h3>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-gray-400 dark:text-white/30">
                        Ward
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/80">
                        {
                          selectedReport.ward
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-gray-400 dark:text-white/30">
                        LGA
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/80">
                        {
                          selectedReport.lga
                        }
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 dark:bg-white/5">
                      <p className="text-xs text-gray-400 dark:text-white/30">
                        State
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white/80">
                        {selectedReport.state ??
                          "Not specified"}
                      </p>
                    </div>
                  </div>

                  {selectedReport.latitude !==
                    undefined &&
                    selectedReport.longitude !==
                      undefined && (
                      <div className="mt-3 rounded-xl bg-green-50 p-4 dark:bg-green-400/10">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <MapPin className="h-5 w-5" />

                          <p className="font-semibold">
                            GPS Coordinates Captured
                          </p>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg bg-white p-3 dark:bg-[#10241C]">
                            <p className="text-xs text-gray-400 dark:text-white/30">
                              Latitude
                            </p>

                            <p className="mt-1 font-mono text-sm text-gray-800 dark:text-white/80">
                              {selectedReport.latitude.toFixed(
                                6
                              )}
                            </p>
                          </div>

                          <div className="rounded-lg bg-white p-3 dark:bg-[#10241C]">
                            <p className="text-xs text-gray-400 dark:text-white/30">
                              Longitude
                            </p>

                            <p className="mt-1 font-mono text-sm text-gray-800 dark:text-white/80">
                              {selectedReport.longitude.toFixed(
                                6
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                {/* REPORTER */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-[#0F4C3A]/10 p-2.5 text-[#0F4C3A] dark:bg-[#D4AF37]/10 dark:text-[#D4AF37]">
                      <User className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 dark:text-white/30">
                        Reported by
                      </p>

                      <p className="font-semibold text-gray-800 dark:text-white/80">
                        {
                          selectedReport.userName
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* RESOLUTION */}
                {selectedReport.resolution && (
                  <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-400/10">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Resolution
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-blue-800 dark:text-blue-100/70">
                      {
                        selectedReport.resolution
                      }
                    </p>
                  </div>
                )}

                {/* UPVOTE */}
                <div className="flex items-center gap-3 border-t border-gray-200 pt-5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      handleUpvote(
                        selectedReport.id
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37]/10 px-4 py-2.5 text-sm font-semibold text-[#8B6914] transition hover:bg-[#D4AF37]/20 dark:text-[#D4AF37]"
                  >
                    <ThumbsUp className="h-4 w-4" />

                    {selectedReport.upvotes}
                    {" "}
                    Community Support
                  </button>

                  <span className="text-xs text-gray-400 dark:text-white/30">
                    {formatShortDate(
                      selectedReport.createdAt
                    )}
                  </span>
                </div>

                {/* ADMIN ACTIONS */}
                {canManageReports && (
                  <div className="border-t border-gray-200 pt-5 dark:border-white/10">
                    <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                      Administrative Action
                    </h3>

                    <div className="flex flex-wrap gap-3">
                      {selectedReport.status ===
                        "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              selectedReport,
                              "under-review"
                            )
                          }
                          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Start Review
                        </button>
                      )}

                      {selectedReport.status ===
                        "under-review" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(
                              selectedReport,
                              "resolved"
                            )
                          }
                          className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                      )}

                      {selectedReport.status !==
                        "dismissed" &&
                        selectedReport.status !==
                          "resolved" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(
                                selectedReport,
                                "dismissed"
                              )
                            }
                            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            Dismiss Report
                          </button>
                        )}
                    </div>
                  </div>
                )}

                {/* COMMENTS */}
                <div className="border-t border-gray-200 pt-5 dark:border-white/10">
                  <h3 className="mb-4 flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    <MessageCircle className="h-5 w-5 text-[#0F4C3A] dark:text-[#D4AF37]" />
                    Comments
                    <span className="text-xs font-normal text-gray-400 dark:text-white/30">
                      ({comments.length})
                    </span>
                  </h3>

                  <div className="mb-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                    {comments.length ===
                    0 ? (
                      <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-400 dark:bg-white/5 dark:text-white/30">
                        No comments yet. Be the first to contribute.
                      </div>
                    ) : (
                      comments.map(
                        (comment) => (
                          <div
                            key={
                              comment.id
                            }
                            className="flex gap-3 rounded-xl bg-gray-50 p-3 dark:bg-white/5"
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F4C3A]/10 dark:bg-[#D4AF37]/10">
                              <span className="text-xs font-bold text-[#0F4C3A] dark:text-[#D4AF37]">
                                {comment.userName.charAt(
                                  0
                                )}
                              </span>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-gray-900 dark:text-white/90">
                                  {
                                    comment.userName
                                  }
                                </span>

                                {comment.userRole ===
                                  "admin" ||
                                comment.userRole ===
                                  "super-admin" ? (
                                  <span className="rounded bg-[#D4AF37]/10 px-1.5 py-0.5 text-[9px] font-medium text-[#8B6914] dark:text-[#D4AF37]">
                                    {comment.userRole ===
                                    "super-admin"
                                      ? "Super Admin"
                                      : "Admin"}
                                  </span>
                                ) : null}

                                {comment.createdAt && (
                                  <span className="text-[10px] text-gray-400 dark:text-white/30">
                                    {formatShortDate(
                                      comment.createdAt
                                    )}
                                  </span>
                                )}

                                {(currentUser.role ===
                                  "admin" ||
                                  currentUser.role ===
                                    "super-admin" ||
                                  comment.userId ===
                                    currentUser.id) && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteComment(
                                        comment.id
                                      )
                                    }
                                    className="ml-auto text-gray-300 transition hover:text-red-500 dark:text-white/20 dark:hover:text-red-400"
                                    aria-label="Delete comment"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>

                              <p className="mt-1 text-xs leading-5 text-gray-600 dark:text-white/60">
                                {
                                  comment.content
                                }
                              </p>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>

                  {/* COMMENT INPUT */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={
                        newComment
                      }
                      onChange={(
                        event
                      ) =>
                        setNewComment(
                          event.target
                            .value
                        )
                      }
                      onKeyDown={(
                        event
                      ) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          event.preventDefault();
                          handleAddComment();
                        }
                      }}
                      placeholder="Add a comment..."
                      className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0F4C3A] focus:ring-2 focus:ring-[#0F4C3A]/20 dark:border-white/10 dark:bg-[#0B1712] dark:text-white dark:placeholder:text-white/30 dark:focus:border-[#D4AF37] dark:focus:ring-[#D4AF37]/20"
                    />

                    <button
                      type="button"
                      onClick={
                        handleAddComment
                      }
                      disabled={
                        !newComment.trim()
                      }
                      className="rounded-xl bg-[#0F4C3A] px-4 py-2.5 text-white transition hover:bg-[#0a3a2c] disabled:cursor-not-allowed disabled:opacity-40 dark:bg-[#D4AF37] dark:text-[#0F4C3A] dark:hover:bg-[#e0bc4c]"
                      aria-label="Send comment"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* CLOSE */}
                <button
                  type="button"
                  onClick={
                    closeReport
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                  Close Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}