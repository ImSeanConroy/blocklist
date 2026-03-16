import { useState, useEffect } from "react";
import { Globe, Trash2 } from "lucide-react";
import { formatSchedule, normalizeHour } from "./siteUtils";
import { SiteRule } from "./types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];

const Menu = ({
  selectedSite,
  rule,
  onSave,
  onDelete,
  closeMenu,
}: {
  selectedSite: string;
  rule: SiteRule;
  onSave: (rule: SiteRule) => void;
  onDelete: () => void;
  closeMenu: () => void;
}) => {
  const [startTime, setStartTime] = useState<string>(String(rule.startHour));
  const [endTime, setEndTime] = useState<string>(String(rule.endHour));
  const [enabled, setEnabled] = useState<boolean>(rule.enabled);
  const [days, setDays] = useState<number[]>(rule.days ?? ALL_DAYS);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setStartTime(String(rule.startHour));
    setEndTime(String(rule.endHour));
    setEnabled(rule.enabled);
    setDays(rule.days ?? ALL_DAYS);
    setError("");
  }, [rule, selectedSite]);

  const parsedStart = normalizeHour(startTime, -1);
  const parsedEnd = normalizeHour(endTime, -1);
  const isRangeValid =
    parsedStart >= 0 && parsedStart <= 23 && parsedEnd >= 0 && parsedEnd <= 23;

  const handleSubmit = () => {
    if (!isRangeValid) {
      setError("Hours must be whole numbers between 0 and 23.");
      return;
    }

    onSave({
      startHour: parsedStart,
      endHour: parsedEnd,
      enabled,
      days: days.length > 0 ? days : ALL_DAYS,
    });
  };

  const setPreset = (
    startHour: number,
    endHour: number,
    presetDays?: number[],
  ) => {
    setStartTime(String(startHour));
    setEndTime(String(endHour));
    if (presetDays) setDays(presetDays);
    setError("");
  };

  const toggleDay = (day: number) => {
    setDays((prev) =>
      prev.includes(day)
        ? prev.length > 1
          ? prev.filter((d) => d !== day)
          : prev // keep at least 1 day
        : [...prev, day].sort((a, b) => a - b),
    );
  };

  const currentRule: SiteRule = {
    startHour: isRangeValid ? parsedStart : rule.startHour,
    endHour: isRangeValid ? parsedEnd : rule.endHour,
    enabled,
    days,
  };

  return (
    <TooltipProvider>
      <Card className="w-full border-zinc-200/80 bg-white">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <CardTitle className="text-base">Update Schedule</CardTitle>
              <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-sm text-zinc-800 w-fit">
                <Globe className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                {selectedSite}
              </div>
              <CardDescription className="text-xs">
                {enabled ? formatSchedule(currentRule) : "Blocking is paused"}
              </CardDescription>
            </div>
            <Tooltip label="Remove domain" side="left">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-600 hover:bg-red-50 -mt-1 -mr-1 shrink-0"
                onClick={onDelete}
                type="button"
                aria-label="Remove domain"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs text-zinc-500" htmlFor="startHour">
                Start hour
              </label>
              <Input
                id="startHour"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                type="number"
                step="1"
                min="0"
                max="23"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-500" htmlFor="endHour">
                End hour
              </label>
              <Input
                id="endHour"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                type="number"
                step="1"
                min="0"
                max="23"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              onClick={() => setPreset(9, 17, [1, 2, 3, 4, 5])}
              type="button"
              size="sm"
              className="cursor-pointer"
            >
              Work day
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreset(18, 23)}
              type="button"
              size="sm"
              className="cursor-pointer"
            >
              Evening
            </Button>
            <Button
              variant="outline"
              onClick={() => setPreset(0, 0, ALL_DAYS)}
              type="button"
              size="sm"
              className="cursor-pointer"
            >
              Always
            </Button>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-zinc-500">Active days</p>
            <div className="flex gap-1">
              {DAY_LABELS.map((label, i) => (
                <Button
                  key={i}
                  type="button"
                  aria-label={DAY_FULL[i]}
                  aria-pressed={days.includes(i)}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium border transition-colors select-none",
                    days.includes(i)
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-700",
                  )}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
              htmlFor="enabled-toggle"
            >
              <span className="text-zinc-700">Rule enabled</span>
              <input
                id="enabled-toggle"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                type="checkbox"
              />
            </label>
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1"
              variant="outline"
              onClick={closeMenu}
              type="button"
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSubmit} type="button">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default Menu;
