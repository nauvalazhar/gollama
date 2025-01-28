'use client';

import {
  Bookmark,
  ChevronDown,
  Copy,
  Download,
  Info,
  Maximize,
  Maximize2,
  MoreVertical,
  Pencil,
  Quote,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Trash,
} from 'lucide-react';
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleContent,
  ChatBubbleDetail,
  ChatBubbleDivider,
  ChatBubbleName,
  ChatBubbleTool,
  ChatBubbleTools,
} from './chat-bubble';
import { ChatForm } from './chat-form';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { TooltipContent } from '@/components/ui/tooltip';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EditableText } from '@/components/ui/editable-text';
import { ModelSelector } from './model-selector';

const exampleConversation = [
  {
    role: 'user',
    content: 'Can you help me understand how React Server Components work?',
    avatar: 'U',
  },
  {
    role: 'assistant',
    content: `React Server Components (RSC) are a new way to build React applications that let you render components on the server. Here are the key benefits:

1. Improved performance by reducing client-side JavaScript
2. Direct access to backend resources
3. Automatic code splitting
4. Better initial page load

You can create a server component by simply writing a regular React component without the 'use client' directive.`,
    avatar: 'AI',
  },
  {
    role: 'user',
    content: 'What about data fetching in Server Components?',
    avatar: 'U',
  },
  {
    role: 'assistant',
    content: `In Server Components, data fetching becomes much simpler. You can:

- Use async/await directly in your components
- Access databases and APIs without exposing credentials
- Take advantage of built-in caching and revalidation

Here's a simple example:

\`\`\`tsx
async function UserProfile({ id }: { id: string }) {
  const user = await db.users.findUnique({ where: { id } });
  return <div>{user.name}</div>;
}
\`\`\`

No need for useEffect or loading states!`,
    avatar: 'AI',
  },
  {
    role: 'user',
    content: 'How do Server Components handle errors?',
    avatar: 'U',
  },
  {
    role: 'assistant',
    content: `Error handling in Server Components is robust and flexible. You can use error boundaries and the new error.tsx files in Next.js for graceful error handling. Here's a comprehensive overview:

1. Error Boundaries
- Create error.tsx files alongside your page components
- These catch and handle errors at the route segment level
- Can display fallback UI while maintaining app functionality

2. try/catch Blocks
- Use standard try/catch in async Server Components
- Handle database or API errors gracefully
- Return appropriate error states or fallback content

3. Error Recovery
- Users can retry failed actions
- State remains intact in client components
- Errors don't crash the entire application

Here's an example of an error boundary:

\`\`\`tsx
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
\`\`\``,
    avatar: 'AI',
  },
  {
    role: 'user',
    content:
      'What about component composition with Server and Client Components?',
    avatar: 'U',
  },
  {
    role: 'assistant',
    content: `Component composition between Server and Client Components follows some important patterns and rules:

1. Server Components (Default)
- Can render other Server Components
- Can render Client Components
- Cannot use hooks or browser APIs
- Great for data fetching and static content

2. Client Components ('use client')
- Can render other Client Components
- Cannot render Server Components directly
- Can use all React features (hooks, effects, etc)
- Should be used sparingly for interactive features

3. Common Patterns:

\`\`\`tsx
// Server Component
async function ServerParent() {
  const data = await fetchData();
  return (
    <div>
      <ServerChild data={data} />
      <ClientChild data={data} /> {/* This works! */}
    </div>
  );
}

// Client Component
'use client'
function ClientParent() {
  const [state, setState] = useState();
  return (
    <div>
      <ClientChild />
      {/* Cannot directly render Server Components here */}
    </div>
  );
}
\`\`\`

4. Best Practices:
- Keep large static parts as Server Components
- Move interactivity to leaf Client Components
- Pass server data as props to Client Components
- Use composition boundaries wisely for optimal performance`,
    avatar: 'AI',
  },
  {
    role: 'user',
    content: 'Can you explain streaming and suspense in Server Components?',
    avatar: 'U',
  },
  {
    role: 'assistant',
    content: `Streaming and Suspense are powerful features that enhance the user experience with Server Components. Here's a detailed explanation:

1. Streaming
- Allows progressive rendering of content
- Server sends HTML in chunks as it becomes ready
- Users see content faster, especially with slow data fetches
- Works automatically with Suspense boundaries

2. Suspense Implementation:

\`\`\`tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <div>
      <h1>My Dashboard</h1>
      
      <Suspense fallback={<LoadingProfile />}>
        <UserProfile />
      </Suspense>
      
      <Suspense fallback={<LoadingStats />}>
        <UserStats />
      </Suspense>
      
      <Suspense fallback={<LoadingFeed />}>
        <ActivityFeed />
      </Suspense>
    </div>
  );
}
\`\`\`

3. Benefits:
- Better perceived performance
- No loading spinners for fast responses
- Progressive enhancement
- Improved time to first byte (TTFB)

4. Loading UI Patterns:
- Skeleton screens
- Loading spinners
- Placeholder content
- Staggered loading states

5. Best Practices:
- Wrap slow data fetches in Suspense
- Use loading.tsx for route segments
- Consider parallel data fetching
- Implement meaningful loading states`,
    avatar: 'AI',
  },
  {
    role: 'user',
    content: 'How do you optimize Server Components for performance?',
    avatar: 'U',
  },
  {
    role: 'assistant',
    content: `Optimizing Server Components involves several key strategies and best practices:

1. Route Segmentation
- Break down pages into logical segments
- Use parallel routing for independent sections
- Implement route groups for better organization

2. Caching Strategies:
\`\`\`tsx
// Route segment config
export const revalidate = 3600; // Revalidate every hour

async function CachedComponent() {
  const data = await fetch(URL, { next: { revalidate: 3600 } });
  return <div>{/* Render data */}</div>;
}
\`\`\`

3. Parallel Data Fetching:
\`\`\`tsx
async function Dashboard() {
  // Fetch in parallel
  const [users, posts, analytics] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchAnalytics()
  ]);
  
  return (
    <div>
      <UserList users={users} />
      <Posts posts={posts} />
      <Analytics data={analytics} />
    </div>
  );
}
\`\`\`

4. Component-Level Optimization:
- Keep components focused and small
- Use proper granularity for Suspense boundaries
- Implement efficient data structures
- Minimize prop drilling

5. Advanced Techniques:
- Streaming responses for large datasets
- Implementing cursor-based pagination
- Using edge runtime for faster responses
- Leveraging HTTP/2 server push

6. Monitoring and Metrics:
- Track server response times
- Monitor memory usage
- Analyze component render times
- Use Web Vitals for performance insights`,
    avatar: 'AI',
  },
];

