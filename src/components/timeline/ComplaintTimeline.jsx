export default function ComplaintTimeline({ timeline }) {
  return (
    <div className="border-l-2 border-gray-300 pl-4 space-y-4">
      {timeline.map((item, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-2 top-1 w-3 h-3 bg-blue-500 rounded-full"></div>

          <div>
            <p className="font-semibold">
              {item.status}
            </p>
            <p className="text-sm text-gray-600">
              {item.remark}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(item.date).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
