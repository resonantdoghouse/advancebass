export function Footer() {
    return (
        <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4 md:px-8">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built for bass players, by bass players.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Advance Bass</p>
                </div>
            </div>
        </footer>
    )
}
