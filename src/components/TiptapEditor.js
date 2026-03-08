'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  LinkIcon,
  Quote,
  Undo2,
  Redo2,
} from 'lucide-react';

export default function TiptapEditor({ value, onChange, placeholder = 'Write your content here...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
        listItem: {},
        bulletList: {},
        orderedList: {},
        hardBreak: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    autofocus: 'end',
  });

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <div className="bg-gray-50 border-b border-gray-300 p-3 min-h-12" />
        <div className="p-4 min-h-80 bg-gray-50 animate-pulse" />
      </div>
    );
  }

  const addLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const buttonClass =
    'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5';
  const activeClass = 'bg-blue-600 text-white';
  const inactiveClass = 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-3 flex flex-wrap gap-2">
        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${buttonClass} ${!editor.can().undo() ? 'opacity-50 cursor-not-allowed' : inactiveClass}`}
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${buttonClass} ${!editor.can().redo() ? 'opacity-50 cursor-not-allowed' : inactiveClass}`}
          title="Redo"
        >
          <Redo2 size={16} />
        </button>

        <div className="w-px bg-gray-300" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${buttonClass} ${editor.isActive('bold') ? activeClass : inactiveClass}`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonClass} ${editor.isActive('italic') ? activeClass : inactiveClass}`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${buttonClass} ${editor.isActive('code') ? activeClass : inactiveClass}`}
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        <div className="w-px bg-gray-300" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${buttonClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : inactiveClass}`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${buttonClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : inactiveClass}`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px bg-gray-300" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${buttonClass} ${editor.isActive('bulletList') ? activeClass : inactiveClass}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${buttonClass} ${editor.isActive('orderedList') ? activeClass : inactiveClass}`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px bg-gray-300" />

        {/* Blockquote & Link */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${buttonClass} ${editor.isActive('blockquote') ? activeClass : inactiveClass}`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>
        <button
          type="button"
          onClick={addLink}
          className={`${buttonClass} ${editor.isActive('link') ? activeClass : inactiveClass}`}
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>

        <div className="w-px bg-gray-300" />

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
          className={`${buttonClass} ${inactiveClass}`}
          title="Clear Formatting"
        >
          ✕ Clear
        </button>
      </div>

      {/* Editor Content */}
      <div 
        className="flex-1 cursor-text overflow-auto"
        onClick={() => editor.chain().focus().run()}
        role="textbox"
        aria-multiline="true"
      >
        <EditorContent
          editor={editor}
          className="p-4 h-full focus:outline-none prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:my-1 prose-p:my-2 prose-headings:my-3 prose-blockquote:my-2 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100"
        />
      </div>

      {/* Character Count */}
      <div className="bg-gray-50 border-t border-gray-300 px-4 py-2 text-xs text-gray-600">
        {editor.getText().length} characters
      </div>
    </div>
  );
}
