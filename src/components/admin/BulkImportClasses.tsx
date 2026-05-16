"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { bulkCreateClasses } from "@/actions/classes";
import { toast } from "sonner";

export function BulkImportClasses() {
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
          
          const classes = rows.map(row => ({
            class_code: row["Class Code"] || row["class_code"] || row["ID"],
            grade: row["Grade"] || row["grade"],
            section: row["Section"] || row["section"],
            campus_code: row["Campus"] || row["campus_code"] || row["Campus Code"],
            teacher_code: row["Teacher Code"] || row["Teacher ID"] || row["teacher_code"],
            teacher_name: row["Teacher Name"] || row["Teacher"] || row["teacher_name"],
          })).filter(c => c.class_code && c.grade && c.section && c.campus_code);

          if (classes.length === 0) {
            toast.error("No valid class data found. Ensure headers match (Class Code, Grade, Section, Campus, Teacher Code).");
            setIsUploading(false);
            return;
          }

          toast.info(`Importing ${classes.length} classes...`);
          const count = await bulkCreateClasses(classes);
          toast.success(`Successfully imported ${count} classes!`);
        } catch (error) {
          console.error(error);
          toast.error("Failed to import classes.");
        } finally {
          setIsUploading(false);
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
    const csvContent = "Class Code,Grade,Section,Campus Code,Teacher Code\nC_STD_G10_A,G10,A,STD,12345\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Classes_Import_Template.csv";
    link.click();
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleDownloadTemplate} className="shadow-sm">
          Download Template
        </Button>
        <div className="relative">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            disabled={isUploading}
          />
          <Button variant="outline" disabled={isUploading} className="pointer-events-none relative z-0 shadow-sm border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100">
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? "Importing..." : "Bulk Import (CSV)"}
          </Button>
        </div>
      </div>
      <p className="text-xs text-slate-500 mr-2">Note: Campus Code must exist in the system before importing classes.</p>
    </div>
  );
}
