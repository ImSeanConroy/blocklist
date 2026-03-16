import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { Download, Upload } from "lucide-react";
import ListItem from "./ListItem";
import Menu from "./Menu";
import {
  isWithinSchedule,
  normalizeSiteInput,
  normalizeStoredSites,
} from "./siteUtils";
import { BlockedSites, DEFAULT_RULE, SiteRule } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeedbackTone = "success" | "error" | "info";

type Feedback = {
  tone: FeedbackTone;
  message: string;
};

function App() {
  const [siteInput, setSiteInput] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sites, setSites] = useState<BlockedSites>({});
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const importInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    void loadSites();
  }, []);

  const sortedEntries = useMemo(
    () => Object.entries(sites).sort(([a], [b]) => a.localeCompare(b)),
    [sites],
  );

  const visibleEntries = useMemo(() => {
    const query = searchInput.trim().toLowerCase();

    if (!query) {
      return sortedEntries;
    }

    return sortedEntries.filter(([site]) => site.includes(query));
  }, [searchInput, sortedEntries]);

  const stats = useMemo(() => {
    let enabled = 0;
    let activeNow = 0;

    for (const [, rule] of sortedEntries) {
      if (!rule.enabled) {
        continue;
      }

      enabled += 1;

      if (isWithinSchedule(rule)) {
        activeNow += 1;
      }
    }

    return {
      total: sortedEntries.length,
      enabled,
      activeNow,
    };
  }, [sortedEntries]);

  async function loadSites() {
    const result = await chrome.storage.sync.get(["sites"]);
    setSites(normalizeStoredSites(result.sites));
  }

  async function saveSites(nextSites: BlockedSites) {
    setSites(nextSites);
    await chrome.storage.sync.set({ sites: nextSites });
  }

  function showFeedback(tone: FeedbackTone, message: string) {
    setFeedback({ tone, message });
  }

  async function handleAddSite() {
    const normalizedSite = normalizeSiteInput(siteInput);

    if (!normalizedSite) {
      showFeedback("error", "Enter a valid domain or wildcard pattern.");
      return;
    }

    if (sites[normalizedSite]) {
      showFeedback("info", `${normalizedSite} is already in your blocklist.`);
      setSelectedSite(normalizedSite);
      setIsEditorOpen(true);
      setSiteInput("");
      return;
    }

    const nextSites = {
      ...sites,
      [normalizedSite]: DEFAULT_RULE,
    };

    await saveSites(nextSites);
    setSiteInput("");
    setSelectedSite(normalizedSite);
    setIsEditorOpen(true);
    showFeedback("success", `Added ${normalizedSite} to your blocklist.`);
  }

  function openEditor(site: string) {
    setSelectedSite(site);
    setIsEditorOpen(true);
  }

  function closeEditor() {
    setIsEditorOpen(false);
    setSelectedSite(null);
  }

  async function handleUpdateRule(site: string, rule: SiteRule) {
    if (!sites[site]) {
      return;
    }

    const nextSites = {
      ...sites,
      [site]: rule,
    };

    await saveSites(nextSites);
    showFeedback("success", `Updated schedule for ${site}.`);
    closeEditor();
  }

  async function handleRemoveSite(site: string) {
    if (!sites[site]) {
      return;
    }

    const nextSites = { ...sites };
    delete nextSites[site];

    await saveSites(nextSites);
    showFeedback("success", `Removed ${site} from your blocklist.`);

    if (selectedSite === site) {
      closeEditor();
    }
  }

  function handleExport() {
    const payload = JSON.stringify({ sites }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "blocklist-backup.json";
    anchor.click();

    URL.revokeObjectURL(url);

    showFeedback("success", "Exported blocklist backup.");
  }

  function triggerImport() {
    importInputRef.current?.click();
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { sites?: unknown } | unknown;
      const importedSites = normalizeStoredSites(
        typeof parsed === "object" && parsed !== null && "sites" in parsed
          ? (parsed as { sites?: unknown }).sites
          : parsed,
      );

      const nextSites = {
        ...sites,
        ...importedSites,
      };

      await saveSites(nextSites);
      showFeedback(
        "success",
        `Imported ${Object.keys(importedSites).length} site(s).`,
      );
    } catch {
      showFeedback("error", "Could not import file. Verify it is valid JSON.");
    } finally {
      event.target.value = "";
    }
  }

  return (
    <TooltipProvider>
    <main className="min-h-screen bg-zinc-100 w-screen px-3 py-4 md:px-6 md:py-8">
      <div className="mx-auto max-w-xl space-y-4">
       <Card className="border-zinc-200/80 bg-white/95 shadow-none rounded-2xl">
          <CardHeader className="gap-3 border-b border-zinc-100 pb-4">
            <div className="flex flex-row items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl">BlockList</CardTitle>
                <CardDescription>
                  Block distracting domains with always-on or scheduled rules.
                </CardDescription>
                <div className="flex gap-2 pt-0.5">
                  <Badge variant="secondary">{stats.total} total</Badge>
                  <Badge variant="success">{stats.activeNow} active now</Badge>
                </div>
              </div>
              <div className="flex gap-1 -mt-1 -mr-1 shrink-0">
                <Tooltip label="Import blocklist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                  onClick={triggerImport}
                  type="button"
                  aria-label="Import blocklist"
                >
                  <Upload className="h-4 w-4" />
                </Button>
                </Tooltip>
                <Tooltip label="Export blocklist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                  onClick={handleExport}
                  type="button"
                  aria-label="Export blocklist"
                >
                  <Download className="h-4 w-4" />
                </Button>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-5 pb-2">
            {feedback && (
              <div
                className={cn(
                  "rounded-md border px-3 py-2 text-sm",
                  feedback.tone === "success" &&
                    "border-emerald-200 bg-emerald-50 text-emerald-800",
                  feedback.tone === "error" &&
                    "border-red-200 bg-red-50 text-red-800",
                  feedback.tone === "info" &&
                    "border-blue-200 bg-blue-50 text-blue-800",
                )}
              >
                {feedback.message}
              </div>
            )}

            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input
                type="text"
                value={siteInput}
                onChange={(event) => setSiteInput(event.target.value)}
                placeholder="example.com or *.news.com"
                className="rounded-lg shadow-none"
              />
              <Button onClick={() => void handleAddSite()}  className="cursor-pointer rounded-lg">Add domain</Button>
            </div>

            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </CardContent>
        </Card>

        <Card className="border-zinc-200/80 bg-white/95 shadow-none rounded-2xl">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Blocked Domains</CardTitle>
                <CardDescription>
                  Showing {visibleEntries.length} of {sortedEntries.length} rules.
                </CardDescription>
              </div>
              <Input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search"
                className="h-8 w-36 rounded-lg shadow-none text-sm"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <ul className="max-h-[56vh] space-y-3 overflow-auto pr-1">
              {visibleEntries.length === 0 && (
                <li className="rounded-md border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-500">
                  No domains match this filter.
                </li>
              )}

              {visibleEntries.map(([site, rule]) => (
                <ListItem
                  key={site}
                  site={site}
                  rule={rule}
                  onSelect={() => openEditor(site)}
                />
              ))}
            </ul>
          </CardContent>
        </Card>

        {isEditorOpen && selectedSite && sites[selectedSite] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Edit rule for ${selectedSite}`}
          >
            <button
              className="absolute inset-0 bg-zinc-900/45 backdrop-blur-[1px]"
              type="button"
              onClick={closeEditor}
              aria-label="Close editor"
            />

            <div className="relative z-10 w-full max-w-md">
              <Menu
                selectedSite={selectedSite}
                rule={sites[selectedSite]}
                onSave={(nextRule) => void handleUpdateRule(selectedSite, nextRule)}
                onDelete={() => void handleRemoveSite(selectedSite)}
                closeMenu={closeEditor}
              />
            </div>
          </div>
        )}
      </div>
    </main>
    </TooltipProvider>
  );
}

export default App;
