import React from 'react';
import { makeStyles, useTheme, GridList, GridListTile } from '@material-ui/core';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import anh1 from '../../images/ok1.png'
import anh2 from '../../images/ok2.png'
import anh3 from '../../images/ok3.png'
import anh4 from '../../images/ok4.png'
import anh5 from '../../images/ok5.png'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
    {'img': anh1},{'img':anh2},{'img':anh3},{'img':anh4},{'img':anh5},
    // {
    //     label: 'San Francisco – Oakland Bay Bridge, United States',
    //     imgPath:
    //         'https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60',
    // },

];

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 500,
        height: 450,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        height: 50,
        paddingLeft: theme.spacing(4),
        backgroundColor: theme.palette.background.default,
    },
    img: {
        height: 450,
        display: 'block',
        overflow: 'hidden',
        width: '100%',
    },
}));

function CarouselImage() {
    const classes = useStyles();
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    const handleStepChange = step => {
        setActiveStep(step);
    };

    return (
        <div className={classes.root}>
            <AutoPlaySwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={activeStep}
                onChangeIndex={handleStepChange}
                enableMouseEvents
            >
                {tutorialSteps.map((step, index) => (
                    <div key={index}>
                        {Math.abs(activeStep - index) <= 2 ? (
                            <GridList cellHeight={160} className={classes.gridList} cols={3}>
                                {tutorialSteps.map(tile => (
                                    <GridListTile key={tile.img} cols={tile.cols || 1}>
                                        <img className={classes.img} src={step.img}/>
                                    </GridListTile>
                                ))}
                            </GridList>
                        ) : null}
                    </div>
                ))}
            </AutoPlaySwipeableViews>

        </div>
    );
}

export default CarouselImage;