"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { exportBatchCampusCSV } from "@/actions/export";

export default function BatchExportForm({ campuses, teachers }: { campuses: any[], teachers?: any[] }) {
  const [exportMode, setExportMode] = useState<"campus" | "teacher">("campus");
  const [selectedId, setSelectedId] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (!selectedId) {
      toast.error(`Please select a ${exportMode} first.`);
      return;
    }

    setIsExporting(true);
    
    try {
      toast.info(`Generating real-time analytics ${exportMode === "teacher" ? "Excel" : "CSV"}...`);
      
      if (exportMode === "campus") {
        const result = await exportBatchCampusCSV(selectedId);
        if (result.error || !result.csv) {
          toast.error(result.error || "Failed to generate CSV.");
          setIsExporting(false);
          return;
        }
        
        toast.success("Batch export completed successfully! Check your downloads.");
        const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", result.filename || `batch_export.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const { exportTeacherBatchExcel } = await import("@/actions/export");
        const result = await exportTeacherBatchExcel(selectedId);
        if (result.error || !result.excelBase64) {
          toast.error(result.error || "Failed to generate Excel.");
          setIsExporting(false);
          return;
        }

        toast.success("Batch export completed successfully! Check your downloads.");
        
        const byteCharacters = atob(result.excelBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", result.filename || `batch_export.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      toast.error("Failed to generate batch export.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>Select an export mode to generate real-time analytics.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        
        <div className="flex gap-4 mb-4">
          <Button 
            variant={exportMode === "campus" ? "default" : "outline"} 
            onClick={() => { setExportMode("campus"); setSelectedId(""); }}
          >
            By Campus
          </Button>
          <Button 
            variant={exportMode === "teacher" ? "default" : "outline"} 
            onClick={() => { setExportMode("teacher"); setSelectedId(""); }}
          >
            By Teacher (All Campuses)
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {exportMode === "campus" ? "Select Campus" : "Select Teacher"}
          </label>
          <select 
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="">Choose...</option>
            {exportMode === "campus" && campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            {exportMode === "teacher" && teachers?.map(t => <option key={t.id} value={t.id}>{t.teacher_name} ({t.teacher_code})</option>)}
          </select>
        </div>
        
        <div className="pt-4 flex gap-4">
          <Button onClick={handleExportCSV} disabled={isExporting || !selectedId} className="bg-green-600 hover:bg-green-700">
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isExporting ? "Downloading..." : (exportMode === "teacher" ? "Download Excel (.xlsx)" : "Batch Export CSV")}
          </Button>
          <Button variant="outline" disabled className="cursor-not-allowed">
            <Download className="w-4 h-4 mr-2" />
            Batch Export PDFs (Coming Soon)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
