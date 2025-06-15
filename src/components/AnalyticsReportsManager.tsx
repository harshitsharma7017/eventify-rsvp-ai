
import React, { useState } from 'react';
import { Trash, Pencil } from 'lucide-react';
import {
  useAnalyticsReports,
  useDeleteAnalyticsReport,
  useUpdateAnalyticsReport,
  AnalyticsReport
} from '@/hooks/useAnalyticsReports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const AnalyticsReportsManager = () => {
  const { data: reports, isLoading, error, refetch } = useAnalyticsReports();
  const deleteMutation = useDeleteAnalyticsReport();
  const updateMutation = useUpdateAnalyticsReport();
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  if (isLoading) {
    return (<p className="text-gray-400 animate-pulse">Loading reports...</p>);
  }
  if (error) {
    return <p className="text-red-500">Failed to load reports.</p>;
  }

  return (
    <Card className="bg-slate-900/60 border border-cyan-500/20 mb-8">
      <CardContent>
        <div className="py-4">
          <h3 className="text-xl font-semibold mb-4 text-cyan-200">Analytics Reports</h3>
          {reports?.length === 0 && (
            <div className="text-gray-400 py-4">No analytics reports saved yet.</div>
          )}
          <ul className="space-y-4">
            {reports?.map((report) => (
              <li key={report.id} className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/30">
                <div className="flex-1">
                  {editId === report.id ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        updateMutation.mutate(
                          { id: report.id, name: editName },
                          {
                            onSuccess: () => {
                              setEditId(null);
                              refetch();
                            }
                          }
                        );
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="max-w-xs"
                        autoFocus
                      />
                      <Button size="sm" type="submit" className="bg-cyan-600 hover:bg-cyan-700">Save</Button>
                      <Button size="sm" type="button" variant="secondary" onClick={() => setEditId(null)}>
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <div>
                      <div className="font-medium text-cyan-100">{report.name}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(report.created_at).toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                <Button size="icon" variant="ghost" title="Edit"
                  onClick={() => {
                    setEditId(report.id);
                    setEditName(report.name);
                  }}>
                  <Pencil className="w-4 h-4 text-cyan-400" />
                </Button>
                <Button size="icon" variant="ghost" title="Delete"
                  onClick={() => {
                    if (window.confirm('Delete this report?')) {
                      deleteMutation.mutate(report.id, { onSuccess: refetch });
                    }
                  }}>
                  <Trash className="w-4 h-4 text-red-400" />
                </Button>
                <details className="ml-4 w-full max-w-[360px] text-xs bg-slate-900/60 border border-slate-700/40 rounded p-2 overflow-x-auto">
                  <summary className="cursor-pointer text-cyan-300 mb-2">View snapshot</summary>
                  <pre className="whitespace-pre-wrap text-gray-200">{JSON.stringify(report.snapshot, null, 2)}</pre>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsReportsManager;
