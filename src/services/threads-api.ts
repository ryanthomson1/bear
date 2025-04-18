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
const THREADS_API_BASE_URL = "https://graph.threads.net/v1.0";

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

export interface ThreadsProfile {
  id: string;
  username: string;
  name: string;
  threads_profile_picture_url: string;
  threads_biography: string;
}

export interface ThreadsRateLimits {
  quota_usage: number;
  config: {
    quota_total: number;
    quota_duration: number;
  };
  reply_quota_usage: number;
  reply_config: {
    quota_total: number;
    quota_duration: number;
  };
}

export interface ThreadsKeywordSearchResult {
  id: string;
  text: string;
  media_type: string;
  permalink: string;
  timestamp: string;
  username: string;
  has_replies: boolean;
  is_quote_post: boolean;
  is_reply: boolean;
}

export async function getThreadsPosts(): Promise<ThreadPost[]> {
  try {
    const queryParams = new URLSearchParams({
      fields: 'id,media_product_type,media_type,media_url,permalink,owner,username,text,timestamp,shortcode,thumbnail_url,children,is_quote_post',
      access_token: THREADS_ACCESS_TOKEN,
    }).toString();

    const response = await fetch(`${THREADS_API_BASE_URL}/me/threads?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${THREADS_ACCESS_TOKEN}`,
      }
    });

    // Example Response
    // {
    //   "data": [
    //     {
    //       "id": "1234567",
    //       "media_product_type": "THREADS",
    //       "media_type": "TEXT_POST",
    //       "permalink": "https://www.threads.net/@threadsapitestuser/post/abcdefg",
    //       "owner": {
    //         "id": "1234567"
    //       },
    //       "username": "threadsapitestuser",
    //       "text": "Today Is Monday",
    //       "timestamp": "2023-10-17T05:42:03+0000",
    //       "shortcode": "abcdefg",
    //       "is_quote_post": false
    //     },
    //   ],
    //   "paging": {
    //     "cursors": {
    //       "before": "BEFORE_CURSOR",
    //       "after": "AFTER_CURSOR"
    //     }
    //   }
    // }

    if (!response.ok) {
      const errorBody = await response.json();
      console.log(errorBody);
      console.error('Error fetching Threads posts:', response.status, errorBody);
      throw new Error(`Failed to fetch Threads posts: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const result = await response.json();
    const posts = result.data.map((post: any) => ({
      content: post.text,
    }));
    return posts;
    //Example Response
    // {
    //   "content": "Today Is Monday"
    // }

  } catch (error: any) {
    console.error("Error retrieving Threads posts:", error);
    throw new Error(`Failed to retrieve Threads posts: ${error.message}`);
  }
}



export async function getThreadsProfile(): Promise<ThreadsProfile> {
  try {
    const queryParams = new URLSearchParams({
      fields: 'id,username,name,threads_profile_picture_url,threads_biography',
      access_token: THREADS_ACCESS_TOKEN,
    }).toString();

    const response = await fetch(`${THREADS_API_BASE_URL}/me?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${THREADS_ACCESS_TOKEN}`,
      }
    });

    // Example Response
    // {
    //   "id": "1234567",
    //   "username": "threadsapitestuser",
    //   "name": "Threads API Test User",
    //   "threads_profile_picture_url": "https://scontent-sjc3-1.cdninstagram.com/link/to/profile/picture/on/threads/",
    //   "threads_biography": "This is my Threads bio."
    // }

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error fetching Threads profile:', response.status, errorBody);
      throw new Error(`Failed to fetch Threads profile: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const profile: ThreadsProfile = await response.json();
    return profile;
  } catch (error: any) {
    console.error("Error retrieving Threads profile:", error);
    throw new Error(`Failed to retrieve Threads profile: ${error.message}`);
  }
}

