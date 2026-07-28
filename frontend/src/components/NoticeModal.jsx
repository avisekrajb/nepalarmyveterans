import React, { useState, useEffect, useRef } from 'react';
import { X, Download, FileText, Calendar, Image, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { noticesAPI, logoAPI } from '../services/api';
import jsPDF from 'jspdf';

const NoticeModal = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [headerLogos, setHeaderLogos] = useState({ leftLogo: { url: '' }, rightLogo: { url: '' } });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const modalRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin') || path.startsWith('/superadmin')) {
      setIsAdminRoute(true);
      setLoading(false);
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [noticesRes, logosRes] = await Promise.all([
        noticesAPI.getNotices(),
        logoAPI.getHeaderLogos()
      ]);
      setNotices(noticesRes.data);
      setHeaderLogos(logosRes.data);
      
      if (noticesRes.data.length > 0 && !isAdminRoute) {
        setSelectedNotice(noticesRes.data[0]);
        setCurrentIndex(0);
        setShowModal(true);
        if (noticesRes.data[0].image) {
          getImageDimensions(noticesRes.data[0].image);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageDimensions = (imageUrl) => {
    const img = new Image();
    img.onload = () => {
      setImageDimensions({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = () => {
      setImageDimensions({ width: 0, height: 0 });
    };
    img.src = imageUrl;
  };

  const hasImage = (notice) => {
    return notice?.image && notice.image !== '' && notice.image !== null && notice.image !== undefined;
  };

  const downloadPDF = (notice) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add header with logos
    doc.setFillColor(31, 61, 43);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Title
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('Nepal National Ex-Army Association', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(201, 162, 39);
    doc.text('NOTICE', pageWidth / 2, 28, { align: 'center' });
    
    doc.setDrawColor(201, 162, 39);
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);
    
    // Notice content
    doc.setFontSize(12);
    doc.setTextColor(31, 61, 43);
    doc.text(`Title: ${notice.title}`, 15, 55);
    
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text(`Date: ${new Date(notice.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 15, 65);
    
    // Add image if exists
    let yPos = 80;
    if (hasImage(notice)) {
      try {
        const imgData = notice.image;
        const imgWidth = 170;
        const imgHeight = (imageDimensions.height / imageDimensions.width) * imgWidth;
        const maxHeight = 120;
        const finalHeight = Math.min(imgHeight, maxHeight);
        const finalWidth = (finalHeight / imgHeight) * imgWidth;
        
        doc.addImage(imgData, 'JPEG', (pageWidth - finalWidth) / 2, yPos, finalWidth, finalHeight);
        yPos += finalHeight + 15;
      } catch (e) {
        console.log('Image could not be added to PDF');
      }
    }
    
    // Content with wrapping
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    const splitText = doc.splitTextToSize(notice.content, pageWidth - 30);
    let contentY = yPos;
    splitText.forEach(line => {
      if (contentY > pageHeight - 30) {
        doc.addPage();
        contentY = 20;
      }
      doc.text(line, 15, contentY);
      contentY += 6;
    });
    
    // Footer
    doc.setDrawColor(201, 162, 39);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, pageHeight - 10);
    doc.text(`Notice ID: ${notice._id}`, pageWidth - 50, pageHeight - 10);
    
    doc.save(`notice-${notice.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  const navigateNotice = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % notices.length 
      : (currentIndex - 1 + notices.length) % notices.length;
    
    setCurrentIndex(newIndex);
    setSelectedNotice(notices[newIndex]);
    if (hasImage(notices[newIndex])) {
      getImageDimensions(notices[newIndex].image);
    } else {
      setImageDimensions({ width: 0, height: 0 });
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose();
      }
    };
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        navigateNotice('prev');
      } else if (e.key === 'ArrowRight') {
        navigateNotice('next');
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModal, currentIndex, notices]);

  if (loading || isAdminRoute || !showModal || !selectedNotice) return null;

  const hasImageValue = hasImage(selectedNotice);
  const imageSizeText = hasImageValue && imageDimensions.width > 0 
    ? `${imageDimensions.width} × ${imageDimensions.height} px` 
    : 'No image';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
      >
        {/* Header with Logos */}
        <div className="bg-gradient-to-r from-army to-army-dark p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-6">
              {/* Left Logo */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-gold/30 flex items-center justify-center">
                <img 
                  src={headerLogos?.leftLogo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo'} 
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Logo';
                  }}
                />
              </div>
              
              <div className="text-center">
                <h2 className="text-white font-bold text-lg font-display">
                  नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ
                </h2>
                <p className="text-gold text-xs font-medium tracking-wider">
                  Nepal National Ex-Army Association
                </p>
              </div>
              
              {/* Right Logo */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border-2 border-gold/30 flex items-center justify-center">
                <img 
                  src={headerLogos?.rightLogo?.url || 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Flag'} 
                  alt="Flag"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/60x60/1F3D2B/FFFFFF?text=Flag';
                  }}
                />
              </div>
            </div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Slider Navigation - Top */}
        {notices.length > 1 && (
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateNotice('prev')}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                title="Previous notice"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500">
                {currentIndex + 1} / {notices.length}
              </span>
              <button
                onClick={() => navigateNotice('next')}
                className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                title="Next notice"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="flex gap-1">
              {notices.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setSelectedNotice(notices[idx]);
                    if (hasImage(notices[idx])) {
                      getImageDimensions(notices[idx].image);
                    } else {
                      setImageDimensions({ width: 0, height: 0 });
                    }
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-6 bg-gold' 
                      : 'w-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Notice Content */}
        <div className="overflow-y-auto max-h-[calc(95vh-160px)]">
          {/* Notice Image - Fixed Size with Dimensions Display */}
          {hasImageValue ? (
            <div className="w-full bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100 relative">
              <div className="w-full max-w-3xl h-[350px] flex items-center justify-center overflow-hidden rounded-lg">
                <img 
                  ref={imageRef}
                  src={selectedNotice.image} 
                  alt={selectedNotice.title}
                  className="w-full h-full object-contain"
                  onLoad={(e) => {
                    const img = e.target;
                    setImageDimensions({
                      width: img.naturalWidth,
                      height: img.naturalHeight
                    });
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/800x400/1F3D2B/FFFFFF?text=Notice+Image';
                    setImageDimensions({ width: 0, height: 0 });
                  }}
                />
              </div>
              {/* Image Size Badge */}
              {imageDimensions.width > 0 && (
                <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Image className="h-3.5 w-3.5" />
                  {imageDimensions.width} × {imageDimensions.height} px
                </div>
              )}
            </div>
          ) : (
            <div className="w-full bg-gray-50 p-8 border-b border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <Image className="h-16 w-16 text-gray-300 mx-auto" />
                <p className="text-sm text-gray-400 mt-2">No image available for this notice</p>
              </div>
            </div>
          )}

          {/* Notice Details */}
          <div className="p-6">
            {/* Title and Metadata */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-army font-display">
                  {selectedNotice.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 text-gold" />
                    {new Date(selectedNotice.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Clock className="h-4 w-4 text-gold" />
                    {new Date(selectedNotice.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-gold/10 text-gold-dark px-2.5 py-1 rounded-full">
                    <FileText className="h-3 w-3" />
                    Notice
                  </span>
                  {hasImageValue && imageDimensions.width > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">
                      <Image className="h-3 w-3" />
                      {imageDimensions.width} × {imageDimensions.height}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none mt-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {selectedNotice.content}
                </p>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                <span className="font-medium">Notice ID:</span> {selectedNotice._id.substring(0, 12)}...
              </div>
              <div className="text-xs text-gray-400">
                <span className="font-medium">Status:</span> Active
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => downloadPDF(selectedNotice)}
            className="flex-1 bg-gold text-white py-2.5 rounded-lg hover:bg-gold-dark transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;