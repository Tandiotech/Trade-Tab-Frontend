export default function PDFTableHead() {
  return (
    <thead className="bg-success-200  text-darkblack-700 font-semibold">
      <tr>
        <th className="border p-2 text-center border-darkblack-300 rounded-tl-sm ">Ticket</th>
        <th className="border p-2 text-center border-darkblack-300">Open Time</th>
        <th className="border p-2 text-center border-darkblack-300">Type</th>
        <th className="border p-2 text-center border-darkblack-300">Size</th>
        <th className="border p-2 text-center border-darkblack-300">Item</th>
        <th className="border p-2 text-center border-darkblack-300">Open Price</th>
        <th className="border p-2 text-center border-darkblack-300">S/L</th>
        <th className="border p-2 text-center border-darkblack-300">T/P</th>
        <th className="border p-2 text-center border-darkblack-300">Close Time</th>
        <th className="border p-2 text-center border-darkblack-300">Close Price</th>
        <th className="border p-2 text-center border-darkblack-300">Commission</th>
        <th className="border p-2 text-center border-darkblack-300">R/O Swap</th>
        <th className="border p-2 text-center border-darkblack-300  rounded-tr-sm">Trade P/l</th>
      </tr>
    </thead>
  );
}
