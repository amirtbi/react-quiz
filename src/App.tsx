import { useEffect, useReducer, useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import "./index.css";
import Question from "./components/Questions";
import NextButton from "./components/NextButton";

const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  point: 0,
};

function reducer(state: any, action: { payload?: any[]; type: string }) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer":
      const currentQuestion = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        point:
          currentQuestion.correctOption === action.payload
            ? state.point + currentQuestion.points
            : state.point,
      };
    case "nextQuestion":
      return { ...state, answer: null, index: state.index + 1 };
    default:
      throw Error();
  }
}
function App() {
  const [{ status, questions, index, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const numQuestions = questions.length;

  useEffect(() => {
    const getQuestions = async () => {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = (await res.json()) as any[];
        if (res.status === 200) {
          dispatch({ type: "dataReceived", payload: data });
        } else if (!res.ok) {
          dispatch({ type: "dataFailed" });
        }
      } catch (e) {
        dispatch({ type: "dataFailed" });
      }
    };

    getQuestions();
  }, []);

  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen onLetsStart={dispatch} nums={numQuestions} />
          )}
          {status === "active" && (
            <Question
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />
          )}
          <NextButton dispatch={dispatch} answer={answer} />
        </Main>
      </div>
    </>
  );
}

export default App;
