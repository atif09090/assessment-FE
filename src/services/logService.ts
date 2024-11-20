import api from "./axios";

export const getLogs = async (filter: string) => {
    try {
        const response = await api.get('patient-log', {
            params: { filter }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};


export const postLogs = async (body: any) => {
    try {
        const response = await api.post('patient-log', body);
        if (!response.statusText) {
            throw new Error("Invalid credentials or server error");
          }
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};