import DestinationContent from "./destination-content";
import { DESTINATIONS_DATA } from "@/lib/destinations-data";

export function generateStaticParams() {
  return DESTINATIONS_DATA.map((dest) => ({ slug: dest.slug }));
}

export default async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DestinationContent slug={slug} />;
}
