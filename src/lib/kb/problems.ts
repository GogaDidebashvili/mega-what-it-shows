// What a report is about, as a ticket: its cause (causes.ts), unless the desk read it as a one-day
// move (desk-notes.json). A one-day move is not a day/month swap, so neither cause fixes it.
import { causeOf, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = 'parser' | 'hint' | 'one-day' | 'unplaced';

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'one-day';
  return causeOf(r, t) ?? 'unplaced';
}

export function countByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { problem: Problem; reports: number; tenants: number }[] {
  const by = new Map<Problem, Report[]>();
  for (const r of reports) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  return [...by.entries()]
    .map(([problem, rs]) => ({ problem, reports: rs.length, tenants: new Set(rs.map((r) => r.tenant)).size }))
    .sort((a, b) => b.reports - a.reports);
}
