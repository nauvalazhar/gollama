'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bold,
  Italic,
  Code,
  List,
  ListOrdered,
  Quote,
  Code2,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  ChevronDown,
  Pilcrow,
  Paperclip,
} from 'lucide-react';
import { Markdown } from 'tiptap-markdown';
import { useRef } from 'react';
import { Kbd } from '@/components/ui/kbd';
import { useHotkeys } from 'react-hotkeys-hook';

interface EditorProps {
  content?: string;
  placeholder?: string;
  onChange?: (markdown: string) => void;
  onEnter?: (event: KeyboardEvent, clear: () => void) => void;
  onHeightChange?: (height: number) => void;
  onCreated?: () => void;
}

export function Editor({
  content,
  placeholder = 'Ask a question...',
  onChange,
  onEnter,
  onHeightChange,
  onCreated,
}: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Markdown,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      const markdown = editor.storage.markdown.getMarkdown();
      onChange?.(markdown);
      onHeightChange?.(editorRef.current?.clientHeight ?? 0);
    },
    onCreate: () => {
      onHeightChange?.(editorRef.current?.clientHeight ?? 0);
      // delay to allow the editor to be created
      setTimeout(() => {
        onCreated?.();
      }, 100);
    },
    editorProps: {
      handleDOMEvents: {
        keydown: (_, event: KeyboardEvent) => {
          // if ctrl + enter, submit
          if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            onEnter?.(event, () => {
              editor?.commands.clearContent(true);
            });
          }
        },
      },
    },
  });

  useHotkeys('ctrl+/', () => {
    editor?.commands.focus();
  });

  if (!editor) {
    return null;
  }

  return (
    <div
      ref={editorRef}
      className={cn(
        'relative w-full bg-input/70 backdrop-blur-xl rounded-2xl',
        'shadow-md border border-white/10 focus-within:border-white/20'
      )}
    >
      <EditorContent
        editor={editor}
        className="*:p-6 *:max-h-[400px] *:overflow-y-auto min-h-20 *:min-h-20"
      />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div
            ref={containerRef}
            className={cn(
              'flex items-center gap-1 p-1',
              'bg-popover backdrop-blur-2xl rounded-lg border border-white/10'
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  {editor.isActive('heading', { level: 1 }) && (
                    <Heading1 className="h-4 w-4" />
                  )}
                  {editor.isActive('heading', { level: 2 }) && (
                    <Heading2 className="h-4 w-4" />
                  )}
                  {editor.isActive('heading', { level: 3 }) && (
                    <Heading3 className="h-4 w-4" />
                  )}
                  {editor.isActive('paragraph') && (
                    <Pilcrow className="h-4 w-4" />
                  )}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                container={containerRef.current}
              >
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().setParagraph().run()}
                >
                  <Pilcrow className="h-4 w-4 mr-2" />
                  Paragraph
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  <Heading1 className="h-4 w-4 mr-2" />
                  Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  <Heading2 className="h-4 w-4 mr-2" />
                  Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  <Heading3 className="h-4 w-4 mr-2" />
                  Heading 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Text Formatting Group */}
            <div className="flex items-center gap-0.5 border-l pl-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-active={editor.isActive('bold')}
                className={cn(
                  'h-8 w-8 p-0',
                  'data-[active=true]:bg-muted data-[active=true]:text-muted-foreground'
                )}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-active={editor.isActive('italic')}
                className={cn(
                  'h-8 w-8 p-0',
                  'data-[active=true]:bg-muted data-[active=true]:text-muted-foreground'
                )}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                data-active={editor.isActive('highlight')}
                className={cn(
                  'h-8 w-8 p-0',
                  'data-[active=true]:bg-muted data-[active=true]:text-muted-foreground'
                )}
              >
                <Highlighter className="h-4 w-4" />
              </Button>
            </div>

            {/* Lists and Code Group */}
            <div className="flex items-center gap-0.5 border-l pl-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('h-8 w-8 p-0')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  container={containerRef.current}
                >
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                  >
                    <List className="h-4 w-4 mr-2" />
                    Bullet List
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                  >
                    <ListOrdered className="h-4 w-4 mr-2" />
                    Ordered List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('h-8 w-8 p-0')}
                  >
                    <Code className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  container={containerRef.current}
                >
                  <DropdownMenuItem
                    onClick={() => editor.chain().focus().toggleCode().run()}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Inline Code
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      editor.chain().focus().toggleCodeBlock().run()
                    }
                  >
                    <Code2 className="h-4 w-4 mr-2" />
                    Code Block
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </BubbleMenu>
      )}

      <hr className="border-border mx-3" />

      <footer className="px-3 py-2">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <Paperclip size={20} />
            </button>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            Use <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd> to submit
          </span>
        </div>
      </footer>
    </div>
  );
}
