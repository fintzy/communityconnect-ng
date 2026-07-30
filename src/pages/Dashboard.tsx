import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CircleCheck,
  CircleAlert,
  Clock,
  MapPin,
  MessageCircle,
  ThumbsUp,
  ArrowUp,
  Trash2,
  Send,
  Plus,
  X,
  type LucideIcon,
} from "lucide-react";
import { store } from "../services/store";
import type { Report, User } from "../services/store";

const CATEGORIES = [
  { value: "roads", label: "Roads", color: "bg-amber-100 text-amber-700" },
  { value: "water", label: "Water", color: "bg-blue-100 text-blue-700" },
  { value: "power", label: "Power", color: "bg-yellow-100 text-yellow-700" },
  { value: "sanitation", label: "Sanitation", color: "bg-green-100 text-green-700" },
  { value: "health", label: "Health", color: "bg-red-100 text-red-700" },
  { value: "education", label: "Education", color: "bg-purple-100 text-purple-700" },
  { value: "security", label: "Security", color: "bg-orange-100 text-yellow-700" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-700" },
] as const;

const STATUS_BADGES: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  "under-review": { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700", icon: CircleCheck },
  dismissed: { label: "Dismissed", color: "bg-red-100 text-red-700", icon: CircleAlert },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showNewReport, setShowNewReport] = useState(false);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");

  type CommentItem = {
    id: string;
    reportId: string;
    userId: string;
    userName: string;
    userRole: string;
    content: string;
    createdAt?: string;
  };

  // New report form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<(typeof CATEGORIES)[number]["value"]>("roads");
  const [newWard, setNewWard] = useState("");

  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });

  useEffect(() => {
    const currentUser = store.getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    setUser(currentUser);
    setReports(store.getReports());
    setNewWard(currentUser.ward);
  }, [navigate]);

  // close outer useEffect above; separate effect for handling Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowNewReport(false);
            }
        };

        if (showNewReport) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [showNewReport]);

    useEffect(() => {
        document.body.style.overflow = showNewReport ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showNewReport]);

  const refreshReports = () => {
    setReports(store.getReports());
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) {
      return error.message || fallback;
    }

    return fallback;
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newDesc) return;

    try {
      store.createReport({
        userId: user.id,
        userName: user.name,
        title: newTitle,
        description: newDesc,
        category: newCategory,
        ward: newWard,
        lga: user.lga,
      });
      refreshReports();
      setShowNewReport(false);
      setNewTitle("");
      setNewDesc("");
      setNewCategory("roads");
      showToast("Report submitted successfully", "success");
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to create report"), "error");
    }
  };

  const handleUpvote = (reportId: string) => {
    try {
      store.upvoteReport(reportId);
      refreshReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport(store.getReport(reportId) || null);
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to upvote"), "error");
    }
  };

  const handleStatusChange = (reportId: string, status: Report["status"]) => {
    if (!user || user.role !== "admin") return;
    try {
      store.updateReportStatus(reportId, status, undefined, user.id, user.name);
      refreshReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport(store.getReport(reportId) || null);
      }
      showToast(`Report marked as ${status}`, "success");
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to update status"), "error");
    }
  };

  const handleResolve = (reportId: string) => {
    if (!user || user.role !== "admin") return;
    const resolution = prompt("Enter resolution notes:");
    if (!resolution) return;
    try {
      store.updateReportStatus(reportId, "resolved", resolution, user.id, user.name);
      refreshReports();
      if (selectedReport?.id === reportId) {
        setSelectedReport(store.getReport(reportId) || null);
      }
      showToast("Report marked as resolved", "success");
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to resolve"), "error");
    }
  };

  const handleAddComment = () => {
    if (!user || !selectedReport || !newComment.trim()) return;
    try {
      store.addComment({
        reportId: selectedReport.id,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        content: newComment.trim(),
      });
      setComments(store.getComments(selectedReport.id));
      setNewComment("");
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to add comment"), "error");
    }
  };

  const handleDeleteComment = (commentId: string) => {
    try {
      store.deleteComment(commentId);
      if (selectedReport) {
        setComments(store.getComments(selectedReport.id));
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err, "Failed to delete comment"), "error");
    }
  };

  const closeReportModal = () => {
    setShowNewReport(false);
    setNewTitle("");
    setNewDesc("");
    setNewCategory("roads");

    if (user) {
      setNewWard(user.ward);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const openReport = (report: Report) => {
    setSelectedReport(null);

  setTimeout(() => {
    setSelectedReport(report);
    }, 100);
    setComments(store.getComments(report.id));
  };

  const filteredReports = activeTab === "mine" && user
    ? reports.filter((r) => r.userId === user.id)
    : reports;

  const stats = store.getStats();

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Toast */}
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CircleCheck className="w-4 h-4" />
            ) : (
              <CircleAlert className="w-4 h-4" />
            )}

            <span>{toast.message}</span>
          </div>
        </motion.div>
      )}

      {/* Welcome + Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#0F4C3A]">
              Welcome, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {user.role === "admin" ? "Admin Dashboard" : `${user.ward}, ${user.lga}`}
            </p>
          </div>
          <button
            onClick={() => setShowNewReport(true)}
            className="px-4 py-2 bg-[#0F4C3A] text-white text-sm font-semibold rounded-xl hover:bg-[#0a3a2c] transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Report
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Reports", value: stats.totalReports, icon: FileText, color: "text-[#0F4C3A]", bg: "bg-[#0F4C3A]/5" },
            { label: "Resolved", value: stats.resolved, icon: CircleCheck, color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Resolution Rate", value: `${stats.resolutionRate}%`, icon: ArrowUp, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-white border border-gray-100">
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-xl font-bold text-[#0F4C3A]">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs + Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "all" ? "bg-[#0F4C3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setActiveTab("mine")}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === "mine" ? "bg-[#0F4C3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              My Reports
            </button>
          </div>

          <div className="space-y-3">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-gray-100">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No reports yet. Create your first one!</p>
              </div>
            ) : (
              filteredReports.map((report) => {
                const statusBadge = STATUS_BADGES[report.status];
                const category = CATEGORIES.find((c) => c.value === report.category);
                const StatusIcon = statusBadge.icon;
                return (
                  <motion.div
                    key={report.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openReport(report)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedReport?.id === report.id
                        ? "bg-[#0F4C3A]/5 border-[#0F4C3A]/30 shadow-sm"
                        : "bg-white border-gray-100 hover:border-[#D4AF37]/30 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          {category && (
                            <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${category.color}`}>
                              {category.label}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${statusBadge.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusBadge.label}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug">{report.title}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{report.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {report.ward}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {report.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {store.getComments(report.id).length}
                          </span>
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpvote(report.id); }}
                        className="shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg hover:bg-[#D4AF37]/10 transition-all"
                      >
                        <ThumbsUp className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-semibold text-gray-500">{report.upvotes}</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Report Detail Panel */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const badge = STATUS_BADGES[selectedReport.status];
                      const Icon = badge.icon;
                      return (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${badge.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {badge.label}
                        </span>
                      );
                    })()}

                    {(() => {
                      const cat = CATEGORIES.find(
                        (c) => c.value === selectedReport.category
                      );

                      return cat ? (
                        <span
                          className={`px-2 py-0.5 text-xs font-medium rounded-full ${cat.color}`}
                        >
                          {cat.label}
                        </span>
                      ) : null;
                    })()}
                  </div>

                  <h3 className="text-base font-bold text-gray-900">
                    {selectedReport.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    By {selectedReport.userName} | {selectedReport.ward}, {selectedReport.lga}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

              <div className="p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedReport.description}</p>

                {selectedReport.resolution && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-xl">
                    <p className="text-xs font-semibold text-green-700 mb-1">Resolution</p>
                    <p className="text-sm text-green-600">{selectedReport.resolution}</p>
                  </div>
                )}

                {/* Admin Actions */}
                {user.role === "admin" && selectedReport.status !== "resolved" && selectedReport.status !== "dismissed" && (
                  <div className="mt-4 flex gap-2">
                    {selectedReport.status === "pending" && (
                      <button
                        onClick={() => handleStatusChange(selectedReport.id, "under-review")}
                        className="flex-1 px-3 py-2 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all"
                      >
                        Start Review
                      </button>
                    )}
                    {selectedReport.status === "under-review" && (
                      <button
                        onClick={() => handleResolve(selectedReport.id)}
                        className="flex-1 px-3 py-2 text-xs font-medium bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(selectedReport.id, "dismissed")}
                      className="px-3 py-2 text-xs font-medium bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Upvote */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => handleUpvote(selectedReport.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/10 text-[#8B6914] text-sm font-medium rounded-lg hover:bg-[#D4AF37]/20 transition-all"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {selectedReport.upvotes}
                  </button>
                  <span className="text-xs text-gray-400">
                    {new Date(selectedReport.createdAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Comments */}
              <div className="border-t border-gray-100">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Comments ({comments.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
                    {comments.length === 0 ? (
                      <p className="text-xs text-gray-400">No comments yet.</p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#0F4C3A]/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-[#0F4C3A]">
                              {comment.userName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-900">{comment.userName}</span>
                              {comment.userRole === "admin" && (
                                <span className="px-1.5 py-0.5 bg-[#D4AF37]/10 text-[#8B6914] text-[9px] font-medium rounded">Admin</span>
                              )}
                              <span className="text-[10px] text-gray-400">{new Date(comment.createdAt ?? Date.now()).toLocaleDateString()}</span>
                              {(user.role === "admin" || comment.userId === user.id) && (
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="ml-auto text-gray-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      placeholder="Add a comment..."
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="px-3 py-2 bg-[#0F4C3A] text-white rounded-lg hover:bg-[#0a3a2c] transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReport && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={closeReportModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F4C3A]">New Report</h2>
              <button onClick={closeReportModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateReport} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                  placeholder="Brief title of the issue"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as (typeof CATEGORIES)[number]["value"])}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
                <input
                  type="text"
                  value={newWard}
                  onChange={(e) => setNewWard(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>

                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] transition-all resize-none"
                  placeholder="Describe the issue in detail..."
                  required
                />

                <p className="text-xs text-gray-400 text-right mt-1">
                  {newDesc.length}/500
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeReportModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#0F4C3A] text-white font-semibold rounded-xl hover:bg-[#0a3a2c] transition-all text-sm"               >
                  Submit Report
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}