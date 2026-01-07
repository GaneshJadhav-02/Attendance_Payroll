import { useEffect, useState } from "react";
import {
  Building2,
  Users,
  CalendarCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { useAppSelector } from "../store/hooks.js";

// Demo data for statistics
const stats = [
  {
    label: "Total Companies",
    value: 12,
    change: "+2",
    trend: "up",
    icon: Building2,
    color: "bg-primary/10 text-primary",
  },
  {
    label: "Total Employees",
    value: 847,
    change: "+24",
    trend: "up",
    icon: Users,
    color: "bg-success/10 text-success",
  },
  {
    label: "Present Today",
    value: 756,
    change: "89%",
    trend: "up",
    icon: CalendarCheck,
    color: "bg-warning/10 text-warning",
  },
  {
    label: "Avg. Attendance",
    value: "92%",
    change: "+3%",
    trend: "up",
    icon: TrendingUp,
    color: "bg-accent/10 text-accent",
  },
];

// Demo recent activity
const recentActivity = [
  {
    id: 1,
    action: "Attendance marked",
    company: "TechCorp Inc.",
    employees: 45,
    time: "2 mins ago",
  },
  {
    id: 2,
    action: "New employee added",
    company: "StartUp Labs",
    employees: 1,
    time: "15 mins ago",
  },
  {
    id: 3,
    action: "Report generated",
    company: "Global Solutions",
    employees: 120,
    time: "1 hour ago",
  },
  {
    id: 4,
    action: "Company added",
    company: "Innovation Hub",
    employees: 0,
    time: "2 hours ago",
  },
  {
    id: 5,
    action: "Attendance marked",
    company: "Digital Dynamics",
    employees: 78,
    time: "3 hours ago",
  },
];

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">
                Welcome back, {user?.name || "Admin"}!
              </h1>
              <p className="page-subtitle">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-sm text-muted-foreground">Current Time</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="stat-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 card-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CalendarCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {activity.company} •{" "}
                      {activity.employees > 0 &&
                        `${activity.employees} employees`}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card-elevated p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Attendance Overview
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-success/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Present
                  </span>
                  <span className="text-lg font-bold text-success">756</span>
                </div>
                <div className="w-full h-2 bg-success/20 rounded-full">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: "89%" }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-warning/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Late
                  </span>
                  <span className="text-lg font-bold text-warning">42</span>
                </div>
                <div className="w-full h-2 bg-warning/20 rounded-full">
                  <div
                    className="h-full bg-warning rounded-full"
                    style={{ width: "5%" }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-destructive/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Absent
                  </span>
                  <span className="text-lg font-bold text-destructive">49</span>
                </div>
                <div className="w-full h-2 bg-destructive/20 rounded-full">
                  <div
                    className="h-full bg-destructive rounded-full"
                    style={{ width: "6%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
