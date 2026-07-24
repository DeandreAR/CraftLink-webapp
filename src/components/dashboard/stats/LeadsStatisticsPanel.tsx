"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardLead } from "@/domain/lead";
import type { DashboardDictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import {
  computeLeadKpis,
  computeRequestsTimeline,
  computeStatusDistribution,
  filterLeadsByPeriod,
  formatEuro,
  type StatsPeriod,
  type StatsStatusBucket,
} from "@/lib/leads/leadAnalytics";

type LeadsStatisticsPanelProps = {
  leads: DashboardLead[];
  copy: DashboardDictionary;
  locale: Locale;
};

const PERIODS: StatsPeriod[] = ["7d", "month", "year"];

const BUCKET_COLORS: Record<StatsStatusBucket, string> = {
  pending: "#EFA188",
  quote_sent: "#D6BCFA",
  signed: "#5eead4",
  refused: "#94a3b8",
};

export function LeadsStatisticsPanel({
  leads,
  copy,
  locale,
}: LeadsStatisticsPanelProps) {
  const s = copy.leads.stats;
  const [period, setPeriod] = useState<StatsPeriod>("month");
  const localeTag = locale === "en" ? "en-GB" : "fr-FR";

  const filtered = useMemo(
    () => filterLeadsByPeriod(leads, period),
    [leads, period],
  );

  const kpis = useMemo(() => computeLeadKpis(filtered), [filtered]);
  const timeline = useMemo(
    () => computeRequestsTimeline(filtered, period, localeTag),
    [filtered, period, localeTag],
  );
  const distribution = useMemo(
    () => computeStatusDistribution(filtered),
    [filtered],
  );

  const pieData = useMemo(
    () =>
      distribution
        .filter((slice) => slice.count > 0)
        .map((slice) => ({
          name: s.distribution.buckets[slice.bucket],
          value: slice.count,
          percentage: slice.percentage,
          bucket: slice.bucket,
        })),
    [distribution, s.distribution.buckets],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{s.title}</h3>
          <p className="mt-1 max-w-xl text-sm text-slate-500">{s.subtitle}</p>
        </div>
        <div
          className="db-segmented w-full sm:w-auto"
          role="group"
          aria-label={s.periodAriaLabel}
        >
          {PERIODS.map((id) => {
            const active = period === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPeriod(id)}
                data-active={active ? "true" : undefined}
                className="db-segmented-item cursor-pointer text-xs sm:text-sm"
              >
                {s.periods[id]}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white py-14 text-center text-sm text-slate-500">
          {s.empty}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard label={s.kpis.total} value={String(kpis.totalRequests)} />
            <KpiCard
              label={s.kpis.conversion}
              value={`${kpis.conversionRate.toLocaleString(localeTag)} %`}
              hint={`${kpis.signedCount}/${kpis.totalRequests}`}
            />
            <KpiCard
              label={s.kpis.signedRevenue}
              value={formatEuro(kpis.signedRevenue, localeTag)}
            />
            <KpiCard
              label={s.kpis.pendingVolume}
              value={formatEuro(kpis.pendingQuoteVolume, localeTag)}
              hint={
                kpis.pendingQuoteCount > 0
                  ? `${kpis.pendingQuoteCount} devis`
                  : undefined
              }
            />
          </div>

          <p className="text-[11px] leading-relaxed text-[#5b6478]">{s.montantHint}</p>

          <div className="grid gap-4 lg:grid-cols-5">
            <section className="db-card p-4 lg:col-span-3">
              <h4 className="text-sm font-bold text-[#212129]">{s.timeline.title}</h4>
              <p className="mt-0.5 text-xs text-[#5b6478]">{s.timeline.subtitle}</p>
              <div className="mt-4 h-56 w-full sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeline}
                    margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="craftlinkRequestsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EFA188" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#EFA188" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#21212914" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#5b6478", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#5b6478", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(33,33,41,0.08)",
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        typeof value === "number" ? value : Number(value ?? 0),
                        s.timeline.requests,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#EFA188"
                      strokeWidth={2.5}
                      fill="url(#craftlinkRequestsFill)"
                      name={s.timeline.requests}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="db-card p-4 lg:col-span-2">
              <h4 className="text-sm font-bold text-[#212129]">
                {s.distribution.title}
              </h4>
              <p className="mt-0.5 text-xs text-[#5b6478]">{s.distribution.subtitle}</p>
              <div className="mt-2 h-48 w-full sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {pieData.map((entry) => (
                        <Cell
                          key={entry.bucket}
                          fill={BUCKET_COLORS[entry.bucket]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(33,33,41,0.08)",
                        fontSize: 12,
                      }}
                      formatter={(value, _name, item) => {
                        const pct =
                          item?.payload &&
                          typeof item.payload === "object" &&
                          "percentage" in item.payload
                            ? Number(
                                (item.payload as { percentage: number }).percentage,
                              )
                            : 0;
                        return [
                          `${typeof value === "number" ? value : Number(value ?? 0)} (${pct} %)`,
                          "",
                        ];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-1 space-y-1.5">
                {distribution.map((slice) => (
                  <li
                    key={slice.bucket}
                    className="flex items-center justify-between gap-2 text-xs text-[#5b6478]"
                  >
                    <span className="flex items-center gap-2 font-medium text-[#212129]">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: BUCKET_COLORS[slice.bucket] }}
                        aria-hidden
                      />
                      {s.distribution.buckets[slice.bucket]}
                    </span>
                    <span>
                      {slice.percentage.toLocaleString(localeTag)} % · {slice.count}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="db-card p-3.5 sm:p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#5b6478]">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tracking-tight text-[#212129] sm:text-2xl">
        {value}
      </p>
      {hint ? <p className="mt-1 text-[11px] text-[#5b6478]">{hint}</p> : null}
    </div>
  );
}
