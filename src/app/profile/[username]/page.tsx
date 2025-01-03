import {
  getProfileByUsername,
  getUserLikedPosts,
  getUserPosts,
  isFollowing,
} from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

// Define PageProps to handle params as a Promise
export interface PageProps {
  params: Promise<{ username: string }>; // Expecting params to be a Promise
}

// Generate metadata for the profile page
export async function generateMetadata({ params }: PageProps) {
  // Resolve params before using it
  const { username } = await params; // Extract username from the params object
  const user = await getProfileByUsername(username); // Pass only username (string) to the function

  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
}

// Server-side rendering for the profile page
async function ProfilePageServer({ params }: PageProps) {
  const { username } = await params; // Extract username from the params object
  const user = await getProfileByUsername(username); // Pass only username (string) to the function

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;