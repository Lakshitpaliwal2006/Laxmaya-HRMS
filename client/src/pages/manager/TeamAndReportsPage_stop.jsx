import React, { useState } from "react";
import { Users, FileText } from "lucide-react";

const TeamAndReportsPage = () => {
  const [activeNavigation, setActiveNavigation] = useState("my-team");

  const navigationItems = [
    { id: "my-team", label: "My Team", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 overflow-x-auto">
          {navigationItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeNavigation === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveNavigation(id)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#204A65] dark:text-[#7BA8C4]"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                <span
                  className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all ${
                    isActive ? "bg-[#204A65] dark:bg-[#7BA8C4]" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {activeNavigation === "my-team" ? <MyTeamPage /> : <EmployeeDirectoryPage />}
    </div>
  );
};

export default TeamAndReportsPage;
