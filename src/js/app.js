// input
let billInput
let personInput
let inputTipsButtonsWithFixedPercent
let inputCustom

// output
let tipPerPersonOutput
let totalTipOutput
let resetButton 

let selectedTipButtonWithFixedPercent = null

window.onload = () => {
    billInput = new InputNumber(document.querySelector('#bill-input'), onChangedBillInputData)
    personInput = new InputNumber(document.querySelector('#person-input'), onChangedBillInputData)
    inputCustom = new InputCustom(document.querySelector('#custom-input'), onChangedBillInputData) 
    tipPerPersonOutput = document.querySelector('#total-tip-output')
    totalTipOutput = document.querySelector('#tip-per-person-output')


    inputTipsButtonsWithFixedPercent = [
        {
            value: 5,
            component: document.querySelector('#tip-5'),
        },
        {
            value: 10,
            component: document.querySelector('#tip-10'),
        },
        {
            value: 15,
            component: document.querySelector('#tip-15'),
        },
        {
            value: 25,
            component: document.querySelector('#tip-25'),
        },
        {
            value: 50,
            component: document.querySelector('#tip-50'),
        },
    ]

    inputTipsButtonsWithFixedPercent.forEach(tipButtonWithPercentItem => {
        tipButtonWithPercentItem.component.addEventListener('click', () => onTipsButtonWithPercentSelected(tipButtonWithPercentItem))
    })    
}

function onChangedBillInputData() {
    if (personInput.value === '0') {
        personInput.errorText = 'Can\'t be zero'

        //TODO what should be shown in output

        return
    } else {
        personInput.clearError()
    }

    if (!selectedTipButtonWithFixedPercent && inputCustom.value === 0) {
        return
    }

    let tipPercentValue

    if (selectedTipButtonWithFixedPercent) {
        tipPercentValue = selectedTipButtonWithFixedPercent.value
    } else {
        tipPercentValue = inputCustom.value
    }

    const tipTotal = billInput.value * tipPercentValue / 100
    const tipPerPerson = tipTotal / Number(personInput.value)

    tipPerPersonOutput.textContent = Math.round(tipPerPerson * 100) / 100
    totalTipOutput.textContent = Math.round(tipTotal * 100) / 100
}

function onTipsButtonWithPercentSelected(tipButtonWithPercent) {
    if (tipButtonWithPercent === selectedTipButtonWithFixedPercent?.component) {
        return
    }

    if (selectedTipButtonWithFixedPercent) {
        selectedTipButtonWithFixedPercent.component.classList.remove('selected')
    }

    //TODO remove styling for custom in an else

    selectedTipButtonWithFixedPercent = getTipButtonWithFixedPercentByPercentValue(tipButtonWithPercent.value)
    
    selectedTipButtonWithFixedPercent.component.classList.add('selected')
    
    onChangedBillInputData()
}

function getTipButtonWithFixedPercentByPercentValue(percentValue) {
    return inputTipsButtonsWithFixedPercent.find(item => item.value === percentValue)
}

function onResetButtonClicked() {
    tipPerPersonOutput.text = '0.00'
    tipTotalOutput.text = '0.00'
    //TODO complete it
}

class InputNumber {
    constructor(element, changeListener) {
        this.element = element
        this.input = element.getElementsByTagName('input')[0]
        this.errorSpan = element.querySelector('.input-input-error-container')
        
        this.input.addEventListener('change', changeListener)
        this.input.addEventListener('focus', () => this.element.classList.add('focused'))
        this.input.addEventListener('blur', () => this.element.classList.remove('focused'))
        
    }

    get value() {
        return this.input.value
    }

    set value(value) {
        this.input.value = value
    }

    set errorText(text) {
        this.errorSpan.textContent = text
        this.element.classList.add('error')
    }

    clearError() {
        this.element.classList.remove('error')
    }
}

class InputCustom {
    static SPAN_TEXT = 'Custom'

    constructor(element, changeListener) {
        this.element = element
        this.input = element.getElementsByTagName('input')[0]
        this.span = element.getElementsByTagName('span')[0]
        this.changeListener = changeListener

        this.element.addEventListener('click', (event) =>this.onClick(event)) 
        this.input.addEventListener('blur', (event) => this.onBlurInput(event))
        this.span.textContent = InputCustom.SPAN_TEXT
    }

    onClick() {
        this.element.classList.add('selected')
        this.input.focus()
    }

    onBlurInput() {
        this.element.classList.remove('selected')

        if (this.input.value === 0) {
            this.span.textContent = InputCustom.SPAN_TEXT
        } else {
            this.span.textContent = this.input.value
        }

        this.changeListener()
    }

    reset() {
        this.input.value = 0
        this.onBlurInput()
    }

    get value() {
        return this.input.value
    }
}
