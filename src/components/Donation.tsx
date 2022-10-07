import { faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ClipboardCopyIcon } from '@heroicons/react/solid'
import copy from 'copy-to-clipboard'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from './Modal'

const donationWalletAddress = '0xb5aaF09F97aF2BECcE49f9792Dbb0Ed8F8618e13'

const Donation = () => {
    const [isOpen, setIsOpen] = useState(false)
    const formattedAddress = useMemo(() => {
        const split = donationWalletAddress.split('')
        const firstPart = split.slice(0, 4).join('')
        const secondPart = split.slice(split.length - 4, split.length).join('')

        return `${firstPart}....${secondPart}`
    }, [])

    const handleCopy = () => {
        copy(donationWalletAddress)
        toast.success('Donation Address Copied!')
    }
    return (
        <>
            <button className="text-blue" onClick={() => setIsOpen(true)}>
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
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                </svg>
            </button>

            <Modal
                isOpen={isOpen}
                title={'Donation to Support!'}
                callBack={() => {
                    setIsOpen(false)
                }}
            >
                <div>
                    <div className="flex flex-col justify-center items-center w-full">
                        <div className="font-extrabold text-2xl 2xl:text-3xl ">
                            {formattedAddress}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="hover:cursor-pointer py-4 text-blue"
                        >
                            <ClipboardCopyIcon className="h-12 w-12 text-blue" />
                        </button>
                    </div>

                    <div className="text-center text-xl">
                        Made by DEFI Builders
                    </div>
                    <div className="flex justify-center space-x-10 w-full pt-5">
                        <div>
                            <a
                                href="https://twitter.com/BuildersDefi"
                                className="twitter social"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon
                                    icon={faTwitter}
                                    size="2x"
                                    className="text-blue"
                                />
                            </a>
                        </div>
                        <div>
                            <a
                                href="https://t.me/defi_builders"
                                target="_blank"
                                className="twitter social"
                                rel="noreferrer"
                            >
                                <FontAwesomeIcon
                                    icon={faTelegram}
                                    size="2x"
                                    className="text-blue"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default Donation
