import { Suspense } from "react";
import { getCampuses, createCampus, deleteCampus } from "@/actions/campuses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

async function CampusesTable() {
  const campuses = await getCampuses();
  
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <CardTitle className="text-lg">Existing Campuses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campuses.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-500 h-24">
                  No campuses found.
                </TableCell>
              </TableRow>
            )}
            {campuses.map((campus) => (
              <TableRow key={campus.id}>
                <TableCell className="font-medium">{campus.name}</TableCell>
                <TableCell>{campus.code}</TableCell>
                <TableCell className="text-right">
                  <form action={async () => {
                    "use server";
                    await deleteCampus(campus.id);
                  }}>
                    <Button variant="ghost" size="icon" type="submit" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <Card className="shadow-sm border-0 ring-1 ring-slate-100">
      <CardHeader>
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-slate-50 rounded animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function CampusesPage() {
  const handleCreate = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const code = formData.get("code") as string;
    if (name && code) await createCampus({ name, code });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Campuses</h1>
      </div>

      <Card className="shadow-sm border-0 ring-1 ring-slate-100">
        <CardHeader>
          <CardTitle className="text-lg">Add New Campus</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label htmlFor="name" className="text-sm font-medium">Campus Name</label>
              <Input id="name" name="name" placeholder="e.g., Boeung Keng Kang" required />
            </div>
            <div className="space-y-2 flex-1">
              <label htmlFor="code" className="text-sm font-medium">Campus Code</label>
              <Input id="code" name="code" placeholder="e.g., BKK" required />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Add Campus</Button>
          </form>
        </CardContent>
      </Card>

      <Suspense fallback={<TableSkeleton />}>
        <CampusesTable />
      </Suspense>
    </div>
  );
}
