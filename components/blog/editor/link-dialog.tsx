"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface LinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialUrl?: string;
  initialOpenInNewTab?: boolean;
  onSave: (url: string, openInNewTab: boolean) => void;
  onRemove?: () => void;
}

export function LinkDialog({
  open,
  onOpenChange,
  initialUrl = "",
  initialOpenInNewTab = true,
  onSave,
  onRemove,
}: LinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab);

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      setOpenInNewTab(initialOpenInNewTab);
    }
  }, [open, initialUrl, initialOpenInNewTab]);

  const handleSave = () => {
    if (!url.trim()) return;
    onSave(url.trim(), openInNewTab);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert link</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="open-new-tab"
              checked={openInNewTab}
              onCheckedChange={(checked) => setOpenInNewTab(checked === true)}
            />
            <Label htmlFor="open-new-tab" className="font-normal cursor-pointer">
              Open in new tab
            </Label>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {onRemove && initialUrl && (
            <Button type="button" variant="destructive" onClick={onRemove}>
              Remove link
            </Button>
          )}
          <Button type="button" onClick={handleSave} disabled={!url.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
