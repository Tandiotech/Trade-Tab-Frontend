import { BsFillPatchCheckFill } from "react-icons/bs";

// Función para calcular el tiempo relativo
const formatRelativeTime = (mongoDate: string) => {
  if (!mongoDate) return "1 day ago"; // Valor por defecto si no hay fecha

  const date = new Date(mongoDate);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 }, // 365 días
    { name: "month", seconds: 2592000 }, // 30 días
    { name: "week", seconds: 604800 }, // 7 días
    { name: "day", seconds: 86400 }, // 24 horas
    { name: "hour", seconds: 3600 }, // 60 minutos
    { name: "minute", seconds: 60 }, // 60 segundos
    { name: "second", seconds: 1 }, // 1 segundo
  ];

  for (const unit of units) {
    if (diffInSeconds >= unit.seconds) {
      const value = Math.floor(diffInSeconds / unit.seconds);
      return `${value} ${unit.name}${value > 1 ? "s" : ""} ago`;
    }
  }

  return "just now"; // Si es menos de un segundo
};

export default function SubCommentForum({ comment }: { comment: any }) {
  return (
    <div className="p-2 rounded-md bg-slate-700">
      <div className="text-gray-200">
        {comment.admin && <BsFillPatchCheckFill className="text-teal-500" />}

        <div className="flex space-x-2">
          <span className="block font-semibold">
            {comment.userName || "Anonymous"}
          </span>
          <span className="block">
            {formatRelativeTime(comment.createdAt)} •
          </span>
        </div>

        <span>{comment.content}</span>
      </div>
    </div>
  );
}
