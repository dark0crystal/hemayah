import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

interface Applicant {
  id: string;
  'Civil ID': string;
  'Disability Description': string;
  'Disability Type': string;
  'Date Submitted': string;
}

interface FilteredResultsProps {
  accepted: Applicant[];
  rejected: Applicant[];
}

export function FilteredResults({ accepted, rejected }: FilteredResultsProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Accepted Applications</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Civil ID</TableHead>
              <TableHead>Disability Description</TableHead>
              <TableHead>Disability Type</TableHead>
              <TableHead>Date Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accepted.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{applicant['Civil ID']}</TableCell>
                <TableCell>{applicant['Disability Description']}</TableCell>
                <TableCell>{applicant['Disability Type']}</TableCell>
                <TableCell>{applicant['Date Submitted']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Rejected Applications</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Civil ID</TableHead>
              <TableHead>Disability Description</TableHead>
              <TableHead>Disability Type</TableHead>
              <TableHead>Date Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rejected.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{applicant['Civil ID']}</TableCell>
                <TableCell>{applicant['Disability Description']}</TableCell>
                <TableCell>{applicant['Disability Type']}</TableCell>
                <TableCell>{applicant['Date Submitted']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 