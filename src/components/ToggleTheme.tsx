import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { useEffect, useState } from 'react'

const ToggleTheme = () => {
    const [theme, setTheme] = useState<string | null>(null)

    useEffect(() => {
        // Detect OS
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
            document.body.classList.add('bg-dark')

            localStorage.setItem('theme', 'dark')
            return
        }

        document.documentElement.classList.remove('dark')
        document.body.classList.remove('bg-dark')

        localStorage.removeItem('theme')
    }, [setTheme, theme])

    // Initial Page Load.
    useEffect(() => {
        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark')
            document.body.classList.add('bg-dark')
            setTheme('dark')
        } else {
            document.documentElement.classList.remove('dark')
            document.body.classList.remove('bg-dark')

            setTheme(null)
        }
    }, [])

    return (
        <div className="">
            {theme === 'dark' ? (
                <MoonIcon
                    className="h-8 w-8 text-yellow-500 hover:cursor-pointer"
                    onClick={() => setTheme(null)}
                />
            ) : (
                <SunIcon
                    className="h-8 w-8 text-gray-500 hover:cursor-pointer"
                    onClick={() => setTheme('dark')}
                />
            )}
        </div>
    )
}

export default ToggleTheme
