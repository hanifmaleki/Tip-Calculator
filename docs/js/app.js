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
    personInput = new InputNumber(document.querySelector('#person-input'), onChangedPersonInputData)
    inputCustom = new InputCustom(document.querySelector('#custom-input'), onChangedCustomInputData, onClickCustomInput)
    resetButton = new ResetButton(document.querySelector('#reset-button'), onResetButtonClicked)
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

function onChangedPersonInputData() {
    if (personInput.value === '0') {
        personInput.errorText = 'Can\'t be zero'

        //TODO what should be shown in output

        return
    } else {
        personInput.clearError()
        onChangedBillInputData()
    }
}

function onChangedBillInputData() {
    if (personInput.value === '0') {
        return
    }

    let tipPercentValue = getTipPercentValue()

    if (!tipPercentValue) {
        0
    }

    const tipTotal = billInput.value * tipPercentValue / 100
    const tipPerPerson = tipTotal / Number(personInput.value)

    tipPerPersonOutput.textContent = Math.round(tipPerPerson * 100) / 100
    totalTipOutput.textContent = Math.round(tipTotal * 100) / 100

    if (!isResetButtonDisabled()) {
        resetButton.enable()
    }
}

function onTipsButtonWithPercentSelected(tipButtonWithPercent) {
    if (tipButtonWithPercent === selectedTipButtonWithFixedPercent?.component) {
        return
    }

    inputCustom.reset()

    if (selectedTipButtonWithFixedPercent) {
        selectedTipButtonWithFixedPercent.component.classList.remove('selected')
    }

    selectedTipButtonWithFixedPercent = getTipButtonWithFixedPercentByPercentValue(tipButtonWithPercent.value)

    selectedTipButtonWithFixedPercent.component.classList.add('selected')

    onChangedBillInputData()
}

function onChangedCustomInputData() {
    onChangedBillInputData()
}

function onClickCustomInput() {
    if (selectedTipButtonWithFixedPercent) {
        selectedTipButtonWithFixedPercent.component.classList.remove('selected')
    }

    selectedTipButtonWithFixedPercent = null
}

function getTipButtonWithFixedPercentByPercentValue(percentValue) {
    return inputTipsButtonsWithFixedPercent.find(item => item.value === percentValue)
}

function isResetButtonDisabled() {
    console.log('isResetButtonDisabled')
    return !getTipPercentValue() && !personInput.value && !personInput.value
}

function onResetButtonClicked() {
    personInput.value = 0
    billInput.value = 0

    if (selectedTipButtonWithFixedPercent) {
        selectedTipButtonWithFixedPercent.component.classList.remove('selected')
        selectedTipButtonWithFixedPercent = null
    }

    inputCustom.reset()

    tipPerPersonOutput.textContent = '0.00'
    totalTipOutput.textContent = '0.00'
}

function getTipPercentValue() {
    if (selectedTipButtonWithFixedPercent) {
        return selectedTipButtonWithFixedPercent.value
    }

    if (inputCustom.value) {
        return inputCustom.value
    }

    return 0
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

    constructor(element, changeListener, clickListener) {
        this.element = element
        this.input = element.getElementsByTagName('input')[0]
        this.span = element.getElementsByTagName('span')[0]
        this.changeListener = changeListener
        this.clickListener = clickListener

        this.element.addEventListener('click', (event) => this.onClick(event))
        this.input.addEventListener('blur', (event) => this.onBlurInput(event))
        this.span.textContent = InputCustom.SPAN_TEXT
    }

    onClick() {
        this.element.classList.add('focused')
        this.input.focus()
        this.clickListener()
    }

    onBlurInput() {
        this.element.classList.remove('focused')

        if (this.input.value === '0') {
            this.span.textContent = InputCustom.SPAN_TEXT
            this.element.classList.remove('selected')
        } else {
            this.span.textContent = this.input.value
            this.element.classList.add('selected')
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

class ResetButton {
    constructor(element, clickListener) {
        this.element = element
        this.button = element.getElementsByTagName('button')[0]
        this.isDisabled = true
        this.clickListener = clickListener

        this.disable()
        this.button.addEventListener('click', event => this.onClick(event))
        this.button.addEventListener('mouseenter', event => this.onHover(event))
        this.button.addEventListener('mouseleave', this.element.classList.remove('hover'))
    }

    onHover(event) {
        if (!this.isDisabled) {
            this.element.classList.add('hover')
        }
    }

    onClick() {
        if (!this.isDisabled) {
            this.clickListener()
        }
    }

    enable() {
        this.isDisabled = false
        this.element.classList.remove('disabled')
    }

    disable() {
        this.isDisabled = true
        this.element.classList.add('disabled')
        this.element.classList.remove('hover')
    }
}
