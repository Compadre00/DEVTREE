export default function NotFoundView() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4 text-white">404 - Page Not Found</h1>
            <p className="text-lg mb-8 text-white">The page you are looking for does not exist.</p>
            <a href="/admin/profile" className="text-blue-500 hover:underline">Go back to home</a>
        </div>
    );
}