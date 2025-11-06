import { Heart } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description?: string;
  onSave?: (book: any) => void;
  isSaved?: boolean;
}

const BookCard = ({ id, title, author, coverUrl, description, onSave, isSaved = false }: BookCardProps) => {
  const [saved, setSaved] = useState(isSaved);
  const { toast } = useToast();

  const handleSave = () => {
    setSaved(!saved);
    onSave?.({ id, title, author, coverUrl });
    toast({
      title: saved ? "Removed from library" : "Added to library",
      description: saved ? `${title} removed` : `${title} saved`,
    });
  };

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden shadow-card book-card-hover border border-border">
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-card">
            <span className="text-4xl">📚</span>
          </div>
        )}
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleSave}
        >
          <Heart className={`h-4 w-4 ${saved ? 'fill-destructive text-destructive' : ''}`} />
        </Button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{author}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
