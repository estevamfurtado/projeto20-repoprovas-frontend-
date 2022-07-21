import axios from "axios";

const baseAPI = axios.create({
  baseURL: "http://localhost:5000/",
});

interface UserData {
  email: string;
  password: string;
}
interface CreateUserData {
  email: string;
  password: string;
  confirmPassword: string;
}

function getConfig(token: string) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

async function signUp(signUpData: CreateUserData) {
  await baseAPI.post("/sign-up", signUpData);
}

async function signIn(signInData: UserData) {
  return baseAPI.post<{ token: string }>("/sign-in", signInData);
}

export interface Term {
  id: number;
  number: number;
}

export interface Discipline {
  id: number;
  name: string;
  teacherDisciplines: TeacherDisciplines[];
  term: Term;
}

export interface TeacherDisciplines {
  id: number;
  discipline: Discipline;
  teacher: Teacher;
  tests: Test[];
}

export interface Teacher {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Test {
  id: number;
  name: string;
  pdfUrl: string;
  category: Category;
}

export type TestByDiscipline = Term & {
  disciplines: Discipline[];
};

export type TestByTeacher = TeacherDisciplines & {
  teacher: Teacher;
  disciplines: Discipline[];
  tests: Test[];
};

async function getTestsByDiscipline(token: string) {
  const config = getConfig(token);
  return baseAPI.get(  // <{ tests: TestByDiscipline[] }>
    "/tests/by-disciplines",
    config
  );
}

async function getTestsByTeacher(token: string) {
  const config = getConfig(token);
  return baseAPI.get( // <APITestsByTeachers>
    "/tests/by-teachers",
    config
  );
}

async function getCategories(token: string) {
  const config = getConfig(token);
  return baseAPI.get<{ categories: Category[] }>("/categories", config);
}

type NewTest = {
  name: string;
  pdfUrl: string;
  categoryId: number;
  teacherId: number;
  disciplineId: number;
}

async function createNewTest(data: NewTest, token: string) {
  const config = getConfig(token);
  return baseAPI.post("/tests", data, config);
}


export interface OptionsToCreate {
  disciplines: {
    id: number; name: string;
    teachers: {id: number, name: string}[]
  }[];
  categories: {id: number; name: string;}[];
}


async function getOptionsToCreate(token: string) {
  const config = getConfig(token);
  console.log(config);
  return baseAPI.get<{dataToCreate: OptionsToCreate}>("/tests/create/options", config);
}

const api = {
  getOptionsToCreate,
  createNewTest,
  signUp,
  signIn,
  getTestsByDiscipline,
  getTestsByTeacher,
  getCategories,
};

export default api;
