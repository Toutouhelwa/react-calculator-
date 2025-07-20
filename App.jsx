import { useReducer } from "react"
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
export const ACTIONS = {
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION:'choose-operation',
    CLEAR:'clear',
    DELETE_DIGIT:'delete-digit',
    EVALUATE :'evaluate'
  }
  function reducer(state, { type, payload }) {
    switch (type) {
      case ACTIONS.ADD_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            currentOperand: payload.digit,
            overwrite: false,
          }
        }
        if (payload.digit === "0" && state.currentOperand === "0") {
          return state
        }
        if (payload.digit === "." && state.currentOperand.includes(".")) {
          return state
        }

        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        }
      case ACTIONS.CHOOSE_OPERATION:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }

        if (state.currentOperand == null) {
          return {
            ...state,
            operation: payload.operation,
          }
        }

        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,
        }
      case ACTIONS.CLEAR:
        return {}
      case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: null,
          }
        }
        if (state.currentOperand == null) return state
        if (state.currentOperand.length === 1) {
          return { ...state, currentOperand: null }
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1),
        }
      case ACTIONS.EVALUATE:
        if (
          state.operation == null ||
          state.currentOperand == null ||
          state.previousOperand == null
        ) {
          return state
        }

        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
    }
  }
  function evaluate ({currentOperand,previousOperand,operation}){
    const prev = parseFloat(previousOperand);
    const current  = parseFloat(currentOperand)
    if(isNaN(prev) || isNaN(current)) return ""
    let compulation = ""
    switch(operation){
      case "+":
        compulation = prev + current
        break
      case "*":
        compulation = prev * current
        break 
      case "/":
        compulation = prev / current 
        break
      case "-" :
        compulation = prev - current 
        break
    }
    return compulation.toString();

  }
  function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
  } 
function App() {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {})
    const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
      maximumFractionDigits: 0,
    })
    return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand"> {formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button  onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation = "/"></OperationButton>
      <DigitButton dispatch={dispatch} digit = "1"></DigitButton>
      <DigitButton dispatch={dispatch} digit = "2"></DigitButton>
      <DigitButton dispatch={dispatch} digit = "3"></DigitButton>
      <OperationButton dispatch={dispatch} operation = "*"></OperationButton>
      <DigitButton dispatch={dispatch} digit = "4"></DigitButton>
      <DigitButton dispatch={dispatch} digit = "5"></DigitButton>
      <DigitButton dispatch={dispatch} digit = "6"></DigitButton>
      <OperationButton dispatch={dispatch} operation = "+"></OperationButton>
      <DigitButton dispatch={dispatch} digit = "7"></DigitButton>
      <DigitButton dispatch={dispatch} digit = "8"></DigitButton>
      <DigitButton dispatch={dispatch} digit = "9"></DigitButton>
     <OperationButton dispatch={dispatch} operation = "-"></OperationButton>
      <DigitButton dispatch={dispatch} digit = "."></DigitButton>
      <DigitButton dispatch={dispatch} digit = "0"></DigitButton>
      <button className = "span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>

  </div>

  )
}

export default App
