import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateOne } from '../../redux/actions'
import { countMatrixElements } from '../../utils'

class ValuesForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			year: Number(props.startYear),
			currentYearIndex: 0,
			inputValues: props.inputValues,
		}
	}
	componentDidMount() {
		const { plotterFormFilled, labelsFormFilled, history } = this.props
		if (!plotterFormFilled || !labelsFormFilled) {
			history.push('/plotter-form')
		}
	}
	handleChange = e => {
		const { currentYearIndex } = this.state
		const dataIndex = e.target.getAttribute('data-index')
		const inputValuesUpdated = [...this.state.inputValues]
		if (!inputValuesUpdated[currentYearIndex]) {
			inputValuesUpdated[currentYearIndex] = []
		}
		inputValuesUpdated[currentYearIndex][dataIndex] = e.target.value
		this.setState({
			inputValues: inputValuesUpdated,
		})
	}
	handleSubmit = e => {
		e.preventDefault()
		const { updateOne, history, inputLabels, totalYears } = this.props
		const { inputValues } = this.state
		if (
			countMatrixElements(
				inputValues,
				Number(totalYears) + 1,
				inputLabels.length
			) ===
			inputLabels.length * (Number(totalYears) + 1)
		) {
			updateOne('inputValues', inputValues)
			updateOne('valuesFormFilled', true)
			history.push('/graph-animation')
		}
	}
	increment = () => {
		let { yearDifference } = this.props
		const { currentYearIndex } = this.state
		if (currentYearIndex < 10) {
			this.setState(state => ({
				year: Number(state.year) + Number(yearDifference),
				currentYearIndex: state.currentYearIndex + 1,
			}))
		}
	}
	decrement = () => {
		let { yearDifference } = this.props
		const { currentYearIndex } = this.state
		if (currentYearIndex > 0) {
			this.setState(state => ({
				year: Number(state.year) - Number(yearDifference),
				currentYearIndex: state.currentYearIndex - 1,
			}))
		}
	}
	render() {
		const { year } = this.state
		let { inputLabels, totalYears } = this.props
		const { inputValues, currentYearIndex } = this.state
		return (
			<div>
				<h4>Values Form</h4>
				<p>Year: {year}</p>
				<p>
					Form number: {currentYearIndex + 1} /{' '}
					{Number(totalYears) + 1}
				</p>
				<p>
					Total filled:{' '}
					{countMatrixElements(
						inputValues,
						Number(totalYears) + 1,
						inputLabels.length
					)}{' '}
					/{inputLabels.length * (Number(totalYears) + 1)}
				</p>
				<form onSubmit={this.handleSubmit}>
					{inputLabels.map((label, index) => {
						let defaultValue = ''
						let inputValueArray = inputValues[currentYearIndex]
						if (inputValueArray) {
							if (inputValueArray[index]) {
								defaultValue = inputValueArray[index]
							}
						}
						return (
							<div className='form-group' key={index}>
								<label htmlFor={`${label}-${year}`}>
									{label}
								</label>
								<input
									className='form-control'
									id={`${label}-${year}`}
									name={`${label}-${year}`}
									data-index={index}
									type='number'
									value={defaultValue}
									onChange={this.handleChange}
								/>
							</div>
						)
					})}
					{countMatrixElements(
						inputValues,
						Number(totalYears) + 1,
						inputLabels.length
					) ===
						inputLabels.length * (Number(totalYears) + 1) && (
						<div className='form-group'>
							<input
								type='submit'
								className='btn btn-info form-control'
								value='Submit the values'
							/>
							<br />
						</div>
					)}
				</form>
				<button className='btn btn-info mr-2' onClick={this.decrement}>
					Previous
				</button>
				<button className='btn btn-info mr-2' onClick={this.increment}>
					Next
				</button>
				<button
					className='btn btn-danger'
					onClick={() =>
						this.setState({
							inputValues: [],
						})
					}>
					Clear
				</button>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	plotterFormFilled: state.plotterFormFilled,
	labelsFormFilled: state.labelsFormFilled,
	startYear: state.startYear,
	yearDifference: state.yearDifference,
	totalYears: state.totalYears,
	inputLabels: state.inputLabels,
	inputValues: state.inputValues,
})

const mapDispatchToProps = dispatch => ({
	updateOne: (name, value) => dispatch(updateOne(name, value)),
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(ValuesForm))
