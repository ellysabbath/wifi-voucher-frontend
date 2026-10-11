import type { Voucher } from '../types';
import { DURATION_LABELS } from '../types';

interface Props {
  vouchers: Voucher[];
}

export default function VoucherTable({ vouchers }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left">Msimbo</th>
            <th className="px-4 py-3 text-left">Muda</th>
            <th className="px-4 py-3 text-left">Data</th>
            <th className="px-4 py-3 text-left">Hali</th>
            <th className="px-4 py-3 text-left">Imechapishwa</th>
            <th className="px-4 py-3 text-left">Iliundwa</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                Hakuna vocha zilizopatikana
              </td>
            </tr>
          ) : (
            vouchers.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-semibold">{v.code}</td>
                <td className="px-4 py-3">{DURATION_LABELS[v.duration]}</td>
                <td className="px-4 py-3">{v.dataLimit}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      v.isUsed
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {v.isUsed ? 'Imetumika' : 'Haijatumika'}
                  </span>
                </td>
                <td className="px-4 py-3">{v.printed ? 'accept' : 'cancel'}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(v.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}