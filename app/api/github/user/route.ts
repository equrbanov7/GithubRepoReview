export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username) {
    return Response.json({ error: "Username is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }

    const userData = await response.json()
    return Response.json(userData)
  } catch (error) {
    return Response.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
