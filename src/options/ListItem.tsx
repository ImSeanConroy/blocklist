import { formatSchedule, isWithinSchedule } from "./siteUtils";
import { SiteRule } from "./types";
import { Badge } from "@/components/ui/badge";

type ListItemProps = {
  site: string;
  rule: SiteRule;
  onSelect: () => void;
};

const ListItem = ({ site, rule, onSelect }: ListItemProps) => {
  const isBlockingNow = rule.enabled && isWithinSchedule(rule);

  return (
    <li
      className="flex w-full items-center gap-3  rounded-xl border bg-white border-zinc-200 p-4 py-3.5 shadow-none hover:bg-zinc-100 cursor-pointer"
      onClick={onSelect}
    >
      <img
        className="h-10 w-10 rounded-md border border-zinc-200 bg-zinc-50 p-2"
        src={`https://www.google.com/s2/favicons?domain=${site}&size=24`}
        alt="Favicon"
      />
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-sm text-zinc-900">{site}</strong>
        <span className="text-xs text-zinc-500">
          {rule.enabled ? formatSchedule(rule) : "Paused"}
        </span>
      </div>
      {isBlockingNow && <Badge variant="success">Active now</Badge>}
    </li>
  );
};

export default ListItem;
