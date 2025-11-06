import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Search, TrendingUp } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { useEffect, useState } from 'react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);

  useEffect(() => {
    // Fetch featured books from Google Books API
    const fetchFeaturedBooks = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=bestseller&maxResults=8&key=AIzaSyDi3EgmR43FsXfEmM2AJGu-5f0I71HYE4s`
        );
        const data = await response.json();
        const books = data.items?.map((item: any) => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.[0] || 'Unknown',
          coverUrl: item.volumeInfo.imageLinks?.thumbnail,
          description: item.volumeInfo.description,
        })) || [];
        setFeaturedBooks(books);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchFeaturedBooks();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">
                {user?.email?.split('@')[0]}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover your next favorite book with AI-powered recommendations tailored just for you
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/recommendations')}
                className="group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Get AI Recommendations
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/explore')}
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Books
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="bg-gradient-hero w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations based on your mood and preferences
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="bg-gradient-hero w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Vast Library</h3>
              <p className="text-sm text-muted-foreground">
                Access millions of books from Google Books library
              </p>
            </div>
            <div className="text-center p-6 rounded-xl bg-card border border-border">
              <div className="bg-gradient-hero w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Smart Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Save and track your favorite books in one place
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending Books</h2>
            <Button variant="ghost" onClick={() => navigate('/explore')}>
              View all
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
