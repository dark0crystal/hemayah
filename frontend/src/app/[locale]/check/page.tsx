// 'use client';

// import { useState, useEffect } from 'react';
// import { ExcelUploadForm } from '@/app/components/upload/ExcelUploadForm';
// import { SampleVerification } from '@/app/components/verification/SampleVerification';
// import { FilteredResults } from '@/app/components/results/FilteredResults';
// import { useTestDataStore, TestDataPoint } from '@/app/store/testDataStore';
// import { useRouter } from 'next/navigation';
// import * as XLSX from 'xlsx';

// interface Applicant {
//   id: string;
//   'Civil ID': string;
//   'Disability Description': string;
//   'Disability Type': string;
//   'Date Submitted': string;
// }

// export default function CheckPage() {
//   const [applicants, setApplicants] = useState<Applicant[]>([]);
//   const [accepted, setAccepted] = useState<Applicant[]>([]);
//   const [rejected, setRejected] = useState<Applicant[]>([]);
//   const [step, setStep] = useState<'upload' | 'verify' | 'results'>('upload');
//   const { testData } = useTestDataStore();
//   const router = useRouter();

//   // Check if we have test data from the analysis page
//   useEffect(() => {
//     if (testData && testData.length > 0) {
//       // Convert testData to Applicant format (add ID)
//       const testDataAsApplicants = testData.map((item: TestDataPoint, index: number) => ({
//         ...item,
//         id: `test-${index}`,
//       })) as Applicant[];
      
//       setApplicants(testDataAsApplicants);
//       setStep('verify');
//     }
//   }, [testData]);

//   const handleFileUpload = async (file: File) => {
//     const data = await file.arrayBuffer();
//     const workbook = XLSX.read(data);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
//     // Add unique IDs to each applicant
//     const applicantsWithIds = jsonData.map((applicant: any, index: number) => ({
//       ...applicant,
//       id: `app-${index}`,
//     })) as Applicant[];
    
//     setApplicants(applicantsWithIds);
//     setStep('verify');
//   };

//   const handleVerificationComplete = (accepted: Applicant[], rejected: Applicant[]) => {
//     setAccepted(accepted);
//     setRejected(rejected);
//     setStep('results');
    
//     // Here you would typically send the data to your AI model for training
//     // and then use it to filter the remaining applicants
//   };

//   return (
//     <div className="container mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-8">Social Protection Fund Verification</h1>
      
//       {step === 'upload' && (
//         <div className="max-w-md mx-auto">
//           {testData && testData.length > 0 ? (
//             <div className="bg-green-100 p-4 mb-6 rounded-lg border border-green-400">
//               <p className="text-green-800 font-semibold mb-2">✅ Test data loaded from the Analysis page.</p>
//               <p className="text-green-700">{testData.length} applicants are ready for verification.</p>
//             </div>
//           ) : (
//             <ExcelUploadForm onUpload={handleFileUpload} />
//           )}
//         </div>
//       )}
      
//       {step === 'verify' && (
//         <SampleVerification
//           data={applicants}
//           sampleSize={200}
//           onVerificationComplete={handleVerificationComplete}
//         />
//       )}
      
//       {step === 'results' && (
//         <FilteredResults accepted={accepted} rejected={rejected} />
//       )}
//     </div>

    
//   );
// } 



'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Applicant {
  id: string;
  civilId: string;
  disabilityDescription: string;
  disabilityType: string;
  dateSubmitted: string;
  isVerified?: boolean;
}

