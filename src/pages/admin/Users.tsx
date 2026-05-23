import { useMemo, useState } from "react";
import { PageHeader } from "../../components/app/PageHeader";
import {
  DataTable,
  type Column,
} from "../../components/app/DataTable";
import { StatusPill, statusTone } from "../../components/app/StatusPill";
import { Icon } from "../../components/app/icons";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import {
  mockBranches,
  mockDepartments,
  mockLearners,
  mockPositions,
} from "../../data/mock";
import type { User, UserStatus } from "../../data/entities";

const STATUS_OPTIONS = ["all", "active", "pending", "blocked", "inactive"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

export function AdminUsers() {
  const [q, setQ] = useState("");
  const [branch, setBranch] = useState<string>("all");
  const [department, setDepartment] = useState<string>("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    return mockLearners.filter((u) => {
      if (status !== "all" && u.status !== (status as UserStatus)) return false;
      if (branch !== "all" && u.branchId !== branch) return false;
      if (department !== "all" && u.departmentId !== department) return false;
      if (q.trim()) {
        const needle = q.toLowerCase();
        if (
          !u.fullName.toLowerCase().includes(needle) &&
          !u.email.toLowerCase().includes(needle) &&
          !(u.employeeId ?? "").toLowerCase().includes(needle)
        )
          return false;
      }
      return true;
    });
  }, [q, branch, department, status]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );

  const columns: ReadonlyArray<Column<User>> = [
    {
      key: "name",
      header: "Xodim",
      render: (u) => (
        <div className="flex items-center gap-sm">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand-yellow text-primary text-caption-bold pastel">
            {u.fullName
              .split(" ")
              .slice(0, 2)
              .map((s) => s[0]?.toUpperCase() ?? "")
              .join("")}
          </span>
          <div className="min-w-0">
            <div className="text-body-sm-medium text-ink truncate">{u.fullName}</div>
            <div className="text-caption text-stone">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "employee",
      header: "Employee ID",
      render: (u) => (
        <span className="text-caption text-stone">{u.employeeId ?? "—"}</span>
      ),
    },
    {
      key: "branch",
      header: "Filial",
      render: (u) => (
        <span className="text-body-sm text-charcoal">
          {mockBranches.find((b) => b.id === u.branchId)?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "position",
      header: "Lavozim",
      render: (u) => (
        <span className="text-body-sm text-charcoal">
          {mockPositions.find((p) => p.id === u.positionId)?.title ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (u) => <StatusPill label={u.status} tone={statusTone(u.status)} />,
    },
    {
      key: "joined",
      header: "Qo'shilgan",
      render: (u) => (
        <span className="text-caption text-stone">
          {new Date(u.joinedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: () => (
        <button className="text-body-sm-medium text-brand-blue hover:underline">
          View
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="People"
        title="Foydalanuvchilar"
        description={`${filtered.length} ta xodim filtr asosida topildi.`}
        actions={
          <>
            <Button variant="secondary">
              <Icon.Doc />
              <span>Import</span>
            </Button>
            <Button variant="primary">
              <Icon.Users />
              <span>Yangi learner</span>
            </Button>
          </>
        }
      />

      <div className="rounded-2xl bg-surface-soft border border-hairline-soft p-md mb-md">
        <div className="grid gap-sm md:grid-cols-[1.6fr_repeat(3,1fr)]">
          <Input
            type="search"
            placeholder="Ism, email, employee ID bo'yicha qidirish"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }}
          />
          <Select
            options={[
              "all",
              ...mockBranches.map((b) => b.id),
            ] as string[]}
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
              setPage(0);
            }}
            // We override labels via custom display below — but Select renders
            // the raw values, so fall back to a custom approach:
          />
          <Select
            options={[
              "all",
              ...mockDepartments.map((d) => d.id),
            ] as string[]}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(0);
            }}
          />
          <Select
            options={[...STATUS_OPTIONS]}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(0);
            }}
          />
        </div>
        <div className="mt-xs flex flex-wrap items-center gap-xs text-caption text-stone">
          <span>Filtr:</span>
          {[
            ...(q.trim() ? [`"${q}"`] : []),
            ...(branch !== "all"
              ? [
                  `filial: ${mockBranches.find((b) => b.id === branch)?.name ?? branch}`,
                ]
              : []),
            ...(department !== "all"
              ? [
                  `bo'lim: ${mockDepartments.find((d) => d.id === department)?.name ?? department}`,
                ]
              : []),
            ...(status !== "all" ? [`status: ${status}`] : []),
          ].map((label) => (
            <span
              key={label}
              className="px-xs py-px rounded-full bg-canvas border border-hairline text-charcoal"
            >
              {label}
            </span>
          ))}
          {q.trim() || branch !== "all" || department !== "all" || status !== "all" ? (
            <button
              type="button"
              className="text-brand-blue hover:underline"
              onClick={() => {
                setQ("");
                setBranch("all");
                setDepartment("all");
                setStatus("all");
                setPage(0);
              }}
            >
              Filtrni tozalash
            </button>
          ) : (
            <span>yo'q</span>
          )}
        </div>
      </div>

      <DataTable<User>
        columns={columns}
        rows={rows}
        getRowId={(u) => u.id}
        emptyLabel="Filtr bo'yicha learner topilmadi"
      />

      <div className="mt-md flex items-center justify-between text-body-sm">
        <span className="text-stone">
          {filtered.length === 0
            ? "0"
            : `${currentPage * pageSize + 1}–${Math.min(
                filtered.length,
                (currentPage + 1) * pageSize,
              )} / ${filtered.length}`}
        </span>
        <div className="flex items-center gap-xs">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="h-9 px-md rounded-full border border-hairline-strong text-body-sm-medium text-ink disabled:opacity-40"
          >
            ←
          </button>
          <span className="text-stone">
            {currentPage + 1} / {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="h-9 px-md rounded-full border border-hairline-strong text-body-sm-medium text-ink disabled:opacity-40"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
