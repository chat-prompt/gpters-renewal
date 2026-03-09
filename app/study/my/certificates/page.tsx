import { CertificateView } from "@/components/lms/certificate-view";

// -- Mock Data --

const certificates = [
  {
    studentName: "김지피",
    studyTitle: "프롬프트 엔지니어링",
    generation: 20,
    completedAt: "2026년 3월 15일",
    isOutstanding: true,
    attendanceCount: 4,
    assignmentCount: 4,
  },
  {
    studentName: "김지피",
    studyTitle: "AI 활용 기초",
    generation: 19,
    completedAt: "2026년 2월 12일",
    isOutstanding: false,
    attendanceCount: 3,
    assignmentCount: 4,
  },
  {
    studentName: "김지피",
    studyTitle: "바이브코딩 입문",
    generation: 17,
    completedAt: "2025년 12월 13일",
    isOutstanding: false,
    attendanceCount: 4,
    assignmentCount: 3,
  },
];

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">수료증</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert) => (
          <CertificateView
            key={`${cert.generation}-${cert.studyTitle}`}
            {...cert}
          />
        ))}
      </div>
    </div>
  );
}
