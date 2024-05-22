import { useCallback, useEffect, useReducer, useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import "./index.css";
import Question from "./components/Questions";
import NextButton from "./components/NextButton";
import ProgressBar from "./components/ProgressBar";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  highscore: 0,
  point: 0,
  remainedSeconds: null,
};

function reducer(state: any, action: { payload?: any[]; type: string }) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        remainedSeconds: state.questions.length * 30,
      };
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
      return {
        ...state,
        answer: null,
        index: state.index + 1,
      };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.point > state.highscore ? state.point : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        status: state.remainedSeconds === 0 ? "finished" : state.status,
        remainedSeconds: state.remainedSeconds - 1,
      };
    default:
      throw Error();
  }
}
function App() {
  const [
    { status, questions, index, answer, point, highscore, remainedSeconds },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;

  const totalPoints = useCallback(() => {
    const allPoints = questions.reduce((acc, curr) => {
      return curr.points + acc;
    }, 0);
    return allPoints;
  }, [questions]);

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
            <>
              <ProgressBar
                totalQuestions={numQuestions}
                point={point}
                index={index}
                totalPoints={totalPoints()}
                answer={answer}
              />
              <Question
                question={questions[index]}
                answer={answer}
                dispatch={dispatch}
              />
            </>
          )}
          {status === "finished" && (
            <FinishScreen
              points={point}
              totalPoints={totalPoints()}
              highscore={highscore}
              dispatch={dispatch}
            />
          )}
          {status === "finished" ||
            (status === "active" && (
              <>
                <Footer>
                  <Timer
                    dispatch={dispatch}
                    remainedSeconds={remainedSeconds}
                  />
                  <NextButton
                    dispatch={dispatch}
                    answer={answer}
                    index={index}
                    totalQuestions={numQuestions}
                  />
                </Footer>
              </>
            ))}
        </Main>
      </div>
    </>
  );
}

export default App;
