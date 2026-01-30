interface Tasks {
    id: number;
    projectId: number;
    title: string;
    description: string;
    status: 'Backlog' | 'In Progress' | 'Done';
    priority: 'low' | 'medium' | 'high';
    assigneeId: number;
    dueDate: string;
    orderIndex: number;
    created_at?: string;
    updated_at?: string;
}
type PostTask = Omit<Tasks, 'id' | 'created_at' | 'updated_at'>;