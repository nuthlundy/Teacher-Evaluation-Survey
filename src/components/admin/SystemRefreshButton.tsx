"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { clearSystemCache } from "@/actions/system";
import { toast } from "sonner";

export function SystemRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Clearing system cache...");
    try {
      await clearSystemCache();
      toast.success("Cache cleared successfully! Reloading...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to clear cache.");
      setIsRefreshing(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleRefresh} 
      disabled={isRefreshing}
      className="h-10 text-xs font-bold text-slate-750 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl shadow-sm hover:shadow transition-all duration-300 cursor-pointer px-4 flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh System Cache
    </Button>
  );
}
