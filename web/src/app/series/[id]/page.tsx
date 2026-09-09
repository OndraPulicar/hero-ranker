export default async function Series({ params }: { params: { id: string } }) {
  const { id } = await params;
  
  return (
    <div>
      <h1>Series {id}</h1>
    </div>
  );
}