export default function CheckPage() {
  const [step, setStep] = useState<'verify' | 'results'>('verify');
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [accepted, setAccepted] = useState<Applicant[]>([]);
  const [rejected, setRejected] = useState<Applicant[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<{[key: string]: boolean}>({});
  
  const t = useTranslations('navbar');

  useEffect(() => {
    // Initialize with 20 random cases from the test data
    const randomApplicants = TEST_DATA
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .map(item => ({
        id: Math.random().toString(36).substring(2, 9),
        civilId: item["Civil ID"],
        disabilityDescription: item["Disability Description"],
        disabilityType: item["Disability Type"],
        dateSubmitted: item["Date Submitted"],
      }));
    
    setApplicants(randomApplicants);
  }, []);

  const handleCheckboxChange = (id: string) => {
    setSelectedApplicants(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleVerify = () => {
    const acceptedApplicants = applicants.filter(app => selectedApplicants[app.id]);
    const rejectedApplicants = applicants.filter(app => !selectedApplicants[app.id]);
    
    setAccepted(acceptedApplicants);
    setRejected(rejectedApplicants);
    setStep('results');
  };

  return (
    <div className="container mx-auto py-8">
     
      
      {step === 'verify' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">التحقق من المتقدمين</h2>
          <p className="mb-4">يرجى اختيار المتقدمين الذين تعتقد أن لديهم مطالبات مشروعة:</p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">اختيار</th>
                  <th className="py-2 px-4 border-b text-left">الرقم المدني</th>
                  <th className="py-2 px-4 border-b text-left">وصف الإعاقة</th>
                  <th className="py-2 px-4 border-b text-left">نوع الإعاقة</th>
                  <th className="py-2 px-4 border-b text-left">تاريخ التقديم</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map(applicant => (
                  <tr key={applicant.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      <input 
                        type="checkbox" 
                        checked={!!selectedApplicants[applicant.id]} 
                        onChange={() => handleCheckboxChange(applicant.id)}
                        className="h-5 w-5 text-blue-600"
                      />
                    </td>
                    <td className="py-2 px-4 border-b">{applicant.civilId}</td>
                    <td className="py-2 px-4 border-b">{applicant.disabilityDescription}</td>
                    <td className="py-2 px-4 border-b">{applicant.disabilityType}</td>
                    <td className="py-2 px-4 border-b">{applicant.dateSubmitted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleVerify}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              إكمال التحقق
            </button>
          </div>
        </div>
      )}
      
      {step === 'results' && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">نتائج التحقق</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-green-600 mb-2">الطلبات المقبولة ({accepted.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">الرقم المدني</th>
                    <th className="py-2 px-4 border-b text-left">وصف الإعاقة</th>
                    <th className="py-2 px-4 border-b text-left">نوع الإعاقة</th>
                  </tr>
                </thead>
                <tbody>
                  {accepted.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{app.civilId}</td>
                      <td className="py-2 px-4 border-b">{app.disabilityDescription}</td>
                      <td className="py-2 px-4 border-b">{app.disabilityType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-red-600 mb-2">الطلبات المرفوضة ({rejected.length})</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left">الرقم المدني</th>
                    <th className="py-2 px-4 border-b text-left">وصف الإعاقة</th>
                    <th className="py-2 px-4 border-b text-left">نوع الإعاقة</th>
                  </tr>
                </thead>
                <tbody>
                  {rejected.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{app.civilId}</td>
                      <td className="py-2 px-4 border-b">{app.disabilityDescription}</td>
                      <td className="py-2 px-4 border-b">{app.disabilityType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button 
              onClick={() => setStep('verify')}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              العودة إلى التحقق
            </button>
            
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                const resultsDiv = document.createElement('div');
                resultsDiv.className = 'mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200';
                
                const mainTitle = document.createElement('h2');
                mainTitle.className = 'text-2xl font-bold mb-4 text-center';
                mainTitle.textContent = 'قبل التعديل';
                
                const text1 = document.createElement('div');
                text1.className = 'mb-6';
                text1.innerHTML = `
                  <h3 class="text-xl font-bold mb-3">اللائحة السابقة</h3>
                  <p class="mb-2">تستحق منفعة الأشخاص ذوي الإعاقة لمن لديه بطاقة شخص ذي إعاقة صادرة عن وزارة التنمية الاجتماعية، ولديه إعاقة دائمة، على النحو الآتي:</p>
                  <ol class="list-decimal pr-6 space-y-1">
                    <li>الإعاقة الذهنية.</li>
                    <li>اضطراب طيف التوحد.</li>
                    <li>متلازمة داون.</li>
                    <li>الإعاقة البصرية.</li>
                    <li>الإعاقة السمعية من مستوى شديدة فأعلى.</li>
                    <li>الإعاقات الجسدية، وتشمل الآتي:
                      <ol class="list-[arabic-indic] pr-6 mt-1">
                        <li>الشلل الرباعي والشلل النصفي السفلي والشلل النصفي العلوي وشلل الأطفال والصلب المشقوق.</li>
                        <li>تشوهات تشمل المستوى العلوي للطرف الأيمن أو الأيسر أو المستوى السفلي للطرف الأيمن أو الأيسر.</li>
                        <li>بتر علوي أيمن أو أيسر لمستويات الكتف أو المرفق أو المعصم، وبتر سفلي أيمن أو أيسر لمستويات الفخذ أو الركبة أو الكاحل.</li>
                      </ol>
                    </li>
                    <li>الإعاقة الشديدة بحسب التقييم المبني على أداء الوظائف وفقا للضوابط والإجراءات المعمول بها لدى وزارة التنمية الاجتماعية.</li>
                  </ol>
                `;
                
                const text2 = document.createElement('div');
                text2.className = 'p-4 bg-blue-50 border border-blue-200 rounded-lg';
                text2.innerHTML = `
                  <h3 class="text-lg font-bold mb-2">الأمر المعطى للذكاء الإصطناعي</h3>
                  <p>أنت محلل قانوني متقدم في مجال الذكاء الاصطناعي مكلف بمراجعة وثيقة شاملة تحتوي على قوانين ولوائح تتعلق بصرف المبالغ المالية من قبل هيئة تنظيمية. أهدافك هي:</p>
                  <ol class="list-decimal pr-6 mt-2 space-y-1">
                    <li><strong>تحديد الثغرات:</strong> تحليل القوانين واللوائح للعثور على ثغرات أو غموض محتمل يمكن استغلاله. التركيز على اللغة الغامضة والاستثناءات والشروط التي تسمح بصرف الأموال غير المصرح به.</li>
                    <li><strong>اقتراح التعديلات:</strong> اقتراح تعديلات واضحة ودقيقة لإغلاق الثغرات المحددة. تأكد من أن هذه التعديلات تهدف إلى منع الاستغلال أو الاحتيال.</li>
                    <li><strong>صياغة قانون جديد:</strong> إنشاء قانون جديد شامل يتضمن الأقسام المعدلة ويقدم ضمانات إضافية ضد الاحتيال. يجب أن يضمن هذا القانون حصول الأفراد المستحقين فقط على المدفوعات المالية.</li>
                    <li><strong>الوضوح والدقة:</strong> استخدم لغة قانونية واضحة في جميع أنحاء تحليلك وتعديلاتك والقانون الجديد. هيكلة كل نقطة لسهولة الفهم لإزالة الغموض.</li>
                    <li><strong>الوعي السياقي:</strong> مواءمة تعديلاتك و قانون جديد يهدف إلى تنظيم القوانين الأصلية، وتعزيز العدالة ومنع الاحتيال.</li>
                  </ol>
                  <p class="mt-2">استخدم ما سبق لإنشاء لوائح تنظيمية جديدة لا تتعارض مع السابقة و تكون مفصولة ولا تستخدم الملف.</p>
                `;
                
                const afterEdit = document.createElement('div');
                afterEdit.className = 'mt-6';
                afterEdit.innerHTML = `
                  <h3 class="text-xl font-bold mb-3">بعد التعديل</h3>
                  <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 class="text-lg font-bold mb-3">قانون استحقاق ومراقبة منافع الأشخاص ذوي الإعاقة</h4>
                    <div class="mb-4">
                      <h5 class="font-bold mb-2">الفصل الأول: الغرض والتعاريف</h5>
                      <p class="font-bold mb-1">المادة ١ – الغرض</p>
                      <p class="mb-3">يهدف هذا القانون إلى تنظيم استحقاق وصرف منافع الإعاقة بطريقة عادلة وشفافة، وضمان أن تصل المساعدات فقط إلى الأفراد المستحقين.</p>
                      
                      <p class="font-bold mb-1">المادة ٢ – التعاريف</p>
                      <ul class="list-disc pr-6 mb-3">
                        <li>الإعاقة الدائمة: حالة طويلة الأجل تستوفي المعايير الطبية والوظيفية المحددة في اللوائح التنفيذية، ويثبتها تقرير طبي صادر من جهة معتمدة.</li>
                        <li>الإعاقة الوظيفية الشديدة: حالة يتم تقييمها باستخدام نظام نقاط موحد ومعتمد من الوزارة، يقيس الوظائف الحيوية الرئيسية.</li>
                      </ul>
                    </div>
                    
                    <div class="mb-4">
                      <h5 class="font-bold mb-2">الفصل الثاني: شروط الاستحقاق</h5>
                      <p class="font-bold mb-1">المادة ٣ – الشروط الأساسية للاستحقاق</p>
                      <p class="mb-2">يستحق الشخص المنفعة إذا:</p>
                      <ol class="list-decimal pr-6 mb-3">
                        <li>كان حاملاً لبطاقة شخص ذي إعاقة صادرة عن الوزارة.</li>
                        <li>ثبتت إصابته بإعاقة دائمة مؤهلة بموجب تقرير طبي معتمد.</li>
                        <li>يخضع لإعادة تقييم كل ثلاث سنوات على الأقل أو عند الحاجة.</li>
                      </ol>
                      
                      <p class="font-bold mb-1">المادة ٤ – الفئات المؤهلة</p>
                      <p class="mb-2">تنطبق المنافع على الأفراد الذين يعانون من:</p>
                      <ul class="list-disc pr-6 mb-3">
                        <li>الإعاقة الذهنية</li>
                        <li>اضطراب طيف التوحد</li>
                        <li>متلازمة داون</li>
                        <li>الإعاقة البصرية والإعاقة السمعية الشديدة أو أكثر</li>
                        <li>الإعاقات الجسدية الشديدة كما هو موضح في اللوائح التنفيذية</li>
                        <li>الإعاقات الشديدة المبنية على التقييم الوظيفي المعياري</li>
                      </ul>
                    </div>
                    
                    <div class="mb-4">
                      <h5 class="font-bold mb-2">الفصل الثالث: الرقابة والمساءلة</h5>
                      <p class="font-bold mb-1">المادة ٥ – التحقق وإعادة التقييم</p>
                      <p class="mb-2">يجب على جميع المستفيدين:</p>
                      <ul class="list-disc pr-6 mb-3">
                        <li>تقديم مستندات طبية محدثة عند كل دورة إعادة تقييم.</li>
                        <li>التعاون الكامل مع تقييمات الوزارة عند الطلب.</li>
                      </ul>
                      
                      <p class="font-bold mb-1">المادة ٦ – مكافحة التزوير والعقوبات</p>
                      <ol class="list-decimal pr-6 mb-3">
                        <li>كل من يقدم معلومات كاذبة أو مضللة للحصول على المنفعة:
                          <ul class="list-disc pr-6 mt-1">
                            <li>تُسحب منه المنفعة فوراً.</li>
                            <li>يُغرّم بما لا يقل عن ٥٠٠ ريال عماني.</li>
                            <li>يُحرم من التقديم لمدة خمس سنوات.</li>
                          </ul>
                        </li>
                        <li>تقوم الوزارة بإجراء تدقيقات وتحقيقات عشوائية للتحقق من صحة البيانات.</li>
                      </ol>
                      
                      <p class="font-bold mb-1">المادة ٧ – الشفافية</p>
                      <p>تنشر الوزارة جميع معايير وإجراءات التقييم في اللوائح التنفيذية، وتكون متاحة للعامة.</p>
                    </div>
                  </div>
                `;
                
                resultsDiv.appendChild(mainTitle);
                resultsDiv.appendChild(text1);
                resultsDiv.appendChild(text2);
                resultsDiv.appendChild(afterEdit);
                
                document.querySelector('.container')?.appendChild(resultsDiv);
              }}
            >
              تأكيد النتائج
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
const TEST_DATA = [
  {
    "Civil ID": "20000001",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000002",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000003",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000004",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000005",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000006",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000007",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000008",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000009",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000010",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000011",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000012",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000013",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000014",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000015",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000016",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000017",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000018",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000019",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000020",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000021",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000022",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000023",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000024",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000025",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000026",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000027",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000028",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000029",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000030",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000031",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000032",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000033",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000034",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000035",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000036",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000037",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000038",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000039",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000040",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000041",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000042",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000043",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000044",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000045",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000046",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000047",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000048",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000049",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000050",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000051",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000052",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000053",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000054",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000055",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000056",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000057",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000058",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000059",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000060",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000061",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000062",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000063",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000064",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000065",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000066",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000067",
    "Disability Description": "Paralysis",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000068",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000069",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000070",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000071",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000072",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000073",
    "Disability Description": "Total blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000074",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000075",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000076",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000077",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000078",
    "Disability Description": "Schizophrenia",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000079",
    "Disability Description": "Color blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000080",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000081",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000082",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000083",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000084",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000085",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000086",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000087",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000088",
    "Disability Description": "Limb loss",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000089",
    "Disability Description": "Mild hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000090",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000091",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000092",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000093",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000094",
    "Disability Description": "Depression",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000095",
    "Disability Description": "Complete hearing loss",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000096",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000097",
    "Disability Description": "Amputation below knee",
    "Disability Type": "Physical",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000098",
    "Disability Description": "Partial blindness",
    "Disability Type": "Visual",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000099",
    "Disability Description": "Autism",
    "Disability Type": "Mental",
    "Date Submitted": "2025-03-15"
  },
  {
    "Civil ID": "20000100",
    "Disability Description": "Deaf in one ear",
    "Disability Type": "Hearing",
    "Date Submitted": "2025-03-15"
  }
]
