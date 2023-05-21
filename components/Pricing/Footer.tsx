/* eslint-disable @next/next/no-img-element */
import { Box } from "@mantine/core";

const Footer = () => {
    return (
        <Box>
            <div>
                <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
                    Brought to you by
                </p>
                <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
                    <div className="flex items-center justify-start">
                    <a href="https://nextjs.org" aria-label="Next.js Link">
                        <img
                        src="/nextjs.svg"
                        alt="Next.js Logo"
                        className="h-12 text-white"
                        />
                    </a>
                    </div>
                    <div className="flex items-center justify-start">
                    <a href="https://vercel.com" aria-label="Vercel.com Link">
                        <img
                        src="/vercel.svg"
                        alt="Vercel.com Logo"
                        className="h-6 text-white"
                        />
                    </a>
                    </div>
                    <div className="flex items-center justify-start">
                    <a href="https://stripe.com" aria-label="stripe.com Link">
                        <img
                        src="/stripe.svg"
                        alt="stripe.com Logo"
                        className="h-12 text-white"
                        />
                    </a>
                    </div>
                    <div className="flex items-center justify-start">
                    <a href="https://supabase.io" aria-label="supabase.io Link">
                        <img
                        src="/supabase.svg"
                        alt="supabase.io Logo"
                        className="h-10 text-white"
                        />
                    </a>
                    </div>
                    <div className="flex items-center justify-start">
                    <a href="https://github.com" aria-label="github.com Link">
                        <img
                        src="/github.svg"
                        alt="github.com Logo"
                        className="h-8 text-white"
                        />
                    </a>
                    </div>
                </div>
                </div>
        </Box>
    )
}

export default Footer;