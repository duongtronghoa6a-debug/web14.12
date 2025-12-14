export default function Footer() {
    return (
        <footer className="w-full bg-background border-t py-6 mt-12">
            <div className="w-full max-w-[1200px] mx-auto px-4 text-center text-muted-foreground">
                <p className="font-semibold text-primary">Movie Info Project</p>
                <p className="text-sm mt-1">Student: <span className="text-foreground font-mono">23120127</span></p>
                <p className="text-xs mt-2 opacity-70">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
        </footer>
    );
}
