import { useRef, useState } from 'react';
import { X, Plus, Loader2, LayoutGrid } from 'lucide-react';
import { uploadImage } from '../../lib/api';
import ImageLightbox from '../ImageLightbox';
import ImageCaptionField from './ImageCaptionField';

export interface GridImageItem {
  id: string;
  url: string;
  caption?: string;
  caption_es?: string;
}

export type GridColumnCount = 1 | 2 | 3 | 4;

export interface GridRow {
  id: string;
  columns: GridColumnCount;
  images: GridImageItem[];
}

interface Props {
  images: GridImageItem[];
  columns: GridColumnCount;
  rows?: GridRow[];
  editorMode?: boolean;
  language?: 'en' | 'es';
  onChange?: (images: GridImageItem[], columns: GridColumnCount, rows: GridRow[]) => void;
}

const COLUMN_CLASSES: Record<GridColumnCount, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

function createRowId() {
  return `row-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeRows(
  rows: GridRow[] | undefined,
  images: GridImageItem[],
  columns: GridColumnCount,
): GridRow[] {
  if (Array.isArray(rows) && rows.length > 0) {
    return rows.map(row => ({
      ...row,
      columns: [1, 2, 3, 4].includes(row.columns) ? row.columns : columns,
      images: Array.isArray(row.images) ? row.images : [],
    }));
  }

  if (!images.length) {
    return [{ id: 'legacy-row-0', columns, images: [] }];
  }

  const legacyRows: GridRow[] = [];
  for (let index = 0; index < images.length; index += columns) {
    legacyRows.push({
      id: `legacy-row-${index / columns}`,
      columns,
      images: images.slice(index, index + columns),
    });
  }
  return legacyRows;
}

// ─── Mini upload slot ─────────────────────────────────────────────────────────
function UploadSlot({ onUploaded }: { onUploaded: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | null | undefined) {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      onUploaded(url);
    } catch { /* silent */ }
    finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div
      onClick={() => !uploading && fileRef.current?.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      className={`aspect-video rounded-[8px] border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all select-none ${
        dragging
          ? 'border-white/50 bg-white/[0.07]'
          : 'border-white/15 hover:border-white/28 hover:bg-white/[0.03]'
      }`}
    >
      {uploading
        ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin text-white/35" />
        : <Plus size={18} strokeWidth={1.5} className="text-white/25" />
      }
      <span className="text-white/20 text-[0.68rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
        {uploading ? 'Uploading…' : 'Add image'}
      </span>
      <input
        ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}

// ─── Image slot (filled) ──────────────────────────────────────────────────────
function FilledSlot({
  item,
  onRemove,
  onCaptionChange,
  language = 'en',
}: {
  item: GridImageItem;
  onRemove: () => void;
  onCaptionChange: (caption: string) => void;
  language?: 'en' | 'es';
}) {
  return (
    <div className="relative group/slot min-w-0">
      <div className="relative overflow-hidden rounded-[8px]">
        <img src={item.url} alt={item.caption || ''} className="block h-auto w-full object-contain" />
        <button
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 size-[22px] flex items-center justify-center rounded-full bg-black/60 border border-white/15 text-white/50 hover:text-[#d25d5f] hover:bg-black/80 transition-all opacity-0 group-hover/slot:opacity-100"
        >
          <X size={11} strokeWidth={2} />
        </button>
      </div>
      <ImageCaptionField value={(language === 'es' ? item.caption_es : item.caption)} onChange={onCaptionChange} placeholder={language === 'es' ? 'Pie' : 'Caption'} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ImageGridBlock({ images, columns, rows, editorMode, language = 'en', onChange }: Props) {
  const [lightboxImage, setLightboxImage] = useState<GridImageItem | null>(null);
  const normalizedRows = normalizeRows(rows, images, columns);
  const allImages = normalizedRows.flatMap(row => row.images);

  function emitRows(nextRows: GridRow[]) {
    const nextColumns = nextRows[0]?.columns ?? 1;
    onChange?.(nextRows.flatMap(row => row.images), nextColumns, nextRows);
  }

  function setRowColumns(rowId: string, nextColumns: GridColumnCount) {
    const rowIndex = normalizedRows.findIndex(row => row.id === rowId);
    if (rowIndex < 0) return;

    const row = normalizedRows[rowIndex];
    const replacementRows: GridRow[] = [];
    for (let index = 0; index < Math.max(row.images.length, 1); index += nextColumns) {
      replacementRows.push({
        id: index === 0 ? row.id : createRowId(),
        columns: nextColumns,
        images: row.images.slice(index, index + nextColumns),
      });
    }

    const nextRows = [...normalizedRows];
    nextRows.splice(rowIndex, 1, ...replacementRows);
    emitRows(nextRows);
  }

  function addRow() {
    emitRows([
      ...normalizedRows,
      { id: createRowId(), columns: 1, images: [] },
    ]);
  }

  function removeRow(rowId: string) {
    const row = normalizedRows.find(current => current.id === rowId);
    if (!row || row.images.length > 0 || normalizedRows.length === 1) return;
    emitRows(normalizedRows.filter(current => current.id !== rowId));
  }

  function addImage(rowId: string, url: string) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    emitRows(normalizedRows.map(row =>
      row.id === rowId && row.images.length < row.columns
        ? { ...row, images: [...row.images, { id, url }] }
        : row
    ));
  }

  function removeImage(id: string) {
    emitRows(normalizedRows.map(row => ({
      ...row,
      images: row.images.filter(image => image.id !== id),
    })));
  }

  function updateCaption(id: string, caption: string) {
    emitRows(normalizedRows.map(row => ({
      ...row,
      images: row.images.map(image => image.id === id ? { ...image, [language === 'es' ? 'caption_es' : 'caption']: caption } : image),
    })));
  }

  // ── Editor mode ──
  if (editorMode) {
    return (
      <div className="rounded-[12px] border border-white/10 bg-white/[0.02] p-3 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/35 text-[0.75rem]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            <LayoutGrid size={13} strokeWidth={1.5} />
            Image Grid
          </div>
          <button
            type="button"
            onClick={addRow}
            className="flex items-center gap-1 rounded-[7px] bg-white/5 px-2.5 py-1 text-[0.72rem] text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            <Plus size={12} />
            Add row
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {normalizedRows.map((row, rowIndex) => (
            <div key={row.id} className="rounded-[10px] border border-white/[0.07] bg-black/[0.06] p-2">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="text-[0.68rem] text-white/25"
                  style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                >
                  Row {rowIndex + 1}
                </span>
                <div className="ml-auto flex gap-1 rounded-[8px] bg-white/5 p-0.5">
                  {([1, 2, 3, 4] as const).map(count => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setRowColumns(row.id, count)}
                      className={`rounded-[6px] px-2 py-1 text-[0.7rem] transition-colors ${
                        row.columns === count
                          ? 'bg-white/12 text-white'
                          : 'text-white/30 hover:text-white'
                      }`}
                      style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                    >
                      {count} col
                    </button>
                  ))}
                </div>
                {row.images.length === 0 && normalizedRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    aria-label={`Remove row ${rowIndex + 1}`}
                    title="Remove empty row"
                    className="flex size-6 items-center justify-center rounded-full text-white/25 transition-colors hover:bg-white/10 hover:text-[#d25d5f]"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>

              <div className={`grid ${COLUMN_CLASSES[row.columns]} gap-2`}>
                {row.images.map(image => (
                  <FilledSlot
                    key={image.id}
                    item={image}
                    onRemove={() => removeImage(image.id)}
                    onCaptionChange={caption => updateCaption(image.id, caption)}
                    language={language}
                  />
                ))}
                {row.images.length < row.columns && (
                  <UploadSlot onUploaded={url => addImage(row.id, url)} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Read-only mode ──
  if (!allImages.length) return null;
  return (
    <>
      <div className="flex flex-col gap-2">
        {normalizedRows.filter(row => row.images.length > 0).map(row => (
          <div key={row.id} className={`grid ${COLUMN_CLASSES[row.columns]} gap-2`}>
            {row.images.map(image => (
              <figure key={image.id} className="m-0">
                <img
                  src={image.url}
                  alt={image.caption || ''}
                  className="block h-auto w-full cursor-zoom-in object-contain"
                  onClick={() => setLightboxImage(image)}
                />
                {image.caption && (
                  <figcaption
                    className="mt-1 text-center text-[0.75rem] whitespace-pre-line"
                    style={{
                      fontFamily: "'Source Sans 3', sans-serif",
                      color: 'rgba(255,255,255,0.35)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {image.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        ))}
      </div>
      {lightboxImage && (
        <ImageLightbox
          images={allImages.map(image => ({
            src: image.url,
            alt: image.caption || '',
          }))}
          initialIndex={Math.max(0, allImages.findIndex(image => image.id === lightboxImage.id))}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
}
