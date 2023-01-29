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

    calculate(expresion) {
        try {
            // eslint-disable-next-line
            return eval(expresion);

        } catch (error) {
            console.error(error);
        }
    }

    handleClick = (event) => {
        let value = event.target.closest("button").value;
        let { firstNumber, secondNumber, operator } = this.state;
        let newOutput = this.state.output;

        if (value.match(/[\d.]/)) {

            if (operator === "") {
                this.setState({ firstNumber: firstNumber += value });
            } else {
                this.setState({ secondNumber: secondNumber += value });
            }

            newOutput += value;

        } else if (value.match(/[+\-/*]/)) {
            if (firstNumber === "") return;

            if (operator === "") {
                this.setState({ operator: value });
                newOutput += " " + value + " ";
            } else if (operator !== "" && secondNumber === "") {
                this.setState({ operator: value });
                newOutput = newOutput.replace(/[+\-/*]/, value);
            } else if (secondNumber !== "") {

                let expression = `${firstNumber} ${operator} ${secondNumber}`;
                let result = this.calculate(expression);
                newOutput = result + ` ${value} `;

                this.setState({
                    firstNumber: result,
                    secondNumber: "",
                    operator: value,
                    history: [...this.state.history, expression + ` = ${result}`]
                });
            }

        } else {
            if (firstNumber === "" || operator === "" || secondNumber === "") return;

            let expression = `${firstNumber} ${operator} ${secondNumber}`;
            let result = this.calculate(expression);

            newOutput = result;
            this.setState({
                firstNumber: result,
                secondNumber: "",
                operator: "",
                history: [...this.state.history, expression + ` = ${result}`]
            })
        }

        this.setState({ output: newOutput })
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
                        <Grid item xs={12} style={{textAlign:"center"}}>
                            <CircularProgress size={30}/>
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
