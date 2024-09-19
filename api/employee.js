import { neon } from '@neondatabase/serverless';

// Initialize the Neon client
//@ts-ignore
const sql = neon(process.env.VITE_DB_URL);

export default async function handler(request, response) {
  try {
    // Add CORS headers
    response.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return response.status(204).end(); // Respond with no content
    }

    if (request.method === 'GET') {
      // Fetch all employees from the database
      const result = await sql`
        SELECT id, first_name AS "firstName", last_name AS "lastName", id_no AS "idNo"
        FROM employee;
      `;

      return response.status(200).json(result);
    } else {
      return response.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
