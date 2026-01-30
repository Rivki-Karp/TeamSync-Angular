interface Teams {
    id: number;
    name: string;
    created_at: string;
    members_count: number;
    description?: string;
}
interface MemberInTeam {
  userId: number;
  role: string;
}