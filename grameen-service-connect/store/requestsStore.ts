import { create } from "zustand";
import { ServiceRequest } from "../lib/api";

interface RequestsState {
  requests: ServiceRequest[];
  setRequests: (requests: ServiceRequest[]) => void;
  addRequest: (request: ServiceRequest) => void;
  updateRequest: (id: number, updates: Partial<ServiceRequest>) => void;
  clearRequests: () => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  requests: [],
  setRequests: (requests) => set({ requests }),
  addRequest: (request) =>
    set((state) => ({ requests: [request, ...state.requests] })),
  updateRequest: (id, updates) =>
    set((state) => ({
      requests: state.requests.map((req) =>
        req.id === id ? { ...req, ...updates } : req
      ),
    })),
  clearRequests: () => set({ requests: [] }),
}));
