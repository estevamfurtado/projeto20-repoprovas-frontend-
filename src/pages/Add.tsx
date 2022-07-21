import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AxiosError } from "axios";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Input,
  InputLabel,
  Link,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import Form from "../components/Form";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import api, {
  Category,
  Discipline,
  Teacher,
  Test,
  TestByDiscipline,
  OptionsToCreate
} from "../services/api";
import useAlert from "../hooks/useAlert";


const styles = {
  container: {
    width: "460px",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
  },
  title: { marginBottom: "30px" },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
    marginBottom: "26px",
  },
  input: { marginBottom: "16px" },
  actionsContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

interface NewTestData {
  name: string;
  pdfUrl: string;
  categoryId: number;
  disciplineId: number;
  teacherId: number;
}



export default function Add() {
  const navigate = useNavigate();
  const { setMessage } = useAlert();
  const { token } = useAuth();

  const [newData, setNewData] = useState<NewTestData>({
    name: "",
    pdfUrl: "",
    categoryId: 0,
    disciplineId: 0,
    teacherId: 0,
  })

  const [options, setOptions] = useState<OptionsToCreate>({
    disciplines: [],
    categories: [],
  });

  const { name, pdfUrl, categoryId, disciplineId, teacherId } = newData;
  const {categories, disciplines} = options;
  const teachers = disciplines.find(d => d.id === disciplineId)?.teachers || [];


  useEffect(() => {
    async function loadOptions() {
      if (!token) return;
      const { data: {dataToCreate} } = await api.getOptionsToCreate(token);
      console.log(dataToCreate);
      setOptions(dataToCreate);
    }
    loadOptions();
  }, [token]);

  return (
    <>
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        {headerBuilder()}
        {formBuilder()}
      </Box>
    </>
  );



  function formBuilder() {
    return (
      <Form onSubmit={handleSubmit}>
        <Box sx={styles.container}>
          
          <Typography sx={styles.title} variant="h4" component="h2">
            Adicione uma prova
          </Typography>

          <TextField
            name="name"
            sx={styles.input}
            label="Nome da prova"
            type="text"
            variant="outlined"
            onChange={handleNameChange}
            value={name}
          />

          <TextField
            name="pdfUrl"
            sx={styles.input}
            label="PDF da prova"
            type="url"
            variant="outlined"
            onChange={handlePdfUrlChange}
            value={pdfUrl}
          />  

          {disciplinaSelectBuilder()}
          {professorSelectBuilder()}
          {categoriaSelectBuilder()}

        <Button variant="contained" type="submit">Salvar</Button>
        </Box>
      </Form>
    );
  }


  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewData({ ...newData, name: e.target.value });
  }

  function handlePdfUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewData({ ...newData, pdfUrl: e.target.value });
  }

  function handleDisciplinaChange(e: SelectChangeEvent) {
    setNewData({ ...newData, disciplineId: Number(e.target.value) });
  }

  function handleTeacherChange(e: SelectChangeEvent) {
    setNewData({ ...newData, teacherId: Number(e.target.value) });
  }

  function handleCategoryChange(e: SelectChangeEvent) {
    setNewData({ ...newData, categoryId: Number(e.target.value) });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!token) return;
    setMessage(null);

    if (!name || !pdfUrl || !categoryId || !disciplineId || !teacherId) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const data = {...newData};

    try {
      await api.createNewTest(data, token);
      clearForm();
      setMessage({ type: "success", text: "Prova salva ;)" });
    } catch (error: Error | AxiosError | any) {
      console.log('ERROR');
      console.log(error.response);
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data.message,
        });
        return;
      }
      setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
      });
    }
  }

  function clearForm() {
    setNewData({
      name: "",
      pdfUrl: "",
      categoryId: 0,
      disciplineId: 0,
      teacherId: 0,
    });
  }


  function disciplinaSelectBuilder() {
    return (
      <FormControl>
          <InputLabel id="disciplina-label">Disciplina</InputLabel>
          <Select
            labelId="disciplina-label"
            id="disciplina"
            value={disciplineId > 0 ? String(disciplineId) : ""}
            label="Disciplina"
            sx={styles.input}
            onChange={handleDisciplinaChange}
          >
            {
              disciplines.map(discipline => (
                <MenuItem key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
    )
  }

  function professorSelectBuilder() {

    return (
      <FormControl>
          <InputLabel id="professor-label">Professor</InputLabel>
          <Select
            labelId="professor-label"
            id="professor"
            value={teacherId > 0 ? String(teacherId) : ""}
            label="Professor"
            sx={styles.input}
            onChange={handleTeacherChange}
          >
            {
              teachers.map(teacher => (
                <MenuItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
    )
  }

  function categoriaSelectBuilder() {
    return (
      <FormControl>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
            id="categoria"
            value={categoryId > 0 ? String(categoryId) : ""}
            label="Categoria"
            sx={styles.input}
            onChange={handleCategoryChange}
          >
            {
              categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
    )
  }

  function headerBuilder() {
    return <>
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
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="contained" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
      </>
  }

}
