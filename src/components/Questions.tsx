import { QuestionProp } from "../question.model";
import Option from "./Option";
export default function Questions(props: {
  question: QuestionProp;
  answer: number;
  dispatch: (action: { payload?: any; type: string }) => void;
}) {
  const { question, answer, dispatch } = props;
  console.log("question", question);
  return (
    <>
      <h4>{question.question}</h4>
      <Option question={question} answer={answer} dispatch={dispatch} />
    </>
  );
}
