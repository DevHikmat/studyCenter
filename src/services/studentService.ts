import type { Student } from "../types";
import api from "./api"


export const getAllStudents = async() => {
    const response = await api.get('/students');
    return response.data;
}

export const getStudentById = async(id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
}

export const addStudent = async(student: Partial<Student>) => {
    const response = await api.post(`/students`, student);
    return response.data;
}

export const updateStudent = async(id: number | string, student: Partial<Student>) => {
    const response = await api.put(`/students/${id}`, student);
    return response.data;
}

export const deleteStudent = async(id: number | string) => {
    const response = await api.delete(`/students/${id}`)
    return response.data;
}