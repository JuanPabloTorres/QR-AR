// src/app/ar/[id]/page.tsx
import ArClient from "@/components/ar/ArClient";

type Props = { params: Promise<{ id: string }> };

export default async function ArPage({ params }: Props) {
  const { id } = await params;
  return <ArClient id={id} />;
}
