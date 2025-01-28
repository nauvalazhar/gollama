import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { Markdown } from '@/components/ui/markdown';

const chatBubbleVariants = cva('flex gap-4', {
  variants: {
    variant: {
      plain: 'pl-4 [&_.chat-bubble-detail]:w-auto',
      boxed: [
        'bg-chat-bubble rounded-2xl border p-6 [&_.chat-bubble-detail]:w-full',
        'hover:shadow-xl hover:shadow-white/2 transition-all',
      ],
    },
    direction: {
      left: '',
      right: [
        'flex-row-reverse [&_.chat-bubble-detail]:w-auto',
        '[&_.chat-bubble-name]:text-right',
      ],
    },
  },
  defaultVariants: {
    variant: 'plain',
    direction: 'left',
  },
});

interface ChatBubbleRootProps extends VariantProps<typeof chatBubbleVariants> {
  children: React.ReactNode;
}

export function ChatBubble({
  children,
  variant,
  direction,
}: ChatBubbleRootProps) {
  return (
    <div
      className={cn(
        'relative group/bubble',
        chatBubbleVariants({ variant, direction })
      )}
    >
      {children}
    </div>
  );
}

interface ChatBubbleAvatarProps {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function ChatBubbleAvatar({
  src,
  alt,
  fallback,
  className,
}: ChatBubbleAvatarProps) {
  return (
    <div
      className={cn(
        'size-10 rounded-full bg-white/10 flex items-center justify-center chat-bubble-avatar flex-shrink-0',
        className
      )}
    >
      {src ? <img src={src} alt={alt} className="rounded-full" /> : fallback}
    </div>
  );
}

interface ChatBubbleDetailProps {
  children: React.ReactNode;
}

export function ChatBubbleDetail({ children }: ChatBubbleDetailProps) {
  return (
    <div className="flex flex-col gap-1 chat-bubble-detail">{children}</div>
  );
}

interface ChatBubbleNameProps {
  children: React.ReactNode;
}

export function ChatBubbleName({ children }: ChatBubbleNameProps) {
  return <div className="text-sm font-medium chat-bubble-name">{children}</div>;
}

interface ChatBubbleContentProps {
  children: React.ReactNode;
}

export function ChatBubbleContent({ children }: ChatBubbleContentProps) {
  return (
    <div className="chat-bubble-content">
      {typeof children === 'string' ? (
        <Markdown content={children} />
      ) : (
        children
      )}
    </div>
  );
}

interface ChatBubbleToolsProps {
  children: React.ReactNode;
  floating?: boolean;
}

export function ChatBubbleTools({
  children,
  floating = false,
}: ChatBubbleToolsProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4',
        'border-t mt-6 pt-6',
        '*:opacity-40',
        'group-hover/bubble:*:opacity-100',
        '*:transition-opacity *:duration-300',
        'transition-all duration-300',
        floating &&
          'absolute -bottom-8 opacity-0 group-hover/bubble:-bottom-6 group-hover/bubble:opacity-100'
      )}
    >
      {children}
    </div>
  );
}

interface ChatBubbleToolProps {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function ChatBubbleTool({
  children,
  label,
  onClick,
  className,
}: ChatBubbleToolProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-auto p-0 text-muted-foreground hover:text-foreground transition-all cursor-pointer',
              className
            )}
            onClick={onClick}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ChatBubbleDividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function ChatBubbleDivider({
  orientation = 'vertical',
  className,
}: ChatBubbleDividerProps) {
  return (
    <div
      className={cn(
        'bg-border',
        orientation === 'vertical' ? 'h-4 w-[1px]' : 'h-[1px] w-4',
        className
      )}
    />
  );
}
