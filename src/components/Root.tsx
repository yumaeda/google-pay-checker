/**
 * @author Yukitaka Maeda [yumaeda@gmail.com]
 */
import * as React from 'react'
import { timeoutAndRetryPromise } from '../utils/AsyncUtil'

const Root: React.FC<{}> = () => {
    const allowedCardNetworks = [ 'AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'MIR', 'VISA' ]
    const allowedCardAuthMethods = [ 'PAN_ONLY', 'CRYPTOGRAM_3DS' ]
    const baseCardPaymentMethod = {
        type: 'CARD',
        parameters: {
            allowedAuthMethods: allowedCardAuthMethods,
            allowedCardNetworks: allowedCardNetworks
        }
    }

    const isReadyToPayRequest: any = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [ baseCardPaymentMethod ],
        existingPaymentMethodRequired: true
    }

    const paymentsClient = new google.payments.api.PaymentsClient({
        environment: 'PRODUCTION'
    })

    timeoutAndRetryPromise(paymentsClient.isReadyToPay(isReadyToPayRequest), 1000, 5)
        .then((response: any) => {
            alert(JSON.stringify(response))
            if (response.result && response.paymentMethodPresent) {
                alert('GooglePayOk')
            } else if (!response.result) {
                alert('GooglePayNotPresent')
            } else {
                alert('GooglePayNoCard')
            }
        }, () => {
            alert('GooglePayFailed')
        })

    return (
        <div>
            <h1>Google Pay Checker</h1>
        </div>
    )
}

export default Root
