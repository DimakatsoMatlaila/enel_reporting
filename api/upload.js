import { neon } from '@neondatabase/serverless';
import { handleUpload } from '@vercel/blob/client';

const sql = neon(process.env.VITE_DB_URL);

export async function POST(request) {
  const body = (await request.json());
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        /* clientPayload */
      ) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.
 
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'pdf'], // optional, default is all types
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            // you could pass a user id from auth, or a value from clientPayload
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow
 
        console.log('blob upload completed', blob, tokenPayload);
 
        try {
          // Run any logic after the file upload completed
          

        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });
 
    return Response.json(jsonResponse);
  } catch (error) {
    return Response.error();
  }
}