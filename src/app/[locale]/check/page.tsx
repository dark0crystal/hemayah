'use client';

import { useState } from 'react';
import { ExcelUploadForm } from '@/app/components/forms/ExcelUploadForm';
import { SampleVerification } from '@/app/components/verification/SampleVerification';
import { FilteredResults } from '@/app/components/results/FilteredResults';
import * as XLSX from 'xlsx';

interface Applicant {
  id: string;
  name: string;
  nationalId: string;
  disabilityType: string;
}

export default function CheckPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [accepted, setAccepted] = useState<Applicant[]>([]);
  const [rejected, setRejected] = useState<Applicant[]>([]);
  const [step, setStep] = useState<'upload' | 'verify' | 'results'>('upload');

  const handleFileUpload = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as Applicant[];
    
    // Add unique IDs to each applicant
    const applicantsWithIds = jsonData.map((applicant, index) => ({
      ...applicant,
      id: `app-${index}`,
    }));
    
    setApplicants(applicantsWithIds);
    setStep('verify');
  };

  const handleVerificationComplete = (accepted: Applicant[], rejected: Applicant[]) => {
    setAccepted(accepted);
    setRejected(rejected);
    setStep('results');
    
    // Here you would typically send the data to your AI model for training
    // and then use it to filter the remaining applicants
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Social Protection Fund Verification</h1>
      
      {step === 'upload' && (
        <div className="max-w-md mx-auto">
          <ExcelUploadForm onUpload={handleFileUpload} />
        </div>
      )}
      
      {step === 'verify' && (
        <SampleVerification
          data={applicants}
          sampleSize={200}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
      
      {step === 'results' && (
        <FilteredResults accepted={accepted} rejected={rejected} />
      )}
    </div>
  );
}