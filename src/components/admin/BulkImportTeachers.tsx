"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { bulkCreateTeachers } from "@/actions/teachers";
import { toast } from "sonner";

export function BulkImportTeachers() {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    toast.info("Parsing CSV...");

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rows = results.data as any[];
          
          // Map CSV headers to our expected keys
          const teachers = rows.map(row => ({
            teacher_code: row["ID"] || row["Teacher ID"] || row["teacher_code"],
            teacher_name: row["Name"] || row["Teacher Name"] || row["teacher_name"],
            subject: row["Subject"] || row["subject"],
            campus_code: row["Campus"] || row["campus_code"] || row["Campus Code"]
          })).filter(t => t.teacher_code && t.teacher_name && t.campus_code);

          if (teachers.length === 0) {
            toast.error("No valid teacher data found. Ensure headers match (ID, Name, Subject, Campus).");
            setIsUploading(false);
            return;
          }

          toast.info(`Importing ${teachers.length} teachers...`);
          const count = await bulkCreateTeachers(teachers);
          toast.success(`Successfully imported ${count} teachers!`);
        } catch (error) {
          console.error(error);
          toast.error("Failed to import teachers.");
        } finally {
          setIsUploading(false);
          // Reset file input
          e.target.value = '';
        }
      },
      error: (error) => {
        console.error(error);
        toast.error("Failed to parse CSV file.");
        setIsUploading(false);
      }
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent = "Teacher ID,Teacher Name,Subject,Campus Code\n12345,John Doe,\"Math, Physics\",STD\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Teachers_Import_Template.csv";
    link.click();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleDownloadTemplate}>
        Download Template
      </Button>
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <Button variant="outline" disabled={isUploading} className="pointer-events-none">
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Importing..." : "Bulk Import (CSV)"}
        </Button>
      </div>
    </div>
  );
}
