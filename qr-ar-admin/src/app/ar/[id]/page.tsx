// src/app/ar/[id]/page.tsx
import ArClient from "./ArClient";

type Props = { params: Promise<{ id: string }> };

export default async function ArPage({ params }: Props) {
  const { id } = await params;
  return <ArClient id={id} />;
}
