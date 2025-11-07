export async function GET() {
  console.log('TEST API CALLED');
  return Response.json({ message: 'Test API working' });
}
