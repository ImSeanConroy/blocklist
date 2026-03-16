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
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setStartTime(String(rule.startHour));
    setEndTime(String(rule.endHour));
    setEnabled(rule.enabled);
    setError("");
  }, [rule, selectedSite]);

  const parsedStart = normalizeHour(startTime, -1);
  const parsedEnd = normalizeHour(endTime, -1);
  const isRangeValid = parsedStart >= 0 && parsedStart <= 23 && parsedEnd >= 0 && parsedEnd <= 23;

  const handleSubmit = () => {
    if (!isRangeValid) {
      setError("Hours must be whole numbers between 0 and 23.");
      return;
    }

    onSave({
      startHour: parsedStart,
      endHour: parsedEnd,
      enabled,
    });
  };

  const setPreset = (startHour: number, endHour: number) => {
    setStartTime(String(startHour));
    setEndTime(String(endHour));
    setError("");
  };

  const currentRule: SiteRule = {
    startHour: isRangeValid ? parsedStart : rule.startHour,
    endHour: isRangeValid ? parsedEnd : rule.endHour,
    enabled,
  };

  return (
    <TooltipProvider>
    <Card className="w-full border-zinc-200/80 bg-white">
      <CardHeader className="border-b border-zinc-100 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-base">Edit Schedule</CardTitle>
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
          <Button variant="outline" onClick={() => setPreset(9, 17)} type="button">
            Work day
          </Button>
          <Button variant="outline" onClick={() => setPreset(18, 23)} type="button">
            Evening
          </Button>
          <Button variant="outline" onClick={() => setPreset(0, 0)} type="button">
            Always
          </Button>
        </div>

        {error && (
          <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button className="flex-1" variant="outline" onClick={closeMenu} type="button">
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
