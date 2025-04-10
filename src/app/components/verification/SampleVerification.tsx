import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

interface Applicant {
  id: string;
  name: string;
  nationalId: string;
  disabilityType: string;
  // Add other relevant fields
}

interface SampleVerificationProps {
  data: Applicant[];
  sampleSize: number;
  onVerificationComplete: (accepted: Applicant[], rejected: Applicant[]) => void;
}

export function SampleVerification({
  data,
  sampleSize,
  onVerificationComplete,
}: SampleVerificationProps) {
  const [selectedSample, setSelectedSample] = useState<Applicant[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<Record<string, boolean>>({});

  const selectRandomSample = () => {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setSelectedSample(shuffled.slice(0, sampleSize));
  };

  const handleVerificationChange = (id: string, checked: boolean) => {
    setVerificationStatus((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleCompleteVerification = () => {
    const accepted = selectedSample.filter((applicant) => verificationStatus[applicant.id]);
    const rejected = selectedSample.filter((applicant) => !verificationStatus[applicant.id]);
    onVerificationComplete(accepted, rejected);
  };

  return (
    <div className="space-y-4">
      <Button onClick={selectRandomSample}>Select Random Sample</Button>
      
      {selectedSample.length > 0 && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>National ID</TableHead>
                <TableHead>Disability Type</TableHead>
                <TableHead>Accept</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedSample.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell>{applicant.name}</TableCell>
                  <TableCell>{applicant.nationalId}</TableCell>
                  <TableCell>{applicant.disabilityType}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={verificationStatus[applicant.id] || false}
                      onCheckedChange={(checked) =>
                        handleVerificationChange(applicant.id, checked as boolean)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Button onClick={handleCompleteVerification}>Complete Verification</Button>
        </>
      )}
    </div>
  );
} 