'use server';

export type ThreadKeywordSearchType = 'TOP' | 'RECENT' | undefined;

const THREADS_API_BASE_URL = 'https://www.threads.net/api/v1';

export interface ThreadsKeywordSearchResult {
  id: string;
  text: string;
  media_type: string;
  permalink: string;
  timestamp: number;
  username: string;
  has_replies: boolean;
  is_quote_post: boolean;
  is_reply: boolean;
}

export async function searchThreads(
  q: string,
  search_type?: ThreadKeywordSearchType,
  fields: string = "id,text,media_type,permalink,timestamp,username,has_replies,is_quote_post,is_reply"
): Promise<ThreadsKeywordSearchResult[]> {
  try {
    if (!process.env.THREADS_ACCESS_TOKEN) {
      throw new Error("THREADS_ACCESS_TOKEN is not defined.");
    }

    const queryParams = new URLSearchParams({
      q: q,
      search_type: search_type || 'TOP', // Default to 'TOP' if not provided
      fields: fields,
      access_token: process.env.THREADS_ACCESS_TOKEN,
    }).toString();

    const response = await fetch(`${THREADS_API_BASE_URL}/keyword_search?${queryParams}`, {
      method: 'GET', // Changed to GET
      headers: {
        'Authorization': `Bearer ${process.env.THREADS_ACCESS_TOKEN}`,
      }
    });

    if (!response.ok) {
      let errorBody: any;
      try {
        const errorText = await response.text();
        try {
          errorBody = JSON.parse(errorText);
        } catch (jsonError) {
          console.error("Failed to parse JSON error response:", jsonError, errorText);
          errorBody = { message: errorText };
        }
      } catch (e) {
        console.error("Failed to read or parse error response:", e);
        errorBody = {}; // Assign an empty object in case parsing fails
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
