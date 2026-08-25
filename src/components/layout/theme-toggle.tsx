"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const notify = () => onStoreChange();

  media.addEventListener("change", notify);
  window.addEventListener("iot-theme-change", notify);

  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener("iot-theme-change", notify);
  };
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("iot-theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("iot-theme-change"));
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-ink-muted hover:bg-paper-sink hover:text-ink"
      onClick={toggle}
      aria-label={dark ? "Activer le thème clair" : "Activer le thème sombre"}
      title={dark ? "Thème clair" : "Thème sombre"}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}
