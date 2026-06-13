import PerfumeDetailClient from "./perfumeDetailClient";

interface PerfumeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PerfumeDetailPage({
  params,
}: PerfumeDetailPageProps) {
  const { id } = await params;

  return <PerfumeDetailClient id={id} />;
}
