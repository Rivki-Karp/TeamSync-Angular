interface Project {
    id: number;
    team_id: number;
    name: string;
    description?: string;
    created_at?: string;
    status?: string;
}
interface PostProject {
    teamId: number;
    name: string;
    description?: string;
}