export async function getThreadsRateLimits(): Promise<ThreadsRateLimits> {
  try {
    // In the documentation it says that the path should be /<THREADS_USER_ID>/threads_publishing_limit, but it also says that you may only fetch the profile of the app-scoped user.
    // So I am assuming that <THREADS_USER_ID> should be `me`, since we are only fetching the profile of the app-scoped user.
    const queryParams = new URLSearchParams({
      fields: 'quota_usage,config,reply_quota_usage,reply_config',
      access_token: THREADS_ACCESS_TOKEN,
    }).toString();

    const response = await fetch(`${THREADS_API_BASE_URL}/me/threads_publishing_limit?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${THREADS_ACCESS_TOKEN}`,
      }
    });

    //Example Response
    // {
    //   "data": [
    //     {
    //       "quota_usage": 4,
    //       "config": {
    //         "quota_total": 250,
    //         "quota_duration": 86400
    //       }
    //     }
    //   ]
    // }

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error fetching Threads rate limits:', response.status, errorBody);
      throw new Error(`Failed to fetch Threads rate limits: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.data[0] as ThreadsRateLimits;
  } catch (error: any) {
    console.error("Error retrieving Threads rate limits:", error);
    throw new Error(`Failed to retrieve Threads rate limits: ${error.message}`);
  }
}

export interface CreateThreadsMediaContainerParams {
  media_type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  image_url?: string;
  video_url?: string;
  text?: string;
  is_carousel_item?: boolean;
}
export type MediaType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL';
export async function createThreadsMediaContainer(params: CreateThreadsMediaContainerParams): Promise<any> {
  try {
    const requestBody = new URLSearchParams();
    if (params.media_type) requestBody.append('media_type', params.media_type);
    if (params.image_url) requestBody.append('image_url', params.image_url);
    if (params.video_url) requestBody.append('video_url', params.video_url);
    if (params.text) requestBody.append('text', params.text);
    if (params.is_carousel_item !== undefined) requestBody.append('is_carousel_item', params.is_carousel_item.toString());

    const response = await fetch(`${THREADS_API_BASE_URL}/me/threads?access_token=${THREADS_ACCESS_TOKEN}`, {
      method: 'POST',
      body: requestBody,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error creating Threads media container:', response.status, errorBody);
      throw new Error(`Failed to create Threads media container: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error creating Threads media container:", error);
    throw new Error(`Failed to create Threads media container: ${error.message}`);
  }
}

export interface PublishThreadsMediaContainerParams {
  creation_id: string;
}

export interface CreateThreadsReplyContainerParams {
  media_type: MediaType;
  text: string;
  reply_to_id: string;
}

export async function createThreadsReplyContainer(params: CreateThreadsReplyContainerParams): Promise<any> {
  try {
    const requestBody = new URLSearchParams();
    requestBody.append('media_type', params.media_type);
    requestBody.append('text', params.text);
    requestBody.append('reply_to_id', params.reply_to_id);

    const response = await fetch(`${THREADS_API_BASE_URL}/me/threads?access_token=${THREADS_ACCESS_TOKEN}`, {
      method: 'POST',
      body: requestBody,
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error creating Threads reply container:', response.status, errorBody);
      throw new Error(`Failed to create Threads reply container: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error creating Threads reply container:", error);
    throw new Error(`Failed to create Threads reply container: ${error.message}`);
  }
}


export async function publishThreadsMediaContainer(params: PublishThreadsMediaContainerParams, isReply: boolean = false): Promise<any> {
  const endpoint = isReply ? `${THREADS_API_BASE_URL}/me/threads_publish` : `${THREADS_API_BASE_URL}/me/threads_publish`;

  try {
    const response = await fetch(`${THREADS_API_BASE_URL}/me/threads_publish?creation_id=${params.creation_id}&access_token=${THREADS_ACCESS_TOKEN}`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('Error publishing Threads media container:', response.status, errorBody);
      throw new Error(`Failed to publish Threads media container: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error publishing Threads media container:", error);
    throw new Error(`Failed to publish Threads media container: ${error.message}`);
  }
}
export type ThreadKeywordSearchType = 'TOP' | 'RECENT' | undefined;

export async function searchThreads(
  q: string,
  search_type?: ThreadKeywordSearchType,
  fields: string = "id,text,media_type,permalink,timestamp,username,has_replies,is_quote_post,is_reply"
): Promise<ThreadsKeywordSearchResult[]> {
  try {
    const queryParams = new URLSearchParams({
      q: q,
      search_type: search_type || 'TOP', // Default to 'TOP' if not provided
      fields: fields,
      access_token: THREADS_ACCESS_TOKEN,
    }).toString();

    const response = await fetch(`${THREADS_API_BASE_URL}/keyword_search?${queryParams}`, {
      method: 'GET', // Changed to GET
      headers: {
        'Authorization': `Bearer ${THREADS_ACCESS_TOKEN}`,
      }
    });

    if (!response.ok) {
      let errorBody;
      try {
        errorBody = await response.json();
        console.log(errorBody);
      } catch (e) {
        console.error("Failed to parse error response:", e);
      }
      console.error('Error searching Threads:', response.status, errorBody);
      throw new Error(`Failed to search Threads: ${response.status} - ${errorBody.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error("Error searching Threads:", error);
    throw new Error(`Failed to search Threads: ${error.message}`);
  }
}
