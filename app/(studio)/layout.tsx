// The Studio gets its own root layout, so none of the site's styles, smooth
// scrolling or backdrop reach it.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>{children}</body>
        </html>
    );
}
