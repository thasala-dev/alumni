export default function AlumniDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header Card */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>

          {/* About Section */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>

          {/* Achievements */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>

          {/* Interests */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-32"></div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64"></div>

          {/* Work Information */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>

          {/* Education Information */}
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
        </div>
      </div>
    </div>
  );
}
