# D3 React Demo

## Disclaimers

I am not a React expert, nor a CSS or HTML expert, nor really a d3 expert - a lot of this is from bits I've picked up as I go along, so I could have core things misunderstood - especially react things!

There's also a fair bit of junk in this repo from create-react-app - especially things like stubs for stuff I haven't done (like tests!) - I haven't cleaned this up because I might need it some day.

## Introduction

This is a demonstration of how I build D3 visualisations using React.  I am sharing it to help others, but also so I have a template to speed new visualisations when I want to make one!

A few key concepts:

I'm using the approach that D3 owns it's own DOM area - based on the excellent article at <https://towardsdatascience.com/react-d3-the-macaroni-and-cheese-of-the-data-visualization-world-12bafde1f922> but with updating to use react hooks, and a few other bits I've pilfered from elsewhere.

So React manipulates everything HTML, D3 manipulates everything SVG.

Basically there's a single `<svg>` element in the Viz.js component, and it is owned and manipulated through the `useEffect` calls, rather than trying to let react manage it's DOM.

I'm using a `ref` to keep track of the svg root across re-renderings - as I understand React, this should hang around even if we manipulate stuff elsewhere.

The loaded JSON data is kept in a `ref` as well - they aren't just for DOM elements! This saves React from having to diff the data or anything crazy like that.

State is kept in a single object with a few main components (see State.js):

- "config" is for most configuration that changes often
- "expensiveConfig" is for configuration that changes less often, which might require more processing
- "constants" is for configuration that never changes

For this small example, "config" and "expensiveConfig" are identical - in `Viz.js` they both cause d3 to re-render the chart.
But in more complex situations, I've found the distinction useful - for example, with a tree-structured hierarchy, I don't want to re-calculate the whole tree on a cheap config change.

You could take a look at [the vis.js file in Polyglot Code Explorer](https://github.com/kornysietsma/polyglot-code-explorer/blob/136a40aade55c3a5fcf1fae39ff42c540b08160c/src/Viz.js) for a much more complex example where the distinction between cheap and expensive rendering is needed.

Viz.js gets re-rendered whenever the state changes - but then it compares the state it is passed, with the previous state (see <https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect> ) and renders or re-renders depending on what has changed.

The general lifecycle of the app is:

- `Loader` renders a 'loading' message, triggers an Ajax call to fetch the data, and does any expensive postprocessing such as finding date ranges or anything else that never changes.  Once the data is loaded it then renders an `<App>` component.
- `App` renders the initial page, the Controller, Viz and Inspector components, and sets up wiring
- `Viz` renders the `<svg>` element, and wires up the `useEffect` call whenever state changes
- `useEffect` is triggered and calls `initialize` as the config is new
- `initialize()` renders once-and-only-once svg things like top-level groups and labels
- `draw()` then draws the initial chart, sets up scales and the rest.

If a user clicks a button or otherwise interacts with something:

- All the components get re-rendered, cheaply, as that's what React does.  DOM diffing means nothing is actually drawn
- Whichever element handler the user triggered, calls the `dispatch` function
- `dispatch` sends an action to the `globalDispatchReducer` in `State.js` which modifies the `state`
- `Viz` gets re-rendered, and the Viz `useEffect` is triggered as the state has changed
- The previous and current state contents are compared - if the change is to expensive state, `draw` is called, otherwise `redraw` is called.  At the moment these are identical but you can add extra expensive logic to `draw` - or modify `redraw` to do less, if you want.

This cycle makes interactions really nice and easy - every component gets passed `dataRef` to access the global data, `state` to find the current state, and `dispatch` to change the state.  If a component changes something via `dispatch`, the whole UI is updated cheaply with the new state, and react's DOM diffing means it doesn't do too much work.

In practice I've found this is quick enough that it's quite reasonable to do things like triggering a re-render when you drag a slider around - especially if you use the cheap/expensive config approach to limit what is re-drawn.  (It's easy to extend this to have several state areas which trigger different d3 effects)

## Update March 2022

I updated the react version (to 12.1.3) and the d3 version (to 7.1.0) but the biggest change was to move everything to TypeScript - it's not strictly necessary for such a simple project, but I wanted to learn TypeScript - also this is the base for my other visualisation tools such as the [Polyglot Code Explorer](https://github.com/kornysietsma/polyglot-code-explorer) and it'd be good to use TypeScript there.

## Original readme

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
There are probably lots of bits of react boilerplate hanging around.

The rest of this Readme is left largely untouched from the boilerplate, as it's useful information:

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
