import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import BookCard from '@/components/BookCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const categories = ['Fiction', 'Mystery', 'Romance', 'Self-Help', 'Technology', 'Science'];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Fiction');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=12&key=AIzaSyDi3EgmR43FsXfEmM2AJGu-5f0I71HYE4s`
      );
      const data = await response.json();
      const fetchedBooks = data.items?.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors?.[0] || 'Unknown',
        coverUrl: item.volumeInfo.imageLinks?.thumbnail,
        description: item.volumeInfo.description,
      })) || [];
      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(selectedCategory);
  }, [selectedCategory]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchBooks(searchQuery);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Books</h1>
        <p className="text-muted-foreground mb-8">
          Browse millions of books by category or search for specific titles
        </p>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <LoadingSpinner message="Finding amazing books..." />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
          {books.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found. Try a different search or category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Explore;
