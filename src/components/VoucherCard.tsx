import type { Voucher } from '../types';
import { DURATION_LABELS } from '../types';

interface Props {
  voucher: Voucher;
}

export default function VoucherCard({ voucher }: Props) {
  return (
    <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 bg-white w-72 voucher-print">
      <div className="text-center border-b pb-2 mb-3">
        <h3 className="font-bold text-lg text-primary">WiFi Voucher</h3>
        <p className="text-xs text-gray-500">Kadi yako ya mtandao</p>
      </div>
      <div className="text-center mb-3">
        <p className="text-xs text-gray-500 mb-1">Msimbo wa kuingia</p>
        <p className="font-mono font-bold text-xl tracking-wider">{voucher.code}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Muda</p>
          <p className="font-semibold">{DURATION_LABELS[voucher.duration]}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Data</p>
          <p className="font-semibold">{voucher.dataLimit}</p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t text-xs text-gray-600">
        <p>1. Jiunge na WiFi</p>
        <p>2. Fungua browser</p>
        <p>3. Ingiza msimbo hapo juu</p>
      </div>
    </div>
  );
}