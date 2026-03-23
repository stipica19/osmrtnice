"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AdminStatus = "all" | "published" | "draft";

type AdminTablePanelProps<T> = {
  title: string;
  counts: {
    total: number;
    published: number;
    draft: number;
  };
  onRefresh: () => void;
  isFetching: boolean;
  actionsSlot?: React.ReactNode;
  infoTitle: string;
  infoText: string;
  query: string;
  onQueryChange: (value: string) => void;
  searchPlaceholder: string;
  statusFilter: AdminStatus;
  onStatusFilterChange: (value: AdminStatus) => void;
  isLoading: boolean;
  errorMessage: string | null;
  items: T[];
  getRowId: (item: T) => string;
  firstColumnLabel: string;
  renderPrimaryCell: (item: T) => React.ReactNode;
  getStatus: (item: T) => string;
  getPublishedAt: (item: T) => string | null | undefined;
  onUpdateStatus: (item: T, status: "published" | "draft") => void;
  onDeleteItem: (item: T) => void;
  getEditHref?: (item: T) => string;
};

function statusBadge(status: string) {
  return status === "published"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-amber-100 text-amber-700";
}

function formatPublishedAt(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function AdminTablePanel<T>({
  title,
  counts,
  onRefresh,
  isFetching,
  actionsSlot,
  infoTitle,
  infoText,
  query,
  onQueryChange,
  searchPlaceholder,
  statusFilter,
  onStatusFilterChange,
  isLoading,
  errorMessage,
  items,
  getRowId,
  firstColumnLabel,
  renderPrimaryCell,
  getStatus,
  getPublishedAt,
  onUpdateStatus,
  onDeleteItem,
  getEditHref,
}: AdminTablePanelProps<T>) {
  return (
    <div className="p-6 mb-0 mt-0 mr-auto ml-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-neutral-500">
            Ukupno: {counts.total} · Objavljeno: {counts.published} · Neobjavljeno: {" "}
            {counts.draft}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onRefresh}>
            {isFetching ? "Osvježavanje..." : "Osvježi"}
          </Button>
          {actionsSlot}
        </div>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {infoTitle}
            </h3>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
              {infoText}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="md:max-w-sm"
          />
          <div className="flex items-center gap-2">
            {(["all", "published", "draft"] as const).map((status) => (
              <button
                key={status}
                type="button"
                className={`h-9 rounded-md border px-3 text-sm ${
                  statusFilter === status
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 text-neutral-700"
                }`}
                onClick={() => onStatusFilterChange(status)}
              >
                {status === "all"
                  ? "Sve"
                  : status === "published"
                    ? "Objavljeno"
                    : "Neobjavljeno"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <div>Učitavanje…</div>}
      {errorMessage && <div className="text-red-600 mb-3">Greška: {errorMessage}</div>}

      {!isLoading && !errorMessage && (
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {firstColumnLabel}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Objavljeno
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {items.map((item) => {
                const id = getRowId(item);
                const status = getStatus(item);
                const published = status === "published";

                return (
                  <tr key={id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">{renderPrimaryCell(item)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge(status)}`}
                        >
                          {status === "published" ? "Objavljeno" : "Neobjavljeno"}
                        </span>
                        <div className="flex items-center gap-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`status-${id}`}
                              checked={published}
                              onChange={() => onUpdateStatus(item, "published")}
                            />
                            Aktivno
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`status-${id}`}
                              checked={!published}
                              onChange={() => onUpdateStatus(item, "draft")}
                            />
                            Neaktivno
                          </label>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600">
                      {formatPublishedAt(getPublishedAt(item))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {getEditHref ? (
                          <Link href={getEditHref(item)}>
                            <Button variant="secondary">Uredi</Button>
                          </Link>
                        ) : null}
                        <Button
                          variant="destructive"
                          onClick={() => onDeleteItem(item)}
                        >
                          Obriši
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
