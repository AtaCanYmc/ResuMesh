import React, { useState, useEffect } from 'react';
import { Certificate } from '../types';
import axios from 'axios';
import { Loader2, Award, ExternalLink, Calendar } from 'lucide-react';

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await axios.get<Certificate[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/certificates/`);
        setCertificates(res.data);
      } catch (error) {
        console.error('Failed to fetch certificates', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Sertifikalar</h1>
        <p className="text-gray-400">Sahip olduğum lisanslar ve yetkinlik belgeleri.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col hover:border-gray-700 transition-colors">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-black border border-gray-800 flex items-center justify-center shrink-0">
                <Award className="text-blue-500" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100 leading-snug">{cert.name}</h3>
                <p className="text-sm text-gray-400 mt-1 font-medium">{cert.issuing_organization}</p>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                {cert.issue_date && (
                  <>
                    <Calendar size={14} />
                    <span>Issued {new Date(cert.issue_date).toLocaleDateString()}</span>
                  </>
                )}
              </div>
              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>View Credential</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        ))}
        {certificates.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
             Henüz sertifika eklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}
