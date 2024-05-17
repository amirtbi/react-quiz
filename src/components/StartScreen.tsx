export default function StartScreen(props: {
  nums: number;
  onLetsStart: (a: { type: string }) => void;
}) {
  const { nums, onLetsStart } = props;
  return (
    <>
      <div className="start">
        <h2>Welcome to The React Quize! </h2>
        <h3>{nums} questions to test your React mastery</h3>
        <button
          onClick={() => onLetsStart({ type: "start" })}
          className="btn btn-ui"
        >
          Let's start
        </button>
      </div>
    </>
  );
}
