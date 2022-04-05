/**
 * @author Yukitaka Maeda [yumaeda@gmail.com]
 */
import * as React from 'react'
import { timeoutAndRetryPromise } from '../utils/AsyncUtil'

const Root: React.FC<{}> = () => {
    const [googlePayStatus, setGooglePayStatus] = React.useState<string>('')
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
            if (response.paymentMethodPresent) {
                setGooglePayStatus('Visitor has one or more payment methods')
            } else {
                if (!response.result) {
                    setGooglePayStatus('Visitor is not able to provide payment information to the site')
                } else {
                    setGooglePayStatus('Visitor is able to provide payment information to the site')
                }   
            }
        }, () => {
            setGooglePayStatus('GooglePayFailed')
        })

    return (
        <div>
            <h1>Google Pay Checker</h1>
            <p>{googlePayStatus}</p>
        </div>
    )
}

export default Root
