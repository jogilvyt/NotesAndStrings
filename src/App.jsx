import React, { Component } from 'react';
import '../public/css/bootstrap.min.css';
import '../public/style.css';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showEnharmonics: true,
			bpm: 40,
			interval: 0,
			notesAndStrings: [],
			started: false,
			note: '',
			string: ''
		}

		this.handleShowEnharmonicsChange = this.handleShowEnharmonicsChange.bind(this);
		this.handleBpmChange = this.handleBpmChange.bind(this);
		this.buildNotesAndStringsArray = this.buildNotesAndStringsArray.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cycleThroughArray = this.cycleThroughArray.bind(this);
		this.cancelCycle = this.cancelCycle.bind(this);
	}

	componentDidMount(){
		this.setState((prevState, props) => {
			var ms;

			if (prevState.bpm === '0' || prevState.bpm === '') {
				ms = 40 * 1000;
			} else {
				ms = (60 / prevState.bpm) * 1000;
			}

			return {
				interval: ms
			}
		});

		this.buildNotesAndStringsArray();
	}

	handleShowEnharmonicsChange(event) {
		this.setState({
			showEnharmonics: event.target.checked
		}, this.buildNotesAndStringsArray);
	}

	handleBpmChange(event) {
		var bpm = event.target.value,
			ms;

		if (bpm === '0' || bpm === '') {
			ms = 40 * 1000;
		} else {
			ms = (60 / bpm) * 1000;
		}

		this.setState((prevState, props) => {
			return {bpm: bpm, interval: ms}
		});
	}

	handleSubmit(event) {
		this.setState((prevState, props) => {
			if (!prevState.started) {
				this.cycleThroughArray();
			} else {
				this.cancelCycle();
			}

			return {
				started: !prevState.started
			}
		});
	}

	cycleThroughArray() {
		var that = this;
		this.timerID = [];

		for (var i = 0; i < that.state.notesAndStrings.length; i++) {
			this.timerID.push(setTimeout(function(y) {
				that.setState((prevState, props) => {
					return {
						string: that.state.notesAndStrings[y].string,
						note: that.state.notesAndStrings[y].note
					}
				});
			}, i * that.state.interval, i));
		}

		this.endOfCycle = setTimeout(() => {
			this.cancelCycle();
			this.setState({
				started: false
			});
		}, this.state.interval * this.state.notesAndStrings.length);
	}

	cancelCycle() {
		this.setState({
			note: '',
			string: ''
		}, this.buildNotesAndStringsArray());

		this.timerID.forEach((timer) => {
			clearTimeout(timer);
		});

		clearTimeout(this.endOfCycle);
	}

	buildNotesAndStringsArray() {
		var objArray = [];

		for (var x = 0; x < this.props.values.strings.length; x++) {
			for (var y = 0; y < this.props.values.notes.length; y++) {
				objArray.push({note: this.props.values.notes[y], string: this.props.values.strings[x]});
			}

			if (this.state.showEnharmonics) {
				for (var z = 0; z < this.props.values.enharmonicNotes.length; z++) {
					objArray.push({note: this.props.values.enharmonicNotes[z], string: this.props.values.strings[x]});
				}
			}
		}

		var shuffledArray = this.shuffleArray(objArray);

		this.setState({
			notesAndStrings: shuffledArray
		})
	}

	shuffleArray(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<div className="App">
							<h1>Notes and Strings</h1>
							<p>
								An app to help with learning where the notes are on different guitar strings.
							</p>
							<p>
								Decide whether or not you want to show enharmonic notes, enter the BPM (beats per minute)
								and then click 'start'. The notes will then be cycled through randomly - every note on
								every string.
							</p>
							<form>
								<ShowEnharmonics checked={this.state.showEnharmonics}
												 handleChange={this.handleShowEnharmonicsChange}
												 disabled={this.state.started} />
								<BPMInput bpm={this.state.bpm}
										  handleChange={this.handleBpmChange}
										  disabled={this.state.started} />
								<button type="button"
												className="btn btn-primary"
												onClick={this.handleSubmit}>
									{this.state.started ? 'STOP' : 'START'}
								</button>
							</form>
							{
								this.state.started &&
								<Display string={this.state.string} note={this.state.note} />
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function ShowEnharmonics(props) {
	return (
		<div className="checkbox">
			<label>
				<input name="showEnharmonics"
					   type="checkbox"
					   checked={props.checked}
					   onChange={props.handleChange}
					   disabled={props.disabled} />
				Show enharmonics?
			</label>
		</div>
	)
}

function BPMInput(props) {
	return (
		<div className="form-group">
			<label>Enter BPM:</label>
			<input name="bpm"
				   type="number"
					 className="form-control"
				   value={props.bpm}
				   onChange={props.handleChange}
				   disabled={props.disabled} />
		</div>
	)
}

function Display(props) {
	return (
	<div className="display">
		<h3 className="note">{props.note}</h3>
		<h3 className="string">{props.string}</h3>
	</div>
	)
}

export default App;
