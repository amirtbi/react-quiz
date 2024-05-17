import { QuestionProp } from "../question.model";

export default function Option(props: {
  question: QuestionProp;
  answer: number;
  dispatch: (action: { payload: number; type: string }) => void;
}) {
  const { question, dispatch, answer } = props;
  const hasAnswer = answer !== null;
  return (
    <>
      <div className="options">
        {question.options.map((option: string, index) => (
          <button
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
            key={option}
            disabled={hasAnswer}
            className={`btn btn-option ${index === answer ? "answer" : ""} ${
              hasAnswer
                ? index === question.correctOption
                  ? "correct"
                  : "wrong"
                : ""
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}
