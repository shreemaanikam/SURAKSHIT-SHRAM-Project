import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Camera, MapPin, CheckCircle2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface CameraEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoUrl: string, observationNote?: string) => void;
  clauseTitle?: string;
}

export const CameraEvidenceModal: React.FC<CameraEvidenceModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  clauseTitle,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [observation, setObservation] = useState('');
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  // Pre-curated realistic inspection evidence stock
  const sampleEvidencePhotos = [
    {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      label: 'Machinery Safety Guard & Stop Switch Inspection',
    },
    {
      url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      label: 'Ventilation Hood & Chemical Fume Exhaust Inspection',
    },
    {
      url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
      label: 'Shopfloor Muster Register & Shift Roster Verification',
    },
    {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
      label: 'PPE & Emergency First-Aid Station Inspection',
    },
  ];

  const handleSnapPhoto = (url: string) => {
    setIsSimulatingCamera(true);
    setTimeout(() => {
      setCapturedImage(url);
      setIsSimulatingCamera(false);
    }, 400);
  };

  const handleConfirm = () => {
    if (!capturedImage) return;
    onCapture(capturedImage, observation);
    setCapturedImage(null);
    setObservation('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-amber-600" />
          <span>Geo-Tagged Evidence Camera</span>
        </div>
      }
      subtitle={clauseTitle || 'Capture live on-site inspection proof'}
    >
      <div className="space-y-4">
        {/* GPS Geotag metadata strip */}
        <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>GPS: 18.7561° N, 73.8441° E (Acc: ±3.8m)</span>
          </div>
          <span className="text-slate-400">{new Date().toLocaleTimeString()}</span>
        </div>

        {/* Viewfinder / Capture Area */}
        {!capturedImage ? (
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">
              Select or snap inspection scene evidence:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {sampleEvidencePhotos.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSnapPhoto(item.url)}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-4/3 cursor-pointer hover:border-amber-500 hover:shadow-md transition-all"
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2.5">
                    <p className="text-[11px] text-white font-medium leading-tight">{item.label}</p>
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-300 aspect-video bg-black">
              <img
                src={capturedImage}
                alt="Captured evidence"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] flex items-center justify-between font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Pune Industrial Zone • On-Site Verified
                </span>
                <span>{new Date().toISOString().substring(0, 10)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Finding / Inspector Observation Note
              </label>
              <textarea
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="e.g. Broken exhaust duct seal observed on machine #4; requires maintenance..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          {capturedImage ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCapturedImage(null)}
            >
              Retake Photo
            </Button>
          ) : (
            <span className="text-xs text-slate-500">Tap any scene to capture</span>
          )}

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            {capturedImage && (
              <Button
                size="sm"
                onClick={handleConfirm}
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Attach Evidence
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
