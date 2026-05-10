"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HeatmapData {
  activity_date: string;
  revision_count: number;
  new_problems: number;
}

export default function HeatmapGrid({ data }: { data: HeatmapData[] }) {
  // Build a map of date → activity
  const activityMap = new Map<string, HeatmapData>();
  data.forEach((d) => activityMap.set(d.activity_date, d));

  // Generate last 365 days
  const days: Date[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  // Organize into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  days.forEach((day) => {
    if (day.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  if (currentWeek.length > 0) weeks.push(currentWeek);

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="overflow-x-auto">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-1 ml-[30px]">
        {weeks.map((week, wi) => {
          const firstDay = week[0];
          const showLabel = firstDay.getDate() <= 7;
          return (
            <div key={wi} className="w-[11px] text-[9px] text-muted-foreground">
              {showLabel ? months[firstDay.getMonth()] : ""}
            </div>
          );
        })}
      </div>

      <div className="flex gap-0">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1 text-[9px] text-muted-foreground pt-0">
          {["", "Mon", "", "Wed", "", "Fri", ""].map((d, i) => (
            <div key={i} className="h-[11px] flex items-center justify-end w-[24px]">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }, (_, di) => {
                const day = week.find((d) => d.getDay() === di);
                if (!day) return <div key={di} className="h-[11px] w-[11px]" />;
                const dateStr = day.toISOString().split("T")[0];
                const activity = activityMap.get(dateStr);
                const total = (activity?.revision_count || 0) + (activity?.new_problems || 0);
                const level = getLevel(total);
                return (
                  <Tooltip key={di}>
                    <TooltipTrigger>
                      <div className={`h-[11px] w-[11px] rounded-[2px] heatmap-${level} transition-colors hover:ring-1 hover:ring-foreground/20`} />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p className="font-medium">{day.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                      <p className="text-muted-foreground">
                        {activity ? `${activity.revision_count} revisions, ${activity.new_problems} new` : "No activity"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1 mt-2 justify-end text-[10px] text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <div key={l} className={`h-[10px] w-[10px] rounded-[2px] heatmap-${l}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
