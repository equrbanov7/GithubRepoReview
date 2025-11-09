"use client"

import { useState } from "react"
import { ChevronDown, MapPin, LinkIcon, Users, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UserDetailsProps {
  user: {
    login: string
    name: string
    avatar_url: string
    bio: string
    location: string
    blog: string
    followers: number
    following: number
    public_repos: number
  }
}

export function UserDetails({ user }: UserDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="animate-fade-in-up">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="outline"
        className="w-full mb-4 flex items-center justify-between bg-card hover:bg-primary/5 border-primary/20 transition-all duration-300"
      >
        <span className="text-foreground font-semibold">User Details</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
      </Button>

      {isExpanded && (
        <div className="rounded-lg border border-primary/20 bg-card p-6 mb-6 space-y-4 animate-slide-in-down">
          <div className="flex gap-4 items-start">
            <img
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.login}
              className="w-20 h-20 rounded-full ring-2 ring-primary/30 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground break-words">{user.name || user.login}</h3>
              <p className="text-sm text-muted-foreground">@{user.login}</p>
              {user.bio && <p className="text-sm text-foreground mt-2 line-clamp-2">{user.bio}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <GitBranch className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-muted-foreground font-semibold">Repos</p>
              </div>
              <p className="text-2xl font-bold text-primary">{user.public_repos}</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs text-muted-foreground font-semibold">Followers</p>
              </div>
              <p className="text-2xl font-bold text-primary">{user.followers}</p>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3.5 h-3.5 text-accent" />
                <p className="text-xs text-muted-foreground font-semibold">Following</p>
              </div>
              <p className="text-2xl font-bold text-accent">{user.following}</p>
            </div>
            <div className="bg-secondary/5 rounded-lg p-3 border border-secondary/10 hover:border-secondary/30 transition-colors">
              <p className="text-xs text-muted-foreground font-semibold mb-1">Total Size</p>
              <p className="text-2xl font-bold text-secondary">{user.public_repos}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 border-t border-primary/10 pt-4">
            {user.location && (
              <div className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>{user.location}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href={user.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {user.blog}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
