import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Applicant {
  id: string;
  name: string;
  nationalId: string;
  disabilityType: string;
  // Add other relevant fields
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
              <TableHead>Name</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead>Disability Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accepted.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{applicant.name}</TableCell>
                <TableCell>{applicant.nationalId}</TableCell>
                <TableCell>{applicant.disabilityType}</TableCell>
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
              <TableHead>Name</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead>Disability Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rejected.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>{applicant.name}</TableCell>
                <TableCell>{applicant.nationalId}</TableCell>
                <TableCell>{applicant.disabilityType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 