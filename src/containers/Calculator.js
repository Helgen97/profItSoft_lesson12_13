import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import examplesActions from "../store/actions/exampleActions";
import { TextField, Grid, MenuItem, Paper, Typography, CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import STYLES from "../constants/styles";
import BUTTONS from "../constants/buttons";
import GridButton from "../components/GridButton";

class Calculator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            output: "",
            history: ["History"],
            firstNumber: "",
            secondNumber: "",
            operator: "",
        }
    }

    calculate(expression) {
        let expressionParameters = expression.split(" ");

        let firstNumber = Number(expressionParameters[0]);
        let secondNumber = Number(expressionParameters[2]);
        let operator = expressionParameters[1];

        if (secondNumber === 0) return "Error division by zero";

        switch (operator) {
            case "+": {
                return firstNumber + secondNumber;
            }
            case "-": {
                return firstNumber - secondNumber;
            }
            case "*": {
                return firstNumber * secondNumber;
            }
            case "/": {
                return firstNumber / secondNumber;
            }
            default: {
                return "Couldn't evaluate result";
            }
        }
    }

    handleNumberClick(value) {
        let { firstNumber, secondNumber, operator, output } = this.state;

        if (operator === "") {
            return {
                firstNumber: firstNumber += value,
                output: output += value
            };
        } else {
            return {
                secondNumber: secondNumber += value,
                output: output += value
            };
        }
    }

    handleOperatorClick(value) {
        let { firstNumber, secondNumber, operator, history, output } = this.state;

        if (operator === "") {

            return {
                operator: value,
                output: output += " " + value + " "
            }

        } else if (operator !== "" && secondNumber === "") {

            return {
                operator: value,
                output: output.replace(/(?![+\-/*]\d\s)[+\-/*]/, value)
            }

        } else if (secondNumber !== "") {

            let expression = `${firstNumber} ${operator} ${secondNumber}`;
            let result = this.calculate(expression);

            return {
                output: result + ` ${value} `,
                firstNumber: result,
                secondNumber: "",
                operator: value,
                history: [...history, expression + ` = ${result}`]
            }

        }
    }

    handleEvaluateClick() {
        let { firstNumber, secondNumber, operator, history } = this.state;
        let expression = `${firstNumber} ${operator} ${secondNumber}`;
        let result = this.calculate(expression);

        return {
            output: result,
            firstNumber: result,
            secondNumber: "",
            operator: "",
            history: [...history, expression + ` = ${result}`]
        }

    }

    handleClick = (event) => {
        let value = event.target.closest("button").value;
        let { firstNumber, secondNumber, operator } = this.state;
        let newState = {};

        if (value.match(/[\d.]/)) {

            newState = this.handleNumberClick(value);

        } else if (value.match(/[+\-/*]/)) {

            if (firstNumber === "") return;
            newState = this.handleOperatorClick(value);

        } else {

            if (firstNumber === "" || operator === "" || secondNumber === "") return;
            newState = this.handleEvaluateClick();
        }

        this.setState(newState);
    }

    componentDidUpdate() {
        let { exampleList } = this.props.examples;
        let { history } = this.state;

        exampleList.forEach((example) => {
            let newExample = example + ` = ${this.calculate(example)}`;
            if (!history.includes(newExample)) {
                this.setState({ history: [...history, newExample] })
            }
        })
    }

    render() {
        const { classes, examples, actionFetchExamples } = this.props;
        const { output, history } = this.state;

        return <>
            <Paper className={classes.container} elevation={12}>
                <Typography variant="h4" className={classes.header}>Calculator</Typography>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    className={classes.input}
                    contentEditable={false}
                    value={output}
                />
                <TextField
                    id="outlined-select"
                    select
                    value={history.at(-1)}
                    variant="outlined"
                    className={classes.input}
                    label="Last calculated example"
                    helperText="History of calculated examples"
                >
                    {history.map((example, index) =>
                        <MenuItem
                            key={index}
                            value={example}
                        >
                            {example}
                        </MenuItem>
                    )}
                </TextField>
                <Grid container spacing={2}>
                    {BUTTONS.map((button =>
                        <GridButton
                            key={button.value}
                            gridSize={button.gridSize}
                            className={classes.button}
                            value={button.value}
                            color={button.color}
                            click={this.handleClick}
                        />)
                    )}
                    {examples.isLoading &&
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <CircularProgress size={30} />
                        </Grid>}
                    {!examples.isLoading &&
                        <GridButton
                            gridSize={12}
                            className={classes.button}
                            value="Отримати приклади з БЭ"
                            color="primary"
                            click={() => actionFetchExamples(5)} />}
                </Grid>
            </Paper>
        </>
    }
}

const mapReduxStateToProps = (reduxState) => ({ ...reduxState });

const mapDispatchToProps = (dispatch) => {
    const fetchExamples = bindActionCreators(examplesActions, dispatch)

    return ({
        actionFetchExamples: fetchExamples,
    })
};

export default connect(mapReduxStateToProps, mapDispatchToProps)(withStyles(STYLES)(Calculator));
