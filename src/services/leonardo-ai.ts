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
export async function generateImage(params: ImageGenerationParams): Promise<GeneratedImage> {
  try {
    const payload = {
      "height": params.height,
      "modelId": "b2614463-296c-462a-9586-aafdb8f00e36",
      "num_images": 1,
      "presetStyle": "DYNAMIC",
      "prompt": params.prompt.substring(0, 1000), // Truncate prompt to 1000 characters
      "width": params.width,
      "contrast": 4,
      "guidance_scale": 7,
      "negative_prompt": "skinny, gym built, athlete, fat, obese, white facial hair, old man, real bear",
      "num_inference_steps": 20,
      "public": false,
      "scheduler": "LEONARDO",
      "userElements": [
        {
          "weight": 0.4,
          "userLoraId": 54879
        }
      ]
    };

    const response = await fetch(LEONARDO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LEONARDO_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Leonardo AI API Error:", response.status, response.statusText, await response.text());
      throw new Error(`Leonardo AI API failed with status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Modified condition to handle potential undefined/null data and missing image_ids
    if (!data?.generations_by_id?.image_ids?.length) {
      console.error("Leonardo AI API Response:", data); // Log the entire response
      throw new Error("No image IDs returned from Leonardo AI API. Check the console for the full API response.");
    }

    // Assuming the first image ID is the one we want
    const imageId = data.generations_by_id.image_ids[0];
    const imageUrl = `https://cdn.leonardo.ai/users/${GCP_PROJECT_ID}/generations/${imageId}/0.png`; // Construct the image URL

    return {
      imageUrl: imageUrl,
    };
  } catch (error: any) {
    console.error("Error generating image with Leonardo AI:", error);
    throw new Error(`Failed to generate image: ${error.message}`);
  }
}
