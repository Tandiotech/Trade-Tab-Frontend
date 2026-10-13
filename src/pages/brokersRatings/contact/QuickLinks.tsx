export default function QuickLinks() {
  return (
    <div className="w-full h-full mt-2">
    <div className=" bg-darkblack-700 p-8 rounded-lg shadow-lg">
      <h3 className="text-2xl font-semibold mb-6">Quick Links</h3>
      <ul className="list-disc list-inside text-gray-400 space-y-3">
        <li className="mb-2">
          <a href="#" className="text-blue-500 hover:underline">FAQs</a> - Find answers to common questions.
        </li>
        <li className="mb-2">
          <a href="#" className="text-blue-500 hover:underline">Support Center</a> - Get help and support.
        </li>
        <li className="mb-2">
          <a href="#" className="text-blue-500 hover:underline">Live Chat</a> - Chat with our support team.
        </li>
        <li className="mb-2">
          <a href="#" className="text-blue-500 hover:underline">Knowledge Base</a> - Explore detailed articles and guides.
        </li>
        <li className="mb-2">
          <a href="#" className="text-blue-500 hover:underline">Feedback</a> - Give us your feedback.
        </li>
      </ul>
    </div>
</div>
  )
}
