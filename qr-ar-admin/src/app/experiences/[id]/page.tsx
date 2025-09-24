import { notFound } from "next/navigation";

interface Experience {
  id: string;
  name: string;
  description: string;
  // Add more fields according to your model
}

async function getExperience(id: string): Promise<Experience | null> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5028"
      }/api/experiences/${id}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export default async function ExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  const experience = await getExperience(params.id);
  if (!experience) {
    notFound();
  }
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Experience: {experience.name}</h1>
      <p>
        <strong>ID:</strong> {experience.id}
      </p>
      <p>
        <strong>Description:</strong> {experience.description}
      </p>
      {/* Add more fields here */}
    </main>
  );
}
