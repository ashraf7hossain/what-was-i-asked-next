'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TextareaAutosize from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PostEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function PostEditor({ content, onChange }: PostEditorProps) {
  return (
    <Tabs defaultValue="write" className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="write">
        <TextareaAutosize
          placeholder="What are your thoughts? (Markdown supported)"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none appearance-none overflow-hidden bg-transparent focus:outline-none min-h-[200px] p-2 border rounded-md"
        />
      </TabsContent>
      <TabsContent value="preview">
        <div className="min-h-[200px] p-2 border rounded-md prose prose-sm max-w-none">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">Nothing to preview</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}