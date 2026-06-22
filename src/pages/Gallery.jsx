import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getGallery, addGalleryImage, deleteGalleryImage } from '../services/localStorageService';
import { getTranslation } from '../translations';

// ── Intersection Observer hook ───────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Masonry-style card ───────────────────────────────────────────
function GalleryCard({ image, index, isAdmin, onSelect, onDelete }) {
  const [ref, visible] = useInView(0.05);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0) scale(1)'
          : 'translateY(50px) scale(0.95)',
        transition: `opacity 0.6s ease ${index * 0.07}s, transform 0.6s ease ${index * 0.07}s`,
        breakInside: 'avoid',
        marginBottom: 20,
        borderRadius: 18,
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        boxShadow: hovered
          ? '0 28px 60px rgba(0,0,0,0.28)'
          : '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(image)}
    >
      <img
        src={image.url}
        alt={image.title}
        style={{
          width: '100%',
          display: 'block',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.5s ease',
        }}
        onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=Photo'; }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(15,5,40,0.85) 0%, rgba(15,5,40,0.2) 50%, transparent 100%)'
          : 'linear-gradient(to top, rgba(15,5,40,0.55) 0%, transparent 60%)',
        transition: 'background 0.4s ease',
      }} />

      {/* Content on hover */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 18px 18px',
        transform: hovered ? 'translateY(0)' : 'translateY(8px)',
        opacity: hovered ? 1 : 0.8,
        transition: 'all 0.35s ease',
      }}>
        <h3 style={{
          color: '#fff', fontWeight: 800, fontSize: 15,
          margin: 0, textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        }}>
          {image.title}
        </h3>
        {image.description && (
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 12,
            margin: '4px 0 0', lineHeight: 1.4,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(6px)',
            transition: 'all 0.3s ease 0.05s',
          }}>
            {image.description}
          </p>
        )}
        {image.date && (
          <p style={{
            color: 'rgba(255,255,255,0.45)', fontSize: 10,
            margin: '6px 0 0', letterSpacing: 0.5,
          }}>
            {image.date}
          </p>
        )}
      </div>

      {/* View icon */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'scale(1)' : 'scale(0.7)',
        transition: 'all 0.3s ease',
        fontSize: 16,
      }}>
        🔍
      </div>

      {/* Admin delete */}
      {isAdmin && (
        <button
          onClick={e => { e.stopPropagation(); onDelete(image.id); }}
          style={{
            position: 'absolute', top: 12, left: 12,
            background: 'rgba(239,68,68,0.85)',
            backdropFilter: 'blur(6px)',
            border: 'none', color: '#fff',
            width: 30, height: 30, borderRadius: '50%',
            cursor: 'pointer', fontSize: 14, fontWeight: 700,
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'scale(1)' : 'scale(0.6)',
            transition: 'all 0.25s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

// ── Lightbox ─────────────────────────────────────────────────────
function Lightbox({ image, images, onClose, onNav }) {
  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [image]);

  if (!image) return null;
  const idx = images.findIndex(i => i.id === image.id);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(5,0,20,0.95)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 0.25s ease',
      }}
    >
      {/* Nav arrows */}
      {[{ dir: -1, label: '‹', pos: 'left' }, { dir: 1, label: '›', pos: 'right' }].map(({ dir, label, pos }) => (
        <button
          key={pos}
          onClick={e => { e.stopPropagation(); onNav(dir); }}
          style={{
            position: 'absolute', [pos]: 20, top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', width: 48, height: 48, borderRadius: '50%',
            fontSize: 24, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          {label}
        </button>
      ))}

      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 20, right: 20,
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', width: 40, height: 40, borderRadius: '50%',
          fontSize: 18, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        ×
      </button>

      {/* Image */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 900, width: '100%',
          animation: 'scaleIn 0.3s ease',
        }}
      >
        <img
          src={image.url}
          alt={image.title}
          style={{
            width: '100%', maxHeight: '72vh',
            objectFit: 'contain', borderRadius: 16,
            boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
            display: 'block',
          }}
          onError={e => { e.target.src = 'https://via.placeholder.com/800x600?text=Photo'; }}
        />
        <div style={{
          padding: '18px 4px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 18, margin: 0 }}>
              {image.title}
            </h3>
            {image.description && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, margin: '6px 0 0' }}>
                {image.description}
              </p>
            )}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, whiteSpace: 'nowrap', marginLeft: 16 }}>
            {idx + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
function Gallery() {
  const [lang, setLang] = useState(() => localStorage.getItem('preferred_lang') || 'en');
  const [images, setImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', description: '', imageData: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [filter, setFilter] = useState('all');
  const [headerRef, headerVisible] = useInView(0.1);
  const isAdmin = localStorage.getItem('token');

  const t = (key) => getTranslation(lang, key);

  // Listen for language changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newLang = localStorage.getItem('preferred_lang') || 'en';
      setLang(newLang);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadGallery = () => setImages(getGallery());
  useEffect(() => { loadGallery(); }, []);

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert(t('galleryMaxSize') || 'Max 5MB please.'); return; }
    if (!file.type.startsWith('image/')) { alert(t('galleryFileType') || 'Please upload an image file.'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setNewImage(n => ({ ...n, imageData: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = e => processFile(e.target.files[0]);

  const handleDrop = e => {
    e.preventDefault(); setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!newImage.imageData || !newImage.title.trim()) {
      alert(t('galleryAlert') || 'Please choose an image and add a title.');
      return;
    }
    addGalleryImage({ title: newImage.title, description: newImage.description, url: newImage.imageData, imageData: newImage.imageData });
    setNewImage({ title: '', description: '', imageData: null });
    setPreviewUrl(null);
    setShowForm(false);
    loadGallery();
  };

  const handleDelete = id => {
    if (confirm(t('galleryDeleteConfirm') || 'Remove this photo?')) { deleteGalleryImage(id); loadGallery(); }
  };

  const navigate = dir => {
    const idx = images.findIndex(i => i.id === selectedImage.id);
    const next = (idx + dir + images.length) % images.length;
    setSelectedImage(images[next]);
  };

  // Split images into 3 columns for masonry
  const cols = [[], [], []];
  images.forEach((img, i) => cols[i % 3].push({ ...img, _globalIdx: i }));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0414',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      paddingBottom: 80,
    }}>

      {/* ── Hero ──────────────────────────── */}
      <div style={{
        position: 'relative',
        padding: '80px 24px 100px',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* Animated background orbs */}
        {[
          { size: 400, top: '-100px', left: '60%', color: 'rgba(109,40,217,0.25)', delay: '0s' },
          { size: 300, top: '20%',    left: '-5%', color: 'rgba(37,99,235,0.2)',   delay: '3s' },
          { size: 250, top: '50%',    left: '40%', color: 'rgba(245,158,11,0.12)', delay: '6s' },
        ].map((orb, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: orb.size, height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            top: orb.top, left: orb.left,
            filter: 'blur(80px)',
            animation: `float 10s ease-in-out ${orb.delay} infinite alternate`,
            pointerEvents: 'none',
          }} />
        ))}

        <div
          ref={headerRef}
          style={{
            position: 'relative', zIndex: 1,
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease',
          }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 30, padding: '5px 18px',
            color: '#fcd34d', fontSize: 11, fontWeight: 700,
            letterSpacing: 3, textTransform: 'uppercase',
            marginBottom: 24,
          }}>
            ✦ {t('galleryBadge') || 'Captured Moments'} ✦
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 7vw, 64px)',
            fontWeight: 900, color: '#fff',
            margin: '0 0 16px', letterSpacing: -2, lineHeight: 1.05,
          }}>
            {t('galleryTitle') || 'Photo'} <span style={{
              background: 'linear-gradient(135deg, #a855f7, #3b82f6, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t('galleryTitleEnd') || 'Gallery'}</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 15, maxWidth: 440, margin: '0 auto 36px', lineHeight: 1.7,
          }}>
            {t('galleryDesc') || 'Memories from our church events, worship services, and community gatherings.'}
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'inline-flex', gap: 2,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 50, padding: '6px 8px',
            marginBottom: isAdmin ? 24 : 0,
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.5)', fontSize: 13,
              padding: '4px 16px',
            }}>
              📸 {images.length} {images.length === 1 ? (t('galleryPhoto') || 'photo') : (t('galleryPhotos') || 'photos')}
            </span>
          </div>

          {/* Admin button */}
          {isAdmin && (
            <div>
              <button
                onClick={() => { setShowForm(v => !v); setPreviewUrl(null); setNewImage({ title: '', description: '', imageData: null }); }}
                style={{
                  background: showForm
                    ? 'rgba(255,255,255,0.1)'
                    : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  color: '#fff', border: 'none',
                  padding: '13px 32px', borderRadius: 50,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  letterSpacing: 0.3,
                  boxShadow: showForm ? 'none' : '0 8px 30px rgba(124,58,237,0.4)',
                  transition: 'all 0.3s ease',
                }}
              >
                {showForm ? `✕ ${t('cancel') || 'Cancel'}` : `+ ${t('galleryUploadBtn') || 'Upload Photos'}`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Upload Form ───────────────────── */}
      {showForm && isAdmin && (
        <div style={{
          maxWidth: 560, margin: '-20px auto 40px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24, padding: 32,
          backdropFilter: 'blur(20px)',
          animation: 'slideDown 0.35s ease',
        }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 20, margin: '0 0 24px' }}>
            {t('galleryUploadTitle') || 'Upload New Photo'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? '#a855f7' : 'rgba(255,255,255,0.15)'}`,
                borderRadius: 16, padding: 28, textAlign: 'center',
                background: dragOver ? 'rgba(168,85,247,0.08)' : 'rgba(255,255,255,0.02)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
              }}
            >
              {previewUrl ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={previewUrl} alt={t('galleryPreview') || 'Preview'} style={{
                    maxHeight: 200, borderRadius: 10, display: 'block',
                  }} />
                  <button
                    type="button"
                    onClick={() => { setPreviewUrl(null); setNewImage(n => ({ ...n, imageData: null })); }}
                    style={{
                      position: 'absolute', top: -10, right: -10,
                      background: '#ef4444', border: 'none', color: '#fff',
                      width: 26, height: 26, borderRadius: '50%',
                      cursor: 'pointer', fontSize: 16, fontWeight: 700,
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
                  <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 6px', fontSize: 14 }}>
                    {dragOver ? (t('galleryDropHere') || 'Drop it here!') : (t('galleryDragDrop') || 'Drag & drop or click to choose')}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: 0 }}>
                    {t('galleryFileTypes') || 'JPG, PNG, GIF — max 5MB'}
                  </p>
                </>
              )}
              <input type="file" accept="image/*" id="imgUp" onChange={handleImageUpload} style={{ display: 'none' }} />
              <label htmlFor="imgUp" style={{
                display: 'inline-block', marginTop: 14,
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                padding: '8px 20px', borderRadius: 10, cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'background 0.2s',
              }}>
                {uploading ? (t('galleryLoading') || 'Loading…') : (t('galleryChooseFile') || 'Choose File')}
              </label>
            </div>

            {[
              { key: 'title', ph: t('galleryTitlePlaceholder') || 'Photo title', req: true, type: 'input' },
              { key: 'description', ph: t('galleryCaptionPlaceholder') || 'Caption or description (optional)', type: 'textarea' },
            ].map(f => f.type === 'input' ? (
              <input key={f.key} type="text" placeholder={f.ph} required={f.req}
                value={newImage[f.key]}
                onChange={e => setNewImage(n => ({ ...n, [f.key]: e.target.value }))}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
                  color: '#fff', padding: '11px 16px', borderRadius: 12, fontSize: 14,
                  outline: 'none', width: '100%', boxSizing: 'border-box',
                  fontFamily: 'inherit', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            ) : (
              <textarea key={f.key} placeholder={f.ph} rows={3}
                value={newImage[f.key]}
                onChange={e => setNewImage(n => ({ ...n, [f.key]: e.target.value }))}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)',
                  color: '#fff', padding: '11px 16px', borderRadius: 12, fontSize: 14,
                  outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical',
                  fontFamily: 'inherit', lineHeight: 1.6, transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            ))}

            <button
              type="submit"
              disabled={!newImage.imageData}
              style={{
                background: newImage.imageData
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(255,255,255,0.08)',
                color: newImage.imageData ? '#1c1917' : 'rgba(255,255,255,0.3)',
                border: 'none', padding: '13px',
                borderRadius: 12, fontWeight: 800, fontSize: 14,
                cursor: newImage.imageData ? 'pointer' : 'default',
                letterSpacing: 0.3,
                boxShadow: newImage.imageData ? '0 6px 20px rgba(245,158,11,0.35)' : 'none',
                transition: 'all 0.3s',
              }}
            >
              {t('galleryAddBtn') || 'Add to Gallery ✦'}
            </button>
          </form>
        </div>
      )}

      {/* ── Gallery Grid ──────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {images.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 24px',
            border: '2px dashed rgba(255,255,255,0.08)',
            borderRadius: 24,
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📷</div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16, margin: 0 }}>
              {t('galleryNoPhotos') || 'No photos yet.'}
            </p>
            {isAdmin && (
              <p style={{ color: 'rgba(124,58,237,0.6)', fontSize: 13, margin: '8px 0 0' }}>
                {t('galleryAddFirst') || 'Click "Upload Photos" to add your first image.'}
              </p>
            )}
          </div>
        ) : (
          /* Masonry 3-column layout */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {cols.map((col, ci) => (
              <div key={ci} style={{ display: 'flex', flexDirection: 'column' }}>
                {col.map((image) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    index={image._globalIdx}
                    isAdmin={isAdmin}
                    onSelect={setSelectedImage}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox ──────────────────────── */}
      <Lightbox
        image={selectedImage}
        images={images}
        onClose={() => setSelectedImage(null)}
        onNav={navigate}
      />

      {/* ── Storage note ──────────────────── */}
      {images.length > 0 && (
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.2)',
          fontSize: 11, marginTop: 40, letterSpacing: 0.5,
        }}>
          {images.length} {images.length === 1 ? (t('galleryPhoto') || 'photo') : (t('galleryPhotos') || 'photos')} · {t('galleryStorageNote') || 'stored in your browser'}
        </p>
      )}

      {/* ── Keyframes ─────────────────────── */}
      <style>{`
        @keyframes float {
          from { transform: translateY(0px) scale(1); }
          to   { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }

        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default Gallery;