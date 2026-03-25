import { adminAPI } from "../axios/adminAPI";

export const fetchGoals = (searchText: string, limit: number, page: number) => {
  return adminAPI.get("/goals", {
    params: {
      search: searchText,
    limit,
      page,
    },
  });
};

export const createGoal = (data: any) => {
  return adminAPI.post("/goals", data);
};

export const updateGoal = (id: string, data: any) => {
  return adminAPI.put(`/goals/${id}`, data);
};

export const deleteGoal = (id: string) => {
  return adminAPI.delete(`/goals/${id}`);
};

export const fetchGoalById = (id: string) => {
  return adminAPI.get(`/goals/${id}`);
};  
