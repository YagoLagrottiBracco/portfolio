import { resourceFeedResponse } from "@/lib/resource-feed-handler"
export function GET(request: Request) {
  return resourceFeedResponse(request, "pt")
}
