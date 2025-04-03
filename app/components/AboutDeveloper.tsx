import { X, Linkedin } from 'lucide-react';
import Image from 'next/image';

interface AboutDeveloperProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutDeveloper({ isOpen, onClose }: AboutDeveloperProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-blue-100">
              <Image
                src="/images/profile.jpg"
                alt="Mustafa Saifee"
                fill
                className="object-cover"
                priority
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Mustafa Saifee</h2>
            <p className="text-gray-600 text-sm">Carnegie Mellon Graduate</p>
          </div>

          <div className="space-y-4 text-gray-600">
            <p>
              A graduate from Carnegie Mellon who studied Software Management with a focus on Product Management concentration. With experience working at Microsoft and AWS, Mustafa is passionate about guiding students towards product management.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <a
              href="https://www.linkedin.com/in/saifeemustafa/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              <Linkedin size={20} />
              <span className="font-medium">Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 