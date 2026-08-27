import React, { useState, useEffect, useRef } from 'react';
import { X, Download, FileText, Calendar, Image, Eye, Clock } from 'lucide-react';
import { noticesAPI, logoAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import jsPDF from 'jspdf';

const NoticeModal = () => {
  const { getLocalizedField, isNepali, language } = useLanguage();
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [headerLogos, setHeaderLogos] = useState({ leftLogo: { url: '' }, rightLogo: { url: '' } });
  const modalRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
      const [noticeRes, logosRes] = await Promise.all([
        noticesAPI.getModalNotice(),
        logoAPI.getHeaderLogos()
      ]);
      
      console.log('📥 Notice Response:', noticeRes);
      
      setHeaderLogos(logosRes.data);
      
      const noticeData = noticeRes?.data || noticeRes;
      
      if (noticeData && noticeData._id) {
        setSelectedNotice(noticeData);
        setShowModal(true);
        console.log('✅ Modal notice loaded:', noticeData.title);
      } else {
        console.log('ℹ️ No modal notice found');
        setShowModal(false);
      }
    } catch (error) {
      console.error('❌ Failed to load notice:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (notice) => {
    if (!notice) return;
    
    setPdfLoading(true);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // ============ HEADER ============
      doc.setDrawColor(201, 162, 39);
      doc.setLineWidth(1.5);
      doc.rect(10, 10, pageWidth - 20, 35);
      
      doc.setDrawColor(31, 61, 43);
      doc.setLineWidth(0.5);
      doc.line(10, 50, pageWidth - 10, 50);
      
      doc.setFontSize(16);
      doc.setTextColor(31, 61, 43);
      doc.text('Nepal National Ex-Army Association', pageWidth / 2, 23, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setTextColor(201, 162, 39);
      doc.text('NOTICE', pageWidth / 2, 35, { align: 'center' });
      
      let yPos = 60;
      
      if (notice.image && notice.image !== '') {
        try {
          const response = await fetch(notice.image);
          const blob = await response.blob();
          const reader = new FileReader();
          
          await new Promise((resolve) => {
            reader.onloadend = function() {
              const base64data = reader.result;
              const imgWidth = Math.min(160, pageWidth - 30);
              const imgHeight = Math.min(80, (imgWidth * 0.6));
              const xPos = (pageWidth - imgWidth) / 2;
              
              try {
                doc.addImage(base64data, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 10;
              } catch (imgError) {
                console.error('Error adding image to PDF:', imgError);
              }
              resolve();
            };
            reader.readAsDataURL(blob);
          });
        } catch (imgError) {
          console.error('Error loading image for PDF:', imgError);
        }
      }
      
      doc.setFontSize(14);
      doc.setTextColor(31, 61, 43);
      doc.text(`Title: ${notice.title}`, 15, yPos);
      yPos += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      const dateStr = new Date(notice.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      doc.text(`Date: ${dateStr}`, 15, yPos);
      yPos += 10;
      
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(15, yPos, pageWidth - 15, yPos);
      yPos += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(51, 51, 51);
      const splitText = doc.splitTextToSize(notice.content, pageWidth - 30);
      splitText.forEach(line => {
        if (yPos > pageHeight - 25) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, 15, yPos);
        yPos += 7;
      });
      
      doc.setDrawColor(201, 162, 39);
      doc.setLineWidth(0.5);
      doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, pageHeight - 6);
      doc.text(`Notice ID: ${notice._id}`, pageWidth - 45, pageHeight - 6);
      
      doc.save(`notice-${notice.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
    } catch (error) {
      console.error('PDF download error:', error);
      downloadFallback(notice);
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadFallback = (notice) => {
    const content = `
      ============================================
      NEPAL NATIONAL EX-ARMY ASSOCIATION
      ============================================
      
      NOTICE
      ============================================
      
      Title: ${notice.title}
      Date: ${new Date(notice.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
      
      ============================================
      
      ${notice.content}
      
      ============================================
      Generated: ${new Date().toLocaleString()}
      ============================================
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notice-${notice.title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasImage = (notice) => {
    return notice?.image && notice.image !== '' && notice.image !== null && notice.image !== undefined;
  };

  const handleClose = () => {
    setShowModal(false);
  };

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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
          <span className="text-gray-600">Loading notice...</span>
        </div>
      </div>
    );
  }

  if (isAdminRoute || !showModal || !selectedNotice) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[98vh] overflow-hidden shadow-2xl"
      >
        {/* Modern Header - Minimal & Clean */}
        <div className="relative bg-gradient-to-r from-army via-army-dark to-army px-6 py-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-all duration-300 hover:scale-110 z-10"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center justify-center gap-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-gold/30 flex items-center justify-center flex-shrink-0">
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
              <h2 className="text-white font-bold text-base font-display tracking-wide">
                नेपाल राष्ट्रिय भूतपूर्व सैनिक संघ
              </h2>
              <p className="text-gold text-[10px] font-medium tracking-[0.2em] uppercase">
                Nepal National Ex-Army Association
              </p>
            </div>
            
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 border-2 border-gold/30 flex items-center justify-center flex-shrink-0">
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
        </div>

        {/* Main Content - Photo Centric Design */}
        <div className="overflow-y-auto max-h-[calc(98vh-140px)]">
          {/* Image Section - Auto Adjusting Size */}
          {hasImage(selectedNotice) ? (
            <div className="relative bg-gradient-to-b from-gray-50 to-white p-4">
              <div className="relative max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="animate-pulse flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                        <div className="h-2 w-24 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  )}
                  <img 
                    src={selectedNotice.image} 
                    alt={selectedNotice.title}
                    className={`w-full h-auto max-h-[70vh] object-contain transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/1200x600/1F3D2B/FFFFFF?text=Notice+Image';
                      setImageLoaded(true);
                    }}
                  />
                </div>
                {/* Image Badge */}
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <Image className="h-3.5 w-3.5" />
                  Notice Image
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-b from-gray-50 to-white p-8 flex items-center justify-center">
              <div className="text-center py-12">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Image className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-medium">No image available for this notice</p>
              </div>
            </div>
          )}

          {/* Content Section - Clean Typography */}
          <div className="px-6 py-6">
            <div className="max-w-4xl mx-auto">
              {/* Title & Meta */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-army font-display leading-tight">
                    {getLocalizedField(selectedNotice, 'title') || selectedNotice.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 text-gold" />
                      {new Date(selectedNotice.date).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 text-gold" />
                      {new Date(selectedNotice.date).toLocaleTimeString(isNepali ? 'ne-NP' : 'en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs bg-gold/10 text-gold-dark px-3 py-1 rounded-full font-medium">
                      <FileText className="h-3 w-3" />
                      Official Notice
                    </span>
                  </div>
                </div>
              </div>

              {/* Content - Enhanced Readability */}
              <div className="prose max-w-none">
                <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100/80 hover:border-gray-200 transition-colors">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {getLocalizedField(selectedNotice, 'content') || selectedNotice.content}
                  </p>
                </div>
              </div>

              {/* Footer Meta - Views Hidden */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="font-medium text-gray-500">Notice ID:</span>
                  <span className="font-mono bg-gray-50 px-2 py-0.5 rounded">
                    {selectedNotice._id.substring(0, 16)}...
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Mini Size */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-6 py-3">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => downloadPDF(selectedNotice)}
              disabled={pdfLoading}
              className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-white py-2 px-4 rounded-lg hover:shadow-lg hover:shadow-gold/20 transition-all duration-300 flex items-center justify-center gap-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pdfLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-1.5 text-sm font-medium"
            >
              <Eye className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;