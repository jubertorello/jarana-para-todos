import Landing from "@/components/Landing";
import { getInstagramPosts } from "@/lib/instagram";

export const revalidate = 600;

export default async function Page() {
  const posts = await getInstagramPosts(6);
  return <Landing posts={posts} />;
}
