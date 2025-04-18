/**
 * Represents the parameters for generating an image using Leonardo AI.
 */
export interface ImageGenerationParams {
  /**
   * The prompt to guide the image generation.
   */
  prompt: string;
  /**
   * The width of the generated image.
   */
  width: number;
  /**
   * The height of the generated image.
   */
  height: number;
}

/**
 * Represents a generated image.
 */
export interface GeneratedImage {
  /**
   * The URL of the generated image.
   */
  imageUrl: string;
}

interface LeonardoAIJobResponse {
  sdGenerationJob: {
    generationId: string;
  };
}

interface LeonardoAIGenerationResponse {  
    generations_by_pk: {
      status: string;
      generated_images: {
        url: string;
      }[];
    }
}

const MAX_RETRIES = 3;

async function getGenerationDetails(generationId: string, logApiCall: any, retryCount: number = 0): Promise<string[]> {
  const url = `${LEONARDO_API_URL}/${generationId}`;

  logApiCall(`Calling Leonardo AI API - Get Generation Details (Attempt ${retryCount + 1})`, url, null, null, 200);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEONARDO_API_KEY}`
      },
    });

    const responseBody = await response.text();

    logApiCall(`Leonardo AI API Response - Get Generation Details (Attempt ${retryCount + 1})`, url, null, responseBody, response.status);

    if (!response.ok) {
      console.error("Leonardo AI API Error (Get Details):", response.status, response.statusText, responseBody);
      // Implement exponential backoff
      if (response.status === 429 && retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential delay: 2^retry * 1 second
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return getGenerationDetails(generationId, logApiCall, retryCount + 1); // Recursive call
      }
      throw new Error(`Leonardo AI API failed with status ${response.status}: ${response.statusText}`);
    }

    let data: LeonardoAIGenerationResponse;
    try {
        data = JSON.parse(responseBody) as LeonardoAIGenerationResponse;
    } catch (e) {
        console.error("Failed to parse generation details:", e, responseBody);
        throw new Error("Failed to parse generation details from Leonardo AI API");
    }

    const startTime = Date.now();
    const timeout = 15000; // 15 seconds

    while (data?.generations_by_pk?.status !== "COMPLETE") {
      if (Date.now() - startTime > timeout) {
        throw new Error("Timeout waiting for image generation to complete.");
      }

      // Wait for 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LEONARDO_API_KEY}`
          },
        });
        data = JSON.parse(await response.text()) as LeonardoAIGenerationResponse;
    }

    return data?.generations_by_pk?.generated_images?.map(image => image.url) || [];
  } catch (error: any) {
    console.error("Error in getGenerationDetails:", error);
    throw error;
  }
}

const LEONARDO_API_KEY = "ee5541c6-fd97-4423-b92a-3beae4d9c6ea";
const GCP_PROJECT_ID = "projectbear-455103";
const GCP_BUCKET_NAME = "bearpics";
const LEONARDO_API_URL = "https://cloud.leonardo.ai/api/rest/v1/generations";

/**
 * Asynchronously generates an image using Leonardo AI based on the provided parameters.
 *
 * @param params The parameters for image generation.
 * @returns A promise that resolves to a GeneratedImage object containing the URL of the generated image.
 */
export async function generateImage(params: ImageGenerationParams, logApiCall: any, retryCount: number = 0): Promise<GeneratedImage | null> {
  try {
    const payload = {
      "height": params.height,
      "modelId": "b2614463-296c-462a-9586-aafdb8f00e36",
      "num_images": 1,
      "presetStyle": "DYNAMIC",
      "prompt": params.prompt.substring(0, Math.min(1000, params.prompt.length)), // Truncate prompt to 1000 characters
      "width": params.width,
      "contrast": 4,
      "guidance_scale": 8,
      "negative_prompt": "skinny, gym built, athlete, fat, obese, white facial hair, old man, real bear, nsfw, nudity, suggestive, inappropriate",
      "num_inference_steps": 20,
      "public": false,
      "scheduler": "LEONARDO",
    };

    logApiCall(`Calling Leonardo AI API (Attempt ${retryCount + 1})`,
        LEONARDO_API_URL,
        payload,
        null,
        200
      );

    const response = await fetch(LEONARDO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEONARDO_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const responseBody = await response.text();

    logApiCall(`Leonardo AI API Response (Attempt ${retryCount + 1})`, LEONARDO_API_URL, payload, responseBody, response.status);

    if (!response.ok) {
       // Implement exponential backoff
       if (response.status === 429 && retryCount < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential delay: 2^retry * 1 second
        console.log(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return generateImage(params, logApiCall, retryCount + 1); // Recursive call
      }
      throw new Error(`Leonardo AI API failed: ${response.status} - ${responseBody}`);
    }

    const data: LeonardoAIJobResponse = JSON.parse(responseBody);
    const generationId = data?.sdGenerationJob?.generationId;

    if (!generationId) {
      throw new Error("No generation ID found in the response");
    }

    const imageIds = await getGenerationDetails(generationId, logApiCall);

    if (!imageIds || imageIds.length === 0) {
      throw new Error("No image URLs received from Leonardo API");
    }

    // Assuming we only requested one image, we'll use the first URL.
    const imageUrl = imageIds[0];

     // TODO: Implement Google Cloud Storage authorization here.
    // In a production environment, you would use the GCP credentials
    // to authorize access to the storage bucket and generate a signed URL.
    // For example:
    // const { Storage } = require('@google-cloud/storage');
    // const storage = new Storage({ projectId: GCP_PROJECT_ID });
    // const bucket = storage.bucket(GCP_BUCKET_NAME);
    // const file = bucket.file(`${imageId}/0.png`);
    // const [signedUrl] = await file.getSignedUrl({
    //   action: 'read',
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    // });
    // Use signedUrl as the imageUrl.
    return {
      imageUrl: imageUrl,
    };
  } catch (error: any) {
    console.error("Error generating image with Leonardo AI:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }  
}
