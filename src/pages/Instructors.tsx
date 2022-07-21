import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, {} from "../services/api";


export interface TestsByTeachers {
  testsByTeacher: TeacherWithCategories[]
}

type TeacherWithCategories = {
    id: number;
    name: string;
    categories: CategoryWithTests[];
}

type CategoryWithTests = {
  category: {
    id: number;
    name: string;
    tests: TestWithDiscipline[]
  }
}

type TestWithDiscipline = {
  id: number;
  name: string;
  pdfUrl: string;
  discipline: {name: string};
}

function Instructors() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [teachers, setTeachers] = useState<TeacherWithCategories[]>([]);
  
  useEffect(() => {
    async function loadPage() {
      if (!token) return;
      const { data: {testsByTeachers: testsData} } = await api.getTestsByTeacher(token);
      console.log(testsData);
      setTeachers(testsData as TeacherWithCategories[]);
    }
    loadPage();
  }, [token]);

  return (
    <>
      <TextField
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por pessoa instrutora"
      />
      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <TeachersAccordions
          teachers={teachers}
        />
      </Box>
    </>
  );
}

type TeacherProps = {
  teachers: TeacherWithCategories[];
}

function TeachersAccordions({teachers}: TeacherProps) {

  return (
    <Box sx={{ marginTop: "50px" }}>
      {teachers.map((teacher) => (
        <Accordion sx={{ backgroundColor: "#FFF" }} key={teacher.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{teacher.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {teacher.categories
              .map((category) => {
                const {category: {id}} = category;
                return (
                  <Category key={id} category={category}/>
                )
              })}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

type CategoryProps = {
  category: CategoryWithTests;
}

function Category({category}: CategoryProps) {
  const {category: {name, tests}} = category;
  return (
    <>
      <Box sx={{ marginBottom: "8px" }}>
        <Typography fontWeight="bold">{name}</Typography>
        <Tests tests={tests} />
      </Box>
    </>
  );
}


type TestsProps = {
  tests: TestWithDiscipline[];
}

function Tests({ tests }: TestsProps) {
  return (
    <>
      {tests.map((test) => (
        <Typography key={test.id} color="#878787">
          <Link
            href={test.pdfUrl}
            target="_blank"
            underline="none"
            color="inherit"
          >{`${test.name} (${test.discipline.name})`}</Link>
        </Typography>
      ))}
    </>
  )
}

export default Instructors;
