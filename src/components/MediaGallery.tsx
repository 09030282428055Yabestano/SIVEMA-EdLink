import React, { useEffect, useState } from 'react';
import { Camera, Maximize2, X, CheckCircle2 } from 'lucide-react';
import { MEDIA_PHOTOS } from '@/src/data/collisionCurriculum';
import type { MediaPhoto } from '@/src/types/academic';

interface MediaGalleryProps {
  filterChapterId?: string;
  onSelectChapter?: (chapterId: string) => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  filterChapterId,
  onSelectChapter,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<MediaPhoto | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!selectedPhoto) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPhoto]);

  const items = filterChapterId
    ? MEDIA_PHOTOS.filter((p) => p.chapterId === filterChapterId)
    : MEDIA_PHOTOS;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Dokumentasi Foto & Praktikum Tumbukan
          </h3>
          <p className="text-xs text-slate-500">
            Klik foto eksperimen untuk memperbesar pengamatan dan melihat catatan persamaan fisika
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {items.map((photo) => {
          const isHighlighted = filterChapterId === photo.chapterId;
          return (
            <article
              key={photo.id}
              className={`group bg-white border rounded-xl overflow-hidden transition-colors flex flex-col ${
                isHighlighted ? 'border-blue-300' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden text-left cursor-pointer"
              >
                {!failedImages[photo.id] ? (
                  <img
                    src={photo.imageSrc}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [photo.id]: true }))
                    }
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center text-slate-200">
                    <Camera className="w-8 h-8 mb-2 text-blue-400" />
                    <span className="text-xs font-medium">{photo.title}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 flex items-end justify-between">
                  <span className="text-xs font-medium text-white">
                    Perbesar Observasi
                  </span>
                  <Maximize2 className="w-4 h-4 text-white/90" />
                </div>
              </button>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-500">{photo.category}</div>
                  <h4 className="text-sm font-semibold text-slate-900 mt-1">
                    {photo.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {photo.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <code className="text-[11px] font-mono text-blue-700 truncate">
                    {photo.formulaObserved}
                  </code>
                  {onSelectChapter && (
                    <button
                      type="button"
                      onClick={() => onSelectChapter(photo.chapterId)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
                    >
                      Buka Bab
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Photo detail lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full overflow-hidden shadow-xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">{selectedPhoto.category}</div>
                <h4 className="text-base font-semibold text-slate-900">
                  {selectedPhoto.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Tutup pratinjau foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-5">
              <div className="aspect-[16/10] w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={selectedPhoto.imageSrc}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedPhoto.caption}
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Catatan Pengamatan Eksperimen
                  </div>
                  <ul className="space-y-2">
                    {selectedPhoto.experimentNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-500">Persamaan Teramati:</span>
                    <code className="font-mono font-semibold text-blue-700">
                      {selectedPhoto.formulaObserved}
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
