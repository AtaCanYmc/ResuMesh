import React from 'react';
import { cn } from '../../lib/utils';
import { ExternalLink } from 'lucide-react';

interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  tags?: string[];
  icon?: React.ReactNode;
  externalLink?: string;
  footerContent?: React.ReactNode;
}

export const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ className, title, description, tags, icon, externalLink, footerContent, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col hover:border-gray-400 dark:hover:border-gray-600 transition-colors group cursor-pointer shadow-sm",
          className
        )}
        {...props}
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1" title={title}>
            {title}
          </h3>
          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors"
              aria-label={`${title} linkine git`}
            >
              {icon || <ExternalLink size={20} />}
            </a>
          )}
          {!externalLink && icon && (
             <div className="text-gray-400 dark:text-gray-500">{icon}</div>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 mb-6 line-clamp-3">
          {description || 'Açıklama bulunmuyor.'}
        </p>
        <div className="flex items-center justify-between mt-auto">
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap max-w-[60%]">
              {tags.slice(0, 2).map((tag, idx) => (
                <span key={idx} className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-1" title={tag}></span>
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{tags[0]}</span>
            </div>
          )}
          {footerContent && (
            <div className="flex items-center space-x-3 text-xs font-medium text-gray-500 dark:text-gray-400 ml-auto">
              {footerContent}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ContentCard.displayName = "ContentCard";
