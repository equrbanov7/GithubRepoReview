const GPT_MODEL = "gpt-4o-mini"

export async function POST(req: Request) {
  const apiKey = process.env.GPT_API_KEY

  if (!apiKey) {
    return Response.json({ error: "Missing GPT API key" }, { status: 500 })
  }

  const { username, name, bio, location, followers, following, publicRepos } = await req.json()

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 })
  }

  const prompt = `Create a concise 2-3 sentence summary of the following GitHub user. Highlight their focus areas, strengths, and any notable insights from the data provided.

Username: ${username}
Name: ${name || "Not provided"}
Bio: ${bio || "Not provided"}
Location: ${location || "Not provided"}
Followers: ${followers}
Following: ${following}
Public Repositories: ${publicRepos}

Keep the tone professional and informative.`

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GPT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes GitHub profiles for recruiters and engineering managers.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 320,
      }),
    })

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text())
      return Response.json({ error: "Failed to generate summary" }, { status: response.status })
    }

    const completion = await response.json()
    const summary = completion?.choices?.[0]?.message?.content?.trim()

    if (!summary) {
      return Response.json({ error: "Summary unavailable" }, { status: 502 })
    }

    return Response.json({ summary })
  } catch (error) {
    console.error("Error generating user summary:", error)
    return Response.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}
