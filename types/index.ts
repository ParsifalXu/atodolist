export interface Task {
  id: string
  title: string
  completed: boolean
  priority: "high" | "medium" | "low"
  due_date?: string
  project_id?: string
  project?: Project
  user_id: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  color: string
  user_id: string
  created_at: string
  updated_at: string
}

