import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Disclaimer from './components/Disclaimer'
import Donation from './components/Donation'
import ToggleTheme from './components/ToggleTheme'
import Autocompounder from './pages/Autocompounder/Autocompounder'

export default function App() {
    return (
        <div className="">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
            />
            <div className="flex justify-center">
                <div className="text-4xl font-bold py-8 text-black dark:text-white text-center">
                    Garden Autocompounder
                </div>
                <div className="flex justify-center items-center space-x-4 pl-4">
                    <Disclaimer />
                    <Donation />
                    <ToggleTheme />
                </div>
            </div>

            <Autocompounder />
        </div>
    )
}
