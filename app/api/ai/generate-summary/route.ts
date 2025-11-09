import { generateText } from "ai"

export async function POST(req: Request) {
  const { repoName, repoDescription, topics } = await req.json()

  if (!repoName) {
    return Response.json({ error: "Repository name is required" }, { status: 400 })
  }

  try {
    const prompt = `Generate a concise 2-3 sentence technical summary of a GitHub repository with the following details:
Repository Name: ${repoName}
Description: ${repoDescription || "No description provided"}
Topics: ${topics?.join(", ") || "No topics"}

Provide a clear, professional summary that explains what this repository does and its primary purpose. Be technical but accessible.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      maxOutputTokens: 300,
      temperature: 0.7,
    })

    return Response.json({ summary: text })
  } catch (error) {
    console.error("Error generating summary:", error)
    return Response.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
