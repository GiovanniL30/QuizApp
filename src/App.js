import React from "react";
import { useState, useEffect } from "react";
import Qeustion from "./components/Question";

const API_URL = "https://opentdb.com/api.php?amount=5&type=multiple";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [play, setPlay] = useState(false);

  const allAreAnswered = questions.every((question) => question.choice !== "");

  // fectch the data
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setQuestions(
          data.results.map((question) => ({
            ...question,
            choice: "",
            id: crypto.randomUUID(),
          }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    fetchData();
  }, [play]);

  function handleClick(event, id, text) {
    const { target } = event;

    const childrenElements = Array.from(target.parentElement.children);

    childrenElements.forEach((option) => {
      option.classList.remove("clicked");
    });

    target.classList.add("clicked");

    setQuestions((prevData) =>
      prevData.map((question) => {
        return question.id === id ? { ...question, choice: text } : question;
      })
    );
  }

  function handleCheckAnswer() {
    if (allAreAnswered) {
      let count = questions.filter(
        (question) => question.correct_answer === question.choice
      ).length;
      setScore(count);
      setIsFinished(true);
    }
  }

  function playAgain() {
    setIsFinished(false);
    setPlay((prev) => !prev);
  }

  return (
    <>
      {questions.length === 0 && <h1 className="loading">Loading...</h1>}
      {questions.length > 0 && (
        <div className="wrapper">
          <div className="question-grid">
            <Qeustion
              isFinished={isFinished}
              questions={questions}
              handleClick={handleClick}
            />
          </div>
          {isFinished && <h1>Your Score: {score}</h1>}
          <button
            onClick={!isFinished ? handleCheckAnswer : playAgain}
            className={`submit ${
              allAreAnswered ? "btn-enabled" : "btn-disabled"
            }`}
          >
            {isFinished ? "Play Again" : "Check Answers"}
          </button>
        </div>
      )}
    </>
  );
}
