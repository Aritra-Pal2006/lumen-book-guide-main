import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BookCard from '@/components/BookCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Recommendations = () => {
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [author, setAuthor] = useState('');
  const [additionalPrefs, setAdditionalPrefs] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getRecommendations = async () => {
    if (!mood && !genre && !author) {
      toast({
        title: "Missing information",
        description: "Please provide at least one preference",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Build the prompt for Gemini API
      const prompt = `Suggest 6 book recommendations based on:
        ${mood ? `Mood: ${mood}` : ''}
        ${genre ? `Genre: ${genre}` : ''}
        ${author ? `Similar to author: ${author}` : ''}
        ${additionalPrefs ? `Additional preferences: ${additionalPrefs}` : ''}
        
        Return only the book titles and authors in this exact format:
        1. "Book Title" by Author Name
        2. "Book Title" by Author Name
        (continue for all 6)`;

      // Call Gemini API
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=AIzaSyDDET3zMEFBrc-8UZAv5KvcfE_mQsHm03M`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        throw new Error(`Gemini API error: ${geminiResponse.status} - ${errorText}`);
      }

      const geminiData = await geminiResponse.json();
      console.log('Gemini API response:', geminiData); // Debug log
      
      const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('AI Response text:', aiResponse); // Debug log

      // Parse the AI response to extract book titles
      const bookMatches = aiResponse.match(/"([^"]+)"\s+by\s+([^"\n]+)/g) || [];
      console.log('Book matches:', bookMatches); // Debug log
      
      const bookPromises = bookMatches.slice(0, 6).map(async (match) => {
        const [, title, author] = match.match(/"([^"]+)"\s+by\s+([^"\n]+)/) || [];
        console.log(`Searching for: ${title} by ${author}`); // Debug log
        
        // Fetch book details from Google Books
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title + ' ' + author)}&maxResults=1&key=AIzaSyDi3EgmR43FsXfEmM2AJGu-5f0I71HYE4s`
        );
        
        if (!response.ok) {
          console.error('Google Books API error:', await response.text());
          return null;
        }
        
        const data = await response.json();
        console.log('Google Books API response:', data); // Debug log
        const item = data.items?.[0];
        
        return item ? {
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors?.[0] || author,
          coverUrl: item.volumeInfo.imageLinks?.thumbnail,
          description: item.volumeInfo.description,
        } : null;
      });

      const books = (await Promise.all(bookPromises)).filter(Boolean);
      console.log('Final books array:', books); // Debug log
      setRecommendations(books);

      if (books.length === 0) {
        toast({
          title: "No recommendations found",
          description: "Try adjusting your preferences",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error getting recommendations:', error);
      toast({
        title: "Error",
        description: `Failed to get recommendations: ${error.message || 'Unknown error'}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Recommendations
          </h1>
          <p className="text-muted-foreground">
            Tell us about your preferences and let AI find your perfect next read
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 md:p-8 mb-8 shadow-card">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mood">Current Mood</Label>
                <Input
                  id="mood"
                  placeholder="e.g., reflective, adventurous, romantic"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Preferred Genre</Label>
                <Input
                  id="genre"
                  placeholder="e.g., science fiction, mystery, fantasy"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Favorite Author</Label>
              <Input
                id="author"
                placeholder="e.g., Brandon Sanderson, Agatha Christie"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prefs">Additional Preferences (Optional)</Label>
              <Textarea
                id="prefs"
                placeholder="Any other preferences? Reading level, themes, setting, etc."
                value={additionalPrefs}
                onChange={(e) => setAdditionalPrefs(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={getRecommendations}
                disabled={loading}
                className="flex-1"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
              </Button>
              {recommendations.length > 0 && (
                <Button
                  variant="outline"
                  onClick={getRecommendations}
                  disabled={loading}
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {loading && <LoadingSpinner message="AI is finding perfect books for you..." />}

        {!loading && recommendations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Personalized Recommendations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {recommendations.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
