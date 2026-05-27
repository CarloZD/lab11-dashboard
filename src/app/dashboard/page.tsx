"use client"

import { useMemo, useState } from "react"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Project = {
  id: string
  name: string
  description: string
  members: string[]
  status: string
}

type TeamMember = {
  id: string
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate?: Date
  phone: string
  projectId: string
  isActive: boolean
}

type Task = {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  deadline?: Date
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "P001",
      name: "Sistema Web Académico",
      description: "Aplicación para gestionar cursos y estudiantes.",
      members: ["Carlos Ruiz"],
      status: "Activo",
    },
    {
      id: "P002",
      name: "Dashboard Empresarial",
      description: "Panel de control con métricas internas.",
      members: ["Ana Torres"],
      status: "En proceso",
    },
  ])

  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "M001",
      userId: "U001",
      role: "Administrador",
      name: "Carlos Ruiz",
      email: "carlos@email.com",
      position: "Frontend Developer",
      birthdate: new Date("2005-04-12"),
      phone: "999888777",
      projectId: "P001",
      isActive: true,
    },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "T001",
      description: "Diseñar interfaz principal",
      projectId: "P001",
      status: "Completada",
      priority: "Alta",
      userId: "U001",
      deadline: new Date("2026-05-30"),
    },
    {
      id: "T002",
      description: "Crear formulario de proyectos",
      projectId: "P001",
      status: "Pendiente",
      priority: "Media",
      userId: "U001",
      deadline: new Date("2026-06-02"),
    },
    {
      id: "T003",
      description: "Agregar tabla de tareas",
      projectId: "P002",
      status: "En proceso",
      priority: "Alta",
      userId: "U001",
      deadline: new Date("2026-06-05"),
    },
  ])

  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectMember, setProjectMember] = useState("")

  const [editingMemberId, setEditingMemberId] = useState("")
  const [memberForm, setMemberForm] = useState({
    userId: "",
    role: "",
    name: "",
    email: "",
    position: "",
    phone: "",
    projectId: "P001",
    isActive: true,
  })
  const [memberBirthdate, setMemberBirthdate] = useState<Date | undefined>()

  const [editingTaskId, setEditingTaskId] = useState("")
  const [taskForm, setTaskForm] = useState({
    description: "",
    projectId: "P001",
    status: "Pendiente",
    priority: "Media",
    userId: "U001",
  })
  const [taskDeadline, setTaskDeadline] = useState<Date | undefined>()

  const [taskPage, setTaskPage] = useState(1)
  const tasksPerPage = 3

  const [settings, setSettings] = useState({
    company: "Tecsup",
    email: "admin@tecsup.edu.pe",
    notifications: true,
    theme: "Azul",
  })

  const completedTasks = tasks.filter((task) => task.status === "Completada").length
  const pendingTasks = tasks.filter((task) => task.status !== "Completada").length

  const paginatedTasks = useMemo(() => {
    const start = (taskPage - 1) * tasksPerPage
    return tasks.slice(start, start + tasksPerPage)
  }, [tasks, taskPage])

  const totalTaskPages = Math.max(1, Math.ceil(tasks.length / tasksPerPage))

  const showAlert = (message: string) => {
    setAlertMessage(message)
    setTimeout(() => setAlertMessage(""), 3000)
  }

  const simulateRequest = (callback: () => void) => {
    setLoading(true)

    setTimeout(() => {
      callback()
      setLoading(false)
    }, 700)
  }

  const addProject = () => {
    if (!projectName || !projectDescription || !projectMember) {
      showAlert("Completa el nombre, descripción y miembro del proyecto.")
      return
    }

    simulateRequest(() => {
      const newProject: Project = {
        id: `P${Date.now()}`,
        name: projectName,
        description: projectDescription,
        members: [projectMember],
        status: "Activo",
      }

      setProjects([...projects, newProject])
      setProjectName("")
      setProjectDescription("")
      setProjectMember("")
      showAlert("Proyecto creado correctamente.")
    })
  }

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    showAlert("Proyecto eliminado correctamente.")
  }

  const saveMember = () => {
    if (!memberForm.userId || !memberForm.name || !memberForm.email || !memberForm.role) {
      showAlert("Completa los campos principales del miembro.")
      return
    }

    simulateRequest(() => {
      if (editingMemberId) {
        setTeam(
          team.map((member) =>
            member.id === editingMemberId
              ? { ...member, ...memberForm, birthdate: memberBirthdate }
              : member
          )
        )
        setEditingMemberId("")
        showAlert("Miembro actualizado correctamente.")
      } else {
        const newMember: TeamMember = {
          id: `M${Date.now()}`,
          ...memberForm,
          birthdate: memberBirthdate,
        }

        setTeam([...team, newMember])
        showAlert("Miembro agregado correctamente.")
      }

      setMemberForm({
        userId: "",
        role: "",
        name: "",
        email: "",
        position: "",
        phone: "",
        projectId: projects[0]?.id || "",
        isActive: true,
      })
      setMemberBirthdate(undefined)
    })
  }

  const editMember = (member: TeamMember) => {
    setEditingMemberId(member.id)
    setMemberForm({
      userId: member.userId,
      role: member.role,
      name: member.name,
      email: member.email,
      position: member.position,
      phone: member.phone,
      projectId: member.projectId,
      isActive: member.isActive,
    })
    setMemberBirthdate(member.birthdate)
  }

  const deleteMember = (id: string) => {
    setTeam(team.filter((member) => member.id !== id))
    showAlert("Miembro eliminado correctamente.")
  }

  const saveTask = () => {
    if (!taskForm.description || !taskForm.projectId || !taskForm.userId) {
      showAlert("Completa la descripción, proyecto y usuario de la tarea.")
      return
    }

    simulateRequest(() => {
      if (editingTaskId) {
        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId
              ? { ...task, ...taskForm, deadline: taskDeadline }
              : task
          )
        )
        setEditingTaskId("")
        showAlert("Tarea actualizada correctamente.")
      } else {
        const newTask: Task = {
          id: `T${Date.now()}`,
          ...taskForm,
          deadline: taskDeadline,
        }

        setTasks([...tasks, newTask])
        showAlert("Tarea creada correctamente.")
      }

      setTaskForm({
        description: "",
        projectId: projects[0]?.id || "",
        status: "Pendiente",
        priority: "Media",
        userId: team[0]?.userId || "",
      })
      setTaskDeadline(undefined)
    })
  }

  const editTask = (task: Task) => {
    setEditingTaskId(task.id)
    setTaskForm({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
    })
    setTaskDeadline(task.deadline)
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    showAlert("Tarea eliminada correctamente.")
  }

  const saveSettings = () => {
    simulateRequest(() => {
      showAlert("Configuración guardada correctamente.")
    })
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-blue-700 to-cyan-600 p-8 text-white shadow">
          <h1 className="text-4xl font-bold">Dashboard de Proyectos</h1>
          <p className="mt-2 text-blue-100">
            Gestión de proyectos, equipo, tareas y configuración con shadcn/ui.
          </p>
        </div>

        {alertMessage && (
          <Alert className="border-blue-300 bg-blue-50">
            <AlertTitle>Mensaje del sistema</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="flex items-center gap-2 rounded-lg border bg-white p-3 shadow-sm">
            <Spinner className="text-blue-600" />
            <span className="text-sm text-slate-600">Simulando petición al backend...</span>
          </div>
        )}

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="team">Equipo</TabsTrigger>
            <TabsTrigger value="tasks">Tareas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos</CardTitle>
                  <CardDescription>Total registrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{projects.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Miembros</CardTitle>
                  <CardDescription>Equipo activo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{team.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tareas</CardTitle>
                  <CardDescription>Total creadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{tasks.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pendientes</CardTitle>
                  <CardDescription>Tareas no completadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">{pendingTasks}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumen general</CardTitle>
                <CardDescription>Métricas calculadas desde los datos en memoria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Tareas completadas: {completedTasks}</p>
                <p>Tareas pendientes o en proceso: {pendingTasks}</p>
                <p>Configuración actual: tema {settings.theme}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Proyectos</CardTitle>
                <CardDescription>Crear, ver detalles y eliminar proyectos.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Nombre del proyecto</Label>
                    <Input
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Ej: Sistema de ventas"
                    />
                  </div>

                  <div>
                    <Label>Descripción</Label>
                    <Input
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      placeholder="Breve descripción"
                    />
                  </div>

                  <div>
                    <Label>Miembro</Label>
                    <Input
                      value={projectMember}
                      onChange={(e) => setProjectMember(e.target.value)}
                      placeholder="Nombre del miembro"
                    />
                  </div>
                </div>

                <Button onClick={addProject}>Crear proyecto</Button>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <Badge>{project.status}</Badge>

                        <p className="text-sm text-slate-600">
                          Miembros: {project.members.join(", ")}
                        </p>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">Ver detalles</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>{project.name}</DialogTitle>
                                <DialogDescription>{project.description}</DialogDescription>
                              </DialogHeader>

                              <div className="space-y-2">
                                <p>ID: {project.id}</p>
                                <p>Estado: {project.status}</p>
                                <p>Miembros: {project.members.join(", ")}</p>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="destructive" onClick={() => deleteProject(project.id)}>
                            Eliminar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Gestión del Equipo</CardTitle>
                <CardDescription>CRUD de miembros del equipo.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>User ID</Label>
                    <Input
                      value={memberForm.userId}
                      onChange={(e) => setMemberForm({ ...memberForm, userId: e.target.value })}
                    />
                  </div>

                    <div>
                    <Label>Rol</Label>
                    <Select
                        value={memberForm.role}
                        onValueChange={(value) =>
                        setMemberForm({ ...memberForm, role: value })
                        }
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Administrador">Administrador</SelectItem>
                        <SelectItem value="Desarrollador">Desarrollador</SelectItem>
                        <SelectItem value="Diseñador">Diseñador</SelectItem>
                        <SelectItem value="Tester">Tester</SelectItem>
                        <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={memberForm.name}
                      onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                      placeholder="Nombre completo"
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      placeholder="correo@email.com"
                    />
                  </div>

                    <div>
                    <Label>Cargo</Label>
                    <Select
                        value={memberForm.position}
                        onValueChange={(value) =>
                        setMemberForm({ ...memberForm, position: value })
                        }
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cargo" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                        <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                        <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                        <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                        <SelectItem value="QA Tester">QA Tester</SelectItem>
                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      value={memberForm.phone}
                      onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Proyecto</Label>
                    <Select
                      value={memberForm.projectId}
                      onValueChange={(value) =>
                        setMemberForm({ ...memberForm, projectId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={memberForm.isActive}
                      onCheckedChange={(checked) =>
                        setMemberForm({ ...memberForm, isActive: checked })
                      }
                    />
                    <Label>Miembro activo</Label>
                  </div>
                </div>

                <div>
                <Label>Fecha de nacimiento</Label>
                <Input
                    type="date"
                    value={
                    memberBirthdate
                        ? memberBirthdate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                    const value = e.target.value
                    setMemberBirthdate(value ? new Date(`${value}T00:00:00`) : undefined)
                    }}
                />
                </div>

                <Button onClick={saveMember}>
                  {editingMemberId ? "Actualizar miembro" : "Agregar miembro"}
                </Button>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {team.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.userId}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>
                          <Badge variant={member.isActive ? "secondary" : "outline"}>
                            {member.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" onClick={() => editMember(member)}>
                            Editar
                          </Button>
                          <Button variant="destructive" onClick={() => deleteMember(member.id)}>
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Tareas</CardTitle>
                <CardDescription>CRUD de tareas con Calendar y Pagination.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Descripción</Label>
                    <Input
                      value={taskForm.description}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, description: e.target.value })
                      }
                      placeholder="Descripción de la tarea"
                    />
                  </div>

                  <div>
                    <Label>Proyecto</Label>
                    <Select
                      value={taskForm.projectId}
                      onValueChange={(value) => setTaskForm({ ...taskForm, projectId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Proyecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Usuario</Label>
                    <Select
                      value={taskForm.userId}
                      onValueChange={(value) => setTaskForm({ ...taskForm, userId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {team.map((member) => (
                          <SelectItem key={member.id} value={member.userId}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Estado</Label>
                    <Select
                      value={taskForm.status}
                      onValueChange={(value) => setTaskForm({ ...taskForm, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En proceso">En proceso</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Prioridad</Label>
                    <Select
                      value={taskForm.priority}
                      onValueChange={(value) => setTaskForm({ ...taskForm, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Fecha límite</Label>
                  <Calendar
                    mode="single"
                    selected={taskDeadline}
                    onSelect={setTaskDeadline}
                    className="mt-2 rounded-md border"
                  />
                </div>

                <Button onClick={saveTask}>
                  {editingTaskId ? "Actualizar tarea" : "Crear tarea"}
                </Button>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Prioridad</TableHead>
                      <TableHead>Fecha límite</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell>{task.description}</TableCell>
                        <TableCell>
                          <Badge variant={task.status === "Completada" ? "secondary" : "outline"}>
                            {task.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{task.priority}</TableCell>
                        <TableCell>
                          {task.deadline
                            ? task.deadline.toLocaleDateString("es-PE")
                            : "Sin fecha"}
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" onClick={() => editTask(task)}>
                            Editar
                          </Button>
                          <Button variant="destructive" onClick={() => deleteTask(task.id)}>
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setTaskPage((page) => Math.max(1, page - 1))
                        }}
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <span className="px-4 text-sm">
                        Página {taskPage} de {totalTaskPages}
                      </span>
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setTaskPage((page) => Math.min(totalTaskPages, page + 1))
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Formulario simulado de configuración.</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label>Nombre de la organización</Label>
                  <Input
                    value={settings.company}
                    onChange={(e) => setSettings({ ...settings, company: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Correo de contacto</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Tema visual</Label>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => setSettings({ ...settings, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Azul">Azul</SelectItem>
                      <SelectItem value="Verde">Verde</SelectItem>
                      <SelectItem value="Oscuro">Oscuro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                  <Label>Activar notificaciones</Label>
                </div>

                <Button onClick={saveSettings}>Guardar configuración</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}