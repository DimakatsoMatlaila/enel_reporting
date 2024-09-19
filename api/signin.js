import { neon } from '@neondatabase/serverless';
//import { VercelRequest, VercelResponse } from '@vercel/node';

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

    // Parse the request body
    const { id, password } = request.body;

    // Check if both id and password are provided
    if (!id || !password) {

      return response.status(400).json({ error: 'Missing id or password' });
    }

    // Determine user type based on id prefix
    let result;
    if (id.startsWith('S')) {
      // Login as Supervisor
      result = await sql`
        SELECT s.id, 
               s.employee_id, 
               s.project_id, 
               s.password, 
               s.profile_pic_url, 
               e.contractor_id, 
               e.first_name,
               e.last_name,
               p.name AS project_name,
               p.town AS project_town
        FROM supervisor s
        JOIN employee e ON s.employee_id = e.id
        JOIN projects p ON s.project_id = p.id
        WHERE s.id = ${id};
      `;
    } else if (id.startsWith('A')) {
      // Login as Admin
      result = await sql`
        SELECT * FROM admin
        WHERE id = ${id}
      `;
    } else {
      return response.status(400).json({ error: 'Invalid id format' });
    }

    // Check if the user was found
    if (result.length === 0) {
      return response.status(404).json({ error: 'User not found' });
    }

    // Verify the password (assuming passwords are stored securely and hashed)
    const user = result[0];
    if (user.password !== password) { // Replace this with a proper hash comparison in production
      return response.status(401).json({ error: 'Invalid password' });
    }

    // If authentication is successful
    return response.status(200).json({ message: 'Sign-in successful', user });

  } catch (error) {
    console.error('Error handling request:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
