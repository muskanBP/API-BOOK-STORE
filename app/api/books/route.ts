import { NextResponse } from 'next/server';

interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
    description?: string;
  };
}

export async function GET() {
  try {
    const apiUrl = 'https://www.googleapis.com/books/v1/volumes?q=search+terms';
    console.log(`Fetching books from: ${apiUrl}`);

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`Failed to fetch books. Status: ${res.status}`);

    const data = await res.json();
    const formattedBooks = data.items.map((item: GoogleBook) => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
      image: item.volumeInfo.imageLinks?.thumbnail || '',
      summary: item.volumeInfo.description || 'No description available',
      orderStatus: 'For Sale',
    }));

    return NextResponse.json(formattedBooks);
  } catch (err: unknown) {
    console.error('Error fetching books:', err);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
