import React from "react";

const Certificate = ({ ImgSertif, title, issuer, onClick }) => {
  return (
    <div onClick={onClick} className="group relative w-full cursor-pointer">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 hover:scale-[1.02]">
        {/* Efek gradient latar belakang saat di-hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-5 z-10">
          {/* Container Gambar Sertifikat */}
          <div className="relative overflow-hidden rounded-lg aspect-[16/11] bg-slate-950/50 flex items-center justify-center">
            <img
              src={ImgSertif}
              alt={title || "Certificate"}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Informasi Sertifikat (Opsional jika ingin ditampilkan teksnya) */}
          {(title || issuer) && (
            <div className="mt-4 space-y-1">
              {title && (
                <h3 className="text-base font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent line-clamp-1">
                  {title}
                </h3>
              )}
              {issuer && (
                <p className="text-gray-400 text-xs tracking-wide">{issuer}</p>
              )}
            </div>
          )}

          {/* Border Glow saat hover */}
          <div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
