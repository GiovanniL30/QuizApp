import React, { useEffect } from "react";
import { useState } from "react";

export default function Question(props) {
  const questions = props.questions.map((question) => {
    const incorrectAnswers = question.incorrect_answers.map((incorrectAns) => {
      return (
        <div
          key={question.id}
          onClick={(event) =>
            props.handleClick(event, question.id, incorrectAns)
          }
          className={`option ${
            props.isFinished && question.choice === incorrectAns
              ? "btn-choice-wrong"
              : "btn-warning"
          } 
          ${props.isFinished && "no-click"}`}
        >
          {incorrectAns}
        </div>
      );
    });

    const correct = question.correct_answer;

    const correctAnswer = () => {
      return (
        <div
          key={question.id}
          onClick={(event) => props.handleClick(event, question.id, correct)}
          className={`option ${props.isFinished && "btn-correct"}  ${
            props.isFinished && "no-click"
          }`}
        >
          {correct}
        </div>
      );
    };

    const combinedAnswers = [correctAnswer(), ...incorrectAnswers];

    const sortedAnswerElements = combinedAnswers.sort((a, b) =>
      a.props.children.localeCompare(b.props.children)
    );

    const decodedQuestion = (() => {
      const parser = new DOMParser();
      return parser.parseFromString(
        `<!doctype html><body>${question.question}`,
        "text/html"
      ).body.textContent;
    })();

    return (
      <div className="question-container" key={question.question}>
        <h1>{decodedQuestion}</h1>
        <div className="choices-grid">{sortedAnswerElements}</div>
      </div>
    );
  });

  return <>{questions}</>;
}
