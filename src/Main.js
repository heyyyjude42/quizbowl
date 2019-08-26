import React, { Component } from "react";
import bonuses from "./data/bonuses.json"
import tossups from "./data/tossups.json"

class Home extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div>
        {header()}
        <QuestionPanel />
        <ScorePanel />
      </div>
    );
  }
}

function header() {
  return <div id="header">– Quiz Bowl –</div>
}

class ScorePanel extends React.Component {
  constructor(props) {
    super();
    this.state = {
      teams: [
        {
          teamName: "Team A",
          score: 0,
        },
        {
          teamName: "Team B",
          score: 0,
        }
      ]
    };
  }

  handleInputChange = idx => e => {
    const newTeams = this.state.teams.map(function (team, idy) {
      if (idx !== idy) return team;
      const name = e.target.name;
      return { ...team, [name]: e.target.value };
    });

    this.setState({ teams: newTeams });
  }

  handleScoreIncrease = idx => e => {
    const newTeams = this.state.teams.map(function (team, idy) {
      if (idx !== idy) return team;
      const name = e.target.name;
      const newScore = parseInt(team.score) + parseInt(name);
      return { ...team, score: newScore };
    });

    this.setState({ teams: newTeams });
  }

  handleAddTeam = () => {
    this.setState({
      teams: this.state.teams.concat([{ teamName: "New Team", score: 0 }])
    });
  }

  handleRemoveTeam = () => {
    const num = this.state.teams.length;
    this.setState({
      teams: this.state.teams.slice(0, num - 1)
    });
  }

  render() {
    return (
      <div id="score-panel">
        {this.state.teams.map((team, idx) => {
          return (
            <Team team={team} onChange={this.handleInputChange(idx)} onScoreIncrease={this.handleScoreIncrease(idx)} />
          );
        })}
        <div>
          <button class="round-button add-rm-team-button" onClick={this.handleRemoveTeam}>-</button>
          <button class="round-button add-rm-team-button" onClick={this.handleAddTeam}>+</button>
        </div>
      </div>
    );
  }
}

class Team extends React.Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <div class="team-box">
        <div class="team-name">
          <input type="text" name="teamName" value={this.props.team.teamName} onChange={this.props.onChange} />
        </div>
        <div class="team-score">
          <input type="number" name="score" value={this.props.team.score} onChange={this.props.onChange} />
        </div>
        <button class="team-add-score-button" name="-5" onClick={this.props.onScoreIncrease}>-5</button>
        <button class="team-add-score-button" name="5" onClick={this.props.onScoreIncrease}>+5</button>
        <button class="team-add-score-button" name="10" onClick={this.props.onScoreIncrease}>+10</button>
      </div >
    )
  }
}

class QuestionPanel extends React.Component {
  constructor(props) {
    super();
    this.state = {
      currDisplayingTossup: true,
      currTossupIndex: 0,
      currBonusIndex: -1
    };
  }

  handlePrevQuestion = () => {
    var newIndex;
    var newBonusIndex;
    if (this.state.currDisplayingTossup) {
      newIndex = this.state.currTossupIndex - 1;
      if (newIndex < 0) newIndex = tossups.length - 1;
      newBonusIndex = this.state.currBonusIndex;
    } else {
      newIndex = this.state.currTossupIndex;
      newBonusIndex = this.state.currBonusIndex - 1;
      if (newBonusIndex < 0) newBonusIndex = bonuses.length - 1;
    }

    this.setState({
      currDisplayingTossup: true,
      currTossupIndex: newIndex,
      currBonusIndex: newBonusIndex
    });
  }

  handleNextTossup = () => {
    var newIndex = this.state.currTossupIndex + 1;
    if (newIndex >= tossups.length - 1) newIndex = 0;

    this.setState({
      currDisplayingTossup: true,
      currTossupIndex: newIndex
    });
  }

  handleNextBonus = () => {
    var newIndex = this.state.currBonusIndex + 1;
    if (newIndex >= bonuses.length - 1) newIndex = 0;

    this.setState({
      currDisplayingTossup: false,
      currBonusIndex: newIndex
    });
  }

  renderProgressBar = () => {
    var perc = parseFloat(this.state.currTossupIndex) / parseFloat(tossups.length) * 100;
    const css = { width: perc + "%" }

    return (
      <div id="progress-bar-container">
        <div id="progress-bar">
          <div id="bar" style={css}></div>
        </div>
      </div>
    );
  }

  question = () => {
    if (this.state.currDisplayingTossup) {
      const t = tossups[this.state.currTossupIndex];
      return tossup(t);
    } else {
      const b = bonuses[this.state.currBonusIndex];
      return bonus(b);
    }
  }

  render() {
    return (
      <div>
        <div id="question-panel">
          <button class="question-prev-button round-button" onClick={this.handlePrevQuestion}>&#8592;</button>
          <div>
            {this.question()}
            {this.renderProgressBar()}
          </div>
          <div>
            <button class="question-advance-button" onClick={this.handleNextTossup}>TOSSUP &#8594;</button>
            <button class="question-advance-button" onClick={this.handleNextBonus}>BONUS &#8594;</button>
          </div>
        </div>
      </div>
    );
  }
}

function tossup(t) {
  return (
    <div>
      {parseRichTextToHTML(t.question)}
      <br />
      <p>Answer: <div class="answer">{parseRichTextToHTML(t.answer)}</div></p>
    </div >
  )
}

function bonus(b) {
  return (
    <div>
      {parseRichTextToHTML(b.intro)}
      <br />
      {parseRichTextToHTML(b.q1)}
      <i>Answer:</i> <div class="answer">{parseRichTextToHTML(b.a1)}</div>
      <br />
      <br />
      {parseRichTextToHTML(b.q2)}
      <i>Answer:</i> <div class="answer">{parseRichTextToHTML(b.a2)}</div>
      <br />
      <br />
      {parseRichTextToHTML(b.q3)}
      <i>Answer:</i> <div class="answer">{parseRichTextToHTML(b.a3)}</div>
    </div >
  )
}

function parseRichTextToHTML(text) {
  const html = { __html: text };
  return <div dangerouslySetInnerHTML={html} />
}

export default Home;
