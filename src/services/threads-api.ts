/**
 * Represents a Threads post.
 */
export interface ThreadPost {
  /**
   * The content of the post.
   */
  content: string;
  /**
   * The URL of the attached image, if any.
   */
  imageUrl?: string;
}

const THREADS_ACCESS_TOKEN = "THAARZAqKoPZCthBYldocm1lMFl0UktkWFM3amZAiNlVKMDlWN0xKRVNDWlNPTTJSR1VPSDJtd2sxaldwa29LWVluWVJzdjB1Sks1OEh0RFNTc3U2aUlQa1FrQW1tOXE4MkE4Q3A0N3JnTDdnakhhanF0UXJ0MGxtbnc2Qy01blNRZAW1QdUE4N1lCUy1DWlFxbW8ZD";
//const THREADS_API_BASE_URL = "https://api.threads.com/v1"; // Replace with the actual base URL
const THREADS_API_BASE_URL = "https://www.threads.net/api/v1";

/**
 * Asynchronously posts a thread to the Threads API.
 *
 * @param post The thread post to be posted.
 * @param accountName The name of the Threads account to post to.
 * @returns A promise that resolves when the post is successfully created.
 */
export async function postThread(post: ThreadPost, accountName: string): Promise<void> {
  try {
    const response = await fetch(`${THREADS_API_BASE_URL}/threads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${THREADS_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...post,
        accountName: accountName,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error posting to Threads:', response.status, errorBody);
      throw new Error(`Failed to post to Threads: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    console.log('Successfully posted to Threads');
  } catch (error: any) {
    console.error("Error posting to Threads:", error);
    throw new Error(`Failed to post to Threads: ${error.message}`);
  }
}

/**
 * Represents the filters to apply when querying Threads posts.
 */
export interface ThreadPostFilters {
  /**
   * The user whose posts to retrieve.
   */
  user?: string;
  /**
   * The topic to filter posts by.
   */
  topic?: string;
}

/**
 * Asynchronously retrieves a list of Threads posts based on the provided filters.
 *
 * @param filters The filters to apply when querying posts.
 * @param pageSize The number of posts to retrieve per page.
 * @param pageToken The token for the page to retrieve.
 * @returns A promise that resolves to an array of ThreadPost objects.
 */
export async function getThreadsPosts(
  filters: ThreadPostFilters,
  pageSize: number,
  pageToken?: string
): Promise<ThreadPost[]> {
  try {
    const queryParams = new URLSearchParams({
      ...filters,
      pageSize: String(pageSize),
      pageToken: pageToken || '',
    }).toString();

    const response = await fetch(`${THREADS_API_BASE_URL}/threads?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${THREADS_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error fetching Threads posts:', response.status, errorBody);
      throw new Error(`Failed to fetch Threads posts: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.posts || []; // Adjust based on actual API response structure
  } catch (error: any) {
    console.error("Error retrieving Threads posts:", error);
    throw new Error(`Failed to retrieve Threads posts: ${error.message}`);
  }
}