export function Chat() {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="flex flex-col h-full relative">
      <header className="flex items-center py-2 px-6 border-b border-border">
        <div className="w-4/12">
          <ModelSelector
            onChange={(value) => console.log('Model changed:', value)}
          />
        </div>
        <div className="w-4/12 flex items-center">
          <EditableText
            as="h1"
            value="What is React Server Components?"
            onSubmit={(value) => console.log(value)}
            className="font-semibold text-center text-lg"
          />
        </div>
        <div className="w-4/12">
          <div className="flex items-center gap-2 justify-end">
            <TooltipProvider>
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Bookmark className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Bookmark chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil className="mr-1 size-4" />
                  Move to folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Info className="mr-1 size-4" />
                  Archive chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-1 size-4" />
                  Export chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-1 size-4" />
                  Delete chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <div ref={chatContainerRef} className="h-full overflow-y-auto pt-6">
        <div className="flex flex-col gap-10 max-w-3xl mx-auto">
          {exampleConversation.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.role === 'user' ? 'plain' : 'boxed'}
            >
              <ChatBubbleAvatar fallback={message.avatar} />
              <ChatBubbleDetail>
                <ChatBubbleName>
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </ChatBubbleName>
                <ChatBubbleContent>{message.content}</ChatBubbleContent>
                {message.role === 'assistant' ? (
                  <ChatBubbleTools>
                    <ChatBubbleTool label="Quote this response">
                      <Quote />
                    </ChatBubbleTool>
                    <ChatBubbleDivider />
                    <ChatBubbleTool label="Good response">
                      <ThumbsUp />
                    </ChatBubbleTool>
                    <ChatBubbleTool label="Bad response">
                      <ThumbsDown />
                    </ChatBubbleTool>
                    <ChatBubbleDivider />
                    <ChatBubbleTool label="Regenerate response">
                      <RefreshCw />
                    </ChatBubbleTool>
                    <ChatBubbleTool label="Copy">
                      <Copy />
                    </ChatBubbleTool>
                    <ChatBubbleTool label="Expand">
                      <Maximize2 />
                    </ChatBubbleTool>
                  </ChatBubbleTools>
                ) : (
                  <ChatBubbleTools floating>
                    <ChatBubbleTool label="Edit message">
                      <Pencil />
                    </ChatBubbleTool>
                    <ChatBubbleDivider />
                    <ChatBubbleTool label="Copy">
                      <Copy />
                    </ChatBubbleTool>
                  </ChatBubbleTools>
                )}
              </ChatBubbleDetail>
            </ChatBubble>
          ))}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mx-auto pb-8">
            <Info size={16} />
            AI can make mistakes. Always verify information.
          </p>
        </div>
      </div>
      <ChatFormWrapper />
    </section>
  );
}

// abstracted to make it easier to handle height changes and avoid whole component re-renders
function ChatFormWrapper() {
  const [editorHeight, setEditorHeight] = useState(0);

  const handleHeightChange = (height: number) => {
    setEditorHeight(height);
  };

  return (
    <>
      <div style={{ height: editorHeight + 20 }} className="flex-shrink-0" />
      <div
        className={cn('absolute left-0 bottom-4 w-full', 'flex justify-center')}
      >
        <ChatForm className="w-4xl" onHeightChange={handleHeightChange} />
      </div>
    </>
  );
}
