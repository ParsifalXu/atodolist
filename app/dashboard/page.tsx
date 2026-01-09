"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"

interface Task {
  id: string
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  due_date?: string
  project_id?: string
  project?: {
    name: string
    color: string
  }
}

interface Project {
  id: string
  name: string
  color: string
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createSupabaseClient()

  useEffect(() => {
    checkUser()
    loadTasks()
    loadProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      router.push("/login")
    } else {
      setUser(session.user)
    }
  }

  const loadTasks = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase
      .from("todos")
      .select("*, project:projects(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error loading tasks:", error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  const loadProjects = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", session.user.id)

    if (error) {
      console.error("Error loading projects:", error)
    } else {
      setProjects(data || [])
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) return

    const { data, error } = await supabase
      .from("todos")
      .insert({
        title: newTaskTitle,
        user_id: session.user.id,
        priority: "low",
        completed: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error adding task:", error)
    } else {
      setTasks([data, ...tasks])
      setNewTaskTitle("")
    }
  }

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", taskId)

    if (error) {
      console.error("Error updating task:", error)
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !completed } : task
        )
      )
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", taskId)

    if (error) {
      console.error("Error deleting task:", error)
    } else {
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const todayTasks = tasks.filter((task) => !task.completed)
  const highPriorityTasks = todayTasks.filter((task) => task.priority === "high")
  const otherTasks = todayTasks.filter((task) => task.priority !== "high")

  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ")[0]
    }
    return user?.email?.split("@")[0] || "User"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-[#0d121b] dark:text-slate-200 mesh-gradient">
      {/* Sidebar Navigation */}
      <aside className="w-72 flex-shrink-0 border-r border-[#e7ebf3] dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          {/* User Profile & Logo */}
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight dark:text-white">
                TaskMaster
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Workspace Individual
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[22px]">inbox</span>
              <span className="text-sm font-medium">Inbox</span>
              <span className="ml-auto text-xs font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {todayTasks.length}
              </span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[22px] fill-1">
                calendar_today
              </span>
              <span className="text-sm font-bold">Today</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[22px]">event</span>
              <span className="text-sm font-medium">Upcoming</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
              <span className="text-sm font-medium">Completed</span>
            </a>
          </nav>

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Projects
              </span>
              <button className="text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {projects.map((project) => (
                <a
                  key={project.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  href="#"
                >
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  ></div>
                  <span className="text-sm font-medium">{project.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Bottom */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-xs font-bold text-primary mb-1">Pro Plan</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
              Get unlimited projects and AI insights.
            </p>
            <Button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-blue-700">
              Upgrade
            </Button>
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {getUserName().charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate dark:text-white">
                {getUserName()}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Header Top Bar */}
        <header className="h-16 flex items-center justify-between px-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-[#e7ebf3] dark:border-slate-800 sticky top-0 z-10">
          <div className="flex items-center gap-4 w-1/3">
            <label className="flex flex-col w-full max-w-md">
              <div className="flex w-full items-stretch rounded-lg h-10 group">
                <div className="text-slate-400 flex items-center justify-center pl-3 pr-2">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <Input
                  className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400 dark:text-white"
                  placeholder="Search tasks or commands..."
                />
              </div>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-10 py-12 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {/* Greeting Section */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold tracking-tight text-[#0d121b] dark:text-white mb-2">
                Good {new Date().getHours() < 12 ? "morning" : "afternoon"}, {getUserName()}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-base">
                  calendar_month
                </span>
                <span className="text-lg font-medium">
                  {format(new Date(), "EEEE, MMMM do")}
                </span>
              </div>
            </div>

            {/* Add Task Input */}
            <div className="mb-10">
              <form
                onSubmit={handleAddTask}
                className="group relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200"
              >
                <div className="pl-4 pr-3 text-primary">
                  <span className="material-symbols-outlined">add_circle</span>
                </div>
                <Input
                  className="flex-1 border-none focus:ring-0 bg-transparent py-3 text-base placeholder:text-slate-400 dark:text-white"
                  placeholder="What's on your mind? Add a task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <div className="flex items-center gap-2 pr-2">
                  <Button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow-md hover:bg-blue-700"
                  >
                    Add Task
                  </Button>
                </div>
              </form>
            </div>

            {/* Task Groups */}
            <div className="space-y-8">
              {/* High Priority Section */}
              {highPriorityTasks.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Priority Focus
                    </h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  <div className="grid gap-3">
                    {highPriorityTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() => handleToggleTask(task.id, task.completed)}
                          className="size-6 rounded-full border-2 border-red-500/30 flex items-center justify-center group-hover:bg-red-500/10 transition-colors"
                        >
                          {task.completed && (
                            <span className="material-symbols-outlined text-[14px] text-red-500">
                              check
                            </span>
                          )}
                        </button>
                        <div className="flex-1">
                          <h4
                            className={`text-base font-semibold text-[#0d121b] dark:text-white ${
                              task.completed ? "line-through opacity-50" : ""
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.project && (
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-sm">
                                  folder
                                </span>
                                {task.project.name}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-red-500 font-bold bg-red-50/50 dark:bg-red-500/10 px-2 py-0.5 rounded-md">
                                <span className="material-symbols-outlined text-[14px] fill-1">
                                  priority_high
                                </span>
                                High
                              </span>
                            </div>
                          )}
                        </div>
                        {task.due_date && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-400">
                              {format(new Date(task.due_date), "h:mm a")}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Standard Section */}
              {otherTasks.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Upcoming Today
                    </h3>
                    <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800"></div>
                  </div>
                  <div className="grid gap-3">
                    {otherTasks.map((task) => (
                      <div
                        key={task.id}
                        className="group flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <button
                          onClick={() => handleToggleTask(task.id, task.completed)}
                          className="size-6 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary/10 transition-colors"
                        >
                          {task.completed && (
                            <span className="material-symbols-outlined text-[14px] text-primary">
                              check
                            </span>
                          )}
                        </button>
                        <div className="flex-1">
                          <h4
                            className={`text-base font-medium text-slate-600 dark:text-slate-300 ${
                              task.completed ? "line-through opacity-50" : ""
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.project && (
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="material-symbols-outlined text-sm">
                                  folder
                                </span>
                                {task.project.name}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                {task.priority === "medium" ? "Medium" : "Low"}
                              </span>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">
                            delete
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {tasks.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">
                    No tasks yet. Add your first task above!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}
          className="fixed bottom-8 right-8 size-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-20 group"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Add New Task
          </span>
        </button>
      </main>
    </div>
  )
}

