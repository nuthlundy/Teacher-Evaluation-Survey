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
      className="text-slate-600 border-slate-300 hover:bg-slate-100"
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
      Refresh System Cache
    </Button>
  );
}
