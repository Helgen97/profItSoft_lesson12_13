import React from "react";
import { Grid, Button } from "@material-ui/core";

class GridButton extends React.Component {

    render() {
        const { gridSize, value, className, color, click } = this.props;

        return <>
            <Grid item xs={gridSize}>
                <Button
                    variant="contained"
                    className={className}
                    color={color}
                    value={value}
                    onClick={click}
                >
                    {value}
                </Button>
            </Grid>
        </>
    }
}

export default GridButton;