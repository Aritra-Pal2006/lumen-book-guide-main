import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, onSearch, placeholder = "Search for books..." }: SearchBarProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-12 pr-24 h-14 text-lg rounded-full border-2 focus-visible:ring-primary"
        />
        <Button
          onClick={onSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
