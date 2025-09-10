export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Active Workflows</div>
          <div className="text-3xl font-bold">12</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Records Today</div>
          <div className="text-3xl font-bold">248</div>
        </div>
        <div className="bg-white border rounded-lg p-4">
          <div className="text-sm text-gray-500">Errors</div>
          <div className="text-3xl font-bold text-red-600">3</div>
        </div>
      </div>
    </div>
  )
}

