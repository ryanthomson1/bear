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
      let errorBody: any;
      try {
        errorBody = await response.text();
        try {
          errorBody = JSON.parse(errorBody);
        } catch (jsonError) {
          console.error("Failed to parse JSON error response:", jsonError);
        }
      } catch (e) {
        console.error("Failed to parse error response:", e);
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

