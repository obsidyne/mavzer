import Navbar from "../components/Navbar";

const CLIENTS = [
  { name: "Client 1", logo: "/client1.webp" },
  { name: "Client 2", logo: "/client2.webp" },
  { name: "Client 3", logo: "/client3.webp" },
  { name: "Client 4", logo: "/client4.webp" },
];

export default function ReferencesPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fa]">
      <Navbar />

      {/* Header */}
      <div className="pt-[66px] bg-white border-b border-[#dde4ef]">
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-[#1e88e5] mb-2">
            <span className="block w-5 h-px bg-[#1e88e5]" />
            Referanslarımız
          </div>
          <h1 className="font-condensed text-[36px] font-extrabold uppercase text-[#071e3d] leading-tight tracking-wide">
            Müşterilerimiz
          </h1>
          <p className="text-[13px] text-[#9aa3af] mt-1">
            Birlikte çalışmaktan gurur duyduğumuz markalar.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {CLIENTS.map((client) => (
            <div
              key={client.name}
              className="bg-white rounded-xl border border-[#dde4ef] flex items-center justify-center p-8 hover:shadow-[0_4px_24px_rgba(7,30,61,0.08)] hover:border-[#0a4c8a]/20 transition-all duration-200"
              style={{ aspectRatio: '3/2' }}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}