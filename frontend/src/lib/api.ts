const API_URL = "http://localhost/todo_app/backend";

export async function getTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    console.log("getTasks response:", data);
    return data;
  } catch (error) {
    console.error("getTasks error:", error);
    throw error;
  }
}

export async function getUncompletedTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks/uncompleted`);
    const data = await res.json();
    console.log("getUncompletedTasks response:", data);
    return data;
  } catch (error) {
    console.error("getUncompletedTasks error:", error);
    throw error;
  }
}

export async function getCompletedTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks/completed`);
    const data = await res.json();
    console.log("getCompletedTasks response:", data);
    return data;
  } catch (error) {
    console.error("getCompletedTasks error:", error);
    throw error;
  }
}

export async function getUncompletedCount() {
  try {
    const res = await fetch(`${API_URL}/tasks/count`);
    const data = await res.json();
    console.log("getUncompletedCount response:", data);
    return data;
  } catch (error) {
    console.error("getUncompletedCount error:", error);
    throw error;
  }
}

export async function createTask(title: string, description: string) {
  const res = await fetch(`${API_URL}/tasks/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
}

export async function completeTask(id: number) {
  const res = await fetch(`${API_URL}/tasks/complete/${id}`);
  return res.json();
}

export async function deleteTask(id: number) {
  const res = await fetch(`${API_URL}/tasks/delete/${id}`);
  return res.json();
}

export async function updateTask(id: number, title: string, description: string) {
  const res = await fetch(`${API_URL}/tasks/update/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
}