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
import api, {
  Category,
  Discipline,
  TeacherDisciplines,
  Test,
  TestByDiscipline,
} from "../services/api";

function Disciplines() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [terms, setTerms] = useState([]); // useState<TestByDiscipline[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: {testsByTerms: testsData} } = await api.getTestsByDiscipline(token);

      console.log(testsData);

      setTerms(testsData);
      // const { data: categoriesData } = await api.getCategories(token);
      // setCategories(categoriesData.categories);
    }
    loadPage();
  }, [token]);

  return (
    <>
      <TextField
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por disciplina"
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
            variant="contained"
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
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <TermsAccordions terms={terms as any[]} />
      </Box>
    </>
  );
}


function TermsAccordions({ terms }: { terms: {id: number, number: number, disciplines: any[]}[] }) {
  return (
    <Box sx={{ marginTop: "50px" }}>
      {terms.map((term) => (
        <Accordion sx={{ backgroundColor: "#FFF" }} key={term.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{term.number} Período</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DisciplinesAccordions
              disciplines={term.disciplines}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

function DisciplinesAccordions({ disciplines }: { disciplines: {id: number, name: string, categories: any[]}[] }) {
  if (disciplines.length === 0)
    return <Typography>Nenhuma prova para esse período...</Typography>;

  return (
    <>
      {disciplines.map((discipline) => (
        <Accordion
          sx={{ backgroundColor: "#FFF", boxShadow: "none" }}
          key={discipline.id}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{discipline.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Categories
              categories={discipline.categories}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

interface CategoriesProps {
  categories: CategoryProp[];
}

interface CategoryProp {
  category: {
    id: number;
    name: string;
    tests: TestProp[];
  }
}

interface TestsProp {
  tests: TestProp[];
}

interface TestProp {
  id: number;
  name: string;
  pdfUrl: string;
  teacher: {
    name: string;
  }
}

function Categories({categories}: CategoriesProps) {

  if (categories.length === 0)
    return <Typography>Nenhuma prova para essa disciplina...</Typography>;

  return (
    <>
      {categories.map((categoryItem) => {
          const category = categoryItem.category;
          return (<Box key={category.id}>
            <Typography fontWeight="bold">{category.name}</Typography>
            <Tests tests={category.tests} />
          </Box>)
        })}
    </>
  );
}


function Tests({ tests }: TestsProp) {
  return (
    <>
      {tests.map((test) =>
          (<Typography key={test.id} color="#878787">
            <Link
              href={test.pdfUrl}
              target="_blank"
              underline="none"
              color="inherit"
            >{`${test.name} (${test.teacher.name})`}</Link>
          </Typography>)
      )}
    </>
  );
}

export default Disciplines;
