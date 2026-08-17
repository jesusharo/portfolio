import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading2, Link as LinkIcon, Image as ImageIcon, Minus, Upload, Loader2 } from 'lucide-react';
import { uploadImage } from './ImageUploadInput';

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt('URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  function addImageUrl() {
    const url = window.prompt('Image URL:');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  }

  async function handleImageFile(file: File) {
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (e) {
      console.error('Upload failed', e);
    } finally {
      setUploading(false);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageFile(file);
    e.target.value = '';
  }

  const btn = (action: () => void, active: boolean, label: string, Icon: React.ElementType) => (
    <button
      type="button"
      onClick={action}
      title={label}
      className={`p-1.5 rounded-[6px] transition-colors ${active ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
    >
      <Icon size={14} strokeWidth={1.5} />
    </button>
  );

  return (
    <div className="rounded-[12px] border border-white/10 bg-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 px-2 py-2 border-b border-white/10 bg-white/[0.02]">
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold', Bold)}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic', Italic)}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'Heading', Heading2)}
        <div className="w-px bg-white/10 mx-1" />
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Bullet list', List)}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Ordered list', ListOrdered)}
        <div className="w-px bg-white/10 mx-1" />
        {btn(addLink, editor.isActive('link'), 'Link', LinkIcon)}
        {btn(addImageUrl, false, 'Image URL', ImageIcon)}

        {/* Upload image button */}
        <button
          type="button"
          title="Upload image"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="p-1.5 rounded-[6px] transition-colors text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-40"
        >
          {uploading
            ? <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
            : <Upload size={14} strokeWidth={1.5} />}
        </button>

        {btn(() => editor.chain().focus().setHorizontalRule().run(), false, 'Divider', Minus)}
      </div>

      {/* Editor area */}
      <div className="relative">
        {!editor.getText() && placeholder && (
          <p className="absolute top-3 left-4 text-white/20 text-[0.85rem] font-['Source_Sans_3',sans-serif] pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent
          editor={editor}
          className="prose prose-invert prose-sm max-w-none px-4 py-3 text-white/80 text-[0.85rem] font-['Source_Sans_3',sans-serif] min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[120px]"
        />
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
    </div>
  );
}
