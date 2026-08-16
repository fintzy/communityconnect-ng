import { MessageSquare, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { store } from "../../../services/store";

export default function Comments() {
  const comments = useMemo(
    () => store.getAllComments(),
    []
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#D4AF37]" />

          <span className="text-xs font-semibold uppercase tracking-wider text-[#0F4C3A]">
            Super Administrator
          </span>
        </div>

        <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">
          Comments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage comments submitted by community users.
        </p>
      </div>

      {/* Comments */}
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            All Comments
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            {comments.length} comment
            {comments.length === 1 ? "" : "s"} recorded
          </p>
        </div>

        {comments.length === 0 ? (
          <div className="p-10 text-center">
            <MessageSquare className="w-8 h-8 mx-auto text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              No comments found.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {comments.map((comment) => (
              <div
                key={comment.id}
                className="px-5 py-5"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3 min-w-0">

                    <div className="w-9 h-9 shrink-0 rounded-full bg-[#0F4C3A] flex items-center justify-center">
                      <span className="text-xs font-bold text-[#D4AF37]">
                        {comment.userName
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {comment.userName}
                        </p>

                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-600 capitalize">
                          {comment.userRole}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-600">
                        {comment.content}
                      </p>

                      <p className="mt-2 text-[11px] text-gray-400">
                        Report: {comment.reportId}
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        {new Date(
                          comment.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      store.deleteComment(comment.id);
                      window.location.reload();
                    }}
                    className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </section>
    </div>
  );
}