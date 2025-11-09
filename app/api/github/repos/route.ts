export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")
  const page = searchParams.get("page") || "1"
  const perPage = searchParams.get("perPage") || "10"

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      },
    )

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch repositories" }, { status: 404 })
    }

    const repos = await response.json()
    return Response.json(repos)
  } catch (error) {
    return Response.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}
