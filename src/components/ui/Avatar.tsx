interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function Avatar({ src, alt, size = 'md', showStatus = false }: AvatarProps) {
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-primary/50`}
      />
      {showStatus && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-bg-deep" />
      )}
    </div>
  );
}
