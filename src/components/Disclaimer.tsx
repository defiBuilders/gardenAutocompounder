import { useState } from 'react'
import Modal from './Modal'

const Disclaimer = () => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <>
            <button className="text-red-500" onClick={() => setIsOpen(true)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                </svg>
            </button>

            <Modal
                isOpen={isOpen}
                title={'Disclaimer'}
                callBack={() => {
                    setIsOpen(false)
                }}
            >
                <div className="leading-10">
                    This project has been built by a 3rd party independent group
                    - Defi Builders. In order to obtain the correct version
                    please visit our telegram found at farmershouse.finance. Any
                    other copies or modifications do not belong to us and are
                    your responsibility as a user. We have no intention of
                    mistreating this service and are truly committed to
                    providing the best value to our community. We are not
                    responsible for any of your losses so please continue at
                    your own risk. By visiting this website and using the tool,
                    you agree to the risks.
                </div>
            </Modal>
        </>
    )
}

export default Disclaimer
